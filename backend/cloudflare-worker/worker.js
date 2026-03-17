const ALIYUN_ENDPOINT = "https://dypnsapi.aliyuncs.com/";
const ALIYUN_VERSION = "2017-05-25";

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (request.method === "OPTIONS") {
      return withCors(new Response(null, { status: 204 }));
    }

    if (request.method === "POST" && url.pathname === "/send-code") {
      return withCors(await handleSendCode(request, env));
    }

    if (request.method === "POST" && url.pathname === "/verify-code") {
      return withCors(await handleVerifyCode(request, env));
    }

    return withCors(json({ error: "Not found" }, 404));
  }
};

async function handleSendCode(request, env) {
  const body = await readJson(request);
  const phone = normalizePhone(body.phone);
  if (!isValidPhone(phone)) {
    return json({ error: "手机号格式不正确" }, 400);
  }

  if (env.SMS_PROVIDER === "console") {
    return json({ success: true, message: "联调模式验证码已发送（控制台模式）" });
  }

  const required = [
    "ALIYUN_ACCESS_KEY_ID",
    "ALIYUN_ACCESS_KEY_SECRET",
    "ALIYUN_SMS_SIGN_NAME",
    "ALIYUN_SMS_TEMPLATE_CODE"
  ];
  const missing = required.filter((key) => !env[key]);
  if (missing.length) {
    return json({ error: `缺少环境变量：${missing.join(", ")}` }, 500);
  }

  const templateCodeKey = env.ALIYUN_SMS_TEMPLATE_CODE_KEY || "code";
  const templateMinKey = env.ALIYUN_SMS_TEMPLATE_MIN_KEY || "min";
  const validSeconds = normalizeInteger(env.ALIYUN_SMS_VALID_TIME, 300);
  const intervalSeconds = normalizeInteger(env.ALIYUN_SMS_INTERVAL, 60);
  const codeLength = normalizeInteger(env.ALIYUN_SMS_CODE_LENGTH, 6);
  const codeType = normalizeInteger(env.ALIYUN_SMS_CODE_TYPE, 1);
  const duplicatePolicy = normalizeInteger(env.ALIYUN_SMS_DUPLICATE_POLICY, 1);
  const schemeName = String(env.ALIYUN_SMS_SCHEME_NAME || "").trim();
  const validMinutes = String(Math.max(1, Math.round(validSeconds / 60)));
  const outId = createOutId(phone);
  const templateParam = JSON.stringify({
    [templateCodeKey]: "##code##",
    [templateMinKey]: validMinutes
  });

  const params = {
    Action: "SendSmsVerifyCode",
    PhoneNumber: phone,
    SignName: env.ALIYUN_SMS_SIGN_NAME,
    TemplateCode: env.ALIYUN_SMS_TEMPLATE_CODE,
    TemplateParam: templateParam,
    CodeLength: String(codeLength),
    ValidTime: String(validSeconds),
    Interval: String(intervalSeconds),
    DuplicatePolicy: String(duplicatePolicy),
    CodeType: String(codeType),
    ReturnVerifyCode: "false",
    OutId: outId,
    CountryCode: "86",
    AutoRetry: "1"
  };
  if (schemeName) params.SchemeName = schemeName;

  try {
    const result = await callAliyunRpc(env, params);
    if (!result?.Success || result?.Code !== "OK") {
      return json({ error: result?.Message || "阿里云验证码发送失败" }, 502);
    }
    return json({
      success: true,
      message: "验证码已发送",
      requestId: result?.RequestId || "",
      bizId: result?.Model?.BizId || "",
      outId
    });
  } catch (error) {
    return json({ error: error.message || "验证码发送失败" }, 502);
  }
}

async function handleVerifyCode(request, env) {
  const body = await readJson(request);
  const phone = normalizePhone(body.phone);
  const code = String(body.code || "").trim();
  if (!isValidPhone(phone) || !/^[A-Za-z0-9]{4,8}$/.test(code)) {
    return json({ error: "手机号或验证码格式错误" }, 400);
  }

  if (env.SMS_PROVIDER === "console") {
    if (code !== "123456") {
      return json({ error: "验证码错误" }, 400);
    }
    return json({
      success: true,
      token: await createSessionToken(env, phone),
      user: { phone }
    });
  }

  const required = [
    "ALIYUN_ACCESS_KEY_ID",
    "ALIYUN_ACCESS_KEY_SECRET"
  ];
  const missing = required.filter((key) => !env[key]);
  if (missing.length) {
    return json({ error: `缺少环境变量：${missing.join(", ")}` }, 500);
  }

  const params = {
    Action: "CheckSmsVerifyCode",
    PhoneNumber: phone,
    VerifyCode: code,
    CountryCode: "86",
    CaseAuthPolicy: "1"
  };
  const schemeName = String(env.ALIYUN_SMS_SCHEME_NAME || "").trim();
  if (schemeName) params.SchemeName = schemeName;

  try {
    const result = await callAliyunRpc(env, params);
    if (!result?.Success || result?.Code !== "OK") {
      return json({ error: result?.Message || "阿里云验证码校验失败" }, 502);
    }
    if (result?.Model?.VerifyResult !== "PASS") {
      return json({ error: "验证码错误或已失效" }, 400);
    }
    return json({
      success: true,
      token: await createSessionToken(env, phone),
      user: { phone }
    });
  } catch (error) {
    return json({ error: error.message || "验证码校验失败" }, 502);
  }
}

async function callAliyunRpc(env, actionParams) {
  const params = {
    AccessKeyId: env.ALIYUN_ACCESS_KEY_ID,
    Format: "JSON",
    SignatureMethod: "HMAC-SHA1",
    SignatureVersion: "1.0",
    SignatureNonce: crypto.randomUUID(),
    Timestamp: new Date().toISOString().replace(/\.\d{3}Z$/, "Z"),
    Version: ALIYUN_VERSION,
    ...actionParams
  };

  const canonicalized = canonicalize(params);
  const stringToSign = `POST&${percentEncode("/")}&${percentEncode(canonicalized)}`;
  const signature = await sign(env.ALIYUN_ACCESS_KEY_SECRET, stringToSign);
  const signedParams = new URLSearchParams({ ...params, Signature: signature });
  const response = await fetch(ALIYUN_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: signedParams.toString()
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data?.Message || data?.message || `阿里云接口请求失败（HTTP ${response.status}）`);
  }
  return data;
}

function canonicalize(params) {
  return Object.keys(params)
    .sort()
    .map((key) => `${percentEncode(key)}=${percentEncode(String(params[key]))}`)
    .join("&");
}

function percentEncode(value) {
  return encodeURIComponent(value)
    .replace(/\+/g, "%20")
    .replace(/\*/g, "%2A")
    .replace(/%7E/g, "~");
}

async function sign(accessKeySecret, stringToSign) {
  const key = new TextEncoder().encode(`${accessKeySecret}&`);
  const message = new TextEncoder().encode(stringToSign);
  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    key,
    { name: "HMAC", hash: "SHA-1" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign("HMAC", cryptoKey, message);
  return base64Encode(signature);
}

function base64Encode(buffer) {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return btoa(binary);
}

async function createSessionToken(env, phone) {
  const secret = env.SESSION_SECRET || "dev-secret";
  const issuedAt = new Date().toISOString();
  const payload = `${phone}.${issuedAt}.${secret}`;
  const data = new TextEncoder().encode(payload);
  const digest = await crypto.subtle.digest("SHA-256", data);
  const hash = Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
  return `${phone}.${hash.slice(0, 32)}`;
}

function createOutId(phone) {
  return `majornavi-${phone}-${Date.now()}`;
}

function normalizeInteger(value, fallback) {
  const parsed = Number.parseInt(String(value || ""), 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function normalizePhone(phone) {
  return String(phone || "").replace(/\D/g, "").slice(0, 11);
}

function isValidPhone(phone) {
  return /^1\d{10}$/.test(phone);
}

async function readJson(request) {
  try {
    return await request.json();
  } catch {
    return {};
  }
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8"
    }
  });
}

function withCors(response) {
  const headers = new Headers(response.headers);
  headers.set("Access-Control-Allow-Origin", "*");
  headers.set("Access-Control-Allow-Methods", "POST, OPTIONS");
  headers.set("Access-Control-Allow-Headers", "Content-Type");
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers
  });
}

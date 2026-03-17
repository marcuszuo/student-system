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

  const code = createCode();
  const expiresAt = Date.now() + 5 * 60 * 1000;
  await env.AUTH_CODES.put(`code:${phone}`, JSON.stringify({ code, expiresAt }), {
    expirationTtl: 5 * 60
  });

  await sendSmsWithProvider(env, phone, code);
  return json({ success: true, message: "验证码已发送" });
}

async function handleVerifyCode(request, env) {
  const body = await readJson(request);
  const phone = normalizePhone(body.phone);
  const code = String(body.code || "").trim();
  if (!isValidPhone(phone) || !/^\d{4,6}$/.test(code)) {
    return json({ error: "手机号或验证码格式错误" }, 400);
  }

  const raw = await env.AUTH_CODES.get(`code:${phone}`);
  if (!raw) {
    return json({ error: "验证码已失效，请重新获取" }, 400);
  }

  const saved = JSON.parse(raw);
  if (Date.now() > Number(saved.expiresAt || 0)) {
    await env.AUTH_CODES.delete(`code:${phone}`);
    return json({ error: "验证码已过期，请重新获取" }, 400);
  }

  if (saved.code !== code) {
    return json({ error: "验证码错误" }, 400);
  }

  await env.AUTH_CODES.delete(`code:${phone}`);
  return json({
    success: true,
    token: await createSessionToken(env, phone),
    user: { phone }
  });
}

async function sendSmsWithProvider(env, phone, code) {
  if (env.SMS_PROVIDER === "console") {
    console.log(`Mock SMS to ${phone}: ${code}`);
    return;
  }

  throw new Error(
    "尚未配置真实短信服务商。请在 worker.js 中接入你的短信供应商，或先把 SMS_PROVIDER 设为 console 做联调。"
  );
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

function createCode() {
  return String(Math.floor(100000 + Math.random() * 900000));
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

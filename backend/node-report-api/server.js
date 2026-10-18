const http = require("http");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const PORT = Number(process.env.PORT || 8787);
const DATA_DIR = process.env.DATA_DIR || path.join(__dirname, "data");
const DATA_FILE = process.env.DATA_FILE || path.join(DATA_DIR, "reports.json");
const GAOKAO_QUERY_FILE = process.env.GAOKAO_QUERY_FILE || path.join(DATA_DIR, "gaokao_queries.json");
const ADMIN_TOKEN = String(process.env.ADMIN_TOKEN || "").trim();
const INGEST_KEY = String(process.env.INGEST_KEY || "").trim();
const ALLOWED_ORIGINS = String(process.env.ALLOWED_ORIGINS || "")
  .split(",")
  .map((item) => item.trim())
  .filter(Boolean);

ensureStorage();
const access = require('./access')({file:path.join(DATA_DIR,'access-store.json'),adminPassword:process.env.ADMIN_LOGIN_PASSWORD,adminHash:process.env.ADMIN_PASSWORD_HASH,adminUsername:process.env.ADMIN_USERNAME || 'admin'});
const attempts = new Map();
function bearer(req) {return String(req.headers.authorization || '').replace(/^Bearer /i,'');}

const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url, `http://${req.headers.host || "localhost"}`);

    if (req.method === "OPTIONS") {
      return respondJson(res, 204, null, corsHeaders(req));
    }

    if (url.pathname === "/healthz" && req.method === "GET") {
      return respondJson(res, 200, { ok: true, time: new Date().toISOString() }, corsHeaders(req));
    }

    if (url.pathname === '/api/auth/capabilities' && req.method === 'GET') return respondJson(res,200,{accounts:access.configured,version:1},corsHeaders(req));
    if (url.pathname === '/api/auth/login' && req.method === 'POST') {
      const payload = await readBody(req), key = req.socket.remoteAddress + ':' + String(payload.username || '').toLowerCase().slice(0,80);
      const previous = attempts.get(key), limit = previous && previous.until>Date.now() ? previous : {count:0,until:Date.now()+15*60000};
      limit.count++;attempts.set(key,limit);if(attempts.size>5000)attempts.delete(attempts.keys().next().value);
      if(limit.count>10) return respondJson(res,429,{error:'尝试次数过多，请15分钟后重试'},corsHeaders(req));
      const result=access.login(payload.username,payload.password);attempts.delete(key);
      return respondJson(res,200,result,corsHeaders(req));
    }
    if (url.pathname === '/api/auth/session' && req.method === 'GET') return respondJson(res,200,access.session(bearer(req)),corsHeaders(req));
    if (url.pathname === '/api/auth/logout' && req.method === 'POST') {access.logout(bearer(req));return respondJson(res,200,{ok:true},corsHeaders(req));}
    if (url.pathname === '/api/auth/my-report' && req.method === 'GET') return respondJson(res,200,{item:access.report(bearer(req))},corsHeaders(req));
    if (url.pathname === '/api/admin/accounts') {
      if (!requireAdmin(req)) return respondJson(res,403,{error:'Forbidden'},corsHeaders(req));
      if(req.method==='GET')return respondJson(res,200,{items:access.list()},corsHeaders(req));
      if(req.method==='POST')return respondJson(res,200,{items:access.create(await readBody(req))},corsHeaders(req));
    }
    const accountMatch=url.pathname.match(/^\/api\/admin\/accounts\/([^/]+)$/);
    if(accountMatch && req.method==='PATCH') {
      if(!requireAdmin(req))return respondJson(res,403,{error:'Forbidden'},corsHeaders(req));
      return respondJson(res,200,{item:access.update(accountMatch[1],await readBody(req))},corsHeaders(req));
    }
    if (url.pathname === "/api/reports" && req.method === "POST") {
      return await handleCreateReport(req, res);
    }

    if (url.pathname === "/api/reports" && req.method === "GET") {
      return await handleListReports(req, res, url);
    }

    if (url.pathname === "/api/reports" && req.method === "DELETE") {
      return await handleBulkDelete(req, res, url);
    }

    if (url.pathname === "/api/gaokao-queries" && req.method === "POST") {
      return await handleCreateGaokaoQuery(req, res);
    }

    if (url.pathname === "/api/gaokao-queries" && req.method === "GET") {
      return await handleListGaokaoQueries(req, res, url);
    }

    const reportMatch = url.pathname.match(/^\/api\/reports\/([^/]+)$/);
    if (reportMatch && req.method === "GET") {
      return await handleGetReport(req, res, reportMatch[1]);
    }
    if (reportMatch && req.method === "DELETE") {
      return await handleDeleteReport(req, res, reportMatch[1]);
    }
    if (reportMatch && req.method === "PATCH") {
      return await handleUpdateReport(req, res, reportMatch[1]);
    }

    return respondJson(res, 404, { error: "Not found" }, corsHeaders(req));
  } catch (error) {
    console.error(error);
    return respondJson(res, error.status || 500, { error: error.status ? error.message : "Server error" }, corsHeaders(req));
  }
});

server.listen(PORT, () => {
  console.log(`majornavi-report-api listening on :${PORT}`);
});

function corsHeaders(req) {
  const origin = String(req.headers.origin || "").trim();
  const allowOrigin = ALLOWED_ORIGINS.includes(origin)
    ? origin
    : (ALLOWED_ORIGINS[0] || "*");

  return {
    "Access-Control-Allow-Origin": allowOrigin,
    "Access-Control-Allow-Methods": "GET,POST,PATCH,DELETE,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type,Authorization,x-admin-token,x-report-ingest-key",
    "Cache-Control": "no-store",
    "Content-Type": "application/json; charset=utf-8"
  };
}

function respondJson(res, status, payload, extraHeaders = {}) {
  const body = payload === null ? "" : JSON.stringify(payload);
  res.writeHead(status, extraHeaders);
  res.end(body);
}

function ensureStorage() {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, "[]\n", "utf8");
  }
  if (!fs.existsSync(GAOKAO_QUERY_FILE)) {
    fs.writeFileSync(GAOKAO_QUERY_FILE, "[]\n", "utf8");
  }
}

function readReports() {
  ensureStorage();
  try {
    const raw = fs.readFileSync(DATA_FILE, "utf8");
    const parsed = JSON.parse(raw || "[]");
    const base = Array.isArray(parsed) ? parsed : [];
    const ids = new Set(base.map(x=>x.id));
    return [...base,...access.reports().filter(x=>!ids.has(x.id))];
  } catch {
    return [];
  }
}

function writeReports(items) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(items, null, 2), "utf8");
}

function readGaokaoQueries() {
  ensureStorage();
  try {
    const raw = fs.readFileSync(GAOKAO_QUERY_FILE, "utf8");
    const parsed = JSON.parse(raw || "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeGaokaoQueries(items) {
  fs.writeFileSync(GAOKAO_QUERY_FILE, JSON.stringify(items, null, 2), "utf8");
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let raw = "";
    req.on("data", (chunk) => {
      raw += chunk;
      if (raw.length > 2 * 1024 * 1024) {
        reject(new Error("Payload too large"));
        req.destroy();
      }
    });
    req.on("end", () => {
      try {
        resolve(JSON.parse(raw || "{}"));
      } catch {
        reject(new Error("Invalid JSON body"));
      }
    });
    req.on("error", reject);
  });
}

function requireAdmin(req) {
  if (access.configured) return Boolean(access.admin(bearer(req) || String(req.headers["x-admin-token"] || "")));
  if (!ADMIN_TOKEN) {
    throw new Error("ADMIN_TOKEN is not configured");
  }
  return String(req.headers["x-admin-token"] || "").trim() === ADMIN_TOKEN;
}

function requireIngest(req) {
  if (!INGEST_KEY) return true;
  return String(req.headers["x-report-ingest-key"] || "").trim() === INGEST_KEY;
}

function normalizeDateValue(value, boundary = "start") {
  const text = String(value || "").trim();
  if (!text) return null;
  if (/^\d{4}-\d{2}-\d{2}$/.test(text)) {
    const suffix = boundary === "end" ? "T23:59:59.999Z" : "T00:00:00.000Z";
    return new Date(`${text}${suffix}`).toISOString();
  }
  const date = new Date(text);
  if (Number.isNaN(date.getTime())) return null;
  return date.toISOString();
}

function isSmokeTestReport(report) {
  const id = String(report.id || "").toLowerCase();
  const topMajor = String(report.recommendations?.[0]?.name || "").toLowerCase();
  const topDirection = String(report.directions?.[0]?.label || "").toLowerCase();
  return id.includes("smoke") || topMajor.includes("smoke") || topDirection.includes("smoke");
}

async function handleCreateReport(req, res) {
  if (!access.configured && !requireIngest(req)) {
    return respondJson(res, 403, { error: "Forbidden" }, corsHeaders(req));
  }

  let payload = await readBody(req);
  if (access.configured && !['assessment_session','assessment_feedback'].includes(payload.recordType)) {
    const existing=readReports().find(x=>x.id===payload.id), user=access.session(bearer(req));
    if(existing && existing.accessAccount?.id!==user.account?.id) return respondJson(res,409,{error:'报告编号冲突'},corsHeaders(req));
  }
  if (access.configured) payload = ["assessment_session","assessment_feedback"].includes(payload.recordType) ? access.record(bearer(req),payload) : access.commit(bearer(req),payload);
  const id = String(payload.id || "").trim() || crypto.randomUUID();
  const submittedAt = String(payload.submittedAt || new Date().toISOString());

  const reports = readReports();
  const normalized = {
    ...payload,
    adminMeta: reports.find(item=>item.id===id)?.adminMeta,
    id,
    submittedAt
  };
  const next = [normalized, ...reports.filter((item) => item.id !== id)].slice(0, 1000);
  writeReports(next);

  return respondJson(res, 200, { ok: true, id }, corsHeaders(req));
}

async function handleCreateGaokaoQuery(req, res) {
  if (!requireIngest(req)) {
    return respondJson(res, 403, { error: "Forbidden" }, corsHeaders(req));
  }

  const payload = await readBody(req);
  const id = String(payload.id || "").trim() || crypto.randomUUID();
  const submittedAt = String(payload.submittedAt || new Date().toISOString());

  const queries = readGaokaoQueries();
  const normalized = {
    ...payload,
    id,
    submittedAt,
    recordType: "gaokao_query"
  };
  const next = [normalized, ...queries.filter((item) => item.id !== id)].slice(0, 3000);
  writeGaokaoQueries(next);

  return respondJson(res, 200, { ok: true, id }, corsHeaders(req));
}

function handleListReports(req, res, url) {
  if (!requireAdmin(req)) {
    return respondJson(res, 403, { error: "Forbidden" }, corsHeaders(req));
  }

  const limit = Math.min(Number(url.searchParams.get("limit") || 50), 200);
  const dateFrom = normalizeDateValue(url.searchParams.get("date_from"), "start");
  const dateTo = normalizeDateValue(url.searchParams.get("date_to"), "end");
  const items = readReports()
    .filter((report) => {
      const submittedAt = normalizeDateValue(report.submittedAt);
      if (!submittedAt) return true;
      if (dateFrom && submittedAt < dateFrom) return false;
      if (dateTo && submittedAt > dateTo) return false;
      return true;
    })
    .sort((a, b) => String(b.submittedAt || "").localeCompare(String(a.submittedAt || "")))
    .slice(0, limit);

  return respondJson(res, 200, { items }, corsHeaders(req));
}

function handleGetReport(req, res, id) {
  if (!requireAdmin(req)) {
    return respondJson(res, 403, { error: "Forbidden" }, corsHeaders(req));
  }

  const item = readReports().find((report) => report.id === id);
  if (!item) {
    return respondJson(res, 404, { error: "Not found" }, corsHeaders(req));
  }

  return respondJson(res, 200, { item }, corsHeaders(req));
}

function handleListGaokaoQueries(req, res, url) {
  if (!requireAdmin(req)) {
    return respondJson(res, 403, { error: "Forbidden" }, corsHeaders(req));
  }

  const limit = Math.min(Number(url.searchParams.get("limit") || 50), 300);
  const dateFrom = normalizeDateValue(url.searchParams.get("date_from"), "start");
  const dateTo = normalizeDateValue(url.searchParams.get("date_to"), "end");
  const province = String(url.searchParams.get("province") || "").trim();
  const track = String(url.searchParams.get("track") || "").trim();

  const items = readGaokaoQueries()
    .filter((item) => {
      const submittedAt = normalizeDateValue(item.submittedAt);
      if (dateFrom && submittedAt && submittedAt < dateFrom) return false;
      if (dateTo && submittedAt && submittedAt > dateTo) return false;
      if (province && String(item.provinceCode || "") !== province) return false;
      if (track && String(item.trackCode || "") !== track) return false;
      return true;
    })
    .sort((a, b) => String(b.submittedAt || "").localeCompare(String(a.submittedAt || "")))
    .slice(0, limit);

  return respondJson(res, 200, { items }, corsHeaders(req));
}

function handleDeleteReport(req, res, id) {
  if (!requireAdmin(req)) {
    return respondJson(res, 403, { error: "Forbidden" }, corsHeaders(req));
  }

  const reports = readReports();
  const next = reports.filter((report) => report.id !== id);
  if (next.length === reports.length) {
    return respondJson(res, 404, { error: "Not found" }, corsHeaders(req));
  }
  access.eraseReport(id);
  writeReports(next);
  return respondJson(res, 200, { ok: true, id }, corsHeaders(req));
}

async function handleUpdateReport(req, res, id) {
  if (!requireAdmin(req)) {
    return respondJson(res, 403, { error: "Forbidden" }, corsHeaders(req));
  }

  const payload = await readBody(req);
  const adminNote = String(payload.adminNote || "").trim();
  const allowedStatuses = new Set(["new", "pending", "contacted", "high_intent"]);
  const adminStatusRaw = String(payload.adminStatus || "").trim();
  const adminStatus = allowedStatuses.has(adminStatusRaw) ? adminStatusRaw : "new";
  const reports = readReports();
  const index = reports.findIndex((report) => report.id === id);
  if (index === -1) {
    return respondJson(res, 404, { error: "Not found" }, corsHeaders(req));
  }

  const current = reports[index];
  const nextItem = {
    ...current,
    adminMeta: {
      ...(current.adminMeta || {}),
      note: adminNote,
      status: adminStatus,
      updatedAt: new Date().toISOString()
    }
  };
  reports[index] = nextItem;
  writeReports(reports);
  return respondJson(res, 200, { ok: true, item: nextItem }, corsHeaders(req));
}

function handleBulkDelete(req, res, url) {
  if (!requireAdmin(req)) {
    return respondJson(res, 403, { error: "Forbidden" }, corsHeaders(req));
  }

  const scope = String(url.searchParams.get("scope") || "").trim();
  if (scope !== "smoke_test") {
    return respondJson(res, 400, { error: "Unsupported delete scope" }, corsHeaders(req));
  }

  const reports = readReports();
  const kept = reports.filter((report) => !isSmokeTestReport(report));
  const deletedCount = reports.length - kept.length;
  reports.filter(isSmokeTestReport).forEach(item=>access.eraseReport(item.id));
  writeReports(kept);
  return respondJson(res, 200, { ok: true, deletedCount }, corsHeaders(req));
}

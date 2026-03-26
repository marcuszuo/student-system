const http = require("http");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const PORT = Number(process.env.PORT || 8787);
const DATA_DIR = process.env.DATA_DIR || path.join(__dirname, "data");
const DATA_FILE = process.env.DATA_FILE || path.join(DATA_DIR, "reports.json");
const ADMIN_TOKEN = String(process.env.ADMIN_TOKEN || "").trim();
const INGEST_KEY = String(process.env.INGEST_KEY || "").trim();
const ALLOWED_ORIGINS = String(process.env.ALLOWED_ORIGINS || "")
  .split(",")
  .map((item) => item.trim())
  .filter(Boolean);

ensureStorage();

const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url, `http://${req.headers.host || "localhost"}`);

    if (req.method === "OPTIONS") {
      return respondJson(res, 204, null, corsHeaders(req));
    }

    if (url.pathname === "/healthz" && req.method === "GET") {
      return respondJson(res, 200, { ok: true, time: new Date().toISOString() }, corsHeaders(req));
    }

    if (url.pathname === "/api/reports" && req.method === "POST") {
      return handleCreateReport(req, res);
    }

    if (url.pathname === "/api/reports" && req.method === "GET") {
      return handleListReports(req, res, url);
    }

    if (url.pathname === "/api/reports" && req.method === "DELETE") {
      return handleBulkDelete(req, res, url);
    }

    const reportMatch = url.pathname.match(/^\/api\/reports\/([^/]+)$/);
    if (reportMatch && req.method === "GET") {
      return handleGetReport(req, res, reportMatch[1]);
    }
    if (reportMatch && req.method === "DELETE") {
      return handleDeleteReport(req, res, reportMatch[1]);
    }

    return respondJson(res, 404, { error: "Not found" }, corsHeaders(req));
  } catch (error) {
    console.error(error);
    return respondJson(res, 500, { error: error.message || "Server error" }, corsHeaders(req));
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
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type,x-admin-token,x-report-ingest-key",
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
}

function readReports() {
  ensureStorage();
  try {
    const raw = fs.readFileSync(DATA_FILE, "utf8");
    const parsed = JSON.parse(raw || "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeReports(items) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(items, null, 2), "utf8");
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
  if (!requireIngest(req)) {
    return respondJson(res, 403, { error: "Forbidden" }, corsHeaders(req));
  }

  const payload = await readBody(req);
  const id = String(payload.id || "").trim() || crypto.randomUUID();
  const submittedAt = String(payload.submittedAt || new Date().toISOString());

  const reports = readReports();
  const normalized = {
    ...payload,
    id,
    submittedAt
  };
  const next = [normalized, ...reports.filter((item) => item.id !== id)].slice(0, 1000);
  writeReports(next);

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

function handleDeleteReport(req, res, id) {
  if (!requireAdmin(req)) {
    return respondJson(res, 403, { error: "Forbidden" }, corsHeaders(req));
  }

  const reports = readReports();
  const next = reports.filter((report) => report.id !== id);
  if (next.length === reports.length) {
    return respondJson(res, 404, { error: "Not found" }, corsHeaders(req));
  }
  writeReports(next);
  return respondJson(res, 200, { ok: true, id }, corsHeaders(req));
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
  writeReports(kept);
  return respondJson(res, 200, { ok: true, deletedCount }, corsHeaders(req));
}

export default {
  async fetch(request, env) {
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders(request, env) });
    }

    const url = new URL(request.url);

    try {
      if (url.pathname === "/api/reports" && request.method === "POST") {
        return await handleCreateReport(request, env);
      }
      if (url.pathname === "/api/reports" && request.method === "GET") {
        return await handleListReports(request, env);
      }
      const reportMatch = url.pathname.match(/^\/api\/reports\/([^/]+)$/);
      if (reportMatch && request.method === "GET") {
        return await handleGetReport(reportMatch[1], request, env);
      }
      return json({ error: "Not found" }, 404, corsHeaders(request, env));
    } catch (error) {
      return json({ error: error.message || "Server error" }, 500, corsHeaders(request, env));
    }
  }
};

function corsHeaders(request, env) {
  const origin = request.headers.get("Origin") || "";
  const allowed = (env.ALLOWED_ORIGINS || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
  const allowOrigin = allowed.includes(origin) ? origin : (allowed[0] || "*");

  return {
    "Access-Control-Allow-Origin": allowOrigin,
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type,x-admin-token,x-report-ingest-key",
    "Access-Control-Max-Age": "86400",
    "Content-Type": "application/json; charset=utf-8"
  };
}

function json(data, status = 200, headers = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers
  });
}

async function readBody(request) {
  const text = await request.text();
  try {
    return JSON.parse(text || "{}");
  } catch {
    throw new Error("Invalid JSON body");
  }
}

function requireAdminToken(request, env) {
  const expected = String(env.ADMIN_TOKEN || "").trim();
  if (!expected) {
    throw new Error("ADMIN_TOKEN is not configured");
  }
  const received = String(request.headers.get("x-admin-token") || "").trim();
  if (!received || received !== expected) {
    return false;
  }
  return true;
}

function requireIngestKey(request, env) {
  const expected = String(env.INGEST_KEY || "").trim();
  if (!expected) return true;
  const received = String(request.headers.get("x-report-ingest-key") || "").trim();
  return received === expected;
}

async function handleCreateReport(request, env) {
  if (!requireIngestKey(request, env)) {
    return json({ error: "Forbidden" }, 403, corsHeaders(request, env));
  }

  const payload = await readBody(request);
  const id = String(payload.id || "");
  if (!id) {
    return json({ error: "Missing report id" }, 400, corsHeaders(request, env));
  }

  const submittedAt = String(payload.submittedAt || new Date().toISOString());
  const studentProfile = payload.studentProfile || {};
  const directions = Array.isArray(payload.directions) ? payload.directions : [];
  const recommendations = Array.isArray(payload.recommendations) ? payload.recommendations : [];

  await env.DB.prepare(`
    INSERT OR REPLACE INTO reports (
      id,
      submitted_at,
      student_type,
      student_type_label,
      grade,
      curriculum_summary,
      mode_label,
      top_direction,
      second_direction,
      top_major,
      second_major,
      top_match_index,
      report_json
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).bind(
    id,
    submittedAt,
    String(studentProfile.type || ""),
    String(studentProfile.typeLabel || ""),
    String(studentProfile.grade || ""),
    String(studentProfile.curriculumSummary || ""),
    String(studentProfile.modeLabel || ""),
    String(directions[0]?.label || ""),
    String(directions[1]?.label || ""),
    String(recommendations[0]?.name || ""),
    String(recommendations[1]?.name || ""),
    Number(recommendations[0]?.matchIndex || 0),
    JSON.stringify(payload)
  ).run();

  return json({ ok: true, id }, 200, corsHeaders(request, env));
}

async function handleListReports(request, env) {
  if (!requireAdminToken(request, env)) {
    return json({ error: "Forbidden" }, 403, corsHeaders(request, env));
  }

  const url = new URL(request.url);
  const limit = Math.min(Number(url.searchParams.get("limit") || 50), 200);
  const result = await env.DB.prepare(`
    SELECT
      id,
      submitted_at AS submittedAt,
      student_type AS studentType,
      student_type_label AS studentTypeLabel,
      grade,
      curriculum_summary AS curriculumSummary,
      mode_label AS modeLabel,
      top_direction AS topDirection,
      second_direction AS secondDirection,
      top_major AS topMajor,
      second_major AS secondMajor,
      top_match_index AS topMatchIndex,
      report_json AS reportJson
    FROM reports
    ORDER BY submitted_at DESC
    LIMIT ?
  `).bind(limit).all();

  const items = (result.results || []).map((row) => {
    const parsed = safeJsonParse(row.reportJson);
    return parsed || {
      id: row.id,
      submittedAt: row.submittedAt,
      studentProfile: {
        type: row.studentType,
        typeLabel: row.studentTypeLabel,
        grade: row.grade,
        curriculumSummary: row.curriculumSummary,
        modeLabel: row.modeLabel
      },
      directions: [
        { label: row.topDirection },
        { label: row.secondDirection }
      ],
      recommendations: [
        { name: row.topMajor, matchIndex: row.topMatchIndex },
        { name: row.secondMajor }
      ]
    };
  });

  return json({ items }, 200, corsHeaders(request, env));
}

async function handleGetReport(id, request, env) {
  if (!requireAdminToken(request, env)) {
    return json({ error: "Forbidden" }, 403, corsHeaders(request, env));
  }

  const row = await env.DB.prepare(`
    SELECT report_json AS reportJson
    FROM reports
    WHERE id = ?
    LIMIT 1
  `).bind(id).first();

  if (!row) {
    return json({ error: "Not found" }, 404, corsHeaders(request, env));
  }

  return json({ item: safeJsonParse(row.reportJson) }, 200, corsHeaders(request, env));
}

function safeJsonParse(value) {
  try {
    return JSON.parse(value || "{}");
  } catch {
    return null;
  }
}

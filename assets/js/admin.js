const ADMIN_STORAGE_KEY = "majornavi-report-admin-config";

const apiBaseInput = document.getElementById("admin-api-base");
const tokenInput = document.getElementById("admin-token");
const loadBtn = document.getElementById("admin-load-btn");
const clearBtn = document.getElementById("admin-clear-btn");
const exportBtn = document.getElementById("admin-export-btn");
const clearSmokeBtn = document.getElementById("admin-clear-smoke-btn");
const statusEl = document.getElementById("admin-status");
const countEl = document.getElementById("admin-count");
const totalCountEl = document.getElementById("admin-total-count");
const todayCountEl = document.getElementById("admin-today-count");
const publicCountEl = document.getElementById("admin-public-count");
const internationalCountEl = document.getElementById("admin-international-count");
const listEl = document.getElementById("admin-report-list");
const detailEl = document.getElementById("admin-detail");
const sortFilterEl = document.getElementById("admin-sort-filter");
const typeFilterEl = document.getElementById("admin-type-filter");
const followupFilterEl = document.getElementById("admin-followup-filter");
const gradeFilterEl = document.getElementById("admin-grade-filter");
const dateFromEl = document.getElementById("admin-date-from");
const dateToEl = document.getElementById("admin-date-to");
const searchFilterEl = document.getElementById("admin-search-filter");

let reports = [];
let filteredReports = [];
let selectedReportId = "";

function escapeHtml(text) {
  return String(text || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function setStatus(text, tone = "neutral") {
  statusEl.textContent = text;
  statusEl.dataset.tone = tone;
}

function loadConfig() {
  const defaultApiBase = String(window.ADMIN_DEFAULT_API_BASE || "").trim();
  const defaultToken = String(window.ADMIN_DEFAULT_TOKEN || "").trim();
  try {
    const raw = localStorage.getItem(ADMIN_STORAGE_KEY);
    if (!raw) {
      if (defaultApiBase) apiBaseInput.value = defaultApiBase;
      if (defaultToken) tokenInput.value = defaultToken;
      return;
    }
    const parsed = JSON.parse(raw);
    apiBaseInput.value = parsed.apiBase || defaultApiBase;
    tokenInput.value = parsed.token || defaultToken;
  } catch {
    localStorage.removeItem(ADMIN_STORAGE_KEY);
    if (defaultApiBase) apiBaseInput.value = defaultApiBase;
    if (defaultToken) tokenInput.value = defaultToken;
  }
}

function saveConfig() {
  localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify({
    apiBase: String(apiBaseInput.value || "").trim(),
    token: String(tokenInput.value || "").trim()
  }));
}

function clearConfig() {
  localStorage.removeItem(ADMIN_STORAGE_KEY);
  apiBaseInput.value = "";
  tokenInput.value = "";
}

function formatDateTime(value) {
  if (!value) return "未知时间";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString("zh-CN", { hour12: false });
}

function summarizeProfile(report) {
  const profile = report.studentProfile || {};
  return [profile.typeLabel, profile.grade, profile.curriculumSummary].filter(Boolean).join(" / ");
}

function getReportType(report) {
  const profile = report.studentProfile || {};
  return String(profile.type || "").trim() || (
    String(profile.typeLabel || "").includes("国际") ? "international" : "public"
  );
}

function getFollowupStatusLabel(status) {
  const map = {
    new: "新报告",
    pending: "待跟进",
    contacted: "已沟通",
    high_intent: "高意向"
  };
  return map[String(status || "").trim()] || "新报告";
}

function reportMatchesFilters(report) {
  const typeFilter = String(typeFilterEl.value || "").trim();
  const followupFilter = String(followupFilterEl.value || "").trim();
  const gradeFilter = String(gradeFilterEl.value || "").trim().toLowerCase();
  const dateFrom = String(dateFromEl.value || "").trim();
  const dateTo = String(dateToEl.value || "").trim();
  const searchFilter = String(searchFilterEl.value || "").trim().toLowerCase();
  const profile = report.studentProfile || {};
  const topDirection = report.directions?.[0]?.label || "";
  const topMajor = report.recommendations?.[0]?.name || "";
  const secondMajor = report.recommendations?.[1]?.name || "";
  const haystack = [topDirection, topMajor, secondMajor, profile.curriculumSummary]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  if (typeFilter && getReportType(report) !== typeFilter) return false;
  if (followupFilter && String(report.adminMeta?.status || "new") !== followupFilter) return false;
  if (gradeFilter && !String(profile.grade || "").toLowerCase().includes(gradeFilter)) return false;
  if (dateFrom && String(report.submittedAt || "").slice(0, 10) < dateFrom) return false;
  if (dateTo && String(report.submittedAt || "").slice(0, 10) > dateTo) return false;
  if (searchFilter && !haystack.includes(searchFilter)) return false;
  return true;
}

function compareReports(a, b) {
  const mode = String(sortFilterEl?.value || "submitted_desc");
  const aSubmitted = String(a.submittedAt || "");
  const bSubmitted = String(b.submittedAt || "");
  const aMatch = Number(a.recommendations?.[0]?.matchIndex || 0);
  const bMatch = Number(b.recommendations?.[0]?.matchIndex || 0);
  const aMajor = String(a.recommendations?.[0]?.name || "");
  const bMajor = String(b.recommendations?.[0]?.name || "");

  switch (mode) {
    case "submitted_asc":
      return aSubmitted.localeCompare(bSubmitted);
    case "match_desc":
      return bMatch - aMatch || bSubmitted.localeCompare(aSubmitted);
    case "major_asc":
      return aMajor.localeCompare(bMajor, "zh-CN") || bSubmitted.localeCompare(aSubmitted);
    case "submitted_desc":
    default:
      return bSubmitted.localeCompare(aSubmitted);
  }
}

function applyFilters() {
  filteredReports = reports.filter(reportMatchesFilters).sort(compareReports);
  if (!filteredReports.find((item) => item.id === selectedReportId)) {
    selectedReportId = filteredReports[0]?.id || "";
  }
}

function renderOverview() {
  const today = new Date().toISOString().slice(0, 10);
  const todayCount = reports.filter((report) => String(report.submittedAt || "").startsWith(today)).length;
  const publicCount = reports.filter((report) => getReportType(report) === "public").length;
  const internationalCount = reports.filter((report) => getReportType(report) === "international").length;

  totalCountEl.textContent = String(reports.length);
  todayCountEl.textContent = String(todayCount);
  publicCountEl.textContent = String(publicCount);
  internationalCountEl.textContent = String(internationalCount);
}

function renderReportList() {
  countEl.textContent = `${filteredReports.length} 份`;
  if (!filteredReports.length) {
    listEl.innerHTML = `
      <div class="empty-state compact">
        <p>当前筛选条件下暂无报告数据</p>
      </div>
    `;
    return;
  }

  listEl.innerHTML = filteredReports.map((report) => `
    <button type="button" class="admin-report-item${report.id === selectedReportId ? " active" : ""}" data-report-id="${escapeHtml(report.id)}">
      <div class="admin-report-title">
        <strong>${escapeHtml(report.recommendations?.[0]?.name || report.directions?.[0]?.label || "未命名报告")}</strong>
        <span>${escapeHtml(String(report.recommendations?.[0]?.matchIndex || ""))}</span>
      </div>
      <p>${escapeHtml(summarizeProfile(report))}</p>
      <p>${escapeHtml(formatDateTime(report.submittedAt))}</p>
      <p><span class="admin-status-badge admin-status-${escapeHtml(String(report.adminMeta?.status || "new"))}">${escapeHtml(getFollowupStatusLabel(report.adminMeta?.status))}</span></p>
      ${report.adminMeta?.note ? `<p class="admin-report-note-flag">已备注</p>` : ""}
    </button>
  `).join("");
}

function renderReportDetail(report) {
  if (!report) {
    detailEl.innerHTML = `
      <div class="empty-state">
        <h2>未找到报告</h2>
        <p>请重新加载或选择其他报告。</p>
      </div>
    `;
    return;
  }

  const profile = report.studentProfile || {};
  const topTraits = report.scoring?.topTraits || [];
  const directions = report.directions || [];
  const recommendations = report.recommendations || [];
  const schoolRestricted = report.schoolRestricted?.recommendations || [];
  const careerAnalysis = report.careerAnalysis || null;

  detailEl.innerHTML = `
    <div class="admin-detail-header">
      <p class="result-kicker">报告详情</p>
      <h2>${escapeHtml(recommendations[0]?.name || directions[0]?.label || "报告")}</h2>
      <p class="result-summary">${escapeHtml(report.comparisons?.directionSummary || "")}</p>
    </div>
    <div class="admin-actions detail-actions">
      <button id="admin-export-detail-btn" type="button" class="btn btn-ghost">导出当前报告</button>
      <button id="admin-delete-report-btn" type="button" class="btn btn-ghost">删除当前报告</button>
    </div>
    <div class="student-summary-grid">
      <article class="student-summary-card">
        <span class="student-summary-label">提交时间</span>
        <strong>${escapeHtml(formatDateTime(report.submittedAt))}</strong>
      </article>
      <article class="student-summary-card">
        <span class="student-summary-label">学生类型</span>
        <strong>${escapeHtml(profile.typeLabel || "")}</strong>
      </article>
      <article class="student-summary-card">
        <span class="student-summary-label">当前年级</span>
        <strong>${escapeHtml(profile.grade || "")}</strong>
      </article>
      <article class="student-summary-card">
        <span class="student-summary-label">课程背景</span>
        <strong>${escapeHtml(profile.curriculumSummary || "")}</strong>
      </article>
    </div>
    <section class="advice note-editor">
      <div class="note-editor-head">
        <h3>后台备注</h3>
        <button id="admin-save-note-btn" type="button" class="btn btn-ghost">保存跟进信息</button>
      </div>
      <label class="single-field">
        <span>跟进状态</span>
        <select id="admin-followup-status">
          <option value="new" ${String(report.adminMeta?.status || "new") === "new" ? "selected" : ""}>新报告</option>
          <option value="pending" ${String(report.adminMeta?.status || "") === "pending" ? "selected" : ""}>待跟进</option>
          <option value="contacted" ${String(report.adminMeta?.status || "") === "contacted" ? "selected" : ""}>已沟通</option>
          <option value="high_intent" ${String(report.adminMeta?.status || "") === "high_intent" ? "selected" : ""}>高意向</option>
        </select>
      </label>
      <textarea id="admin-note-input" rows="5" placeholder="可记录已沟通、待跟进、高意向、家长关注点等后台备注。">${escapeHtml(report.adminMeta?.note || "")}</textarea>
      <p class="note-meta">${escapeHtml(report.adminMeta?.updatedAt ? `最近更新：${formatDateTime(report.adminMeta.updatedAt)}` : "尚未填写后台备注。")} 当前状态：${escapeHtml(getFollowupStatusLabel(report.adminMeta?.status))}</p>
    </section>
    <section class="advice">
      <h3>画像摘要</h3>
      <p>${escapeHtml((topTraits || []).map((item) => `${item.label}${item.score}分`).join("、") || "暂无")}</p>
      <p>${escapeHtml(report.scoring?.weightingSummary || "")}</p>
    </section>
    <section class="advice">
      <h3>方向结论</h3>
      <p>${escapeHtml(directions.map((item, index) => `${index === 0 ? "优先" : "次优"}：${item.label}`).join("；") || "暂无")}</p>
    </section>
    ${careerAnalysis ? `
      <section class="career-analysis-section">
        <div class="career-analysis-header">
          <div>
            <p class="career-analysis-kicker">职业性格与发展分析</p>
            <h3>${escapeHtml(careerAnalysis.label || "")}</h3>
          </div>
          <p class="career-analysis-holland">Holland 辅助代码：${escapeHtml(report.scoring?.hollandCode || "")}</p>
        </div>
        <p class="career-analysis-summary">${escapeHtml(careerAnalysis.summary || "")}</p>
        <div class="career-analysis-grid">
          <article class="career-analysis-card">
            <h4>未来工作中的核心优势</h4>
            <ul>
              ${(careerAnalysis.strengths || []).map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
            </ul>
            <p class="career-analysis-note"><strong>当前优势维度：</strong>${escapeHtml(careerAnalysis.topText || "")}</p>
          </article>
          <article class="career-analysis-card">
            <h4>可能出现的职业盲点</h4>
            <ul>
              ${(careerAnalysis.blindspots || []).map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
            </ul>
            <p class="career-analysis-note"><strong>当前相对薄弱维度：</strong>${escapeHtml(careerAnalysis.lowText || "")}</p>
            ${careerAnalysis.directionBlindspot ? `<p class="career-analysis-note"><strong>方向判断提醒：</strong>${escapeHtml(careerAnalysis.directionBlindspot)}</p>` : ""}
          </article>
          <article class="career-analysis-card">
            <h4>更适合的发展环境</h4>
            <p>${escapeHtml(careerAnalysis.environment || "")}</p>
          </article>
          <article class="career-analysis-card">
            <h4>发展建议</h4>
            <p>${escapeHtml(careerAnalysis.advice || "")}</p>
          </article>
        </div>
        ${(careerAnalysis.axes || []).length ? `
          <div class="career-axis-list">
            ${(careerAnalysis.axes || []).map((axis) => `
              <article class="career-axis-item">
                <p class="career-axis-label">${escapeHtml(axis.label || "")}</p>
                <strong>${escapeHtml(axis.orientation || "")}</strong>
                <p>${escapeHtml(axis.summary || "")}</p>
              </article>
            `).join("")}
          </div>
        ` : ""}
      </section>
    ` : ""}
    <div class="rank-grid">
      ${recommendations.map((item) => `
        <article class="rank-card">
          <div class="rank-card-top">
            <div>
              <p class="rank-label">${escapeHtml(item.label || "")}</p>
              <h3>${escapeHtml(item.name || "")}</h3>
            </div>
            <p class="score">${escapeHtml(String(item.matchIndex || ""))} / 100</p>
          </div>
          <div class="rank-meta-grid">
            <span>学科门类：${escapeHtml(item.category || "")}</span>
            <span>课程关键词：${escapeHtml(item.courses || "")}</span>
            <span>典型去向：${escapeHtml(item.careers || "")}</span>
          </div>
          <p class="evidence"><strong>核心判断：</strong>${escapeHtml(item.fit || "")}</p>
          <p class="evidence"><strong>匹配亮点：</strong>${escapeHtml(item.edge || "")}</p>
          <p class="evidence"><strong>匹配依据：</strong>${escapeHtml((item.evidence || []).join("、"))}</p>
          <p class="risk"><strong>继续验证：</strong>${escapeHtml(item.caution || "")}</p>
          <p class="risk"><strong>风险提示：</strong>${escapeHtml((item.risks || []).join("、"))}</p>
        </article>
      `).join("")}
    </div>
    <section class="advice">
      <h3>比较与提醒</h3>
      <p>${escapeHtml(report.comparisons?.primaryVsSecondary || "暂无")}</p>
      <p>${escapeHtml(report.comparisons?.reverseAdvice || "暂无")}</p>
    </section>
    ${schoolRestricted.length ? `
      <section class="advice">
        <h3>目标学校范围内替代建议</h3>
        <p>${escapeHtml(schoolRestricted.map((item) => `${item.name}${item.matchIndex}/100`).join("、"))}</p>
      </section>
    ` : ""}
    ${report.adaptiveFlow?.calibrationContext ? `
      <section class="advice">
        <h3>自适应流程记录</h3>
        <p>校准维度：${escapeHtml((report.adaptiveFlow.calibrationContext.boundaryDims || []).join("、"))}</p>
        <p>是否追问：${report.adaptiveFlow.followUpAdded ? "是" : "否"}</p>
      </section>
    ` : ""}
  `;

  const exportDetailBtn = document.getElementById("admin-export-detail-btn");
  const deleteReportBtn = document.getElementById("admin-delete-report-btn");
  const saveNoteBtn = document.getElementById("admin-save-note-btn");
  if (exportDetailBtn) {
    exportDetailBtn.addEventListener("click", () => exportReportDetail(report));
  }
  if (deleteReportBtn) {
    deleteReportBtn.addEventListener("click", () => deleteReport(report.id));
  }
  if (saveNoteBtn) {
    saveNoteBtn.addEventListener("click", () => saveReportNote(report.id));
  }
}

async function fetchReports() {
  const apiBase = String(apiBaseInput.value || "").trim().replace(/\/+$/, "");
  const token = String(tokenInput.value || "").trim();
  if (!apiBase) {
    setStatus("请输入后台接口地址。", "error");
    return;
  }
  if (!token) {
    setStatus("请输入后台访问令牌。", "error");
    return;
  }

  saveConfig();
  setStatus("正在加载报告…");

  const params = new URLSearchParams({ limit: "100" });
  const dateFrom = String(dateFromEl.value || "").trim();
  const dateTo = String(dateToEl.value || "").trim();
  if (dateFrom) params.set("date_from", dateFrom);
  if (dateTo) params.set("date_to", dateTo);

  const response = await fetch(`${apiBase}/api/reports?${params.toString()}`, {
    headers: {
      "x-admin-token": token
    }
  });
  if (!response.ok) {
    throw new Error(`加载失败（${response.status}）`);
  }
  const data = await response.json();
  reports = Array.isArray(data.items) ? data.items : [];
  applyFilters();
  renderOverview();
  renderReportList();
  renderReportDetail(filteredReports.find((report) => report.id === selectedReportId) || null);
  setStatus(`已加载 ${reports.length} 份报告。`, "success");
}

async function deleteReport(id) {
  const apiBase = String(apiBaseInput.value || "").trim().replace(/\/+$/, "");
  const token = String(tokenInput.value || "").trim();
  if (!apiBase || !token || !id) {
    setStatus("缺少删除报告所需的后台配置。", "error");
    return;
  }
  if (!window.confirm("确认删除这份报告吗？此操作不可撤销。")) {
    return;
  }
  const response = await fetch(`${apiBase}/api/reports/${encodeURIComponent(id)}`, {
    method: "DELETE",
    headers: {
      "x-admin-token": token
    }
  });
  if (!response.ok) {
    throw new Error(`删除失败（${response.status}）`);
  }
  reports = reports.filter((report) => report.id !== id);
  applyFilters();
  renderOverview();
  renderReportList();
  renderReportDetail(filteredReports.find((report) => report.id === selectedReportId) || null);
  setStatus("报告已删除。", "success");
}

async function clearSmokeReports() {
  const apiBase = String(apiBaseInput.value || "").trim().replace(/\/+$/, "");
  const token = String(tokenInput.value || "").trim();
  if (!apiBase || !token) {
    setStatus("缺少清理测试数据所需的后台配置。", "error");
    return;
  }
  if (!window.confirm("确认清理所有 smoke test / 测试报告吗？")) {
    return;
  }
  const response = await fetch(`${apiBase}/api/reports?scope=smoke_test`, {
    method: "DELETE",
    headers: {
      "x-admin-token": token
    }
  });
  if (!response.ok) {
    throw new Error(`清理失败（${response.status}）`);
  }
  const data = await response.json();
  await fetchReports();
  setStatus(`已清理 ${data.deletedCount || 0} 份测试报告。`, "success");
}

async function saveReportNote(id) {
  const apiBase = String(apiBaseInput.value || "").trim().replace(/\/+$/, "");
  const token = String(tokenInput.value || "").trim();
  const noteInput = document.getElementById("admin-note-input");
  const statusInput = document.getElementById("admin-followup-status");
  if (!apiBase || !token || !id || !(noteInput instanceof HTMLTextAreaElement) || !(statusInput instanceof HTMLSelectElement)) {
    setStatus("缺少保存备注所需的后台配置。", "error");
    return;
  }

  const note = noteInput.value.trim();
  const followupStatus = String(statusInput.value || "new").trim();
  const response = await fetch(`${apiBase}/api/reports/${encodeURIComponent(id)}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "x-admin-token": token
    },
    body: JSON.stringify({ adminNote: note, adminStatus: followupStatus })
  });
  if (!response.ok) {
    throw new Error(`备注保存失败（${response.status}）`);
  }

  const data = await response.json();
  reports = reports.map((report) => report.id === id ? data.item : report);
  applyFilters();
  renderReportList();
  renderReportDetail(filteredReports.find((report) => report.id === selectedReportId) || null);
  setStatus("后台跟进信息已保存。", "success");
}

listEl.addEventListener("click", (event) => {
  const target = event.target;
  if (!(target instanceof HTMLElement)) return;
  const item = target.closest("[data-report-id]");
  if (!(item instanceof HTMLElement)) return;
  selectedReportId = item.dataset.reportId || "";
  renderReportList();
  renderReportDetail(filteredReports.find((report) => report.id === selectedReportId) || null);
});

[sortFilterEl, typeFilterEl, followupFilterEl, gradeFilterEl, dateFromEl, dateToEl, searchFilterEl].forEach((input) => {
  input.addEventListener("input", () => {
    applyFilters();
    renderReportList();
    renderReportDetail(filteredReports.find((report) => report.id === selectedReportId) || null);
    setStatus(`当前筛选结果 ${filteredReports.length} 份。`);
  });
});

loadBtn.addEventListener("click", async () => {
  try {
    await fetchReports();
  } catch (error) {
    console.error(error);
    setStatus(error.message || "后台加载失败。", "error");
  }
});

clearBtn.addEventListener("click", () => {
  clearConfig();
  reports = [];
  filteredReports = [];
  selectedReportId = "";
  renderOverview();
  renderReportList();
  renderReportDetail(null);
  setStatus("已清空本地后台凭据。");
});

function toCsvValue(value) {
  const text = String(value == null ? "" : value);
  if (/[",\n]/.test(text)) {
    return `"${text.replace(/"/g, "\"\"")}"`;
  }
  return text;
}

function exportReports() {
  if (!filteredReports.length) {
    setStatus("当前没有可导出的报告。", "error");
    return;
  }

  const rows = [
    ["提交时间", "学生类型", "年级", "课程背景", "跟进状态", "优先方向", "首选专业", "匹配度", "后台备注"],
    ...filteredReports.map((report) => {
      const profile = report.studentProfile || {};
      return [
        formatDateTime(report.submittedAt),
        profile.typeLabel || "",
        profile.grade || "",
        profile.curriculumSummary || "",
        getFollowupStatusLabel(report.adminMeta?.status),
        report.directions?.[0]?.label || "",
        report.recommendations?.[0]?.name || "",
        report.recommendations?.[0]?.matchIndex || "",
        report.adminMeta?.note || ""
      ];
    })
  ];

  const csv = "\uFEFF" + rows.map((row) => row.map(toCsvValue).join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `majornavi-reports-${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(link.href);
  setStatus(`已导出 ${filteredReports.length} 份报告。`, "success");
}

function exportReportDetail(report) {
  const blob = new Blob([JSON.stringify(report, null, 2)], { type: "application/json;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `majornavi-report-${report.id || "detail"}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(link.href);
  setStatus("当前报告已导出。", "success");
}

exportBtn.addEventListener("click", exportReports);
clearSmokeBtn.addEventListener("click", async () => {
  try {
    await clearSmokeReports();
  } catch (error) {
    console.error(error);
    setStatus(error.message || "测试报告清理失败。", "error");
  }
});

loadConfig();
renderOverview();
renderReportList();

const ADMIN_STORAGE_KEY = "majornavi-report-admin-config";

const apiBaseInput = document.getElementById("admin-api-base");
const tokenInput = document.getElementById("admin-token");
const loadBtn = document.getElementById("admin-load-btn");
const clearBtn = document.getElementById("admin-clear-btn");
const statusEl = document.getElementById("admin-status");
const countEl = document.getElementById("admin-count");
const listEl = document.getElementById("admin-report-list");
const detailEl = document.getElementById("admin-detail");

let reports = [];
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
  try {
    const raw = localStorage.getItem(ADMIN_STORAGE_KEY);
    if (!raw) return;
    const parsed = JSON.parse(raw);
    apiBaseInput.value = parsed.apiBase || "";
    tokenInput.value = parsed.token || "";
  } catch {
    localStorage.removeItem(ADMIN_STORAGE_KEY);
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

function renderReportList() {
  countEl.textContent = `${reports.length} 份`;
  if (!reports.length) {
    listEl.innerHTML = `
      <div class="empty-state compact">
        <p>暂无报告数据</p>
      </div>
    `;
    return;
  }

  listEl.innerHTML = reports.map((report) => `
    <button type="button" class="admin-report-item${report.id === selectedReportId ? " active" : ""}" data-report-id="${escapeHtml(report.id)}">
      <div class="admin-report-title">
        <strong>${escapeHtml(report.recommendations?.[0]?.name || report.directions?.[0]?.label || "未命名报告")}</strong>
        <span>${escapeHtml(String(report.recommendations?.[0]?.matchIndex || ""))}</span>
      </div>
      <p>${escapeHtml(summarizeProfile(report))}</p>
      <p>${escapeHtml(formatDateTime(report.submittedAt))}</p>
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

  detailEl.innerHTML = `
    <div class="admin-detail-header">
      <p class="result-kicker">报告详情</p>
      <h2>${escapeHtml(recommendations[0]?.name || directions[0]?.label || "报告")}</h2>
      <p class="result-summary">${escapeHtml(report.comparisons?.directionSummary || "")}</p>
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
    <section class="advice">
      <h3>画像摘要</h3>
      <p>${escapeHtml((topTraits || []).map((item) => `${item.label}${item.score}分`).join("、") || "暂无")}</p>
      <p>${escapeHtml(report.scoring?.weightingSummary || "")}</p>
    </section>
    <section class="advice">
      <h3>方向结论</h3>
      <p>${escapeHtml(directions.map((item, index) => `${index === 0 ? "优先" : "次优"}：${item.label}`).join("；") || "暂无")}</p>
    </section>
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

  const response = await fetch(`${apiBase}/api/reports?limit=100`, {
    headers: {
      "x-admin-token": token
    }
  });
  if (!response.ok) {
    throw new Error(`加载失败（${response.status}）`);
  }
  const data = await response.json();
  reports = Array.isArray(data.items) ? data.items : [];
  selectedReportId = reports[0]?.id || "";
  renderReportList();
  renderReportDetail(reports[0] || null);
  setStatus(`已加载 ${reports.length} 份报告。`, "success");
}

listEl.addEventListener("click", (event) => {
  const target = event.target;
  if (!(target instanceof HTMLElement)) return;
  const item = target.closest("[data-report-id]");
  if (!(item instanceof HTMLElement)) return;
  selectedReportId = item.dataset.reportId || "";
  renderReportList();
  renderReportDetail(reports.find((report) => report.id === selectedReportId) || null);
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
  selectedReportId = "";
  renderReportList();
  renderReportDetail(null);
  setStatus("已清空本地后台凭据。");
});

loadConfig();
renderReportList();

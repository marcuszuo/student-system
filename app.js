const allQuestions = OFFICIAL_DATA.questions;
const dimensions = OFFICIAL_DATA.dimensions;
const majors = OFFICIAL_DATA.majors;
const actions = OFFICIAL_DATA.actions;
const dimensionKeys = OFFICIAL_DATA.dimensionKeys;

const ITEMS_PER_PAGE = 8;
const STORAGE_KEY = "student-major-assessment-v2";

const MODE_CONFIG = {
  standard: { label: "标准版", selector: (q) => {
    const n = Number(q.id.slice(1));
    if (q.module === "A") return n <= 15;
    if (q.module === "B") return n <= 15;
    if (q.module === "C") return n <= 15;
    if (q.module === "D") return n <= 12;
    if (q.module === "E") return n <= 9;
    return false;
  }},
  full: { label: "完整版", selector: () => true }
};

const CONSISTENCY_PAIRS = [
  ["A01", "A10"], ["A02", "A19"], ["A04", "A17"], ["A07", "A18"],
  ["B02", "B13"], ["B03", "B10"], ["C01", "C16"], ["C05", "C18"],
  ["D02", "D16"], ["D06", "D15"], ["E03", "E14"], ["E07", "E15"]
];

const dimensionNameMap = Object.fromEntries(
  dimensions.map((d) => [d.key, d.name || d.key])
);

const startBtn = document.getElementById("start-btn");
const intro = document.getElementById("intro");
const quizForm = document.getElementById("quiz-form");
const questionList = document.getElementById("question-list");
const progressText = document.getElementById("progress-text");
const progressFill = document.getElementById("progress-fill");
const resultBox = document.getElementById("result");
const prevBtn = document.getElementById("prev-btn");
const nextBtn = document.getElementById("next-btn");
const submitBtn = document.getElementById("submit-btn");
const pageText = document.getElementById("page-text");
const clearBtn = document.getElementById("clear-btn");
const saveStatus = document.getElementById("save-status");

let selectedMode = "standard";
let activeQuestions = [];
let totalPages = 1;
let currentPage = 1;
let answers = {};

function formatTime(date) {
  return date.toLocaleTimeString("zh-CN", { hour12: false });
}

function setSaveStatus(text) {
  saveStatus.textContent = text;
}

function saveDraft() {
  const payload = {
    mode: selectedMode,
    answers,
    page: currentPage,
    savedAt: new Date().toISOString()
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  setSaveStatus(`草稿已保存 ${formatTime(new Date())}`);
}

function applyMode(mode) {
  selectedMode = mode in MODE_CONFIG ? mode : "standard";
  activeQuestions = allQuestions.filter(MODE_CONFIG[selectedMode].selector);
  totalPages = Math.max(1, Math.ceil(activeQuestions.length / ITEMS_PER_PAGE));
  currentPage = Math.min(Math.max(currentPage, 1), totalPages);
}

function loadDraft() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return;
  try {
    const parsed = JSON.parse(raw);
    answers = parsed.answers || {};
    applyMode(parsed.mode || selectedMode);
    currentPage = Number(parsed.page) || 1;
    currentPage = Math.min(Math.max(currentPage, 1), totalPages);
    const modeInput = document.querySelector(`input[name="assessment-mode"][value="${selectedMode}"]`);
    if (modeInput) modeInput.checked = true;
    setSaveStatus("已恢复上次作答草稿");
  } catch {
    answers = {};
    currentPage = 1;
    applyMode("standard");
  }
}

function clearDraft() {
  answers = {};
  currentPage = 1;
  localStorage.removeItem(STORAGE_KEY);
  setSaveStatus("已清空草稿");
  renderCurrentPage();
  updateProgress();
}

function createQuestionHTML(question, index) {
  const options = question.options
    .map((option) => {
      const checked = answers[question.id] === option.key ? "checked" : "";
      return `
      <label class="option-item">
        <input type="radio" name="${question.id}" value="${option.key}" ${checked}>
        <span><span class="option-tag">${option.key}</span> ${option.text}</span>
      </label>
    `;
    })
    .join("");

  return `
    <article class="question">
      <h3>${index + 1}. ${question.text}</h3>
      <div class="option-list">${options}</div>
    </article>
  `;
}

function getPageQuestions(page) {
  const start = (page - 1) * ITEMS_PER_PAGE;
  return activeQuestions.slice(start, start + ITEMS_PER_PAGE);
}

function renderCurrentPage() {
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const pageQuestions = getPageQuestions(currentPage);
  questionList.innerHTML = pageQuestions
    .map((q, idx) => createQuestionHTML(q, startIndex + idx))
    .join("");

  pageText.textContent = `第 ${currentPage} / ${totalPages} 页（${MODE_CONFIG[selectedMode].label} ${activeQuestions.length}题）`;
  prevBtn.disabled = currentPage === 1;
  nextBtn.classList.toggle("hidden", currentPage === totalPages);
  submitBtn.classList.toggle("hidden", currentPage !== totalPages);
}

function updateProgress() {
  const answered = activeQuestions.filter((q) => answers[q.id]).length;
  const total = activeQuestions.length;
  const percent = total ? (answered / total) * 100 : 0;
  progressText.textContent = `${answered} / ${total}`;
  progressFill.style.width = `${percent}%`;
}

function isCurrentPageAnswered() {
  return getPageQuestions(currentPage).every((q) => answers[q.id]);
}

function average(values) {
  if (!values.length) return 0;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function calculateStudentVector(answerMap) {
  const hitCount = Object.fromEntries(dimensionKeys.map((key) => [key, 0]));
  const possibleCount = Object.fromEntries(dimensionKeys.map((key) => [key, 0]));

  activeQuestions.forEach((q) => {
    q.options.forEach((option) => {
      if (possibleCount[option.dim] !== undefined) {
        possibleCount[option.dim] += 1;
      }
    });
    const selected = answerMap[q.id];
    const selectedOption = q.options.find((option) => option.key === selected);
    if (selectedOption && hitCount[selectedOption.dim] !== undefined) {
      hitCount[selectedOption.dim] += 1;
    }
  });

  const score = {};
  dimensionKeys.forEach((dim) => {
    const denom = possibleCount[dim];
    score[dim] = denom === 0 ? 0 : hitCount[dim] / denom;
  });

  if (possibleCount["cognition.spatial"] === 0) {
    score["cognition.spatial"] = average([score["interest.r"], score["interest.a"]]);
  }
  if (possibleCount["ability.stat"] === 0) {
    score["ability.stat"] = average([score["cognition.data"], score["ability.math"]]);
  }
  if (possibleCount["risk.stability"] === 0) {
    score["risk.stability"] = score["value.security"];
  }

  return { score, hitCount, possibleCount };
}

function squaredDistance(studentScore, majorVector) {
  return dimensionKeys.reduce((sum, dim) => {
    const diff = (studentScore[dim] || 0) - (majorVector[dim] || 0);
    return sum + diff * diff;
  }, 0);
}

function rankMajors(studentScore) {
  const withDistance = majors.map((major, idx) => {
    const dist = squaredDistance(studentScore, major.vector);
    return { ...major, _dist: dist, _idx: idx };
  });

  const distances = withDistance.map((m) => m._dist);
  const minDist = Math.min(...distances);
  const maxDist = Math.max(...distances);

  withDistance.forEach((major) => {
    const score01 =
      maxDist === minDist ? 0.5 : 1 - (major._dist - minDist) / (maxDist - minDist);
    major.score01 = score01;
    major.matchIndex = Math.round(score01 * 100);
    major.rankScore = score01 + (major._idx + 1) * 0.000001;
  });

  return withDistance.sort((a, b) => b.rankScore - a.rankScore);
}

function getTopDimensions(studentScore, topN = 3) {
  return dimensionKeys
    .map((dim) => ({
      dim,
      label: dimensionNameMap[dim] || dim,
      score: Math.round((studentScore[dim] || 0) * 100)
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, topN);
}

function getActionByCategory(category) {
  return actions.find((a) => a.category === category);
}

function calculateConsistency(answerMap) {
  const usable = CONSISTENCY_PAIRS.filter(([a, b]) => answerMap[a] && answerMap[b]);
  if (!usable.length) return 0.7;
  const aligned = usable.filter(([a, b]) => answerMap[a] === answerMap[b]).length;
  return aligned / usable.length;
}

function calculateConfidence(answerMap, rankedMajors) {
  const pairConsistency = calculateConsistency(answerMap);
  const gap = Math.max(0, (rankedMajors[0].matchIndex || 0) - (rankedMajors[1]?.matchIndex || 0));
  const gapPart = Math.min(gap / 15, 1);
  const modeWeight = selectedMode === "full" ? 1 : 0.82;
  const score = Math.round((pairConsistency * 0.5 + gapPart * 0.35 + modeWeight * 0.15) * 100);
  if (score >= 80) return { score, level: "高" };
  if (score >= 60) return { score, level: "中" };
  return { score, level: "低" };
}

function buildEvidence(major, studentScore) {
  const core = major.coreDims.length ? major.coreDims : dimensionKeys.slice(0, 4);
  const positives = core
    .map((dim) => ({ dim, value: Math.round((studentScore[dim] || 0) * 100) }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 3)
    .map((x) => `${dimensionNameMap[x.dim] || x.dim}${x.value}分`);
  const risks = core
    .map((dim) => ({ dim, value: Math.round((studentScore[dim] || 0) * 100) }))
    .sort((a, b) => a.value - b.value)
    .filter((x) => x.value < 45)
    .slice(0, 2)
    .map((x) => `${dimensionNameMap[x.dim] || x.dim}${x.value}分`);
  return { positives, risks };
}

function renderResult(studentVector, rankedMajors, confidence) {
  const topTraits = getTopDimensions(studentVector.score, 3);
  const traitText = topTraits.map((t) => `${t.label} ${t.score}分`).join("、");
  const top3 = rankedMajors.slice(0, 3);
  const tieTop = (top3[0].matchIndex - top3[1].matchIndex) <= 3;

  const rankNames = tieTop
    ? ["首选（并列A）", "首选（并列B）", "备选"]
    : ["首选", "次选", "末选（可冲刺/保底）"];

  const cards = top3
    .map((major, index) => {
      const ev = buildEvidence(major, studentVector.score);
      return `
      <article class="rank-card">
        <h3>${rankNames[index]}：${major.name}</h3>
        <p class="score">匹配指数：${major.matchIndex} / 100</p>
        <p>学科门类：${major.category}</p>
        <p>核心课程：${major.courses}</p>
        <p>典型去向：${major.careers}</p>
        <p class="evidence"><strong>推荐证据：</strong>${ev.positives.join("、") || "综合匹配度较高"}</p>
        <p class="risk"><strong>风险提示：</strong>${ev.risks.join("、") || "当前未见明显核心短板，可持续观察学业压力承受度"}</p>
      </article>
    `;
    })
    .join("");

  const firstAction = getActionByCategory(top3[0].category);
  const actionHTML = firstAction
    ? `
      <div class="advice">
        <strong>家长可读建议：</strong><br>
        当前结果置信度为 ${confidence.level}（${confidence.score}/100），建议先围绕首选方向进行 1-2 个可执行验证任务，再决定长期投入。<br>
        学习重点：${firstAction.focus}<br>
        验证方式：${firstAction.validation}
      </div>
    `
    : "";

  resultBox.innerHTML = `
    <div class="result-header">
      <h2>推荐结果（官方矩阵）</h2>
      <p class="confidence">结果置信度：${confidence.level}（${confidence.score}/100）${tieTop ? "；首选存在并列，建议结合学科成绩再判断。" : ""}</p>
      <p class="result-meta">你的优势特征：${traitText}</p>
    </div>
    <div class="result-tools">
      <button type="button" id="export-pdf-btn" class="btn btn-ghost">导出 PDF（打印版）</button>
    </div>
    <div class="rank-grid">${cards}</div>
    ${actionHTML}
  `;
}

startBtn.addEventListener("click", () => {
  const modeInput = document.querySelector('input[name="assessment-mode"]:checked');
  applyMode(modeInput ? modeInput.value : "standard");
  intro.classList.add("hidden");
  quizForm.classList.remove("hidden");
  loadDraft();
  renderCurrentPage();
  updateProgress();
});

quizForm.addEventListener("change", (event) => {
  const target = event.target;
  if (target instanceof HTMLInputElement && target.type === "radio") {
    answers[target.name] = target.value;
    saveDraft();
    updateProgress();
  }
});

prevBtn.addEventListener("click", () => {
  if (currentPage > 1) {
    currentPage -= 1;
    saveDraft();
    renderCurrentPage();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
});

nextBtn.addEventListener("click", () => {
  if (!isCurrentPageAnswered()) {
    alert("请先完成本页全部题目，再进入下一页。");
    return;
  }
  if (currentPage < totalPages) {
    currentPage += 1;
    saveDraft();
    renderCurrentPage();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
});

clearBtn.addEventListener("click", () => {
  if (confirm("确认清空全部作答记录吗？")) {
    clearDraft();
  }
});

quizForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const allAnswered = activeQuestions.every((q) => answers[q.id]);
  if (!allAnswered) {
    alert("还有题目未完成，请全部作答后再生成结果。");
    return;
  }
  const studentVector = calculateStudentVector(answers);
  const rankedMajors = rankMajors(studentVector.score);
  const confidence = calculateConfidence(answers, rankedMajors);
  renderResult(studentVector, rankedMajors, confidence);
  localStorage.removeItem(STORAGE_KEY);
  setSaveStatus("已提交并清除本地草稿");
  resultBox.classList.remove("hidden");
  resultBox.scrollIntoView({ behavior: "smooth", block: "start" });
});

resultBox.addEventListener("click", (event) => {
  const target = event.target;
  if (target instanceof HTMLElement && target.id === "export-pdf-btn") {
    window.print();
  }
});

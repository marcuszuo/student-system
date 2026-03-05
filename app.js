const questions = OFFICIAL_DATA.questions;
const dimensions = OFFICIAL_DATA.dimensions;
const majors = OFFICIAL_DATA.majors;
const actions = OFFICIAL_DATA.actions;
const dimensionKeys = OFFICIAL_DATA.dimensionKeys;

const ITEMS_PER_PAGE = 8;
const STORAGE_KEY = "student-major-assessment-v1";

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

const totalPages = Math.ceil(questions.length / ITEMS_PER_PAGE);
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
    answers,
    page: currentPage,
    savedAt: new Date().toISOString()
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  setSaveStatus(`草稿已保存 ${formatTime(new Date())}`);
}

function loadDraft() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return;
  try {
    const parsed = JSON.parse(raw);
    answers = parsed.answers || {};
    currentPage = Number(parsed.page) || 1;
    currentPage = Math.min(Math.max(currentPage, 1), totalPages);
    setSaveStatus("已恢复上次作答草稿");
  } catch {
    answers = {};
    currentPage = 1;
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
  return questions.slice(start, start + ITEMS_PER_PAGE);
}

function renderCurrentPage() {
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const pageQuestions = getPageQuestions(currentPage);
  questionList.innerHTML = pageQuestions
    .map((q, idx) => createQuestionHTML(q, startIndex + idx))
    .join("");

  pageText.textContent = `第 ${currentPage} / ${totalPages} 页`;
  prevBtn.disabled = currentPage === 1;
  nextBtn.classList.toggle("hidden", currentPage === totalPages);
  submitBtn.classList.toggle("hidden", currentPage !== totalPages);
}

function updateProgress() {
  const answered = questions.filter((q) => answers[q.id]).length;
  const total = questions.length;
  const percent = (answered / total) * 100;
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

  questions.forEach((q) => {
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

function buildReason(major, topTraits) {
  const traitText = topTraits.map((t) => t.label).join("、");
  const coreText = major.coreDims
    .map((dim) => dimensionNameMap[dim] || dim)
    .slice(0, 3)
    .join("、");
  return `你的优势维度（${traitText}）与该专业核心画像（${coreText || "多维综合"}）接近。`;
}

function renderResult(studentVector, topMajors) {
  const topTraits = getTopDimensions(studentVector.score, 3);
  const traitText = topTraits.map((t) => `${t.label} ${t.score}分`).join("、");
  const rankNames = ["首选", "次选", "末选（可冲刺/保底）"];

  const cards = topMajors
    .map((major, index) => {
      const reason = buildReason(major, topTraits);
      return `
      <article class="rank-card">
        <h3>${rankNames[index]}：${major.name}</h3>
        <p class="score">匹配指数：${major.matchIndex} / 100</p>
        <p>学科门类：${major.category}</p>
        <p>核心课程：${major.courses}</p>
        <p>典型去向：${major.careers}</p>
        <p>${reason}</p>
      </article>
    `;
    })
    .join("");

  const firstAction = getActionByCategory(topMajors[0].category);
  const actionHTML = firstAction
    ? `
      <div class="advice">
        <strong>${topMajors[0].category}后续建议：</strong><br>
        学习重点：${firstAction.focus}<br>
        验证方式：${firstAction.validation}
      </div>
    `
    : "";

  resultBox.innerHTML = `
    <div class="result-header">
      <h2>推荐结果（官方矩阵）</h2>
      <p class="result-meta">你的优势特征：${traitText}</p>
    </div>
    <div class="rank-grid">${cards}</div>
    ${actionHTML}
  `;
}

startBtn.addEventListener("click", () => {
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
  const allAnswered = questions.every((q) => answers[q.id]);

  if (!allAnswered) {
    alert("还有题目未完成，请全部作答后再生成结果。");
    return;
  }

  const studentVector = calculateStudentVector(answers);
  const rankedMajors = rankMajors(studentVector.score);
  const topMajors = rankedMajors.slice(0, 3);
  renderResult(studentVector, topMajors);
  localStorage.removeItem(STORAGE_KEY);
  setSaveStatus("已提交并清除本地草稿");
  resultBox.classList.remove("hidden");
  resultBox.scrollIntoView({ behavior: "smooth", block: "start" });
});

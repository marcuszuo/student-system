const questions = OFFICIAL_DATA.questions;
const dimensions = OFFICIAL_DATA.dimensions;
const majors = OFFICIAL_DATA.majors;
const actions = OFFICIAL_DATA.actions;
const dimensionKeys = OFFICIAL_DATA.dimensionKeys;

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

function createQuestionHTML(question, index) {
  const options = question.options
    .map(
      (option) => `
      <label class="option-item">
        <input type="radio" name="${question.id}" value="${option.key}">
        <span><span class="option-tag">${option.key}</span> ${option.text}</span>
      </label>
    `
    )
    .join("");

  return `
    <article class="question">
      <h3>${index + 1}. ${question.text}</h3>
      <div class="option-list">${options}</div>
    </article>
  `;
}

function renderQuestions() {
  questionList.innerHTML = questions.map(createQuestionHTML).join("");
}

function updateProgress() {
  const answered = questions.filter((q) => quizForm.elements[q.id].value).length;
  const total = questions.length;
  const percent = (answered / total) * 100;
  progressText.textContent = `${answered} / ${total}`;
  progressFill.style.width = `${percent}%`;
}

function average(values) {
  if (!values.length) return 0;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function calculateStudentVector(formData) {
  const hitCount = Object.fromEntries(dimensionKeys.map((key) => [key, 0]));
  const possibleCount = Object.fromEntries(dimensionKeys.map((key) => [key, 0]));

  questions.forEach((q) => {
    q.options.forEach((option) => {
      if (possibleCount[option.dim] !== undefined) {
        possibleCount[option.dim] += 1;
      }
    });

    const selected = formData.get(q.id);
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

  // Follow official Student_Vector formulas in the matrix.
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
  renderQuestions();
  updateProgress();
});

quizForm.addEventListener("change", updateProgress);

quizForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(quizForm);
  const allAnswered = questions.every((q) => formData.get(q.id));

  if (!allAnswered) {
    alert("还有题目未完成，请全部作答后再生成结果。");
    return;
  }

  const studentVector = calculateStudentVector(formData);
  const rankedMajors = rankMajors(studentVector.score);
  const topMajors = rankedMajors.slice(0, 3);
  renderResult(studentVector, topMajors);
  resultBox.classList.remove("hidden");
  resultBox.scrollIntoView({ behavior: "smooth", block: "start" });
});

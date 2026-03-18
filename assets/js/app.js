const MODULE_META = {
  A: { label: "学习方式", tags: ["learning-style", "study-habit"] },
  B: { label: "兴趣驱动", tags: ["motivation", "interest-drive"] },
  C: { label: "认知风格", tags: ["cognition", "thinking-style"] },
  D: { label: "抗压韧性", tags: ["resilience", "stress-response"] },
  E: { label: "价值偏好", tags: ["values", "decision-bias"] }
};

function normalizeQuestion(question) {
  const sequence = Number(String(question.id || "").slice(1)) || 0;
  const meta = MODULE_META[question.module] || { label: question.module, tags: [] };
  return {
    ...question,
    sequence,
    moduleLabel: meta.label,
    tags: [...meta.tags],
    dimensionSet: [...new Set(question.options.map((option) => option.dim))]
  };
}

const allQuestions = OFFICIAL_DATA.questions.map(normalizeQuestion);
const dimensions = OFFICIAL_DATA.dimensions;
const baseMajors = OFFICIAL_DATA.majors;
const actions = OFFICIAL_DATA.actions;
const dimensionKeys = OFFICIAL_DATA.dimensionKeys;
const extraMajors = typeof EXTRA_MAJORS !== "undefined" ? EXTRA_MAJORS : [];

function clamp01(value) {
  return Math.max(0, Math.min(1, value));
}

function randomIndex(max) {
  if (max <= 0) return 0;
  if (window.crypto && typeof window.crypto.getRandomValues === "function") {
    const buffer = new Uint32Array(1);
    window.crypto.getRandomValues(buffer);
    return buffer[0] % max;
  }
  return Math.floor(Math.random() * max);
}

function shuffleArray(items) {
  const output = items.slice();
  for (let i = output.length - 1; i > 0; i -= 1) {
    const j = randomIndex(i + 1);
    [output[i], output[j]] = [output[j], output[i]];
  }
  return output;
}

function mergeMajors(base, extras) {
  const baseMap = new Map(base.map((m) => [m.name, m]));
  const output = [...base];
  extras.forEach((x) => {
    if (baseMap.has(x.name)) return;
    const archetype = baseMap.get(x.archetype) || base[0];
    const vector = { ...archetype.vector };
    Object.entries(x.delta || {}).forEach(([dim, delta]) => {
      vector[dim] = clamp01((vector[dim] || 0) + delta);
    });
    output.push({
      name: x.name,
      category: x.category,
      courses: x.courses,
      careers: x.careers,
      vector,
      coreDims: x.coreDims || archetype.coreDims || []
    });
  });
  return output;
}

const majors = mergeMajors(baseMajors, extraMajors);

const ITEMS_PER_PAGE = 8;
const STORAGE_KEY = "student-major-assessment-v2";
const AUTH_STORAGE_KEY = "student-major-auth-v1";
const AUTH_USERS = Array.isArray(window.AUTH_USERS) && window.AUTH_USERS.length
  ? window.AUTH_USERS
  : [{ username: "admin", password: "333333" }];
const AUTH_ENABLED = AUTH_USERS.length > 0;
const STANDARD_LIMITS = { A: 15, B: 15, C: 15, D: 12, E: 9 };

const MODE_CONFIG = {
  standard: { label: "标准版" },
  full: { label: "完整版" }
};

const CONSISTENCY_PAIRS = [
  ["A01", "A10"], ["A02", "A19"], ["A04", "A17"], ["A07", "A18"],
  ["B02", "B13"], ["B03", "B10"], ["C01", "C16"], ["C05", "C18"],
  ["D02", "D16"], ["D06", "D15"], ["E03", "E14"], ["E07", "E15"]
];

const dimensionNameMap = Object.fromEntries(
  dimensions.map((d) => [d.key, d.name || d.key])
);
const dimensionMetaMap = Object.fromEntries(
  dimensions.map((d) => [d.key, d])
);

const startBtn = document.getElementById("start-btn");
const intro = document.getElementById("intro");
const introPanels = Array.from(document.querySelectorAll("[data-intro-step]"));
const introNext1Btn = document.getElementById("intro-next-1");
const introPrev2Btn = document.getElementById("intro-prev-2");
const introNext2Btn = document.getElementById("intro-next-2");
const introPrev3Btn = document.getElementById("intro-prev-3");
const authGate = document.getElementById("auth-gate");
const assessmentShell = document.getElementById("assessment-shell");
const authUsernameInput = document.getElementById("auth-username");
const authPasswordInput = document.getElementById("auth-password");
const loginBtn = document.getElementById("login-btn");
const authStatus = document.getElementById("auth-status");
const authSessionText = document.getElementById("auth-session-text");
const authSessionBar = document.querySelector(".auth-session-bar");
const logoutBtn = document.getElementById("logout-btn");
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
const studentTypeInputs = Array.from(document.querySelectorAll('input[name="student-type"]'));
const gradeInput = document.getElementById("student-grade");
const scoreCnInput = document.getElementById("score-cn");
const scoreMathInput = document.getElementById("score-math");
const scoreEnInput = document.getElementById("score-en");
const scorePhyInput = document.getElementById("score-phy");
const scoreChemInput = document.getElementById("score-chem");
const scoreBioInput = document.getElementById("score-bio");
const publicScorePanel = document.getElementById("public-score-panel");
const internationalScorePanel = document.getElementById("international-score-panel");
const internationalCurriculumNameInput = document.getElementById("international-curriculum-name");
const internationalScoreTextInput = document.getElementById("international-score-text");
const schoolMajorFileInput = document.getElementById("school-major-file");
const schoolMajorImageInput = document.getElementById("school-major-image");
const schoolMajorFileStatus = document.getElementById("school-major-file-status");

let selectedMode = "standard";
let activeQuestions = [];
let questionOrder = [];
let totalPages = 1;
let currentPage = 1;
let answers = {};
let introStep = 1;
let studentProfile = { type: "public", grade: "" };
let publicSubjectScores = { cn: null, math: null, en: null, phy: null, chem: null, bio: null };
let internationalProfile = { curriculumName: "", scoreText: "" };
let schoolMajorText = "";
let authSession = null;

function formatTime(date) {
  return date.toLocaleTimeString("zh-CN", { hour12: false });
}

function setSaveStatus(text) {
  saveStatus.textContent = text;
}

function setSchoolFileStatus(text) {
  schoolMajorFileStatus.textContent = text;
}

function setAuthStatus(text, tone = "neutral") {
  authStatus.textContent = text;
  authStatus.dataset.tone = tone;
}

function normalizeUsername(username) {
  return String(username || "").trim().toLowerCase();
}

function findAuthUser(username, password) {
  const normalizedPassword = String(password || "").trim();
  return AUTH_USERS.find((user) => {
    const expectedUsername = String(user.username || "").trim().toLowerCase();
    const expectedPasswords = Array.isArray(user.password) ? user.password : [user.password];
    return expectedUsername === username && expectedPasswords.map((item) => String(item || "").trim()).includes(normalizedPassword);
  }) || null;
}

function saveAuthSession(session) {
  authSession = session;
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
}

function clearAuthSession() {
  authSession = null;
  localStorage.removeItem(AUTH_STORAGE_KEY);
}

function loadAuthSession() {
  const raw = localStorage.getItem(AUTH_STORAGE_KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    if (!parsed?.username || !parsed?.loggedInAt) return null;
    authSession = parsed;
    return parsed;
  } catch {
    return null;
  }
}

function renderAuthState() {
  if (!AUTH_ENABLED) {
    authGate.classList.add("hidden");
    assessmentShell.classList.remove("hidden");
    authSessionBar.classList.add("hidden");
    return;
  }

  const authed = Boolean(authSession?.username);
  authGate.classList.toggle("hidden", authed);
  assessmentShell.classList.toggle("hidden", !authed);
  authSessionBar.classList.remove("hidden");
  if (authed) {
    authSessionText.textContent = `已登录账号：${authSession.username}`;
  }
}

function selectedStudentType() {
  return studentTypeInputs.find((input) => input.checked)?.value || "public";
}

function readStudentProfile() {
  return {
    type: selectedStudentType(),
    grade: String(gradeInput.value || "").trim()
  };
}

function updateStudentTypeUI() {
  const type = selectedStudentType();
  publicScorePanel.classList.toggle("hidden", type !== "public");
  internationalScorePanel.classList.toggle("hidden", type !== "international");
}

function showIntroStep(step) {
  introStep = clamp(step, 1, 3);
  introPanels.forEach((panel) => {
    panel.classList.toggle("hidden", Number(panel.dataset.introStep) !== introStep);
  });
  updateStudentTypeUI();
}

function emitEvent(name, params) {
  if (typeof window.trackEvent === "function") {
    window.trackEvent(name, params);
  }
}

function saveDraft() {
  studentProfile = readStudentProfile();
  publicSubjectScores = readPublicSubjectScores();
  internationalProfile = readInternationalProfile();
  schoolMajorText = readSchoolMajorText();
  const payload = {
    introStep,
    studentProfile,
    mode: selectedMode,
    questionOrder,
    publicSubjectScores,
    internationalProfile,
    schoolMajorText,
    answers,
    page: currentPage,
    savedAt: new Date().toISOString()
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  setSaveStatus(`评估草稿已保存 ${formatTime(new Date())}`);
}

function buildQuestionOrder(mode, savedOrder = []) {
  const selected = buildSelectedQuestions(mode);
  const selectedIds = new Set(selected.map((q) => q.id));
  const savedValid = Array.isArray(savedOrder)
    && savedOrder.length === selected.length
    && savedOrder.every((id) => selectedIds.has(id));
  if (savedValid) return savedOrder.slice();

  const moduleBuckets = new Map();
  selected.forEach((question) => {
    if (!moduleBuckets.has(question.module)) {
      moduleBuckets.set(question.module, []);
    }
    moduleBuckets.get(question.module).push(question);
  });

  return Array.from(moduleBuckets.keys())
    .sort()
    .flatMap((module) => shuffleArray(moduleBuckets.get(module)).map((question) => question.id));
}

function pickCoverageQuestions(questions, limit) {
  if (questions.length <= limit) return shuffleArray(questions);
  const pool = shuffleArray(questions);
  const selected = [];
  const coveredDims = new Set();

  while (selected.length < limit && pool.length) {
    let bestIndex = 0;
    let bestGain = -1;
    let bestBreadth = -1;

    pool.forEach((question, index) => {
      const gain = question.dimensionSet.filter((dim) => !coveredDims.has(dim)).length;
      const breadth = question.dimensionSet.length;
      if (gain > bestGain || (gain === bestGain && breadth > bestBreadth)) {
        bestGain = gain;
        bestBreadth = breadth;
        bestIndex = index;
      }
    });

    const [picked] = pool.splice(bestIndex, 1);
    selected.push(picked);
    picked.dimensionSet.forEach((dim) => coveredDims.add(dim));
  }

  return selected;
}

function buildSelectedQuestions(mode) {
  if (mode === "full") return allQuestions.slice();
  const output = [];
  Object.entries(STANDARD_LIMITS).forEach(([module, limit]) => {
    const moduleQuestions = allQuestions.filter((question) => question.module === module);
    output.push(...pickCoverageQuestions(moduleQuestions, limit));
  });
  return output;
}

function applyMode(mode, savedOrder = []) {
  selectedMode = mode in MODE_CONFIG ? mode : "standard";
  questionOrder = buildQuestionOrder(selectedMode, savedOrder);
  const orderMap = new Map(questionOrder.map((id, index) => [id, index]));
  activeQuestions = buildSelectedQuestions(selectedMode)
    .slice()
    .sort((a, b) => (orderMap.get(a.id) ?? 0) - (orderMap.get(b.id) ?? 0));
  totalPages = Math.max(1, Math.ceil(activeQuestions.length / ITEMS_PER_PAGE));
  currentPage = Math.min(Math.max(currentPage, 1), totalPages);
}

function loadDraft() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return;
  try {
    const parsed = JSON.parse(raw);
    answers = parsed.answers || {};
    introStep = Number(parsed.introStep) || 1;
    studentProfile = parsed.studentProfile || studentProfile;
    publicSubjectScores = parsed.publicSubjectScores || publicSubjectScores;
    internationalProfile = parsed.internationalProfile || internationalProfile;
    schoolMajorText = parsed.schoolMajorText || "";
    applyMode(parsed.mode || selectedMode, parsed.questionOrder || []);
    currentPage = Number(parsed.page) || 1;
    currentPage = Math.min(Math.max(currentPage, 1), totalPages);
    const modeInput = document.querySelector(`input[name="assessment-mode"][value="${selectedMode}"]`);
    if (modeInput) modeInput.checked = true;
    const studentTypeInput = document.querySelector(`input[name="student-type"][value="${studentProfile.type}"]`);
    if (studentTypeInput) studentTypeInput.checked = true;
    gradeInput.value = studentProfile.grade || "";
    scoreCnInput.value = publicSubjectScores.cn ?? "";
    scoreMathInput.value = publicSubjectScores.math ?? "";
    scoreEnInput.value = publicSubjectScores.en ?? "";
    scorePhyInput.value = publicSubjectScores.phy ?? "";
    scoreChemInput.value = publicSubjectScores.chem ?? "";
    scoreBioInput.value = publicSubjectScores.bio ?? "";
    internationalCurriculumNameInput.value = internationalProfile.curriculumName || "";
    internationalScoreTextInput.value = internationalProfile.scoreText || "";
    setSchoolFileStatus(schoolMajorText ? `已恢复目标学校专业范围（${parseSchoolMajorText(schoolMajorText).length} 个专业）` : "暂未上传文件");
    setSaveStatus("已恢复上次评估草稿");
    showIntroStep(introStep);
  } catch {
    answers = {};
    currentPage = 1;
    introStep = 1;
    applyMode("standard");
  }
}

function clearDraft() {
  answers = {};
  studentProfile = { type: "public", grade: "" };
  publicSubjectScores = { cn: null, math: null, en: null, phy: null, chem: null, bio: null };
  internationalProfile = { curriculumName: "", scoreText: "" };
  schoolMajorText = "";
  introStep = 1;
  const defaultTypeInput = document.querySelector('input[name="student-type"][value="public"]');
  if (defaultTypeInput) defaultTypeInput.checked = true;
  gradeInput.value = "";
  scoreCnInput.value = "";
  scoreMathInput.value = "";
  scoreEnInput.value = "";
  scorePhyInput.value = "";
  scoreChemInput.value = "";
  scoreBioInput.value = "";
  internationalCurriculumNameInput.value = "";
  internationalScoreTextInput.value = "";
  schoolMajorFileInput.value = "";
  schoolMajorImageInput.value = "";
  setSchoolFileStatus("暂未上传文件");
  currentPage = 1;
  selectedMode = "standard";
  const standardModeInput = document.querySelector('input[name="assessment-mode"][value="standard"]');
  if (standardModeInput) standardModeInput.checked = true;
  applyMode("standard");
  questionOrder = [];
  localStorage.removeItem(STORAGE_KEY);
  setSaveStatus("已清空当前记录");
  showIntroStep(1);
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

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function readPublicSubjectScores() {
  const parse = (input) => {
    const text = String(input.value || "").trim();
    if (!text) return null;
    const raw = Number(text);
    if (Number.isNaN(raw)) return null;
    return clamp(raw, 0, 100);
  };
  return {
    cn: parse(scoreCnInput),
    math: parse(scoreMathInput),
    en: parse(scoreEnInput),
    phy: parse(scorePhyInput),
    chem: parse(scoreChemInput),
    bio: parse(scoreBioInput)
  };
}

function readInternationalProfile() {
  return {
    curriculumName: String(internationalCurriculumNameInput.value || "").trim(),
    scoreText: String(internationalScoreTextInput.value || "").trim()
  };
}

function readSchoolMajorText() {
  return String(schoolMajorText || "").trim();
}

function normalizeMajorName(text) {
  return String(text || "")
    .replace(/[（(][^)）]+[)）]/g, "")
    .replace(/[^\u4e00-\u9fa5A-Za-z0-9]/g, "")
    .toLowerCase();
}

function uniqueByName(list) {
  const seen = new Set();
  return list.filter((item) => {
    const key = normalizeMajorName(item.name || item);
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function extractSchoolMajorName(line) {
  const raw = String(line || "").replace(/\u3000/g, " ").trim();
  if (!raw) return "";
  if (/(序号|专业名称|专业代码|招生计划|校区|学制|教学点|计划数|二级学院|专业大类|所在系部|层次|合计)/.test(raw) &&
      !/(工程|技术|管理|设计|会计|乘务|应用|制造|维修|营销)/.test(raw)) {
    return "";
  }

  const cells = raw
    .split(/\t| {2,}|(?<=\d)\s+(?=[\u4e00-\u9fa5A-Za-z])/)
    .map((x) => x.trim().replace(/^\d+[A-Z]?\s*/, ""))
    .filter(Boolean);

  const goodCell = (cell) => {
    if (!/[\u4e00-\u9fa5]/.test(cell)) return false;
    if (/^(序号|合计|高职|校区|教学点|计划数|招生人数合计|新建区校区|经开区校区|湖北校区|白水湖校区|湖东校区)$/.test(cell)) return false;
    return /(工程|技术|管理|设计|会计|乘务|应用|制造|维修|营销|科学|装饰|园林|造价|测量|电子|机电|自动化|物流|媒体|会计|动画)/.test(cell);
  };

  const preferred = cells.find(goodCell);
  if (preferred) return preferred;

  const matches = raw.match(/[\u4e00-\u9fa5A-Za-z]+(?:工程|技术|管理|设计|会计|乘务|应用|制造|维修|营销|科学|装饰|园林|造价|测量|电子|机电|自动化|物流|媒体|动画)/g);
  if (matches && matches.length) {
    return matches
      .map((x) => x.replace(/^\d+[A-Z]?\s*/, ""))
      .sort((a, b) => b.length - a.length)[0];
  }
  return "";
}

function parseSchoolMajorText(rawText) {
  const names = String(rawText || "")
    .split(/\r?\n/)
    .map(extractSchoolMajorName)
    .filter(Boolean);
  return uniqueByName(names.map((name) => ({ name }))).map((item) => item.name);
}

function rowsToSchoolMajorText(rows) {
  return rows
    .map((row) => row.map((cell) => String(cell ?? "").trim()).filter(Boolean).join("\t"))
    .map(extractSchoolMajorName)
    .filter(Boolean)
    .join("\n");
}

function parseDelimitedText(text) {
  return String(text || "")
    .split(/\r?\n/)
    .map((line) => line.split(/,|，|;|；/));
}

function readSchoolMajorFile(file) {
  return new Promise((resolve, reject) => {
    const name = file.name.toLowerCase();
    const reader = new FileReader();

    reader.onerror = () => reject(new Error("文件读取失败"));

    if (name.endsWith(".xlsx") || name.endsWith(".xls")) {
      if (typeof XLSX === "undefined") {
        reject(new Error("Excel 解析组件未加载，请稍后刷新再试"));
        return;
      }
      reader.onload = () => {
        try {
          const data = new Uint8Array(reader.result);
          const workbook = XLSX.read(data, { type: "array" });
          const rows = [];
          workbook.SheetNames.forEach((sheetName) => {
            const sheet = workbook.Sheets[sheetName];
            const sheetRows = XLSX.utils.sheet_to_json(sheet, { header: 1, raw: false, defval: "" });
            rows.push(...sheetRows);
          });
          resolve(rowsToSchoolMajorText(rows));
        } catch {
          reject(new Error("Excel 文件解析失败"));
        }
      };
      reader.readAsArrayBuffer(file);
      return;
    }

    reader.onload = () => {
      try {
        const text = String(reader.result || "");
        const rows = parseDelimitedText(text);
        resolve(rowsToSchoolMajorText(rows));
      } catch {
        reject(new Error("文本文件解析失败"));
      }
    };
    reader.readAsText(file, "utf-8");
  });
}

async function readSchoolMajorImage(file) {
  if (typeof Tesseract === "undefined") {
    throw new Error("图片识别组件未加载，请刷新页面后再试");
  }
  const result = await Tesseract.recognize(file, "chi_sim+eng", {
    logger: (message) => {
      if (message.status === "recognizing text" && typeof message.progress === "number") {
        setSchoolFileStatus(`图片识别中 ${Math.round(message.progress * 100)}%：${file.name}`);
      }
    }
  });
  const text = String(result?.data?.text || "").trim();
  if (!text) {
    throw new Error("图片中未识别到可用文本");
  }
  const lines = text
    .split(/\r?\n/)
    .map((line) => line.replace(/[|｜]/g, " ").replace(/\s{2,}/g, "\t").trim())
    .filter(Boolean)
    .join("\n");
  return parseSchoolMajorText(lines).join("\n");
}

function hasPublicScores(scores) {
  return Object.values(scores).some((v) => typeof v === "number");
}

function parseInternationalScoreValue(line, curriculumName) {
  const rawLine = String(line || "").trim();
  if (!rawLine) return null;
  const upper = rawLine.toUpperCase();
  const curriculum = String(curriculumName || "").toUpperCase();
  const context = `${curriculum} ${upper}`;

  const dseMatch = upper.match(/5\*\*|5\*|[1-5]/);
  if (/DSE/.test(context) && dseMatch) {
    return { "5**": 98, "5*": 94, "5": 90, "4": 82, "3": 72, "2": 62, "1": 52 }[dseMatch[0]] ?? null;
  }

  const aLevelMatch = upper.match(/A\*|[A-E]/);
  if (/(A[\s-]?LEVEL|IGCSE|GCSE)/.test(context) && aLevelMatch) {
    return { "A*": 98, A: 92, B: 84, C: 76, D: 68, E: 60 }[aLevelMatch[0]] ?? null;
  }

  const numericMatches = upper.match(/\d+(?:\.\d+)?/g) || [];
  const lastNumber = numericMatches.length ? Number(numericMatches[numericMatches.length - 1]) : null;
  if (/(IB)/.test(context) && typeof lastNumber === "number") {
    return { 7: 97, 6: 90, 5: 82, 4: 74, 3: 66, 2: 58, 1: 50 }[Math.round(lastNumber)] ?? null;
  }
  if (/(AP)/.test(context) && typeof lastNumber === "number") {
    return { 5: 95, 4: 88, 3: 78, 2: 65, 1: 50 }[Math.round(lastNumber)] ?? null;
  }
  if (typeof lastNumber === "number") {
    if (lastNumber <= 7) return { 7: 97, 6: 90, 5: 82, 4: 74, 3: 66, 2: 58, 1: 50 }[Math.round(lastNumber)] ?? lastNumber * 14;
    if (lastNumber <= 100) return clamp(lastNumber, 0, 100);
  }
  return null;
}

function inferInternationalSubjectBucket(line) {
  const text = String(line || "").toLowerCase();
  if (/(math|mathematics|further math|数学|统计|economics|economy|physics|物理|chem|化学|bio|biology|生物|computer|cs)/.test(text)) return "logic";
  if (/(english|literature|lang|语言|语文|中文|history|历史|global|人文|business|商科|psychology|psych)/.test(text)) return "verbal";
  if (/(art|design|media|visual|music|戏剧|艺术)/.test(text)) return "creative";
  return "general";
}

function parseInternationalScores(curriculumName, scoreText) {
  const lines = String(scoreText || "")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  return lines
    .map((line) => {
      const score = parseInternationalScoreValue(line, curriculumName);
      if (typeof score !== "number") return null;
      return {
        label: line,
        score,
        bucket: inferInternationalSubjectBucket(line)
      };
    })
    .filter(Boolean);
}

function applyPublicSubjectWeight(baseScore, scores) {
  const valid = Object.entries(scores).filter(([, v]) => typeof v === "number");
  if (!valid.length) return { score: baseScore, used: false, summary: "未录入公立学校成绩，结果基于测评画像生成。" };

  const avg = average(valid.map(([, v]) => v));
  const normalized = {
    cn: scores.cn ?? avg,
    math: scores.math ?? avg,
    en: scores.en ?? avg,
    phy: scores.phy ?? avg,
    chem: scores.chem ?? avg,
    bio: scores.bio ?? avg
  };
  const sciAvg = average([normalized.phy, normalized.chem, normalized.bio]);
  const norm = (x) => (x - 60) / 40; // around [-1, 1]
  const deltaByDim = {
    "ability.math": 0.5 * norm(normalized.math) + 0.18 * norm(normalized.phy),
    "ability.stat": 0.35 * norm(normalized.math) + 0.22 * norm(normalized.phy) + 0.18 * norm(normalized.chem),
    "cognition.data": 0.25 * norm(normalized.math) + 0.2 * norm(normalized.phy) + 0.18 * norm(normalized.chem),
    "cognition.abstract": 0.25 * norm(normalized.math) + 0.18 * norm(normalized.phy),
    "cognition.system": 0.18 * norm(normalized.math) + 0.16 * norm(sciAvg),
    "ability.writing": 0.4 * norm(normalized.cn) + 0.15 * norm(normalized.en),
    "cognition.verbal": 0.25 * norm(normalized.cn) + 0.25 * norm(normalized.en),
    "ability.comm": 0.18 * norm(normalized.cn) + 0.2 * norm(normalized.en),
    "interest.i": 0.1 * norm(normalized.phy) + 0.1 * norm(normalized.chem) + 0.14 * norm(normalized.bio),
    "interest.s": 0.06 * norm(normalized.cn) + 0.06 * norm(normalized.en),
    "interest.a": 0.05 * norm(normalized.cn),
    "cognition.contextual": 0.12 * norm(normalized.cn) + 0.08 * norm(normalized.bio),
    "value.responsibility": 0.08 * norm(normalized.cn) + 0.08 * norm(normalized.bio)
  };

  const weighted = { ...baseScore };
  Object.keys(deltaByDim).forEach((dim) => {
    weighted[dim] = clamp((weighted[dim] || 0) + deltaByDim[dim] * 0.12, 0, 1);
  });

  const topSub = Object.entries(normalized)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 2)
    .map(([k, v]) => `${({ cn: "语文", math: "数学", en: "英语", phy: "物理", chem: "化学", bio: "生物" }[k])}${Math.round(v)}分`)
    .join("、");

  return {
    score: weighted,
    used: true,
    summary: `已启用公立学校成绩加权（${topSub}）。`
  };
}

function applyInternationalSubjectWeight(baseScore, profile) {
  const entries = parseInternationalScores(profile.curriculumName, profile.scoreText);
  if (!entries.length) {
    return { score: baseScore, used: false, summary: "未识别到有效国际课程成绩，结果基于测评画像生成。" };
  }

  const avg = average(entries.map((entry) => entry.score));
  const norm = (x) => (x - 60) / 40;
  const weighted = { ...baseScore };
  const bucketAverage = (bucket) => {
    const values = entries.filter((entry) => entry.bucket === bucket).map((entry) => entry.score);
    return values.length ? average(values) : avg;
  };
  const logic = bucketAverage("logic");
  const verbal = bucketAverage("verbal");
  const creative = bucketAverage("creative");
  const general = bucketAverage("general");
  const deltaByDim = {
    "ability.math": 0.3 * norm(logic) + 0.12 * norm(avg),
    "ability.stat": 0.24 * norm(logic) + 0.1 * norm(avg),
    "cognition.data": 0.2 * norm(logic) + 0.08 * norm(general),
    "cognition.abstract": 0.18 * norm(logic) + 0.12 * norm(avg),
    "cognition.system": 0.16 * norm(logic) + 0.1 * norm(avg),
    "ability.writing": 0.22 * norm(verbal) + 0.08 * norm(creative),
    "cognition.verbal": 0.25 * norm(verbal),
    "ability.comm": 0.12 * norm(verbal) + 0.08 * norm(general),
    "interest.a": 0.1 * norm(creative),
    "interest.i": 0.1 * norm(logic),
    "value.responsibility": 0.1 * norm(avg)
  };

  Object.keys(deltaByDim).forEach((dim) => {
    weighted[dim] = clamp((weighted[dim] || 0) + deltaByDim[dim] * 0.12, 0, 1);
  });

  const curriculumLabel = profile.curriculumName || "国际课程";
  const topEntries = entries
    .slice()
    .sort((a, b) => b.score - a.score)
    .slice(0, 2)
    .map((entry) => entry.label)
    .join("、");

  return {
    score: weighted,
    used: true,
    summary: `已启用${curriculumLabel}成绩加权（${topEntries || `平均分约 ${Math.round(avg)} 分`}）。`
  };
}

function applySubjectWeight(baseScore) {
  studentProfile = readStudentProfile();
  publicSubjectScores = readPublicSubjectScores();
  internationalProfile = readInternationalProfile();
  if (studentProfile.type === "international") {
    return applyInternationalSubjectWeight(baseScore, internationalProfile);
  }
  return applyPublicSubjectWeight(baseScore, publicSubjectScores);
}

function getStudentTypeLabel(type) {
  return type === "international" ? "国际学生" : "公立学校学生";
}

function getCurriculumSummary() {
  if (studentProfile.type === "international") {
    return internationalProfile.curriculumName || "国际课程信息未填写";
  }
  const filled = Object.entries(publicSubjectScores)
    .filter(([, value]) => typeof value === "number")
    .map(([key, value]) => `${({ cn: "语文", math: "数学", en: "英语", phy: "物理", chem: "化学", bio: "生物" }[key])}${Math.round(value)}`);
  return filled.length ? `已录入公立成绩 ${filled.slice(0, 3).join(" / ")}` : "公立成绩信息未填写";
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

const majorMap = new Map(majors.map((major) => [normalizeMajorName(major.name), major]));

function blendVectors(refs) {
  const vector = {};
  const totalWeight = refs.reduce((sum, [, weight]) => sum + weight, 0) || 1;
  dimensionKeys.forEach((dim) => {
    const sum = refs.reduce((acc, [majorName, weight]) => {
      const ref = majorMap.get(normalizeMajorName(majorName));
      return acc + ((ref?.vector?.[dim] || 0) * weight);
    }, 0);
    vector[dim] = clamp01(sum / totalWeight);
  });
  return vector;
}

function createSchoolMajorProfile(displayName, refs, options = {}) {
  const vector = blendVectors(refs);
  Object.entries(options.delta || {}).forEach(([dim, delta]) => {
    vector[dim] = clamp01((vector[dim] || 0) + delta);
  });
  return {
    name: displayName,
    category: options.category || refs.map(([name]) => name).join(" / "),
    courses: options.courses || "按院校培养方案为准",
    careers: options.careers || "建议结合岗位方向与课程结构综合判断",
    vector,
    coreDims: options.coreDims || [],
    sourceRef: refs.map(([name]) => name).join(" + ")
  };
}

const SCHOOL_MAJOR_RULES = [
  { pattern: /工程造价/, refs: [["工业工程", 0.55], ["财务管理", 0.45]], options: { category: "土木建筑 / 管理", courses: "工程计量/预算/招投标", careers: "造价/资料/项目管理", coreDims: ["interest.c", "cognition.data", "ability.comm", "value.responsibility"] } },
  { pattern: /汽车技术服务与营销/, refs: [["市场营销", 0.65], ["车辆工程", 0.35]], options: { category: "装备制造 / 服务运营", courses: "汽车服务/客户沟通/营销", careers: "汽车服务顾问/门店运营", coreDims: ["interest.s", "interest.e", "ability.comm", "value.responsibility"] } },
  { pattern: /智能水务管理/, refs: [["公共管理", 0.55], ["土木工程", 0.45]], options: { category: "水利 / 管理", courses: "水务运营/流程管理/基础工程", careers: "水务运营/项目协同", coreDims: ["interest.s", "interest.c", "cognition.system", "value.responsibility"] } },
  { pattern: /大数据与会计/, refs: [["会计学", 0.7], ["数据科学与大数据技术", 0.3]], options: { category: "财经 / 数据", courses: "会计实务/数据分析", careers: "财务数据/业务分析", coreDims: ["interest.c", "cognition.data", "ability.stat", "value.responsibility"] } },
  { pattern: /空中乘务/, refs: [["市场营销", 0.4], ["传播学", 0.3], ["人力资源管理", 0.3]], options: { category: "交通运输 / 服务", courses: "服务礼仪/沟通/应急", careers: "客舱服务/地面服务", coreDims: ["interest.s", "ability.comm", "risk.pressure", "value.responsibility"] } },
  { pattern: /建筑工程技术/, refs: [["土木工程", 0.7], ["工业工程", 0.3]], options: { category: "土木建筑", courses: "施工技术/项目现场/识图", careers: "施工管理/现场技术", coreDims: ["interest.r", "cognition.spatial", "ability.focus", "interest.c"] } },
  { pattern: /建筑装饰工程技术/, refs: [["建筑学", 0.55], ["环境设计", 0.45]], options: { category: "土木建筑 / 设计", courses: "装饰设计/材料/施工", careers: "装饰设计/项目落地", coreDims: ["interest.a", "cognition.spatial", "ability.comm", "interest.r"] } },
  { pattern: /园林工程技术/, refs: [["建筑学", 0.45], ["环境设计", 0.3], ["生物科学", 0.25]], options: { category: "园林 / 工程", courses: "景观/植物/施工", careers: "园林施工/景观助理", coreDims: ["interest.a", "interest.r", "cognition.spatial", "value.responsibility"] } },
  { pattern: /水利水电建筑工程|水利工程|水文与水资源技术|智慧水利技术|给排水工程技术|水利水电工程技术|水利机电设备智能管理|港口与航道工程技术/, refs: [["土木工程", 0.75], ["电气工程及其自动化", 0.25]], options: { category: "水利 / 工程", courses: "工程基础/施工/设备", careers: "工程技术/现场管理", coreDims: ["interest.r", "cognition.system", "ability.math", "ability.focus"] } },
  { pattern: /水生态修复技术/, refs: [["生物科学", 0.45], ["土木工程", 0.35], ["环境设计", 0.2]], options: { category: "生态 / 工程", courses: "生态修复/监测/施工", careers: "生态治理/项目实施", coreDims: ["interest.i", "interest.r", "value.responsibility", "cognition.contextual"] } },
  { pattern: /人工智能技术应用|计算机应用技术|物联网应用技术|应用电子技术/, refs: [["计算机科学与技术", 0.55], ["软件工程", 0.45]], options: { category: "信息技术", courses: "编程/系统/应用开发", careers: "实施/开发/技术支持", coreDims: ["cognition.data", "ability.math", "interest.r", "cognition.system"] } },
  { pattern: /数字媒体技术|动漫制作技术|视觉传达设计|环境艺术设计/, refs: [["网络与新媒体", 0.35], ["视觉传达设计", 0.65]], options: { category: "数字媒体 / 设计", courses: "内容制作/视觉设计/工具应用", careers: "设计执行/内容制作", coreDims: ["interest.a", "ability.writing", "cognition.spatial", "ability.comm"] } },
  { pattern: /电力系统自动化技术|电气自动化技术/, refs: [["电气工程及其自动化", 0.7], ["自动化", 0.3]], options: { category: "装备制造 / 电气", courses: "电路/控制/设备", careers: "自动化实施/运维", coreDims: ["interest.r", "ability.math", "cognition.system", "ability.focus"] } },
  { pattern: /机电一体化技术|数控技术|机械制造及自动化|新能源汽车技术|汽车制造与试验技术|无人机应用技术/, refs: [["机械设计制造及其自动化", 0.55], ["自动化", 0.45]], options: { category: "装备制造", courses: "机械/控制/设备应用", careers: "制造/设备调试/技术员", coreDims: ["interest.r", "cognition.spatial", "ability.math", "ability.focus"] } },
  { pattern: /道路与桥梁工程技术|道路养护与管理|工程测量技术|测绘地理信息技术|智能交通技术/, refs: [["土木工程", 0.65], ["工业工程", 0.35]], options: { category: "交通 / 工程", courses: "测量/施工/运维管理", careers: "施工测量/项目协调", coreDims: ["interest.r", "cognition.system", "interest.c", "ability.focus"] } },
  { pattern: /汽车检测与维修技术/, refs: [["车辆工程", 0.65], ["机械设计制造及其自动化", 0.35]], options: { category: "交通运输 / 维修", courses: "故障诊断/检测/维修", careers: "维修技术/售后诊断", coreDims: ["interest.r", "cognition.spatial", "ability.focus", "ability.math"] } }
];

function getSchoolMajorProfile(programName) {
  const exact = majorMap.get(normalizeMajorName(programName));
  if (exact) {
    return { ...exact, name: programName, sourceRef: exact.name };
  }

  const matchedRule = SCHOOL_MAJOR_RULES.find((rule) => rule.pattern.test(programName));
  if (matchedRule) {
    return createSchoolMajorProfile(programName, matchedRule.refs, matchedRule.options);
  }

  if (/管理/.test(programName)) {
    return createSchoolMajorProfile(programName, [["公共管理", 0.55], ["工业工程", 0.45]], {
      category: "管理 / 应用",
      courses: "流程管理/组织协同/基础实务",
      careers: "运营/项目支持/执行管理",
      coreDims: ["interest.s", "interest.c", "ability.comm", "value.responsibility"]
    });
  }
  if (/营销/.test(programName)) {
    return createSchoolMajorProfile(programName, [["市场营销", 0.75], ["传播学", 0.25]], {
      category: "市场 / 服务",
      courses: "沟通/客户/营销执行",
      careers: "销售/运营/客户服务",
      coreDims: ["interest.e", "interest.s", "ability.comm", "ability.writing"]
    });
  }
  if (/会计/.test(programName)) {
    return createSchoolMajorProfile(programName, [["会计学", 0.8], ["财务管理", 0.2]], {
      category: "财经",
      courses: "会计核算/财务分析",
      careers: "财务/出纳/数据支持",
      coreDims: ["interest.c", "cognition.data", "ability.stat", "value.responsibility"]
    });
  }
  return null;
}

function rankSchoolMajors(studentScore, rawText) {
  const names = parseSchoolMajorText(rawText);
  if (!names.length) return null;
  const profiles = uniqueByName(names.map(getSchoolMajorProfile).filter(Boolean));
  if (!profiles.length) {
    return { inputCount: names.length, names, matchedCount: 0, unmatchedCount: names.length, ranked: [] };
  }
  const ranked = profiles.map((major, idx) => {
    const dist = squaredDistance(studentScore, major.vector);
    return { ...major, _dist: dist, _idx: idx };
  });
  const distances = ranked.map((x) => x._dist);
  const minDist = Math.min(...distances);
  const maxDist = Math.max(...distances);
  ranked.forEach((major) => {
    const score01 = maxDist === minDist ? 0.5 : 1 - (major._dist - minDist) / (maxDist - minDist);
    major.matchIndex = Math.round(score01 * 100);
    major.rankScore = score01 + (major._idx + 1) * 0.000001;
  });
  ranked.sort((a, b) => b.rankScore - a.rankScore);
  return {
    inputCount: names.length,
    names,
    matchedCount: profiles.length,
    unmatchedCount: Math.max(0, names.length - profiles.length),
    ranked
  };
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

function getMajorCoreDims(major, topN = 4) {
  if (major.coreDims && major.coreDims.length) return major.coreDims.slice(0, topN);
  return dimensionKeys
    .map((dim) => ({ dim, value: major.vector?.[dim] || 0 }))
    .sort((a, b) => b.value - a.value)
    .slice(0, topN)
    .map((item) => item.dim);
}

function buildEvidence(major, studentScore) {
  const core = getMajorCoreDims(major);
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

function formatDimensionScore(dim, studentScore) {
  return `${dimensionNameMap[dim] || dim}${Math.round((studentScore[dim] || 0) * 100)}分`;
}

function buildMajorNarrative(major, studentScore) {
  const core = getMajorCoreDims(major);
  const rankedCore = core
    .map((dim) => ({ dim, value: Math.round((studentScore[dim] || 0) * 100) }))
    .sort((a, b) => b.value - a.value);
  const topCore = rankedCore.slice(0, 2);
  const weakCore = rankedCore.filter((item) => item.value < 50).slice(0, 1);
  const topText = topCore.map((item) => formatDimensionScore(item.dim, studentScore)).join("、");
  const weakText = weakCore.map((item) => formatDimensionScore(item.dim, studentScore)).join("、");
  const topMeta = topCore.map((item) => dimensionMetaMap[item.dim]?.strengthText).filter(Boolean);
  const weakMeta = weakCore.map((item) => dimensionMetaMap[item.dim]?.riskText).filter(Boolean);

  return {
    fit: `${major.name} 更匹配你当前的 ${topText}，这和它要求的 ${major.courses} 比较贴合。`,
    edge: topMeta[0] || `${major.name} 可作为当前优先评估方向。`,
    caution: weakText
      ? `继续往这个方向走时，要特别留意 ${weakText}。${weakMeta[0] || ""}`.trim()
      : "当前没有明显的核心短板，后续重点观察真实投入感和持续性。"
  };
}

function buildChoiceComparison(topMajors, studentScore) {
  if (!topMajors[1]) return "";
  const [first, second] = topMajors;
  const firstCore = getMajorCoreDims(first);
  const secondCore = getMajorCoreDims(second);
  const firstOnly = firstCore.filter((dim) => !secondCore.includes(dim));
  const secondOnly = secondCore.filter((dim) => !firstCore.includes(dim));
  const pickBest = (dims) => dims
    .map((dim) => ({ dim, value: studentScore[dim] || 0 }))
    .sort((a, b) => b.value - a.value)[0];
  const firstLead = pickBest(firstOnly);
  const secondLead = pickBest(secondOnly);
  if (!firstLead && !secondLead) {
    return `${first.name} 与 ${second.name} 的整体方向接近，建议重点比较培养方案、课程结构与未来岗位场景。`;
  }
  if (firstLead && secondLead) {
    return `${first.name} 更看重 ${dimensionNameMap[firstLead.dim] || firstLead.dim}，而 ${second.name} 更看重 ${dimensionNameMap[secondLead.dim] || secondLead.dim}。按你当前画像，前者略占优势。`;
  }
  const lead = firstLead || secondLead;
  const leadMajor = firstLead ? first.name : second.name;
  return `${leadMajor} 在 ${dimensionNameMap[lead.dim] || lead.dim} 这一要求上更鲜明，这也是它与相近方向拉开差异的地方。`;
}

function buildReverseAdvice(rankedMajors, studentScore) {
  const lowDims = dimensionKeys
    .map((dim) => ({ dim, value: studentScore[dim] || 0 }))
    .sort((a, b) => a.value - b.value)
    .slice(0, 3);
  const cautionMajors = rankedMajors
    .slice(-3)
    .reverse()
    .map((major) => {
      const weakMatches = getMajorCoreDims(major)
        .map((dim) => ({ dim, value: studentScore[dim] || 0 }))
        .sort((a, b) => a.value - b.value)
        .slice(0, 2)
        .filter((item) => item.value < 0.5);
      return { major, weakMatches };
    })
    .filter((item) => item.weakMatches.length);

  if (!cautionMajors.length) return "";

  const dimText = lowDims.map((item) => dimensionNameMap[item.dim] || item.dim).join("、");
  const majorText = cautionMajors
    .slice(0, 2)
    .map(({ major, weakMatches }) => `${major.name}（对 ${weakMatches.map((x) => dimensionNameMap[x.dim] || x.dim).join(" / ")} 要求更高）`)
    .join("；");

  return `从当前画像看，不建议将强依赖 ${dimText} 的方向作为第一志愿优先填报，例如 ${majorText}。如后续仍希望考虑此类路径，建议先通过课程体验、项目实践或阶段性训练，进一步评估相关能力是否能够稳定提升。`;
}

function getFitTone(score) {
  if (score >= 75) return { tone: "high", label: "校内优先建议" };
  if (score >= 58) return { tone: "medium", label: "校内重点比较" };
  return { tone: "low", label: "校内审慎评估" };
}

function buildRadarProfile(studentScore) {
  const val = (n) => Math.round((n || 0) * 100);
  return [
    { key: "research", label: "研究探索", value: val((studentScore["interest.i"] + studentScore["cognition.abstract"]) / 2) },
    { key: "practice", label: "实作执行", value: val((studentScore["interest.r"] + studentScore["ability.focus"]) / 2) },
    { key: "creative", label: "创意表达", value: val((studentScore["interest.a"] + studentScore["ability.writing"]) / 2) },
    { key: "social", label: "社会协作", value: val((studentScore["interest.s"] + studentScore["ability.comm"]) / 2) },
    { key: "leadership", label: "领导经营", value: val((studentScore["interest.e"] + studentScore["value.influence"]) / 2) },
    { key: "order", label: "规则秩序", value: val((studentScore["interest.c"] + studentScore["cognition.system"]) / 2) },
    { key: "logic", label: "数据逻辑", value: val((studentScore["cognition.data"] + studentScore["ability.math"] + studentScore["ability.stat"]) / 3) },
    { key: "resilience", label: "韧性稳定", value: val((studentScore["risk.pressure"] + studentScore["risk.stability"] + studentScore["value.security"]) / 3) }
  ];
}

function buildPersonaPreviewVector(base = {}) {
  return {
    "interest.r": 0.45,
    "interest.i": 0.45,
    "interest.a": 0.45,
    "interest.s": 0.45,
    "interest.e": 0.45,
    "interest.c": 0.45,
    "cognition.data": 0.45,
    "cognition.verbal": 0.45,
    "cognition.abstract": 0.45,
    "cognition.system": 0.45,
    "cognition.spatial": 0.45,
    "cognition.contextual": 0.45,
    "ability.math": 0.45,
    "ability.stat": 0.45,
    "ability.writing": 0.45,
    "ability.comm": 0.45,
    "ability.focus": 0.45,
    "ability.memory": 0.45,
    "risk.stability": 0.45,
    "risk.pressure": 0.45,
    "value.wealth": 0.45,
    "value.influence": 0.45,
    "value.responsibility": 0.45,
    "value.security": 0.45,
    ...base
  };
}

function getPreviewPersona() {
  const personas = {
    engineering: {
      type: "public",
      grade: "高二",
      scores: { cn: 112, math: 136, en: 128, phy: 92, chem: 88, bio: 81 },
      summary: "已启用公立学校成绩加权（数学、英语）。",
      vector: buildPersonaPreviewVector({
        "interest.r": 0.82,
        "interest.i": 0.72,
        "interest.c": 0.7,
        "cognition.abstract": 0.86,
        "cognition.system": 0.84,
        "ability.math": 0.88,
        "ability.focus": 0.8,
        "risk.pressure": 0.72
      })
    },
    creative: {
      type: "international",
      grade: "G11",
      curriculumName: "A-Level",
      scoreText: "English A, Media A, Art A*, Economics A",
      summary: "已启用 A-Level 成绩加权（English、Art）。",
      vector: buildPersonaPreviewVector({
        "interest.a": 0.9,
        "interest.s": 0.62,
        "cognition.verbal": 0.84,
        "ability.writing": 0.88,
        "ability.comm": 0.8,
        "value.influence": 0.76
      })
    }
  };
  const params = new URLSearchParams(window.location.search);
  const key = params.get("persona") || "engineering";
  return personas[key] || personas.engineering;
}

function maybeRenderPreviewReport() {
  const params = new URLSearchParams(window.location.search);
  if (params.get("preview_report") !== "1") return false;

  const preview = getPreviewPersona();
  selectedMode = "full";
  applyMode("full");
  studentProfile = { type: preview.type, grade: preview.grade };
  publicSubjectScores = preview.scores || { cn: null, math: null, en: null, phy: null, chem: null, bio: null };
  internationalProfile = {
    curriculumName: preview.curriculumName || "",
    scoreText: preview.scoreText || ""
  };
  schoolMajorText = "";

  authGate?.classList.add("hidden");
  assessmentShell?.classList.remove("hidden");
  intro?.classList.add("hidden");
  quizForm?.classList.add("hidden");
  resultBox?.classList.remove("hidden");

  const rankedMajors = rankMajors(preview.vector);
  renderResult({ score: preview.vector }, rankedMajors, preview.summary, null);
  return true;
}

function getHollandCode(studentScore) {
  const map = [
    { k: "interest.r", c: "R" },
    { k: "interest.i", c: "I" },
    { k: "interest.a", c: "A" },
    { k: "interest.s", c: "S" },
    { k: "interest.e", c: "E" },
    { k: "interest.c", c: "C" }
  ];
  return map
    .map((x) => ({ ...x, v: studentScore[x.k] || 0 }))
    .sort((a, b) => b.v - a.v)
    .slice(0, 3)
    .map((x) => x.c)
    .join("");
}

function drawRadarChart(canvasId, profile) {
  const canvas = document.getElementById(canvasId);
  if (!(canvas instanceof HTMLCanvasElement)) return;

  const dpr = window.devicePixelRatio || 1;
  const cssSize = 360;
  canvas.width = cssSize * dpr;
  canvas.height = cssSize * dpr;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  ctx.scale(dpr, dpr);

  const size = cssSize;
  const cx = size / 2;
  const cy = size / 2;
  const radius = 120;
  const steps = 5;
  const count = profile.length;

  ctx.clearRect(0, 0, size, size);

  for (let s = 1; s <= steps; s += 1) {
    const r = (radius * s) / steps;
    ctx.beginPath();
    for (let i = 0; i < count; i += 1) {
      const angle = -Math.PI / 2 + (2 * Math.PI * i) / count;
      const x = cx + Math.cos(angle) * r;
      const y = cy + Math.sin(angle) * r;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.strokeStyle = "#eadfcd";
    ctx.lineWidth = 1;
    ctx.stroke();
  }

  for (let i = 0; i < count; i += 1) {
    const angle = -Math.PI / 2 + (2 * Math.PI * i) / count;
    const x = cx + Math.cos(angle) * radius;
    const y = cy + Math.sin(angle) * radius;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(x, y);
    ctx.strokeStyle = "#eadfcd";
    ctx.stroke();
  }

  ctx.beginPath();
  for (let i = 0; i < count; i += 1) {
    const angle = -Math.PI / 2 + (2 * Math.PI * i) / count;
    const r = (radius * profile[i].value) / 100;
    const x = cx + Math.cos(angle) * r;
    const y = cy + Math.sin(angle) * r;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();
  ctx.fillStyle = "rgba(199, 107, 36, 0.25)";
  ctx.fill();
  ctx.strokeStyle = "#8f3f1f";
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.fillStyle = "#6b7280";
  ctx.font = "12px sans-serif";
  for (let i = 0; i < count; i += 1) {
    const angle = -Math.PI / 2 + (2 * Math.PI * i) / count;
    const x = cx + Math.cos(angle) * (radius + 18);
    const y = cy + Math.sin(angle) * (radius + 18);
    ctx.textAlign = x < cx - 4 ? "right" : x > cx + 4 ? "left" : "center";
    ctx.textBaseline = y < cy ? "bottom" : "top";
    ctx.fillText(profile[i].label, x, y);
  }
}

function renderResult(studentVector, rankedMajors, weightingSummary, schoolRecommendation) {
  const topTraits = getTopDimensions(studentVector.score, 3);
  const traitText = topTraits.map((t) => `${t.label} ${t.score}分`).join("、");
  const radarProfile = buildRadarProfile(studentVector.score);
  const hollandCode = getHollandCode(studentVector.score);
  const top3 = rankedMajors.slice(0, 3);
  const choiceComparison = buildChoiceComparison(top3, studentVector.score);
  const reverseAdvice = buildReverseAdvice(rankedMajors, studentVector.score);
  const tieTop = (top3[0].matchIndex - top3[1].matchIndex) <= 3;

  const rankNames = tieTop
    ? ["优先方向一", "优先方向二", "补充参考方向"]
    : ["建议优先方向", "建议次优方向", "补充参考方向"];

  const cards = top3
    .map((major, index) => {
      const ev = buildEvidence(major, studentVector.score);
      const narrative = buildMajorNarrative(major, studentVector.score);
      const headline =
        index === 0 && tieTop
          ? `${major.name} 与另一方向匹配度接近，建议结合学科成绩与实践经历做进一步判断。`
          : `${major.name} 当前与学生画像匹配度较高，可列为优先考虑方向。`;
      return `
      <article class="rank-card">
        <div class="rank-card-top">
          <div>
            <p class="rank-label">${rankNames[index]}</p>
            <h3>${major.name}</h3>
          </div>
          <p class="score">${major.matchIndex} / 100</p>
        </div>
        <p class="rank-summary">${headline}</p>
        <div class="rank-meta-grid">
          <span>学科门类：${major.category}</span>
          <span>课程关键词：${major.courses}</span>
          <span>典型去向：${major.careers}</span>
        </div>
        <p class="evidence"><strong>核心判断：</strong>${narrative.fit}</p>
        <p class="evidence"><strong>匹配亮点：</strong>${narrative.edge}</p>
        <p class="evidence"><strong>匹配依据：</strong>${ev.positives.join("、") || "综合匹配度较高"}</p>
        <details class="rank-details">
          <summary>查看详细解释</summary>
          <p class="risk"><strong>继续验证时重点看：</strong>${narrative.caution}</p>
          <p class="risk"><strong>风险提示：</strong>${ev.risks.join("、") || "当前未见明显核心短板，可持续观察学业压力承受度"}</p>
        </details>
      </article>
    `;
    })
    .join("");

  const summaryTitle = tieTop
    ? `建议重点比较：${top3[0].name} 与 ${top3[1].name}`
    : `建议优先关注：${top3[0].name}`;
  const summaryText = tieTop
    ? "两条方向当前都具备较强匹配性，建议结合学科基础、培养方案与未来发展路径做最终判断。"
    : `${top3[0].name} 与当前学生画像的整体匹配度最高，可作为优先评估方向；其余方向适合作为补充比较对象。`;
  const comparisonHTML = choiceComparison
    ? `
    <section class="advice">
      <h3>优先方向之间的关键差异</h3>
      <p>${choiceComparison}</p>
    </section>
  `
    : "";
  const reverseAdviceHTML = reverseAdvice
    ? `
    <section class="advice">
      <h3>当前不建议优先考虑的方向</h3>
      <p>${reverseAdvice}</p>
    </section>
  `
    : "";
  const studentSummaryCards = `
    <div class="student-summary-grid">
      <article class="student-summary-card">
        <span class="student-summary-label">学生类型</span>
        <strong>${getStudentTypeLabel(studentProfile.type)}</strong>
      </article>
      <article class="student-summary-card">
        <span class="student-summary-label">当前年级</span>
        <strong>${studentProfile.grade || "未填写"}</strong>
      </article>
      <article class="student-summary-card">
        <span class="student-summary-label">课程背景</span>
        <strong>${getCurriculumSummary()}</strong>
      </article>
      <article class="student-summary-card">
        <span class="student-summary-label">评估版本</span>
        <strong>${MODE_CONFIG[selectedMode].label}</strong>
      </article>
    </div>
  `;

  const schoolRestrictedHTML = schoolRecommendation?.ranked?.length
    ? `
    <section class="restricted-section">
      <h3>目标学校范围内的替代建议</h3>
      <p class="restricted-note">理想专业用于判断学生的总体适配方向；以下结果用于回答“如果仅在目标学校现有专业中选择，哪些方向与学生画像更接近”。</p>
      <p class="restricted-source">已识别目标学校专业 ${schoolRecommendation.matchedCount} 个${schoolRecommendation.unmatchedCount ? `，另有 ${schoolRecommendation.unmatchedCount} 个名称暂未完成匹配` : ""}。</p>
      <div class="rank-grid">
        ${schoolRecommendation.ranked.slice(0, 3).map((major, index) => {
          const fit = getFitTone(major.matchIndex);
          const ev = buildEvidence(major, studentVector.score);
          return `
            <article class="rank-card">
              <div class="rank-card-top">
                <div>
                  <p class="rank-label">${index === 0 ? "校内优先建议" : index === 1 ? "校内次优建议" : "校内补充参考"}</p>
                  <h3>${major.name}</h3>
                </div>
                <div>
                  <p class="score">${major.matchIndex} / 100</p>
                  <span class="fit-badge fit-${fit.tone}">${fit.label}</span>
                </div>
              </div>
              <p class="rank-summary">在目标学校可报范围内，${major.name} 是当前与学生画像相对更接近的替代方向。</p>
              <div class="rank-meta-grid">
                <span>校内替代类型：${major.category}</span>
                <span>课程关键词：${major.courses}</span>
                <span>典型去向：${major.careers}</span>
              </div>
              <p class="evidence"><strong>替代依据：</strong>${ev.positives.join("、") || "与学生画像的相对距离较近"}</p>
              <p class="mapping-note"><strong>匹配参照：</strong>${major.sourceRef || "关键词映射"}</p>
            </article>
          `;
        }).join("")}
      </div>
      <p class="mapping-note"><strong>使用建议：</strong>如果理想方向与校内可报专业差异较大，建议优先考虑“偏管理、偏服务、偏应用协同”的专业；不建议仅为进入学校而优先选择与学生画像明显不一致的高强度技术研发方向。</p>
    </section>
  `
    : schoolMajorText
      ? `
      <section class="restricted-section">
        <h3>目标学校范围内的替代建议</h3>
        <p class="restricted-note">系统已检测到目标学校专业名单，但当前完成识别的专业名称仍然较少。建议按“一行一个专业名称”的方式重新粘贴，例如：工程造价、建筑工程技术、电气自动化技术。</p>
      </section>
    `
      : "";

  resultBox.innerHTML = `
    <div class="result-header">
      <p class="result-kicker">评估结论</p>
      <h2>${summaryTitle}</h2>
      <p class="result-summary">${summaryText}</p>
      ${studentSummaryCards}
      <div class="summary-chips">
        <span>优势特征：${traitText}</span>
        <span>${weightingSummary}</span>
        <span>Holland：${hollandCode}</span>
      </div>
      <p class="result-meta">综合画像采用 8 维模型：6维兴趣（Holland）+ 2维能力韧性（选专业更实用）。</p>
    </div>
    <div class="result-tools">
      <button type="button" id="export-pdf-btn" class="btn btn-ghost">导出 PDF（打印版）</button>
    </div>
    <div class="radar-wrap">
      <canvas id="profile-radar" width="360" height="360"></canvas>
      <div class="radar-legend">
        ${radarProfile.map((x) => `<span>${x.label} ${x.value}</span>`).join("")}
      </div>
    </div>
    <div class="rank-grid">${cards}</div>
    ${comparisonHTML}
    ${reverseAdviceHTML}
    ${schoolRestrictedHTML}
  `;
  drawRadarChart("profile-radar", radarProfile);
}

function validateIntroStep(step) {
  const profile = readStudentProfile();
  if (step === 1) {
    if (!profile.grade) {
      alert("请先填写当前年级。");
      return false;
    }
    return true;
  }

  if (step === 2) {
    if (profile.type === "international") {
      const intl = readInternationalProfile();
      if (!intl.curriculumName) {
        alert("请先填写国际课程名称。");
        return false;
      }
      if (!parseInternationalScores(intl.curriculumName, intl.scoreText).length) {
        alert("请至少填写一门可识别的国际课程成绩。");
        return false;
      }
      return true;
    }
    if (!hasPublicScores(readPublicSubjectScores())) {
      alert("请至少填写一门公立学校学科成绩。");
      return false;
    }
  }
  return true;
}

loginBtn.addEventListener("click", () => {
  const username = normalizeUsername(authUsernameInput.value);
  const password = String(authPasswordInput.value || "").trim();
  authUsernameInput.value = username;
  authPasswordInput.value = password;

  if (!username) {
    setAuthStatus("请输入用户名", "error");
    return;
  }
  if (!password) {
    setAuthStatus("请输入密码", "error");
    return;
  }

  const matchedUser = findAuthUser(username, password);
  if (!matchedUser) {
    setAuthStatus("用户名或密码错误", "error");
    return;
  }

  saveAuthSession({
    username,
    loggedInAt: new Date().toISOString()
  });
  authPasswordInput.value = "";
  renderAuthState();
  setAuthStatus("登录成功", "success");
});

logoutBtn.addEventListener("click", () => {
  clearAuthSession();
  renderAuthState();
  authPasswordInput.value = "";
  setAuthStatus("请输入用户名和密码", "neutral");
});

introNext1Btn.addEventListener("click", () => {
  if (!validateIntroStep(1)) return;
  showIntroStep(2);
  saveDraft();
});

introPrev2Btn.addEventListener("click", () => {
  showIntroStep(1);
  saveDraft();
});

introNext2Btn.addEventListener("click", () => {
  if (!validateIntroStep(2)) return;
  showIntroStep(3);
  saveDraft();
});

introPrev3Btn.addEventListener("click", () => {
  showIntroStep(2);
  saveDraft();
});

startBtn.addEventListener("click", () => {
  if (!validateIntroStep(1) || !validateIntroStep(2)) return;
  const modeInput = document.querySelector('input[name="assessment-mode"]:checked');
  applyMode(modeInput ? modeInput.value : "standard");
  studentProfile = readStudentProfile();
  publicSubjectScores = readPublicSubjectScores();
  internationalProfile = readInternationalProfile();
  schoolMajorText = readSchoolMajorText();
  intro.classList.add("hidden");
  quizForm.classList.remove("hidden");
  renderCurrentPage();
  updateProgress();
  saveDraft();
  emitEvent("start_assessment", {
    mode: selectedMode,
    student_type: studentProfile.type,
    grade: studentProfile.grade,
    question_count: activeQuestions.length,
    subject_score_filled: studentProfile.type === "international"
      ? Boolean(parseInternationalScores(internationalProfile.curriculumName, internationalProfile.scoreText).length)
      : hasPublicScores(publicSubjectScores),
    school_restricted_mode: Boolean(schoolMajorText)
  });
});

quizForm.addEventListener("change", (event) => {
  const target = event.target;
  if (target instanceof HTMLInputElement && target.type === "radio") {
    answers[target.name] = target.value;
    saveDraft();
    updateProgress();
  }
});

[gradeInput, internationalCurriculumNameInput, internationalScoreTextInput, scoreCnInput, scoreMathInput, scoreEnInput, scorePhyInput, scoreChemInput, scoreBioInput].forEach((input) => {
  input.addEventListener("input", () => {
    studentProfile = readStudentProfile();
    publicSubjectScores = readPublicSubjectScores();
    internationalProfile = readInternationalProfile();
    saveDraft();
  });
});

studentTypeInputs.forEach((input) => {
  input.addEventListener("change", () => {
    studentProfile = readStudentProfile();
    updateStudentTypeUI();
    saveDraft();
  });
});

document.querySelectorAll('input[name="assessment-mode"]').forEach((input) => {
  input.addEventListener("change", () => {
    selectedMode = input.value;
    saveDraft();
  });
});

schoolMajorFileInput.addEventListener("change", async (event) => {
  const file = event.target.files?.[0];
  if (!file) {
    setSchoolFileStatus("未上传文件");
    return;
  }

  setSchoolFileStatus(`正在解析：${file.name}`);
  try {
    const parsedText = await readSchoolMajorFile(file);
    schoolMajorText = parsedText;
    const parsedNames = parseSchoolMajorText(parsedText);
    setSchoolFileStatus(`已导入 ${parsedNames.length} 个专业：${file.name}`);
    saveDraft();
  } catch (error) {
    setSchoolFileStatus(`导入失败：${error.message}`);
    alert(`学校专业清单导入失败：${error.message}`);
  }
});

schoolMajorImageInput.addEventListener("change", async (event) => {
  const file = event.target.files?.[0];
  if (!file) {
    setSchoolFileStatus("未上传文件");
    return;
  }

  setSchoolFileStatus(`正在识别图片：${file.name}`);
  try {
    const parsedText = await readSchoolMajorImage(file);
    if (!parsedText) {
      throw new Error("图片已识别，但未提取出专业名");
    }
    schoolMajorText = parsedText;
    const parsedNames = parseSchoolMajorText(parsedText);
    setSchoolFileStatus(`图片识别完成，提取 ${parsedNames.length} 个专业：${file.name}`);
    saveDraft();
  } catch (error) {
    setSchoolFileStatus(`图片识别失败：${error.message}`);
    alert(`学校专业图片识别失败：${error.message}`);
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
  const weighted = applySubjectWeight(studentVector.score);
  const rankedMajors = rankMajors(weighted.score);
  const schoolRecommendation = rankSchoolMajors(weighted.score, schoolMajorText);
  renderResult({ ...studentVector, score: weighted.score }, rankedMajors, weighted.summary, schoolRecommendation);
  localStorage.removeItem(STORAGE_KEY);
  setSaveStatus("已提交并清除本地草稿");
  resultBox.classList.remove("hidden");
  resultBox.scrollIntoView({ behavior: "smooth", block: "start" });
  emitEvent("complete_assessment", {
    mode: selectedMode,
    student_type: studentProfile.type,
    question_count: activeQuestions.length,
    top_major: rankedMajors[0]?.name || "",
    match_index: rankedMajors[0]?.matchIndex || 0,
    school_restricted_mode: Boolean(schoolRecommendation?.ranked?.length)
  });
});

resultBox.addEventListener("click", (event) => {
  const target = event.target;
  if (target instanceof HTMLElement && target.id === "export-pdf-btn") {
    emitEvent("export_pdf", {
      mode: selectedMode,
      label: "report_export"
    });
    window.print();
  }
});

applyMode(selectedMode);
loadDraft();
showIntroStep(introStep);
loadAuthSession();
renderAuthState();
maybeRenderPreviewReport();

const allQuestions = OFFICIAL_DATA.questions;
const dimensions = OFFICIAL_DATA.dimensions;
const baseMajors = OFFICIAL_DATA.majors;
const actions = OFFICIAL_DATA.actions;
const dimensionKeys = OFFICIAL_DATA.dimensionKeys;
const extraMajors = typeof EXTRA_MAJORS !== "undefined" ? EXTRA_MAJORS : [];

function clamp01(value) {
  return Math.max(0, Math.min(1, value));
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
  : [{ username: "admin", password: "majornavi2026" }];
const AUTH_ENABLED = AUTH_USERS.length > 0;

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
  return String(username || "").trim();
}

function findAuthUser(username, password) {
  return AUTH_USERS.find((user) => user.username === username && user.password === password) || null;
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
    publicSubjectScores,
    internationalProfile,
    schoolMajorText,
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
    introStep = Number(parsed.introStep) || 1;
    studentProfile = parsed.studentProfile || studentProfile;
    publicSubjectScores = parsed.publicSubjectScores || publicSubjectScores;
    internationalProfile = parsed.internationalProfile || internationalProfile;
    schoolMajorText = parsed.schoolMajorText || "";
    applyMode(parsed.mode || selectedMode);
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
    setSchoolFileStatus(schoolMajorText ? `已恢复学校专业清单（${parseSchoolMajorText(schoolMajorText).length} 个专业）` : "未上传文件");
    setSaveStatus("已恢复上次作答草稿");
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
  setSchoolFileStatus("未上传文件");
  currentPage = 1;
  localStorage.removeItem(STORAGE_KEY);
  setSaveStatus("已清空草稿");
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
  if (!valid.length) return { score: baseScore, used: false, summary: "未输入公立学校成绩，采用纯测评结果。" };

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
    return { score: baseScore, used: false, summary: "未识别到国际课程成绩，采用纯测评结果。" };
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
    return internationalProfile.curriculumName || "国际课程未填写";
  }
  const filled = Object.entries(publicSubjectScores)
    .filter(([, value]) => typeof value === "number")
    .map(([key, value]) => `${({ cn: "语文", math: "数学", en: "英语", phy: "物理", chem: "化学", bio: "生物" }[key])}${Math.round(value)}`);
  return filled.length ? `公立成绩已填 ${filled.slice(0, 3).join(" / ")}` : "公立成绩未填写";
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
    careers: options.careers || "适合先看岗位方向与课程结构",
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

function getConfidenceTone(score) {
  if (score >= 80) return "high";
  if (score >= 60) return "medium";
  return "low";
}

function getFitTone(score) {
  if (score >= 75) return { tone: "high", label: "校内优先" };
  if (score >= 58) return { tone: "medium", label: "校内可冲" };
  return { tone: "low", label: "谨慎填报" };
}

function buildActionPlan(topMajor, action) {
  if (!action) return [];
  return [
    `30天：围绕 ${topMajor.name} 做一次轻量验证，优先试一门公开课、一次社团任务或一次案例拆解。`,
    `60天：把结果落到作品或输出上，例如一份研究笔记、一次主题展示或一个小项目。`,
    `90天：复盘投入感、成就感和压力感，判断是否继续把 ${topMajor.name} 作为主方向。`
  ];
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

function renderResult(studentVector, rankedMajors, confidence, weightingSummary, schoolRecommendation) {
  const topTraits = getTopDimensions(studentVector.score, 3);
  const traitText = topTraits.map((t) => `${t.label} ${t.score}分`).join("、");
  const radarProfile = buildRadarProfile(studentVector.score);
  const hollandCode = getHollandCode(studentVector.score);
  const top3 = rankedMajors.slice(0, 3);
  const tieTop = (top3[0].matchIndex - top3[1].matchIndex) <= 3;
  const confidenceTone = getConfidenceTone(confidence.score);
  const firstAction = getActionByCategory(top3[0].category);
  const actionPlan = buildActionPlan(top3[0], firstAction);

  const rankNames = tieTop
    ? ["首选（并列A）", "首选（并列B）", "备选"]
    : ["首选", "次选", "末选（可冲刺/保底）"];

  const cards = top3
    .map((major, index) => {
      const ev = buildEvidence(major, studentVector.score);
      const headline =
        index === 0 && tieTop
          ? `${major.name} 与另一方向接近，建议用成绩与实践体验做二次判断。`
          : `${major.name} 当前与学生画像匹配度较高，可优先进入验证清单。`;
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
        <p class="evidence"><strong>推荐证据：</strong>${ev.positives.join("、") || "综合匹配度较高"}</p>
        <details class="rank-details">
          <summary>查看详细解释</summary>
          <p class="risk"><strong>风险提示：</strong>${ev.risks.join("、") || "当前未见明显核心短板，可持续观察学业压力承受度"}</p>
        </details>
      </article>
    `;
    })
    .join("");

  const actionHTML = firstAction
    ? `
      <section id="action-plan" class="advice">
        <h3>下一步行动</h3>
        <p><strong>家长可读结论：</strong>当前结果置信度为 ${confidence.level}（${confidence.score}/100），建议先以低成本验证代替直接定方向。</p>
        <p><strong>学习重点：</strong>${firstAction.focus}</p>
        <p><strong>验证方式：</strong>${firstAction.validation}</p>
        <div class="action-plan-list">
          ${actionPlan.map((item) => `<p>${item}</p>`).join("")}
        </div>
      </section>
    `
    : "";

  const summaryTitle = tieTop
    ? `当前最适合：${top3[0].name} / ${top3[1].name}`
    : `当前最适合：${top3[0].name}`;
  const summaryText = tieTop
    ? "两条方向分差很小，建议结合学科成绩和真实体验做二选一。"
    : `${top3[0].name} 是当前优先验证方向，次选可作为补充参考。`;
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
        <span class="student-summary-label">课程体系</span>
        <strong>${getCurriculumSummary()}</strong>
      </article>
      <article class="student-summary-card">
        <span class="student-summary-label">测评版本</span>
        <strong>${MODE_CONFIG[selectedMode].label}</strong>
      </article>
    </div>
  `;

  const schoolRestrictedHTML = schoolRecommendation?.ranked?.length
    ? `
    <section class="restricted-section">
      <h3>该校可报范围内的替代推荐</h3>
      <p class="restricted-note">理想专业用于判断学生“本来更适合什么”，下面这组结果用于回答“如果只在目标学校现有专业里选，哪些更接近学生画像”。</p>
      <p class="restricted-source">已识别学校专业 ${schoolRecommendation.matchedCount} 个${schoolRecommendation.unmatchedCount ? `，另有 ${schoolRecommendation.unmatchedCount} 个名称未完成匹配` : ""}。</p>
      <div class="rank-grid">
        ${schoolRecommendation.ranked.slice(0, 3).map((major, index) => {
          const fit = getFitTone(major.matchIndex);
          const ev = buildEvidence(major, studentVector.score);
          return `
            <article class="rank-card">
              <div class="rank-card-top">
                <div>
                  <p class="rank-label">${index === 0 ? "校内首选" : index === 1 ? "校内次选" : "校内备选"}</p>
                  <h3>${major.name}</h3>
                </div>
                <div>
                  <p class="score">${major.matchIndex} / 100</p>
                  <span class="fit-badge fit-${fit.tone}">${fit.label}</span>
                </div>
              </div>
              <p class="rank-summary">如果学校只开理工或应用型专业，${major.name} 是当前相对更稳的替代方向。</p>
              <div class="rank-meta-grid">
                <span>校内替代类型：${major.category}</span>
                <span>课程关键词：${major.courses}</span>
                <span>典型去向：${major.careers}</span>
              </div>
              <p class="evidence"><strong>替代理由：</strong>${ev.positives.join("、") || "与学生画像的相对距离较近"}</p>
              <p class="mapping-note"><strong>匹配参照：</strong>${major.sourceRef || "关键词映射"}</p>
            </article>
          `;
        }).join("")}
      </div>
      <p class="mapping-note"><strong>使用建议：</strong>如果理想专业与校内可报方向差异较大，优先选择“偏管理、偏服务、偏应用协同”的专业，不建议为进学校而硬上最硬核的设备制造或纯技术研发方向。</p>
    </section>
  `
    : schoolMajorText
      ? `
      <section class="restricted-section">
        <h3>该校可报范围内的替代推荐</h3>
        <p class="restricted-note">已检测到你输入了学校专业清单，但当前还没有足够多的专业名称被系统识别。建议把专业名单按“一行一个专业名”再粘贴一次，例如：工程造价、建筑工程技术、电气自动化技术。</p>
      </section>
    `
      : "";

  resultBox.innerHTML = `
    <div class="result-header">
      <p class="result-kicker">报告结论</p>
      <h2>${summaryTitle}</h2>
      <p class="result-summary">${summaryText}</p>
      ${studentSummaryCards}
      <div class="confidence-badge confidence-${confidenceTone}">
        <span>结果置信度</span>
        <strong>${confidence.level} ${confidence.score}/100</strong>
      </div>
      <p class="confidence-note">${tieTop ? "首选并列：先看成绩与真实体验，再定主方向。" : "当前分差明确，可先围绕首选方向做验证。"} </p>
      <div class="summary-chips">
        <span>优势特征：${traitText}</span>
        <span>${weightingSummary}</span>
        <span>Holland：${hollandCode}</span>
      </div>
      <p class="result-meta">综合画像采用 8 维模型：6维兴趣（Holland）+ 2维能力韧性（选专业更实用）。</p>
    </div>
    <div class="result-tools">
      <button type="button" id="export-pdf-btn" class="btn btn-ghost">导出 PDF（打印版）</button>
      <button type="button" id="jump-action-btn" class="btn btn-primary">查看 90 天行动</button>
    </div>
    <div class="radar-wrap">
      <canvas id="profile-radar" width="360" height="360"></canvas>
      <div class="radar-legend">
        ${radarProfile.map((x) => `<span>${x.label} ${x.value}</span>`).join("")}
      </div>
    </div>
    <div class="rank-grid">${cards}</div>
    ${schoolRestrictedHTML}
    ${actionHTML}
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
  const password = String(authPasswordInput.value || "");
  authUsernameInput.value = username;

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
  const confidence = calculateConfidence(answers, rankedMajors);
  renderResult({ ...studentVector, score: weighted.score }, rankedMajors, confidence, weighted.summary, schoolRecommendation);
  localStorage.removeItem(STORAGE_KEY);
  setSaveStatus("已提交并清除本地草稿");
  resultBox.classList.remove("hidden");
  resultBox.scrollIntoView({ behavior: "smooth", block: "start" });
  emitEvent("complete_assessment", {
    mode: selectedMode,
    student_type: studentProfile.type,
    question_count: activeQuestions.length,
    confidence_score: confidence.score,
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
  if (target instanceof HTMLElement && target.id === "jump-action-btn") {
    const actionPlan = document.getElementById("action-plan");
    if (actionPlan) {
      actionPlan.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }
});

applyMode(selectedMode);
loadDraft();
showIntroStep(introStep);
loadAuthSession();
renderAuthState();

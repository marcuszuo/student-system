const gaokaoData = window.GAOKAO_REFERENCE_DATA || { provinces: [] };
const provinceSelect = document.getElementById("gaokao-province");
const trackSelect = document.getElementById("gaokao-track");
const scoreInput = document.getElementById("gaokao-score");
const rankInput = document.getElementById("gaokao-rank");
const cityInput = document.getElementById("gaokao-city");
const tierSelect = document.getElementById("gaokao-tier");
const focusSelect = document.getElementById("gaokao-focus");
const resultPanel = document.getElementById("gaokao-result");
const searchBtn = document.getElementById("gaokao-search-btn");
const resetBtn = document.getElementById("gaokao-reset-btn");
const coverageEl = document.getElementById("gaokao-coverage");
const GAOKAO_QUERY_API_BASE_URL = String(window.GAOKAO_QUERY_API_BASE_URL || "").trim().replace(/\/+$/, "");
const GAOKAO_QUERY_INGEST_KEY = String(window.GAOKAO_QUERY_INGEST_KEY || "").trim();

const SCHOOL_MAJOR_HINTS = {
  "中山大学": {
    majors: ["临床医学", "工商管理", "计算机类", "材料与化学"],
    fit: "适合基础能力强、后续仍希望保留专业上探空间的学生。",
    caution: "学校层级很高，专业组之间竞争差异明显，后续必须细看具体专业分层。"
  },
  "华南理工大学": {
    majors: ["计算机类", "自动化", "电子信息", "建筑类"],
    fit: "适合数理基础较好、愿意接受工科训练节奏的学生。",
    caution: "如果学生不适应高密度理工课程，不建议只因为学校名气而强行冲刺。"
  },
  "暨南大学": {
    majors: ["新闻传播", "经济金融", "临床医学", "国际商务"],
    fit: "适合综合发展取向明显、希望兼顾城市资源与学科选择弹性的学生。",
    caution: "院校整体吸引力较强，热门专业实际竞争通常高于最低投档线。"
  },
  "华南师范大学": {
    majors: ["师范类", "心理学", "汉语言", "数学与应用数学"],
    fit: "适合倾向教育、人文社科或希望兼顾稳定培养路径的学生。",
    caution: "若学生并不接受教育类或公共服务类路径，需要提前核对专业偏好。"
  },
  "深圳大学": {
    majors: ["计算机类", "金融科技", "传播学", "建筑与设计"],
    fit: "适合看重城市机会、实习资源和就业导向的学生。",
    caution: "城市热度会抬高报考强度，建议不要只按学校最低线判断。"
  },
  "广州大学": {
    majors: ["土木工程", "法学", "教育学", "计算机类"],
    fit: "适合希望在省会城市完成综合培养、并保留专业调整弹性的学生。",
    caution: "不同学院冷热差距较大，最好结合专业去向进一步判断。"
  },
  "广东工业大学": {
    majors: ["自动化", "机械类", "电子信息", "软件工程"],
    fit: "适合理工应用取向较强、愿意接受工程训练的学生。",
    caution: "如果学生未来更偏商科或文科表达方向，这类院校未必最优。"
  },
  "汕头大学": {
    majors: ["临床医学", "工商管理", "法学", "新闻传播"],
    fit: "适合希望在相对稳定区间内兼顾综合培养的学生。",
    caution: "更适合作为稳妥或保底层院校，不建议把它误当作热门城市替代项。"
  },
  "南京大学": {
    majors: ["人工智能", "计算机类", "经济管理", "人文社科实验班"],
    fit: "适合位次很强、学术基础扎实且后续仍想保留上限空间的学生。",
    caution: "院校整体门槛极高，专业组细分后竞争只会更强。"
  },
  "东南大学": {
    majors: ["建筑类", "电子信息", "自动化", "工科试验班"],
    fit: "适合工程、建筑、理工导向明确的学生。",
    caution: "如果学生对工科长期训练接受度不高，不宜仅按学校层级做选择。"
  },
  "苏州大学": {
    majors: ["临床医学", "法学", "设计类", "计算机类"],
    fit: "适合希望兼顾城市资源、综合培养和一定专业弹性的学生。",
    caution: "热门城市会提高真实报考竞争，建议同步准备稳妥替代院校。"
  },
  "南京师范大学": {
    majors: ["教育学", "汉语言文学", "心理学", "新闻传播"],
    fit: "适合人文社科、教育与表达型方向较强的学生。",
    caution: "若学生未来并不接受师范或教育相关路径，需重点核对专业组。"
  },
  "浙江大学": {
    majors: ["工科试验班", "医学试验班", "经济管理", "计算机类"],
    fit: "适合顶尖位次段、后续仍希望保持多方向选择权的学生。",
    caution: "学校层级极高，志愿决策必须进入专业层和培养层比较。"
  },
  "宁波大学": {
    majors: ["法学", "信息工程", "临床医学", "师范类"],
    fit: "适合希望兼顾城市、综合培养和一定专业选择余地的学生。",
    caution: "不同专业间录取强度可能差距较大，建议核查具体专业线。"
  },
  "山东大学": {
    majors: ["临床医学", "数学类", "计算机类", "经济学"],
    fit: "适合中高分段、希望兼顾学校层级与综合学科面的学生。",
    caution: "建议优先确认学生是否有明确专业组偏好，避免只看学校名字。"
  },
  "郑州大学": {
    majors: ["临床医学", "材料类", "计算机类", "法学"],
    fit: "适合本省中高位次、希望在综合院校内保留专业弹性的学生。",
    caution: "热门专业真实竞争明显高于校线，建议结合专业组再细筛。"
  },
  "南昌大学": {
    majors: ["临床医学", "食品科学", "计算机类", "材料与化工"],
    fit: "适合希望在省会综合院校中兼顾学校层级、专业面和区域资源的学生。",
    caution: "校内不同专业组热度差异较大，医学、计算机等热门方向通常高于最低投档线。"
  },
  "江西财经大学": {
    majors: ["会计学", "金融学", "经济统计", "法学"],
    fit: "适合财经管理取向较明确、希望尽早形成就业方向感的学生。",
    caution: "如果学生更偏理工研发或医学训练路径，这类院校的长期匹配度可能一般。"
  },
  "江西师范大学": {
    majors: ["教育学", "汉语言文学", "心理学", "数学与应用数学"],
    fit: "适合教育、人文社科或希望兼顾稳定培养路径的学生。",
    caution: "若学生并不接受师范或公共服务类发展路径，需重点核对专业志愿。"
  },
  "中南大学": {
    majors: ["临床医学", "材料类", "自动化", "计算机类"],
    fit: "适合学业基础较强、希望在医学与高强度理工训练中保留上限空间的学生。",
    caution: "热门专业竞争会明显高于校线，不能只按学校最低投档区间判断。"
  },
  "湖南大学": {
    majors: ["金融学", "建筑类", "机械类", "设计学"],
    fit: "适合兼顾工科、经管与设计表达取向的综合型学生。",
    caution: "如果学生的专业偏好非常单一，需要进一步核对专业组冷热差异。"
  },
  "湖南师范大学": {
    majors: ["教育学", "汉语言文学", "英语", "心理学"],
    fit: "适合教育、人文表达和稳定培养路径取向较强的学生。",
    caution: "若学生未来并不接受师范或教育类职业路径，建议谨慎上提顺位。"
  },
  "厦门大学": {
    majors: ["会计学", "金融学", "法学", "计算机类"],
    fit: "适合综合实力较强、既看重学校层级又希望保留多方向选择权的学生。",
    caution: "学校整体热度高，热门专业真实竞争通常高于最低投档位次。"
  },
  "福州大学": {
    majors: ["材料类", "化工类", "电气工程", "计算机类"],
    fit: "适合理工基础扎实、愿意接受工程训练节奏的学生。",
    caution: "如果学生更偏纯人文或艺术表达方向，这所院校未必最匹配。"
  },
  "福建师范大学": {
    majors: ["教育学", "汉语言文学", "地理科学", "心理学"],
    fit: "适合教育、人文社科与综合培养兼顾的学生。",
    caution: "更适合有稳定学习节奏和长期投入意愿的学生，不建议只因城市因素报考。"
  },
  "中国科学技术大学": {
    majors: ["数学类", "物理学", "计算机类", "人工智能"],
    fit: "适合顶尖位次、数理能力突出且接受高强度学术训练的学生。",
    caution: "学校节奏与学术要求都很高，不适合作为普通冲刺项随意尝试。"
  },
  "合肥工业大学": {
    majors: ["机械类", "车辆工程", "自动化", "电子信息"],
    fit: "适合理工应用方向明确、愿意接受工程实践训练的学生。",
    caution: "如果学生长期更倾向商科、人文或传播类路径，建议作为替代项而非主选。"
  },
  "安徽大学": {
    majors: ["法学", "新闻传播", "计算机类", "经济学"],
    fit: "适合希望在综合院校中保留专业弹性与后续调整空间的学生。",
    caution: "综合院校内部冷热差距较明显，建议后续必须细看具体专业组。"
  },
  "河南大学": {
    majors: ["师范类", "汉语言文学", "法学", "生物类"],
    fit: "适合希望兼顾综合培养、人文教育与稳定升学路径的学生。",
    caution: "如果学生未来倾向强工科应用路径，这所院校未必最匹配。"
  },
  "华北水利水电大学": {
    majors: ["水利类", "土木工程", "电气工程", "自动化"],
    fit: "适合理工应用与工程执行取向比较明确的学生。",
    caution: "更适合工程方向，不建议把它当作泛综合院校理解。"
  },
  "北京邮电大学": {
    majors: ["信息通信", "计算机类", "电子工程", "网络安全"],
    fit: "适合信息类方向明确、数理能力较强的学生。",
    caution: "院校热度高，专业线通常抬升明显，建议同步准备稳妥替代项。"
  },
  "中国传媒大学": {
    majors: ["新闻传播", "广播电视", "数字媒体", "广告学"],
    fit: "适合表达、传播、内容创作与媒介方向关注度高的学生。",
    caution: "如果学生只是看中学校名气而非传播内容方向，后续匹配可能下降。"
  }
};

function escapeHtml(text) {
  return String(text || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function getProvince(code) {
  return (gaokaoData.provinces || []).find((item) => item.code === code) || null;
}

function getTrack(province, code) {
  return province?.tracks?.find((item) => item.code === code) || null;
}

function populateProvinceOptions() {
  provinceSelect.innerHTML = (gaokaoData.provinces || []).map((province) => `
    <option value="${escapeHtml(province.code)}">${escapeHtml(province.name)}</option>
  `).join("");
}

function populateTrackOptions() {
  const province = getProvince(provinceSelect.value);
  const tracks = province?.tracks || [];
  trackSelect.innerHTML = tracks.map((track) => `
    <option value="${escapeHtml(track.code)}">${escapeHtml(track.name)}</option>
  `).join("");
}

function formatRank(rank) {
  return Number(rank || 0).toLocaleString("zh-CN");
}

function getCoverageStats() {
  const provinceCount = (gaokaoData.provinces || []).length;
  const trackCount = (gaokaoData.provinces || []).reduce((sum, province) => sum + (province.tracks || []).length, 0);
  const schoolCount = (gaokaoData.provinces || []).reduce((sum, province) => {
    return sum + (province.tracks || []).reduce((inner, track) => inner + (track.schools || []).length, 0);
  }, 0);
  return { provinceCount, trackCount, schoolCount };
}

function getSchoolHint(entry) {
  return SCHOOL_MAJOR_HINTS[entry.name] || {
    majors: ["建议后续核查该校优势学院与热门专业组"],
    fit: "更适合先将学校放入候选池，再结合专业组、城市与培养路径继续比较。",
    caution: "当前仅完成学校层级初筛，不能直接替代正式志愿方案。"
  };
}

function getSchoolFocusTags(entry) {
  const hint = getSchoolHint(entry);
  const text = [entry.name, entry.note, ...(hint.majors || [])].join(" ").toLowerCase();
  const tags = new Set();
  if (/(工程|工科|自动化|电子|信息|通信|计算机|机械|材料|建筑|土木|网络|人工智能|水利)/.test(text)) tags.add("engineering");
  if (/(医学|临床|护理|药学|健康)/.test(text)) tags.add("medicine");
  if (/(经济|金融|工商|管理|会计|财务|商务|财经|法学)/.test(text)) tags.add("business");
  if (/(汉语言|新闻|传播|哲学|历史|社会|人文|法学|经济学)/.test(text)) tags.add("humanities");
  if (/(师范|教育|心理学)/.test(text)) tags.add("education");
  if (/(传媒|广播|电视|数字媒体|广告|设计|艺术)/.test(text)) tags.add("media");
  return Array.from(tags);
}

function getDefaultFocusByTrack(trackCode) {
  return /(history|文科|历史)/i.test(String(trackCode || ""))
    ? "humanities"
    : "engineering";
}

function getRecommendedMajors(entry, focusCode, trackCode) {
  const hint = getSchoolHint(entry);
  const majors = Array.isArray(hint.majors) ? hint.majors.slice() : [];
  if (!majors.length) {
    return {
      primary: ["建议后续核查该校优势专业组"],
      reason: "当前学校结果主要基于院校层级与位次估算，专业层仍需二次确认。"
    };
  }

  const effectiveFocus = focusCode || getDefaultFocusByTrack(trackCode);
  const focusMatchers = {
    engineering: /(工程|工科|自动化|电子|信息|通信|计算机|机械|材料|建筑|土木|网络|人工智能|测控|车辆|化工|水利|电气)/,
    medicine: /(医学|临床|护理|药学|健康|口腔|生物医)/,
    business: /(经济|金融|工商|管理|会计|财务|商务|财经|统计|法学)/,
    humanities: /(汉语言|新闻|传播|哲学|历史|社会|法学|经济学|英语|外语)/,
    education: /(师范|教育|心理学|学前|课程)/,
    media: /(传媒|广播|电视|数字媒体|广告|设计|艺术|动画)/
  };

  const matcher = focusMatchers[effectiveFocus];
  const matched = matcher ? majors.filter((major) => matcher.test(major)) : [];
  const selected = (matched.length ? matched : majors).slice(0, 3);

  const reasonMap = {
    engineering: "当前更建议优先比较工科与技术导向专业组，再结合实验条件、实习资源和就业去向做二轮筛选。",
    medicine: "当前更建议优先比较医学健康相关专业组，再结合培养年限、实习体系和升学要求判断。",
    business: "当前更建议优先比较经管财经相关专业组，再结合课程数学要求、实习资源和就业路径筛选。",
    humanities: "当前更建议优先比较人文社科相关专业组，再结合表达训练、深造路径和院系特色判断。",
    education: "当前更建议优先比较教育师范相关专业组，再结合是否接受教师培养路径和实践要求判断。",
    media: "当前更建议优先比较传媒艺术相关专业组，再结合作品训练、项目机会和表达输出方式筛选。"
  };

  return {
    primary: selected,
    reason: reasonMap[effectiveFocus] || "建议进一步核查该校优势专业组与实际录取热度。"
  };
}

function summarizeMajorDirections(ranked, focusCode, trackCode) {
  const counts = new Map();
  ranked.slice(0, 8).forEach((item) => {
    const majors = getRecommendedMajors(item, focusCode, trackCode).primary;
    majors.forEach((major) => {
      counts.set(major, (counts.get(major) || 0) + 1);
    });
  });

  return Array.from(counts.entries())
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], "zh-CN"))
    .slice(0, 6)
    .map(([major]) => major);
}

function getBucket(entry, studentRank, studentScore) {
  const hasRank = Number.isFinite(studentRank) && studentRank > 0;
  if (hasRank && Number.isFinite(entry.minRank)) {
    const ratio = studentRank / entry.minRank;
    if (ratio <= 0.9) return "safe";
    if (ratio <= 1.03) return "steady";
    if (ratio <= 1.15) return "reach";
    return "out";
  }

  if (Number.isFinite(studentScore) && Number.isFinite(entry.minScore)) {
    const gap = studentScore - entry.minScore;
    if (gap >= 10) return "safe";
    if (gap >= 2) return "steady";
    if (gap >= -8) return "reach";
  }
  return "out";
}

function getFallbackBucket(entry, studentRank, studentScore) {
  if (Number.isFinite(studentRank) && studentRank > 0 && Number.isFinite(entry.minRank)) {
    const ratio = studentRank / entry.minRank;
    if (ratio <= 1.3) return "reach";
  }
  if (Number.isFinite(studentScore) && Number.isFinite(entry.minScore)) {
    const gap = studentScore - entry.minScore;
    if (gap >= -15) return "reach";
  }
  return "out";
}

function getBucketMeta(bucket) {
  switch (bucket) {
    case "safe":
      return { label: "保底参考", className: "safe", order: 3, summary: "当前位次明显优于上一年最低录取位次，可作为保底池重点关注。" };
    case "steady":
      return { label: "稳妥参考", className: "steady", order: 2, summary: "当前位次与上一年录取区间较接近，适合作为主参考院校池。" };
    case "reach":
      return { label: "冲刺参考", className: "reach", order: 1, summary: "当前位次略高于上一年最低录取位次，需要结合招生计划变化谨慎判断。" };
    default:
      return { label: "暂不建议", className: "out", order: 4, summary: "与上一年参考区间仍有明显差距，当前不建议优先投入。" };
  }
}

function buildEstimateSummary(studentRank, studentScore, entry) {
  if (Number.isFinite(studentRank) && studentRank > 0 && Number.isFinite(entry.minRank)) {
    const delta = entry.minRank - studentRank;
    return delta >= 0
      ? `当前位次较上一年最低录取位次领先约 ${formatRank(delta)} 名。`
      : `当前位次较上一年最低录取位次落后约 ${formatRank(Math.abs(delta))} 名。`;
  }

  if (Number.isFinite(studentScore) && Number.isFinite(entry.minScore)) {
    const diff = studentScore - entry.minScore;
    return diff >= 0
      ? `当前分数较上一年最低录取分高约 ${diff} 分。`
      : `当前分数较上一年最低录取分低约 ${Math.abs(diff)} 分。`;
  }

  return "当前依据上一年参考区间做近似估算。";
}

async function syncGaokaoQueryRecord(payload) {
  if (!GAOKAO_QUERY_API_BASE_URL) return;
  const headers = { "Content-Type": "application/json" };
  if (GAOKAO_QUERY_INGEST_KEY) {
    headers["x-report-ingest-key"] = GAOKAO_QUERY_INGEST_KEY;
  }
  const response = await fetch(`${GAOKAO_QUERY_API_BASE_URL}/api/gaokao-queries`, {
    method: "POST",
    headers,
    body: JSON.stringify(payload)
  });
  if (!response.ok) {
    throw new Error(`query sync failed (${response.status})`);
  }
}

function renderError(message) {
  resultPanel.innerHTML = `
    <div class="empty-state">
      <h2>暂时无法生成结果</h2>
      <p>${escapeHtml(message)}</p>
    </div>
  `;
}

function renderGroup(title, intro, items, focusCode, trackCode) {
  if (!items.length) {
    return `
      <section class="gaokao-group">
        <div class="gaokao-group-head">
          <h3>${escapeHtml(title)}</h3>
          <p>${escapeHtml(intro)}</p>
        </div>
        <div class="empty-state compact">
          <p>当前输入条件下暂无该档院校。</p>
        </div>
      </section>
    `;
  }

  return `
    <section class="gaokao-group">
      <div class="gaokao-group-head">
        <h3>${escapeHtml(title)}</h3>
        <p>${escapeHtml(intro)}</p>
      </div>
      <div class="gaokao-school-grid">
        ${items.map((item) => `
          <article class="gaokao-school-card">
            <div class="gaokao-school-top">
              <div>
                <p class="gaokao-school-badge gaokao-school-badge-${escapeHtml(item.bucketMeta.className)}">${escapeHtml(item.bucketMeta.label)}</p>
                <h4>${escapeHtml(item.name)}</h4>
              </div>
              <span class="gaokao-tier">${escapeHtml(item.tier)}</span>
            </div>
            <p class="gaokao-school-city">${escapeHtml(item.city)} · ${escapeHtml(String(item.year))} 参考</p>
            <div class="gaokao-school-meta">
              <span>上一年最低分：${escapeHtml(item.minScore)}</span>
              <span>上一年最低位次：${escapeHtml(formatRank(item.minRank))}</span>
            </div>
            <p class="gaokao-school-summary">${escapeHtml(item.bucketMeta.summary)}</p>
            <p class="gaokao-school-estimate">${escapeHtml(item.estimateSummary)}</p>
            <div class="gaokao-major-box">
              <p class="gaokao-major-heading">更值得优先查看的专业方向</p>
              <div class="gaokao-major-tags">
                ${getRecommendedMajors(item, focusCode, trackCode).primary.map((major) => `<span>${escapeHtml(major)}</span>`).join("")}
              </div>
              <p class="gaokao-major-reason">${escapeHtml(getRecommendedMajors(item, focusCode, trackCode).reason)}</p>
            </div>
            <div class="gaokao-major-tags">
              ${getSchoolHint(item).majors.map((major) => `<span>${escapeHtml(major)}</span>`).join("")}
            </div>
            <p class="gaokao-school-fit"><strong>更适合关注：</strong>${escapeHtml(getSchoolHint(item).fit)}</p>
            <p class="gaokao-school-note"><strong>提醒：</strong>${escapeHtml(item.note || "建议继续结合专业组与招生计划判断。")}</p>
            <p class="gaokao-school-note"><strong>报考补充提醒：</strong>${escapeHtml(getSchoolHint(item).caution)}</p>
          </article>
        `).join("")}
      </div>
    </section>
  `;
}

function renderResults(province, track, studentScore, studentRank, ranked) {
  const groups = {
    reach: ranked.filter((item) => item.bucket === "reach"),
    steady: ranked.filter((item) => item.bucket === "steady"),
    safe: ranked.filter((item) => item.bucket === "safe")
  };

  const cityKeyword = String(cityInput.value || "").trim();
  const tierFilter = String(tierSelect.value || "").trim();
  const focusFilter = String(focusSelect.value || "").trim();
  const topMajorDirections = summarizeMajorDirections(ranked, focusFilter, track.code);
  const strategyNote = groups.steady.length
    ? "建议先以稳妥池为主体，再搭配少量冲刺与保底院校形成完整志愿结构。"
    : groups.reach.length
      ? "当前结果偏向冲刺判断，建议同步放宽城市或院校层级条件，以形成更稳定的志愿组合。"
      : "当前结果偏向保底区间，建议继续补充更高匹配院校或结合专业组进一步扩展选择。";

  resultPanel.innerHTML = `
    <div class="gaokao-result-head">
      <div>
        <p class="panel-kicker">Step 2</p>
        <h2>${escapeHtml(province.name)} · ${escapeHtml(track.name)} 志愿参考结果</h2>
        <p>已按上一年院校最低录取区间，结合你当前的分数与位次生成首轮参考结果。当前共匹配到 ${ranked.length} 所可重点关注院校。</p>
      </div>
      <div class="gaokao-student-brief">
        <span>分数：${studentScore ? escapeHtml(studentScore) : "未填"}</span>
        <span>位次：${studentRank ? escapeHtml(formatRank(studentRank)) : "未填"}</span>
        ${cityKeyword ? `<span>城市偏好：${escapeHtml(cityKeyword)}</span>` : ""}
        ${tierFilter ? `<span>层级筛选：${escapeHtml(tierFilter)}</span>` : ""}
        ${focusFilter ? `<span>方向偏好：${escapeHtml(focusSelect.options[focusSelect.selectedIndex]?.text || "")}</span>` : ""}
        <span>参考逻辑：上一年位次带估算</span>
      </div>
    </div>
    <div class="gaokao-summary-grid">
      <article class="gaokao-summary-card">
        <span>冲刺池</span>
        <strong>${groups.reach.length}</strong>
      </article>
      <article class="gaokao-summary-card">
        <span>稳妥池</span>
        <strong>${groups.steady.length}</strong>
      </article>
      <article class="gaokao-summary-card">
        <span>保底池</span>
        <strong>${groups.safe.length}</strong>
      </article>
    </div>
    <section class="gaokao-strategy-card">
      <h3>本轮志愿组合建议</h3>
      <p>${escapeHtml(strategyNote)}</p>
      ${topMajorDirections.length ? `
        <div class="gaokao-major-snapshot">
          <span>当前结果中更值得优先比较的专业方向</span>
          <div class="gaokao-major-tags">
            ${topMajorDirections.map((major) => `<span>${escapeHtml(major)}</span>`).join("")}
          </div>
        </div>
      ` : ""}
    </section>
    ${renderGroup("冲刺参考院校", "适合作为上探院校范围，但建议同步关注专业冷热变化和招生计划波动。", groups.reach, focusFilter, track.code)}
    ${renderGroup("稳妥参考院校", "与当前位次相对接近，建议作为志愿表主体院校池继续细筛。", groups.steady, focusFilter, track.code)}
    ${renderGroup("保底参考院校", "可作为结果稳定区间参考，但仍建议检查具体专业组录取情况。", groups.safe, focusFilter, track.code)}
    <section class="gaokao-note-card">
      <h3>使用提醒</h3>
      <ul>
        <li>当前结果主要用于“先筛学校范围”，不能直接替代正式志愿填报。</li>
        <li>同一学校不同专业组、不同选科要求之间可能存在明显差异，后续仍需看专业层数据。</li>
        <li>如果后续补齐本省近三年完整录取数据，本模块可以继续升级为更稳定的志愿推荐系统。</li>
      </ul>
    </section>
  `;
}

function rankSchools() {
  const province = getProvince(provinceSelect.value);
  const track = getTrack(province, trackSelect.value);
  const studentScore = Number(scoreInput.value || 0);
  const studentRank = Number(rankInput.value || 0);
  const cityKeyword = String(cityInput.value || "").trim().toLowerCase();
  const tierFilter = String(tierSelect.value || "").trim();
  const focusFilter = String(focusSelect.value || "").trim();

  if (!province) return renderError("请先选择所在省份。");
  if (!track) return renderError("请先选择科类 / 选科方向。");
  if (!studentScore && !studentRank) {
    return renderError("请至少填写分数或全省位次中的一项，建议优先填写全省位次。");
  }

  const ranked = (track.schools || [])
    .map((entry) => {
      const directBucket = getBucket(entry, studentRank, studentScore);
      const bucket = directBucket === "out" ? getFallbackBucket(entry, studentRank, studentScore) : directBucket;
      const bucketMeta = getBucketMeta(bucket);
      const rankGap = Number.isFinite(studentRank) && entry.minRank ? Math.abs(studentRank - entry.minRank) : 999999;
      const scoreGap = Number.isFinite(studentScore) && entry.minScore ? Math.abs(studentScore - entry.minScore) : 999999;
      return {
        ...entry,
        bucket,
        bucketMeta,
        rankGap,
        scoreGap,
        estimateSummary: buildEstimateSummary(studentRank, studentScore, entry),
        focusTags: getSchoolFocusTags(entry)
      };
    })
    .filter((entry) => entry.bucket !== "out")
    .filter((entry) => !cityKeyword || String(entry.city || "").toLowerCase().includes(cityKeyword))
    .filter((entry) => !tierFilter || String(entry.tier || "") === tierFilter)
    .filter((entry) => !focusFilter || entry.focusTags.includes(focusFilter))
    .sort((a, b) => a.bucketMeta.order - b.bucketMeta.order || a.rankGap - b.rankGap || a.scoreGap - b.scoreGap);

  if (!ranked.length) {
    return renderError("当前筛选条件下暂无合适院校。建议放宽城市偏好、院校层级，或优先使用全省位次重新匹配。");
  }

  renderResults(province, track, studentScore, studentRank, ranked);
  void syncGaokaoQueryRecord({
    id: `gaokao_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    submittedAt: new Date().toISOString(),
    province: province.name,
    provinceCode: province.code,
    track: track.name,
    trackCode: track.code,
    score: studentScore || null,
    rank: studentRank || null,
    cityKeyword: cityInput.value.trim(),
    tierFilter,
    focusFilter,
    resultCount: ranked.length,
    reachCount: ranked.filter((item) => item.bucket === "reach").length,
    steadyCount: ranked.filter((item) => item.bucket === "steady").length,
    safeCount: ranked.filter((item) => item.bucket === "safe").length,
    topResults: ranked.slice(0, 5).map((item) => ({
      name: item.name,
      tier: item.tier,
      city: item.city,
      bucket: item.bucket,
      minScore: item.minScore,
      minRank: item.minRank
    }))
  }).catch((error) => {
    console.error(error);
  });
}

function resetForm() {
  scoreInput.value = "";
  rankInput.value = "";
  cityInput.value = "";
  tierSelect.value = "";
  focusSelect.value = "";
  resultPanel.innerHTML = `
    <div class="empty-state">
      <h2>等待生成结果</h2>
      <p>填写完成后点击“开始匹配院校”，系统会按当前省份和科类给出参考结果。</p>
    </div>
  `;
}

function applyPreviewParams() {
  const params = new URLSearchParams(window.location.search);
  const province = String(params.get("province") || "").trim();
  const track = String(params.get("track") || "").trim();
  const score = String(params.get("score") || "").trim();
  const rank = String(params.get("rank") || "").trim();
  const city = String(params.get("city") || "").trim();
  const tier = String(params.get("tier") || "").trim();
  const focus = String(params.get("focus") || "").trim();

  if (province && getProvince(province)) {
    provinceSelect.value = province;
    populateTrackOptions();
  }

  const activeProvince = getProvince(provinceSelect.value);
  if (track && getTrack(activeProvince, track)) {
    trackSelect.value = track;
  }

  if (score) scoreInput.value = score;
  if (rank) rankInput.value = rank;
  if (city) cityInput.value = city;
  if (tier) tierSelect.value = tier;
  if (focus) focusSelect.value = focus;

  if (province || track || score || rank || city || tier || focus) {
    rankSchools();
  }
}

provinceSelect.addEventListener("change", () => {
  populateTrackOptions();
  resetForm();
});

searchBtn.addEventListener("click", rankSchools);
resetBtn.addEventListener("click", resetForm);
[scoreInput, rankInput, cityInput].forEach((input) => {
  input.addEventListener("keydown", (event) => {
    if (event.key !== "Enter") return;
    event.preventDefault();
    rankSchools();
  });
});

[tierSelect, trackSelect, focusSelect].forEach((input) => {
  input.addEventListener("change", () => {
    if (resultPanel.querySelector(".gaokao-result-head")) {
      rankSchools();
    }
  });
});

populateProvinceOptions();
populateTrackOptions();
applyPreviewParams();

if (coverageEl) {
  const coverage = getCoverageStats();
  coverageEl.textContent = `当前已覆盖 ${coverage.provinceCount} 个省份、${coverage.trackCount} 个科类方向、${coverage.schoolCount} 条院校参考记录。`;
}

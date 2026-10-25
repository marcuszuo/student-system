(function(root){
const DOMAIN_LABELS = {computing:"编程与算法",electronics:"电子与控制",engineering:"结构与机械",math:"数学推导与建模",chemistry:"化学与物质",biology:"生命与生物",business:"经营与项目",people:"人与公共服务",creative:"设计与表达"};
function getIntegratedLabel(dim) {
  return ({"interest.r":"动手实践","interest.i":"研究分析","interest.a":"创意表达","interest.s":"助人与合作","interest.e":"组织与影响","interest.c":"规则与秩序",
    "skill.data":"数据分析","skill.making":"搭建与调试","skill.expression":"写作与展示","skill.coordination":"组织协调",
    "value.autonomy":"自主安排","value.creativity":"创造新成果","value.service":"助人贡献","value.security":"稳定性","value.wealth":"收入回报","value.influence":"组织影响"})[dim] || dim;
}


function getMajorComparison(major) {
  if (/数学|统计/.test(major.name)) return {study:major.courses,
    focus:"是否喜欢推导、证明和模型假设，愿意反复检验解题思路。",
    task:"用两种方法解决一个概率或建模问题，说明假设、步骤和各方法的限制。"};
  if (/物理/.test(major.name)) return {study:major.courses,
    focus:"是否愿意把数学模型与可观察的现象、测量误差和实验结果联系起来。",
    task:"用摆长不同的简易摆记录周期，画图并比较观测结果与自己的预测。"};
  if (/化学|化工/.test(major.name)) return {study:major.courses,
    focus:"是否愿意分析物质性质与反应条件，整理实验现象并解释结果。",
    task:"选一份公开化学实验视频或数据，记录变量、现象及结论，区分观察与推测。"};
  if (/生物|生态/.test(major.name)) return {study:major.courses,
    focus:"是否喜欢观察生命现象、比较样本，并解释生物过程中的差异。",
    task:"选一份公开生物观察数据，比较两组样本，解释差异并列出尚需验证的问题。"};
  if (/工业工程/.test(major.name)) return {
    study: "运筹、流程优化、统计分析与供应链",
    focus: "是否喜欢收集数据、分析流程，并检验改进方案的效果。",
    task: "观察一次校园排队，记录等待时间，画流程图并提出一个改进方案。"
  };
  if (/工程管理|工程造价/.test(major.name)) return {
    study: "工程经济、项目计划、预算与管理",
    focus: "是否愿意处理预算、任务依赖、进度协调与执行问题。",
    task: "为一次校园活动制作预算、排期和风险清单，并处理一次计划变更。"
  };
  if (/通信|电子|电气|自动化|物联网/.test(major.name)) return {
    study: major.courses,
    focus: "是否愿意深入学习数理原理，并持续处理系统调试和技术问题。",
    task: "用安全的仿真工具搭建一个简单电路或控制系统，记录三组输入与响应。"
  };
  if (/软件|计算机|人工智能|数据科学/.test(major.name)) return {
    study: major.courses,
    focus: "是否享受编程与逻辑构建，并愿意持续测试、定位问题和修改程序。",
    task: "编写一个任务清单小程序，完成三个测试，请同学试用后修正一个问题。"
  };
  return { study: major.courses, focus: `结合「${major.courses}」的课程任务，观察持续兴趣、完成情况与遇阻后的投入。`,
    task: `选择「${major.courses}」中的一个入门主题，完成一个练习或作品并请老师反馈。` };
}


function buildParentPortrait(score, measures) {
  const strong = (kind) => measures.filter((m) => m.kind === kind && m.count && m.value >= 0.75).sort((a,b) => b.value-a.value);
  const interests = strong("interest").slice(0,3).map((m) => getIntegratedLabel(m.dim));
  const domains = strong("domain").slice(0,3).map((m) => DOMAIN_LABELS[m.dim.replace("domain.","")]);
  const skills = strong("confidence").slice(0,2).map((m) => getIntegratedLabel(m.dim));
  const independent = measures.filter((m) => m.kind === "experience" && m.count && m.value >= 0.75).map((m) => getIntegratedLabel(m.dim));
  const values = strong("value").slice(0,3).map((m) => getIntegratedLabel(m.dim));
  const expression = measures.find((m) => m.kind === "confidence" && m.dim === "skill.expression");
  const coordination = measures.find((m) => m.kind === "confidence" && m.dim === "skill.coordination");
  const socialHigh = [expression,coordination].filter((m) => m?.count && m.value >= 0.75).map((m) => getIntegratedLabel(m.dim));
  const socialLow = [expression,coordination].filter((m) => m?.count && m.value <= 0.25).map((m) => getIntegratedLabel(m.dim));
  const thinking = (score["cognition.abstract"] || 0) >= 0.45
    ? "倾向先理解原理和逻辑，再进入具体问题。更适合在概念讲解与实际应用相结合的学习中建立理解。"
    : (score["cognition.system"] || 0) >= 0.45
      ? "倾向通过结构、步骤和任务之间的联系理解内容。清晰的任务安排和阶段反馈有助于持续推进。"
      : (score["cognition.contextual"] || 0) >= 0.45
        ? "更容易结合具体情境与实际用途理解内容，适合通过案例和真实任务逐步深入。"
        : "学习方式未呈现单一突出倾向，适合将原理讲解、案例与动手练习结合，并观察哪种方式更有助于理解。";
  return [
    {title:"兴趣方向",text:interests.length ? `兴趣主要集中在${interests.join("、")}。${domains.length ? `具体更愿意持续投入${domains.join("、")}相关任务，专业选择宜围绕这些学习内容展开。` : "专业选择宜进一步比较具体课程内容，区分对领域名称的兴趣与对日常学习任务的投入。"}` : "兴趣分布较分散，尚未呈现集中的偏好方向。专业比较宜从具体课程和任务入手，明确哪些内容能够持续吸引学生。"},
    {title:"思考与学习方式",text:thinking},
    {title:"实践倾向",text:`${skills.length ? `对${skills.join("、")}相关任务较有信心。` : "对具体任务的自我把握较为谨慎，宜通过小型成果逐步建立信心。"}${independent.length ? `已在${independent.join("、")}方面积累独立完成经历，适合进一步增加任务复杂度。` : "目前独立完成任务的经历有限，后续重点是积累可展示的作品或项目成果。"}`},
    {title:"表达与协作",text:socialHigh.length ? `对${socialHigh.join("、")}较有信心，适合在项目中承担相应职责，并通过实际反馈提升协作质量。` : socialLow.length ? `对${socialLow.join("、")}的自我把握较谨慎，宜先承担目标明确的小任务，再逐步增加汇报、沟通或协调责任。` : "对表达与协作的自我评价较为适中或相关经历尚少，可从分工明确的小组任务积累经验。"},
    {title:"职业价值取向",text:values.length ? `较重视${values.join("、")}。比较专业与未来发展路径时，应同时关注这些条件，避免只凭热门程度或专业名称做决定。` : "对未来工作条件尚未形成突出的优先顺序，后续可结合职业访谈和真实项目明确个人取舍。"}
  ];
}


function getMajorDomains(major) {
  const name=major.name;
  if (/工业工程/.test(name)) return ["business","math","engineering"];
  if (/工程管理|工程造价/.test(name)) return ["business","engineering"];
  if (/物理/.test(name)) return ["math","electronics"];
  if (/教育|心理|社会工作|社会学|法律|法学|公共管理|人力资源/.test(name)) return ["people"];
  if (/化学|化工|制药|高分子/.test(name)) return ["chemistry"];
  if (/生物|生态|农|林|食品|医学|临床|护理|药学/.test(name)) return ["biology"];
  if (/数学|统计|精算/.test(name)) return ["math"];
  if (/计算机|软件|人工智能|网络工程|数据科学|信息安全/.test(name)) return ["computing"];
  if (/电子|电气|通信|自动化|测控|物联网|微电子/.test(name)) return ["electronics","computing"];
  if (/机械|车辆|制造|土木|建筑|航空|飞行器|材料成型/.test(name)) return ["engineering"];
  if (/金融|财务|经济|会计|工商|市场|物流|管理/.test(name)) return ["business"];
  if (/设计|艺术|新闻|传播|语言|中文|文学|媒体/.test(name)) return ["creative"];
  if (/教育|心理|社会|法律|法学|公共/.test(name)) return ["people"];
  return [];
}
function rationale(major, measurements) {
 const relevant=getMajorDomains(major),measures=(measurements || []).filter(m=>m.kind==='domain' && m.count && relevant.includes(m.dim.replace('domain.','')));
 const value=measures.length?measures.reduce((sum,m)=>sum+m.value,0)/measures.length:null;
 return measures.length ? value>=0.75 ? '对'+measures.map(m=>DOMAIN_LABELS[m.dim.replace('domain.','')]).join('、')+'相关任务有较强投入意愿，与该专业的主要学习内容相符。'
 : value<=0.25 ? '综合特征使该专业进入候选范围，但对其具体学习任务的投入意愿较低，选择前应重点比较课程接受度。'
 : '综合兴趣与职业偏好支持将该专业纳入比较，具体任务投入意愿适中，选择重点见下方。'
 : '综合兴趣与职业偏好支持将该专业纳入比较，仍需结合其实际课程内容判断长期投入。';
}
const api={portrait:buildParentPortrait,comparison:getMajorComparison,domains:getMajorDomains,rationale};
if(typeof module==='object' && module.exports)module.exports=api;else root.MajorNaviParentReport=api;
})(typeof window!=='undefined'?window:this);

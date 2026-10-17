const fs = require('fs');
const path = require('path');
const vm = require('vm');
const assert = require('assert/strict');
const root = path.resolve(__dirname, '..');
const nodes = new Map();
const noop = () => {};
const context = new Proxy({}, {get: () => noop, set: () => true});
function node(id) {
  if (!nodes.has(id)) nodes.set(id, { value:'', textContent:'', innerHTML:'', style:{},dataset:{},checked:false,
    classList:{add:noop,remove:noop,toggle:noop}, addEventListener:noop,
    getContext:()=>context, querySelectorAll:()=>[], querySelector:()=>null, scrollIntoView:noop, setAttribute:noop });
  return nodes.get(id);
}
let seed = 1702026;
const testMath = Object.create(Math); testMath.random = () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296);
const sandbox = {HTMLCanvasElement:class {},console,URLSearchParams,Uint32Array,Math:testMath,Date,Set,Map,Object,Array,
  document:{getElementById:node,querySelector:node,querySelectorAll:selector=>selector.includes("student-type")?[{checked:true,value:"international",addEventListener:noop}]:[],addEventListener:noop},
  window:{location:{search:''},scrollTo:noop,addEventListener:noop},
  localStorage:{getItem:()=>null,setItem:noop,removeItem:noop},alert:noop};
vm.createContext(sandbox);
for (const file of ['assets/js/official_data.js','assets/js/integrated_questions.js','assets/js/majors_v2.js']) vm.runInContext(fs.readFileSync(path.join(root,file),'utf8'),sandbox);
let source=fs.readFileSync(path.join(root,'assets/js/app.js'),'utf8');
source=source.slice(0,source.lastIndexOf('\napplyMode(DEFAULT_MODE);'));
vm.runInContext(source,sandbox);
const run = code => vm.runInContext(code,sandbox);
// The real sampling functions, not a parallel reimplementation of the algorithm.
for (let i=0;i<50;i++) {
  run('answers = {}; applyMode("full");');
  assert.equal(run('activeQuestions.length'),120);
  assert.equal(run('new Set(activeQuestions.map(q=>q.id)).size'),120);
  assert.equal(run('reserveQuestionIds.some(id=>questionOrder.includes(id))'),false);
  run('answers=Object.fromEntries(activeQuestions.map(q=>[q.id,q.options[0].key])); currentPage=totalPages; appendCalibrationQuestions();');
  assert.equal(run('activeQuestions.length'),138);
  assert.equal(run('new Set(activeQuestions.map(q=>q.id)).size'),138);
  assert.equal(run('activeQuestions.filter(q=>!answers[q.id]).length'),18);
  assert.equal(run('currentPage'),16);
  run('answers=Object.fromEntries(activeQuestions.map(q=>[q.id,q.options[0].key])); calibrationContext={boundaryDims:["cognition.abstract"]}; appendBoundaryFollowUpQuestions();');
  assert.equal(run('activeQuestions.length'),142);
  assert.equal(run('new Set(activeQuestions.map(q=>q.id)).size'),142);
  assert.equal(run('currentPage'),18);
  assert.equal(run('activeQuestions.filter(q=>!answers[q.id]).length'),4);
}
assert.equal(run('getJointPriorityMajors([{matchIndex:100},{matchIndex:98},{matchIndex:98},{matchIndex:97},{matchIndex:96}]).length'),4);
assert.equal(run('getCareerStyleArchetype(Object.fromEntries(dimensionKeys.map(d=>[d,0.4]))).label'),'混合倾向，待进一步探索');
assert.equal(run('getDirectionGroupForMajor({name:"工业工程",category:"工学",courses:"运筹"}).key'),'systems');
assert(run('buildExplorationTask({name:"工业工程"})').includes('排队'));
assert(run('buildExplorationTask({name:"工程管理"})').includes('预算'));
assert(run('buildExplorationTask({name:"软件工程"})').includes('测试用例'));
// Independent ratings allow multiple strong interests; unknown confidence stays unscored.
run('activeQuestions=allQuestions.filter(q=>q.measurement === "independent-rating"); answers=Object.fromEntries(activeQuestions.map(q=>[q.id,q.kind === "confidence" && q.dimension === "skill.data" ? "U" : "5"]));');
assert.equal(run('calculateStudentVector(answers).score["interest.r"]'),1);
assert.equal(run('calculateStudentVector(answers).score["interest.i"]'),1);
assert.equal(run('getIntegratedMeasurements(answers).find(m=>m.kind === "confidence" && m.dim === "skill.data").count'),0);
assert.equal(run('getIntegratedMeasurements(answers).find(m=>m.kind === "confidence" && m.dim === "skill.data").value'),null);
assert.equal(run('squaredDistance({"interest.r":.8,"cognition.abstract":0},majors[0]) === squaredDistance({"interest.r":.8,"cognition.abstract":1},majors[0])'),true);
assert(run('INTEGRATED_QUESTIONS.every(q=>q.source === "MajorNavi自建题目")'));
assert(run('createQuestionHTML(allQuestions.find(q=>q.kind === "confidence"),0).includes("缺少相关经历，暂时无法判断")'));
assert.equal(run('applySubjectWeight(calculateStudentVector(answers).score).score["interest.r"]'),1);
run('answers.G1="1";');
assert.equal(run('calculateStudentVector(answers).score["interest.i"]'),1);
assert.equal(run('calculateStudentVector(answers).score["interest.r"]'),0.5);
// Reuse the previous simulated student's choices when available, matching by question text.
const logPath=path.join(root,'exports/G11-模拟测评-20261017/模拟作答记录.json');
const prior=fs.existsSync(logPath)?JSON.parse(fs.readFileSync(logPath,'utf8')):[];
sandbox.priorChoices=Object.fromEntries(prior.map(r=>[r.question.replace(/^\d+\.\s*/,''),r.answer]));
run(`answers={};applyMode("full"); studentProfile={type:"international",grade:"G11（修订后模拟）"}; internationalProfile={curriculumName:"IB Diploma",scoreText:"Mathematics AA HL 6\\nPhysics HL 6\\nComputer Science HL 6\\nEnglish B SL 5\\nChinese A SL 5\\nEconomics SL 5"};`);
node('student-grade').value='G11（修订后模拟）';
node('international-curriculum-name').value='IB Diploma';
node('international-score-text').value='Mathematics AA HL 6\nPhysics HL 6\nComputer Science HL 6\nEnglish B SL 5\nChinese A SL 5\nEconomics SL 5';
const answerNew = () => run(`for(const q of activeQuestions) { if(answers[q.id]) continue; answers[q.id]=q.measurement === "independent-rating" ? String((q.kind === "interest" ? {"interest.r":4,"interest.i":5,"interest.a":2,"interest.s":2,"interest.e":3,"interest.c":4} : q.kind === "confidence" ? {"skill.data":4,"skill.making":4,"skill.expression":3,"skill.coordination":2} : q.kind === "experience" ? {"skill.data":3,"skill.making":4,"skill.expression":3,"skill.coordination":2} : {"value.autonomy":5,"value.creativity":3,"value.service":3,"value.security":4,"value.wealth":4,"value.influence":3})[q.dimension] || 3) : priorChoices[q.text] || q.options[0].key; }`);
answerNew();run('currentPage=totalPages;appendCalibrationQuestions();');answerNew();
run(`var interim=rankMajors(applySubjectWeight(calculateStudentVector(answers).score).score); if(needsBoundaryFollowUp(interim)) { calibrationContext={...calibrationContext,topMajor:interim[0].name,compareMajor:interim[1].name,boundaryDims:getBoundaryDims(interim[0],interim[1],4),boundaryTags:getBoundaryTags(interim[0],interim[1])}; appendBoundaryFollowUpQuestions(); }`);answerNew();
run(`var simulatedVector=calculateStudentVector(answers);var simulatedWeighted=applySubjectWeight(simulatedVector.score);var simulatedRanked=rankMajors(simulatedWeighted.score);renderResult({...simulatedVector,score:simulatedWeighted.score},simulatedRanked,simulatedWeighted.summary,null);`);
const report=node('result').innerHTML;
assert(report.includes('最高项按模型归一化为100'));
assert(report.includes('02 学生特征分析'));
assert(report.includes('03 专业推荐与比较'));
assert(report.includes('04 后续建议'));
assert(!report.includes('未来4周探索安排'));
assert(!report.includes('家长优先阅读摘要'));
assert(report.indexOf('02 学生特征分析') < report.indexOf('03 专业推荐与比较'));
assert(report.indexOf('03 专业推荐与比较') < report.indexOf('04 后续建议'));
assert(report.indexOf('04 后续建议') < report.indexOf('附录：测评方法'));
const cover=report.slice(report.indexOf('<section class="result-header'),report.indexOf('<div class="result-tools'));
assert(!/候选内相对指数|前两项相对差距|Holland|CIR|指数点|作答倾向指数/.test(cover));
assert(cover.includes('专业建议'));
assert(cover.includes('推荐依据'));
assert(cover.includes('选择重点'));
assert(!/[？?]|目前还不能明确区分/.test(cover));
assert(!/记忆力0分|能力突出|具有较高一致性/.test(report));
assert(!report.includes('值得复核的不同偏好'));
assert(report.includes('关联说明'));
assert(report.includes('不作为冲突证据'));
const payload=run('buildReportPayload({...simulatedVector,score:simulatedWeighted.score},simulatedRanked,simulatedWeighted.summary,null)');
assert(payload.scoreMeaning.includes('不是能力分'));
assert(payload.scoring.integratedMeasurements.some(m=>m.kind === 'confidence'));
assert(report.includes('技能信心'));
assert(report.includes('工作价值观'));
assert(report.includes('实践经历'));
assert(report.includes('不属于MBTI或Kuder正式量表'));
assert.equal(payload.recommendations.filter(r=>r.jointPriority).length, payload.jointPriorityMajors.length>1?payload.jointPriorityMajors.length:0);
// More than three close candidates must be included in both report and stored payload.
run('var tieRanked=simulatedRanked.map((m,i)=>({...m,score01:1-i*.009,matchIndex:Math.round((1-i*.009)*100)})); renderResult({...simulatedVector,score:simulatedWeighted.score},tieRanked,simulatedWeighted.summary,null);');
assert.equal((node('result').innerHTML.match(/<p class="rank-label">同组优先推荐<\/p>/g)||[]).length,4);
// Export a deterministic fixture without touching normal user caches or a real backend.
if(process.argv.includes('--export')) {
  const dir=path.join(root,'exports/G11-修订验证-20261017');fs.mkdirSync(dir,{recursive:true});
  const record=run(`({payload:buildReportPayload({...simulatedVector,score:simulatedWeighted.score},simulatedRanked,simulatedWeighted.summary,null),synced:false,view:{studentVector:{...simulatedVector,score:simulatedWeighted.score},rankedMajors:simulatedRanked,weightingSummary:simulatedWeighted.summary,schoolRecommendation:null,context:{studentProfile,selectedMode,publicSubjectScores,internationalProfile,schoolMajorText,calibrationContext,calibrationAdded,followUpAdded},answers,questionIds:activeQuestions.map(q=>q.id)}})`);
  // Fixture invokes production renderResult in a normal browser, without auth or network side effects.
  fs.writeFileSync(path.join(dir,'simulation.json'),JSON.stringify(record,null,2));
  const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
  let fixture=html.replace('<head>','<head><base href="../../">');
  fixture=fixture.replace(/  <script>\s*window.ADMIN_DASHBOARD_PATH[\s\S]*?<\/script>/,'<script>window.REPORT_API_BASE_URL="";</script>');
  fixture=fixture.replace('</body>',`<script>\nconst fixture=${JSON.stringify(record).replace(/</g,'\\u003c')};\n({studentProfile,selectedMode,publicSubjectScores,internationalProfile,schoolMajorText,calibrationContext,calibrationAdded,followUpAdded}=fixture.view.context);\nanswers=fixture.view.answers;activeQuestions=allQuestions.filter(q=>fixture.view.questionIds.includes(q.id));\nrenderResult(fixture.view.studentVector,fixture.view.rankedMajors,fixture.view.weightingSummary,null);\nauthGate.classList.add('hidden');assessmentShell.classList.remove('hidden');intro.classList.add('hidden');quizForm.classList.add('hidden');resultBox.classList.remove('hidden');\ndocument.querySelectorAll('#result details:not(.report-methods)').forEach(d=>d.open=true);\n</script></body>`);
  // Omit auth initialization in this isolated fixture to preserve existing user records.
  fixture=fixture.replace('assets/js/app.js?v=20261017-independent-v8','exports/G11-修订验证-20261017/app-fixture.js');
  fs.writeFileSync(path.join(dir,'app-fixture.js'),source);
  fs.writeFileSync(path.join(dir,'报告验证.html'),fixture);
}
console.log('PASS: 50 randomized unique-question flows, pagination, all close candidates, neutral fallback, evidence, tasks, G11 report and payload consistency');

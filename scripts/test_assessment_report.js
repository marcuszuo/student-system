const fs=require('fs');
const path=require('path');
const assert=require('assert/strict');
const {root,source,nodes,sandbox,run}=require('./lib/assessment_harness').createAssessmentHarness();
const node=id=>nodes.get(id);
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
run('answers={};applyMode("standard");');
assert.equal(run('activeQuestions.length'),80);
assert.equal(run('new Set(activeQuestions.filter(q=>q.kind === "domain").map(q=>q.domain)).size'),9);
assert(run('allQuestions.filter(q=>q.kind === "domain").every(q=>q.options.some(o=>o.key === "U" && o.rating === null))'));
assert.deepEqual(JSON.parse(run('JSON.stringify(getMajorDomains({name:"人力资源管理"}))')),['people']);
// Reuse the previous simulated student's choices when available, matching by question text.
const logPath=path.join(root,'exports/G11-模拟测评-20261017/模拟作答记录.json');
const prior=fs.existsSync(logPath)?JSON.parse(fs.readFileSync(logPath,'utf8')):[];
sandbox.priorChoices=Object.fromEntries(prior.map(r=>[r.question.replace(/^\d+\.\s*/,''),r.answer]));
run(`answers={};applyMode("full"); studentProfile={type:"international",grade:"G11（修订后模拟）"}; internationalProfile={curriculumName:"IB Diploma",scoreText:"Mathematics AA HL 6\\nPhysics HL 6\\nComputer Science HL 6\\nEnglish B SL 5\\nChinese A SL 5\\nEconomics SL 5"};`);
node('student-grade').value='G11（修订后模拟）';
node('international-curriculum-name').value='IB Diploma';
node('international-score-text').value='Mathematics AA HL 6\nPhysics HL 6\nComputer Science HL 6\nEnglish B SL 5\nChinese A SL 5\nEconomics SL 5';
const answerNew = () => run(`for(const q of activeQuestions) { if(answers[q.id]) continue; answers[q.id]=q.measurement === "independent-rating" ? String((q.kind === "domain" ? {"domain.computing":5,"domain.electronics":4,"domain.engineering":3,"domain.math":4,"domain.chemistry":2,"domain.biology":2,"domain.business":3,"domain.people":2,"domain.creative":2} : q.kind === "interest" ? {"interest.r":4,"interest.i":5,"interest.a":2,"interest.s":2,"interest.e":3,"interest.c":4} : q.kind === "confidence" ? {"skill.data":4,"skill.making":4,"skill.expression":3,"skill.coordination":2} : q.kind === "experience" ? {"skill.data":3,"skill.making":4,"skill.expression":3,"skill.coordination":2} : {"value.autonomy":5,"value.creativity":3,"value.service":3,"value.security":4,"value.wealth":4,"value.influence":3})[q.dimension] || 3) : priorChoices[q.text] || q.options[0].key; }`);
answerNew();run('currentPage=totalPages;appendCalibrationQuestions();');answerNew();
run(`var interim=rankMajors(applySubjectWeight(calculateStudentVector(answers).score).score); if(needsBoundaryFollowUp(interim)) { calibrationContext={...calibrationContext,topMajor:interim[0].name,compareMajor:interim[1].name,boundaryDims:getBoundaryDims(interim[0],interim[1],4),boundaryTags:getBoundaryTags(interim[0],interim[1])}; appendBoundaryFollowUpQuestions(); }`);answerNew();
run(`var simulatedVector=calculateStudentVector(answers);var simulatedWeighted=applySubjectWeight(simulatedVector.score);var simulatedRanked=rankMajors(simulatedWeighted.score);renderResult({...simulatedVector,score:simulatedWeighted.score},simulatedRanked,simulatedWeighted.summary,null);`);
const report=node('result').innerHTML;
assert(!/Holland|MBTI|Kuder|有效回答|作答明细|计分|归一化|题目记录/.test(report));
assert(report.includes('02 学生特征分析'));
assert(report.includes('03 专业推荐与比较'));
assert(report.includes('04 后续建议'));
assert(!report.includes('未来4周探索安排'));
assert(!report.includes('家长优先阅读摘要'));
assert(report.indexOf('02 学生特征分析') < report.indexOf('03 专业推荐与比较'));
assert(report.indexOf('03 专业推荐与比较') < report.indexOf('04 后续建议'));
assert(!report.includes('附录'));
assert.equal((report.match(/class="report-feature-card"/g)||[]).length,5);
const cover=report.slice(report.indexOf('<section class="result-header'),report.indexOf('<div class="result-tools'));
assert(!/候选内相对指数|前两项相对差距|Holland|CIR|指数点|作答倾向指数/.test(cover));
assert(cover.includes('专业建议'));
assert(cover.includes('推荐依据'));
assert(cover.includes('选择重点'));
assert(!/[？?]|目前还不能明确区分/.test(cover));
assert(!/记忆力0分|能力突出|具有较高一致性/.test(report));
assert(!report.includes('值得复核的不同偏好'));
for(const heading of ['兴趣方向','思考与学习方式','实践倾向','表达与协作','职业价值取向']) assert(report.includes(heading));


const payload=run('buildReportPayload({...simulatedVector,score:simulatedWeighted.score},simulatedRanked,simulatedWeighted.summary,null)');
assert(payload.scoreMeaning.includes('不是能力分'));
assert(payload.scoring.integratedMeasurements.some(m=>m.kind === 'confidence'));




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
  fixture=fixture.replace(/<script src="assets\/js\/analytics.js[^"]*"><\/script>/,'');
  fixture=fixture.replace('</body>',`<script>\nconst fixture=${JSON.stringify(record).replace(/</g,'\\u003c')};\n({studentProfile,selectedMode,publicSubjectScores,internationalProfile,schoolMajorText,calibrationContext,calibrationAdded,followUpAdded}=fixture.view.context);\nanswers=fixture.view.answers;activeQuestions=allQuestions.filter(q=>fixture.view.questionIds.includes(q.id));\nrenderResult(fixture.view.studentVector,fixture.view.rankedMajors,fixture.view.weightingSummary,null,fixture.payload);bindReportFeedback(fixture.payload);\nauthGate.classList.add('hidden');assessmentShell.classList.remove('hidden');intro.classList.add('hidden');quizForm.classList.add('hidden');resultBox.classList.remove('hidden');\ndocument.querySelectorAll('#result details:not(.report-methods)').forEach(d=>d.open=true);\n</script></body>`);
  // Omit auth initialization in this isolated fixture to preserve existing user records.
  fixture=fixture.replace('assets/js/app.js?v=20261031-review-v23','exports/G11-修订验证-20261017/app-fixture.js');
  fs.writeFileSync(path.join(dir,'app-fixture.js'),source);
  fs.writeFileSync(path.join(dir,'报告验证.html'),fixture);
}
console.log('PASS: 50 randomized unique-question flows, pagination, all close candidates, neutral fallback, evidence, tasks, G11 report and payload consistency');

// Export only the parent-facing report, never the questionnaire or scoring source.
const fs=require('fs'),path=require('path'),assert=require('assert/strict');
const {root,run,nodes,sandbox}=require('./lib/assessment_harness').createAssessmentHarness();
const folder=path.join(root,'exports/G11-修订验证-20261017');
sandbox.exportRecord=JSON.parse(fs.readFileSync(path.join(folder,'simulation.json'),'utf8'));
run(`({studentProfile,selectedMode,publicSubjectScores,internationalProfile,schoolMajorText,calibrationContext,calibrationAdded,followUpAdded}=exportRecord.view.context); answers=exportRecord.view.answers;activeQuestions=exportRecord.view.questionIds.map(id=>allQuestions.find(q=>q.id===id)).filter(Boolean); renderResult(exportRecord.view.studentVector,exportRecord.view.rankedMajors,exportRecord.view.weightingSummary,null);`);
const report=nodes.get('result').innerHTML;
assert(!/Holland|MBTI|Kuder|独立测量记录|作答明细|有效回答/.test(report));
const css=['assets/css/styles.css','assets/css/report.css'].map(file=>fs.readFileSync(path.join(root,file),'utf8')).join('\n');
const html=`<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>G11学生专业发展测评报告</title><style>${css}</style></head><body><main class="page"><section class="card"><section id="result" class="result">${report}</section></section></main><script>document.getElementById('export-pdf-btn').addEventListener('click',()=>window.print());</script></body></html>`;
assert(!html.includes('questionIds'));assert(!html.includes('INTEGRATED_QUESTIONS'));
fs.writeFileSync(path.join(folder,'G11学生专业发展测评报告.html'),html);
console.log('已导出家长版静态报告：仅含结论、综合画像、专业比较与后续建议。');

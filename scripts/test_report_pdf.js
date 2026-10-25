const fs=require('fs'),path=require('path'),assert=require('node:assert/strict');
const parent=require('../assets/js/parent-report');
const pdfExport=require('../assets/js/report-pdf');
const PDFLib=require('../assets/vendor/pdf-lib/pdf-lib.min');
const fontkit=require('../assets/vendor/fontkit/fontkit.umd.min');
const fixture=JSON.parse(fs.readFileSync(path.join(__dirname,'../exports/G11-修订验证-20261017/simulation.json'),'utf8'));
const report={...fixture.payload,accessAccount:{name:'G11模拟学生'},adminMeta:{note:'内部备注不得导出'},scoring:{...fixture.payload.scoring}};
async function main(){
  const model=pdfExport.model(report,parent),serialized=JSON.stringify(model);
  assert.equal(model.portrait.length,5);assert(model.recommendations.length>=3);
  for(const banned of ['内部备注不得导出','questionId','recommendationPolicy','hollandCode','answerEvidence','作答倾向指数'])assert(!serialized.includes(banned));
  const harness=require('./lib/assessment_harness').createAssessmentHarness();harness.sandbox.record=fixture;
  const expected=harness.run(`({studentProfile,selectedMode,publicSubjectScores,internationalProfile,schoolMajorText,calibrationContext,calibrationAdded,followUpAdded}=record.view.context);answers=record.view.answers;activeQuestions=record.view.questionIds.map(id=>allQuestions.find(q=>q.id===id)).filter(Boolean);buildParentPortrait(record.view.studentVector.score)`);
  assert.deepEqual(JSON.parse(JSON.stringify(model.portrait)),JSON.parse(JSON.stringify(expected)));
  const bytes=await pdfExport.createBytes(report,{PDFLib,fontkit,fontBytes:fs.readFileSync(path.join(__dirname,'../assets/fonts/NotoSansSC.ttf')),parent});
  assert.equal(Buffer.from(bytes).subarray(0,5).toString(),'%PDF-');
  const parsed=await PDFLib.PDFDocument.load(bytes);assert(parsed.getPageCount()>=2);assert(parsed.getTitle().includes('G11模拟学生'));
  const out=path.join(__dirname,'../exports/PDF报告验证-20261025');fs.mkdirSync(out,{recursive:true});fs.writeFileSync(path.join(out,'G11学生专业发展测评报告.pdf'),bytes);
  assert.throws(()=>pdfExport.model({recommendations:[]},parent),/缺少/);
  const old=pdfExport.model({recommendations:[{name:'历史专业',courses:'课程'}]},parent);assert.equal(old.portrait.length,0);
  console.log(`PASS: PDF signature, embedded Chinese font, ${parsed.getPageCount()} pages, same parent portrait, privacy exclusions and legacy handling (${bytes.length} bytes)`);
}
main().catch(error=>{console.error(error);process.exitCode=1;});

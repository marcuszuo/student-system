const fs=require('fs'),path=require('path'),assert=require('node:assert/strict');
const {run,sandbox}=require('./lib/assessment_harness').createAssessmentHarness();
const fixture=JSON.parse(fs.readFileSync(path.join(__dirname,'fixtures/stability_answers_v9.json'),'utf8'));
sandbox.ids=fixture.questionIds;run('activeQuestions=ids.map(id=>allQuestions.find(q=>q.id===id));');
const questions=JSON.parse(run('JSON.stringify(activeQuestions)')),base=fixture.profiles[0].answers;
function rank(answers){sandbox.caseAnswers=answers;return JSON.parse(run('answers=caseAnswers;JSON.stringify(rankMajors(calculateStudentVector(answers).score).map(m=>({name:m.name,distance:m._dist})))'));}
const cases=[['math','数学与应用数学'],['electronics','应用物理学'],['computing','计算机科学与技术'],['chemistry','应用化学'],['biology','生物科学']];
const summary=[];
for(const [domain,expected] of cases){
  const answers={...base};questions.filter(q=>q.kind==='domain').forEach(q=>answers[q.id]=q.domain===domain?'5':'1');
  const result=rank(answers);assert.equal(result[0].name,expected,domain+' should separate same-interest profiles');assert.deepEqual(rank(answers),result);
  const neutral={...answers};questions.filter(q=>q.kind==='domain' && q.domain===domain).forEach(q=>neutral[q.id]='U');
  const other=rank(neutral).find(x=>x.name===expected);assert(result[0].distance<other.distance);
  summary.push({taskPreference:domain,top3:result.slice(0,3).map(x=>x.name)});
}
const unknown={...base};questions.filter(q=>q.kind==='domain').forEach(q=>unknown[q.id]='U');
sandbox.unknown=unknown;assert(run(`answers=unknown;activeQuestions.filter(q=>q.kind==='domain').every(q=>getDomainSupport({name:'数学与应用数学'}).answered===0)`));
const out=path.join(__dirname,'../exports/推荐区分度验证-20261031');fs.mkdirSync(out,{recursive:true});
fs.writeFileSync(path.join(out,'同兴趣不同任务偏好.json'),JSON.stringify({description:'固定其他回答，仅改变专业任务偏好；合成软件回归，不代表真实学生准确率或信效度。',cases:summary},null,2));
console.log('PASS: same broad interests separate mathematics/physics/computing/chemistry/biology; unknown tasks remain neutral');

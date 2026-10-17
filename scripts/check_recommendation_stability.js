const fs=require('fs'),path=require('path'),assert=require('assert/strict');
const {root,run,sandbox}=require('./lib/assessment_harness').createAssessmentHarness();
const fixturePath=path.join(__dirname,'fixtures/stability_answers_v9.json');
if(process.argv.includes('--freeze')) {
  run('answers={};applyMode("full");');
  const questions=JSON.parse(run('JSON.stringify(activeQuestions)'));
  const profiles=[
    {name:'技术研究',interest:[4,5,2,2,3,4],skill:[4,4,3,2],domain:[5,4,3,4,2,2,3,2,2]},
    {name:'生命科学',interest:[3,5,2,4,2,3],skill:[4,3,3,3],domain:[2,2,2,4,4,5,2,4,2]},
    {name:'经营组织',interest:[2,3,3,4,5,4],skill:[4,2,4,5],domain:[2,2,2,3,2,2,5,4,4]},
    {name:'创意表达',interest:[2,3,5,4,3,2],skill:[3,3,5,4],domain:[3,2,2,2,2,2,3,4,5]}
  ];
  const interests=['r','i','a','s','e','c'],skills=['data','making','expression','coordination'];
  profiles.forEach(p=>{
    const targets=Object.fromEntries(interests.map((d,i)=>['interest.'+d,(p.interest[i]-1)/4]));
    skills.forEach((d,i)=>targets['skill.'+d]=(p.skill[i]-1)/4);
    const domains=['computing','electronics','engineering','math','chemistry','biology','business','people','creative'];
    domains.forEach((d,i)=>targets['domain.'+d]=(p.domain[i]-1)/4);
    p.answers=Object.fromEntries(questions.map(q=>{
      if(q.measurement==='independent-rating')return [q.id,String(Math.round((targets[q.dimension]??0.5)*4)+1)];
      const selected=q.options.slice().sort((a,b)=>(targets[b.dim]??0.5)-(targets[a.dim]??0.5))[0];return[q.id,selected.key];
    }));
  });
  fs.writeFileSync(fixturePath,JSON.stringify({version:'v9-fixed-answers',questionIds:questions.map(q=>q.id),profiles},null,2)+'\n');
}
const fixture=JSON.parse(fs.readFileSync(fixturePath,'utf8'));
sandbox.fixedIds=fixture.questionIds;
run('activeQuestions=fixedIds.map(id=>allQuestions.find(q=>q.id===id));');
assert(run('activeQuestions.every(Boolean)'));assert.equal(new Set(fixture.questionIds).size,fixture.questionIds.length);
const questions=JSON.parse(run('JSON.stringify(activeQuestions)'));
const rank=(answerMap,enhanced)=>{
 sandbox.caseAnswers=answerMap;
 sandbox.enhanced=enhanced;
 return JSON.parse(run(`JSON.stringify((()=>{answers=caseAnswers;const vector=calculateStudentVector(answers).score;const original=getDomainSupport;try{if(!enhanced)getDomainSupport=()=>({answered:0,value:null});return rankMajors(vector).map(m=>({name:m.name,score01:m.score01,matchIndex:m.matchIndex}));}finally{getDomainSupport=original;}})())`));
};
const reports=[];
for(const p of fixture.profiles){
 const modes=[];
 for(const enhanced of [false,true]){
  const base=rank(p.answers,enhanced);assert.deepEqual(rank(p.answers,enhanced),base);
  let cases=0,top1Changes=0,retention=0;
  for(const q of questions){
    const current=q.options.findIndex(o=>o.key===p.answers[q.id]);
    const indexes=q.measurement==='independent-rating'?[current-1,current+1]:[(current+1)%q.options.length];
    for(const i of indexes){
      const option=q.options[i];if(!option || (q.measurement==='independent-rating' && typeof option.rating!=='number'))continue;
      const next=rank({...p.answers,[q.id]:option.key},enhanced);cases++;
      top1Changes+=next[0].name!==base[0].name?1:0;
      retention+=next.slice(0,3).filter(n=>base.slice(0,3).some(b=>b.name===n.name)).length/3;
    }
  }
  if(enhanced) { assert(top1Changes/cases <= 0.10, 'Synthetic top-one changes exceed reviewed regression limit'); assert(retention/cases >= 0.90, 'Synthetic top-three retention falls below reviewed regression limit'); }
  modes.push({mode:enhanced?'加入专业任务偏好':'原有广泛兴趣模型',top3:base.slice(0,3).map(m=>m.name),cases,top1Changes,top1ChangeRate:top1Changes/cases,averageTop3Retention:retention/cases});
 }
 reports.push({profile:p.name,comparisons:modes});
}
// Broad interests alone cannot distinguish these two fixed profiles; domain tasks should add information.
const first=fixture.profiles[0].answers;
const switched={...first};questions.filter(q=>q.kind==='domain').forEach(q=>{switched[q.id]=q.domain==='biology'||q.domain==='chemistry'?'5':q.domain==='computing'||q.domain==='electronics'?'1':'3';});
assert.deepEqual(rank(first,false),rank(switched,false));
assert.notDeepEqual(rank(first,true).slice(0,3),rank(switched,true).slice(0,3));
const unknownDomains={...first};questions.filter(q=>q.kind==='domain').forEach(q=>unknownDomains[q.id]='U');
assert.deepEqual(rank(unknownDomains,false),rank(unknownDomains,true));
const out=path.join(root,'exports/stability-20261018');fs.mkdirSync(out,{recursive:true});
fs.writeFileSync(path.join(out,'稳定性检查.json'),JSON.stringify({fixture:fixture.version,questionCount:fixture.questionIds.length,reports},null,2));
let md='# 固定作答稳定性检查\n\n固定同一题目集合和答案，仅改变一道题。独立评价题上下调整一档，原有情境题改选另一选项。相同输入重复运行结果完全一致。比较两种模型时使用完全相同的作答。\n\n';
md+='|模拟画像|模型|扰动次数|第一名变化|前三名平均保留比例|前三名|\n|---|---|---:|---:|---:|---|\n';
for(const r of reports)for(const m of r.comparisons)md+=`|${r.profile}|${m.mode}|${m.cases}|${(m.top1ChangeRate*100).toFixed(1)}%|${(m.averageTop3Retention*100).toFixed(1)}%|${m.top3.join('、')}|\n`;
md+='\n第一名变化率高并不自动说明推荐失效，应结合接近分组和前三名保留比例理解。任务偏好补充分流作用的断言通过，但不能据此声称信效度提高。此检查为固定合成样本的软件敏感性分析，未包含真实学生复测；未证明心理测量效度。\n';
fs.writeFileSync(path.join(out,'稳定性检查.md'),md);
console.log(md);

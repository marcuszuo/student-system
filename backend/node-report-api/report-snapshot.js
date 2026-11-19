const load=require('./shared'),renderer=load('report-pdf'),parent=load('parent-report');
function capture(report,{replace=false,legacy=false}={}){
  if(['assessment_session','assessment_feedback'].includes(report.recordType) || !report.recommendations?.length)return report;
  if(!replace && renderer.isFrozen(report.frozenReport))return report;
  return {...report,frozenReport:{...renderer.freeze(report,parent),origin:legacy?'legacy-at-upgrade':'at-submission'}};
}
module.exports={capture};

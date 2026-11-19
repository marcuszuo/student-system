const tools=require('./shared')('report-list-tools');
function isReport(item){return !['assessment_session','assessment_feedback'].includes(item.recordType);}
function type(item){return item.studentProfile?.type || (String(item.studentProfile?.typeLabel || '').includes('国际')?'international':'public');}
function positive(value,fallback,max){const number=Number(value);return Number.isInteger(number) && number>0?Math.min(number,max):fallback;}
function select(all,params){
  const from=params.get('date_from'),to=params.get('date_to');
  const boundary=(value,end)=>!value?null:/^\d{4}-\d{2}-\d{2}$/.test(value)?tools.dateBoundary(value,end):new Date(value).toISOString();
  let start,end;try{start=boundary(from,false);end=boundary(to,true);}catch{const error=Error('日期格式无效');error.status=400;throw error;}
  if(start && end && start>end){const error=Error('开始日期不能晚于结束日期');error.status=400;throw error;}
  const query=params.get('q') || '',grade=(params.get('grade') || '').toLowerCase(),state=params.get('status'),studentType=params.get('type');
  const filtered=all.filter(isReport).filter(item=>{
    const time=Date.parse(item.submittedAt);
    return (!start || time>=Date.parse(start)) && (!end || time<=Date.parse(end)) && (!studentType || type(item)===studentType)
      && (!state || (item.adminMeta?.status || 'new')===state) && (!grade || String(item.studentProfile?.grade || '').toLowerCase().includes(grade)) && tools.matches(item,query);
  });
  const sort=params.get('sort') || 'submitted_desc';
  filtered.sort((a,b)=>{
    const date=String(b.submittedAt || '').localeCompare(String(a.submittedAt || ''));
    const delta=sort==='submitted_asc'?-date:sort==='match_desc'?Number(b.recommendations?.[0]?.matchIndex || 0)-Number(a.recommendations?.[0]?.matchIndex || 0) || date:sort==='major_asc'?String(a.recommendations?.[0]?.name || '').localeCompare(String(b.recommendations?.[0]?.name || ''),'zh-CN') || date:date;
    return delta || String(a.id).localeCompare(String(b.id));
  });return filtered;
}
function page(all,params){
  const rows=select(all,params),size=positive(params.get('page_size'),20,200),pages=Math.max(1,Math.ceil(rows.length/size)),current=Math.min(positive(params.get('page'),1,Number.MAX_SAFE_INTEGER),pages);
  const today=tools.day(Date.now());
  return {items:rows.slice((current-1)*size,current*size),pagination:{page:current,pages,total:rows.length,pageSize:size,start:rows.length?(current-1)*size+1:0,end:Math.min(current*size,rows.length)},overview:{total:rows.length,today:rows.filter(x=>tools.day(x.submittedAt)===today).length,public:rows.filter(x=>type(x)==='public').length,international:rows.filter(x=>type(x)==='international').length,highIntent:rows.filter(x=>x.adminMeta?.status==='high_intent').length}};
}
function csv(all,params){
  const labels={new:'新报告',pending:'待跟进',contacted:'已沟通',high_intent:'高意向'};
  const rows=select(all,params).filter(x=>params.get('high_intent')!=='1' || x.adminMeta?.status==='high_intent');
  return '\uFEFF'+[['报告编号','使用者','账号','提交时间（北京时间）','学生类型','年级','课程背景','跟进状态','首选专业','后台备注'],...rows.map(x=>[x.id,x.accessAccount?.name,x.accessAccount?.username,new Date(x.submittedAt).toLocaleString('zh-CN',{timeZone:'Asia/Shanghai',hour12:false}),x.studentProfile?.typeLabel,x.studentProfile?.grade,x.studentProfile?.curriculumSummary,labels[x.adminMeta?.status || 'new'],x.recommendations?.[0]?.name,x.adminMeta?.note])].map(row=>row.map(tools.csvValue).join(',')).join('\r\n');
}
module.exports={page,select,csv};

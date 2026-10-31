(function(root){
  function day(value){
    const date=new Date(value);if(!value || !Number.isFinite(date.getTime()))return '';
    const parts=new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Shanghai',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(date);
    const get=type=>parts.find(x=>x.type===type).value;return `${get('year')}-${get('month')}-${get('day')}`;
  }
  function matches(report,query){
    const text=[report.id,report.accessAccount?.name,report.accessAccount?.username,report.studentProfile?.grade,report.studentProfile?.curriculumSummary,
      ...(report.recommendations || []).map(x=>x.name),...(report.directions || []).map(x=>x.label),...(report.advisorTags || [])].filter(Boolean).join(' ').toLowerCase();
    return String(query || '').trim().toLowerCase().split(/\s+/).filter(Boolean).every(word=>text.includes(word));
  }
  function paginate(items,page,size){
    size=[10,20,50].includes(Number(size))?Number(size):20;
    const pages=Math.max(1,Math.ceil(items.length/size)),current=Math.min(pages,Math.max(1,Math.floor(Number(page)||1)));
    return {items:items.slice((current-1)*size,current*size),page:current,pages,total:items.length,start:items.length?(current-1)*size+1:0,end:Math.min(current*size,items.length)};
  }
  function csvValue(value){const text=String(value??'').replace(/^[\s]*[=+@-]/,"'$&");return '"'+text.replace(/"/g,'""')+'"';}
  function dateBoundary(value,end=false){return new Date(`${value}T${end?'23:59:59.999':'00:00:00.000'}+08:00`).toISOString();}
  const api={day,matches,paginate,csvValue,dateBoundary};if(typeof module==='object' && module.exports)module.exports=api;else root.MajorNaviReportList=api;
})(typeof window!=='undefined'?window:this);

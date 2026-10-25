(function (root) {
  const DAY=86400000;
  function deadlines(account,now=Date.now()) {
    if(account.status==='disabled')return [];
    const a=account.features?.assessment,g=account.features?.gaokao,items=[];
    if(a?.enabled)items.push({label:account.reportId?'报告查看':'测评',date:account.reportId?a.viewUntil:a.expiresAt});
    if(g?.enabled)items.push({label:'高考查询',date:g.expiresAt});
    return items.filter(x=>x.date && Number.isFinite(Date.parse(x.date))).map(x=>({...x,remaining:Date.parse(x.date)-now}));
  }
  function matches(account,filter,now=Date.now()) {
    const dates=deadlines(account,now);
    if(filter==='soon')return dates.some(x=>x.remaining>0 && x.remaining<=7*DAY);
    if(filter==='expired')return dates.some(x=>x.remaining<=0);
    if(filter==='pending')return Boolean(account.features?.assessment?.canStart);
    if(filter==='query-unused')return Boolean(account.features?.gaokao?.canQuery && !account.features.gaokao.queryCount);
    return true;
  }
  function summary(accounts,now=Date.now()) {
    return {total:accounts.length,pending:accounts.filter(x=>matches(x,'pending',now)).length,
      completed:accounts.filter(x=>x.reportId).length,queryUnused:accounts.filter(x=>matches(x,'query-unused',now)).length,
      soon:accounts.filter(x=>matches(x,'soon',now)).length,expired:accounts.filter(x=>matches(x,'expired',now)).length};
  }
  function csv(rows) {
    return '\uFEFF'+rows.map(row=>row.map(value=>'"'+String(value??'').replace(/^[\s]*[=+@-]/,"'$&").replace(/"/g,'""')+'"').join(',')).join('\r\n');
  }
  const api={deadlines,matches,summary,csv};
  if(typeof module==='object' && module.exports)module.exports=api;
  else root.MajorNaviAccountInsights=api;
})(typeof window!=='undefined'?window:this);

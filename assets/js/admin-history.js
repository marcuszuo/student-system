(function(root){
  const capabilities=new Map();
  async function supported(base){
    if(!capabilities.has(base))capabilities.set(base,fetch(base+'/api/auth/capabilities').then(r=>{if(!r.ok)throw Error('无法检查后台版本');return r.json();}).then(x=>Boolean(x.historyPagination)).catch(error=>{capabilities.delete(base);throw error;}));
    return capabilities.get(base);
  }
  function params(filters){
    const result=new URLSearchParams({paged:'1',include_observations:'1',page:String(filters.page || 1),page_size:String(filters.pageSize || 20)});
    for(const key of ['q','grade','status','type','sort','date_from','date_to'])if(filters[key])result.set(key,filters[key]);return result;
  }
  async function load(config,filters,signal){
    const response=await fetch(config.apiBase+'/api/reports?'+params(filters),{headers:{'x-admin-token':config.token},signal});
    if(!response.ok)throw Error('历史报告加载失败（'+response.status+'）');return response.json();
  }
  async function download(config,filters,highIntent){
    const query=params(filters);query.set('export','csv');if(highIntent)query.set('high_intent','1');
    const response=await fetch(config.apiBase+'/api/reports?'+query,{headers:{'x-admin-token':config.token}});
    if(!response.ok)throw Error('历史清单导出失败（'+response.status+'）');
    const url=URL.createObjectURL(await response.blob()),link=document.createElement('a');link.href=url;link.download='majornavi-'+(highIntent?'high-intent':'report-list')+'-'+new Date().toISOString().slice(0,10)+'.csv';document.body.appendChild(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),60000);
  }
  root.MajorNaviHistory={supported,params,load,download};
})(window);

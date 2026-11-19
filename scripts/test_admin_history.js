const fs=require('fs'),path=require('path'),vm=require('vm'),assert=require('node:assert/strict');
async function main(){
  const calls=[];let queryResolve;
  const context={window:{},URLSearchParams,URL:{createObjectURL:()=> 'blob:test',revokeObjectURL:()=>{}},setTimeout:()=>{},Date,document:{body:{appendChild:()=>{}},createElement:()=>({click:()=>calls.push('download'),remove:()=>{}})},fetch:async(url,options)=>{
    calls.push({url,options});
    if(url.endsWith('capabilities'))return {ok:true,json:async()=>({historyPagination:true})};
    if(url.includes('export=csv'))return {ok:true,blob:async()=>({})};
    return {ok:true,json:async()=>({items:[{id:'older-than-200'}],pagination:{page:12,total:241}})};
  }};
  vm.runInNewContext(fs.readFileSync(path.join(__dirname,'../assets/js/admin-history.js'),'utf8'),context);
  const api=context.window.MajorNaviHistory,base='http://example.test';
  assert(await api.supported(base));assert(await api.supported(base));assert.equal(calls.length,1);
  const result=await api.load({apiBase:base,token:'test-only'},{page:12,pageSize:20,q:'老学生',date_from:'2026-01-01'});
  assert.equal(result.pagination.total,241);const request=calls.find(x=>x.url?.includes('paged=1'));assert.equal(request.options.headers['x-admin-token'],'test-only');assert(request.url.includes('page=12'));
  await api.download({apiBase:base,token:'test-only'},{q:'老学生'},true);assert(calls.some(x=>x.url?.includes('high_intent=1')));assert(calls.includes('download'));
  context.fetch=async()=>({ok:true,json:async()=>({version:2})});assert.equal(await api.supported('http://legacy.test'),false);
  context.fetch=async()=>({ok:false,status:500});await assert.rejects(()=>api.load({apiBase:base,token:'t'},{}),/500/);
  console.log('PASS: server-history capability, page/query/auth forwarding, full CSV export, legacy fallback and errors');
}
main().catch(error=>{console.error(error);process.exitCode=1;});

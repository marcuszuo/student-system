// Authenticated entry and recording around the existing local recommendation tool.
(function () {
  const api=window.MajorNaviAccess,base=String(window.GAOKAO_QUERY_API_BASE_URL || '').replace(/\/+$/,'');
  const shell=document.querySelector('.gaokao-shell'),gate=document.getElementById('gaokao-access-gate');
  const status=document.getElementById('gaokao-access-status'),button=document.getElementById('gaokao-search-btn');
  const originalRank=rankSchools,QUEUE='majornavi_gaokao_pending_v1';
  let busy=false,flushing=false,querySession=null,pending=[];
  try{const stored=JSON.parse(localStorage.getItem(QUEUE)||'[]');if(Array.isArray(stored))pending=stored.slice(-30);}catch{}
  function owner(session){return `${session?.account?.id}:${session?.account?.generation}`;}
  function persist(){try{localStorage.setItem(QUEUE,JSON.stringify(pending));return true;}catch{return false;}}
  function message(text){status.textContent=text;}
  function block(text){shell.hidden=true;gate.hidden=false;gate.querySelector('[role="status"]').textContent=text;}
  async function flush() {
    if(flushing)return;const session=api.student();if(!session?.token)return;
    flushing=true;
    try {
      for(const item of [...pending].filter(x=>x.owner===owner(session))) {
        try {await api.request(base,'/api/gaokao-queries',{method:'POST',token:session.token,body:item.payload});pending=pending.filter(x=>x!==item);persist();}
        catch {message('查询记录暂未同步，保留在本机后将自动重试。');return;}
      }
      if(pending.every(x=>x.owner!==owner(session)))message('查询记录已同步，可在有效期内继续查询。');
    } finally {flushing=false;}
  }
  syncGaokaoQueryRecord=async function(payload) {
    const session=querySession || api.student();if(!session?.token)return;
    const item={owner:owner(session),payload};
    pending=pending.filter(x=>!(x.owner===item.owner && x.payload.id===payload.id));pending.push(item);pending=pending.slice(-30);
    const saved=persist();
    message(saved?'查询记录已暂存，正在同步。':'本机暂存失败，正在尝试直接同步。');
    await flush();
  };
  async function guardedRank() {
    if(busy)return;busy=true;
    try {
      const session=api.student();if(!session?.token){block('请先使用发放的账号登录。');return;}
      const verified=await api.request(base,'/api/auth/gaokao-permit',{token:session.token});
      querySession={...session,account:verified.account};api.saveStudent(querySession);
      await originalRank();
    } catch(error) {
      if(error.status===401 || error.status===403)block(error.message);
      else message('暂时无法验证查询权限，请检查网络后重试。');
    } finally {busy=false;querySession=null;}
  }
  rankSchools=guardedRank;
  document.addEventListener('click',event=>{
    if(event.target.closest?.('#gaokao-search-btn')){event.preventDefault();event.stopImmediatePropagation();void guardedRank();}
  },true);
  document.addEventListener('keydown',event=>{
    if(event.key==='Enter' && ['gaokao-score','gaokao-rank','gaokao-city'].includes(event.target.id)){event.preventDefault();event.stopImmediatePropagation();void guardedRank();}
  },true);
  document.getElementById('gaokao-student-logout').addEventListener('click',()=>void api.logoutStudent(base));
  window.addEventListener('online',()=>void flush());
  window.addEventListener('pagehide',()=>{persist();});
  async function init() {
    try {
      const session=await api.verifyStudent(base);
      if(!session.account?.features?.gaokao?.canQuery){block('当前账号未开通高考查询或查询权限已过期，请联系发放账号的老师。');return;}
      gate.hidden=true;shell.hidden=false;
      document.getElementById('gaokao-student-session').textContent=`账号：${session.username} · 有效期至 ${new Date(session.account.features.gaokao.expiresAt).toLocaleDateString('zh-CN')}`;
      message('可在有效期内多次查询，不影响专业测评次数。');
      if(pending.some(x=>x.owner===owner(session)))void flush();
    } catch(error){block(error.status===403?error.message:'请先登录具有高考查询权限的账号。');}
  }
  void init();
})();

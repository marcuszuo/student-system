(function () {
  const ADMIN_KEY='majornavi-admin-session-v1';
  // Student app owns its existing session key; telemetry receives the token only via this accessor.
  window.MajorNaviAccess = {
    async request(base,route,{method='GET',token='',body}={}) {
      const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),15000);
      try {
        const response=await fetch(String(base).replace(/\/+$/,'')+route,{method,headers:{'Content-Type':'application/json',...(token?{Authorization:`Bearer ${token}`}:{})},...(body?{body:JSON.stringify(body)}:{}),signal:controller.signal});
        const data=await response.json().catch(()=>({}));
        if(!response.ok)throw Object.assign(new Error(data.error || `请求失败（${response.status}）`),{status:response.status});
        return data;
      } finally {clearTimeout(timer);}
    },
    saveAdmin(base,session) {sessionStorage.setItem(ADMIN_KEY,JSON.stringify({apiBase:base,token:session.token,username:session.username}));},
    admin() {try{return JSON.parse(sessionStorage.getItem(ADMIN_KEY)||'null');}catch{return null;}},
    clearAdmin(){try{sessionStorage.removeItem(ADMIN_KEY);}catch{}},
    async logoutAdmin(base) {
      const current=this.admin();
      this.clearAdmin();
      try{localStorage.removeItem('student-major-auth-v1');}catch{}
      try {
        if(current?.token)await this.request(base,'/api/auth/logout',{method:'POST',token:current.token});
      } catch { /* Local logout still completes when the API is unavailable. */ }
      finally {window.location.replace(new URL('../index.html',window.location.href).href);}
    },
    token(){return window.getAssessmentToken?.() || '';}
  };
})();

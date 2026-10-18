(function () {
  const api=window.MajorNaviAccess, base=String(window.ADMIN_DEFAULT_API_BASE || '').replace(/\/+$/,'');
  const host=document.createElement('section');host.className='card';host.id='account-management';
  document.querySelector('main').prepend(host);
  let credentials=[];
  const esc=value=>String(value||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const labels={unused:'未使用',in_progress:'进行中',completed:'已完成',expired:'已过期',disabled:'已停用'};
  async function request(route,options={}) {return api.request(base,route,{...options,token:api.admin()?.token});}
  function showCredentials(items) {
    credentials=items;
    const out=host.querySelector('#account-credentials');
    out.hidden=false;out.querySelector('textarea').value=items.map(x=>`使用者：${x.name || x.username}\n账号：${x.username}\n密码：${x.password}\n有效期至：${new Date(x.expiresAt).toLocaleDateString('zh-CN')}\n登录地址：${new URL('../index.html',location.href).href}`).join('\n\n');
  }
  async function load() {
    const data=await request('/api/admin/accounts');
    host.querySelector('#account-list').innerHTML=`<div class="report-table-wrap"><table><thead><tr><th>使用者</th><th>年级</th><th>账号</th><th>状态</th><th>有效期</th><th>备注 / 关联报告</th><th>操作</th></tr></thead><tbody>${data.items.map(x=>`<tr><td>${esc(x.name || '未登记')}</td><td>${esc(x.grade)}</td><td>${esc(x.username)}</td><td>${esc(labels[x.status])}</td><td>${esc(new Date(x.expiresAt).toLocaleDateString('zh-CN'))}</td><td>${esc(x.note)}<br>${esc(x.reportId || '')}${x.reportId ? `<br><button type="button" data-action="report" data-id="${esc(x.reportId)}">查看报告</button>` : ''}</td><td><button type="button" data-action="edit" data-id="${esc(x.id)}">编辑登记</button> <button type="button" data-action="${x.status==='disabled'?'enable':'disable'}" data-id="${esc(x.id)}">${x.status==='disabled'?'启用':'停用'}</button> <button type="button" data-action="reset" data-id="${esc(x.id)}">重置使用次数与密码</button></td></tr>`).join('')}</tbody></table></div>`;
    host.querySelector('#account-count').textContent=`共 ${data.items.length} 个账号`;
  }
  function manage() {
    if(document.body.dataset.adminView==='gaokao') {
      host.innerHTML='<div class="admin-session-tools"><span>管理员已登录</span><button type="button" id="account-logout" class="btn btn-ghost">退出管理登录</button></div>';
      host.querySelector('#account-logout').addEventListener('click',()=>void api.logoutAdmin(base));
      return;
    }
    host.innerHTML=`<h2>一次性测评账号</h2><p>完成一份报告后核销；中途可继续答题，完成后7天内可登录查看原报告。</p>
      <button type="button" id="account-logout" class="btn btn-ghost">退出管理登录</button>
      <form id="account-create" class="account-form"><label>使用者姓名或内部编号<input name="name" maxlength="80" placeholder="单个账号填写姓名，批量可填写班级"></label><label>年级<input name="grade" maxlength="40" placeholder="例如 G11"></label><label>备注<input name="note" maxlength="500"></label><label>生成数量<input name="count" type="number" value="1" min="1" max="100" required></label><label>有效天数<input name="days" type="number" value="30" min="1" max="365" required></label><button type="submit" class="btn btn-primary">生成账号密码</button></form>
      <p role="status" id="account-status"></p>
      <section id="account-credentials" hidden><h3>本次生成的登录信息</h3><p>密码仅本次显示，请及时复制发放。关闭或离开页面后，后台仅可重置密码。</p><textarea readonly rows="8" aria-label="本次生成的登录信息"></textarea><button type="button" id="account-copy">复制登录信息</button> <button type="button" id="account-download">下载本批次 CSV</button></section>
      <p id="account-count"></p><button type="button" id="account-refresh">刷新账号列表</button><div id="account-list"></div>
      <dialog id="account-edit"><form method="dialog"><h3>编辑使用者登记</h3><input name="id" type="hidden"><label>姓名或内部编号<input name="name" maxlength="80"></label><label>年级<input name="grade" maxlength="40"></label><label>备注<textarea name="note" maxlength="500"></textarea></label><button type="button" id="account-edit-save">保存登记</button><button value="cancel">取消</button></form></dialog>`;
    const status=message=>host.querySelector('#account-status').textContent=message;
    const act=async(fn)=>{try{await fn();}catch(error){status(error.message);}};
    host.querySelector('#account-create').addEventListener('submit',event=>{event.preventDefault();const form=event.currentTarget,button=form.querySelector('button');button.disabled=true;void act(async()=>{try{const f=form.elements,data=await request('/api/admin/accounts',{method:'POST',body:{name:f.name.value,grade:f.grade.value,note:f.note.value,count:Number(f.count.value),days:Number(f.days.value)}});showCredentials(data.items);await load();status('已生成，请复制或下载本次登录信息。');}finally{button.disabled=false;}});});
    host.querySelector('#account-refresh').addEventListener('click',()=>void act(load));
    host.querySelector('#account-copy').addEventListener('click',()=>void act(async()=>{await navigator.clipboard.writeText(host.querySelector('#account-credentials textarea').value);status('登录信息已复制。');}));
    host.querySelector('#account-download').addEventListener('click',()=>{const csv='\uFEFF'+[['使用者','年级','账号','密码','有效期'],...credentials.map(x=>[x.name,x.grade,x.username,x.password,x.expiresAt])].map(row=>row.map(v=>'"'+String(v||'').replace(/^[=+@\-\t\r]/,"'$&").replace(/"/g,'""')+'"').join(',')).join('\n');const link=document.createElement('a');link.href=URL.createObjectURL(new Blob([csv],{type:'text/csv;charset=utf-8'}));link.download='本次发放账号.csv';link.click();setTimeout(()=>URL.revokeObjectURL(link.href),1000);});
    host.querySelector('#account-logout').addEventListener('click',()=>void api.logoutAdmin(base));
    host.querySelector('#account-list').addEventListener('click',event=>{const button=event.target.closest('button[data-action]');if(!button)return;void act(async()=>{const id=button.dataset.id,action=button.dataset.action;
      if(action==='report'){await window.openAccountReport(id);return;}
      if(action==='edit'){const row=(await request('/api/admin/accounts')).items.find(x=>x.id===id),dialog=host.querySelector('#account-edit');for(const field of ['id','name','grade','note'])dialog.querySelector(`[name="${field}"]`).value=row[field]||'';dialog.showModal();return;}
      if(action==='reset'&&!confirm('重置后旧密码和旧登录状态立即失效，该账号可重新完成一次测评；原报告继续保留。是否重置？'))return;
      button.disabled=true;try{const data=await request('/api/admin/accounts/'+encodeURIComponent(id),{method:'PATCH',body:{action}});if(data.item.password)showCredentials([data.item]);await load();status('账号状态已更新。');}finally{button.disabled=false;}
    });});
    host.querySelector('#account-edit-save').addEventListener('click',()=>void act(async()=>{const dialog=host.querySelector('#account-edit'),read=name=>dialog.querySelector(`[name="${name}"]`).value;await request('/api/admin/accounts/'+encodeURIComponent(read('id')),{method:'PATCH',body:{action:'edit',name:read('name'),grade:read('grade'),note:read('note')}});dialog.close();await load();status('使用者登记已保存。');}));
    void act(load);
  }
  async function init() {
    const current=api.admin();
    if(current?.token){try{const verified=await request('/api/auth/session');if(verified.role==='admin'){manage();return;}}catch{api.clearAdmin();}}
    document.querySelectorAll('main > section').forEach(section=>{if(section!==host)section.hidden=true;});
    host.innerHTML='<h1>管理后台登录</h1><form id="admin-login" class="account-form"><label>管理账号<input name="username" autocomplete="username" required value="admin"></label><label>密码<input name="password" type="password" autocomplete="current-password" required></label><button class="btn btn-primary" type="submit">登录管理后台</button><p role="status"></p></form>';
    host.querySelector('form').addEventListener('submit',async event=>{event.preventDefault();const form=event.currentTarget,button=form.querySelector('button');button.disabled=true;try{const session=await api.request(base,'/api/auth/login',{method:'POST',body:{username:form.elements.username.value,password:form.elements.password.value}});if(session.role!=='admin')throw Error('该账号没有管理权限');api.saveAdmin(base,session);location.reload();}catch(error){form.querySelector('[role="status"]').textContent=error.message;}finally{button.disabled=false;}});
  }
  void init();
})();

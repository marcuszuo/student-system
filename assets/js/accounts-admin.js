(function () {
  const api=window.MajorNaviAccess, base=String(window.ADMIN_DEFAULT_API_BASE || '').replace(/\/+$/,'');
  const host=document.createElement('section');host.className='card';host.id='account-management';
  document.querySelector('main').prepend(host);
  let credentials=[],accounts=[],visibleAccounts=[];
  const insights=window.MajorNaviAccountInsights;
  function downloadCsv(rows,name) {
    const link=document.createElement('a');link.href=URL.createObjectURL(new Blob([insights.csv(rows)],{type:'text/csv;charset=utf-8'}));link.download=name;link.click();setTimeout(()=>URL.revokeObjectURL(link.href),1000);
  }
  const permissionOptions='<option value="assessment">仅专业测评</option><option value="gaokao">仅高考查询</option><option value="both">测评与高考查询</option>';
  const permissions=value=>({assessment:value!=="gaokao",gaokao:value!=="assessment"});
  const permissionValue=a=>a.permissions?.gaokao?(a.permissions.assessment?"both":"gaokao"):"assessment";
  const permissionLabel=a=>permissionValue(a)==="both"?"测评＋高考查询":permissionValue(a)==="gaokao"?"仅高考查询":"仅测评";
  const esc=value=>String(value||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const labels={unused:'未使用',in_progress:'进行中',completed:'已完成',expired:'已过期',disabled:'已停用',active:'可用',unavailable:'未开通'};
  async function request(route,options={}) {return api.request(base,route,{...options,token:api.admin()?.token});}
  function credentialText(x) {return `使用者：${x.name || x.username}\n账号：${x.username}\n密码：${x.password}\n已开通：${permissionLabel(x)}\n测评到期：${x.permissions?.assessment?new Date(x.expiresAt).toLocaleDateString("zh-CN"):"未开通"}\n查询到期：${x.permissions?.gaokao?new Date(x.features.gaokao.expiresAt).toLocaleDateString("zh-CN"):"未开通"}\n登录地址：${new URL('../index.html',location.href).href}`;}
  function showCredentials(items) {
    credentials=items;
    const out=host.querySelector('#account-credentials');
    out.hidden=false;out.querySelector('textarea').value=items.map(credentialText).join('\n\n');
    out.querySelector('#account-credential-person').innerHTML='<option value="">整批登录信息</option>'+items.map((x,i)=>`<option value="${i}">${esc(x.name || x.username)} · ${esc(x.username)}</option>`).join('');

  }
  async function load() {
    const data=await request('/api/admin/accounts');accounts=data.items;renderAccounts();
  }
  function renderAccounts() {
    const now=Date.now(),totals=insights.summary(accounts,now);
    host.querySelector('#account-summary').innerHTML=[['账号总数',totals.total],['测评待完成',totals.pending],['已有测评报告',totals.completed],['查询尚未使用',totals.queryUnused],['7天内到期',totals.soon]].map(([label,count])=>`<div><span>${label}</span><strong>${count}</strong></div>`).join('');
    const search=(host.querySelector('#account-search').value || '').trim().toLowerCase();
    const state=host.querySelector('#account-status-filter').value,access=host.querySelector('#account-permission-filter').value;
    const followup=host.querySelector('#account-followup-filter').value;
    const items=accounts.filter(x=>(!search || [x.name,x.username,x.grade,x.note].join(' ').toLowerCase().includes(search)) && (!state || x.status===state) && (!access || permissionValue(x)===access) && insights.matches(x,followup,now));
    visibleAccounts=items;
    host.querySelector('#account-list').innerHTML=`<div class="report-table-wrap"><table><thead><tr><th>使用者 / 年级</th><th>账号 / 状态</th><th>已开通功能</th><th>专业测评</th><th>高考查询</th><th>备注 / 关联记录</th><th>操作</th></tr></thead><tbody>${items.map(x=>{
      const a=x.features?.assessment,g=x.features?.gaokao;
      const assessment=a?.enabled?`${labels[a.state] || a.state}<br>开通截止 ${esc(new Date(a.expiresAt).toLocaleDateString('zh-CN'))}${a.canViewReport?`<br>报告可查看至 ${esc(new Date(a.viewUntil).toLocaleDateString('zh-CN'))}`:''}`:'未开通';
      const gaokao=g?.enabled?`${labels[g.state] || g.state} · ${Number(g.queryCount || 0)}次<br>截止 ${esc(new Date(g.expiresAt).toLocaleDateString('zh-CN'))}`:'未开通';
      return `<tr><td>${esc(x.name || '未登记')}<br>${esc(x.grade)}</td><td>${esc(x.username)}<br>${esc(labels[x.status])}</td><td>${esc(permissionLabel(x))}</td><td>${assessment}</td><td>${gaokao}</td><td>${esc(x.note)}${x.reportId?`<br><button type="button" data-action="report" data-id="${esc(x.reportId)}">查看报告</button>`:''}${g?.enabled || g?.queryCount?`<br><a href="admin-gaokao.html?account_id=${encodeURIComponent(x.id)}">查看查询记录</a>`:''}</td><td><button type="button" data-action="edit" data-id="${esc(x.id)}">编辑登记与权限</button> <button type="button" data-action="${x.status==='disabled'?'enable':'disable'}" data-id="${esc(x.id)}">${x.status==='disabled'?'启用':'停用'}</button> <button type="button" data-action="reset" data-id="${esc(x.id)}">重置测评与密码</button></td></tr>`;
    }).join('')}</tbody></table></div>`;
    host.querySelector('#account-count').textContent=`显示 ${items.length} / 共 ${accounts.length} 个账号${items.length?'':'，当前条件下没有匹配账号'}`;
    host.querySelector('#account-expiry-notice').textContent=totals.soon?`${totals.soon} 个账号有功能或报告查看权限将在7天内到期，可选择“7天内到期”查看。`:'暂无7天内到期的权限。';
    host.querySelector('#account-export-list').disabled=!items.length;
  }
  function manage() {
    if(document.body.dataset.adminView==='gaokao') {
      host.innerHTML='<div class="admin-session-tools"><span>管理员已登录</span><button type="button" id="account-logout" class="btn btn-ghost">退出管理登录</button></div>';
      host.querySelector('#account-logout').addEventListener('click',()=>void api.logoutAdmin(base));
      return;
    }
    host.innerHTML=`<h2>使用者与账号权限</h2><p>一个账号可开通两项功能。测评完成一次后核销，原报告可查看7天；高考查询在有效期内可多次使用，两项互不影响。</p>
      <button type="button" id="account-logout" class="btn btn-ghost">退出管理登录</button>
      <div id="account-summary" class="account-summary" aria-label="账号使用概况"></div><p id="account-expiry-notice" role="status"></p>
      <form id="account-create" class="account-form"><label>使用者姓名或内部编号<input name="name" maxlength="80" placeholder="单个账号填写姓名，批量可填写班级"></label><label>年级<input name="grade" maxlength="40" placeholder="例如 G11"></label><label>备注<input name="note" maxlength="500"></label><label>生成数量<input name="count" type="number" value="1" min="1" max="100" required></label><label>开通功能<select name="permissions">${permissionOptions}</select></label><label>测评有效天数<input name="days" type="number" value="30" min="1" max="365" required></label><label>高考查询有效天数<input name="gaokaoDays" type="number" value="30" min="1" max="365" required></label><button type="submit" class="btn btn-primary">生成账号密码</button></form>
      <p role="status" id="account-status"></p>
      <section id="account-credentials" hidden><h3>本次生成的登录信息</h3><p>密码仅本次显示，请及时复制发放。关闭或离开页面后，后台仅可重置密码。</p><label>选择发放对象<select id="account-credential-person"><option value="">整批登录信息</option></select></label><textarea readonly rows="8" aria-label="本次生成的登录信息"></textarea><button type="button" id="account-copy">复制所选登录信息</button> <button type="button" id="account-download">下载本批次 CSV</button></section>
      <div class="account-form"><label>搜索使用者或账号<input id="account-search" type="search" placeholder="姓名、账号、年级或备注"></label><label>账号状态<select id="account-status-filter"><option value="">全部状态</option>${Object.entries(labels).filter(([k])=>k!=="unavailable").map(([k,v])=>`<option value="${k}">${v}</option>`).join("")}</select></label><label>开通功能筛选<select id="account-permission-filter"><option value="">全部功能</option>${permissionOptions}</select></label><label>待办筛选<select id="account-followup-filter"><option value="">全部账号</option><option value="soon">7天内到期</option><option value="expired">含已到期权限</option><option value="pending">测评待完成</option><option value="query-unused">查询尚未使用</option></select></label></div><p>统计按全部账号计算；到期筛选包含测评、高考查询和报告查看期限，已停用账号不计入提醒。同一账号可同时有可用和已到期的功能。</p><p id="account-count"></p><button type="button" id="account-refresh">刷新账号列表</button> <button type="button" id="account-export-list">导出当前筛选清单</button> <button type="button" id="account-reset-filters">重置账号筛选</button><div id="account-list"></div>
      <dialog id="account-edit"><form method="dialog"><h3>编辑使用者登记</h3><input name="id" type="hidden"><label>姓名或内部编号<input name="name" maxlength="80"></label><label>年级<input name="grade" maxlength="40"></label><label>备注<textarea name="note" maxlength="500"></textarea></label><label>开通功能<select name="permissions">${permissionOptions}</select></label><label>测评续期天数（留空不变）<input name="assessmentDays" type="number" min="1" max="365"></label><label>高考查询续期天数（留空不变）<input name="gaokaoDays" type="number" min="1" max="365"></label><button type="button" id="account-edit-save">保存登记</button><button value="cancel">取消</button></form></dialog>`;
    const status=message=>host.querySelector('#account-status').textContent=message;
    const act=async(fn)=>{try{await fn();}catch(error){status(error.message);}};
    host.querySelector('#account-create').addEventListener('submit',event=>{event.preventDefault();const form=event.currentTarget,button=form.querySelector('button');button.disabled=true;void act(async()=>{try{const f=form.elements,data=await request('/api/admin/accounts',{method:'POST',body:{name:f.name.value,grade:f.grade.value,note:f.note.value,count:Number(f.count.value),days:Number(f.days.value),gaokaoDays:Number(f.gaokaoDays.value),permissions:permissions(f.permissions.value)}});showCredentials(data.items);await load();status('已生成，请复制或下载本次登录信息。');}finally{button.disabled=false;}});});
    for(const id of ['account-search','account-status-filter','account-permission-filter','account-followup-filter'])host.querySelector('#'+id).addEventListener('input',renderAccounts);
    host.querySelector('#account-refresh').addEventListener('click',()=>void act(load));
    host.querySelector('#account-copy').addEventListener('click',()=>void act(async()=>{const selection=host.querySelector('#account-credential-person').value;const text=selection===''?host.querySelector('#account-credentials textarea').value:credentialText(credentials[Number(selection)]);await navigator.clipboard.writeText(text);status(selection===''?'整批登录信息已复制。':'所选使用者的登录信息已复制。');}));
    host.querySelector('#account-download').addEventListener('click',()=>downloadCsv([['使用者','年级','账号','密码','已开通功能','测评到期','高考查询到期'],...credentials.map(x=>[x.name,x.grade,x.username,x.password,permissionLabel(x),x.permissions?.assessment?x.expiresAt:'',x.permissions?.gaokao?x.features.gaokao.expiresAt:''])],'本次发放账号.csv'));
    host.querySelector('#account-export-list').addEventListener('click',()=>downloadCsv([['使用者','年级','账号','账号状态','已开通功能','测评状态','测评截止','报告查看截止','高考查询状态','查询截止','查询次数','备注'],...visibleAccounts.map(x=>[x.name,x.grade,x.username,labels[x.status],permissionLabel(x),labels[x.features?.assessment?.state],x.features?.assessment?.enabled?x.features.assessment.expiresAt:'',x.features?.assessment?.viewUntil || '',labels[x.features?.gaokao?.state],x.features?.gaokao?.enabled?x.features.gaokao.expiresAt:'',x.features?.gaokao?.queryCount || 0,x.note])],'账号使用清单.csv'));
    host.querySelector('#account-reset-filters').addEventListener('click',()=>{for(const id of ['account-search','account-status-filter','account-permission-filter','account-followup-filter'])host.querySelector('#'+id).value='';renderAccounts();});
    host.querySelector('#account-logout').addEventListener('click',()=>void api.logoutAdmin(base));
    host.querySelector('#account-list').addEventListener('click',event=>{const button=event.target.closest('button[data-action]');if(!button)return;void act(async()=>{const id=button.dataset.id,action=button.dataset.action;
      if(action==='report'){await window.openAccountReport(id);return;}
      if(action==='edit'){const row=(await request('/api/admin/accounts')).items.find(x=>x.id===id),dialog=host.querySelector('#account-edit');for(const field of ['id','name','grade','note'])dialog.querySelector(`[name="${field}"]`).value=row[field]||'';dialog.querySelector('[name="permissions"]').value=permissionValue(row);for(const field of ['assessmentDays','gaokaoDays'])dialog.querySelector(`[name="${field}"]`).value='';dialog.showModal();return;}
      if(action==='reset'&&!confirm('重置后旧密码和旧登录状态立即失效，该账号可重新完成一次已开通的测评；高考查询的到期时间不变，历史记录保留。是否重置？'))return;
      button.disabled=true;try{const data=await request('/api/admin/accounts/'+encodeURIComponent(id),{method:'PATCH',body:{action}});if(data.item.password)showCredentials([data.item]);await load();status('账号状态已更新。');}finally{button.disabled=false;}
    });});
    host.querySelector('#account-edit-save').addEventListener('click',()=>void act(async()=>{const dialog=host.querySelector('#account-edit'),read=name=>dialog.querySelector(`[name="${name}"]`).value;await request('/api/admin/accounts/'+encodeURIComponent(read('id')),{method:'PATCH',body:{action:'edit',name:read('name'),grade:read('grade'),note:read('note'),permissions:permissions(read('permissions')),assessmentDays:read('assessmentDays'),gaokaoDays:read('gaokaoDays')}});dialog.close();await load();status('使用者登记已保存。');}));
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

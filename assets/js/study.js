// First-party pilot observations. No question text, answer values, names or contact details.
(function () {
  const VERSION = '2026-10-study-v12', KEY = 'majornavi_study_queue_v1';
  let queue = [], session = null, tick = 0, context = null, busy = false, running = false;
  const waiters = [];
  try { const stored = JSON.parse(localStorage.getItem(KEY) || '[]'); if (Array.isArray(stored)) queue = stored.slice(-50); } catch {}
  const uid = () => `study-${Date.now()}-${Math.random().toString(36).slice(2, 12)}`;
  function persist() { try { localStorage.setItem(KEY, JSON.stringify(queue)); return true; } catch { return false; } }
  async function flush() {
    const base = String(window.REPORT_API_BASE_URL || '').replace(/\/+$/, '');
    if (!base) return;
    if (busy) return new Promise(resolve => waiters.push(resolve));
    busy = true;
    try {
      while (queue.length) {
        const item = queue[0], controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), 15000);
        try {
          const response = await fetch(`${base}/api/reports`, {method:'POST',headers:{'Content-Type':'application/json','x-report-ingest-key':window.REPORT_INGEST_KEY || ''},body:JSON.stringify(item),signal:controller.signal,keepalive:true});
          if (!response.ok) break;
          if (queue[0] === item) queue.shift(); // A newer snapshot with the same ID stays queued.
          persist();
        } catch { break; } finally { clearTimeout(timer); }
      }
    } finally { busy = false; waiters.splice(0).forEach(resolve => resolve()); }
  }
  function enqueue(item, send = true) {
    queue = queue.filter(old => old.id !== item.id); queue.push(item); queue = queue.slice(-50);
    const saved = persist(); if (send) void flush(); return saved;
  }
  function addSeconds(seconds) {
    session.activeSeconds += seconds;
    const key = String(context?.page || 1);
    session.pageSeconds[key] = (session.pageSeconds[key] || 0) + seconds;
    session.moduleSeconds = session.moduleSeconds || {};
    const modules = context?.modules || [];
    for (const module of modules) session.moduleSeconds[module] = (session.moduleSeconds[module] || 0) + seconds / modules.length;
  }
  function settle() {
    const now = Date.now();
    if (running && session && session.status !== 'completed' && tick && !document.hidden) {
      // Cap unobserved idle gaps; a visible tab alone is not evidence of active work.
      const seconds = Math.max(0, Math.min(60, (now - tick) / 1000));
      addSeconds(seconds);
    }
    tick = now;
  }
  function checkpoint(status = 'paused') {
    if (!session || session.status === 'completed') return;
    settle(); session.status = status;
    session.lastPage = context?.page || session.lastPage || 1; session.answered = context?.answered ?? session.answered ?? 0;
    session.total = context?.total || session.total || 0; session.lastSeenAt = new Date().toISOString();
    enqueue(JSON.parse(JSON.stringify(session)));
  }
  window.MajorNaviStudy = {
    version:VERSION,
    restore(value) { session = value?.recordType === 'assessment_session' ? value : null; tick = 0; context = null; running = false; },
    snapshot() { settle(); return session ? JSON.parse(JSON.stringify(session)) : null; },
    observe(value) {
      if (!session || session.status === 'completed') session = {id:uid(),recordType:'assessment_session',siteVersion:VERSION,submittedAt:new Date().toISOString(),activeSeconds:0,pageSeconds:{},status:'in_progress'};
      settle(); running = true; context = value; session.studentProfile = {grade:value.grade || '',type:value.type || ''};
      session.total = value.total; session.answered = value.answered; session.lastPage = value.page;
      tick = document.hidden ? 0 : Date.now();
    },
    checkpoint,
    pause() { checkpoint(); running = false; tick = 0; },
    complete(reportId) { checkpoint('in_progress'); if (!session) return; session.status = 'completed'; session.reportId = reportId; session.completedAt = new Date().toISOString(); enqueue(JSON.parse(JSON.stringify(session))); tick = 0; },
    async feedback(reportId, rating, topic, text) {
      if (!reportId || !['符合','部分符合','不符合','暂时无法判断'].includes(rating)) return false;
      const saved = enqueue({id:`feedback-${reportId}`,recordType:'assessment_feedback',siteVersion:VERSION,submittedAt:new Date().toISOString(),reportId,rating,topic:String(topic || '').slice(0,40),text:String(text || '').trim().slice(0,1000)},false);
      await flush();
      return !queue.some(x => x.id === `feedback-${reportId}`) ? 'sent' : saved ? 'pending' : 'failed';
    },
    flush
  };
  document.addEventListener('visibilitychange', () => {
    // Account for the final visible interval before the hidden event.
    if (document.hidden) { const prior = tick; tick = 0; if (running && session && session.status !== 'completed' && prior) { const delta = Math.max(0,Math.min(60,(Date.now()-prior)/1000)); addSeconds(delta); } checkpoint(); }
    else { tick = session?.status === 'completed' ? 0 : Date.now(); void flush(); }
  });
  window.addEventListener('pagehide', () => checkpoint());
  window.addEventListener('online', () => void flush());
  void flush();
})();

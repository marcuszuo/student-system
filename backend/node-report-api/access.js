const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const DAY = 86400000;
function fail(message, status = 400) { const error = new Error(message); error.status = status; throw error; }
function hash(value) { return crypto.createHash('sha256').update(value).digest('hex'); }
function passwordHash(value, salt = crypto.randomBytes(16).toString('hex')) {
  return `${salt}:${crypto.scryptSync(value, salt, 32).toString('hex')}`;
}
function verify(value, encoded) {
  const [salt, key] = String(encoded || '').split(':');
  if (!salt || !key) return false;
  const candidate = passwordHash(value, salt).split(':')[1];
  return key.length === candidate.length && crypto.timingSafeEqual(Buffer.from(key), Buffer.from(candidate));
}
function parsePermissions(input, fallback = { assessment: true, gaokao: false }) {
  if (input === undefined) return { ...fallback };
  if (!input || typeof input !== 'object' || Array.isArray(input) ||
      typeof input.assessment !== 'boolean' || typeof input.gaokao !== 'boolean' ||
      (!input.assessment && !input.gaokao)) fail('请选择至少一项使用权限');
  return { assessment: input.assessment, gaokao: input.gaokao };
}
module.exports = function createAccess({ file, adminPassword, adminHash, adminUsername = 'admin', now = () => Date.now() }) {
  function read() {
    if (!fs.existsSync(file)) return { accounts: [], sessions: [], submissions: [], queryReceipts: [] };
    const store = JSON.parse(fs.readFileSync(file, 'utf8'));
    if (!Array.isArray(store.accounts) || !Array.isArray(store.sessions) || !Array.isArray(store.submissions)) throw Error('Invalid access store');
    if (!Array.isArray(store.queryReceipts)) store.queryReceipts = [];
    return store;
  }
  function write(store) {
    fs.mkdirSync(path.dirname(file), { recursive: true });
    const temp = file + '.' + crypto.randomBytes(6).toString('hex') + '.tmp';
    try {
      fs.writeFileSync(temp, JSON.stringify(store), { mode: 0o600 });
      fs.renameSync(temp, file);
    } finally { if (fs.existsSync(temp)) fs.unlinkSync(temp); }
  }
  function features(a) {
    const permissions = parsePermissions(a.permissions);
    const canStart = !a.disabled && permissions.assessment && !a.reportId && a.expiresAt > now();
    const canViewReport = !a.disabled && permissions.assessment && Boolean(a.reportId) && a.viewUntil > now();
    const gaokaoExpiry = a.gaokaoExpiresAt ?? a.expiresAt;
    const canQuery = !a.disabled && permissions.gaokao && gaokaoExpiry > now();
    return {
      assessment: {
        enabled: permissions.assessment, canStart, canViewReport,
        state: !permissions.assessment ? 'unavailable' : a.disabled ? 'disabled' : a.reportId ? 'completed' : a.expiresAt <= now() ? 'expired' : a.startedAt ? 'in_progress' : 'unused',
        expiresAt: new Date(a.expiresAt).toISOString(),
        viewUntil: a.viewUntil ? new Date(a.viewUntil).toISOString() : null
      },
      gaokao: {
        enabled: permissions.gaokao, canQuery,
        state: !permissions.gaokao ? 'unavailable' : a.disabled ? 'disabled' : canQuery ? 'active' : 'expired',
        expiresAt: new Date(gaokaoExpiry).toISOString(), queryCount: Number(a.gaokaoQueryCount || 0)
      }
    };
  }
  function status(a) {
    const f = features(a);
    if (a.disabled) return 'disabled';
    if (f.gaokao.canQuery) return 'active';
    if (f.assessment.canStart) return a.startedAt ? 'in_progress' : 'unused';
    if (f.assessment.canViewReport) return 'completed';
    return 'expired';
  }
  function publicAccount(a) {
    return {
      id: a.id, generation: a.generation, username: a.username, name: a.name, grade: a.grade, note: a.note,
      createdAt: a.createdAt, expiresAt: new Date(a.expiresAt).toISOString(), status: status(a),
      startedAt: a.startedAt, completedAt: a.completedAt, reportId: a.reportId,
      viewUntil: a.viewUntil ? new Date(a.viewUntil).toISOString() : null,
      permissions: parsePermissions(a.permissions), features: features(a)
    };
  }
  function authorize(token, role) {
    const store = read();
    const session = store.sessions.find(s => s.hash === hash(String(token || '')) && s.expiresAt > now());
    if (!session || (role && session.role !== role)) fail('登录已失效，请重新登录', 401);
    if (session.role === 'student') {
      const account = store.accounts.find(a => a.id === session.accountId && a.generation === session.generation);
      if (!account || account.disabled) fail('账号已停用', 403);
      const f = features(account);
      if (!f.assessment.canStart && !f.assessment.canViewReport && !f.gaokao.canQuery) fail('账号已过期或没有可用功能', 403);
      return { store, session, account };
    }
    return { store, session };
  }
  function identity(a) { return { id: a.id, username: a.username, name: a.name, grade: a.grade, generation: a.generation }; }
  function issue(store, role, account) {
    const token = crypto.randomBytes(32).toString('base64url');
    store.sessions = store.sessions.filter(s => s.expiresAt > now());
    const expiresAt = role === 'admin' ? now() + 12 * 3600000 : now() + 30 * DAY;
    store.sessions.push({ hash: hash(token), role, accountId: account?.id, generation: account?.generation, expiresAt });
    write(store);
    return { token, expiresAt: new Date(expiresAt).toISOString(), role, username: account?.username || adminUsername, account: account ? publicAccount(account) : undefined };
  }
  const configured = Boolean(adminPassword || adminHash);
  return {
    configured,
    admin(token) { try { return authorize(token, 'admin').session; } catch { return null; } },
    login(username, password) {
      if (!configured) fail('服务端账号管理尚未配置', 503);
      username = String(username || '').trim().toLowerCase(); password = String(password || '');
      if (password.length > 256) fail('账号或密码错误', 401);
      const store = read();
      if (username === adminUsername && (adminHash ? verify(password, adminHash) : crypto.timingSafeEqual(Buffer.from(hash(password)), Buffer.from(hash(adminPassword))))) return issue(store, 'admin');
      const a = store.accounts.find(a => a.username === username);
      if (!a || !verify(password, a.passwordHash)) fail('账号或密码错误', 401);
      if (a.disabled) fail('账号已停用', 403);
      const f = features(a);
      if (!f.assessment.canStart && !f.assessment.canViewReport && !f.gaokao.canQuery) fail('账号已过期或没有可用功能', 403);
      if (!a.startedAt) a.startedAt = new Date(now()).toISOString();
      return issue(store, 'student', a);
    },
    session(token) {
      const { session, account } = authorize(token);
      return { role: session.role, username: account?.username || adminUsername, account: account ? publicAccount(account) : undefined };
    },
    logout(token) { const store = read(); store.sessions = store.sessions.filter(s => s.hash !== hash(String(token || ''))); write(store); },
    list() { return read().accounts.map(publicAccount).reverse(); },
    create(input) {
      if (!configured) fail('服务端账号管理尚未配置', 503);
      const count = Number(input.count ?? 1), days = Number(input.days ?? 30), gaokaoDays = Number(input.gaokaoDays ?? days);
      if (!Number.isInteger(count) || count < 1 || count > 100 || !Number.isInteger(days) || days < 1 || days > 365 || !Number.isInteger(gaokaoDays) || gaokaoDays < 1 || gaokaoDays > 365) fail('数量须为1—100，有效期须为1—365天');
      const permissions = parsePermissions(input.permissions), store = read(), credentials = [];
      for (let i = 0; i < count; i++) {
        let username;
        do { username = 'mn' + crypto.randomBytes(6).toString('hex'); } while (store.accounts.some(a => a.username === username));
        const password = crypto.randomBytes(12).toString('base64url');
        const a = {
          id: crypto.randomUUID(), generation: 1, username, passwordHash: passwordHash(password),
          name: String(input.name || '').trim().slice(0, 80), grade: String(input.grade || '').trim().slice(0, 40), note: String(input.note || '').trim().slice(0, 500),
          createdAt: new Date(now()).toISOString(), expiresAt: now() + days * DAY,
          permissions: { ...permissions }, gaokaoExpiresAt: now() + gaokaoDays * DAY, gaokaoQueryCount: 0, disabled: false, reportId: null
        };
        store.accounts.push(a); credentials.push({ ...publicAccount(a), password });
      }
      write(store); return credentials;
    },
    update(id, input) {
      const store = read(), a = store.accounts.find(x => x.id === id);
      if (!a) fail('账号不存在', 404);
      let password;
      if (input.action === 'disable') a.disabled = true;
      else if (input.action === 'enable') a.disabled = false;
      else if (input.action === 'reset') {
        password = crypto.randomBytes(12).toString('base64url'); a.passwordHash = passwordHash(password);
        a.generation++; a.reportId = null; a.startedAt = null; a.completedAt = null; a.viewUntil = null; a.disabled = false;
        a.gaokaoExpiresAt = a.gaokaoExpiresAt ?? a.expiresAt; // Resetting assessment does not extend gaokao access.
        a.expiresAt = now() + 30 * DAY; store.sessions = store.sessions.filter(s => s.accountId !== id);
      } else if (input.action !== 'edit') fail('不支持的操作');
      if (input.permissions !== undefined) a.permissions = parsePermissions(input.permissions);
      for (const field of ['assessmentDays', 'gaokaoDays']) {
        if (input[field] === undefined || input[field] === '') continue;
        const days = Number(input[field]);
        if (!Number.isInteger(days) || days < 1 || days > 365) fail('有效期须为1—365天');
        a[field === 'assessmentDays' ? 'expiresAt' : 'gaokaoExpiresAt'] = now() + days * DAY;
      }
      for (const field of ['name', 'grade', 'note']) if (input[field] !== undefined) a[field] = String(input[field]).trim().slice(0, field === 'note' ? 500 : 80);
      write(store); return { ...publicAccount(a), ...(password ? { password } : {}) };
    },
    commit(token, payload) {
      const { store, account: a } = authorize(token, 'student');
      const f = features(a).assessment;
      if (!f.enabled) fail('该账号未开通专业测评', 403);
      if (!payload.id || String(payload.id).length > 160 || !Array.isArray(payload.recommendations) || !payload.recommendations.length) fail('报告内容不完整');
      if (a.reportId) {
        if (a.reportId !== payload.id) fail('本账号已完成一次测评，不能生成新报告', 409);
        if (!f.canViewReport) fail('原报告查看期已结束', 403);
        const prior = store.submissions.find(x => x.id === a.reportId); if (!prior) fail('报告已删除，请联系管理员', 404);
        return prior;
      }
      if (!f.canStart) fail('专业测评权限已过期', 403);
      if (store.submissions.some(x => x.id === payload.id)) fail('报告编号冲突', 409);
      const report = { ...payload, submittedAt: new Date(now()).toISOString(), adminMeta: undefined, accessAccount: identity(a) };
      a.reportId = report.id; a.completedAt = report.submittedAt; a.viewUntil = now() + 7 * DAY;
      store.submissions.push(report); write(store); return report;
    },
    record(token, payload) {
      const { account } = authorize(token, 'student'), f = features(account).assessment;
      if (!f.enabled || (!f.canStart && !f.canViewReport)) fail('没有可用的专业测评权限', 403);
      if (!['assessment_session', 'assessment_feedback'].includes(payload.recordType)) fail('不支持的记录');
      if (payload.recordType === 'assessment_feedback' && (!account.reportId || !f.canViewReport || payload.reportId !== account.reportId)) fail('只能反馈自己的报告', 403);
      return { ...payload, id: payload.recordType === 'assessment_session' ? `study-${account.id}-${account.generation}` : `feedback-${account.reportId}`, accessAccount: identity(account) };
    },
    report(token) {
      const { store, account } = authorize(token, 'student');
      if (!features(account).assessment.canViewReport) fail('没有可查看的测评报告或查看期已结束', account.reportId ? 403 : 404);
      const item = store.submissions.find(x => x.id === account.reportId); if (!item) fail('报告已删除，请联系管理员', 404);
      return item;
    },
    gaokaoPermit(token) {
      const { account } = authorize(token, 'student');
      if (!features(account).gaokao.canQuery) fail('高考查询未开通或已过期', 403);
      return { account: publicAccount(account) };
    },
    queryRecord(token, payload) {
      const { account } = authorize(token, 'student');
      if (!features(account).gaokao.canQuery) fail('高考查询未开通或已过期', 403);
      const id = String(payload.id || '');
      if (!/^[a-zA-Z0-9_-]{1,160}$/.test(id)) fail('查询编号无效');
      return { ...payload, id: `gaokao-${account.id}-${id}`, submittedAt: new Date(now()).toISOString(), recordType: 'gaokao_query', accessAccount: identity(account) };
    },
    noteQuery(token, id) {
      const { store, account } = authorize(token, 'student');
      if (!store.queryReceipts.some(x => x.id === id)) {
        store.queryReceipts.push({ id, accountId: account.id }); account.gaokaoQueryCount = Number(account.gaokaoQueryCount || 0) + 1; write(store);
      }
    },
    eraseReport(id) { const store = read(); store.submissions = store.submissions.filter(x => x.id !== id); write(store); },
    reports() { return read().submissions; }
  };
};
module.exports.passwordHash = passwordHash;

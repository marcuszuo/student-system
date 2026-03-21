# 测评报告后台接入说明

当前站点仍是静态前端。若希望学生提交后在后台查看报告，需要额外部署一层轻量后端。

本仓库已提供一套可直接接入的模板：

- 后端模板：`backend/cloudflare-worker/worker.js`
- 数据库结构：`backend/cloudflare-worker/schema.sql`
- Worker 配置示例：`backend/cloudflare-worker/wrangler.toml.example`
- 后台页面：`pages/admin.html`

## 功能结构

1. 学生在前台完成测评并提交
2. 前端把报告 JSON 发送到 `/api/reports`
3. Cloudflare Worker 写入 D1 数据库
4. 管理员打开 `pages/admin.html`
5. 后台页通过 `x-admin-token` 拉取报告列表与详情

## 部署步骤

### 1. 创建 D1 数据库

使用 Cloudflare D1 创建数据库后，执行：

```bash
wrangler d1 execute majornavi-reports --file=./backend/cloudflare-worker/schema.sql
```

### 2. 配置 Worker

复制：

```text
backend/cloudflare-worker/wrangler.toml.example
```

为：

```text
backend/cloudflare-worker/wrangler.toml
```

并填入：

- `database_id`
- `ALLOWED_ORIGINS`
- `INGEST_KEY`
- `ADMIN_TOKEN`

### 3. 部署 Worker

在 `backend/cloudflare-worker/` 目录执行：

```bash
wrangler deploy
```

部署后会得到一个 Worker 地址，例如：

```text
https://majornavi-report-api.xxx.workers.dev
```

### 4. 配置前台上报

在首页 `index.html` 中，`assets/js/app.js` 之前增加一段配置：

```html
<script>
  window.REPORT_API_BASE_URL = "https://majornavi-report-api.xxx.workers.dev";
  window.REPORT_INGEST_KEY = "replace-with-ingest-key";
</script>
```

### 5. 使用后台页

打开：

```text
/pages/admin.html
```

输入：

- 后台接口地址：Worker 地址
- 后台访问令牌：`ADMIN_TOKEN`

即可查看提交后的报告。

## 说明

- 若未配置 `REPORT_API_BASE_URL`，前台仍可正常测评，只是不会把报告同步到后台。
- 当前实现默认保存的是完整报告 JSON，方便后续二次分析和报表统计。
- 如后续需要按学校、时间、学生类型筛选，可在 Worker 侧继续增加查询参数和索引。

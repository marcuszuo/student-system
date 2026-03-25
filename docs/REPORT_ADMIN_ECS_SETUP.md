# 测评报告后台 ECS 部署说明

如果你已经有阿里云 ECS，可直接使用仓库里的 Node 版本报告后台：

- 代码目录：`backend/node-report-api`
- 启动方式：`node server.js`
- 默认端口：`8787`

## 一、服务器准备

建议服务器已安装：

- `nginx`
- `nodejs 20`
- `pm2`

## 二、上传后端代码

将 `backend/node-report-api/` 上传到服务器，例如：

```text
/var/www/majornavi-report-api
```

## 三、配置环境变量

复制 `.env.example` 为 `.env`，并至少填写：

- `ALLOWED_ORIGINS`
- `INGEST_KEY`
- `ADMIN_TOKEN`

## 四、启动服务

```bash
cd /var/www/majornavi-report-api
set -a
source .env
set +a
pm2 start server.js --name majornavi-report-api
pm2 save
pm2 startup
```

## 五、Nginx 反向代理

将域名例如 `api.majornavi.cn` 反代到：

```text
http://127.0.0.1:8787
```

## 六、前端配置

在首页 `index.html` 底部脚本段填入：

```html
<script>
  window.REPORT_API_BASE_URL = "https://api.majornavi.cn";
  window.REPORT_INGEST_KEY = "replace-with-ingest-key";
</script>
```

管理员后台使用：

- 地址：`/pages/admin.html`
- 接口地址：`https://api.majornavi.cn`
- 访问令牌：`ADMIN_TOKEN`

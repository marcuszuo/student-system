# 手机验证码登录接入说明

当前前端已经接入手机号验证码登录门禁，但生产环境要真正发短信，还需要部署一个短信验证码接口。

## 当前实现

- 前端：`index.html` + `assets/js/app.js`
- 接口模板：`backend/cloudflare-worker/worker.js`
- Worker 配置示例：`backend/cloudflare-worker/wrangler.toml.example`

## 推荐部署方式

前端继续放在 GitHub Pages，短信验证码接口单独部署到 Cloudflare Worker。

前端会调用两个接口：

- `POST /send-code`
- `POST /verify-code`

## 前端配置方式

在 `index.html` 里、`assets/js/app.js` 之前插入一行：

```html
<script>
  window.AUTH_API_BASE_URL = "https://your-worker-subdomain.workers.dev";
</script>
```

如果不配置这个地址：

- 本地 `localhost / 127.0.0.1` 会自动启用开发联调模式，验证码固定为 `123456`
- 线上环境不会允许短信登录通过

## Worker 部署步骤

1. 安装并登录 Wrangler
2. 创建 KV Namespace，用于保存验证码
3. 复制 `backend/cloudflare-worker/wrangler.toml.example` 为 `wrangler.toml`
4. 把 KV Namespace ID 填进去
5. 设置 `SESSION_SECRET`
6. 根据你的短信服务商，补全 `sendSmsWithProvider()`
7. 部署 Worker

## 需要你补的唯一生产项

`worker.js` 里目前只内置了 `console` 联调模式，还没有绑定真实短信供应商。

也就是说：

- 前端门禁、验证码流程、登录态、接口协议都已经搭好
- 真实短信发送这一步，需要接入你选定的短信服务商

## 建议

如果你准备正式上线，下一步最适合做的是：

1. 选短信服务商
2. 我来把 `sendSmsWithProvider()` 补成可直接发短信的版本
3. 再把 `window.AUTH_API_BASE_URL` 配到正式站点

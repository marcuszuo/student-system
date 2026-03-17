# 手机验证码登录接入说明

当前前端已经接入手机号验证码登录门禁，但生产环境要真正发短信，还需要部署一个短信验证码接口。

## 当前实现

- 前端：`index.html` + `assets/js/app.js`
- 接口模板：`backend/cloudflare-worker/worker.js`
- Worker 配置示例：`backend/cloudflare-worker/wrangler.toml.example`

## 当前推荐方案

优先推荐：

- GitHub Pages 前端
- Cloudflare Worker 作为验证码接口层
- 阿里云号码认证服务中的“短信认证服务”

原因：

- 阿里云官方提供了专门的短信认证服务
- 官方说明里明确提到它会处理验证码生成、生命周期管理和安全校验
- 官方也推荐优先使用号码认证服务赠送的签名和模板，减少签名模板审核成本

参考：

- [阿里云短信认证服务说明](https://help.aliyun.com/zh/pnvs/user-guide/sms-authentication-service)
- [SendSmsVerifyCode API](https://api.aliyun.com/document/Dypnsapi/2017-05-25/SendSmsVerifyCode)

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

## 需要补的生产项

`worker.js` 里目前只内置了 `console` 联调模式，还没有绑定真实阿里云短信认证接口。

也就是说：

- 前端门禁、验证码流程、登录态、接口协议都已经搭好
- 真实短信发送这一步，需要把 Worker 接到阿里云接口

## 建议

如果准备正式上线，下一步最适合做的是：

1. 在阿里云开通号码认证服务
2. 配好短信认证服务的签名/模板
3. 我来把 Worker 补成阿里云可直接调用版本
4. 再把 `window.AUTH_API_BASE_URL` 配到正式站点

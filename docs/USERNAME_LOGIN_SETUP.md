# 用户名密码登录说明

当前站点已经改成用户名密码登录门禁。

## 当前实现方式

- 前端页面提供用户名和密码输入
- 登录成功后才显示测评流程
- 登录态保存在浏览器本地

## 账号配置位置

在 `assets/js/app.js` 中：

```js
const AUTH_USERS = Array.isArray(window.AUTH_USERS) && window.AUTH_USERS.length
  ? window.AUTH_USERS
  : [{ username: "admin", password: "333333", role: "student" }];
```

你可以直接修改默认账号密码，或者在页面里通过 `window.AUTH_USERS` 覆盖。

如果希望管理员在首页输入账号密码后直接进入后台页，可以这样配置：

```html
<script>
  window.AUTH_USERS = [
    { username: "student", password: "333333", role: "student" },
    {
      username: "manager",
      password: "your-admin-password",
      role: "admin",
      redirectTo: "./pages/admin.html",
      adminApiBase: "https://your-report-api.workers.dev",
      adminToken: "your-admin-token"
    }
  ];
</script>
```

其中：

- `role: "student"`：进入测评流程
- `role: "admin"`：登录后直接跳转后台页
- `redirectTo`：后台页地址
- `adminApiBase`：后台接口地址，会自动写入后台页
- `adminToken`：后台访问令牌，会自动写入后台页

当前默认兼容：

- 用户名：`admin`
- 密码：`333333`

## 重要说明

这个方案适合：

- 内部试用
- 小范围受限访问
- 先快速把门禁做起来

这个方案不适合：

- 高安全要求
- 正式用户系统
- 需要防止别人查看前端源码拿到账号规则

原因是当前项目仍然是纯静态站点，用户名和密码校验逻辑在前端代码里，安全性有限。

## 如果以后要升级

如果后面你想做正式账号系统，推荐再加后端，至少支持：

- 服务端账号校验
- 密码哈希存储
- 登录态签发
- 风控和日志

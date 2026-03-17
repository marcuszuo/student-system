# MajorNavi Student System

静态网页项目，面向初高中学生的专业测评与升学规划。

线上地址：[https://www.majornavi.cn](https://www.majornavi.cn)

## 项目入口

- 首页：`index.html`
- 说明页：`pages/`
- 脚本：`assets/js/`
- 样式：`assets/css/`
- 用户名密码登录说明：`docs/USERNAME_LOGIN_SETUP.md`
- 域名配置说明：`docs/DOMAIN_SETUP.md`

## 本地预览

在项目根目录运行：

```bash
python3 -m http.server 4173
```

然后打开：

```text
http://127.0.0.1:4173/
```

## 部署

项目通过 GitHub Pages 自动部署。

- 分支：`main`
- 工作流：`.github/workflows/deploy-pages.yml`
- 自定义域名：`www.majornavi.cn`

## 备注

这是纯静态站点，没有前端构建步骤。修改 HTML、CSS、JS 后提交并推送到 `main`，GitHub Pages 会自动更新。

当前版本使用轻量级用户名密码登录门禁，适合内部试用和小范围受限访问。由于项目仍是纯静态站点，账号校验在前端完成，不适合作为高安全级别的正式账号系统。

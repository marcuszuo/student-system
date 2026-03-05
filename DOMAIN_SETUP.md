# GitHub Pages 自定义域名配置

## 1. 在仓库中创建 `CNAME`
在仓库根目录创建文件 `CNAME`，内容只写你的域名，例如：

```txt
test.yourdomain.com
```

提交并推送后，GitHub Pages 会自动识别该域名。

## 2. 配置 DNS
如果你使用子域名（推荐，例如 `test.yourdomain.com`），添加一条 `CNAME` 记录：

- 主机记录：`test`
- 记录值：`marcuszuo.github.io`

如果你使用根域名（例如 `yourdomain.com`），添加 `A` 记录到 GitHub Pages 官方 IP（以 GitHub 文档为准）。

## 3. 在仓库 Pages 设置中绑定域名
进入：
`https://github.com/marcuszuo/student-system/settings/pages`

- Custom domain 填入你的域名
- 勾选 `Enforce HTTPS`

## 4. 生效时间
DNS 一般在几分钟到 24 小时内生效。可用 `dig` 或在线 DNS 工具检查解析是否正确。

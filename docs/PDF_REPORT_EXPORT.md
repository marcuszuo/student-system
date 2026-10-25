# PDF报告导出 V20

后台单份报告的导出按钮原来下载JSON原始数据，现改为直接下载PDF。列表CSV仍用于管理清单，名称和用途不变。
学生端已生成报告也使用同一PDF导出模块；未保存的旧预览仍保留浏览器打印兜底。

PDF按测评结论、学生特征分析、专业推荐比较、后续建议组织，包含学生登记姓名、年级、日期、版本和报告编号。
不导出后台备注、账号密码、内部模型规则、原始分数或逐题作答。
学生端与PDF共用特征总结、专业比较与推荐依据函数。历史记录缺少独立测量时，只使用已保存的特征摘要，不补造作答。

浏览器本地生成PDF，报告不会发给第三方转换服务。首次导出从本站加载字体和组件；失败后显示错误并允许重试。
中文字体嵌入并按报告用字进行子集化，生成文件可搜索、复制中文。A4布局自动分页并加页码。

依赖与许可证：
- pdf-lib 1.17.1，MIT：https://github.com/Hopding/pdf-lib
- @pdf-lib/fontkit 1.1.1，MIT：https://github.com/Hopding/fontkit
- Noto Sans SC，SIL Open Font License：https://github.com/google/fonts/tree/main/ofl/notosanssc
  从可变字体生成常规400字重，许可证与字体一同保留在assets/fonts。

验证：scripts/test_report_pdf.js生成中文模拟PDF并检查文件格式、页数、摘要一致性和私密字段排除。
本地浏览器验证点击下载产生.pdf文件；PDF文本提取、四章节完整性和页面边界检查通过，已查看逐页渲染效果。

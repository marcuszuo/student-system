const EXTRA_MAJORS = [
  // 工学与信息类
  { name: "物联网工程", category: "工学", courses: "传感器/嵌入式/网络", careers: "IoT工程/设备接入/平台开发", archetype: "通信工程", delta: { "interest.r": 0.08, "cognition.data": 0.08 }, coreDims: ["interest.r", "cognition.data", "cognition.system", "ability.math"] },
  { name: "智能科学与技术", category: "工学", courses: "机器学习/智能系统/认知科学", careers: "智能系统工程/算法应用", archetype: "人工智能", delta: { "interest.i": 0.05, "cognition.abstract": 0.05 }, coreDims: ["interest.i", "cognition.abstract", "ability.math", "ability.stat"] },
  { name: "信息工程", category: "工学", courses: "信号处理/通信原理/嵌入式", careers: "通信研发/系统工程", archetype: "电子信息工程", delta: { "interest.c": 0.05 }, coreDims: ["interest.r", "cognition.system", "ability.math", "interest.c"] },
  { name: "集成电路设计与集成系统", category: "工学", courses: "数字电路/芯片设计/EDA", careers: "芯片设计/验证工程", archetype: "电子信息工程", delta: { "cognition.abstract": 0.08, "ability.math": 0.08 }, coreDims: ["cognition.abstract", "ability.math", "interest.r", "cognition.system"] },
  { name: "机器人工程", category: "工学", courses: "机器人学/控制/视觉", careers: "机器人算法/控制工程", archetype: "自动化", delta: { "interest.r": 0.06, "interest.i": 0.05 }, coreDims: ["interest.r", "interest.i", "ability.math", "cognition.system"] },
  { name: "车辆工程", category: "工学", courses: "汽车构造/控制/动力学", careers: "整车研发/底盘工程", archetype: "机械设计制造及其自动化", delta: { "interest.r": 0.08 }, coreDims: ["interest.r", "cognition.spatial", "ability.math", "ability.focus"] },
  { name: "新能源科学与工程", category: "工学", courses: "新能源材料/储能/电力系统", careers: "新能源研发/储能工程", archetype: "电气工程及其自动化", delta: { "interest.i": 0.06, "cognition.data": 0.05 }, coreDims: ["interest.i", "ability.math", "cognition.data", "interest.r"] },
  { name: "能源与动力工程", category: "工学", courses: "热工学/流体力学/动力系统", careers: "能源系统工程/设备研发", archetype: "机械设计制造及其自动化", delta: { "interest.i": 0.05 }, coreDims: ["interest.r", "interest.i", "ability.math", "cognition.system"] },
  { name: "飞行器设计与工程", category: "工学", courses: "空气动力学/结构设计/控制", careers: "航空航天研发", archetype: "机械设计制造及其自动化", delta: { "ability.math": 0.1, "cognition.abstract": 0.08 }, coreDims: ["ability.math", "cognition.abstract", "interest.r", "cognition.spatial"] },
  { name: "测控技术与仪器", category: "工学", courses: "检测技术/自动控制/仪器设计", careers: "测试工程/仪器研发", archetype: "自动化", delta: { "interest.c": 0.06 }, coreDims: ["interest.c", "interest.r", "cognition.data", "ability.math"] },
  { name: "材料科学与工程", category: "工学", courses: "材料结构/材料加工/表征", careers: "材料研发/工艺工程", archetype: "机械设计制造及其自动化", delta: { "interest.i": 0.06, "cognition.data": 0.04 }, coreDims: ["interest.i", "interest.r", "ability.math", "cognition.data"] },
  { name: "高分子材料与工程", category: "工学", courses: "高分子化学/材料加工", careers: "材料工程/工艺研发", archetype: "材料科学与工程", delta: { "interest.i": 0.03 }, coreDims: ["interest.i", "interest.r", "ability.math", "interest.c"] },
  { name: "化学工程与工艺", category: "工学", courses: "化工原理/反应工程/分离工程", careers: "化工工艺/生产优化", archetype: "土木工程", delta: { "interest.i": 0.08, "cognition.data": 0.06 }, coreDims: ["interest.i", "cognition.data", "ability.math", "interest.c"] },
  { name: "制药工程", category: "工学", courses: "药物工艺/药剂学/质量控制", careers: "药企工艺/质量体系", archetype: "化学工程与工艺", delta: { "interest.s": 0.04 }, coreDims: ["interest.i", "interest.c", "cognition.data", "ability.math"] },
  { name: "环境工程", category: "工学", courses: "水处理/环保工程/环境监测", careers: "环保工程/项目咨询", archetype: "土木工程", delta: { "interest.s": 0.08, "interest.i": 0.05 }, coreDims: ["interest.s", "interest.i", "ability.math", "interest.r"] },
  { name: "给排水科学与工程", category: "工学", courses: "给排水系统/市政工程", careers: "市政设计/工程管理", archetype: "土木工程", delta: { "interest.c": 0.05 }, coreDims: ["interest.r", "interest.c", "ability.math", "cognition.system"] },
  { name: "道路桥梁与渡河工程", category: "工学", courses: "桥梁工程/道路勘测/结构", careers: "道路桥梁设计/施工管理", archetype: "土木工程", delta: { "interest.r": 0.06 }, coreDims: ["interest.r", "cognition.spatial", "ability.math", "interest.c"] },
  { name: "工程管理", category: "工学", courses: "工程经济/项目管理/造价", careers: "项目管理/工程咨询", archetype: "工业工程", delta: { "interest.e": 0.08, "value.wealth": 0.06 }, coreDims: ["interest.e", "interest.c", "cognition.system", "ability.comm"] },
  { name: "城乡规划", category: "工学", courses: "城市规划/空间设计/政策", careers: "规划设计/城市更新", archetype: "建筑学", delta: { "interest.s": 0.06 }, coreDims: ["cognition.spatial", "interest.a", "interest.s", "ability.writing"] },
  { name: "风景园林", category: "工学", courses: "景观设计/植物配置/场地规划", careers: "景观设计/城市景观", archetype: "工业设计", delta: { "interest.a": 0.08, "interest.s": 0.04 }, coreDims: ["interest.a", "cognition.spatial", "interest.s", "ability.writing"] },
  { name: "生物医学工程", category: "工学", courses: "医学电子/生物信号/医疗器械", careers: "医疗器械研发", archetype: "电子信息工程", delta: { "interest.s": 0.06, "interest.i": 0.06 }, coreDims: ["interest.i", "interest.s", "cognition.data", "ability.math"] },
  { name: "数字媒体技术", category: "工学", courses: "图形学/交互开发/多媒体", careers: "交互开发/技术美术", archetype: "软件工程", delta: { "interest.a": 0.1, "ability.writing": 0.05 }, coreDims: ["interest.a", "cognition.system", "ability.math", "ability.writing"] },

  // 理学类
  { name: "数学与应用数学", category: "理学", courses: "数学分析/代数/概率", careers: "科研/算法/建模", archetype: "生物科学", delta: { "ability.math": 0.15, "cognition.abstract": 0.12, "interest.i": 0.1 }, coreDims: ["ability.math", "cognition.abstract", "interest.i", "interest.c"] },
  { name: "统计学", category: "理学", courses: "概率统计/回归/数据建模", careers: "统计分析/数据科学", archetype: "数据科学与大数据技术", delta: { "interest.i": 0.08 }, coreDims: ["ability.stat", "cognition.data", "ability.math", "interest.i"] },
  { name: "应用物理学", category: "理学", courses: "力学/电磁学/光学", careers: "科研/工程研发", archetype: "生物科学", delta: { "ability.math": 0.12, "interest.r": 0.05 }, coreDims: ["ability.math", "interest.i", "cognition.abstract", "interest.r"] },
  { name: "应用化学", category: "理学", courses: "有机/无机/分析化学", careers: "化学研发/检测", archetype: "生物科学", delta: { "interest.c": 0.06 }, coreDims: ["interest.i", "interest.c", "cognition.data", "ability.math"] },
  { name: "地理科学", category: "理学", courses: "自然地理/人文地理/GIS", careers: "地理信息/教育/规划", archetype: "生物科学", delta: { "cognition.contextual": 0.1, "interest.s": 0.05 }, coreDims: ["cognition.contextual", "interest.i", "interest.s", "ability.writing"] },
  { name: "地球信息科学与技术", category: "理学", courses: "遥感/GIS/空间分析", careers: "测绘遥感/地理信息", archetype: "数据科学与大数据技术", delta: { "interest.r": 0.06, "cognition.spatial": 0.08 }, coreDims: ["cognition.spatial", "cognition.data", "ability.math", "interest.r"] },

  // 医学类
  { name: "口腔医学", category: "医学", courses: "口腔解剖/修复/正畸", careers: "口腔医生/医疗机构", archetype: "临床医学", delta: { "interest.r": 0.05, "ability.focus": 0.06 }, coreDims: ["interest.s", "interest.i", "ability.focus", "risk.pressure"] },
  { name: "预防医学", category: "医学", courses: "流行病学/卫生统计/公卫", careers: "疾控/公共卫生管理", archetype: "临床医学", delta: { "cognition.data": 0.08, "interest.s": 0.05 }, coreDims: ["interest.s", "cognition.data", "ability.stat", "interest.i"] },
  { name: "麻醉学", category: "医学", courses: "临床麻醉/急救/监护", careers: "麻醉医生/重症监护", archetype: "临床医学", delta: { "risk.pressure": 0.1, "ability.focus": 0.08 }, coreDims: ["risk.pressure", "ability.focus", "interest.s", "interest.i"] },
  { name: "医学影像学", category: "医学", courses: "影像诊断/放射医学", careers: "影像医生/放射科", archetype: "临床医学", delta: { "cognition.data": 0.08, "interest.c": 0.06 }, coreDims: ["cognition.data", "interest.c", "interest.i", "ability.math"] },
  { name: "药学", category: "医学", courses: "药理学/药剂学/药物分析", careers: "药企研发/医院药学", archetype: "临床医学", delta: { "interest.c": 0.08, "interest.i": 0.05 }, coreDims: ["interest.i", "interest.c", "cognition.data", "ability.math"] },
  { name: "中药学", category: "医学", courses: "中药鉴定/炮制/药效", careers: "中药研发/质量控制", archetype: "药学", delta: { "cognition.contextual": 0.08 }, coreDims: ["interest.i", "interest.c", "cognition.contextual", "ability.writing"] },
  { name: "护理学", category: "医学", courses: "基础护理/临床护理/康复", careers: "临床护理/健康管理", archetype: "临床医学", delta: { "interest.s": 0.12, "ability.comm": 0.1 }, coreDims: ["interest.s", "ability.comm", "risk.pressure", "value.responsibility"] },
  { name: "医学检验技术", category: "医学", courses: "检验技术/病理/免疫", careers: "医学检验/实验室", archetype: "临床医学", delta: { "interest.c": 0.1, "cognition.data": 0.08 }, coreDims: ["interest.c", "cognition.data", "interest.i", "ability.focus"] },
  { name: "康复治疗学", category: "医学", courses: "康复评定/运动治疗/作业治疗", careers: "康复治疗师", archetype: "护理学", delta: { "interest.r": 0.07 }, coreDims: ["interest.s", "interest.r", "ability.comm", "value.responsibility"] },

  // 经济与管理类
  { name: "国际经济与贸易", category: "经济学", courses: "国际贸易/国际结算/经济学", careers: "外贸/跨境业务", archetype: "经济学", delta: { "ability.comm": 0.08, "cognition.verbal": 0.08 }, coreDims: ["interest.e", "ability.comm", "cognition.verbal", "value.wealth"] },
  { name: "财政学", category: "经济学", courses: "财政学/税收/公共预算", careers: "财政税务/政策研究", archetype: "经济学", delta: { "interest.s": 0.05, "interest.c": 0.05 }, coreDims: ["interest.c", "cognition.data", "ability.writing", "interest.s"] },
  { name: "保险学", category: "经济学", courses: "保险原理/精算基础/风险管理", careers: "保险精算/产品运营", archetype: "金融学", delta: { "ability.stat": 0.1, "interest.c": 0.06 }, coreDims: ["ability.stat", "cognition.data", "interest.c", "interest.e"] },
  { name: "投资学", category: "经济学", courses: "投资学/证券分析/资产配置", careers: "投研/资管/投顾", archetype: "金融学", delta: { "interest.e": 0.08, "cognition.data": 0.06 }, coreDims: ["interest.e", "cognition.data", "ability.stat", "value.wealth"] },
  { name: "金融工程", category: "经济学", courses: "金融数学/衍生品/量化", careers: "量化分析/风控模型", archetype: "金融学", delta: { "ability.math": 0.12, "ability.stat": 0.12 }, coreDims: ["ability.math", "ability.stat", "cognition.data", "interest.i"] },
  { name: "工商管理", category: "管理学", courses: "管理学/组织行为/运营", careers: "运营管理/战略管理", archetype: "公共管理", delta: { "interest.e": 0.08, "ability.comm": 0.08 }, coreDims: ["interest.e", "ability.comm", "interest.s", "cognition.system"] },
  { name: "物流管理", category: "管理学", courses: "供应链/仓储/运营优化", careers: "供应链管理/物流规划", archetype: "工业工程", delta: { "interest.e": 0.05, "cognition.data": 0.05 }, coreDims: ["interest.c", "cognition.system", "cognition.data", "interest.e"] },
  { name: "电子商务", category: "管理学", courses: "电商运营/用户增长/数据分析", careers: "电商运营/增长分析", archetype: "市场营销", delta: { "cognition.data": 0.06, "interest.c": 0.04 }, coreDims: ["interest.e", "cognition.data", "ability.comm", "interest.a"] },
  { name: "信息管理与信息系统", category: "管理学", courses: "管理信息系统/数据库/业务流程", careers: "产品运营/信息化管理", archetype: "数据科学与大数据技术", delta: { "interest.e": 0.06, "ability.comm": 0.06 }, coreDims: ["cognition.system", "cognition.data", "interest.e", "ability.comm"] },
  { name: "行政管理", category: "管理学", courses: "公共管理/政策分析/行政法", careers: "政府事务/行政管理", archetype: "公共管理", delta: { "interest.s": 0.08, "ability.writing": 0.06 }, coreDims: ["interest.s", "ability.writing", "interest.c", "value.responsibility"] },
  { name: "劳动与社会保障", category: "管理学", courses: "社会保障/劳动法/公共政策", careers: "人社管理/政策执行", archetype: "人力资源管理", delta: { "interest.s": 0.08, "value.responsibility": 0.06 }, coreDims: ["interest.s", "value.responsibility", "ability.comm", "interest.c"] },

  // 文学与传播类
  { name: "汉语言文学", category: "文学", courses: "古代文学/现当代文学/写作", careers: "编辑出版/教育/内容创作", archetype: "新闻学", delta: { "ability.writing": 0.12, "interest.a": 0.08 }, coreDims: ["ability.writing", "interest.a", "cognition.verbal", "interest.s"] },
  { name: "汉语国际教育", category: "文学", courses: "语言学/对外汉语教学", careers: "国际中文教育", archetype: "教育学", delta: { "ability.writing": 0.1, "ability.comm": 0.1 }, coreDims: ["ability.comm", "ability.writing", "interest.s", "cognition.verbal"] },
  { name: "英语", category: "文学", courses: "语言学/翻译/跨文化", careers: "教育/翻译/国际业务", archetype: "新闻学", delta: { "cognition.verbal": 0.12, "ability.comm": 0.08 }, coreDims: ["cognition.verbal", "ability.comm", "ability.writing", "interest.s"] },
  { name: "翻译", category: "文学", courses: "笔译/口译/跨文化传播", careers: "翻译/本地化/国际传播", archetype: "传播学", delta: { "ability.writing": 0.1, "cognition.verbal": 0.1 }, coreDims: ["ability.writing", "cognition.verbal", "ability.comm", "interest.a"] },
  { name: "网络与新媒体", category: "文学", courses: "新媒体运营/内容制作/数据传播", careers: "新媒体运营/内容策略", archetype: "传播学", delta: { "cognition.data": 0.06 }, coreDims: ["interest.a", "ability.comm", "cognition.data", "interest.e"] },
  { name: "广告学", category: "文学", courses: "广告策划/品牌传播/消费者行为", careers: "品牌策划/广告创意", archetype: "市场营销", delta: { "interest.a": 0.12, "ability.writing": 0.1 }, coreDims: ["interest.a", "interest.e", "ability.writing", "ability.comm"] },
  { name: "编辑出版学", category: "文学", courses: "编辑学/出版实务/内容策划", careers: "编辑/出版运营", archetype: "新闻学", delta: { "interest.c": 0.08, "ability.writing": 0.1 }, coreDims: ["ability.writing", "interest.c", "cognition.verbal", "interest.a"] },
  { name: "广播电视学", category: "文学", courses: "影视传播/节目策划/媒体实务", careers: "节目制作/媒体运营", archetype: "传播学", delta: { "interest.a": 0.08, "interest.s": 0.05 }, coreDims: ["interest.a", "interest.s", "ability.comm", "cognition.contextual"] },

  // 法学与社会科学
  { name: "知识产权", category: "法学", courses: "知识产权法/民商法/实务", careers: "知识产权顾问/法务", archetype: "法学", delta: { "interest.i": 0.05, "interest.c": 0.05 }, coreDims: ["interest.c", "ability.writing", "cognition.verbal", "interest.i"] },
  { name: "社会学", category: "法学", courses: "社会调查/社会理论/社会统计", careers: "社会研究/公共事务", archetype: "国际关系", delta: { "interest.s": 0.1, "cognition.data": 0.05 }, coreDims: ["interest.s", "cognition.contextual", "ability.writing", "cognition.data"] },
  { name: "外交学", category: "法学", courses: "国际政治/外交实务/国际法", careers: "涉外事务/国际组织", archetype: "国际关系", delta: { "ability.comm": 0.1, "interest.e": 0.05 }, coreDims: ["ability.comm", "interest.s", "interest.e", "ability.writing"] },

  // 教育细分
  { name: "学前教育", category: "教育学", courses: "儿童发展/幼教课程/教育心理", careers: "幼儿教育/教研", archetype: "教育学", delta: { "interest.s": 0.1, "ability.comm": 0.1 }, coreDims: ["interest.s", "ability.comm", "value.responsibility", "risk.pressure"] },
  { name: "特殊教育", category: "教育学", courses: "特殊儿童教育/康复教育", careers: "特殊教育教师/支持服务", archetype: "教育学", delta: { "value.responsibility": 0.12, "interest.s": 0.08 }, coreDims: ["value.responsibility", "interest.s", "ability.comm", "risk.pressure"] },
  { name: "教育技术学", category: "教育学", courses: "教育信息化/教学设计/多媒体", careers: "教育产品/课程技术支持", archetype: "教育学", delta: { "cognition.data": 0.08, "interest.r": 0.05 }, coreDims: ["cognition.data", "interest.s", "ability.comm", "cognition.system"] },

  // 艺术学
  { name: "视觉传达设计", category: "艺术学", courses: "平面设计/品牌视觉/版式", careers: "视觉设计/品牌设计", archetype: "工业设计", delta: { "interest.a": 0.15, "ability.writing": 0.05 }, coreDims: ["interest.a", "cognition.spatial", "ability.writing", "interest.e"] },
  { name: "环境设计", category: "艺术学", courses: "空间设计/展示设计/材料应用", careers: "室内设计/空间设计", archetype: "建筑学", delta: { "interest.a": 0.1, "cognition.spatial": 0.08 }, coreDims: ["cognition.spatial", "interest.a", "interest.r", "ability.comm"] },
  { name: "产品设计", category: "艺术学", courses: "产品造型/交互设计/材料工艺", careers: "产品设计/用户体验", archetype: "工业设计", delta: { "interest.a": 0.1, "interest.e": 0.05 }, coreDims: ["interest.a", "interest.r", "cognition.spatial", "interest.e"] }
];

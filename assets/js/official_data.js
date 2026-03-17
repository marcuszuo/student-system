const OFFICIAL_DATA = {
  "dimensionKeys": [
    "interest.r",
    "interest.i",
    "interest.a",
    "interest.s",
    "interest.e",
    "interest.c",
    "cognition.data",
    "cognition.verbal",
    "cognition.abstract",
    "cognition.system",
    "cognition.spatial",
    "cognition.contextual",
    "ability.math",
    "ability.stat",
    "ability.writing",
    "ability.comm",
    "ability.focus",
    "ability.memory",
    "risk.stability",
    "risk.pressure",
    "value.wealth",
    "value.influence",
    "value.responsibility",
    "value.security"
  ],
  "questions": [
    {
      "id": "A01",
      "module": "A",
      "text": "遇到新知识点，你更常用的方法是：",
      "options": [
        {
          "key": "A",
          "text": "先理解原理，再做题验证",
          "dim": "ability.math"
        },
        {
          "key": "B",
          "text": "先看例题/步骤，照着练",
          "dim": "cognition.system"
        },
        {
          "key": "C",
          "text": "先找有趣/应用场景再学",
          "dim": "cognition.contextual"
        },
        {
          "key": "D",
          "text": "先问同学/老师怎么学最快",
          "dim": "ability.comm"
        }
      ]
    },
    {
      "id": "A02",
      "module": "A",
      "text": "做难题卡住时，你通常：",
      "options": [
        {
          "key": "A",
          "text": "换角度推理，找关键条件",
          "dim": "cognition.abstract"
        },
        {
          "key": "B",
          "text": "回到步骤，逐条排查",
          "dim": "cognition.system"
        },
        {
          "key": "C",
          "text": "先放一放，找动力再回来",
          "dim": "ability.focus"
        },
        {
          "key": "D",
          "text": "去讨论/求助，听不同思路",
          "dim": "ability.comm"
        }
      ]
    },
    {
      "id": "A03",
      "module": "A",
      "text": "你最擅长的学习材料是：",
      "options": [
        {
          "key": "A",
          "text": "理论讲解/推导",
          "dim": "cognition.abstract"
        },
        {
          "key": "B",
          "text": "练习册/题型总结",
          "dim": "cognition.system"
        },
        {
          "key": "C",
          "text": "案例/故事/视频",
          "dim": "cognition.contextual"
        },
        {
          "key": "D",
          "text": "讨论课/讲解课",
          "dim": "ability.comm"
        }
      ]
    },
    {
      "id": "A04",
      "module": "A",
      "text": "你更喜欢的课堂是：",
      "options": [
        {
          "key": "A",
          "text": "讲清逻辑框架",
          "dim": "cognition.abstract"
        },
        {
          "key": "B",
          "text": "讲清做题套路",
          "dim": "cognition.system"
        },
        {
          "key": "C",
          "text": "讲有趣的例子",
          "dim": "cognition.contextual"
        },
        {
          "key": "D",
          "text": "互动多、能表达",
          "dim": "ability.comm"
        }
      ]
    },
    {
      "id": "A05",
      "module": "A",
      "text": "考试复习时你更先做：",
      "options": [
        {
          "key": "A",
          "text": "整理知识体系",
          "dim": "cognition.system"
        },
        {
          "key": "B",
          "text": "刷题找规律",
          "dim": "ability.math"
        },
        {
          "key": "C",
          "text": "挑自己感兴趣的部分",
          "dim": "ability.focus"
        },
        {
          "key": "D",
          "text": "和同学一起互测",
          "dim": "ability.comm"
        }
      ]
    },
    {
      "id": "A06",
      "module": "A",
      "text": "学习一门新语言/新工具，你更可能：",
      "options": [
        {
          "key": "A",
          "text": "研究规则/语法/原理",
          "dim": "cognition.system"
        },
        {
          "key": "B",
          "text": "背模板、练固定句式",
          "dim": "ability.memory"
        },
        {
          "key": "C",
          "text": "看剧/用场景记",
          "dim": "cognition.contextual"
        },
        {
          "key": "D",
          "text": "找人对练",
          "dim": "ability.comm"
        }
      ]
    },
    {
      "id": "A07",
      "module": "A",
      "text": "你在理科/数理题上更像：",
      "options": [
        {
          "key": "A",
          "text": "爱推导，追求通用解法",
          "dim": "cognition.abstract"
        },
        {
          "key": "B",
          "text": "爱套公式，追求速度",
          "dim": "ability.math"
        },
        {
          "key": "C",
          "text": "爱找直观理解",
          "dim": "cognition.spatial"
        },
        {
          "key": "D",
          "text": "爱讲题、爱讨论",
          "dim": "ability.comm"
        }
      ]
    },
    {
      "id": "A08",
      "module": "A",
      "text": "你在文科/写作上更像：",
      "options": [
        {
          "key": "A",
          "text": "先搭结构再写",
          "dim": "cognition.system"
        },
        {
          "key": "B",
          "text": "按模板写出标准答案",
          "dim": "ability.memory"
        },
        {
          "key": "C",
          "text": "先抓故事/观点再写",
          "dim": "cognition.verbal"
        },
        {
          "key": "D",
          "text": "先聊清楚再写",
          "dim": "ability.comm"
        }
      ]
    },
    {
      "id": "A09",
      "module": "A",
      "text": "你做笔记更像：",
      "options": [
        {
          "key": "A",
          "text": "画框架、概念图",
          "dim": "cognition.abstract"
        },
        {
          "key": "B",
          "text": "记步骤、易错点",
          "dim": "cognition.system"
        },
        {
          "key": "C",
          "text": "记灵感、例子",
          "dim": "cognition.contextual"
        },
        {
          "key": "D",
          "text": "记老师/同学的提示",
          "dim": "ability.memory"
        }
      ]
    },
    {
      "id": "A10",
      "module": "A",
      "text": "你觉得自己提升最快的方式是：",
      "options": [
        {
          "key": "A",
          "text": "理解底层逻辑",
          "dim": "cognition.abstract"
        },
        {
          "key": "B",
          "text": "大量练习与纠错",
          "dim": "ability.focus"
        },
        {
          "key": "C",
          "text": "找到兴趣点后爆发",
          "dim": "cognition.contextual"
        },
        {
          "key": "D",
          "text": "有人带/反馈及时",
          "dim": "ability.comm"
        }
      ]
    },
    {
      "id": "A11",
      "module": "A",
      "text": "作业多的时候你通常：",
      "options": [
        {
          "key": "A",
          "text": "先挑最难的把逻辑理清",
          "dim": "cognition.abstract"
        },
        {
          "key": "B",
          "text": "按清单逐个完成",
          "dim": "ability.focus"
        },
        {
          "key": "C",
          "text": "先做喜欢的保持状态",
          "dim": "cognition.contextual"
        },
        {
          "key": "D",
          "text": "约人一起做互相监督",
          "dim": "ability.comm"
        }
      ]
    },
    {
      "id": "A12",
      "module": "A",
      "text": "你更容易在什么情况下拿高分：",
      "options": [
        {
          "key": "A",
          "text": "考察理解与推理",
          "dim": "cognition.abstract"
        },
        {
          "key": "B",
          "text": "考察熟练度与速度",
          "dim": "ability.memory"
        },
        {
          "key": "C",
          "text": "考察表达与观点",
          "dim": "cognition.verbal"
        },
        {
          "key": "D",
          "text": "考察合作与展示",
          "dim": "ability.comm"
        }
      ]
    },
    {
      "id": "A13",
      "module": "A",
      "text": "遇到一门不喜欢的课，你更可能：",
      "options": [
        {
          "key": "A",
          "text": "找到它的逻辑价值",
          "dim": "cognition.abstract"
        },
        {
          "key": "B",
          "text": "按要求完成拿分",
          "dim": "ability.focus"
        },
        {
          "key": "C",
          "text": "靠兴趣点勉强维持",
          "dim": "cognition.contextual"
        },
        {
          "key": "D",
          "text": "靠老师/同学带着学",
          "dim": "ability.comm"
        }
      ]
    },
    {
      "id": "A14",
      "module": "A",
      "text": "你对“刷题”的态度更接近：",
      "options": [
        {
          "key": "A",
          "text": "必须先懂再刷",
          "dim": "cognition.abstract"
        },
        {
          "key": "B",
          "text": "刷题本身最有效",
          "dim": "ability.focus"
        },
        {
          "key": "C",
          "text": "刷题太枯燥要有趣",
          "dim": "cognition.contextual"
        },
        {
          "key": "D",
          "text": "刷题最好有人陪",
          "dim": "ability.comm"
        }
      ]
    },
    {
      "id": "A15",
      "module": "A",
      "text": "你做项目/作业更像：",
      "options": [
        {
          "key": "A",
          "text": "先定模型/思路",
          "dim": "cognition.abstract"
        },
        {
          "key": "B",
          "text": "先列任务分工",
          "dim": "cognition.system"
        },
        {
          "key": "C",
          "text": "先想创意呈现",
          "dim": "cognition.spatial"
        },
        {
          "key": "D",
          "text": "先沟通协调",
          "dim": "ability.comm"
        }
      ]
    },
    {
      "id": "A16",
      "module": "A",
      "text": "面对多学科任务，你更可能：",
      "options": [
        {
          "key": "A",
          "text": "找共通原理整合",
          "dim": "cognition.abstract"
        },
        {
          "key": "B",
          "text": "按科目分块完成",
          "dim": "cognition.system"
        },
        {
          "key": "C",
          "text": "挑有兴趣的先做",
          "dim": "ability.focus"
        },
        {
          "key": "D",
          "text": "拉人一起分担",
          "dim": "ability.comm"
        }
      ]
    },
    {
      "id": "A17",
      "module": "A",
      "text": "你学会一个概念后，更想：",
      "options": [
        {
          "key": "A",
          "text": "举一反三扩展",
          "dim": "cognition.abstract"
        },
        {
          "key": "B",
          "text": "总结成可复用步骤",
          "dim": "cognition.system"
        },
        {
          "key": "C",
          "text": "找现实/生活应用",
          "dim": "cognition.contextual"
        },
        {
          "key": "D",
          "text": "讲给别人听",
          "dim": "ability.comm"
        }
      ]
    },
    {
      "id": "A18",
      "module": "A",
      "text": "你对“错题本”更偏：",
      "options": [
        {
          "key": "A",
          "text": "总结原理漏洞",
          "dim": "cognition.abstract"
        },
        {
          "key": "B",
          "text": "总结题型套路",
          "dim": "cognition.system"
        },
        {
          "key": "C",
          "text": "记录当时想法与感受",
          "dim": "cognition.contextual"
        },
        {
          "key": "D",
          "text": "记录别人提醒的点",
          "dim": "ability.memory"
        }
      ]
    },
    {
      "id": "A19",
      "module": "A",
      "text": "你在时间压力下更常：",
      "options": [
        {
          "key": "A",
          "text": "抓关键推理快速决策",
          "dim": "cognition.abstract"
        },
        {
          "key": "B",
          "text": "按步骤稳扎稳打",
          "dim": "cognition.system"
        },
        {
          "key": "C",
          "text": "靠直觉先写再改",
          "dim": "cognition.verbal"
        },
        {
          "key": "D",
          "text": "先问他人怎么取舍",
          "dim": "ability.comm"
        }
      ]
    },
    {
      "id": "A20",
      "module": "A",
      "text": "你更擅长的考试题型是：",
      "options": [
        {
          "key": "A",
          "text": "证明/推理题",
          "dim": "cognition.abstract"
        },
        {
          "key": "B",
          "text": "选择/计算题",
          "dim": "ability.math"
        },
        {
          "key": "C",
          "text": "作文/开放题",
          "dim": "ability.writing"
        },
        {
          "key": "D",
          "text": "口试/展示",
          "dim": "ability.comm"
        }
      ]
    },
    {
      "id": "A21",
      "module": "A",
      "text": "你对“标准答案”的感觉：",
      "options": [
        {
          "key": "A",
          "text": "更想知道为什么",
          "dim": "cognition.abstract"
        },
        {
          "key": "B",
          "text": "有答案就能练",
          "dim": "ability.memory"
        },
        {
          "key": "C",
          "text": "标准答案限制发挥",
          "dim": "ability.writing"
        },
        {
          "key": "D",
          "text": "讨论出来更靠谱",
          "dim": "ability.comm"
        }
      ]
    },
    {
      "id": "A22",
      "module": "A",
      "text": "你学习动力更多来自：",
      "options": [
        {
          "key": "A",
          "text": "搞懂的成就感",
          "dim": "cognition.abstract"
        },
        {
          "key": "B",
          "text": "成绩/排名/结果",
          "dim": "risk.pressure"
        },
        {
          "key": "C",
          "text": "兴趣/热爱",
          "dim": "interest.a"
        },
        {
          "key": "D",
          "text": "认可/关系/团队",
          "dim": "interest.s"
        }
      ]
    },
    {
      "id": "A23",
      "module": "A",
      "text": "你更愿意投入时间提升：",
      "options": [
        {
          "key": "A",
          "text": "逻辑与思维",
          "dim": "cognition.abstract"
        },
        {
          "key": "B",
          "text": "刷题速度与准确率",
          "dim": "ability.math"
        },
        {
          "key": "C",
          "text": "表达与创意",
          "dim": "ability.writing"
        },
        {
          "key": "D",
          "text": "沟通与组织",
          "dim": "ability.comm"
        }
      ]
    },
    {
      "id": "A24",
      "module": "A",
      "text": "你遇到新概念的第一句常问：",
      "options": [
        {
          "key": "A",
          "text": "原理是什么？",
          "dim": "cognition.abstract"
        },
        {
          "key": "B",
          "text": "怎么做题？",
          "dim": "cognition.system"
        },
        {
          "key": "C",
          "text": "有什么用？",
          "dim": "cognition.contextual"
        },
        {
          "key": "D",
          "text": "别人怎么学？",
          "dim": "ability.comm"
        }
      ]
    },
    {
      "id": "A25",
      "module": "A",
      "text": "总体上，你的学习风格更像：",
      "options": [
        {
          "key": "A",
          "text": "理解型",
          "dim": "cognition.abstract"
        },
        {
          "key": "B",
          "text": "执行型",
          "dim": "ability.focus"
        },
        {
          "key": "C",
          "text": "兴趣型",
          "dim": "cognition.contextual"
        },
        {
          "key": "D",
          "text": "互动型",
          "dim": "ability.comm"
        }
      ]
    },
    {
      "id": "B01",
      "module": "B",
      "text": "你对一个新方向产生兴趣时，通常因为：",
      "options": [
        {
          "key": "A",
          "text": "想搞懂原理",
          "dim": "interest.i"
        },
        {
          "key": "B",
          "text": "看见明确结果/收益",
          "dim": "interest.e"
        },
        {
          "key": "C",
          "text": "和人/现实问题相关",
          "dim": "interest.s"
        },
        {
          "key": "D",
          "text": "新鲜好玩",
          "dim": "interest.a"
        }
      ]
    },
    {
      "id": "B02",
      "module": "B",
      "text": "三个月看不到明显进步时：",
      "options": [
        {
          "key": "A",
          "text": "调整方法继续",
          "dim": "interest.r"
        },
        {
          "key": "B",
          "text": "坚持到目标节点",
          "dim": "interest.e"
        },
        {
          "key": "C",
          "text": "开始动摇",
          "dim": "interest.r"
        },
        {
          "key": "D",
          "text": "换更快出结果的",
          "dim": "interest.e"
        }
      ]
    },
    {
      "id": "B03",
      "module": "B",
      "text": "事情变得枯燥重复时：",
      "options": [
        {
          "key": "A",
          "text": "继续深挖",
          "dim": "interest.r"
        },
        {
          "key": "B",
          "text": "为了结果忍耐",
          "dim": "interest.e"
        },
        {
          "key": "C",
          "text": "动力明显下降",
          "dim": "interest.r"
        },
        {
          "key": "D",
          "text": "很快厌倦",
          "dim": "interest.e"
        }
      ]
    },
    {
      "id": "B04",
      "module": "B",
      "text": "没有人监督时，你更能坚持：",
      "options": [
        {
          "key": "A",
          "text": "研究学习",
          "dim": "interest.i"
        },
        {
          "key": "B",
          "text": "目标任务",
          "dim": "interest.e"
        },
        {
          "key": "C",
          "text": "有意义的事",
          "dim": "interest.r"
        },
        {
          "key": "D",
          "text": "有创意的事",
          "dim": "interest.a"
        }
      ]
    },
    {
      "id": "B05",
      "module": "B",
      "text": "别人不认可你做的事时：",
      "options": [
        {
          "key": "A",
          "text": "不影响",
          "dim": "interest.e"
        },
        {
          "key": "B",
          "text": "看目标是否清晰",
          "dim": "interest.e"
        },
        {
          "key": "C",
          "text": "会动摇",
          "dim": "interest.r"
        },
        {
          "key": "D",
          "text": "可能换方向",
          "dim": "interest.r"
        }
      ]
    },
    {
      "id": "B06",
      "module": "B",
      "text": "你最容易被什么“冷却兴趣”：",
      "options": [
        {
          "key": "A",
          "text": "太抽象难懂",
          "dim": "interest.r"
        },
        {
          "key": "B",
          "text": "规则太多压力大",
          "dim": "interest.c"
        },
        {
          "key": "C",
          "text": "看不到意义",
          "dim": "interest.r"
        },
        {
          "key": "D",
          "text": "没有新鲜感",
          "dim": "interest.a"
        }
      ]
    },
    {
      "id": "B07",
      "module": "B",
      "text": "一年内可能没成果的事情：",
      "options": [
        {
          "key": "A",
          "text": "能接受",
          "dim": "interest.r"
        },
        {
          "key": "B",
          "text": "标准清楚就行",
          "dim": "interest.r"
        },
        {
          "key": "C",
          "text": "会焦虑",
          "dim": "interest.r"
        },
        {
          "key": "D",
          "text": "很难坚持",
          "dim": "interest.r"
        }
      ]
    },
    {
      "id": "B08",
      "module": "B",
      "text": "你更像哪种兴趣：",
      "options": [
        {
          "key": "A",
          "text": "慢热稳定",
          "dim": "risk.stability"
        },
        {
          "key": "B",
          "text": "目标驱动稳定",
          "dim": "risk.stability"
        },
        {
          "key": "C",
          "text": "情绪/意义驱动",
          "dim": "interest.r"
        },
        {
          "key": "D",
          "text": "新鲜感驱动",
          "dim": "interest.a"
        }
      ]
    },
    {
      "id": "B09",
      "module": "B",
      "text": "你更愿意长期投入：",
      "options": [
        {
          "key": "A",
          "text": "提升能力/理解",
          "dim": "interest.r"
        },
        {
          "key": "B",
          "text": "拿到证书/成绩",
          "dim": "interest.r"
        },
        {
          "key": "C",
          "text": "帮助他人/解决问题",
          "dim": "interest.s"
        },
        {
          "key": "D",
          "text": "做出有创意的作品",
          "dim": "interest.a"
        }
      ]
    },
    {
      "id": "B10",
      "module": "B",
      "text": "当兴趣变成“任务”时：",
      "options": [
        {
          "key": "A",
          "text": "仍愿意投入",
          "dim": "interest.r"
        },
        {
          "key": "B",
          "text": "为了结果继续",
          "dim": "interest.e"
        },
        {
          "key": "C",
          "text": "明显降温",
          "dim": "interest.r"
        },
        {
          "key": "D",
          "text": "很快放弃",
          "dim": "interest.e"
        }
      ]
    },
    {
      "id": "B11",
      "module": "B",
      "text": "你更容易半途而废的原因：",
      "options": [
        {
          "key": "A",
          "text": "难度变大",
          "dim": "interest.r"
        },
        {
          "key": "B",
          "text": "目标变不清晰",
          "dim": "interest.e"
        },
        {
          "key": "C",
          "text": "意义感下降",
          "dim": "interest.r"
        },
        {
          "key": "D",
          "text": "出现更好玩的事",
          "dim": "interest.a"
        }
      ]
    },
    {
      "id": "B12",
      "module": "B",
      "text": "你更能接受的进步节奏：",
      "options": [
        {
          "key": "A",
          "text": "慢但扎实",
          "dim": "interest.r"
        },
        {
          "key": "B",
          "text": "阶段性里程碑",
          "dim": "interest.r"
        },
        {
          "key": "C",
          "text": "需要持续正反馈",
          "dim": "interest.r"
        },
        {
          "key": "D",
          "text": "要快速看到变化",
          "dim": "interest.e"
        }
      ]
    },
    {
      "id": "B13",
      "module": "B",
      "text": "如果必须每天练同一件事：",
      "options": [
        {
          "key": "A",
          "text": "能坚持",
          "dim": "interest.r"
        },
        {
          "key": "B",
          "text": "能坚持但要有目标",
          "dim": "interest.e"
        },
        {
          "key": "C",
          "text": "坚持不久",
          "dim": "interest.r"
        },
        {
          "key": "D",
          "text": "很难坚持",
          "dim": "interest.r"
        }
      ]
    },
    {
      "id": "B14",
      "module": "B",
      "text": "你对“竞争”更接近：",
      "options": [
        {
          "key": "A",
          "text": "更想比理解深度",
          "dim": "interest.r"
        },
        {
          "key": "B",
          "text": "更想比结果/排名",
          "dim": "interest.e"
        },
        {
          "key": "C",
          "text": "竞争会影响情绪",
          "dim": "interest.e"
        },
        {
          "key": "D",
          "text": "更想换到轻松赛道",
          "dim": "interest.r"
        }
      ]
    },
    {
      "id": "B15",
      "module": "B",
      "text": "你更看重：",
      "options": [
        {
          "key": "A",
          "text": "把问题弄明白",
          "dim": "interest.r"
        },
        {
          "key": "B",
          "text": "能拿到好结果",
          "dim": "interest.e"
        },
        {
          "key": "C",
          "text": "这件事的意义",
          "dim": "interest.r"
        },
        {
          "key": "D",
          "text": "过程是否有趣",
          "dim": "interest.r"
        }
      ]
    },
    {
      "id": "B16",
      "module": "B",
      "text": "当兴趣和成绩冲突时：",
      "options": [
        {
          "key": "A",
          "text": "先保理解和长线",
          "dim": "interest.r"
        },
        {
          "key": "B",
          "text": "先保成绩结果",
          "dim": "interest.e"
        },
        {
          "key": "C",
          "text": "看意义再决定",
          "dim": "interest.r"
        },
        {
          "key": "D",
          "text": "看当下感觉",
          "dim": "interest.r"
        }
      ]
    },
    {
      "id": "B17",
      "module": "B",
      "text": "你会为了兴趣牺牲：",
      "options": [
        {
          "key": "A",
          "text": "一些娱乐时间",
          "dim": "interest.r"
        },
        {
          "key": "B",
          "text": "一些稳定选择",
          "dim": "risk.stability"
        },
        {
          "key": "C",
          "text": "一些短期回报",
          "dim": "interest.e"
        },
        {
          "key": "D",
          "text": "一些固定计划",
          "dim": "interest.c"
        }
      ]
    },
    {
      "id": "B18",
      "module": "B",
      "text": "你喜欢的学习/工作节奏：",
      "options": [
        {
          "key": "A",
          "text": "深入长期",
          "dim": "interest.r"
        },
        {
          "key": "B",
          "text": "目标推进",
          "dim": "interest.e"
        },
        {
          "key": "C",
          "text": "与人互动有意义",
          "dim": "interest.s"
        },
        {
          "key": "D",
          "text": "变化快",
          "dim": "interest.e"
        }
      ]
    },
    {
      "id": "B19",
      "module": "B",
      "text": "你对“长期不确定回报”的态度：",
      "options": [
        {
          "key": "A",
          "text": "正常",
          "dim": "interest.r"
        },
        {
          "key": "B",
          "text": "可接受",
          "dim": "interest.r"
        },
        {
          "key": "C",
          "text": "不安",
          "dim": "interest.r"
        },
        {
          "key": "D",
          "text": "不适应",
          "dim": "interest.r"
        }
      ]
    },
    {
      "id": "B20",
      "module": "B",
      "text": "你更容易被哪种目标驱动：",
      "options": [
        {
          "key": "A",
          "text": "能力成长",
          "dim": "interest.r"
        },
        {
          "key": "B",
          "text": "清晰回报",
          "dim": "interest.e"
        },
        {
          "key": "C",
          "text": "影响他人",
          "dim": "interest.s"
        },
        {
          "key": "D",
          "text": "体验新鲜",
          "dim": "interest.a"
        }
      ]
    },
    {
      "id": "B21",
      "module": "B",
      "text": "当遇到挫折时你更可能：",
      "options": [
        {
          "key": "A",
          "text": "复盘改进",
          "dim": "interest.c"
        },
        {
          "key": "B",
          "text": "坚持到节点",
          "dim": "interest.r"
        },
        {
          "key": "C",
          "text": "情绪波动大",
          "dim": "interest.r"
        },
        {
          "key": "D",
          "text": "转移注意力",
          "dim": "interest.r"
        }
      ]
    },
    {
      "id": "B22",
      "module": "B",
      "text": "你更常出现：",
      "options": [
        {
          "key": "A",
          "text": "越学越上头",
          "dim": "interest.r"
        },
        {
          "key": "B",
          "text": "越做越稳定",
          "dim": "risk.stability"
        },
        {
          "key": "C",
          "text": "忽冷忽热",
          "dim": "interest.r"
        },
        {
          "key": "D",
          "text": "三分钟热度",
          "dim": "interest.r"
        }
      ]
    },
    {
      "id": "B23",
      "module": "B",
      "text": "你对“重复训练”的接受度：",
      "options": [
        {
          "key": "A",
          "text": "高",
          "dim": "interest.r"
        },
        {
          "key": "B",
          "text": "中",
          "dim": "interest.r"
        },
        {
          "key": "C",
          "text": "低",
          "dim": "interest.r"
        },
        {
          "key": "D",
          "text": "很低",
          "dim": "interest.r"
        }
      ]
    },
    {
      "id": "B24",
      "module": "B",
      "text": "你更喜欢的成果形态：",
      "options": [
        {
          "key": "A",
          "text": "理解/模型",
          "dim": "interest.i"
        },
        {
          "key": "B",
          "text": "证书/分数",
          "dim": "interest.r"
        },
        {
          "key": "C",
          "text": "影响/反馈",
          "dim": "interest.e"
        },
        {
          "key": "D",
          "text": "作品/呈现",
          "dim": "interest.r"
        }
      ]
    },
    {
      "id": "B25",
      "module": "B",
      "text": "总体来说，你的兴趣更像：",
      "options": [
        {
          "key": "A",
          "text": "内在驱动",
          "dim": "interest.r"
        },
        {
          "key": "B",
          "text": "结果驱动",
          "dim": "interest.e"
        },
        {
          "key": "C",
          "text": "意义驱动",
          "dim": "interest.r"
        },
        {
          "key": "D",
          "text": "刺激驱动",
          "dim": "interest.r"
        }
      ]
    },
    {
      "id": "C01",
      "module": "C",
      "text": "复杂问题第一反应：",
      "options": [
        {
          "key": "A",
          "text": "拆结构找规律",
          "dim": "cognition.system"
        },
        {
          "key": "B",
          "text": "列步骤逐项做",
          "dim": "cognition.system"
        },
        {
          "key": "C",
          "text": "看情境综合判断",
          "dim": "cognition.contextual"
        },
        {
          "key": "D",
          "text": "多角度发散想",
          "dim": "cognition.data"
        }
      ]
    },
    {
      "id": "C02",
      "module": "C",
      "text": "你更擅长：",
      "options": [
        {
          "key": "A",
          "text": "抽象推理",
          "dim": "cognition.abstract"
        },
        {
          "key": "B",
          "text": "规则执行",
          "dim": "cognition.data"
        },
        {
          "key": "C",
          "text": "理解人和关系",
          "dim": "cognition.data"
        },
        {
          "key": "D",
          "text": "创意表达",
          "dim": "cognition.verbal"
        }
      ]
    },
    {
      "id": "C03",
      "module": "C",
      "text": "没有标准答案的问题：",
      "options": [
        {
          "key": "A",
          "text": "逻辑推演",
          "dim": "cognition.abstract"
        },
        {
          "key": "B",
          "text": "想要评判标准",
          "dim": "cognition.data"
        },
        {
          "key": "C",
          "text": "看现实效果",
          "dim": "cognition.data"
        },
        {
          "key": "D",
          "text": "自由探索",
          "dim": "cognition.data"
        }
      ]
    },
    {
      "id": "C04",
      "module": "C",
      "text": "规则与直觉冲突：",
      "options": [
        {
          "key": "A",
          "text": "信逻辑",
          "dim": "cognition.abstract"
        },
        {
          "key": "B",
          "text": "按规则",
          "dim": "cognition.data"
        },
        {
          "key": "C",
          "text": "看情况",
          "dim": "cognition.data"
        },
        {
          "key": "D",
          "text": "跟感觉",
          "dim": "cognition.data"
        }
      ]
    },
    {
      "id": "C05",
      "module": "C",
      "text": "做决定更依赖：",
      "options": [
        {
          "key": "A",
          "text": "分析",
          "dim": "cognition.data"
        },
        {
          "key": "B",
          "text": "计划",
          "dim": "cognition.data"
        },
        {
          "key": "C",
          "text": "经验",
          "dim": "cognition.data"
        },
        {
          "key": "D",
          "text": "灵感",
          "dim": "cognition.data"
        }
      ]
    },
    {
      "id": "C06",
      "module": "C",
      "text": "你更喜欢的知识形态：",
      "options": [
        {
          "key": "A",
          "text": "模型/公式",
          "dim": "cognition.abstract"
        },
        {
          "key": "B",
          "text": "方法/清单",
          "dim": "cognition.data"
        },
        {
          "key": "C",
          "text": "案例/故事",
          "dim": "cognition.data"
        },
        {
          "key": "D",
          "text": "观点/创意",
          "dim": "cognition.verbal"
        }
      ]
    },
    {
      "id": "C07",
      "module": "C",
      "text": "你更擅长把信息变成：",
      "options": [
        {
          "key": "A",
          "text": "结构图",
          "dim": "cognition.system"
        },
        {
          "key": "B",
          "text": "步骤表",
          "dim": "cognition.system"
        },
        {
          "key": "C",
          "text": "情境描述",
          "dim": "cognition.contextual"
        },
        {
          "key": "D",
          "text": "表达内容",
          "dim": "cognition.verbal"
        }
      ]
    },
    {
      "id": "C08",
      "module": "C",
      "text": "别人讲一大段，你更先抓：",
      "options": [
        {
          "key": "A",
          "text": "核心逻辑",
          "dim": "cognition.abstract"
        },
        {
          "key": "B",
          "text": "可执行步骤",
          "dim": "cognition.system"
        },
        {
          "key": "C",
          "text": "人物动机/关系",
          "dim": "cognition.data"
        },
        {
          "key": "D",
          "text": "亮点与创意",
          "dim": "cognition.data"
        }
      ]
    },
    {
      "id": "C09",
      "module": "C",
      "text": "遇到新观点，你更先问：",
      "options": [
        {
          "key": "A",
          "text": "依据是什么？",
          "dim": "cognition.data"
        },
        {
          "key": "B",
          "text": "怎么落地？",
          "dim": "cognition.data"
        },
        {
          "key": "C",
          "text": "对人有什么影响？",
          "dim": "cognition.data"
        },
        {
          "key": "D",
          "text": "有没有更有趣的说法？",
          "dim": "cognition.data"
        }
      ]
    },
    {
      "id": "C10",
      "module": "C",
      "text": "你对“不确定”的容忍度：",
      "options": [
        {
          "key": "A",
          "text": "高（可推演）",
          "dim": "cognition.data"
        },
        {
          "key": "B",
          "text": "中（要规则）",
          "dim": "cognition.data"
        },
        {
          "key": "C",
          "text": "中（看情境）",
          "dim": "cognition.contextual"
        },
        {
          "key": "D",
          "text": "高（可探索）",
          "dim": "cognition.data"
        }
      ]
    },
    {
      "id": "C11",
      "module": "C",
      "text": "你更喜欢的题目：",
      "options": [
        {
          "key": "A",
          "text": "证明/推理",
          "dim": "cognition.abstract"
        },
        {
          "key": "B",
          "text": "计算/套用",
          "dim": "cognition.data"
        },
        {
          "key": "C",
          "text": "案例分析",
          "dim": "cognition.data"
        },
        {
          "key": "D",
          "text": "开放创作",
          "dim": "cognition.data"
        }
      ]
    },
    {
      "id": "C12",
      "module": "C",
      "text": "你学习时更常做：",
      "options": [
        {
          "key": "A",
          "text": "推导总结",
          "dim": "cognition.abstract"
        },
        {
          "key": "B",
          "text": "刷题归纳",
          "dim": "cognition.data"
        },
        {
          "key": "C",
          "text": "联系现实",
          "dim": "cognition.data"
        },
        {
          "key": "D",
          "text": "讨论表达",
          "dim": "cognition.verbal"
        }
      ]
    },
    {
      "id": "C13",
      "module": "C",
      "text": "你更容易被什么说服：",
      "options": [
        {
          "key": "A",
          "text": "逻辑链",
          "dim": "cognition.abstract"
        },
        {
          "key": "B",
          "text": "数据/标准",
          "dim": "cognition.data"
        },
        {
          "key": "C",
          "text": "现实结果",
          "dim": "cognition.data"
        },
        {
          "key": "D",
          "text": "表达感染力",
          "dim": "cognition.verbal"
        }
      ]
    },
    {
      "id": "C14",
      "module": "C",
      "text": "你面对冲突信息更像：",
      "options": [
        {
          "key": "A",
          "text": "找一致性解释",
          "dim": "cognition.data"
        },
        {
          "key": "B",
          "text": "按权威/标准选",
          "dim": "cognition.data"
        },
        {
          "key": "C",
          "text": "结合具体情况权衡",
          "dim": "cognition.contextual"
        },
        {
          "key": "D",
          "text": "接受多种可能",
          "dim": "cognition.data"
        }
      ]
    },
    {
      "id": "C15",
      "module": "C",
      "text": "你更在意：",
      "options": [
        {
          "key": "A",
          "text": "是否正确",
          "dim": "cognition.data"
        },
        {
          "key": "B",
          "text": "是否可行",
          "dim": "cognition.data"
        },
        {
          "key": "C",
          "text": "是否合理公平",
          "dim": "cognition.data"
        },
        {
          "key": "D",
          "text": "是否新颖",
          "dim": "cognition.data"
        }
      ]
    },
    {
      "id": "C16",
      "module": "C",
      "text": "你更擅长的问题分解：",
      "options": [
        {
          "key": "A",
          "text": "抽象成变量",
          "dim": "cognition.abstract"
        },
        {
          "key": "B",
          "text": "拆成步骤",
          "dim": "cognition.system"
        },
        {
          "key": "C",
          "text": "拆成角色/利益",
          "dim": "cognition.data"
        },
        {
          "key": "D",
          "text": "拆成创意路径",
          "dim": "cognition.system"
        }
      ]
    },
    {
      "id": "C17",
      "module": "C",
      "text": "你更喜欢的学习反馈：",
      "options": [
        {
          "key": "A",
          "text": "理解更深",
          "dim": "cognition.data"
        },
        {
          "key": "B",
          "text": "做得更快更准",
          "dim": "cognition.data"
        },
        {
          "key": "C",
          "text": "更懂别人/社会",
          "dim": "cognition.data"
        },
        {
          "key": "D",
          "text": "作品更好看",
          "dim": "cognition.data"
        }
      ]
    },
    {
      "id": "C18",
      "module": "C",
      "text": "当信息不完整时：",
      "options": [
        {
          "key": "A",
          "text": "推理补全",
          "dim": "cognition.abstract"
        },
        {
          "key": "B",
          "text": "等待规则明确",
          "dim": "cognition.data"
        },
        {
          "key": "C",
          "text": "用经验判断",
          "dim": "cognition.data"
        },
        {
          "key": "D",
          "text": "先试再改",
          "dim": "cognition.data"
        }
      ]
    },
    {
      "id": "C19",
      "module": "C",
      "text": "你处理文字材料更像：",
      "options": [
        {
          "key": "A",
          "text": "提炼论证结构",
          "dim": "cognition.verbal"
        },
        {
          "key": "B",
          "text": "提炼要点/提纲",
          "dim": "cognition.data"
        },
        {
          "key": "C",
          "text": "提炼立场/动机",
          "dim": "cognition.data"
        },
        {
          "key": "D",
          "text": "提炼亮点/金句",
          "dim": "cognition.data"
        }
      ]
    },
    {
      "id": "C20",
      "module": "C",
      "text": "你更习惯的表达方式：",
      "options": [
        {
          "key": "A",
          "text": "讲逻辑",
          "dim": "cognition.abstract"
        },
        {
          "key": "B",
          "text": "讲步骤",
          "dim": "cognition.system"
        },
        {
          "key": "C",
          "text": "讲情境",
          "dim": "cognition.contextual"
        },
        {
          "key": "D",
          "text": "讲故事/创意",
          "dim": "cognition.data"
        }
      ]
    },
    {
      "id": "C21",
      "module": "C",
      "text": "你更喜欢的工作方式：",
      "options": [
        {
          "key": "A",
          "text": "独立深思",
          "dim": "cognition.data"
        },
        {
          "key": "B",
          "text": "按流程协作",
          "dim": "cognition.system"
        },
        {
          "key": "C",
          "text": "与人互动",
          "dim": "cognition.data"
        },
        {
          "key": "D",
          "text": "灵活创作",
          "dim": "cognition.data"
        }
      ]
    },
    {
      "id": "C22",
      "module": "C",
      "text": "你对“理论课”的态度：",
      "options": [
        {
          "key": "A",
          "text": "喜欢",
          "dim": "cognition.data"
        },
        {
          "key": "B",
          "text": "看实用性",
          "dim": "cognition.data"
        },
        {
          "key": "C",
          "text": "看是否有意义",
          "dim": "cognition.data"
        },
        {
          "key": "D",
          "text": "更喜欢项目",
          "dim": "cognition.data"
        }
      ]
    },
    {
      "id": "C23",
      "module": "C",
      "text": "你在讨论中更常扮演：",
      "options": [
        {
          "key": "A",
          "text": "提出关键假设",
          "dim": "cognition.abstract"
        },
        {
          "key": "B",
          "text": "推动落地方案",
          "dim": "cognition.data"
        },
        {
          "key": "C",
          "text": "照顾关系与影响",
          "dim": "cognition.data"
        },
        {
          "key": "D",
          "text": "提供新点子",
          "dim": "cognition.data"
        }
      ]
    },
    {
      "id": "C24",
      "module": "C",
      "text": "你更容易犯的错是：",
      "options": [
        {
          "key": "A",
          "text": "想太多忽略细节",
          "dim": "cognition.data"
        },
        {
          "key": "B",
          "text": "死板不变通",
          "dim": "cognition.data"
        },
        {
          "key": "C",
          "text": "情绪/关系影响判断",
          "dim": "cognition.data"
        },
        {
          "key": "D",
          "text": "发散太多不收敛",
          "dim": "cognition.data"
        }
      ]
    },
    {
      "id": "C25",
      "module": "C",
      "text": "总体思维更像：",
      "options": [
        {
          "key": "A",
          "text": "系统抽象",
          "dim": "cognition.abstract"
        },
        {
          "key": "B",
          "text": "结构执行",
          "dim": "cognition.system"
        },
        {
          "key": "C",
          "text": "情境关系",
          "dim": "cognition.contextual"
        },
        {
          "key": "D",
          "text": "发散创意",
          "dim": "cognition.data"
        }
      ]
    },
    {
      "id": "D01",
      "module": "D",
      "text": "学习压力大时你更常：",
      "options": [
        {
          "key": "A",
          "text": "整理思路再做",
          "dim": "risk.stability"
        },
        {
          "key": "B",
          "text": "按计划硬做",
          "dim": "ability.focus"
        },
        {
          "key": "C",
          "text": "情绪波动大",
          "dim": "value.security"
        },
        {
          "key": "D",
          "text": "需要安慰/支持",
          "dim": "ability.comm"
        }
      ]
    },
    {
      "id": "D02",
      "module": "D",
      "text": "连续失败时你更可能：",
      "options": [
        {
          "key": "A",
          "text": "找原因改方法",
          "dim": "risk.pressure"
        },
        {
          "key": "B",
          "text": "先停一停避免再错",
          "dim": "risk.stability"
        },
        {
          "key": "C",
          "text": "明显低落",
          "dim": "value.security"
        },
        {
          "key": "D",
          "text": "找人聊/求助",
          "dim": "ability.comm"
        }
      ]
    },
    {
      "id": "D03",
      "module": "D",
      "text": "任务很重时你更像：",
      "options": [
        {
          "key": "A",
          "text": "集中攻克关键",
          "dim": "risk.pressure"
        },
        {
          "key": "B",
          "text": "按清单逐项完成",
          "dim": "ability.focus"
        },
        {
          "key": "C",
          "text": "拖延内耗",
          "dim": "value.security"
        },
        {
          "key": "D",
          "text": "需要外部推动",
          "dim": "ability.comm"
        }
      ]
    },
    {
      "id": "D04",
      "module": "D",
      "text": "被批评时你更常：",
      "options": [
        {
          "key": "A",
          "text": "把批评当信息",
          "dim": "risk.pressure"
        },
        {
          "key": "B",
          "text": "按要求改",
          "dim": "ability.focus"
        },
        {
          "key": "C",
          "text": "很受打击",
          "dim": "value.security"
        },
        {
          "key": "D",
          "text": "想解释/争取理解",
          "dim": "ability.comm"
        }
      ]
    },
    {
      "id": "D05",
      "module": "D",
      "text": "考试失利后你更像：",
      "options": [
        {
          "key": "A",
          "text": "复盘策略",
          "dim": "risk.pressure"
        },
        {
          "key": "B",
          "text": "增加练习",
          "dim": "ability.focus"
        },
        {
          "key": "C",
          "text": "怀疑自己",
          "dim": "value.security"
        },
        {
          "key": "D",
          "text": "需要别人鼓励",
          "dim": "ability.comm"
        }
      ]
    },
    {
      "id": "D06",
      "module": "D",
      "text": "你对“高竞争环境”更像：",
      "options": [
        {
          "key": "A",
          "text": "兴奋想挑战",
          "dim": "risk.pressure"
        },
        {
          "key": "B",
          "text": "能适应但要规则",
          "dim": "risk.stability"
        },
        {
          "key": "C",
          "text": "容易焦虑",
          "dim": "value.security"
        },
        {
          "key": "D",
          "text": "更想换环境",
          "dim": "ability.comm"
        }
      ]
    },
    {
      "id": "D07",
      "module": "D",
      "text": "遇到冲突你更常：",
      "options": [
        {
          "key": "A",
          "text": "讲道理解决",
          "dim": "risk.stability"
        },
        {
          "key": "B",
          "text": "按规则处理",
          "dim": "ability.focus"
        },
        {
          "key": "C",
          "text": "回避",
          "dim": "value.security"
        },
        {
          "key": "D",
          "text": "靠沟通缓和",
          "dim": "ability.comm"
        }
      ]
    },
    {
      "id": "D08",
      "module": "D",
      "text": "面对不确定结果你更像：",
      "options": [
        {
          "key": "A",
          "text": "能推演就不慌",
          "dim": "risk.pressure"
        },
        {
          "key": "B",
          "text": "有标准就安心",
          "dim": "risk.stability"
        },
        {
          "key": "C",
          "text": "容易焦虑",
          "dim": "value.security"
        },
        {
          "key": "D",
          "text": "先做点别的",
          "dim": "ability.focus"
        }
      ]
    },
    {
      "id": "D09",
      "module": "D",
      "text": "你更容易被什么消耗：",
      "options": [
        {
          "key": "A",
          "text": "逻辑矛盾",
          "dim": "risk.stability"
        },
        {
          "key": "B",
          "text": "流程混乱",
          "dim": "ability.focus"
        },
        {
          "key": "C",
          "text": "关系冲突",
          "dim": "ability.comm"
        },
        {
          "key": "D",
          "text": "无聊重复",
          "dim": "value.security"
        }
      ]
    },
    {
      "id": "D10",
      "module": "D",
      "text": "你恢复状态更靠：",
      "options": [
        {
          "key": "A",
          "text": "独处思考",
          "dim": "risk.stability"
        },
        {
          "key": "B",
          "text": "按节奏执行",
          "dim": "ability.focus"
        },
        {
          "key": "C",
          "text": "情绪平复",
          "dim": "value.security"
        },
        {
          "key": "D",
          "text": "社交/陪伴",
          "dim": "ability.comm"
        }
      ]
    },
    {
      "id": "D11",
      "module": "D",
      "text": "遇到压力你更可能：",
      "options": [
        {
          "key": "A",
          "text": "变得更理性",
          "dim": "risk.stability"
        },
        {
          "key": "B",
          "text": "变得更自律",
          "dim": "ability.focus"
        },
        {
          "key": "C",
          "text": "变得更敏感",
          "dim": "value.security"
        },
        {
          "key": "D",
          "text": "变得更依赖他人",
          "dim": "ability.comm"
        }
      ]
    },
    {
      "id": "D12",
      "module": "D",
      "text": "长期看不到回报时：",
      "options": [
        {
          "key": "A",
          "text": "继续优化",
          "dim": "risk.pressure"
        },
        {
          "key": "B",
          "text": "坚持到节点",
          "dim": "ability.focus"
        },
        {
          "key": "C",
          "text": "开始崩",
          "dim": "value.security"
        },
        {
          "key": "D",
          "text": "换方向",
          "dim": "risk.stability"
        }
      ]
    },
    {
      "id": "D13",
      "module": "D",
      "text": "对“权威/规矩”你更像：",
      "options": [
        {
          "key": "A",
          "text": "认可其逻辑",
          "dim": "risk.stability"
        },
        {
          "key": "B",
          "text": "愿意遵守",
          "dim": "ability.focus"
        },
        {
          "key": "C",
          "text": "容易抵触",
          "dim": "risk.pressure"
        },
        {
          "key": "D",
          "text": "看人看关系",
          "dim": "ability.comm"
        }
      ]
    },
    {
      "id": "D14",
      "module": "D",
      "text": "团队中你更像：",
      "options": [
        {
          "key": "A",
          "text": "定方向/关键思路",
          "dim": "risk.pressure"
        },
        {
          "key": "B",
          "text": "推进执行",
          "dim": "ability.focus"
        },
        {
          "key": "C",
          "text": "照顾情绪氛围",
          "dim": "risk.stability"
        },
        {
          "key": "D",
          "text": "调动大家/沟通",
          "dim": "ability.comm"
        }
      ]
    },
    {
      "id": "D15",
      "module": "D",
      "text": "你对“高强度长期训练”更像：",
      "options": [
        {
          "key": "A",
          "text": "能扛",
          "dim": "risk.pressure"
        },
        {
          "key": "B",
          "text": "能扛但要计划",
          "dim": "ability.focus"
        },
        {
          "key": "C",
          "text": "很难",
          "dim": "value.security"
        },
        {
          "key": "D",
          "text": "除非有人带",
          "dim": "ability.comm"
        }
      ]
    },
    {
      "id": "D16",
      "module": "D",
      "text": "出现失误时你更像：",
      "options": [
        {
          "key": "A",
          "text": "冷静修正",
          "dim": "risk.pressure"
        },
        {
          "key": "B",
          "text": "按流程补救",
          "dim": "ability.focus"
        },
        {
          "key": "C",
          "text": "自责内耗",
          "dim": "value.security"
        },
        {
          "key": "D",
          "text": "找人商量",
          "dim": "ability.comm"
        }
      ]
    },
    {
      "id": "D17",
      "module": "D",
      "text": "你更害怕：",
      "options": [
        {
          "key": "A",
          "text": "想不明白",
          "dim": "risk.stability"
        },
        {
          "key": "B",
          "text": "做不完",
          "dim": "ability.focus"
        },
        {
          "key": "C",
          "text": "被否定",
          "dim": "value.security"
        },
        {
          "key": "D",
          "text": "被孤立",
          "dim": "ability.comm"
        }
      ]
    },
    {
      "id": "D18",
      "module": "D",
      "text": "你更容易：",
      "options": [
        {
          "key": "A",
          "text": "越难越专注",
          "dim": "risk.pressure"
        },
        {
          "key": "B",
          "text": "越忙越机械",
          "dim": "ability.focus"
        },
        {
          "key": "C",
          "text": "越忙越崩",
          "dim": "value.security"
        },
        {
          "key": "D",
          "text": "越忙越需要支持",
          "dim": "ability.comm"
        }
      ]
    },
    {
      "id": "D19",
      "module": "D",
      "text": "你更常用的减压方式：",
      "options": [
        {
          "key": "A",
          "text": "思考/总结",
          "dim": "risk.stability"
        },
        {
          "key": "B",
          "text": "运动/执行",
          "dim": "ability.focus"
        },
        {
          "key": "C",
          "text": "发泄/情绪",
          "dim": "value.security"
        },
        {
          "key": "D",
          "text": "聊天/社交",
          "dim": "ability.comm"
        }
      ]
    },
    {
      "id": "D20",
      "module": "D",
      "text": "总体抗压风格更像：",
      "options": [
        {
          "key": "A",
          "text": "理性修复型",
          "dim": "risk.pressure"
        },
        {
          "key": "B",
          "text": "流程执行型",
          "dim": "ability.focus"
        },
        {
          "key": "C",
          "text": "情绪波动型",
          "dim": "value.security"
        },
        {
          "key": "D",
          "text": "外部支持型",
          "dim": "ability.comm"
        }
      ]
    },
    {
      "id": "E01",
      "module": "E",
      "text": "家庭对你学习/选择的支持：",
      "options": [
        {
          "key": "A",
          "text": "非常支持我自主决定",
          "dim": "value.wealth"
        },
        {
          "key": "B",
          "text": "支持但更看结果",
          "dim": "value.wealth"
        },
        {
          "key": "C",
          "text": "支持取决于是否有意义",
          "dim": "value.responsibility"
        },
        {
          "key": "D",
          "text": "支持取决于是否稳定/安全",
          "dim": "risk.stability"
        }
      ]
    },
    {
      "id": "E02",
      "module": "E",
      "text": "如果专业周期很长（5-8年），你更能接受：",
      "options": [
        {
          "key": "A",
          "text": "只要方向对我愿意",
          "dim": "value.wealth"
        },
        {
          "key": "B",
          "text": "只要回报清晰我愿意",
          "dim": "value.wealth"
        },
        {
          "key": "C",
          "text": "只要意义大我愿意",
          "dim": "value.responsibility"
        },
        {
          "key": "D",
          "text": "更倾向周期短",
          "dim": "value.wealth"
        }
      ]
    },
    {
      "id": "E03",
      "module": "E",
      "text": "你更重视未来的：",
      "options": [
        {
          "key": "A",
          "text": "能力成长",
          "dim": "value.wealth"
        },
        {
          "key": "B",
          "text": "收入与稳定",
          "dim": "risk.stability"
        },
        {
          "key": "C",
          "text": "社会影响/意义",
          "dim": "value.influence"
        },
        {
          "key": "D",
          "text": "自由与体验",
          "dim": "value.wealth"
        }
      ]
    },
    {
      "id": "E04",
      "module": "E",
      "text": "你能接受的试错成本：",
      "options": [
        {
          "key": "A",
          "text": "可以多次试错",
          "dim": "value.wealth"
        },
        {
          "key": "B",
          "text": "可以少量试错",
          "dim": "value.wealth"
        },
        {
          "key": "C",
          "text": "试错会让我焦虑",
          "dim": "value.wealth"
        },
        {
          "key": "D",
          "text": "尽量不试错",
          "dim": "value.wealth"
        }
      ]
    },
    {
      "id": "E05",
      "module": "E",
      "text": "家里对你出国/跨城读书的态度更像：",
      "options": [
        {
          "key": "A",
          "text": "支持探索",
          "dim": "value.wealth"
        },
        {
          "key": "B",
          "text": "看性价比",
          "dim": "value.wealth"
        },
        {
          "key": "C",
          "text": "看是否有意义",
          "dim": "value.responsibility"
        },
        {
          "key": "D",
          "text": "更希望稳妥就近",
          "dim": "risk.stability"
        }
      ]
    },
    {
      "id": "E06",
      "module": "E",
      "text": "你对“高门槛证照/考试”的态度：",
      "options": [
        {
          "key": "A",
          "text": "愿意长期准备",
          "dim": "value.wealth"
        },
        {
          "key": "B",
          "text": "愿意但要明确路径",
          "dim": "value.wealth"
        },
        {
          "key": "C",
          "text": "除非很有意义",
          "dim": "value.responsibility"
        },
        {
          "key": "D",
          "text": "更想避开",
          "dim": "value.wealth"
        }
      ]
    },
    {
      "id": "E07",
      "module": "E",
      "text": "你更能接受的职业路径：",
      "options": [
        {
          "key": "A",
          "text": "不确定但上限高",
          "dim": "value.security"
        },
        {
          "key": "B",
          "text": "清晰稳定",
          "dim": "risk.stability"
        },
        {
          "key": "C",
          "text": "能帮助他人/社会",
          "dim": "value.responsibility"
        },
        {
          "key": "D",
          "text": "自由灵活",
          "dim": "value.wealth"
        }
      ]
    },
    {
      "id": "E08",
      "module": "E",
      "text": "你对“实习/项目”的投入意愿：",
      "options": [
        {
          "key": "A",
          "text": "愿意深度做",
          "dim": "value.wealth"
        },
        {
          "key": "B",
          "text": "愿意做为拿结果",
          "dim": "value.wealth"
        },
        {
          "key": "C",
          "text": "愿意做有意义的",
          "dim": "value.responsibility"
        },
        {
          "key": "D",
          "text": "愿意做有趣的",
          "dim": "value.wealth"
        }
      ]
    },
    {
      "id": "E09",
      "module": "E",
      "text": "你更愿意选择：",
      "options": [
        {
          "key": "A",
          "text": "难但学到东西的学校/专业",
          "dim": "value.wealth"
        },
        {
          "key": "B",
          "text": "回报确定的学校/专业",
          "dim": "value.wealth"
        },
        {
          "key": "C",
          "text": "价值感强的学校/专业",
          "dim": "value.wealth"
        },
        {
          "key": "D",
          "text": "体验感好的学校/专业",
          "dim": "value.wealth"
        }
      ]
    },
    {
      "id": "E10",
      "module": "E",
      "text": "你对“家庭期望”的处理方式：",
      "options": [
        {
          "key": "A",
          "text": "沟通后坚持自己的逻辑",
          "dim": "value.wealth"
        },
        {
          "key": "B",
          "text": "会优先满足结果导向",
          "dim": "value.wealth"
        },
        {
          "key": "C",
          "text": "会看是否符合价值",
          "dim": "value.wealth"
        },
        {
          "key": "D",
          "text": "会尽量减少冲突",
          "dim": "value.wealth"
        }
      ]
    },
    {
      "id": "E11",
      "module": "E",
      "text": "当现实条件受限时你更可能：",
      "options": [
        {
          "key": "A",
          "text": "找替代方案继续走",
          "dim": "value.wealth"
        },
        {
          "key": "B",
          "text": "选择更稳妥的路",
          "dim": "risk.stability"
        },
        {
          "key": "C",
          "text": "选择更有意义但可行的路",
          "dim": "value.responsibility"
        },
        {
          "key": "D",
          "text": "先选择轻松再说",
          "dim": "value.wealth"
        }
      ]
    },
    {
      "id": "E12",
      "module": "E",
      "text": "你能接受的学习强度：",
      "options": [
        {
          "key": "A",
          "text": "高强度长期",
          "dim": "value.wealth"
        },
        {
          "key": "B",
          "text": "中高强度但要结果",
          "dim": "value.wealth"
        },
        {
          "key": "C",
          "text": "强度取决于意义",
          "dim": "value.responsibility"
        },
        {
          "key": "D",
          "text": "不喜欢高强度",
          "dim": "value.wealth"
        }
      ]
    },
    {
      "id": "E13",
      "module": "E",
      "text": "你对“城市/平台资源”的看法：",
      "options": [
        {
          "key": "A",
          "text": "更看重学习内容",
          "dim": "value.wealth"
        },
        {
          "key": "B",
          "text": "更看重回报与资源",
          "dim": "value.wealth"
        },
        {
          "key": "C",
          "text": "更看重社会影响",
          "dim": "value.influence"
        },
        {
          "key": "D",
          "text": "更看重生活体验",
          "dim": "value.wealth"
        }
      ]
    },
    {
      "id": "E14",
      "module": "E",
      "text": "你希望未来工作更像：",
      "options": [
        {
          "key": "A",
          "text": "解决复杂问题",
          "dim": "value.wealth"
        },
        {
          "key": "B",
          "text": "稳定清晰",
          "dim": "risk.stability"
        },
        {
          "key": "C",
          "text": "帮助他人",
          "dim": "value.responsibility"
        },
        {
          "key": "D",
          "text": "自由创作/沟通",
          "dim": "value.wealth"
        }
      ]
    },
    {
      "id": "E15",
      "module": "E",
      "text": "总体上，你更适合的路径偏好：",
      "options": [
        {
          "key": "A",
          "text": "长线成长型",
          "dim": "value.wealth"
        },
        {
          "key": "B",
          "text": "稳健回报型",
          "dim": "value.wealth"
        },
        {
          "key": "C",
          "text": "意义驱动型",
          "dim": "value.responsibility"
        },
        {
          "key": "D",
          "text": "体验灵活型",
          "dim": "value.wealth"
        }
      ]
    }
  ],
  "dimensions": [
    {
      "key": "interest.r",
      "name": "动手与实作偏好",
      "strengthText": "对实体/实作任务投入度较高，适合工程与实践型学习。",
      "riskText": "对实作任务投入度偏低，工程实践类学习可能缺少驱动力。"
    },
    {
      "key": "interest.i",
      "name": "研究与求知偏好",
      "strengthText": "对原理/机制/求知具有稳定兴趣，适合研究与理论深化。",
      "riskText": "对原理性学习兴趣不足，纯研究型路径可能难以长期坚持。"
    },
    {
      "key": "interest.a",
      "name": "创意与表达偏好",
      "strengthText": "表达与创意驱动明显，适合需要输出与表达的学习场景。",
      "riskText": "表达/创意驱动偏弱，强输出型专业可能体验一般。"
    },
    {
      "key": "interest.s",
      "name": "社会与人际偏好",
      "strengthText": "对人际/社会议题敏感，适合需要协调与沟通的方向。",
      "riskText": "对人际互动驱动偏弱，强人际型专业可能消耗更大。"
    },
    {
      "key": "interest.e",
      "name": "结果与竞争偏好",
      "strengthText": "目标与结果驱动较强，适合绩效明确、节奏快的路径。",
      "riskText": "目标驱动偏弱，强竞争/强绩效环境可能缺乏持续动力。"
    },
    {
      "key": "interest.c",
      "name": "规则与秩序偏好",
      "strengthText": "规则感与秩序偏好明显，适合结构清晰、规范要求高的方向。",
      "riskText": "规则偏好偏弱，强规范/强流程环境可能不适应。"
    },
    {
      "key": "cognition.data",
      "name": "数据思维",
      "strengthText": "数据感知与量化理解较强，适合数据驱动的学习与决策。",
      "riskText": "数据理解偏弱，数据密集型专业学习成本更高。"
    },
    {
      "key": "cognition.verbal",
      "name": "语言理解",
      "strengthText": "文字与语言理解能力较强，适合阅读密集与写作要求高的专业。",
      "riskText": "语言理解偏弱，阅读写作密集型专业将成为负担。"
    },
    {
      "key": "cognition.abstract",
      "name": "抽象推理",
      "strengthText": "抽象推理能力突出，适合处理复杂概念、模型与逻辑结构。",
      "riskText": "抽象推理偏弱，理论密集型方向学习阻力较大。"
    },
    {
      "key": "cognition.system",
      "name": "系统思维",
      "strengthText": "系统结构理解清晰，擅长把握整体框架与因果链条。",
      "riskText": "系统结构理解偏弱，复杂系统类学习需要额外训练。"
    },
    {
      "key": "cognition.spatial",
      "name": "空间想象",
      "strengthText": "空间结构感较强，适合空间/结构/设计相关学习。",
      "riskText": "空间结构感偏弱，空间建模要求高的专业更吃力。"
    },
    {
      "key": "cognition.contextual",
      "name": "情境理解",
      "strengthText": "情境判断与综合理解较强，适合跨学科与复杂场景分析。",
      "riskText": "情境理解偏弱，复杂场景下的综合判断需要补强。"
    },
    {
      "key": "ability.math",
      "name": "数理能力",
      "strengthText": "数理结构较强，适合理工、量化与模型驱动的专业。",
      "riskText": "数理基础偏弱，理工/量化方向将出现持续压力。"
    },
    {
      "key": "ability.stat",
      "name": "统计能力",
      "strengthText": "统计与概率理解较强，适合数据分析与不确定性判断。",
      "riskText": "统计理解偏弱，数据科学、金融工程等方向学习成本高。"
    },
    {
      "key": "ability.writing",
      "name": "写作能力",
      "strengthText": "写作结构清晰，适合需要论证与表达的专业路径。",
      "riskText": "写作能力偏弱，论述写作要求高的专业会拖慢进展。"
    },
    {
      "key": "ability.comm",
      "name": "沟通能力",
      "strengthText": "沟通与表达能力较好，适合协作密集与对外表达场景。",
      "riskText": "沟通能力偏弱，强协作/强表达场景可能更消耗。"
    },
    {
      "key": "ability.focus",
      "name": "专注力",
      "strengthText": "持续专注能力较强，适合高强度学习与长期项目。",
      "riskText": "专注持续性不足，长周期任务与高强度学习会更痛苦。"
    },
    {
      "key": "ability.memory",
      "name": "记忆力",
      "strengthText": "记忆与信息保持能力较强，适合知识密集型专业。",
      "riskText": "记忆保持偏弱，知识密集型方向（如医学）压力更大。"
    },
    {
      "key": "risk.stability",
      "name": "稳定性偏好",
      "strengthText": "偏好稳定与清晰结构，适合规则明确、路径清晰的专业。",
      "riskText": "对稳定结构偏好低，传统稳定路径可能产生倦怠。"
    },
    {
      "key": "risk.pressure",
      "name": "抗压能力",
      "strengthText": "在压力情境下仍能维持表现，适合高竞争路径。",
      "riskText": "抗压结构偏弱，高竞争路径容易出现波动与倦怠。"
    },
    {
      "key": "value.wealth",
      "name": "收益偏好",
      "strengthText": "对收益回报敏感，适合商业/金融等结果导向路径。",
      "riskText": "对收益回报敏感度低，强收益导向路径可能缺乏驱动。"
    },
    {
      "key": "value.influence",
      "name": "影响力偏好",
      "strengthText": "影响力与话语权驱动较强，适合传播、管理与公共领域。",
      "riskText": "影响力驱动偏弱，强社交影响型路径吸引力有限。"
    },
    {
      "key": "value.responsibility",
      "name": "责任感",
      "strengthText": "责任与利他驱动明显，适合公共服务、教育、医学等路径。",
      "riskText": "责任驱动偏弱，强责任型职业可能更难获得满足感。"
    },
    {
      "key": "value.security",
      "name": "安全感偏好",
      "strengthText": "安全感与确定性需求较强，适合稳定行业与清晰路径。",
      "riskText": "对确定性需求偏低，稳定路径可能不够刺激。"
    }
  ],
  "majors": [
    {
      "name": "计算机科学与技术",
      "category": "工学",
      "courses": "数据结构/算法/系统",
      "careers": "软件工程师/算法工程师",
      "vector": {
        "interest.r": 0.45,
        "interest.i": 0.75,
        "interest.a": 0.45,
        "interest.s": 0.45,
        "interest.e": 0.45,
        "interest.c": 0.6,
        "cognition.data": 0.45,
        "cognition.verbal": 0.45,
        "cognition.abstract": 0.9,
        "cognition.system": 0.85,
        "cognition.spatial": 0.45,
        "cognition.contextual": 0.45,
        "ability.math": 0.85,
        "ability.stat": 0.45,
        "ability.writing": 0.45,
        "ability.comm": 0.45,
        "ability.focus": 0.8,
        "ability.memory": 0.45,
        "risk.stability": 0.45,
        "risk.pressure": 0.7,
        "value.wealth": 0.45,
        "value.influence": 0.45,
        "value.responsibility": 0.45,
        "value.security": 0.45
      },
      "coreDims": []
    },
    {
      "name": "软件工程",
      "category": "工学",
      "courses": "软件工程/数据库/项目实践",
      "careers": "开发工程师/测试/架构",
      "vector": {
        "interest.r": 0.45,
        "interest.i": 0.45,
        "interest.a": 0.45,
        "interest.s": 0.45,
        "interest.e": 0.45,
        "interest.c": 0.75,
        "cognition.data": 0.45,
        "cognition.verbal": 0.45,
        "cognition.abstract": 0.75,
        "cognition.system": 0.85,
        "cognition.spatial": 0.45,
        "cognition.contextual": 0.45,
        "ability.math": 0.75,
        "ability.stat": 0.45,
        "ability.writing": 0.45,
        "ability.comm": 0.65,
        "ability.focus": 0.8,
        "ability.memory": 0.45,
        "risk.stability": 0.45,
        "risk.pressure": 0.45,
        "value.wealth": 0.45,
        "value.influence": 0.45,
        "value.responsibility": 0.45,
        "value.security": 0.45
      },
      "coreDims": []
    },
    {
      "name": "数据科学与大数据技术",
      "category": "工学",
      "courses": "统计/机器学习/数据工程",
      "careers": "数据分析/数据工程",
      "vector": {
        "interest.r": 0.45,
        "interest.i": 0.75,
        "interest.a": 0.45,
        "interest.s": 0.45,
        "interest.e": 0.45,
        "interest.c": 0.45,
        "cognition.data": 0.9,
        "cognition.verbal": 0.45,
        "cognition.abstract": 0.45,
        "cognition.system": 0.75,
        "cognition.spatial": 0.45,
        "cognition.contextual": 0.45,
        "ability.math": 0.8,
        "ability.stat": 0.85,
        "ability.writing": 0.45,
        "ability.comm": 0.45,
        "ability.focus": 0.45,
        "ability.memory": 0.45,
        "risk.stability": 0.45,
        "risk.pressure": 0.65,
        "value.wealth": 0.45,
        "value.influence": 0.45,
        "value.responsibility": 0.45,
        "value.security": 0.45
      },
      "coreDims": []
    },
    {
      "name": "人工智能",
      "category": "工学",
      "courses": "机器学习/数学/算法",
      "careers": "算法/AI工程",
      "vector": {
        "interest.r": 0.45,
        "interest.i": 0.8,
        "interest.a": 0.45,
        "interest.s": 0.45,
        "interest.e": 0.45,
        "interest.c": 0.45,
        "cognition.data": 0.8,
        "cognition.verbal": 0.45,
        "cognition.abstract": 0.9,
        "cognition.system": 0.45,
        "cognition.spatial": 0.45,
        "cognition.contextual": 0.45,
        "ability.math": 0.9,
        "ability.stat": 0.85,
        "ability.writing": 0.45,
        "ability.comm": 0.45,
        "ability.focus": 0.45,
        "ability.memory": 0.45,
        "risk.stability": 0.45,
        "risk.pressure": 0.75,
        "value.wealth": 0.45,
        "value.influence": 0.45,
        "value.responsibility": 0.45,
        "value.security": 0.45
      },
      "coreDims": []
    },
    {
      "name": "网络空间安全",
      "category": "工学",
      "courses": "网络/密码/系统安全",
      "careers": "安全工程/渗透/合规",
      "vector": {
        "interest.r": 0.45,
        "interest.i": 0.45,
        "interest.a": 0.45,
        "interest.s": 0.45,
        "interest.e": 0.45,
        "interest.c": 0.8,
        "cognition.data": 0.65,
        "cognition.verbal": 0.45,
        "cognition.abstract": 0.45,
        "cognition.system": 0.8,
        "cognition.spatial": 0.45,
        "cognition.contextual": 0.45,
        "ability.math": 0.45,
        "ability.stat": 0.45,
        "ability.writing": 0.45,
        "ability.comm": 0.45,
        "ability.focus": 0.75,
        "ability.memory": 0.45,
        "risk.stability": 0.45,
        "risk.pressure": 0.75,
        "value.wealth": 0.45,
        "value.influence": 0.45,
        "value.responsibility": 0.45,
        "value.security": 0.7
      },
      "coreDims": []
    },
    {
      "name": "电子信息工程",
      "category": "工学",
      "courses": "电路/信号/嵌入式",
      "careers": "硬件/嵌入式/通信",
      "vector": {
        "interest.r": 0.8,
        "interest.i": 0.45,
        "interest.a": 0.45,
        "interest.s": 0.45,
        "interest.e": 0.45,
        "interest.c": 0.45,
        "cognition.data": 0.45,
        "cognition.verbal": 0.45,
        "cognition.abstract": 0.8,
        "cognition.system": 0.8,
        "cognition.spatial": 0.45,
        "cognition.contextual": 0.45,
        "ability.math": 0.75,
        "ability.stat": 0.45,
        "ability.writing": 0.45,
        "ability.comm": 0.45,
        "ability.focus": 0.75,
        "ability.memory": 0.45,
        "risk.stability": 0.45,
        "risk.pressure": 0.6,
        "value.wealth": 0.45,
        "value.influence": 0.45,
        "value.responsibility": 0.45,
        "value.security": 0.45
      },
      "coreDims": []
    },
    {
      "name": "电气工程及其自动化",
      "category": "工学",
      "courses": "电机/电力系统/控制",
      "careers": "电力/自动化/新能源",
      "vector": {
        "interest.r": 0.75,
        "interest.i": 0.45,
        "interest.a": 0.45,
        "interest.s": 0.45,
        "interest.e": 0.45,
        "interest.c": 0.65,
        "cognition.data": 0.45,
        "cognition.verbal": 0.45,
        "cognition.abstract": 0.45,
        "cognition.system": 0.8,
        "cognition.spatial": 0.45,
        "cognition.contextual": 0.45,
        "ability.math": 0.7,
        "ability.stat": 0.45,
        "ability.writing": 0.45,
        "ability.comm": 0.45,
        "ability.focus": 0.75,
        "ability.memory": 0.45,
        "risk.stability": 0.65,
        "risk.pressure": 0.45,
        "value.wealth": 0.45,
        "value.influence": 0.45,
        "value.responsibility": 0.45,
        "value.security": 0.45
      },
      "coreDims": []
    },
    {
      "name": "自动化",
      "category": "工学",
      "courses": "控制/系统/嵌入式",
      "careers": "控制/机器人/工业自动化",
      "vector": {
        "interest.r": 0.7,
        "interest.i": 0.45,
        "interest.a": 0.45,
        "interest.s": 0.45,
        "interest.e": 0.45,
        "interest.c": 0.45,
        "cognition.data": 0.45,
        "cognition.verbal": 0.45,
        "cognition.abstract": 0.45,
        "cognition.system": 0.85,
        "cognition.spatial": 0.45,
        "cognition.contextual": 0.45,
        "ability.math": 0.7,
        "ability.stat": 0.45,
        "ability.writing": 0.45,
        "ability.comm": 0.45,
        "ability.focus": 0.8,
        "ability.memory": 0.45,
        "risk.stability": 0.45,
        "risk.pressure": 0.6,
        "value.wealth": 0.45,
        "value.influence": 0.45,
        "value.responsibility": 0.45,
        "value.security": 0.45
      },
      "coreDims": []
    },
    {
      "name": "通信工程",
      "category": "工学",
      "courses": "信号/通信原理/网络",
      "careers": "通信/网络/运营商",
      "vector": {
        "interest.r": 0.65,
        "interest.i": 0.45,
        "interest.a": 0.45,
        "interest.s": 0.45,
        "interest.e": 0.45,
        "interest.c": 0.45,
        "cognition.data": 0.7,
        "cognition.verbal": 0.45,
        "cognition.abstract": 0.8,
        "cognition.system": 0.75,
        "cognition.spatial": 0.45,
        "cognition.contextual": 0.45,
        "ability.math": 0.75,
        "ability.stat": 0.45,
        "ability.writing": 0.45,
        "ability.comm": 0.45,
        "ability.focus": 0.45,
        "ability.memory": 0.45,
        "risk.stability": 0.45,
        "risk.pressure": 0.45,
        "value.wealth": 0.45,
        "value.influence": 0.45,
        "value.responsibility": 0.45,
        "value.security": 0.45
      },
      "coreDims": []
    },
    {
      "name": "机械设计制造及其自动化",
      "category": "工学",
      "courses": "机械/制造/设计",
      "careers": "机械/制造/设备",
      "vector": {
        "interest.r": 0.85,
        "interest.i": 0.45,
        "interest.a": 0.45,
        "interest.s": 0.45,
        "interest.e": 0.45,
        "interest.c": 0.45,
        "cognition.data": 0.45,
        "cognition.verbal": 0.45,
        "cognition.abstract": 0.45,
        "cognition.system": 0.7,
        "cognition.spatial": 0.8,
        "cognition.contextual": 0.45,
        "ability.math": 0.45,
        "ability.stat": 0.45,
        "ability.writing": 0.45,
        "ability.comm": 0.45,
        "ability.focus": 0.75,
        "ability.memory": 0.45,
        "risk.stability": 0.65,
        "risk.pressure": 0.45,
        "value.wealth": 0.45,
        "value.influence": 0.45,
        "value.responsibility": 0.45,
        "value.security": 0.45
      },
      "coreDims": []
    },
    {
      "name": "工业工程",
      "category": "工学",
      "courses": "运筹/流程/系统优化",
      "careers": "运营优化/供应链",
      "vector": {
        "interest.r": 0.45,
        "interest.i": 0.45,
        "interest.a": 0.45,
        "interest.s": 0.45,
        "interest.e": 0.45,
        "interest.c": 0.75,
        "cognition.data": 0.75,
        "cognition.verbal": 0.45,
        "cognition.abstract": 0.45,
        "cognition.system": 0.8,
        "cognition.spatial": 0.45,
        "cognition.contextual": 0.45,
        "ability.math": 0.45,
        "ability.stat": 0.75,
        "ability.writing": 0.45,
        "ability.comm": 0.45,
        "ability.focus": 0.45,
        "ability.memory": 0.45,
        "risk.stability": 0.45,
        "risk.pressure": 0.45,
        "value.wealth": 0.6,
        "value.influence": 0.45,
        "value.responsibility": 0.45,
        "value.security": 0.45
      },
      "coreDims": []
    },
    {
      "name": "土木工程",
      "category": "工学",
      "courses": "结构/施工/工程管理",
      "careers": "工程/施工/项目管理",
      "vector": {
        "interest.r": 0.45,
        "interest.i": 0.45,
        "interest.a": 0.45,
        "interest.s": 0.45,
        "interest.e": 0.45,
        "interest.c": 0.75,
        "cognition.data": 0.45,
        "cognition.verbal": 0.45,
        "cognition.abstract": 0.45,
        "cognition.system": 0.45,
        "cognition.spatial": 0.7,
        "cognition.contextual": 0.45,
        "ability.math": 0.45,
        "ability.stat": 0.45,
        "ability.writing": 0.45,
        "ability.comm": 0.45,
        "ability.focus": 0.8,
        "ability.memory": 0.45,
        "risk.stability": 0.8,
        "risk.pressure": 0.45,
        "value.wealth": 0.45,
        "value.influence": 0.45,
        "value.responsibility": 0.45,
        "value.security": 0.65
      },
      "coreDims": []
    },
    {
      "name": "建筑学",
      "category": "工学",
      "courses": "建筑设计/空间/表达",
      "careers": "建筑设计/城市设计",
      "vector": {
        "interest.r": 0.65,
        "interest.i": 0.45,
        "interest.a": 0.85,
        "interest.s": 0.45,
        "interest.e": 0.45,
        "interest.c": 0.45,
        "cognition.data": 0.45,
        "cognition.verbal": 0.45,
        "cognition.abstract": 0.45,
        "cognition.system": 0.45,
        "cognition.spatial": 0.85,
        "cognition.contextual": 0.7,
        "ability.math": 0.45,
        "ability.stat": 0.45,
        "ability.writing": 0.45,
        "ability.comm": 0.45,
        "ability.focus": 0.7,
        "ability.memory": 0.45,
        "risk.stability": 0.45,
        "risk.pressure": 0.45,
        "value.wealth": 0.45,
        "value.influence": 0.6,
        "value.responsibility": 0.45,
        "value.security": 0.45
      },
      "coreDims": []
    },
    {
      "name": "工业设计",
      "category": "工学",
      "courses": "设计/用户/产品",
      "careers": "产品设计/交互/工业设计",
      "vector": {
        "interest.r": 0.45,
        "interest.i": 0.45,
        "interest.a": 0.85,
        "interest.s": 0.45,
        "interest.e": 0.45,
        "interest.c": 0.45,
        "cognition.data": 0.45,
        "cognition.verbal": 0.45,
        "cognition.abstract": 0.45,
        "cognition.system": 0.45,
        "cognition.spatial": 0.8,
        "cognition.contextual": 0.7,
        "ability.math": 0.45,
        "ability.stat": 0.45,
        "ability.writing": 0.45,
        "ability.comm": 0.7,
        "ability.focus": 0.45,
        "ability.memory": 0.45,
        "risk.stability": 0.45,
        "risk.pressure": 0.45,
        "value.wealth": 0.45,
        "value.influence": 0.65,
        "value.responsibility": 0.45,
        "value.security": 0.45
      },
      "coreDims": []
    },
    {
      "name": "经济学",
      "category": "经济学",
      "courses": "微宏观/数据/政策",
      "careers": "研究/咨询/分析",
      "vector": {
        "interest.r": 0.45,
        "interest.i": 0.65,
        "interest.a": 0.45,
        "interest.s": 0.45,
        "interest.e": 0.45,
        "interest.c": 0.45,
        "cognition.data": 0.75,
        "cognition.verbal": 0.45,
        "cognition.abstract": 0.75,
        "cognition.system": 0.45,
        "cognition.spatial": 0.45,
        "cognition.contextual": 0.45,
        "ability.math": 0.45,
        "ability.stat": 0.7,
        "ability.writing": 0.65,
        "ability.comm": 0.45,
        "ability.focus": 0.45,
        "ability.memory": 0.45,
        "risk.stability": 0.45,
        "risk.pressure": 0.45,
        "value.wealth": 0.45,
        "value.influence": 0.45,
        "value.responsibility": 0.45,
        "value.security": 0.45
      },
      "coreDims": []
    },
    {
      "name": "金融学",
      "category": "经济学",
      "courses": "金融市场/投资/风险",
      "careers": "银行/券商/投研",
      "vector": {
        "interest.r": 0.45,
        "interest.i": 0.45,
        "interest.a": 0.45,
        "interest.s": 0.45,
        "interest.e": 0.75,
        "interest.c": 0.45,
        "cognition.data": 0.65,
        "cognition.verbal": 0.45,
        "cognition.abstract": 0.45,
        "cognition.system": 0.45,
        "cognition.spatial": 0.45,
        "cognition.contextual": 0.45,
        "ability.math": 0.45,
        "ability.stat": 0.65,
        "ability.writing": 0.45,
        "ability.comm": 0.45,
        "ability.focus": 0.45,
        "ability.memory": 0.45,
        "risk.stability": 0.45,
        "risk.pressure": 0.75,
        "value.wealth": 0.85,
        "value.influence": 0.45,
        "value.responsibility": 0.45,
        "value.security": 0.45
      },
      "coreDims": []
    },
    {
      "name": "会计学",
      "category": "管理学",
      "courses": "会计/审计/税务",
      "careers": "会计/财务/审计",
      "vector": {
        "interest.r": 0.45,
        "interest.i": 0.45,
        "interest.a": 0.45,
        "interest.s": 0.45,
        "interest.e": 0.45,
        "interest.c": 0.85,
        "cognition.data": 0.7,
        "cognition.verbal": 0.45,
        "cognition.abstract": 0.45,
        "cognition.system": 0.45,
        "cognition.spatial": 0.45,
        "cognition.contextual": 0.45,
        "ability.math": 0.45,
        "ability.stat": 0.45,
        "ability.writing": 0.45,
        "ability.comm": 0.45,
        "ability.focus": 0.8,
        "ability.memory": 0.45,
        "risk.stability": 0.85,
        "risk.pressure": 0.45,
        "value.wealth": 0.45,
        "value.influence": 0.45,
        "value.responsibility": 0.45,
        "value.security": 0.7
      },
      "coreDims": []
    },
    {
      "name": "审计学",
      "category": "管理学",
      "courses": "审计/风控/规范",
      "careers": "审计/风控/合规",
      "vector": {
        "interest.r": 0.45,
        "interest.i": 0.45,
        "interest.a": 0.45,
        "interest.s": 0.45,
        "interest.e": 0.45,
        "interest.c": 0.85,
        "cognition.data": 0.45,
        "cognition.verbal": 0.45,
        "cognition.abstract": 0.45,
        "cognition.system": 0.45,
        "cognition.spatial": 0.45,
        "cognition.contextual": 0.45,
        "ability.math": 0.45,
        "ability.stat": 0.45,
        "ability.writing": 0.45,
        "ability.comm": 0.45,
        "ability.focus": 0.8,
        "ability.memory": 0.45,
        "risk.stability": 0.8,
        "risk.pressure": 0.6,
        "value.wealth": 0.45,
        "value.influence": 0.45,
        "value.responsibility": 0.65,
        "value.security": 0.45
      },
      "coreDims": []
    },
    {
      "name": "财务管理",
      "category": "管理学",
      "courses": "公司金融/财务",
      "careers": "财务/投融资",
      "vector": {
        "interest.r": 0.45,
        "interest.i": 0.45,
        "interest.a": 0.45,
        "interest.s": 0.45,
        "interest.e": 0.7,
        "interest.c": 0.7,
        "cognition.data": 0.7,
        "cognition.verbal": 0.45,
        "cognition.abstract": 0.45,
        "cognition.system": 0.45,
        "cognition.spatial": 0.45,
        "cognition.contextual": 0.45,
        "ability.math": 0.45,
        "ability.stat": 0.45,
        "ability.writing": 0.45,
        "ability.comm": 0.45,
        "ability.focus": 0.45,
        "ability.memory": 0.45,
        "risk.stability": 0.45,
        "risk.pressure": 0.65,
        "value.wealth": 0.75,
        "value.influence": 0.45,
        "value.responsibility": 0.45,
        "value.security": 0.45
      },
      "coreDims": []
    },
    {
      "name": "市场营销",
      "category": "管理学",
      "courses": "营销/消费者/传播",
      "careers": "营销/品牌/增长",
      "vector": {
        "interest.r": 0.45,
        "interest.i": 0.45,
        "interest.a": 0.45,
        "interest.s": 0.75,
        "interest.e": 0.85,
        "interest.c": 0.45,
        "cognition.data": 0.45,
        "cognition.verbal": 0.45,
        "cognition.abstract": 0.45,
        "cognition.system": 0.45,
        "cognition.spatial": 0.45,
        "cognition.contextual": 0.65,
        "ability.math": 0.45,
        "ability.stat": 0.45,
        "ability.writing": 0.45,
        "ability.comm": 0.85,
        "ability.focus": 0.45,
        "ability.memory": 0.45,
        "risk.stability": 0.45,
        "risk.pressure": 0.45,
        "value.wealth": 0.45,
        "value.influence": 0.75,
        "value.responsibility": 0.45,
        "value.security": 0.45
      },
      "coreDims": []
    },
    {
      "name": "人力资源管理",
      "category": "管理学",
      "courses": "组织/沟通/制度",
      "careers": "HR/组织发展",
      "vector": {
        "interest.r": 0.45,
        "interest.i": 0.45,
        "interest.a": 0.45,
        "interest.s": 0.8,
        "interest.e": 0.45,
        "interest.c": 0.45,
        "cognition.data": 0.45,
        "cognition.verbal": 0.45,
        "cognition.abstract": 0.45,
        "cognition.system": 0.45,
        "cognition.spatial": 0.45,
        "cognition.contextual": 0.65,
        "ability.math": 0.45,
        "ability.stat": 0.45,
        "ability.writing": 0.45,
        "ability.comm": 0.75,
        "ability.focus": 0.45,
        "ability.memory": 0.45,
        "risk.stability": 0.7,
        "risk.pressure": 0.45,
        "value.wealth": 0.45,
        "value.influence": 0.45,
        "value.responsibility": 0.7,
        "value.security": 0.45
      },
      "coreDims": []
    },
    {
      "name": "法学",
      "category": "法学",
      "courses": "法理/案例/写作",
      "careers": "律师/法务/公检法",
      "vector": {
        "interest.r": 0.45,
        "interest.i": 0.45,
        "interest.a": 0.45,
        "interest.s": 0.45,
        "interest.e": 0.45,
        "interest.c": 0.65,
        "cognition.data": 0.45,
        "cognition.verbal": 0.85,
        "cognition.abstract": 0.45,
        "cognition.system": 0.45,
        "cognition.spatial": 0.45,
        "cognition.contextual": 0.45,
        "ability.math": 0.45,
        "ability.stat": 0.45,
        "ability.writing": 0.8,
        "ability.comm": 0.45,
        "ability.focus": 0.45,
        "ability.memory": 0.45,
        "risk.stability": 0.45,
        "risk.pressure": 0.65,
        "value.wealth": 0.45,
        "value.influence": 0.45,
        "value.responsibility": 0.75,
        "value.security": 0.45
      },
      "coreDims": []
    },
    {
      "name": "公共管理",
      "category": "管理学",
      "courses": "公共政策/治理/组织",
      "careers": "政府/公共机构/咨询",
      "vector": {
        "interest.r": 0.45,
        "interest.i": 0.45,
        "interest.a": 0.45,
        "interest.s": 0.7,
        "interest.e": 0.45,
        "interest.c": 0.45,
        "cognition.data": 0.45,
        "cognition.verbal": 0.45,
        "cognition.abstract": 0.45,
        "cognition.system": 0.45,
        "cognition.spatial": 0.45,
        "cognition.contextual": 0.8,
        "ability.math": 0.45,
        "ability.stat": 0.45,
        "ability.writing": 0.7,
        "ability.comm": 0.45,
        "ability.focus": 0.45,
        "ability.memory": 0.45,
        "risk.stability": 0.7,
        "risk.pressure": 0.45,
        "value.wealth": 0.45,
        "value.influence": 0.45,
        "value.responsibility": 0.8,
        "value.security": 0.45
      },
      "coreDims": []
    },
    {
      "name": "国际关系",
      "category": "法学",
      "courses": "国际议题/沟通/分析",
      "careers": "国际组织/研究/公关",
      "vector": {
        "interest.r": 0.45,
        "interest.i": 0.45,
        "interest.a": 0.45,
        "interest.s": 0.75,
        "interest.e": 0.45,
        "interest.c": 0.45,
        "cognition.data": 0.45,
        "cognition.verbal": 0.7,
        "cognition.abstract": 0.45,
        "cognition.system": 0.45,
        "cognition.spatial": 0.45,
        "cognition.contextual": 0.8,
        "ability.math": 0.45,
        "ability.stat": 0.45,
        "ability.writing": 0.45,
        "ability.comm": 0.7,
        "ability.focus": 0.45,
        "ability.memory": 0.45,
        "risk.stability": 0.45,
        "risk.pressure": 0.45,
        "value.wealth": 0.45,
        "value.influence": 0.65,
        "value.responsibility": 0.45,
        "value.security": 0.45
      },
      "coreDims": []
    },
    {
      "name": "心理学",
      "category": "教育学",
      "courses": "心理/研究/沟通",
      "careers": "心理/咨询/人力",
      "vector": {
        "interest.r": 0.45,
        "interest.i": 0.7,
        "interest.a": 0.45,
        "interest.s": 0.85,
        "interest.e": 0.45,
        "interest.c": 0.45,
        "cognition.data": 0.45,
        "cognition.verbal": 0.45,
        "cognition.abstract": 0.45,
        "cognition.system": 0.45,
        "cognition.spatial": 0.45,
        "cognition.contextual": 0.8,
        "ability.math": 0.45,
        "ability.stat": 0.45,
        "ability.writing": 0.45,
        "ability.comm": 0.75,
        "ability.focus": 0.45,
        "ability.memory": 0.45,
        "risk.stability": 0.45,
        "risk.pressure": 0.45,
        "value.wealth": 0.45,
        "value.influence": 0.45,
        "value.responsibility": 0.7,
        "value.security": 0.45
      },
      "coreDims": []
    },
    {
      "name": "教育学",
      "category": "教育学",
      "courses": "教育心理/教学/组织",
      "careers": "教师/教育机构/教研",
      "vector": {
        "interest.r": 0.45,
        "interest.i": 0.45,
        "interest.a": 0.45,
        "interest.s": 0.85,
        "interest.e": 0.45,
        "interest.c": 0.45,
        "cognition.data": 0.45,
        "cognition.verbal": 0.45,
        "cognition.abstract": 0.45,
        "cognition.system": 0.45,
        "cognition.spatial": 0.45,
        "cognition.contextual": 0.45,
        "ability.math": 0.45,
        "ability.stat": 0.45,
        "ability.writing": 0.7,
        "ability.comm": 0.75,
        "ability.focus": 0.45,
        "ability.memory": 0.45,
        "risk.stability": 0.75,
        "risk.pressure": 0.45,
        "value.wealth": 0.45,
        "value.influence": 0.45,
        "value.responsibility": 0.85,
        "value.security": 0.45
      },
      "coreDims": []
    },
    {
      "name": "新闻学",
      "category": "文学",
      "courses": "采访/写作/传播",
      "careers": "媒体/内容/公关",
      "vector": {
        "interest.r": 0.45,
        "interest.i": 0.45,
        "interest.a": 0.65,
        "interest.s": 0.45,
        "interest.e": 0.45,
        "interest.c": 0.45,
        "cognition.data": 0.45,
        "cognition.verbal": 0.85,
        "cognition.abstract": 0.45,
        "cognition.system": 0.45,
        "cognition.spatial": 0.45,
        "cognition.contextual": 0.45,
        "ability.math": 0.45,
        "ability.stat": 0.45,
        "ability.writing": 0.85,
        "ability.comm": 0.75,
        "ability.focus": 0.45,
        "ability.memory": 0.45,
        "risk.stability": 0.45,
        "risk.pressure": 0.45,
        "value.wealth": 0.45,
        "value.influence": 0.7,
        "value.responsibility": 0.45,
        "value.security": 0.45
      },
      "coreDims": []
    },
    {
      "name": "传播学",
      "category": "文学",
      "courses": "传播/内容/策略",
      "careers": "品牌/新媒体/公关",
      "vector": {
        "interest.r": 0.45,
        "interest.i": 0.45,
        "interest.a": 0.75,
        "interest.s": 0.45,
        "interest.e": 0.65,
        "interest.c": 0.45,
        "cognition.data": 0.45,
        "cognition.verbal": 0.45,
        "cognition.abstract": 0.45,
        "cognition.system": 0.45,
        "cognition.spatial": 0.45,
        "cognition.contextual": 0.65,
        "ability.math": 0.45,
        "ability.stat": 0.45,
        "ability.writing": 0.45,
        "ability.comm": 0.85,
        "ability.focus": 0.45,
        "ability.memory": 0.45,
        "risk.stability": 0.45,
        "risk.pressure": 0.45,
        "value.wealth": 0.45,
        "value.influence": 0.8,
        "value.responsibility": 0.45,
        "value.security": 0.45
      },
      "coreDims": []
    },
    {
      "name": "临床医学",
      "category": "医学",
      "courses": "医学基础/临床",
      "careers": "医生/临床/科研",
      "vector": {
        "interest.r": 0.45,
        "interest.i": 0.45,
        "interest.a": 0.45,
        "interest.s": 0.45,
        "interest.e": 0.45,
        "interest.c": 0.45,
        "cognition.data": 0.45,
        "cognition.verbal": 0.45,
        "cognition.abstract": 0.45,
        "cognition.system": 0.45,
        "cognition.spatial": 0.45,
        "cognition.contextual": 0.45,
        "ability.math": 0.45,
        "ability.stat": 0.45,
        "ability.writing": 0.45,
        "ability.comm": 0.45,
        "ability.focus": 0.85,
        "ability.memory": 0.9,
        "risk.stability": 0.75,
        "risk.pressure": 0.8,
        "value.wealth": 0.45,
        "value.influence": 0.45,
        "value.responsibility": 0.9,
        "value.security": 0.45
      },
      "coreDims": []
    },
    {
      "name": "生物科学",
      "category": "理学",
      "courses": "生物/实验/研究",
      "careers": "科研/药企/检验",
      "vector": {
        "interest.r": 0.65,
        "interest.i": 0.8,
        "interest.a": 0.45,
        "interest.s": 0.45,
        "interest.e": 0.45,
        "interest.c": 0.45,
        "cognition.data": 0.7,
        "cognition.verbal": 0.45,
        "cognition.abstract": 0.45,
        "cognition.system": 0.45,
        "cognition.spatial": 0.45,
        "cognition.contextual": 0.45,
        "ability.math": 0.45,
        "ability.stat": 0.45,
        "ability.writing": 0.45,
        "ability.comm": 0.45,
        "ability.focus": 0.7,
        "ability.memory": 0.75,
        "risk.stability": 0.45,
        "risk.pressure": 0.45,
        "value.wealth": 0.45,
        "value.influence": 0.45,
        "value.responsibility": 0.45,
        "value.security": 0.45
      },
      "coreDims": []
    }
  ],
  "actions": [
    {
      "category": "工学",
      "focus": "强化数学与系统能力；尽早做项目（编程/电路/机械）验证学习适配；训练长期专注。",
      "validation": "每月完成一个小项目；参加校内科创/编程/机器人活动；记录投入感与压力感。"
    },
    {
      "category": "理学",
      "focus": "强化基础学科与研究方法；训练实验/数据分析；建立阅读与笔记体系。",
      "validation": "每两周完成一次文献/实验小复盘；参与科研社团/实验室开放日。"
    },
    {
      "category": "经济学",
      "focus": "强化数据与逻辑；训练阅读理解与模型思维；关注宏观与政策语境。",
      "validation": "每月做一次数据分析小报告；跟踪一个经济议题并写结构化总结。"
    },
    {
      "category": "管理学",
      "focus": "强化沟通表达与结构化思考；训练案例分析；提升执行与复盘能力。",
      "validation": "每月做一次案例拆解；在社团/项目中担任角色并复盘。"
    },
    {
      "category": "法学",
      "focus": "强化阅读、写作与论证；训练规则结构与案例分析；提升表达稳定性。",
      "validation": "每两周写一篇结构化短评；做案例要点提炼与观点论证。"
    },
    {
      "category": "教育学",
      "focus": "强化沟通与同理；训练组织与表达；建立持续投入与耐心。",
      "validation": "参与支教/助教/社团带教；记录反馈与改进。"
    },
    {
      "category": "文学",
      "focus": "强化写作与表达；提升阅读深度与结构化输出；建立素材积累。",
      "validation": "每周完成一次结构化写作；做阅读笔记与观点提炼。"
    },
    {
      "category": "医学",
      "focus": "强化记忆与专注；建立长期耐力；提高抗压与稳定节奏。",
      "validation": "用阶段性计划训练记忆与复盘；跟随科普/课程做长期学习记录。"
    }
  ]
};

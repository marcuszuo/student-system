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
          "text": "先看例题或步骤，再按方法练习",
          "dim": "cognition.system"
        },
        {
          "key": "C",
          "text": "先理解应用场景，再进入学习",
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
          "text": "结合案例说明",
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
          "text": "通过练习归纳规律",
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
      "text": "你在理科或数理题上的表现更接近：",
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
      "text": "你在文科或写作任务中的表现更接近：",
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
          "text": "先讨论清楚再写",
          "dim": "ability.comm"
        }
      ]
    },
    {
      "id": "A09",
      "module": "A",
      "text": "你做笔记时更接近：",
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
          "text": "找到兴趣切入点后投入度明显提升",
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
      "text": "当一门课程暂时提不起兴趣，但又必须学下去时，你更常见的做法是：",
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
          "text": "依赖老师或同学的带动",
          "dim": "ability.comm"
        }
      ]
    },
    {
      "id": "A14",
      "module": "A",
      "text": "你对大量针对性练习的态度更接近：",
      "options": [
        {
          "key": "A",
          "text": "必须先懂再刷",
          "dim": "cognition.abstract"
        },
        {
          "key": "B",
          "text": "大量练习本身最有效",
          "dim": "ability.focus"
        },
        {
          "key": "C",
          "text": "练习过程需要保持兴趣感",
          "dim": "cognition.contextual"
        },
        {
          "key": "D",
          "text": "练习过程更适合有人陪伴或反馈",
          "dim": "ability.comm"
        }
      ]
    },
    {
      "id": "A15",
      "module": "A",
      "text": "接到一个需要一周内完成的综合作业时，你通常会先做什么：",
      "options": [
        {
          "key": "A",
          "text": "先想清楚核心模型和判断框架",
          "dim": "cognition.abstract"
        },
        {
          "key": "B",
          "text": "先拆解任务、排出执行顺序",
          "dim": "cognition.system"
        },
        {
          "key": "C",
          "text": "先想怎样呈现会更有吸引力",
          "dim": "cognition.spatial"
        },
        {
          "key": "D",
          "text": "先和相关同学或老师确认要求",
          "dim": "ability.comm"
        }
      ]
    },
    {
      "id": "A16",
      "module": "A",
      "text": "面对一个同时涉及多门学科的任务时，你更可能：",
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
          "text": "理解透彻后的成就感",
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
          "text": "练习速度与准确率",
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
      "text": "总体来看，你的学习风格更接近：",
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
          "text": "希望理解原理",
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
          "text": "新鲜感与体验感",
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
          "dim": "interest.i"
        },
        {
          "key": "B",
          "text": "坚持到目标节点",
          "dim": "interest.c"
        },
        {
          "key": "C",
          "text": "开始动摇",
          "dim": "risk.stability"
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
          "dim": "interest.i"
        },
        {
          "key": "B",
          "text": "为了结果忍耐",
          "dim": "interest.e"
        },
        {
          "key": "C",
          "text": "动力明显下降",
          "dim": "risk.stability"
        },
        {
          "key": "D",
          "text": "很快厌倦",
          "dim": "interest.a"
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
          "dim": "interest.i"
        },
        {
          "key": "B",
          "text": "看目标是否清晰",
          "dim": "interest.e"
        },
        {
          "key": "C",
          "text": "会动摇",
          "dim": "interest.s"
        },
        {
          "key": "D",
          "text": "可能换方向",
          "dim": "risk.stability"
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
          "dim": "interest.i"
        },
        {
          "key": "B",
          "text": "规则太多压力大",
          "dim": "interest.c"
        },
        {
          "key": "C",
          "text": "看不到意义",
          "dim": "interest.s"
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
          "dim": "interest.i"
        },
        {
          "key": "B",
          "text": "标准清楚就行",
          "dim": "interest.c"
        },
        {
          "key": "C",
          "text": "会焦虑",
          "dim": "value.security"
        },
        {
          "key": "D",
          "text": "较难长期坚持",
          "dim": "interest.e"
        }
      ]
    },
    {
      "id": "B08",
      "module": "B",
      "text": "你的兴趣状态更接近：",
      "options": [
        {
          "key": "A",
          "text": "慢热稳定",
          "dim": "risk.stability"
        },
        {
          "key": "B",
          "text": "目标驱动稳定",
          "dim": "interest.e"
        },
        {
          "key": "C",
          "text": "情绪/意义驱动",
          "dim": "interest.s"
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
          "dim": "interest.i"
        },
        {
          "key": "B",
          "text": "拿到证书/成绩",
          "dim": "interest.e"
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
      "text": "当原本喜欢的方向被要求按周持续交付时，你的状态更接近：",
      "options": [
        {
          "key": "A",
          "text": "只要值得研究，仍愿意持续投入",
          "dim": "interest.i"
        },
        {
          "key": "B",
          "text": "只要目标明确，会为了结果继续",
          "dim": "interest.e"
        },
        {
          "key": "C",
          "text": "一旦变成固定任务，投入感会明显下降",
          "dim": "interest.a"
        },
        {
          "key": "D",
          "text": "如果长时间看不到变化，容易中途退出",
          "dim": "risk.stability"
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
          "dim": "interest.i"
        },
        {
          "key": "B",
          "text": "目标变不清晰",
          "dim": "interest.e"
        },
        {
          "key": "C",
          "text": "意义感下降",
          "dim": "interest.s"
        },
        {
          "key": "D",
          "text": "出现更有吸引力的事务",
          "dim": "interest.a"
        }
      ]
    },
    {
      "id": "B12",
      "module": "B",
      "text": "如果一个方向需要半年以上才能看出成果，你更能接受的推进节奏是：",
      "options": [
        {
          "key": "A",
          "text": "慢但扎实",
          "dim": "risk.stability"
        },
        {
          "key": "B",
          "text": "阶段性里程碑",
          "dim": "interest.c"
        },
        {
          "key": "C",
          "text": "需要持续正反馈",
          "dim": "interest.s"
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
          "dim": "risk.stability"
        },
        {
          "key": "D",
          "text": "较难长期坚持",
          "dim": "interest.a"
        }
      ]
    },
    {
      "id": "B14",
      "module": "B",
      "text": "面对竞争明显的环境时，你更真实的反应是：",
      "options": [
        {
          "key": "A",
          "text": "更想比理解深度",
          "dim": "interest.i"
        },
        {
          "key": "B",
          "text": "更想比结果/排名",
          "dim": "interest.e"
        },
        {
          "key": "C",
          "text": "竞争会影响情绪",
          "dim": "value.security"
        },
        {
          "key": "D",
          "text": "更倾向调整到压力较低的方向",
          "dim": "risk.stability"
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
          "dim": "interest.i"
        },
        {
          "key": "B",
          "text": "能拿到好结果",
          "dim": "interest.e"
        },
        {
          "key": "C",
          "text": "这件事的意义",
          "dim": "interest.s"
        },
        {
          "key": "D",
          "text": "过程是否具有吸引力",
          "dim": "interest.a"
        }
      ]
    },
    {
      "id": "B16",
      "module": "B",
      "text": "如果喜欢的方向短期内不一定带来更好成绩，你通常会：",
      "options": [
        {
          "key": "A",
          "text": "先保理解和长线",
          "dim": "interest.i"
        },
        {
          "key": "B",
          "text": "先保成绩结果",
          "dim": "interest.e"
        },
        {
          "key": "C",
          "text": "看意义再决定",
          "dim": "interest.s"
        },
        {
          "key": "D",
          "text": "更看重当前主观感受",
          "dim": "interest.a"
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
      "text": "你最容易长期投入的学习或工作节奏是：",
      "options": [
        {
          "key": "A",
          "text": "深入长期",
          "dim": "interest.i"
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
          "dim": "interest.a"
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
          "dim": "interest.i"
        },
        {
          "key": "B",
          "text": "可接受",
          "dim": "risk.stability"
        },
        {
          "key": "C",
          "text": "不安",
          "dim": "value.security"
        },
        {
          "key": "D",
          "text": "不适应",
          "dim": "interest.e"
        }
      ]
    },
    {
      "id": "B20",
      "module": "B",
      "text": "如果必须连续投入三个月，你更容易被哪类目标持续驱动：",
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
          "dim": "interest.e"
        },
        {
          "key": "C",
          "text": "情绪起伏较明显",
          "dim": "value.security"
        },
        {
          "key": "D",
          "text": "转移注意力",
          "dim": "interest.a"
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
          "text": "学习越深入，投入感越强",
          "dim": "interest.i"
        },
        {
          "key": "B",
          "text": "越做越稳定",
          "dim": "risk.stability"
        },
        {
          "key": "C",
          "text": "投入状态波动较大",
          "dim": "interest.s"
        },
        {
          "key": "D",
          "text": "短期投入后难以持续",
          "dim": "interest.a"
        }
      ]
    },
    {
      "id": "B23",
      "module": "B",
      "text": "对于需要持续重复训练的任务，你的接受度更接近：",
      "options": [
        {
          "key": "A",
          "text": "高",
          "dim": "interest.r"
        },
        {
          "key": "B",
          "text": "中",
          "dim": "interest.c"
        },
        {
          "key": "C",
          "text": "低",
          "dim": "interest.e"
        },
        {
          "key": "D",
          "text": "很低",
          "dim": "interest.a"
        }
      ]
    },
    {
      "id": "B24",
      "module": "B",
      "text": "如果做完一项长期投入的任务，你最希望看到的成果形态是：",
      "options": [
        {
          "key": "A",
          "text": "理解/模型",
          "dim": "interest.i"
        },
        {
          "key": "B",
          "text": "证书/分数",
          "dim": "interest.e"
        },
        {
          "key": "C",
          "text": "影响/反馈",
          "dim": "interest.s"
        },
        {
          "key": "D",
          "text": "作品/呈现",
          "dim": "interest.a"
        }
      ]
    },
    {
      "id": "B25",
      "module": "B",
      "text": "总体来看，你的兴趣驱动更接近：",
      "options": [
        {
          "key": "A",
          "text": "内在驱动",
          "dim": "interest.i"
        },
        {
          "key": "B",
          "text": "结果驱动",
          "dim": "interest.e"
        },
        {
          "key": "C",
          "text": "意义驱动",
          "dim": "interest.s"
        },
        {
          "key": "D",
          "text": "刺激驱动",
          "dim": "interest.a"
        }
      ]
    },
    {
      "id": "B26",
      "module": "B",
      "text": "如果一项课题要连续打磨整个学期，你更容易因为什么持续投入：",
      "tags": ["scenario", "boundary-generic"],
      "options": [
        {
          "key": "A",
          "text": "可以把核心原理研究得更透",
          "dim": "interest.i"
        },
        {
          "key": "B",
          "text": "最终能做出明确可交付成果",
          "dim": "interest.e"
        },
        {
          "key": "C",
          "text": "它确实能帮助具体的人或组织",
          "dim": "interest.s"
        },
        {
          "key": "D",
          "text": "每个阶段都能尝试新的玩法或表达",
          "dim": "interest.a"
        }
      ]
    },
    {
      "id": "B27",
      "module": "B",
      "text": "面对一份周期较长的任务清单，你更自然的投入方式是：",
      "tags": ["scenario", "boundary-generic"],
      "options": [
        {
          "key": "A",
          "text": "先抓最值得深入研究的问题",
          "dim": "interest.i"
        },
        {
          "key": "B",
          "text": "先锁定节点、结果和交付标准",
          "dim": "interest.e"
        },
        {
          "key": "C",
          "text": "先确认服务对象和实际价值",
          "dim": "interest.s"
        },
        {
          "key": "D",
          "text": "先给自己保留探索和变化空间",
          "dim": "interest.a"
        }
      ]
    },
    {
      "id": "B28",
      "module": "B",
      "text": "如果同时拿到三类社团任务，你会更想先接哪一种：",
      "tags": ["scenario", "boundary-business", "boundary-people-media"],
      "options": [
        {
          "key": "A",
          "text": "根据历史数据和预算，判断活动方案是否划算",
          "dim": "interest.c"
        },
        {
          "key": "B",
          "text": "负责拉新、宣传和活动曝光，让结果更好看",
          "dim": "interest.e"
        },
        {
          "key": "C",
          "text": "照顾成员状态、协调分工，让团队运转更顺",
          "dim": "interest.s"
        },
        {
          "key": "D",
          "text": "负责文案、内容和视觉表达，让整体更有吸引力",
          "dim": "interest.a"
        }
      ]
    },
    {
      "id": "B29",
      "module": "B",
      "text": "如果未来的大学任务里必须长期投入一种工作，你更愿意坚持：",
      "tags": ["scenario", "boundary-tech", "boundary-engineering"],
      "options": [
        {
          "key": "A",
          "text": "持续研究模型、逻辑和底层原理",
          "dim": "interest.i"
        },
        {
          "key": "B",
          "text": "持续优化交付节奏、推动项目结果达成",
          "dim": "interest.e"
        },
        {
          "key": "C",
          "text": "持续改进设备、结构或工程实现细节",
          "dim": "interest.r"
        },
        {
          "key": "D",
          "text": "持续输出表达内容，让更多人理解和接受成果",
          "dim": "interest.a"
        }
      ]
    },
    {
      "id": "C01",
      "module": "C",
      "text": "接到一个没有现成答案的综合任务时，你的第一反应更接近：",
      "options": [
        {
          "key": "A",
          "text": "拆结构找规律",
          "dim": "cognition.system"
        },
        {
          "key": "B",
          "text": "列步骤逐项做",
          "dim": "cognition.data"
        },
        {
          "key": "C",
          "text": "看情境综合判断",
          "dim": "cognition.contextual"
        },
        {
          "key": "D",
          "text": "多角度发散想",
          "dim": "cognition.verbal"
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
          "dim": "cognition.system"
        },
        {
          "key": "C",
          "text": "理解人和关系",
          "dim": "cognition.contextual"
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
      "text": "面对没有标准答案的问题时，你更常用的判断方式是：",
      "options": [
        {
          "key": "A",
          "text": "逻辑推演",
          "dim": "cognition.abstract"
        },
        {
          "key": "B",
          "text": "想要评判标准",
          "dim": "cognition.system"
        },
        {
          "key": "C",
          "text": "看现实效果",
          "dim": "cognition.contextual"
        },
        {
          "key": "D",
          "text": "自由探索",
          "dim": "cognition.verbal"
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
          "dim": "cognition.system"
        },
        {
          "key": "C",
          "text": "看情况",
          "dim": "cognition.contextual"
        },
        {
          "key": "D",
          "text": "跟感觉",
          "dim": "cognition.verbal"
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
          "dim": "cognition.abstract"
        },
        {
          "key": "B",
          "text": "计划",
          "dim": "cognition.system"
        },
        {
          "key": "C",
          "text": "经验",
          "dim": "cognition.contextual"
        },
        {
          "key": "D",
          "text": "灵感",
          "dim": "cognition.verbal"
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
          "dim": "cognition.system"
        },
        {
          "key": "C",
          "text": "案例/故事",
          "dim": "cognition.contextual"
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
      "text": "把一堆分散信息整理成可用成果时，你更擅长把它变成：",
      "options": [
        {
          "key": "A",
          "text": "结构图",
          "dim": "cognition.system"
        },
        {
          "key": "B",
          "text": "步骤表",
          "dim": "cognition.data"
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
          "dim": "cognition.contextual"
        },
        {
          "key": "D",
          "text": "亮点与创意",
          "dim": "cognition.verbal"
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
          "dim": "cognition.abstract"
        },
        {
          "key": "B",
          "text": "怎么落地？",
          "dim": "cognition.system"
        },
        {
          "key": "C",
          "text": "对人有什么影响？",
          "dim": "cognition.contextual"
        },
        {
          "key": "D",
          "text": "是否有更具启发性的表达方式？",
          "dim": "cognition.verbal"
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
          "dim": "cognition.abstract"
        },
        {
          "key": "B",
          "text": "中（要规则）",
          "dim": "cognition.system"
        },
        {
          "key": "C",
          "text": "中（看情境）",
          "dim": "cognition.contextual"
        },
        {
          "key": "D",
          "text": "高（可探索）",
          "dim": "cognition.verbal"
        }
      ]
    },
    {
      "id": "C11",
      "module": "C",
      "text": "如果同一门课可以从不同形式完成考核，你更愿意选择：",
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
          "dim": "cognition.contextual"
        },
        {
          "key": "D",
          "text": "开放创作",
          "dim": "cognition.verbal"
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
          "text": "通过练习进行归纳",
          "dim": "cognition.system"
        },
        {
          "key": "C",
          "text": "联系现实",
          "dim": "cognition.contextual"
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
          "dim": "cognition.contextual"
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
      "text": "面对相互冲突的信息时，你更倾向于：",
      "options": [
        {
          "key": "A",
          "text": "找一致性解释",
          "dim": "cognition.abstract"
        },
        {
          "key": "B",
          "text": "按权威/标准选",
          "dim": "cognition.system"
        },
        {
          "key": "C",
          "text": "结合具体情况权衡",
          "dim": "cognition.contextual"
        },
        {
          "key": "D",
          "text": "接受多种可能",
          "dim": "cognition.verbal"
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
          "dim": "cognition.abstract"
        },
        {
          "key": "B",
          "text": "是否可行",
          "dim": "cognition.system"
        },
        {
          "key": "C",
          "text": "是否合理公平",
          "dim": "cognition.contextual"
        },
        {
          "key": "D",
          "text": "是否新颖",
          "dim": "cognition.verbal"
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
          "dim": "cognition.contextual"
        },
        {
          "key": "D",
          "text": "拆成创意路径",
          "dim": "cognition.verbal"
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
          "dim": "cognition.abstract"
        },
        {
          "key": "B",
          "text": "做得更快更准",
          "dim": "cognition.system"
        },
        {
          "key": "C",
          "text": "更懂别人/社会",
          "dim": "cognition.contextual"
        },
        {
          "key": "D",
          "text": "作品更好看",
          "dim": "cognition.verbal"
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
          "dim": "cognition.system"
        },
        {
          "key": "C",
          "text": "用经验判断",
          "dim": "cognition.contextual"
        },
        {
          "key": "D",
          "text": "先试再改",
          "dim": "cognition.verbal"
        }
      ]
    },
    {
      "id": "C19",
      "module": "C",
      "text": "你在处理文字材料时更接近：",
      "options": [
        {
          "key": "A",
          "text": "提炼论证结构",
          "dim": "cognition.abstract"
        },
        {
          "key": "B",
          "text": "提炼要点/提纲",
          "dim": "cognition.system"
        },
        {
          "key": "C",
          "text": "提炼立场/动机",
          "dim": "cognition.contextual"
        },
        {
          "key": "D",
          "text": "提炼亮点/金句",
          "dim": "cognition.verbal"
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
          "dim": "cognition.verbal"
        }
      ]
    },
    {
      "id": "C21",
      "module": "C",
      "text": "在一个需要持续协作的项目中，你更喜欢的工作方式是：",
      "options": [
        {
          "key": "A",
          "text": "独立深思",
          "dim": "cognition.abstract"
        },
        {
          "key": "B",
          "text": "按流程协作",
          "dim": "cognition.system"
        },
        {
          "key": "C",
          "text": "与人互动",
          "dim": "cognition.contextual"
        },
        {
          "key": "D",
          "text": "灵活创作",
          "dim": "cognition.verbal"
        }
      ]
    },
    {
      "id": "C22",
      "module": "C",
      "text": "对于理论性较强、短期不一定立刻见效的课程，你通常：",
      "options": [
        {
          "key": "A",
          "text": "喜欢",
          "dim": "cognition.abstract"
        },
        {
          "key": "B",
          "text": "看实用性",
          "dim": "cognition.system"
        },
        {
          "key": "C",
          "text": "看是否有意义",
          "dim": "cognition.contextual"
        },
        {
          "key": "D",
          "text": "更喜欢项目",
          "dim": "cognition.verbal"
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
          "dim": "cognition.system"
        },
        {
          "key": "C",
          "text": "照顾关系与影响",
          "dim": "cognition.contextual"
        },
        {
          "key": "D",
          "text": "提供新点子",
          "dim": "cognition.verbal"
        }
      ]
    },
    {
      "id": "C24",
      "module": "C",
      "text": "在处理复杂任务时，你更容易出现的偏差是：",
      "options": [
        {
          "key": "A",
          "text": "想太多忽略细节",
          "dim": "cognition.abstract"
        },
        {
          "key": "B",
          "text": "死板不变通",
          "dim": "cognition.system"
        },
        {
          "key": "C",
          "text": "情绪/关系影响判断",
          "dim": "cognition.contextual"
        },
        {
          "key": "D",
          "text": "发散太多不收敛",
          "dim": "cognition.verbal"
        }
      ]
    },
    {
      "id": "C25",
      "module": "C",
      "text": "总体思维方式更接近：",
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
      "id": "C26",
      "module": "C",
      "text": "学校准备做一个跨学科项目，你更愿意承担哪一类核心工作：",
      "tags": ["scenario", "boundary-tech"],
      "options": [
        {
          "key": "A",
          "text": "设计算法、模型或核心逻辑框架",
          "dim": "cognition.abstract"
        },
        {
          "key": "B",
          "text": "拆解流程、排期并保证版本交付",
          "dim": "cognition.system"
        },
        {
          "key": "C",
          "text": "搭建装置、调试硬件或空间结构原型",
          "dim": "cognition.spatial"
        },
        {
          "key": "D",
          "text": "负责用户访谈、内容说明与最终呈现",
          "dim": "cognition.contextual"
        }
      ]
    },
    {
      "id": "C27",
      "module": "C",
      "text": "如果参与一个智能设备项目，你最想先解决的问题是：",
      "tags": ["scenario", "boundary-tech"],
      "options": [
        {
          "key": "A",
          "text": "核心计算逻辑是否足够稳健",
          "dim": "cognition.abstract"
        },
        {
          "key": "B",
          "text": "系统联调与版本迭代是否顺畅",
          "dim": "cognition.system"
        },
        {
          "key": "C",
          "text": "传感器、电路或硬件响应是否可靠",
          "dim": "cognition.spatial"
        },
        {
          "key": "D",
          "text": "最终用户是否容易理解并使用",
          "dim": "cognition.contextual"
        }
      ]
    },
    {
      "id": "C28",
      "module": "C",
      "text": "在工程实践课里，你更愿意负责哪一类任务：",
      "tags": ["scenario", "boundary-engineering"],
      "options": [
        {
          "key": "A",
          "text": "分析原理并优化关键参数",
          "dim": "cognition.abstract"
        },
        {
          "key": "B",
          "text": "设定控制逻辑、流程联动和运行规则",
          "dim": "cognition.system"
        },
        {
          "key": "C",
          "text": "处理结构设计、装配空间和机械布局",
          "dim": "cognition.spatial"
        },
        {
          "key": "D",
          "text": "盯住执行过程、测试节奏和现场调试",
          "dim": "ability.focus"
        }
      ]
    },
    {
      "id": "C29",
      "module": "C",
      "text": "围绕一项校园公共议题做实践项目时，你更想承担：",
      "tags": ["scenario", "boundary-people-media"],
      "options": [
        {
          "key": "A",
          "text": "采访、写作，把事实和观点讲清楚",
          "dim": "ability.writing"
        },
        {
          "key": "B",
          "text": "传播策划与活动协同，让更多人参与",
          "dim": "ability.comm"
        },
        {
          "key": "C",
          "text": "访谈需求并设计支持方案，直接帮助对象",
          "dim": "value.responsibility"
        },
        {
          "key": "D",
          "text": "梳理规则、流程和协同机制，让事情长期运转",
          "dim": "risk.stability"
        }
      ]
    },
    {
      "id": "C30",
      "module": "C",
      "text": "如果围绕同一个商业案例做分析，你更想先抓住哪类核心问题：",
      "tags": ["scenario", "boundary-business"],
      "options": [
        {
          "key": "A",
          "text": "财务结构、风险点和经营测算是否成立",
          "dim": "cognition.data"
        },
        {
          "key": "B",
          "text": "用户增长路径和市场转化是否可行",
          "dim": "cognition.contextual"
        },
        {
          "key": "C",
          "text": "组织分工、流程配置和执行机制是否稳定",
          "dim": "cognition.system"
        },
        {
          "key": "D",
          "text": "对外表达、品牌故事和内容呈现是否有说服力",
          "dim": "cognition.verbal"
        }
      ]
    },
    {
      "id": "C31",
      "module": "C",
      "text": "如果要处理一个学生支持项目，你更想先解决哪类核心问题：",
      "tags": ["scenario", "boundary-people-media"],
      "options": [
        {
          "key": "A",
          "text": "把访谈材料整理成清晰文字和事实表达",
          "dim": "cognition.verbal"
        },
        {
          "key": "B",
          "text": "设计传播路径，让更多学生真正参与进来",
          "dim": "cognition.contextual"
        },
        {
          "key": "C",
          "text": "建立支持流程、记录机制和协同规范",
          "dim": "cognition.system"
        },
        {
          "key": "D",
          "text": "分析问题成因并形成可持续的干预框架",
          "dim": "cognition.abstract"
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
          "text": "情绪起伏明显",
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
          "text": "先暂停并调整状态，避免继续失误",
          "dim": "risk.stability"
        },
        {
          "key": "C",
          "text": "明显低落",
          "dim": "value.security"
        },
        {
          "key": "D",
          "text": "主动寻求他人支持",
          "dim": "ability.comm"
        }
      ]
    },
    {
      "id": "D03",
      "module": "D",
      "text": "任务负荷较重时，你更接近：",
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
          "text": "拖延并伴随明显内耗",
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
          "text": "受到明显打击",
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
      "text": "考试失利后，你更接近：",
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
          "text": "对自身能力产生明显怀疑",
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
      "text": "你对高竞争环境的反应更接近：",
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
          "text": "更倾向调整环境",
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
      "text": "面对不确定结果时，你更接近：",
      "options": [
        {
          "key": "A",
          "text": "只要能够推演路径，就能保持稳定",
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
          "text": "先转向其他事项以缓冲压力",
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
          "text": "重复且缺乏变化的任务",
          "dim": "value.security"
        }
      ]
    },
    {
      "id": "D10",
      "module": "D",
      "text": "经历一段高压之后，你通常更依靠什么方式恢复状态：",
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
      "text": "如果一项长期投入迟迟看不到回报，你更可能：",
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
          "text": "状态明显下滑",
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
      "text": "你对权威与规则的态度更接近：",
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
      "text": "在一个节奏很快、要求明确的团队里，你更自然会承担：",
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
      "text": "你对高强度长期训练的反应更接近：",
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
          "text": "较难长期适应",
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
      "text": "当项目里出现明显失误时，你的第一反应更接近：",
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
          "text": "事务增加时状态明显失衡",
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
      "text": "你最常用、也最有效的减压方式更接近：",
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
          "text": "交流与社交支持",
          "dim": "ability.comm"
        }
      ]
    },
    {
      "id": "D20",
      "module": "D",
      "text": "总体抗压方式更接近：",
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
      "id": "D21",
      "module": "D",
      "text": "如果连续几周都处在高要求节奏里，你更常见的表现是：",
      "tags": ["scenario", "boundary-business", "boundary-engineering"],
      "options": [
        {
          "key": "A",
          "text": "压力越大，越会主动抓关键问题推进",
          "dim": "risk.pressure"
        },
        {
          "key": "B",
          "text": "依靠固定节奏和清单把事情稳住",
          "dim": "ability.focus"
        },
        {
          "key": "C",
          "text": "会明显担心失误或结果不达预期",
          "dim": "value.security"
        },
        {
          "key": "D",
          "text": "需要频繁沟通与外部支持才能保持状态",
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
          "dim": "value.influence"
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
          "dim": "value.security"
        }
      ]
    },
    {
      "id": "E02",
      "module": "E",
      "text": "如果一个专业培养周期较长（例如 5 到 8 年），你更能接受的是：",
      "options": [
        {
          "key": "A",
          "text": "只要方向对我愿意",
          "dim": "value.wealth"
        },
        {
          "key": "B",
          "text": "只要回报清晰我愿意",
          "dim": "value.security"
        },
        {
          "key": "C",
          "text": "只要意义大我愿意",
          "dim": "value.responsibility"
        },
        {
          "key": "D",
          "text": "更倾向周期短",
          "dim": "risk.stability"
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
          "dim": "value.security"
        },
        {
          "key": "C",
          "text": "社会影响/意义",
          "dim": "value.responsibility"
        },
        {
          "key": "D",
          "text": "自由与体验",
          "dim": "value.influence"
        }
      ]
    },
    {
      "id": "E04",
      "module": "E",
      "text": "面对升学和职业方向选择时，你能接受的试错成本更接近：",
      "options": [
        {
          "key": "A",
          "text": "可以多次试错",
          "dim": "value.wealth"
        },
        {
          "key": "B",
          "text": "可以少量试错，但希望节奏可控",
          "dim": "risk.stability"
        },
        {
          "key": "C",
          "text": "试错会让我焦虑",
          "dim": "value.security"
        },
        {
          "key": "D",
          "text": "愿意只为更有价值的方向承担试错",
          "dim": "value.responsibility"
        }
      ]
    },
    {
      "id": "E05",
      "module": "E",
      "text": "家庭对你出国或跨城读书的态度更接近：",
      "options": [
        {
          "key": "A",
          "text": "支持探索",
          "dim": "value.influence"
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
          "dim": "value.security"
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
          "dim": "risk.stability"
        },
        {
          "key": "C",
          "text": "除非很有意义",
          "dim": "value.responsibility"
        },
        {
          "key": "D",
          "text": "更倾向回避",
          "dim": "value.security"
        }
      ]
    },
    {
      "id": "E07",
      "module": "E",
      "text": "你更能接受的职业发展路径是：",
      "options": [
        {
          "key": "A",
          "text": "不确定性较高但发展上限较高",
          "dim": "value.wealth"
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
          "dim": "value.influence"
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
          "dim": "value.influence"
        },
        {
          "key": "C",
          "text": "愿意做有意义的",
          "dim": "value.responsibility"
        },
        {
          "key": "D",
          "text": "愿意参与更具兴趣驱动的项目",
          "dim": "risk.stability"
        }
      ]
    },
    {
      "id": "E09",
      "module": "E",
      "text": "如果学校和专业只能二选一，你更可能优先考虑：",
      "options": [
        {
          "key": "A",
          "text": "难但学到东西的学校/专业",
          "dim": "value.wealth"
        },
        {
          "key": "B",
          "text": "回报确定的学校/专业",
          "dim": "value.security"
        },
        {
          "key": "C",
          "text": "价值感强的学校/专业",
          "dim": "value.responsibility"
        },
        {
          "key": "D",
          "text": "体验感好的学校/专业",
          "dim": "value.influence"
        }
      ]
    },
    {
      "id": "E10",
      "module": "E",
      "text": "面对家庭对升学方向的期待时，你更常见的处理方式是：",
      "options": [
        {
          "key": "A",
          "text": "沟通后坚持自己的逻辑",
          "dim": "value.influence"
        },
        {
          "key": "B",
          "text": "会优先满足结果导向",
          "dim": "value.wealth"
        },
        {
          "key": "C",
          "text": "会看是否符合价值",
          "dim": "value.responsibility"
        },
        {
          "key": "D",
          "text": "会尽量减少冲突",
          "dim": "value.security"
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
          "dim": "value.influence"
        },
        {
          "key": "B",
          "text": "选择更稳妥的路",
          "dim": "value.security"
        },
        {
          "key": "C",
          "text": "选择更有意义但可行的路",
          "dim": "value.responsibility"
        },
        {
          "key": "D",
          "text": "先选择轻松再说",
          "dim": "risk.stability"
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
          "dim": "value.influence"
        },
        {
          "key": "C",
          "text": "强度取决于意义",
          "dim": "value.responsibility"
        },
        {
          "key": "D",
          "text": "不喜欢高强度",
          "dim": "value.security"
        }
      ]
    },
    {
      "id": "E13",
      "module": "E",
      "text": "在选择学校城市和平台资源时，你更看重：",
      "options": [
        {
          "key": "A",
          "text": "更看重学习内容",
          "dim": "value.wealth"
        },
        {
          "key": "B",
          "text": "更看重回报确定性与资源",
          "dim": "value.security"
        },
        {
          "key": "C",
          "text": "更看重社会影响",
          "dim": "value.responsibility"
        },
        {
          "key": "D",
          "text": "更看重生活体验",
          "dim": "value.influence"
        }
      ]
    },
    {
      "id": "E14",
      "module": "E",
      "text": "你希望未来长期投入的工作更接近：",
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
          "dim": "value.influence"
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
          "dim": "value.security"
        },
        {
          "key": "C",
          "text": "意义驱动型",
          "dim": "value.responsibility"
        },
        {
          "key": "D",
          "text": "体验灵活型",
          "dim": "value.influence"
        }
      ]
    },
    {
      "id": "E16",
      "module": "E",
      "text": "如果你只能从三类实习机会里优先选一个，你更倾向：",
      "tags": ["scenario", "boundary-business"],
      "options": [
        {
          "key": "A",
          "text": "财务分析、经营测算或风险判断类岗位",
          "dim": "value.wealth"
        },
        {
          "key": "B",
          "text": "增长运营、品牌传播或市场拓展类岗位",
          "dim": "value.influence"
        },
        {
          "key": "C",
          "text": "人才发展、组织支持或公共服务类岗位",
          "dim": "value.responsibility"
        },
        {
          "key": "D",
          "text": "流程清晰、节奏稳定的综合职能岗位",
          "dim": "value.security"
        }
      ]
    },
    {
      "id": "E17",
      "module": "E",
      "text": "如果未来三年的主要目标只能选一个，你更倾向优先追求：",
      "tags": ["scenario", "boundary-business", "boundary-people-media"],
      "options": [
        {
          "key": "A",
          "text": "建立高门槛能力，争取更强的发展上限",
          "dim": "value.wealth"
        },
        {
          "key": "B",
          "text": "进入更有影响力的平台或更能带来外部机会的路径",
          "dim": "value.influence"
        },
        {
          "key": "C",
          "text": "进入更有社会价值、也更符合内心认同的方向",
          "dim": "value.responsibility"
        },
        {
          "key": "D",
          "text": "保持节奏可控、风险较低、可预期的成长路径",
          "dim": "value.security"
        }
      ]
    },
    {
      "id": "E18",
      "module": "E",
      "text": "如果未来工作的成就感只能来自一种结果，你更看重：",
      "tags": ["scenario", "boundary-business", "boundary-people-media"],
      "options": [
        {
          "key": "A",
          "text": "通过判断和决策，为组织创造更清晰的收益与安全边界",
          "dim": "value.wealth"
        },
        {
          "key": "B",
          "text": "把项目做大、把影响扩大，让更多人看见并认可",
          "dim": "value.influence"
        },
        {
          "key": "C",
          "text": "真正改善某类人的处境，形成长期可持续的支持",
          "dim": "value.responsibility"
        },
        {
          "key": "D",
          "text": "建立稳定秩序，让事情长期按预期高质量运转",
          "dim": "value.security"
        }
      ]
    },
    {
      "id": "E19",
      "module": "E",
      "text": "如果未来进入理工类方向，你更愿意长期承担哪类核心责任：",
      "tags": ["scenario", "boundary-tech", "boundary-engineering"],
      "options": [
        {
          "key": "A",
          "text": "不断优化算法、模型或底层计算逻辑",
          "dim": "value.wealth"
        },
        {
          "key": "B",
          "text": "持续推动系统联动、项目交付和工程结果落地",
          "dim": "value.influence"
        },
        {
          "key": "C",
          "text": "在设备、结构或硬件实现上把细节做扎实",
          "dim": "value.responsibility"
        },
        {
          "key": "D",
          "text": "让流程、规范和运行质量长期保持稳定",
          "dim": "value.security"
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
      "riskText": "空间结构感偏弱，空间建模要求高的专业学习负担更重。"
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

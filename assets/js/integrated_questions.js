// Original project-authored items. These are not MBTI or Kuder instruments.
// Ratings are independent across activities; confidence is not objective ability.
const INTEGRATED_ACTIVITIES = [
  ['r','搭建或调试一个装置、模型或程序','通过动手试验改善一个可运行的成果'],
  ['i','研究一个问题的原理并提出解释','比较证据、寻找规律并验证自己的判断'],
  ['a','创作文章、图像、设计或其他作品','尝试不同的表达方式并打磨自己的创作'],
  ['s','帮助别人理解知识或解决具体困难','倾听他人的需要并参与支持服务'],
  ['e','组织一次活动并推动大家达成目标','向别人介绍方案并争取支持'],
  ['c','整理资料、核对信息并保持记录准确','按照清楚的规范管理任务和进度']
];
const INTEGRATED_SKILLS = [
  ['skill.data','整理数据、制作图表并解释结果','找出资料中的规律并说明判断依据'],
  ['skill.making','搭建一个模型或程序并解决运行问题','使用工具完成一个可检验的小成果'],
  ['skill.expression','写清楚自己的观点并向他人说明','根据反馈修改一份说明或展示'],
  ['skill.coordination','安排任务分工并跟进进度','协调不同意见，推动团队完成任务']
];
const INTEGRATED_VALUES = [
  ['value.autonomy','可以自主选择方法和工作节奏'],
  ['value.creativity','有机会尝试新想法并创造新成果'],
  ['value.service','能够直接帮助他人或改善社会问题'],
  ['value.security','工作路径和生活节奏较为稳定'],
  ['value.wealth','收入回报与投入相匹配'],
  ['value.influence','能够推动决定并影响组织的方向']
];
function makeIndependentItem(id,module,dimension,text,kind) {
  const labels = kind === 'interest' ? ['很不喜欢','不太喜欢','一般','比较喜欢','非常喜欢']
    : kind === 'confidence' ? ['很没有信心','信心较低','一般','比较有信心','非常有信心']
    : kind === 'experience' ? ['没有做过','只观察或了解过','在帮助下尝试过','独立完成过','多次完成并得到反馈']
    : ['不重要','不太重要','一般','比较重要','非常重要'];
  const options = labels.map((text,index)=>({key:String(index+1),text,dim:dimension,rating:index/4}));
  if(kind==='confidence') options.push({key:'U',text:'缺少相关经历，暂时无法判断',dim:dimension,rating:null});
  return {id,module,dimension,text,kind,measurement:'independent-rating',source:'MajorNavi自建题目',tags:['independent-rating',kind,'original-item'],options};
}
const INTEGRATED_QUESTIONS = [
  ...INTEGRATED_ACTIVITIES.flatMap(([code,...activities],i)=>activities.map((activity,j)=>makeIndependentItem(`G${i*2+j+1}`,'G',`interest.${code}`,`你有多喜欢以下活动：${activity}？`,'interest'))),
  ...INTEGRATED_SKILLS.flatMap(([dim,...activities],i)=>activities.map((activity,j)=>makeIndependentItem(`H${i*2+j+1}`,'H',dim,`你对完成以下任务有多大信心：${activity}？`,'confidence'))),
  ...INTEGRATED_VALUES.map(([dim,value],i)=>makeIndependentItem(`I${i+1}`,'I',dim,`选择未来的发展方向时，以下条件对你有多重要：${value}？`,'value')),
  ...INTEGRATED_SKILLS.map(([dim,activity],i)=>makeIndependentItem(`J${i+1}`,'J',dim,`关于「${activity}」，你的实际经历更接近哪种情况？`,'experience'))
];

// Domain tasks distinguish majors that share the same broad RIASEC interests.
const DOMAIN_TASKS = [
  ['computing','编写程序，并持续定位错误、测试和修改代码','理解算法或数据结构，比较不同程序解决问题的方法'],
  ['electronics','分析电路或信号，调试传感器和电子系统','改变控制系统的输入，记录并解释输出变化'],
  ['engineering','分析机械结构、运动关系并改进装配方案','阅读结构图或模型，检验设备设计与加工约束'],
  ['math','围绕抽象概念完成推导或证明','建立数学模型，解释假设并比较计算方法'],
  ['chemistry','围绕物质组成、性质和反应设计观察方案','记录化学实验现象，分析反应条件与结果'],
  ['biology','围绕细胞、生物体或生态过程提出问题','观察生命现象，比较样本并解释实验结果'],
  ['business','分析预算、成本、收益及资源配置方案','比较项目进度、经营风险和流程效率'],
  ['people','通过访谈理解个体需要并设计支持方案','分析人与组织之间的协作或公共服务问题'],
  ['creative','围绕主题制作设计或内容作品并反复修改','比较表达方案，收集受众反馈并调整呈现']
];
INTEGRATED_QUESTIONS.push(...DOMAIN_TASKS.flatMap(([domain,...tasks],i)=>tasks.map((task,j)=>({
  ...makeIndependentItem(`K${i*2+j+1}`,'K',`domain.${domain}`,`如果需要长期学习并反复练习，你有多愿意投入以下任务：${task}？`,'interest'),
  options:[...['很不愿意','不太愿意','一般','比较愿意','非常愿意'].map((text,index)=>({key:String(index+1),text,dim:`domain.${domain}`,rating:index/4})),{key:'U',text:'尚未了解这类任务，暂时无法判断',dim:`domain.${domain}`,rating:null}],
  kind:'domain',domain,tags:['independent-rating','domain-task','original-item']
}))));

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

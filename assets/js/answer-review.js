(function(root){
  function analyze(questions,answers,usage){
    const groups=new Map(),missing=[],unknown=[],answered=[];
    for(const q of questions){
      const option=q.options.find(o=>o.key===answers[q.id]);
      if(!option){missing.push(q.id);continue;}answered.push(q.id);
      if(q.measurement!=='independent-rating')continue;
      if(!['interest','domain','confidence','value'].includes(q.kind))continue;
      const key=q.kind+':'+q.dimension;
      if(!groups.has(key))groups.set(key,{kind:q.kind,asked:0,values:[],ids:[]});
      const g=groups.get(key);g.asked++;g.ids.push(q.id);
      if(typeof option.rating==='number')g.values.push(option.rating);else unknown.push(q.id);
    }
    const dimensions=[...groups.values()],limitedKinds=['interest','domain','confidence'].filter(kind=>{
      const items=dimensions.filter(g=>g.kind===kind);return items.length>0 && items.filter(g=>!g.values.length).length>=Math.ceil(items.length/2);
    });
    const differences=dimensions.filter(g=>g.values.length>=2 && Math.max(...g.values)-Math.min(...g.values)>=.75);
    const seconds=Number(usage?.activeSeconds),fast=answered.length>=20 && Number.isFinite(seconds) && seconds>0 && seconds/answered.length<2;
    const signals=[];if(limitedKinds.length)signals.push('limited_information');if(differences.length)signals.push('different_task_ratings');if(fast)signals.push('short_active_time');
    const reviewIds=[...new Set([...missing,...unknown,...differences.flatMap(g=>g.ids)])];
    return {version:1,signals,missingCount:missing.length,answeredCount:answered.length,reviewIds,limitedKinds,differentDimensionCount:differences.length};
  }
  function messages(review){return review.signals.map(code=>({
    limited_information:'部分兴趣或专业任务选择了“暂时无法判断”。可以先核对；如果确实缺少经历，可以保留这些回答。',
    different_task_ratings:'同一方向的不同任务评价差别较大。请核对是否准确表达了你的偏好；不同任务可以有不同评价。',
    short_active_time:'本次记录到的有效作答时间较短。建议检查是否看清了题意；这不代表作答无效。'
  })[code]).filter(Boolean);}
  function note(review){return review?.signals?.includes('limited_information')?'部分兴趣或专业任务尚缺少明确判断，当前推荐宜先作为课程比较的起点，并结合后续实践进一步明确方向。':'';}
  const api={analyze,messages,note};if(typeof module==='object' && module.exports)module.exports=api;else root.MajorNaviAnswerReview=api;
})(typeof window!=='undefined'?window:this);

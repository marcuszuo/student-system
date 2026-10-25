(function(root){
  const scriptBase=typeof document==='undefined'?null:new URL('../',document.currentScript.src);
  function model(report,parent=root.MajorNaviParentReport) {
    const recommendations=Array.isArray(report.recommendations)?report.recommendations:[];
    if(!recommendations.length)throw Error('这份记录缺少专业推荐内容，无法导出完整测评报告。');
    const joint=Array.isArray(report.jointPriorityMajors)?report.jointPriorityMajors:recommendations.filter(x=>x.jointPriority).map(x=>x.name);
    const score=Object.fromEntries(Object.entries(report.scoring?.studentScore || {}).map(([k,v])=>[k,Number(v)/100]));
    const measures=report.scoring?.integratedMeasurements;
    const portrait=Array.isArray(measures)?parent.portrait(score,measures):[
      {title:'兴趣与发展方向',text:report.careerAnalysis?.summary},
      {title:'学习方式',text:report.developmentInsights?.learningStyle},
      {title:'适合的发展环境',text:report.careerAnalysis?.environment}
    ].filter(x=>x.text);
    return {
      name:report.accessAccount?.name || report.studentProfile?.name || '',
      profile:[report.studentProfile?.grade,report.studentProfile?.typeLabel,report.studentProfile?.curriculumSummary].filter(Boolean).join(' · '),
      id:String(report.id || ''),date:report.submittedAt?new Date(report.submittedAt).toLocaleDateString('zh-CN'):'未记录',
      conclusion:(joint.length>1?'同组优先推荐：':'优先推荐：')+(joint.length>1?joint.join('、'):recommendations[0].name),
      explanation:joint.length>1?'这些专业处于同一优先推荐层级，表内先后不代表确定的优劣。':'优先围绕该专业比较课程内容与实际学习投入，其他候选方向作为补充。',
      portrait,
      recommendations:recommendations.map((x,i)=>({name:x.name,role:joint.includes(x.name)?'同组优先推荐':i===0?'优先推荐':'补充比较',
        rationale:parent.rationale(x,measures),...parent.comparison(x)})),
      version:String(report.siteVersion || '历史版本')
    };
  }
  function clean(value){return String(value??'').replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g,'');}
  function html(report,parent=root.MajorNaviParentReport) {
    const data=model(report,parent),esc=value=>clean(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
    return `<article class="admin-parent-report">
      <header><p class="result-kicker">MajorNavi · 学生专业发展测评报告</p><h2>${esc(data.name || '学生测评结果')}</h2><p>${esc(data.profile)}</p><p>测评日期：${esc(data.date)}</p></header>
      <section><h3>01 测评结论</h3><p class="admin-report-conclusion">${esc(data.conclusion)}</p><p>${esc(data.explanation)}</p></section>
      <section><h3>02 学生特征分析</h3><div class="admin-portrait-grid">${data.portrait.map(x=>`<article><h4>${esc(x.title)}</h4><p>${esc(x.text)}</p></article>`).join('') || '<p>此历史记录未保存学生特征摘要。</p>'}</div></section>
      <section><h3>03 专业推荐与比较</h3>${data.recommendations.map(x=>`<article class="admin-major-comparison"><h4>${esc(x.name)} <span>${esc(x.role)}</span></h4><p><strong>推荐依据：</strong>${esc(x.rationale)}</p><p><strong>大学主要学习内容：</strong>${esc(x.study || '以院校培养方案为准')}</p><p><strong>选择重点：</strong>${esc(x.focus)}</p></article>`).join('')}</section>
      <section><h3>04 后续建议</h3><ul>${data.recommendations.slice(0,2).map(x=>`<li><strong>${esc(x.name)}：</strong>${esc(x.task)}</li>`).join('')}</ul><p>比较方式：各投入相同时间，记录成果、困难和继续投入意愿，请学科老师反馈，再对照专业选择重点进行比较。</p></section>
      <footer><p>本报告用于专业发展参考，建议结合学业表现和实践经历使用。</p><p>测评版本：${esc(data.version)} · 报告编号：${esc(data.id)}</p></footer>
    </article>`;
  }
  async function createBytes(report,{PDFLib,fontkit,fontBytes,parent=root.MajorNaviParentReport}) {
    const data=model(report,parent),{PDFDocument,rgb}=PDFLib;
    const pdf=await PDFDocument.create();pdf.registerFontkit(fontkit);
    const font=await pdf.embedFont(fontBytes,{subset:true});
    pdf.setTitle(`${data.name || data.profile || '学生'}专业发展测评报告`);pdf.setAuthor('MajorNavi');pdf.setSubject('学生专业发展测评结果');
    const width=595.28,height=841.89,margin=46,bodyWidth=width-2*margin;
    const ink=rgb(.12,.18,.17),green=rgb(.22,.38,.31),muted=rgb(.38,.43,.41);
    let page,y;
    function addPage(){page=pdf.addPage([width,height]);y=height-48;page.drawText('MajorNavi',{x:margin,y,font,size:10,color:green});y-=30;}
    function ensure(space){if(y-space<54)addPage();}
    function lines(text,size,max=bodyWidth){
      const result=[];
      for(const paragraph of clean(text).split('\n')){
        let line='';for(const ch of Array.from(paragraph)){if(line && font.widthOfTextAtSize(line+ch,size)>max){result.push(line);line=ch;}else line+=ch;}
        result.push(line);
      }return result;
    }
    function text(value,{size=10.5,color=ink,gap=8,max=bodyWidth}={}){
      const leading=size*1.7;
      for(const line of lines(value,size,max)){ensure(leading);if(line)page.drawText(line,{x:margin,y,font,size,color});y-=leading;}
      y-=gap;
    }
    function heading(value,space=128){ensure(space);y-=10;text(value,{size:15,color:green,gap:10});}
    addPage();text('学生专业发展测评报告',{size:22,color:green,gap:16});
    if(data.name)text(`学生：${data.name}`,{size:12});
    text(data.profile,{color:muted});text(`测评日期：${data.date}`,{color:muted});
    heading('01 测评结论');text(data.conclusion,{size:15});text(data.explanation);
    heading('02 学生特征分析');
    if(!data.portrait.length)text('此历史记录未保存学生特征摘要。');
    data.portrait.forEach(x=>{ensure(64);text(x.title,{size:12,color:green,gap:2});text(x.text);});
    heading('03 专业推荐与比较',192);
    data.recommendations.forEach(x=>{
      ensure(112);text(`${x.name} · ${x.role}`,{size:13,color:green,gap:3});
      text(`推荐依据：${x.rationale}`);text(`大学主要学习内容：${x.study || '以院校培养方案为准'}`);
      text(`选择重点：${x.focus}`);
    });
    heading('04 后续建议');
    data.recommendations.slice(0,2).forEach(x=>text(`${x.name}：${x.task}`));
    text('比较方式：各投入相同时间，记录成果、困难和继续投入意愿，请学科老师反馈，再对照专业选择重点进行比较。');
    text('本报告用于专业发展参考，建议结合学业表现和实践经历使用。',{color:muted});
    text(`测评版本：${data.version}`,{size:9,color:muted});
    if(data.id)text(`报告编号：${data.id}`,{size:8,color:muted});
    pdf.getPages().forEach((p,i)=>{p.drawLine({start:{x:margin,y:36},end:{x:width-margin,y:36},thickness:.5,color:rgb(.8,.85,.82)});p.drawText(`${i+1} / ${pdf.getPageCount()}`,{x:width-margin-42,y:22,font,size:9,color:muted});});
    return pdf.save();
  }
  let ready;
  function loadScript(path){return new Promise((resolve,reject)=>{const script=document.createElement('script');script.src=new URL(path,scriptBase);script.onload=resolve;script.onerror=()=>reject(Error('PDF组件加载失败，请检查网络后重试。'));document.head.appendChild(script);});}
  async function dependencies(){
    if(!ready)ready=(async()=>{
      await Promise.all([root.PDFLib?null:loadScript('vendor/pdf-lib/pdf-lib.min.js'),root.fontkit?null:loadScript('vendor/fontkit/fontkit.umd.min.js')]);
      const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),60000);
      try{const response=await fetch(new URL('fonts/NotoSansSC.ttf',scriptBase),{signal:controller.signal});if(!response.ok)throw Error('中文字体加载失败，请重试。');return {PDFLib:root.PDFLib,fontkit:root.fontkit,fontBytes:await response.arrayBuffer()};}finally{clearTimeout(timer);}
    })().catch(error=>{ready=null;throw error;});return ready;
  }
  async function download(report){
    const bytes=await createBytes(report,await dependencies());
    const link=document.createElement('a'),url=URL.createObjectURL(new Blob([bytes],{type:'application/pdf'}));
    const name=clean(report.accessAccount?.name || report.studentProfile?.grade || '学生').replace(/[\\/:*?"<>|]/g,'_');
    const id=String(report.id || '报告').replace(/[^a-zA-Z0-9_-]/g,'').slice(-12);
    link.href=url;link.download=`${name}-专业发展测评报告-${id}.pdf`;document.body.appendChild(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),60000);
  }
  const api={model,html,createBytes,download};if(typeof module==='object' && module.exports)module.exports=api;else root.MajorNaviReportPDF=api;
})(typeof window!=='undefined'?window:this);

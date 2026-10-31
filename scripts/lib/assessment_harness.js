exports.createAssessmentHarness = function (options = {}) {
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const assert = require('assert/strict');
const root = path.resolve(__dirname, '../..');
const nodes = new Map();
const noop = () => {};
const context = new Proxy({}, {get: () => noop, set: () => true});
function node(id) {
  if (!nodes.has(id)) { const classes=new Set(),listeners={}; nodes.set(id, { listeners,value:'', textContent:'', innerHTML:'', style:{},dataset:{},checked:false,
    classList:{add:(...names)=>names.forEach(n=>classes.add(n)),remove:(...names)=>names.forEach(n=>classes.delete(n)),contains:name=>classes.has(name),toggle:(name,force)=>{const present=force===undefined?!classes.has(name):force;present?classes.add(name):classes.delete(name);return present;}}, addEventListener:(event,handler)=>{listeners[event]=handler;},
    getContext:()=>context, querySelectorAll:()=>[], querySelector:()=>null, scrollIntoView:noop, setAttribute:noop,append:noop,prepend:noop }); }
  return nodes.get(id);
}
let seed = 1702026;
const testMath = Object.create(Math); testMath.random = () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296);
const sandbox = {AbortController,setTimeout:options.setTimeout || setTimeout,clearTimeout,fetch:options.fetch || globalThis.fetch,HTMLCanvasElement:class {},console,URLSearchParams,Uint32Array,Math:testMath,Date,Set,Map,Object,Array,
  document:{createElement:tag=>node(`created-${tag}-${nodes.size}`),getElementById:node,querySelector:node,querySelectorAll:selector=>selector.includes("student-type")?[{checked:true,value:"international",addEventListener:noop}]:[],addEventListener:noop},
  window:{REPORT_API_BASE_URL:options.reportApiBase || "",location:{search:''},scrollTo:noop,addEventListener:noop},
  localStorage:{getItem:()=>null,setItem:noop,removeItem:noop},alert:noop};
vm.createContext(sandbox);
for (const file of ['assets/js/answer-review.js','assets/js/parent-report.js','assets/js/official_data.js','assets/js/integrated_questions.js','assets/js/majors_v2.js']) vm.runInContext(fs.readFileSync(path.join(root,file),'utf8'),sandbox);
let source=fs.readFileSync(path.join(root,'assets/js/app.js'),'utf8');
source=source.slice(0,source.lastIndexOf('\napplyMode(DEFAULT_MODE);'));
vm.runInContext(source,sandbox);
const run = code => vm.runInContext(code,sandbox);

return {root,source,nodes,sandbox,run};
};

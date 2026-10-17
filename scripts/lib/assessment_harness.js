exports.createAssessmentHarness = function () {
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const assert = require('assert/strict');
const root = path.resolve(__dirname, '../..');
const nodes = new Map();
const noop = () => {};
const context = new Proxy({}, {get: () => noop, set: () => true});
function node(id) {
  if (!nodes.has(id)) nodes.set(id, { value:'', textContent:'', innerHTML:'', style:{},dataset:{},checked:false,
    classList:{add:noop,remove:noop,toggle:noop}, addEventListener:noop,
    getContext:()=>context, querySelectorAll:()=>[], querySelector:()=>null, scrollIntoView:noop, setAttribute:noop });
  return nodes.get(id);
}
let seed = 1702026;
const testMath = Object.create(Math); testMath.random = () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296);
const sandbox = {HTMLCanvasElement:class {},console,URLSearchParams,Uint32Array,Math:testMath,Date,Set,Map,Object,Array,
  document:{getElementById:node,querySelector:node,querySelectorAll:selector=>selector.includes("student-type")?[{checked:true,value:"international",addEventListener:noop}]:[],addEventListener:noop},
  window:{location:{search:''},scrollTo:noop,addEventListener:noop},
  localStorage:{getItem:()=>null,setItem:noop,removeItem:noop},alert:noop};
vm.createContext(sandbox);
for (const file of ['assets/js/official_data.js','assets/js/integrated_questions.js','assets/js/majors_v2.js']) vm.runInContext(fs.readFileSync(path.join(root,file),'utf8'),sandbox);
let source=fs.readFileSync(path.join(root,'assets/js/app.js'),'utf8');
source=source.slice(0,source.lastIndexOf('\napplyMode(DEFAULT_MODE);'));
vm.runInContext(source,sandbox);
const run = code => vm.runInContext(code,sandbox);

return {root,source,nodes,sandbox,run};
};

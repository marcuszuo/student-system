#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const vm = require("vm");

const FULL_CORE_LIMITS = { A: 18, B: 18, C: 18, D: 14, E: 12 };
const root = path.resolve(__dirname, "..");
const officialDataPath = path.join(root, "assets/js/official_data.js");

function loadOfficialData() {
  const code = `${fs.readFileSync(officialDataPath, "utf8")}\nmodule.exports = OFFICIAL_DATA;`;
  const sandbox = { module: { exports: {} }, exports: {} };
  vm.createContext(sandbox);
  vm.runInContext(code, sandbox);
  return sandbox.module.exports;
}

function normalizeQuestion(question) {
  return {
    ...question,
    dimensionSet: [...new Set((question.options || []).map((option) => option.dim))]
  };
}

function pickCoverageQuestions(questions, limit) {
  if (questions.length <= limit) return questions.slice();
  const pool = questions.slice();
  const selected = [];
  const coveredDims = new Set();

  while (selected.length < limit && pool.length) {
    let bestIndex = 0;
    let bestGain = -1;
    let bestBreadth = -1;

    pool.forEach((question, index) => {
      const gain = question.dimensionSet.filter((dim) => !coveredDims.has(dim)).length;
      const breadth = question.dimensionSet.length;
      if (gain > bestGain || (gain === bestGain && breadth > bestBreadth)) {
        bestGain = gain;
        bestBreadth = breadth;
        bestIndex = index;
      }
    });

    const [picked] = pool.splice(bestIndex, 1);
    selected.push(picked);
    picked.dimensionSet.forEach((dim) => coveredDims.add(dim));
  }

  return selected;
}

function main() {
  const data = loadOfficialData();
  const questions = data.questions.map(normalizeQuestion);
  const modules = [...new Set(questions.map((question) => question.module))].sort();
  const lines = [];

  lines.push(`# Question Bank Audit - ${new Date().toISOString()}`);
  lines.push("");
  lines.push(`总题量：${questions.length}`);
  lines.push(`维度总数：${data.dimensionKeys.length}`);
  lines.push("");
  lines.push("## 模块健康度");

  modules.forEach((module) => {
    const moduleQuestions = questions.filter((question) => question.module === module);
    const dimensionCounts = new Map();
    let few = 0;
    let repeat3 = 0;

    moduleQuestions.forEach((question) => {
      if (question.dimensionSet.length < 4) few += 1;
      const repeats = Object.values(
        question.options.reduce((acc, option) => {
          acc[option.dim] = (acc[option.dim] || 0) + 1;
          return acc;
        }, {})
      );
      if (repeats.some((count) => count >= 3)) repeat3 += 1;
      question.dimensionSet.forEach((dim) => {
        dimensionCounts.set(dim, (dimensionCounts.get(dim) || 0) + 1);
      });
    });

    lines.push(`- ${module} 模块：${moduleQuestions.length}题，维度不足4个的题 ${few} 道，单维度重复3次及以上 ${repeat3} 道，覆盖维度 ${dimensionCounts.size} 个`);
  });

  lines.push("");
  lines.push("## 正式完整评估核心题覆盖");

  Object.entries(FULL_CORE_LIMITS).forEach(([module, limit]) => {
    const moduleQuestions = questions.filter((question) => question.module === module);
    const selected = pickCoverageQuestions(moduleQuestions, limit);
    const coveredDims = [...new Set(selected.flatMap((question) => question.dimensionSet))];
    lines.push(`- ${module} 模块：抽取 ${selected.length} 题，覆盖 ${coveredDims.length} 个维度`);
  });

  process.stdout.write(`${lines.join("\n")}\n`);
}

main();

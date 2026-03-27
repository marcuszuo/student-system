#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const vm = require("vm");

const root = path.resolve(__dirname, "..");
const officialDataPath = path.join(root, "assets/js/official_data.js");

function loadOfficialData() {
  const code = `${fs.readFileSync(officialDataPath, "utf8")}\nmodule.exports = OFFICIAL_DATA;`;
  const sandbox = { module: { exports: {} }, exports: {} };
  vm.createContext(sandbox);
  vm.runInContext(code, sandbox);
  return sandbox.module.exports;
}

function buildBaseVector(overrides = {}) {
  return {
    "interest.r": 0.5,
    "interest.i": 0.5,
    "interest.a": 0.5,
    "interest.s": 0.5,
    "interest.e": 0.5,
    "interest.c": 0.5,
    "cognition.data": 0.5,
    "cognition.verbal": 0.5,
    "cognition.abstract": 0.5,
    "cognition.system": 0.5,
    "cognition.spatial": 0.5,
    "cognition.contextual": 0.5,
    "ability.math": 0.5,
    "ability.stat": 0.5,
    "ability.writing": 0.5,
    "ability.comm": 0.5,
    "ability.focus": 0.5,
    "ability.memory": 0.5,
    "risk.stability": 0.5,
    "risk.pressure": 0.5,
    "value.wealth": 0.5,
    "value.influence": 0.5,
    "value.responsibility": 0.5,
    "value.security": 0.5,
    ...overrides
  };
}

function squaredDistance(studentScore, majorVector, dimensionKeys) {
  return dimensionKeys.reduce((sum, dim) => {
    const diff = (studentScore[dim] || 0) - (majorVector[dim] || 0);
    return sum + diff * diff;
  }, 0);
}

function rankMajors(studentScore, majors, dimensionKeys) {
  const withDistance = majors.map((major, index) => ({
    ...major,
    _idx: index,
    _dist: squaredDistance(studentScore, major.vector, dimensionKeys)
  }));
  const distances = withDistance.map((major) => major._dist);
  const minDist = Math.min(...distances);
  const maxDist = Math.max(...distances);
  withDistance.forEach((major) => {
    const score01 = maxDist === minDist ? 0.5 : 1 - (major._dist - minDist) / (maxDist - minDist);
    major.matchIndex = Math.round(score01 * 100);
    major.rankScore = score01 + (major._idx + 1) * 0.000001;
  });
  return withDistance.sort((a, b) => b.rankScore - a.rankScore);
}

function getGapSummary(a, b, dimensionNameMap) {
  return Object.keys(a.vector)
    .map((dim) => ({
      dim,
      label: dimensionNameMap[dim] || dim,
      gap: Math.abs((a.vector[dim] || 0) - (b.vector[dim] || 0))
    }))
    .sort((x, y) => y.gap - x.gap)
    .slice(0, 4)
    .map((item) => `${item.label}${Math.round(item.gap * 100)}点`)
    .join("、");
}

function main() {
  const data = loadOfficialData();
  const majors = data.majors;
  const dimensionKeys = data.dimensionKeys;
  const dimensionNameMap = Object.fromEntries(data.dimensions.map((dim) => [dim.key, dim.name || dim.key]));

  const scenarios = [
    {
      name: "计算机 vs 软件 vs 电子信息 边界画像",
      vector: buildBaseVector({
        "interest.i": 0.78,
        "interest.r": 0.62,
        "interest.c": 0.64,
        "cognition.abstract": 0.82,
        "cognition.system": 0.8,
        "ability.math": 0.78,
        "ability.focus": 0.72,
        "ability.comm": 0.52,
        "risk.pressure": 0.58
      }),
      majors: ["计算机科学与技术", "软件工程", "电子信息工程"]
    },
    {
      name: "电气 vs 自动化 vs 机械 边界画像",
      vector: buildBaseVector({
        "interest.r": 0.78,
        "interest.c": 0.68,
        "cognition.system": 0.8,
        "cognition.spatial": 0.72,
        "ability.math": 0.68,
        "ability.focus": 0.82,
        "risk.stability": 0.62,
        "risk.pressure": 0.56
      }),
      majors: ["电气工程及其自动化", "自动化", "机械设计制造及其自动化"]
    },
    {
      name: "财务 vs 金融 vs 市场 边界画像",
      vector: buildBaseVector({
        "interest.e": 0.82,
        "interest.c": 0.7,
        "interest.s": 0.58,
        "cognition.data": 0.68,
        "ability.stat": 0.68,
        "ability.comm": 0.66,
        "value.wealth": 0.8,
        "value.influence": 0.7,
        "risk.pressure": 0.64
      }),
      majors: ["财务管理", "金融学", "市场营销"]
    },
    {
      name: "新闻 vs 传播 边界画像",
      vector: buildBaseVector({
        "interest.a": 0.8,
        "interest.e": 0.58,
        "cognition.verbal": 0.82,
        "cognition.contextual": 0.66,
        "ability.writing": 0.84,
        "ability.comm": 0.8,
        "value.influence": 0.72
      }),
      majors: ["新闻学", "传播学"]
    },
    {
      name: "心理 vs 人资 vs 公管 边界画像",
      vector: buildBaseVector({
        "interest.s": 0.84,
        "interest.i": 0.64,
        "cognition.contextual": 0.8,
        "ability.comm": 0.78,
        "ability.writing": 0.64,
        "value.responsibility": 0.82,
        "risk.stability": 0.7
      }),
      majors: ["心理学", "人力资源管理", "公共管理"]
    }
  ];

  const lines = [`# Boundary Replay - ${new Date().toISOString()}`];
  scenarios.forEach((scenario) => {
    const ranked = rankMajors(scenario.vector, majors, dimensionKeys)
      .filter((major) => scenario.majors.includes(major.name))
      .slice(0, 3);
    lines.push(`\n## ${scenario.name}`);
    ranked.forEach((major, index) => {
      lines.push(`${index + 1}. ${major.name} (${major.matchIndex}/100)`);
    });
    if (ranked[1]) {
      lines.push(`首选与次选关键差异：${getGapSummary(ranked[0], ranked[1], dimensionNameMap)}`);
    }
  });

  process.stdout.write(`${lines.join("\n")}\n`);
}

main();

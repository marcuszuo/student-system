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

function getTopDims(studentScore, coreDims, dimensionNameMap) {
  return coreDims
    .map((dim) => ({ dim, value: Math.round((studentScore[dim] || 0) * 100) }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 3)
    .map((item) => `${dimensionNameMap[item.dim] || item.dim}${item.value}分`)
    .join("、");
}

function getMajorCoreDims(major, dimensionKeys) {
  if (major.coreDims && major.coreDims.length) return major.coreDims.slice(0, 4);
  return dimensionKeys
    .map((dim) => ({ dim, value: major.vector?.[dim] || 0 }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 4)
    .map((item) => item.dim);
}

function buildPersonaVector(base = {}) {
  return {
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
    "ability.focus": 0.45,
    "ability.memory": 0.45,
    "risk.stability": 0.45,
    "risk.pressure": 0.45,
    "value.wealth": 0.45,
    "value.influence": 0.45,
    "value.responsibility": 0.45,
    "value.security": 0.45,
    ...base
  };
}

function main() {
  const data = loadOfficialData();
  const dimensionKeys = data.dimensionKeys;
  const majors = data.majors;
  const dimensionNameMap = Object.fromEntries(data.dimensions.map((dim) => [dim.key, dim.name || dim.key]));

  const personas = [
    {
      name: "理工研究型",
      notes: "偏研究、抽象推理强，适合高逻辑密度方向",
      vector: buildPersonaVector({
        "interest.i": 0.88,
        "cognition.abstract": 0.9,
        "cognition.system": 0.82,
        "ability.math": 0.86,
        "ability.focus": 0.75,
        "risk.pressure": 0.72
      })
    },
    {
      name: "工程执行型",
      notes: "偏实作与执行，适合应用工程与现场/流程型方向",
      vector: buildPersonaVector({
        "interest.r": 0.86,
        "interest.c": 0.76,
        "cognition.system": 0.82,
        "cognition.spatial": 0.78,
        "ability.focus": 0.88,
        "ability.math": 0.72
      })
    },
    {
      name: "创意传播型",
      notes: "偏表达、创意和内容输出，适合传播/设计/新媒体",
      vector: buildPersonaVector({
        "interest.a": 0.9,
        "cognition.verbal": 0.84,
        "ability.writing": 0.86,
        "ability.comm": 0.8,
        "value.influence": 0.72
      })
    },
    {
      name: "社会服务型",
      notes: "偏助人、情境理解和责任感，适合教育/管理/公共服务",
      vector: buildPersonaVector({
        "interest.s": 0.9,
        "cognition.contextual": 0.84,
        "ability.comm": 0.82,
        "value.responsibility": 0.88,
        "value.security": 0.66
      })
    },
    {
      name: "商业管理型",
      notes: "偏结果、组织、影响与经营视角，适合商科/管理/运营",
      vector: buildPersonaVector({
        "interest.e": 0.86,
        "interest.c": 0.7,
        "ability.comm": 0.78,
        "value.wealth": 0.8,
        "value.influence": 0.84,
        "risk.pressure": 0.72
      })
    }
  ];

  const lines = [];
  lines.push(`# Persona Replay - ${new Date().toISOString()}`);
  personas.forEach((persona) => {
    const ranked = rankMajors(persona.vector, majors, dimensionKeys).slice(0, 3);
    lines.push(`\n## ${persona.name}`);
    lines.push(persona.notes);
    ranked.forEach((major, index) => {
      const coreDims = getMajorCoreDims(major, dimensionKeys);
      lines.push(
        `${index + 1}. ${major.name} (${major.matchIndex}/100) - ${getTopDims(persona.vector, coreDims, dimensionNameMap)}`
      );
    });
  });

  process.stdout.write(`${lines.join("\n")}\n`);
}

main();

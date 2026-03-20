import { useState, useEffect, useRef, useCallback } from "react";

// ═══════════════════════════════════════════════════════
//  SHARED DATA
// ═══════════════════════════════════════════════════════

// ── Cluster View Data ──────────────────────────────────
const CW = 900, CH = 620, NODE_R = 52;

const CLUSTERS = [
  { id:"core_sophomore", label:"Sophomore\nCore",         color:"#6366f1", courses:["ECE 0101","ECE 0102","ECE 0201","ECE 0202","ECE 0301","ECE 0302","ECE 0401","ECE 0402","MATH 0240"] },
  { id:"core_junior",    label:"Junior\nCore (ECE)",      color:"#3b82f6", courses:["ECE 1212","ECE 1247","ECE 1259","ECE 1560","ECE 1673","ECE 1701","ECE 1895"] },
  { id:"computers",      label:"Computer\nArchitecture",  color:"#8b5cf6", courses:["ECE 1110","ECE 1115","ECE 1165","ECE 1166","ECE 1170","ECE 1175","ECE 1195"] },
  { id:"software",       label:"Software &\nAlgorithms",  color:"#ec4899", courses:["ECE 1140","ECE 1145","ECE 1147","ECE 1148","ECE 1180","ECE 1188"] },
  { id:"networks",       label:"Networks &\nSecurity",    color:"#f59e0b", courses:["ECE 1150","ECE 1155"] },
  { id:"vlsi",           label:"VLSI &\nDigital Design",  color:"#10b981", courses:["ECE 1192","ECE 1193","ECE 1238"] },
  { id:"signals",        label:"Signals &\nComms",        color:"#06b6d4", courses:["ECE 1390","ECE 1395","ECE 1472","ECE 1473","ECE 1562"] },
  { id:"photonics",      label:"Photonics,\nFields & Nano",color:"#a855f7",courses:["ECE 1232","ECE 1250","ECE 1251","ECE 1266","ECE 1272"] },
  { id:"power",          label:"Power\nSystems",          color:"#ef4444", courses:["ECE 1710","ECE 1750","ECE 1771","ECE 1773","ECE 1774","ECE 1775","ECE 1776"] },
  { id:"robotics",       label:"Robotics &\nMechatronics",color:"#14b8a6", courses:["ECE 1674","ECE 1675"] },
  { id:"analog",         label:"Analog\nElectronics",     color:"#f97316", courses:["ECE 1215","ECE 1286"] },
  { id:"capstone",       label:"Design,\nResearch &\nCapstone",color:"#64748b",courses:["ECE 1885","ECE 1890","ECE 1893","ECE 1894","ECE 1895","ECE 1896","ECE 1898"] },
];

const CLUSTER_EDGES = [
  { source:"core_sophomore", target:"core_junior",  label:"leads to"     },
  { source:"core_sophomore", target:"computers",    label:"enables"      },
  { source:"core_sophomore", target:"software",     label:"enables"      },
  { source:"core_sophomore", target:"vlsi",         label:"enables"      },
  { source:"core_sophomore", target:"signals",      label:"enables"      },
  { source:"core_sophomore", target:"power",        label:"enables"      },
  { source:"core_junior",    target:"signals",      label:"deepens"      },
  { source:"core_junior",    target:"photonics",    label:"extends to"   },
  { source:"core_junior",    target:"power",        label:"extends to"   },
  { source:"core_junior",    target:"robotics",     label:"feeds"        },
  { source:"core_junior",    target:"analog",       label:"extends to"   },
  { source:"computers",      target:"software",     label:"paired with"  },
  { source:"computers",      target:"vlsi",         label:"implements"   },
  { source:"software",       target:"networks",     label:"enables"      },
  { source:"signals",        target:"networks",     label:"underlies"    },
  { source:"signals",        target:"photonics",    label:"extends"      },
  { source:"analog",         target:"vlsi",         label:"feeds into"   },
  { source:"power",          target:"analog",       label:"circuit design"},
  { source:"robotics",       target:"software",     label:"uses"         },
  { source:"capstone",       target:"core_junior",  label:""             },
  { source:"capstone",       target:"computers",    label:""             },
  { source:"capstone",       target:"power",        label:""             },
];

const COURSE_DETAILS = {
  "ECE 0101":"Linear Circuits and Systems","ECE 0102":"Microelectronic Circuits",
  "ECE 0201":"Digital Circuits and Systems","ECE 0202":"Embedded Processors & Interfacing",
  "ECE 0301":"ECE Problem Solving with C++","ECE 0302":"Data Structures and Algorithms",
  "ECE 0401":"ECE Analytical Methods","ECE 0402":"Signals, Systems & Probability",
  "MATH 0240":"Analytic Geometry and Calculus 3","ECE 1212":"Electronic Circuit Design Lab",
  "ECE 1247":"Semiconductor Device Theory","ECE 1259":"Electromagnetics",
  "ECE 1560":"Digital Signal Processing","ECE 1673":"Linear Control Systems",
  "ECE 1701":"Fundamentals of Electric Power Engineering","ECE 1895":"Junior Design Fundamentals",
  "ECE 1110":"Computer Organization & Architecture","ECE 1115":"High Performance Computing",
  "ECE 1165":"Dependable Systems","ECE 1166":"Parallel Systems",
  "ECE 1170":"Special Topics: Computers","ECE 1175":"Embedded Systems Design",
  "ECE 1195":"Advanced Digital Design","ECE 1140":"Systems & Project Engineering",
  "ECE 1145":"Software Construction & Evolution","ECE 1147":"Algorithms for Big Data",
  "ECE 1148":"Algorithmic Thinking","ECE 1180":"Computational Modeling & Simulation",
  "ECE 1188":"Cyber-Physical Systems","ECE 1150":"Computer Networks",
  "ECE 1155":"Information Security","ECE 1192":"Intro to VLSI Design",
  "ECE 1193":"Advanced VLSI Design","ECE 1238":"Digital Electronics",
  "ECE 1390":"Intro to Image Processing","ECE 1395":"Intro to Machine Learning",
  "ECE 1472":"Analog Communication Systems","ECE 1473":"Digital Communication Systems",
  "ECE 1562":"Digital & Analog Filters","ECE 1232":"Intro Lasers & Optical Electronics",
  "ECE 1250":"Nanotechnology & Nano-Engineering","ECE 1251":"Micro & Nano Device Fabrication Lab",
  "ECE 1266":"Applications of Fields & Waves","ECE 1272":"Simulation & Design of Silicon Photonics",
  "ECE 1710":"Power Distribution Systems & Smart Grids","ECE 1750":"Power Electronics Conversion Theory",
  "ECE 1771":"Electric Machinery","ECE 1773":"Power Generation, Operation & Control",
  "ECE 1774":"Computer Analysis of Power Systems","ECE 1775":"Power Quality",
  "ECE 1776":"Microgrid Concepts & Distributed Generation","ECE 1674":"Mechatronic Systems",
  "ECE 1675":"Robotic Control","ECE 1215":"Electroacoustics & Audio Electronics",
  "ECE 1286":"Analog Integrated Circuit Design","ECE 1885":"Departmental Seminar",
  "ECE 1890":"ECE Prototyping Fundamentals","ECE 1893":"Undergraduate Research Project",
  "ECE 1894":"Undergraduate Industry Project","ECE 1896":"Senior Design Project",
  "ECE 1898":"Engineering Project",
};

const CLUSTER_BADGE = { core_sophomore:"CORE", core_junior:"CORE", capstone:"CAPSTONE" };

function initClusterPositions() {
  const custom = { core_sophomore:{x:160,y:300}, core_junior:{x:420,y:220}, capstone:{x:750,y:480} };
  const others = CLUSTERS.filter(c => !custom[c.id]);
  const cx = CW/2, cy = CH/2;
  return CLUSTERS.map(c => {
    if (custom[c.id]) return {...custom[c.id], vx:0, vy:0};
    const oi = others.findIndex(o => o.id===c.id);
    const a = (2*Math.PI*oi/others.length) - Math.PI/3;
    return { x:cx+220*Math.cos(a), y:cy+190*Math.sin(a), vx:0, vy:0 };
  });
}

// ── Node-level View Data ───────────────────────────────
const GW = 1100, GH = 700, NR = 19;

const SUBFIELD_COLORS = {
  "Foundations":"#6366f1","Circuits & Electronics":"#f59e0b","Digital Systems":"#3b82f6",
  "Software & Algorithms":"#10b981","Signals & DSP":"#ec4899","Communications":"#14b8a6",
  "Power Systems":"#ef4444","Control & Robotics":"#8b5cf6","EM & Photonics":"#f97316",
  "Semiconductors & VLSI":"#84cc16","Nanotechnology":"#e879f9","Design Projects":"#94a3b8",
};
const YEAR_COLORS = {"Y1":"#6366f1","Y2":"#3b82f6","Y3":"#10b981","Y4":"#f59e0b","EL":"#ec4899"};
const YEAR_LABELS = {"Y1":"Year 1","Y2":"Year 2","Y3":"Year 3","Y4":"Year 4","EL":"Elective"};
const YEAR_X = {Y1:80,Y2:260,Y3:500,Y4:720,EL:940};

const nodes = [
  {id:"MATH0220",label:"MATH 0220",desc:"Calculus I",subfield:"Foundations",yr:"Y1"},
  {id:"MATH0230",label:"MATH 0230",desc:"Calculus II",subfield:"Foundations",yr:"Y1"},
  {id:"MATH0240",label:"MATH 0240",desc:"Calculus III",subfield:"Foundations",yr:"Y2"},
  {id:"PHYS0174",label:"PHYS 0174",desc:"Physics I",subfield:"Foundations",yr:"Y1"},
  {id:"PHYS0175",label:"PHYS 0175",desc:"Physics II",subfield:"Foundations",yr:"Y1"},
  {id:"ENGR0011",label:"ENGR 0011",desc:"Intro Engineering Analysis",subfield:"Foundations",yr:"Y1"},
  {id:"ENGR0012",label:"ENGR 0012",desc:"Intro Engineering Computing",subfield:"Foundations",yr:"Y1"},
  {id:"ECE0101",label:"ECE 0101",desc:"Linear Circuits & Systems",subfield:"Circuits & Electronics",yr:"Y2"},
  {id:"ECE0102",label:"ECE 0102",desc:"Microelectronic Circuits",subfield:"Circuits & Electronics",yr:"Y2"},
  {id:"ECE0201",label:"ECE 0201",desc:"Digital Circuits & Systems",subfield:"Digital Systems",yr:"Y2"},
  {id:"ECE0202",label:"ECE 0202",desc:"Embedded Processors & Interfacing",subfield:"Digital Systems",yr:"Y2"},
  {id:"ECE0301",label:"ECE 0301",desc:"ECE Problem Solving with C++",subfield:"Software & Algorithms",yr:"Y2"},
  {id:"ECE0302",label:"ECE 0302",desc:"Data Structures & Algorithms",subfield:"Software & Algorithms",yr:"Y2"},
  {id:"ECE0401",label:"ECE 0401",desc:"ECE Analytical Methods",subfield:"Foundations",yr:"Y2"},
  {id:"ECE0402",label:"ECE 0402",desc:"Signals, Systems & Probability",subfield:"Signals & DSP",yr:"Y2"},
  {id:"ECE1212",label:"ECE 1212",desc:"Electronic Circuit Design Lab",subfield:"Circuits & Electronics",yr:"Y3"},
  {id:"ECE1247",label:"ECE 1247",desc:"Semiconductor Device Theory",subfield:"Semiconductors & VLSI",yr:"Y3"},
  {id:"ECE1259",label:"ECE 1259",desc:"Electromagnetics",subfield:"EM & Photonics",yr:"Y3"},
  {id:"ECE1560",label:"ECE 1560",desc:"Digital Signal Processing",subfield:"Signals & DSP",yr:"Y3"},
  {id:"ECE1673",label:"ECE 1673",desc:"Linear Control Systems",subfield:"Control & Robotics",yr:"Y3"},
  {id:"ECE1701",label:"ECE 1701",desc:"Fundamentals of Electric Power Engineering",subfield:"Power Systems",yr:"Y3"},
  {id:"ECE1895",label:"ECE 1895",desc:"Junior Design Fundamentals",subfield:"Design Projects",yr:"Y3"},
  {id:"ECE1896",label:"ECE 1896",desc:"Senior Design Project",subfield:"Design Projects",yr:"Y4"},
  {id:"ECE1110",label:"ECE 1110",desc:"Computer Organization & Architecture",subfield:"Digital Systems",yr:"EL"},
  {id:"ECE1115",label:"ECE 1115",desc:"High Performance Computing",subfield:"Software & Algorithms",yr:"EL"},
  {id:"ECE1140",label:"ECE 1140",desc:"Systems & Project Engineering",subfield:"Software & Algorithms",yr:"EL"},
  {id:"ECE1145",label:"ECE 1145",desc:"Software Construction & Evolution",subfield:"Software & Algorithms",yr:"EL"},
  {id:"ECE1147",label:"ECE 1147",desc:"Algorithms for Big Data",subfield:"Software & Algorithms",yr:"EL"},
  {id:"ECE1148",label:"ECE 1148",desc:"Algorithmic Thinking",subfield:"Software & Algorithms",yr:"EL"},
  {id:"ECE1150",label:"ECE 1150",desc:"Computer Networks",subfield:"Communications",yr:"EL"},
  {id:"ECE1155",label:"ECE 1155",desc:"Information Security",subfield:"Software & Algorithms",yr:"EL"},
  {id:"ECE1165",label:"ECE 1165",desc:"Dependable Systems",subfield:"Digital Systems",yr:"EL"},
  {id:"ECE1166",label:"ECE 1166",desc:"Parallel Systems",subfield:"Digital Systems",yr:"EL"},
  {id:"ECE1175",label:"ECE 1175",desc:"Embedded Systems Design",subfield:"Digital Systems",yr:"EL"},
  {id:"ECE1180",label:"ECE 1180",desc:"Computational Modeling & Simulation",subfield:"Software & Algorithms",yr:"EL"},
  {id:"ECE1188",label:"ECE 1188",desc:"Cyber-Physical Systems",subfield:"Digital Systems",yr:"EL"},
  {id:"ECE1192",label:"ECE 1192",desc:"Intro to VLSI Design",subfield:"Semiconductors & VLSI",yr:"EL"},
  {id:"ECE1193",label:"ECE 1193",desc:"Advanced VLSI Design",subfield:"Semiconductors & VLSI",yr:"EL"},
  {id:"ECE1195",label:"ECE 1195",desc:"Advanced Digital Design",subfield:"Digital Systems",yr:"EL"},
  {id:"ECE1215",label:"ECE 1215",desc:"Electroacoustics & Audio Electronics",subfield:"Circuits & Electronics",yr:"EL"},
  {id:"ECE1232",label:"ECE 1232",desc:"Intro Lasers & Optical Electronics",subfield:"EM & Photonics",yr:"EL"},
  {id:"ECE1238",label:"ECE 1238",desc:"Digital Electronics",subfield:"Semiconductors & VLSI",yr:"EL"},
  {id:"ECE1250",label:"ECE 1250",desc:"Nanotechnology & Nano-Engineering",subfield:"Nanotechnology",yr:"EL"},
  {id:"ECE1251",label:"ECE 1251",desc:"Micro & Nano Device Fabrication",subfield:"Nanotechnology",yr:"EL"},
  {id:"ECE1266",label:"ECE 1266",desc:"Applications of Fields & Waves",subfield:"EM & Photonics",yr:"EL"},
  {id:"ECE1272",label:"ECE 1272",desc:"Silicon Photonics",subfield:"EM & Photonics",yr:"EL"},
  {id:"ECE1286",label:"ECE 1286",desc:"Analog Integrated Circuits",subfield:"Circuits & Electronics",yr:"EL"},
  {id:"ECE1390",label:"ECE 1390",desc:"Intro to Image Processing",subfield:"Signals & DSP",yr:"EL"},
  {id:"ECE1395",label:"ECE 1395",desc:"Intro to Machine Learning",subfield:"Signals & DSP",yr:"EL"},
  {id:"ECE1472",label:"ECE 1472",desc:"Analog Communication Systems",subfield:"Communications",yr:"EL"},
  {id:"ECE1473",label:"ECE 1473",desc:"Digital Communication Systems",subfield:"Communications",yr:"EL"},
  {id:"ECE1562",label:"ECE 1562",desc:"Digital & Analog Filters",subfield:"Signals & DSP",yr:"EL"},
  {id:"ECE1674",label:"ECE 1674",desc:"Mechatronic Systems",subfield:"Control & Robotics",yr:"EL"},
  {id:"ECE1675",label:"ECE 1675",desc:"Robotic Control",subfield:"Control & Robotics",yr:"EL"},
  {id:"ECE1710",label:"ECE 1710",desc:"Power Distribution & Smart Grids",subfield:"Power Systems",yr:"EL"},
  {id:"ECE1750",label:"ECE 1750",desc:"Power Electronics Conversion",subfield:"Power Systems",yr:"EL"},
  {id:"ECE1771",label:"ECE 1771",desc:"Electric Machinery",subfield:"Power Systems",yr:"EL"},
  {id:"ECE1773",label:"ECE 1773",desc:"Power Generation, Operation & Control",subfield:"Power Systems",yr:"EL"},
  {id:"ECE1774",label:"ECE 1774",desc:"Computer Analysis of Power Systems",subfield:"Power Systems",yr:"EL"},
  {id:"ECE1775",label:"ECE 1775",desc:"Power Quality",subfield:"Power Systems",yr:"EL"},
  {id:"ECE1776",label:"ECE 1776",desc:"Microgrid & Distributed Generation",subfield:"Power Systems",yr:"EL"},
  {id:"ECE1893",label:"ECE 1893",desc:"Undergraduate Research Project",subfield:"Design Projects",yr:"EL"},
  {id:"ECE1894",label:"ECE 1894",desc:"Undergraduate Industry Project",subfield:"Design Projects",yr:"EL"},
];

const prereqEdges = [
  {s:"MATH0220",t:"MATH0230"},{s:"PHYS0174",t:"PHYS0175"},
  {s:"MATH0220",t:"ECE0101"},{s:"PHYS0175",t:"ECE0101"},
  {s:"PHYS0175",t:"ECE0201"},{s:"ENGR0012",t:"ECE0201"},
  {s:"ENGR0012",t:"ECE0301"},
  {s:"MATH0230",t:"ECE0401"},{s:"ENGR0012",t:"ECE0401"},
  {s:"ECE0101",t:"ECE0102"},{s:"ECE0201",t:"ECE0202"},{s:"ECE0301",t:"ECE0202"},
  {s:"ECE0301",t:"ECE0302"},{s:"ECE0401",t:"ECE0402"},{s:"MATH0230",t:"MATH0240"},
  {s:"ECE0102",t:"ECE1212"},{s:"ECE0402",t:"ECE1247"},
  {s:"MATH0240",t:"ECE1259"},{s:"ECE0402",t:"ECE1259"},
  {s:"ECE0402",t:"ECE1560"},{s:"ECE0402",t:"ECE1673"},{s:"ECE0102",t:"ECE1701"},
  {s:"ECE0102",t:"ECE1895"},{s:"ECE0202",t:"ECE1895"},{s:"ECE0302",t:"ECE1895"},{s:"ECE0402",t:"ECE1895"},
  {s:"ECE1895",t:"ECE1896"},
  {s:"ECE0202",t:"ECE1110"},{s:"ECE0202",t:"ECE1115"},{s:"ECE0302",t:"ECE1115"},
  {s:"ECE0202",t:"ECE1140"},{s:"ECE0302",t:"ECE1140"},{s:"ECE0302",t:"ECE1145"},
  {s:"ECE0302",t:"ECE1147"},{s:"ECE0402",t:"ECE1147"},{s:"ECE0302",t:"ECE1148"},
  {s:"ECE0302",t:"ECE1150"},{s:"ECE0402",t:"ECE1150"},
  {s:"ECE0202",t:"ECE1155"},{s:"ECE0302",t:"ECE1155"},
  {s:"ECE1110",t:"ECE1165"},{s:"ECE1673",t:"ECE1165"},
  {s:"ECE0202",t:"ECE1166"},{s:"ECE0302",t:"ECE1166"},{s:"ECE0202",t:"ECE1175"},
  {s:"ECE0302",t:"ECE1180"},{s:"ECE0202",t:"ECE1188"},{s:"ECE0302",t:"ECE1188"},
  {s:"ECE0201",t:"ECE1192"},{s:"ECE0102",t:"ECE1192"},{s:"ECE1192",t:"ECE1193"},
  {s:"ECE0202",t:"ECE1195"},{s:"ECE0102",t:"ECE1215"},{s:"ECE0402",t:"ECE1215"},
  {s:"ECE0101",t:"ECE1232"},{s:"ECE1259",t:"ECE1232"},
  {s:"ECE0201",t:"ECE1238"},{s:"ECE0102",t:"ECE1238"},
  {s:"MATH0230",t:"ECE1250"},{s:"PHYS0175",t:"ECE1250"},{s:"ECE1250",t:"ECE1251"},
  {s:"ECE1259",t:"ECE1266"},{s:"ECE1259",t:"ECE1272"},{s:"ECE0102",t:"ECE1286"},
  {s:"ECE0402",t:"ECE1390"},{s:"ECE0402",t:"ECE1395"},{s:"ECE0301",t:"ECE1395"},
  {s:"ECE0402",t:"ECE1472"},{s:"ECE0402",t:"ECE1473"},{s:"ECE0402",t:"ECE1562"},
  {s:"ECE0202",t:"ECE1674"},{s:"ECE0402",t:"ECE1674"},{s:"ECE0402",t:"ECE1675"},
  {s:"ECE0101",t:"ECE1710"},{s:"ECE0102",t:"ECE1750"},{s:"ECE0402",t:"ECE1750"},
  {s:"ECE0102",t:"ECE1771"},{s:"ECE1701",t:"ECE1773"},
  {s:"ECE0102",t:"ECE1774"},{s:"ECE0302",t:"ECE1774"},
  {s:"ECE0402",t:"ECE1775"},{s:"ECE0402",t:"ECE1776"},
];

const topicEdges = [
  {s:"ECE0101",t:"ECE0102",lbl:"builds on"},{s:"ECE0102",t:"ECE1212",lbl:"lab extension"},
  {s:"ECE0102",t:"ECE1286",lbl:"advanced analog"},{s:"ECE1212",t:"ECE1286",lbl:"related"},
  {s:"ECE0102",t:"ECE1215",lbl:"audio circuits"},{s:"ECE0102",t:"ECE1750",lbl:"power electronics"},
  {s:"ECE0201",t:"ECE0202",lbl:"builds on"},{s:"ECE0202",t:"ECE1110",lbl:"architecture"},
  {s:"ECE1110",t:"ECE1166",lbl:"parallel arch"},{s:"ECE0201",t:"ECE1192",lbl:"VLSI logic"},
  {s:"ECE1192",t:"ECE1193",lbl:"adv VLSI"},{s:"ECE0201",t:"ECE1195",lbl:"FPGA design"},
  {s:"ECE0201",t:"ECE1238",lbl:"device families"},{s:"ECE0202",t:"ECE1175",lbl:"embedded"},
  {s:"ECE0202",t:"ECE1188",lbl:"IoT/CPS"},
  {s:"ECE0301",t:"ECE0302",lbl:"builds on"},{s:"ECE0302",t:"ECE1148",lbl:"algorithms"},
  {s:"ECE1148",t:"ECE1147",lbl:"big data algs"},{s:"ECE0302",t:"ECE1145",lbl:"SE practice"},
  {s:"ECE0302",t:"ECE1140",lbl:"SE process"},{s:"ECE0302",t:"ECE1115",lbl:"HPC"},
  {s:"ECE1110",t:"ECE1115",lbl:"HPC archi"},{s:"ECE0302",t:"ECE1180",lbl:"simulation"},
  {s:"ECE0302",t:"ECE1155",lbl:"security"},
  {s:"ECE0401",t:"ECE0402",lbl:"builds on"},{s:"ECE0402",t:"ECE1560",lbl:"discrete signals"},
  {s:"ECE1560",t:"ECE1562",lbl:"filter design"},{s:"ECE1560",t:"ECE1390",lbl:"image DSP"},
  {s:"ECE1560",t:"ECE1395",lbl:"ML on signals"},{s:"ECE0402",t:"ECE1472",lbl:"analog comms"},
  {s:"ECE0402",t:"ECE1473",lbl:"digital comms"},{s:"ECE1472",t:"ECE1473",lbl:"related"},
  {s:"ECE1473",t:"ECE1150",lbl:"networking"},
  {s:"ECE0101",t:"ECE1701",lbl:"AC power"},{s:"ECE1701",t:"ECE1710",lbl:"distribution"},
  {s:"ECE1701",t:"ECE1771",lbl:"machinery"},{s:"ECE1701",t:"ECE1773",lbl:"generation"},
  {s:"ECE1701",t:"ECE1774",lbl:"analysis"},{s:"ECE1750",t:"ECE1776",lbl:"microgrid"},
  {s:"ECE1710",t:"ECE1776",lbl:"smart grid"},{s:"ECE1771",t:"ECE1775",lbl:"power quality"},
  {s:"ECE1259",t:"ECE1266",lbl:"waves"},{s:"ECE1259",t:"ECE1232",lbl:"photonics"},
  {s:"ECE1232",t:"ECE1272",lbl:"silicon photonics"},{s:"ECE1259",t:"ECE1272",lbl:"EM basis"},
  {s:"ECE1673",t:"ECE1675",lbl:"robot control"},{s:"ECE1673",t:"ECE1674",lbl:"mechatronics"},
  {s:"ECE1674",t:"ECE1675",lbl:"related"},
  {s:"ECE1247",t:"ECE1192",lbl:"device→IC"},{s:"ECE1247",t:"ECE1238",lbl:"switching"},
  {s:"ECE1250",t:"ECE1251",lbl:"fabrication"},{s:"ECE1247",t:"ECE1250",lbl:"device physics"},
  {s:"ECE1895",t:"ECE1896",lbl:"design sequence"},
];

function initNodePos() {
  const byYr = {};
  nodes.forEach(n => (byYr[n.yr] || (byYr[n.yr]=[])).push(n));
  const m = {};
  Object.entries(byYr).forEach(([yr,ns]) => {
    const cx = YEAR_X[yr] || 900;
    const step = Math.min(58,(GH-60)/ns.length);
    const sh = (GH-(step*(ns.length-1)))/2;
    ns.forEach((n,i) => m[n.id]={x:cx+(Math.random()-.5)*25,y:sh+i*step+(Math.random()-.5)*8,vx:0,vy:0});
  });
  return m;
}

function runForce(posMap, edgeList, iters=380) {
  const ids = nodes.map(n => n.id);
  const p = ids.map(id => ({...posMap[id]}));
  const idx = id => ids.indexOf(id);
  for (let it=0; it<iters; it++) {
    for (let i=0; i<p.length; i++) for (let j=i+1; j<p.length; j++) {
      const dx=p[j].x-p[i].x, dy=p[j].y-p[i].y, d=Math.sqrt(dx*dx+dy*dy)||1;
      const f=4200/(d*d);
      p[i].vx-=f*dx/d; p[i].vy-=f*dy/d; p[j].vx+=f*dx/d; p[j].vy+=f*dy/d;
    }
    for (const e of edgeList) {
      const si=idx(e.s),ti=idx(e.t); if(si<0||ti<0) continue;
      const dx=p[ti].x-p[si].x,dy=p[ti].y-p[si].y,d=Math.sqrt(dx*dx+dy*dy)||1;
      const f=(d-85)*0.03;
      p[si].vx+=f*dx/d; p[si].vy+=f*dy/d; p[ti].vx-=f*dx/d; p[ti].vy-=f*dy/d;
    }
    for (let i=0; i<nodes.length; i++) {
      const cx = YEAR_X[nodes[i].yr] || 900;
      p[i].vx += (cx-p[i].x)*0.13; p[i].vy += (GH/2-p[i].y)*0.003;
      p[i].x += p[i].vx*0.3; p[i].y += p[i].vy*0.3;
      p[i].vx *= 0.72; p[i].vy *= 0.72;
      p[i].x = Math.max(NR+5,Math.min(GW-NR-5,p[i].x));
      p[i].y = Math.max(NR+5,Math.min(GH-NR-5,p[i].y));
    }
  }
  const r = {}; ids.forEach((id,i) => r[id]=p[i]); return r;
}

const nodeInit = initNodePos();
const prereqPos = runForce(nodeInit, prereqEdges);
const topicPos  = runForce(nodeInit, topicEdges);

// ═══════════════════════════════════════════════════════
//  CLUSTER VIEW
// ═══════════════════════════════════════════════════════
function ClusterView() {
  const [positions, setPositions] = useState(initClusterPositions);
  const [dragging, setDragging] = useState(null);
  const [selected, setSelected] = useState(null);
  const [hovered, setHovered] = useState(null);
  const svgRef = useRef();
  const dragOffset = useRef({x:0,y:0});

  const onMouseDown = useCallback((e,i) => {
    e.preventDefault(); e.stopPropagation();
    const svg = svgRef.current.getBoundingClientRect();
    dragOffset.current = {x:positions[i].x-(e.clientX-svg.left), y:positions[i].y-(e.clientY-svg.top)};
    setDragging(i);
  },[positions]);

  useEffect(() => {
    const onMove = e => {
      if (dragging===null) return;
      const svg = svgRef.current?.getBoundingClientRect(); if (!svg) return;
      const x = Math.max(NODE_R+5,Math.min(CW-NODE_R-5,e.clientX-svg.left+dragOffset.current.x));
      const y = Math.max(NODE_R+5,Math.min(CH-NODE_R-5,e.clientY-svg.top+dragOffset.current.y));
      setPositions(p => p.map((pos,i) => i===dragging ? {...pos,x,y} : pos));
    };
    const onUp = () => setDragging(null);
    window.addEventListener("mousemove",onMove); window.addEventListener("mouseup",onUp);
    return () => { window.removeEventListener("mousemove",onMove); window.removeEventListener("mouseup",onUp); };
  },[dragging]);

  const getPos = id => { const i = CLUSTERS.findIndex(c => c.id===id); return positions[i]; };

  const edgePath = (s,t) => {
    if (!s||!t) return "";
    const dx=t.x-s.x,dy=t.y-s.y,d=Math.sqrt(dx*dx+dy*dy)||1;
    const mx=s.x+dx/2-dy/d*25,my=s.y+dy/2+dx/d*25;
    return `M${s.x},${s.y} Q${mx},${my} ${t.x},${t.y}`;
  };

  const activeCluster = selected ?? hovered;
  const activeCl = activeCluster ? CLUSTERS.find(c => c.id===activeCluster) : null;

  return (
    <div style={{display:"flex",gap:14,alignItems:"flex-start"}}>
      <div style={{flex:1,background:"#1e293b",borderRadius:12,border:"1px solid #334155",overflow:"hidden"}}>
        <svg ref={svgRef} width="100%" viewBox={`0 0 ${CW} ${CH}`} style={{display:"block",cursor:dragging!==null?"grabbing":"default"}}>
          <defs>
            {CLUSTERS.map(c => (
              <marker key={c.id} id={`carr-${c.id}`} markerWidth="7" markerHeight="7" refX="5" refY="3" orient="auto">
                <path d="M0,0 L0,6 L7,3 z" fill={c.color+"88"}/>
              </marker>
            ))}
          </defs>
          {CLUSTER_EDGES.map((e,i) => {
            const s=getPos(e.source),t=getPos(e.target);
            const isActive = activeCluster && (e.source===activeCluster||e.target===activeCluster);
            const sc = CLUSTERS.find(c => c.id===e.source);
            return (
              <g key={i} opacity={activeCluster&&!isActive?0.06:isActive?1:0.25}>
                <path d={edgePath(s,t)} fill="none"
                  stroke={isActive?(sc?.color||"#94a3b8"):"#475569"}
                  strokeWidth={isActive?2:1.5}
                  markerEnd={`url(#carr-${e.target})`}
                  strokeDasharray={isActive?"none":"4 3"}/>
                {e.label && isActive && (()=>{
                  const dx=t.x-s.x,dy=t.y-s.y,d=Math.sqrt(dx*dx+dy*dy)||1;
                  const mx=s.x+dx/2-dy/d*25,my=s.y+dy/2+dx/d*25;
                  return <text x={mx} y={my-6} fill="#94a3b8" fontSize={10} textAnchor="middle" style={{pointerEvents:"none"}}>{e.label}</text>;
                })()}
              </g>
            );
          })}
          {CLUSTERS.map((c,i) => {
            const p = positions[i];
            const isActive = activeCluster===c.id;
            const isRelated = activeCluster && CLUSTER_EDGES.some(e=>(e.source===activeCluster&&e.target===c.id)||(e.target===activeCluster&&e.source===c.id));
            const dim = activeCluster && !isActive && !isRelated;
            const badge = CLUSTER_BADGE[c.id];
            return (
              <g key={c.id} transform={`translate(${p.x},${p.y})`}
                onMouseDown={e=>onMouseDown(e,i)}
                onMouseEnter={()=>setHovered(c.id)}
                onMouseLeave={()=>setHovered(null)}
                onClick={()=>setSelected(selected===c.id?null:c.id)}
                style={{cursor:"pointer"}} opacity={dim?0.15:1}>
                <circle r={NODE_R+5} fill={c.color+"12"}/>
                <circle r={NODE_R} fill={isActive?c.color+"55":c.color+"25"} stroke={c.color} strokeWidth={isActive?3:1.5}/>
                <text textAnchor="middle" fill="#f1f5f9" fontSize={10.5} fontWeight={700} style={{pointerEvents:"none",userSelect:"none"}}>
                  {c.label.split("\n").map((line,li,arr) => (
                    <tspan key={li} x="0" dy={li===0?`${-(arr.length-1)*7}px`:"14px"}>{line}</tspan>
                  ))}
                </text>
                <text textAnchor="middle" dy={`${NODE_R*0.58}px`} fill={c.color} fontSize={9.5} style={{pointerEvents:"none",userSelect:"none"}}>
                  {c.courses.length} courses
                </text>
                {badge && (
                  <g>
                    <rect x={-18} y={-NODE_R-16} width={36} height={13} rx={6} fill={c.color}/>
                    <text x={0} y={-NODE_R-6} textAnchor="middle" fill="#fff" fontSize={8} fontWeight={800} style={{pointerEvents:"none",userSelect:"none"}}>{badge}</text>
                  </g>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      {/* Sidebar */}
      <div style={{width:240,background:"#1e293b",borderRadius:12,border:"1px solid #334155",padding:14,minHeight:280,flexShrink:0}}>
        {activeCl ? (
          <>
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4}}>
              <div style={{width:11,height:11,borderRadius:"50%",background:activeCl.color,flexShrink:0}}/>
              <span style={{fontWeight:700,fontSize:"0.88rem",color:activeCl.color}}>{activeCl.label.replace("\n"," ")}</span>
            </div>
            {CLUSTER_BADGE[activeCl.id] && (
              <span style={{display:"inline-block",background:activeCl.color,color:"#fff",borderRadius:10,padding:"1px 8px",fontSize:"0.68rem",fontWeight:700,marginBottom:8}}>{CLUSTER_BADGE[activeCl.id]}</span>
            )}
            <div style={{fontSize:"0.7rem",color:"#64748b",marginBottom:6,textTransform:"uppercase",letterSpacing:"0.05em",marginTop:6}}>Courses</div>
            <div style={{display:"flex",flexDirection:"column",gap:4,marginBottom:14,maxHeight:300,overflowY:"auto"}}>
              {activeCl.courses.map(code => (
                <div key={code} style={{background:activeCl.color+"18",border:`1px solid ${activeCl.color}33`,borderRadius:7,padding:"4px 9px"}}>
                  <div style={{color:activeCl.color,fontSize:"0.7rem",fontWeight:700}}>{code}</div>
                  <div style={{color:"#94a3b8",fontSize:"0.68rem"}}>{COURSE_DETAILS[code]||""}</div>
                </div>
              ))}
            </div>
            {(()=>{
              const related = CLUSTER_EDGES.filter(e=>e.source===activeCluster||e.target===activeCluster)
                .map(e=>e.source===activeCluster?e.target:e.source);
              return related.length>0 && (
                <>
                  <div style={{fontSize:"0.7rem",color:"#64748b",marginBottom:6,textTransform:"uppercase",letterSpacing:"0.05em"}}>Connected to</div>
                  <div style={{display:"flex",flexWrap:"wrap",gap:4}}>
                    {related.map(rid => {
                      const rc = CLUSTERS.find(c=>c.id===rid);
                      return rc ? (
                        <span key={rid} onClick={()=>setSelected(rid)}
                          style={{background:rc.color+"22",border:`1px solid ${rc.color}55`,borderRadius:20,padding:"3px 9px",fontSize:"0.68rem",color:rc.color,cursor:"pointer"}}>
                          {rc.label.replace("\n"," ")}
                        </span>
                      ) : null;
                    })}
                  </div>
                </>
              );
            })()}
          </>
        ) : (
          <div style={{color:"#475569",fontSize:"0.82rem",textAlign:"center",marginTop:40,lineHeight:1.7}}>
            Click any cluster to explore its courses and connections
          </div>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
//  NODE-LEVEL GRAPH VIEW
// ═══════════════════════════════════════════════════════
function NodeGraph({ posInit, edgeList, colorBy, filterKey, filterVal }) {
  const [pos, setPos] = useState(posInit);
  const [hover, setHover] = useState(null);
  const dragging = useRef(null);
  const dragOff = useRef({x:0,y:0});
  const svgRef = useRef();

  useEffect(() => setPos(posInit), [posInit]);

  const neighbors = hover
    ? new Set([hover,...edgeList.filter(e=>e.s===hover||e.t===hover).flatMap(e=>[e.s,e.t])])
    : null;

  const visIds = filterVal && filterVal!=="All"
    ? new Set(nodes.filter(n=>n[filterKey]===filterVal).map(n=>n.id))
    : null;

  const onMD = useCallback((e,id) => {
    e.preventDefault();
    const r=svgRef.current.getBoundingClientRect();
    dragOff.current={x:pos[id].x-(e.clientX-r.left),y:pos[id].y-(e.clientY-r.top)};
    dragging.current=id;
  },[pos]);

  useEffect(() => {
    const mv = e => {
      if (!dragging.current) return;
      const r=svgRef.current?.getBoundingClientRect(); if (!r) return;
      const x=Math.max(NR+5,Math.min(GW-NR-5,e.clientX-r.left+dragOff.current.x));
      const y=Math.max(NR+5,Math.min(GH-NR-5,e.clientY-r.top+dragOff.current.y));
      setPos(p=>({...p,[dragging.current]:{...p[dragging.current],x,y}}));
    };
    const up = () => { dragging.current=null; };
    window.addEventListener("mousemove",mv); window.addEventListener("mouseup",up);
    return () => { window.removeEventListener("mousemove",mv); window.removeEventListener("mouseup",up); };
  },[]);

  const colOf = n => colorBy==="subfield" ? SUBFIELD_COLORS[n.subfield] : YEAR_COLORS[n.yr];

  return (
    <div style={{position:"relative",background:"#1e293b",borderRadius:12,border:"1px solid #334155",overflow:"hidden"}}>
      <svg ref={svgRef} width="100%" viewBox={`0 0 ${GW} ${GH}`} style={{display:"block",cursor:"default"}}>
        <defs>
          {nodes.map(n => {
            const col=colOf(n);
            return <marker key={n.id} id={`na-${n.id}`} markerWidth="5" markerHeight="5" refX="4" refY="2.5" orient="auto">
              <path d="M0,0 L0,5 L5,2.5 z" fill={col+"bb"}/>
            </marker>;
          })}
        </defs>
        {Object.values(YEAR_X).map((cx,i) => (
          <line key={i} x1={cx+70} y1={8} x2={cx+70} y2={GH-8} stroke="#ffffff07" strokeWidth={1}/>
        ))}
        {edgeList.map((e,i) => {
          const sp=pos[e.s],tp=pos[e.t]; if (!sp||!tp) return null;
          if (visIds&&!visIds.has(e.s)&&!visIds.has(e.t)) return null;
          const isHlit = neighbors ? (neighbors.has(e.s)&&neighbors.has(e.t)) : true;
          const dx=tp.x-sp.x,dy=tp.y-sp.y,d=Math.sqrt(dx*dx+dy*dy)||1;
          const ex=tp.x-dx/d*NR,ey=tp.y-dy/d*NR;
          const mx=(sp.x+tp.x)/2,my=(sp.y+tp.y)/2,ox=-dy/d*18,oy=dx/d*18;
          const tn=nodes.find(n=>n.id===e.t);
          const col=colOf(tn);
          return <path key={i}
            d={`M${sp.x},${sp.y} Q${mx+ox},${my+oy} ${ex},${ey}`}
            fill="none"
            stroke={isHlit?col+"99":"#1e293b"}
            strokeWidth={isHlit?1.5:0.4}
            markerEnd={isHlit?`url(#na-${e.t})`:undefined}
            style={{transition:"stroke 0.12s"}}/>;
        })}
        {nodes.map(n => {
          const p=pos[n.id]; if (!p) return null;
          const dimmed=(visIds&&!visIds.has(n.id))||(neighbors&&!neighbors.has(n.id));
          const col=colOf(n);
          const isReq=["Y1","Y2","Y3","Y4"].includes(n.yr);
          return (
            <g key={n.id} transform={`translate(${p.x},${p.y})`}
              onMouseDown={e=>onMD(e,n.id)}
              onMouseEnter={()=>setHover(n.id)}
              onMouseLeave={()=>setHover(null)}
              style={{cursor:"grab",opacity:dimmed?0.1:1,transition:"opacity 0.12s"}}>
              <circle r={NR+3} fill={col+"12"}/>
              <circle r={NR} fill={col+"2a"} stroke={col}
                strokeWidth={hover===n.id?2.5:isReq?1.8:1.2}
                strokeDasharray={isReq?"none":"4 2"}/>
              <text textAnchor="middle" dy="-0.3em" fontSize={7} fontWeight={600} fill="#94a3b8"
                style={{pointerEvents:"none",userSelect:"none"}}>
                {n.label.match(/^[A-Z]+/)?.[0]}
              </text>
              <text textAnchor="middle" dy="0.75em" fontSize={8} fontWeight={700} fill="#f1f5f9"
                style={{pointerEvents:"none",userSelect:"none"}}>
                {n.label.replace(/^[A-Z]+ /,"")}
              </text>
            </g>
          );
        })}
      </svg>
      {hover && pos[hover] && (()=>{
        const n=nodes.find(x=>x.id===hover);
        const pre=prereqEdges.filter(e=>e.t===hover).map(e=>e.s);
        const unl=prereqEdges.filter(e=>e.s===hover).map(e=>e.t);
        const col=colOf(n);
        const px=pos[hover].x/GW*100, py=pos[hover].y/GH*100;
        return (
          <div style={{position:"absolute",
            left:Math.min(Math.max(px,10),72)+"%",top:Math.max(py-22,2)+"%",
            transform:"translate(-50%,-100%)",
            background:"#0f172a",border:`1px solid ${col}77`,borderRadius:10,
            padding:"9px 13px",fontSize:"0.76rem",maxWidth:240,pointerEvents:"none",zIndex:20,
            boxShadow:"0 6px 24px #00000088"}}>
            <div style={{fontWeight:800,color:col,marginBottom:2}}>{n.label}</div>
            <div style={{color:"#cbd5e1",marginBottom:5,lineHeight:1.35}}>{n.desc}</div>
            <div style={{color:"#64748b",fontSize:"0.68rem",lineHeight:1.6}}>
              <span style={{color:"#94a3b8"}}>Subfield: </span><span style={{color:SUBFIELD_COLORS[n.subfield]}}>{n.subfield}</span><br/>
              <span style={{color:"#94a3b8"}}>Year: </span>{YEAR_LABELS[n.yr]}<br/>
              {pre.length>0&&<><span style={{color:"#94a3b8"}}>Prereqs: </span>{pre.join(", ")}<br/></>}
              {unl.length>0&&<><span style={{color:"#94a3b8"}}>Unlocks: </span>{unl.slice(0,6).join(", ")}{unl.length>6?"…":""}</>}
            </div>
          </div>
        );
      })()}
    </div>
  );
}

// ═══════════════════════════════════════════════════════
//  ROOT APP
// ═══════════════════════════════════════════════════════
const VIEWS = [
  { key:"cluster",  label:"🗂 Cluster Map",      desc:"Topic clusters and how they relate to each other" },
  { key:"subfield", label:"🎨 Sub-field Map",     desc:"Individual courses colored by ECE sub-field, with topical connections" },
  { key:"prereq",   label:"🔗 Prerequisite Map",  desc:"Formal prerequisite chains, organized by academic year" },
];

export default function App() {
  const [view, setView] = useState("cluster");

  // Node-level sub-state
  const [sfFilter, setSfFilter] = useState("All");
  const [yrFilter, setYrFilter] = useState("All");

  const isSubfield = view==="subfield";
  const isPrereq   = view==="prereq";
  const isNodeView = isSubfield || isPrereq;

  const sfOptions = ["All",...Object.keys(SUBFIELD_COLORS)];
  const yrOptions = ["All",...Object.keys(YEAR_LABELS).map(k=>YEAR_LABELS[k])];
  const filterOptions = isSubfield ? sfOptions : yrOptions;
  const filterVal     = isSubfield ? sfFilter : yrFilter;
  const setFilter     = isSubfield ? setSfFilter : setYrFilter;
  const filterValMapped = isSubfield ? filterVal
    : (Object.entries(YEAR_LABELS).find(([k,v])=>v===filterVal)||[])[0] || filterVal;

  const legend = isSubfield
    ? SUBFIELD_COLORS
    : isPrereq
      ? Object.fromEntries(Object.entries(YEAR_COLORS).map(([k,v])=>[YEAR_LABELS[k],v]))
      : {};

  return (
    <div style={{fontFamily:"system-ui,sans-serif",background:"#0f172a",minHeight:"100vh",color:"#e2e8f0",padding:"18px 16px",boxSizing:"border-box"}}>
      {/* Header */}
      <div style={{textAlign:"center",marginBottom:18}}>
        <h1 style={{fontSize:"1.35rem",fontWeight:800,margin:"0 0 4px",
          background:"linear-gradient(135deg,#6366f1,#3b82f6,#ec4899)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>
          ECE Undergraduate Course Map
        </h1>
        <p style={{color:"#475569",fontSize:"0.75rem",margin:0}}>
          University of Pittsburgh · Swanson School of Engineering
        </p>
      </div>

      {/* View switcher */}
      <div style={{maxWidth:1160,margin:"0 auto 14px",display:"flex",gap:8,justifyContent:"center",flexWrap:"wrap"}}>
        {VIEWS.map(v => (
          <button key={v.key} onClick={()=>setView(v.key)} style={{
            padding:"8px 18px",borderRadius:24,cursor:"pointer",fontWeight:view===v.key?700:500,
            fontSize:"0.82rem",border:"1px solid",transition:"all 0.15s",
            borderColor: view===v.key ? "#6366f1" : "#334155",
            background: view===v.key ? "#6366f133" : "#1e293b",
            color: view===v.key ? "#a5b4fc" : "#64748b",
            boxShadow: view===v.key ? "0 0 12px #6366f144" : "none",
          }}>{v.label}</button>
        ))}
      </div>

      {/* Description strip */}
      <div style={{maxWidth:1160,margin:"0 auto 12px",background:"#1e2d3d",
        borderLeft:"3px solid #6366f1",borderRadius:"0 6px 6px 0",
        padding:"8px 14px",fontSize:"0.74rem",color:"#94a3b8",border:"1px solid #334155",borderLeft:"3px solid #6366f1"}}>
        {VIEWS.find(v=>v.key===view)?.desc}
        {isNodeView && " · Hover to highlight · Drag to rearrange · Filter below"}
        {view==="cluster" && " · Click a cluster to see its courses · Drag nodes to rearrange"}
      </div>

      {/* Filter bar (node views only) */}
      {isNodeView && (
        <div style={{maxWidth:1160,margin:"0 auto 10px",display:"flex",flexWrap:"wrap",gap:5}}>
          {filterOptions.map(f => {
            const col = isSubfield
              ? (f==="All"?"#475569":SUBFIELD_COLORS[f])
              : (f==="All"?"#475569":Object.values(YEAR_COLORS)[Object.values(YEAR_LABELS).indexOf(f)]);
            return (
              <button key={f} onClick={()=>setFilter(f)} style={{
                background: filterVal===f ? (col||"#475569")+"cc" : "#1e293b",
                color: filterVal===f ? "#fff" : "#94a3b8",
                border:`1px solid ${(col||"#475569")}44`,
                borderRadius:20,padding:"2px 11px",fontSize:"0.72rem",cursor:"pointer",
                fontWeight: filterVal===f ? 700 : 400,
              }}>{f}</button>
            );
          })}
        </div>
      )}

      {/* Column labels (node views only) */}
      {isNodeView && (
        <div style={{maxWidth:1160,margin:"0 auto 2px",position:"relative",height:18}}>
          {Object.entries(YEAR_X).map(([yr,cx]) => (
            <div key={yr} style={{position:"absolute",left:(cx/(GW)*100)+"%",transform:"translateX(-50%)",
              fontSize:"0.65rem",color:YEAR_COLORS[yr],fontWeight:700,letterSpacing:"0.06em",textTransform:"uppercase"}}>
              {YEAR_LABELS[yr]}
            </div>
          ))}
        </div>
      )}

      {/* Main content */}
      <div style={{maxWidth:1160,margin:"0 auto"}}>
        {view==="cluster" && <ClusterView/>}
        {view==="subfield" && (
          <NodeGraph key="sf" posInit={topicPos} edgeList={topicEdges} colorBy="subfield"
            filterKey="subfield" filterVal={sfFilter}/>
        )}
        {view==="prereq" && (
          <NodeGraph key="pr" posInit={prereqPos} edgeList={prereqEdges} colorBy="yr"
            filterKey="yr" filterVal={filterValMapped}/>
        )}
      </div>

      {/* Legend */}
      {isNodeView && (
        <div style={{maxWidth:1160,margin:"10px auto 0",display:"flex",gap:8,flexWrap:"wrap",justifyContent:"center"}}>
          {Object.entries(legend).map(([name,col]) => (
            <span key={name} style={{fontSize:"0.7rem",color:col,display:"flex",alignItems:"center",gap:4}}>
              <span style={{width:9,height:9,borderRadius:"50%",background:col+"33",border:`1.5px solid ${col}`,display:"inline-block"}}/>
              {name}
            </span>
          ))}
          {isPrereq && (
            <span style={{fontSize:"0.7rem",color:"#475569",display:"flex",alignItems:"center",gap:4,marginLeft:6}}>
              <span style={{width:9,height:9,borderRadius:"50%",border:"1.5px dashed #475569",display:"inline-block"}}/>
              Elective
            </span>
          )}
        </div>
      )}

      {/* Cluster-view legend */}
      {view==="cluster" && (
        <div style={{maxWidth:1160,margin:"10px auto 0",display:"flex",flexWrap:"wrap",gap:5,justifyContent:"center"}}>
          {CLUSTERS.map(c => (
            <span key={c.id} style={{background:c.color+"22",border:`1px solid ${c.color}55`,
              borderRadius:20,padding:"3px 11px",fontSize:"0.72rem",color:c.color}}>
              {CLUSTER_BADGE[c.id]?"★ ":""}{c.label.replace("\n"," ")}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
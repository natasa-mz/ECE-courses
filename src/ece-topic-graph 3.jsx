import { useState, useRef, useCallback, useEffect } from "react";

const W = 1100, H = 700;
const NR = 19;

// ── Sub-field taxonomy ─────────────────────────────────────────────────
const SUBFIELD_COLORS = {
  "Foundations":       "#6366f1",
  "Circuits & Electronics": "#f59e0b",
  "Digital Systems":   "#3b82f6",
  "Software & Algorithms": "#10b981",
  "Signals & DSP":     "#ec4899",
  "Communications":    "#14b8a6",
  "Power Systems":     "#ef4444",
  "Control & Robotics":"#8b5cf6",
  "EM & Photonics":    "#f97316",
  "Semiconductors & VLSI": "#84cc16",
  "Nanotechnology":    "#e879f9",
  "Design Projects":   "#94a3b8",
};

// ── Year colors ────────────────────────────────────────────────────────
const YEAR_COLORS = {
  "Y1":"#6366f1","Y2":"#3b82f6","Y3":"#10b981","Y4":"#f59e0b","EL":"#ec4899"
};
const YEAR_LABELS = {"Y1":"Year 1","Y2":"Year 2","Y3":"Year 3","Y4":"Year 4","EL":"Elective"};

// ── All nodes ──────────────────────────────────────────────────────────
const nodes = [
  // Year 1
  {id:"MATH0220",label:"MATH 0220",desc:"Calculus I",                          subfield:"Foundations",yr:"Y1"},
  {id:"MATH0230",label:"MATH 0230",desc:"Calculus II",                         subfield:"Foundations",yr:"Y1"},
  {id:"MATH0240",label:"MATH 0240",desc:"Calculus III",                        subfield:"Foundations",yr:"Y2"},
  {id:"PHYS0174",label:"PHYS 0174",desc:"Physics I",                           subfield:"Foundations",yr:"Y1"},
  {id:"PHYS0175",label:"PHYS 0175",desc:"Physics II",                          subfield:"Foundations",yr:"Y1"},
  {id:"ENGR0011",label:"ENGR 0011",desc:"Intro Engineering Analysis",           subfield:"Foundations",yr:"Y1"},
  {id:"ENGR0012",label:"ENGR 0012",desc:"Intro Engineering Computing",          subfield:"Foundations",yr:"Y1"},
  // Year 2 (Sophomore)
  {id:"ECE0101",label:"ECE 0101",desc:"Linear Circuits & Systems",              subfield:"Circuits & Electronics",yr:"Y2"},
  {id:"ECE0102",label:"ECE 0102",desc:"Microelectronic Circuits",               subfield:"Circuits & Electronics",yr:"Y2"},
  {id:"ECE0201",label:"ECE 0201",desc:"Digital Circuits & Systems",             subfield:"Digital Systems",yr:"Y2"},
  {id:"ECE0202",label:"ECE 0202",desc:"Embedded Processors & Interfacing",      subfield:"Digital Systems",yr:"Y2"},
  {id:"ECE0301",label:"ECE 0301",desc:"ECE Problem Solving with C++",           subfield:"Software & Algorithms",yr:"Y2"},
  {id:"ECE0302",label:"ECE 0302",desc:"Data Structures & Algorithms",           subfield:"Software & Algorithms",yr:"Y2"},
  {id:"ECE0401",label:"ECE 0401",desc:"ECE Analytical Methods",                 subfield:"Foundations",yr:"Y2"},
  {id:"ECE0402",label:"ECE 0402",desc:"Signals, Systems & Probability",         subfield:"Signals & DSP",yr:"Y2"},
  // Year 3 (Junior)
  {id:"ECE1212",label:"ECE 1212",desc:"Electronic Circuit Design Lab",          subfield:"Circuits & Electronics",yr:"Y3"},
  {id:"ECE1247",label:"ECE 1247",desc:"Semiconductor Device Theory",            subfield:"Semiconductors & VLSI",yr:"Y3"},
  {id:"ECE1259",label:"ECE 1259",desc:"Electromagnetics",                       subfield:"EM & Photonics",yr:"Y3"},
  {id:"ECE1560",label:"ECE 1560",desc:"Digital Signal Processing",              subfield:"Signals & DSP",yr:"Y3"},
  {id:"ECE1673",label:"ECE 1673",desc:"Linear Control Systems",                 subfield:"Control & Robotics",yr:"Y3"},
  {id:"ECE1701",label:"ECE 1701",desc:"Fundamentals of Electric Power Engineering",subfield:"Power Systems",yr:"Y3"},
  {id:"ECE1895",label:"ECE 1895",desc:"Junior Design Fundamentals",             subfield:"Design Projects",yr:"Y3"},
  // Year 4
  {id:"ECE1896",label:"ECE 1896",desc:"Senior Design Project",                  subfield:"Design Projects",yr:"Y4"},
  // Electives
  {id:"ECE1110",label:"ECE 1110",desc:"Computer Organization & Architecture",   subfield:"Digital Systems",yr:"EL"},
  {id:"ECE1115",label:"ECE 1115",desc:"High Performance Computing",             subfield:"Software & Algorithms",yr:"EL"},
  {id:"ECE1140",label:"ECE 1140",desc:"Systems & Project Engineering",          subfield:"Software & Algorithms",yr:"EL"},
  {id:"ECE1145",label:"ECE 1145",desc:"Software Construction & Evolution",      subfield:"Software & Algorithms",yr:"EL"},
  {id:"ECE1147",label:"ECE 1147",desc:"Algorithms for Big Data",                subfield:"Software & Algorithms",yr:"EL"},
  {id:"ECE1148",label:"ECE 1148",desc:"Algorithmic Thinking",                   subfield:"Software & Algorithms",yr:"EL"},
  {id:"ECE1150",label:"ECE 1150",desc:"Computer Networks",                      subfield:"Communications",yr:"EL"},
  {id:"ECE1155",label:"ECE 1155",desc:"Information Security",                   subfield:"Software & Algorithms",yr:"EL"},
  {id:"ECE1165",label:"ECE 1165",desc:"Dependable Systems",                     subfield:"Digital Systems",yr:"EL"},
  {id:"ECE1166",label:"ECE 1166",desc:"Parallel Systems",                       subfield:"Digital Systems",yr:"EL"},
  {id:"ECE1175",label:"ECE 1175",desc:"Embedded Systems Design",                subfield:"Digital Systems",yr:"EL"},
  {id:"ECE1180",label:"ECE 1180",desc:"Computational Modeling & Simulation",    subfield:"Software & Algorithms",yr:"EL"},
  {id:"ECE1188",label:"ECE 1188",desc:"Cyber-Physical Systems",                 subfield:"Digital Systems",yr:"EL"},
  {id:"ECE1192",label:"ECE 1192",desc:"Intro to VLSI Design",                   subfield:"Semiconductors & VLSI",yr:"EL"},
  {id:"ECE1193",label:"ECE 1193",desc:"Advanced VLSI Design",                   subfield:"Semiconductors & VLSI",yr:"EL"},
  {id:"ECE1195",label:"ECE 1195",desc:"Advanced Digital Design",                subfield:"Digital Systems",yr:"EL"},
  {id:"ECE1215",label:"ECE 1215",desc:"Electroacoustics & Audio Electronics",   subfield:"Circuits & Electronics",yr:"EL"},
  {id:"ECE1232",label:"ECE 1232",desc:"Intro Lasers & Optical Electronics",     subfield:"EM & Photonics",yr:"EL"},
  {id:"ECE1238",label:"ECE 1238",desc:"Digital Electronics",                    subfield:"Semiconductors & VLSI",yr:"EL"},
  {id:"ECE1250",label:"ECE 1250",desc:"Nanotechnology & Nano-Engineering",      subfield:"Nanotechnology",yr:"EL"},
  {id:"ECE1251",label:"ECE 1251",desc:"Micro & Nano Device Fabrication",        subfield:"Nanotechnology",yr:"EL"},
  {id:"ECE1266",label:"ECE 1266",desc:"Applications of Fields & Waves",         subfield:"EM & Photonics",yr:"EL"},
  {id:"ECE1272",label:"ECE 1272",desc:"Silicon Photonics",                      subfield:"EM & Photonics",yr:"EL"},
  {id:"ECE1286",label:"ECE 1286",desc:"Analog Integrated Circuits",             subfield:"Circuits & Electronics",yr:"EL"},
  {id:"ECE1390",label:"ECE 1390",desc:"Intro to Image Processing",              subfield:"Signals & DSP",yr:"EL"},
  {id:"ECE1395",label:"ECE 1395",desc:"Intro to Machine Learning",              subfield:"Signals & DSP",yr:"EL"},
  {id:"ECE1472",label:"ECE 1472",desc:"Analog Communication Systems",           subfield:"Communications",yr:"EL"},
  {id:"ECE1473",label:"ECE 1473",desc:"Digital Communication Systems",          subfield:"Communications",yr:"EL"},
  {id:"ECE1562",label:"ECE 1562",desc:"Digital & Analog Filters",               subfield:"Signals & DSP",yr:"EL"},
  {id:"ECE1674",label:"ECE 1674",desc:"Mechatronic Systems",                    subfield:"Control & Robotics",yr:"EL"},
  {id:"ECE1675",label:"ECE 1675",desc:"Robotic Control",                        subfield:"Control & Robotics",yr:"EL"},
  {id:"ECE1710",label:"ECE 1710",desc:"Power Distribution & Smart Grids",       subfield:"Power Systems",yr:"EL"},
  {id:"ECE1750",label:"ECE 1750",desc:"Power Electronics Conversion",           subfield:"Power Systems",yr:"EL"},
  {id:"ECE1771",label:"ECE 1771",desc:"Electric Machinery",                     subfield:"Power Systems",yr:"EL"},
  {id:"ECE1773",label:"ECE 1773",desc:"Power Generation, Operation & Control",  subfield:"Power Systems",yr:"EL"},
  {id:"ECE1774",label:"ECE 1774",desc:"Computer Analysis of Power Systems",     subfield:"Power Systems",yr:"EL"},
  {id:"ECE1775",label:"ECE 1775",desc:"Power Quality",                          subfield:"Power Systems",yr:"EL"},
  {id:"ECE1776",label:"ECE 1776",desc:"Microgrid & Distributed Generation",     subfield:"Power Systems",yr:"EL"},
  {id:"ECE1893",label:"ECE 1893",desc:"Undergraduate Research Project",         subfield:"Design Projects",yr:"EL"},
  {id:"ECE1894",label:"ECE 1894",desc:"Undergraduate Industry Project",         subfield:"Design Projects",yr:"EL"},
];

// ── Prerequisite edges ────────────────────────────────────────────────
const prereqEdges = [
  {s:"MATH0220",t:"MATH0230"},{s:"PHYS0174",t:"PHYS0175"},
  {s:"MATH0220",t:"ECE0101"},{s:"PHYS0175",t:"ECE0101"},
  {s:"PHYS0175",t:"ECE0201"},{s:"ENGR0012",t:"ECE0201"},
  {s:"ENGR0012",t:"ECE0301"},
  {s:"MATH0230",t:"ECE0401"},{s:"ENGR0012",t:"ECE0401"},
  {s:"ECE0101",t:"ECE0102"},
  {s:"ECE0201",t:"ECE0202"},{s:"ECE0301",t:"ECE0202"},
  {s:"ECE0301",t:"ECE0302"},
  {s:"ECE0401",t:"ECE0402"},
  {s:"MATH0230",t:"MATH0240"},
  // Y3 required
  {s:"ECE0102",t:"ECE1212"},
  {s:"ECE0402",t:"ECE1247"},
  {s:"MATH0240",t:"ECE1259"},{s:"ECE0402",t:"ECE1259"},
  {s:"ECE0402",t:"ECE1560"},
  {s:"ECE0402",t:"ECE1673"},
  {s:"ECE0102",t:"ECE1701"},
  {s:"ECE0102",t:"ECE1895"},{s:"ECE0202",t:"ECE1895"},{s:"ECE0302",t:"ECE1895"},{s:"ECE0402",t:"ECE1895"},
  // Y4
  {s:"ECE1895",t:"ECE1896"},
  // Electives
  {s:"ECE0202",t:"ECE1110"},
  {s:"ECE0202",t:"ECE1115"},{s:"ECE0302",t:"ECE1115"},
  {s:"ECE0202",t:"ECE1140"},{s:"ECE0302",t:"ECE1140"},
  {s:"ECE0302",t:"ECE1145"},
  {s:"ECE0302",t:"ECE1147"},{s:"ECE0402",t:"ECE1147"},
  {s:"ECE0302",t:"ECE1148"},
  {s:"ECE0302",t:"ECE1150"},{s:"ECE0402",t:"ECE1150"},
  {s:"ECE0202",t:"ECE1155"},{s:"ECE0302",t:"ECE1155"},
  {s:"ECE1110",t:"ECE1165"},{s:"ECE1673",t:"ECE1165"},
  {s:"ECE0202",t:"ECE1166"},{s:"ECE0302",t:"ECE1166"},
  {s:"ECE0202",t:"ECE1175"},
  {s:"ECE0302",t:"ECE1180"},
  {s:"ECE0202",t:"ECE1188"},{s:"ECE0302",t:"ECE1188"},
  {s:"ECE0201",t:"ECE1192"},{s:"ECE0102",t:"ECE1192"},
  {s:"ECE1192",t:"ECE1193"},
  {s:"ECE0202",t:"ECE1195"},
  {s:"ECE0102",t:"ECE1215"},{s:"ECE0402",t:"ECE1215"},
  {s:"ECE0101",t:"ECE1232"},{s:"ECE1259",t:"ECE1232"},
  {s:"ECE0201",t:"ECE1238"},{s:"ECE0102",t:"ECE1238"},
  {s:"MATH0230",t:"ECE1250"},{s:"PHYS0175",t:"ECE1250"},
  {s:"ECE1250",t:"ECE1251"},
  {s:"ECE1259",t:"ECE1266"},
  {s:"ECE1259",t:"ECE1272"},
  {s:"ECE0102",t:"ECE1286"},
  {s:"ECE0402",t:"ECE1390"},
  {s:"ECE0402",t:"ECE1395"},{s:"ECE0301",t:"ECE1395"},
  {s:"ECE0402",t:"ECE1472"},
  {s:"ECE0402",t:"ECE1473"},
  {s:"ECE0402",t:"ECE1562"},
  {s:"ECE0202",t:"ECE1674"},{s:"ECE0402",t:"ECE1674"},
  {s:"ECE0402",t:"ECE1675"},
  {s:"ECE0101",t:"ECE1710"},
  {s:"ECE0102",t:"ECE1750"},{s:"ECE0402",t:"ECE1750"},
  {s:"ECE0102",t:"ECE1771"},
  {s:"ECE1701",t:"ECE1773"},
  {s:"ECE0102",t:"ECE1774"},{s:"ECE0302",t:"ECE1774"},
  {s:"ECE0402",t:"ECE1775"},
  {s:"ECE0402",t:"ECE1776"},
];

// ── Thematic / topic-similarity edges (subfield view) ────────────────
const topicEdges = [
  // Circuits chain
  {s:"ECE0101",t:"ECE0102",lbl:"builds on"},{s:"ECE0102",t:"ECE1212",lbl:"lab extension"},
  {s:"ECE0102",t:"ECE1286",lbl:"advanced analog"},{s:"ECE1212",t:"ECE1286",lbl:"related"},
  {s:"ECE0102",t:"ECE1215",lbl:"audio circuits"},{s:"ECE0102",t:"ECE1750",lbl:"power electronics"},
  // Digital chain
  {s:"ECE0201",t:"ECE0202",lbl:"builds on"},{s:"ECE0202",t:"ECE1110",lbl:"architecture"},
  {s:"ECE1110",t:"ECE1166",lbl:"parallel arch"},{s:"ECE0201",t:"ECE1192",lbl:"VLSI logic"},
  {s:"ECE1192",t:"ECE1193",lbl:"adv VLSI"},{s:"ECE0201",t:"ECE1195",lbl:"FPGA design"},
  {s:"ECE0201",t:"ECE1238",lbl:"device families"},{s:"ECE0202",t:"ECE1175",lbl:"embedded"},
  {s:"ECE0202",t:"ECE1188",lbl:"IoT/CPS"},
  // Software chain
  {s:"ECE0301",t:"ECE0302",lbl:"builds on"},{s:"ECE0302",t:"ECE1148",lbl:"algorithms"},
  {s:"ECE1148",t:"ECE1147",lbl:"big data algs"},{s:"ECE0302",t:"ECE1145",lbl:"SE practice"},
  {s:"ECE0302",t:"ECE1140",lbl:"SE process"},{s:"ECE0302",t:"ECE1115",lbl:"HPC"},
  {s:"ECE1110",t:"ECE1115",lbl:"HPC archi"},{s:"ECE0302",t:"ECE1180",lbl:"simulation"},
  {s:"ECE0302",t:"ECE1155",lbl:"security"},
  // Signals chain
  {s:"ECE0401",t:"ECE0402",lbl:"builds on"},{s:"ECE0402",t:"ECE1560",lbl:"discrete signals"},
  {s:"ECE1560",t:"ECE1562",lbl:"filter design"},{s:"ECE1560",t:"ECE1390",lbl:"image DSP"},
  {s:"ECE1560",t:"ECE1395",lbl:"ML on signals"},{s:"ECE0402",t:"ECE1472",lbl:"analog comms"},
  {s:"ECE0402",t:"ECE1473",lbl:"digital comms"},{s:"ECE1472",t:"ECE1473",lbl:"related"},
  {s:"ECE1473",t:"ECE1150",lbl:"networking"},
  // Power chain
  {s:"ECE0101",t:"ECE1701",lbl:"AC power"},{s:"ECE1701",t:"ECE1710",lbl:"distribution"},
  {s:"ECE1701",t:"ECE1771",lbl:"machinery"},{s:"ECE1701",t:"ECE1773",lbl:"generation"},
  {s:"ECE1701",t:"ECE1774",lbl:"analysis"},{s:"ECE1750",t:"ECE1776",lbl:"microgrid"},
  {s:"ECE1710",t:"ECE1776",lbl:"smart grid"},{s:"ECE1771",t:"ECE1775",lbl:"power quality"},
  // EM / Photonics chain
  {s:"ECE1259",t:"ECE1266",lbl:"waves"},{s:"ECE1259",t:"ECE1232",lbl:"photonics"},
  {s:"ECE1232",t:"ECE1272",lbl:"silicon photonics"},{s:"ECE1259",t:"ECE1272",lbl:"EM basis"},
  // Control / Robotics
  {s:"ECE1673",t:"ECE1675",lbl:"robot control"},{s:"ECE1673",t:"ECE1674",lbl:"mechatronics"},
  {s:"ECE1674",t:"ECE1675",lbl:"related"},
  // Semiconductors
  {s:"ECE1247",t:"ECE1192",lbl:"device→IC"},{s:"ECE1247",t:"ECE1238",lbl:"switching"},
  // Nano
  {s:"ECE1250",t:"ECE1251",lbl:"fabrication"},{s:"ECE1247",t:"ECE1250",lbl:"device physics"},
  // Design
  {s:"ECE1895",t:"ECE1896",lbl:"design sequence"},
];

// ── Force layout ───────────────────────────────────────────────────────
const YEAR_X = {Y1:80, Y2:260, Y3:500, Y4:720, EL:940};

function initPos() {
  const byYr = {};
  nodes.forEach(n=>(byYr[n.yr]||(byYr[n.yr]=[])).push(n));
  const m={};
  Object.entries(byYr).forEach(([yr,ns])=>{
    const cx=YEAR_X[yr]||900;
    const step=Math.min(58,(H-60)/ns.length);
    const sh=(H-(step*(ns.length-1)))/2;
    ns.forEach((n,i)=>m[n.id]={x:cx+(Math.random()-.5)*25,y:sh+i*step+(Math.random()-.5)*8,vx:0,vy:0});
  });
  return m;
}

function runForce(posMap, edgeList, iters=380) {
  const ids=nodes.map(n=>n.id);
  const p=ids.map(id=>({...posMap[id]}));
  const idx=id=>ids.indexOf(id);
  for(let it=0;it<iters;it++){
    for(let i=0;i<p.length;i++) for(let j=i+1;j<p.length;j++){
      const dx=p[j].x-p[i].x,dy=p[j].y-p[i].y,d=Math.sqrt(dx*dx+dy*dy)||1;
      const f=4200/(d*d);
      p[i].vx-=f*dx/d;p[i].vy-=f*dy/d;p[j].vx+=f*dx/d;p[j].vy+=f*dy/d;
    }
    for(const e of edgeList){
      const si=idx(e.s),ti=idx(e.t);if(si<0||ti<0)continue;
      const dx=p[ti].x-p[si].x,dy=p[ti].y-p[si].y,d=Math.sqrt(dx*dx+dy*dy)||1;
      const f=(d-85)*0.03;
      p[si].vx+=f*dx/d;p[si].vy+=f*dy/d;p[ti].vx-=f*dx/d;p[ti].vy-=f*dy/d;
    }
    for(let i=0;i<nodes.length;i++){
      const cx=YEAR_X[nodes[i].yr]||900;
      p[i].vx+=(cx-p[i].x)*0.13;p[i].vy+=(H/2-p[i].y)*0.003;
      p[i].x+=p[i].vx*0.3;p[i].y+=p[i].vy*0.3;
      p[i].vx*=0.72;p[i].vy*=0.72;
      p[i].x=Math.max(NR+5,Math.min(W-NR-5,p[i].x));
      p[i].y=Math.max(NR+5,Math.min(H-NR-5,p[i].y));
    }
  }
  const r={};ids.forEach((id,i)=>r[id]=p[i]);return r;
}

const init = initPos();
const prereqPos = runForce(init, prereqEdges);
const topicPos  = runForce(init, topicEdges);

// ── Graph component ────────────────────────────────────────────────────
function Graph({ posInit, edgeList, colorBy, filterKey, filterVal }) {
  const [pos, setPos] = useState(posInit);
  const [hover, setHover] = useState(null);
  const dragging = useRef(null);
  const dragOff  = useRef({x:0,y:0});
  const svgRef   = useRef();

  useEffect(()=>setPos(posInit),[posInit]);

  const neighbors = hover
    ? new Set([hover,...edgeList.filter(e=>e.s===hover||e.t===hover).flatMap(e=>[e.s,e.t])])
    : null;

  const visIds = filterVal && filterVal!=="All"
    ? new Set(nodes.filter(n=>n[filterKey]===filterVal).map(n=>n.id))
    : null;

  const onMD = useCallback((e,id)=>{
    e.preventDefault();
    const r=svgRef.current.getBoundingClientRect();
    dragOff.current={x:pos[id].x-(e.clientX-r.left),y:pos[id].y-(e.clientY-r.top)};
    dragging.current=id;
  },[pos]);

  useEffect(()=>{
    const mv=e=>{
      if(!dragging.current) return;
      const r=svgRef.current?.getBoundingClientRect();if(!r)return;
      const x=Math.max(NR+5,Math.min(W-NR-5,e.clientX-r.left+dragOff.current.x));
      const y=Math.max(NR+5,Math.min(H-NR-5,e.clientY-r.top+dragOff.current.y));
      setPos(p=>({...p,[dragging.current]:{...p[dragging.current],x,y}}));
    };
    const up=()=>{dragging.current=null;};
    window.addEventListener("mousemove",mv);window.addEventListener("mouseup",up);
    return()=>{window.removeEventListener("mousemove",mv);window.removeEventListener("mouseup",up);};
  },[]);

  const colOf = n => colorBy==="subfield" ? SUBFIELD_COLORS[n.subfield] : YEAR_COLORS[n.yr];

  return (
    <div style={{position:"relative",background:"#1e293b",borderRadius:"0 0 14px 14px",border:"1px solid #334155",borderTop:"none"}}>
      <svg ref={svgRef} width="100%" viewBox={`0 0 ${W} ${H}`} style={{display:"block",cursor:"default"}}>
        <defs>
          {nodes.map(n=>{
            const col=colOf(n);
            return <marker key={n.id} id={`a-${n.id}`} markerWidth="5" markerHeight="5" refX="4" refY="2.5" orient="auto">
              <path d="M0,0 L0,5 L5,2.5 z" fill={col+"bb"}/>
            </marker>;
          })}
        </defs>

        {/* Column separators */}
        {Object.values(YEAR_X).map((cx,i)=>(
          <line key={i} x1={cx+70} y1={8} x2={cx+70} y2={H-8} stroke="#ffffff07" strokeWidth={1}/>
        ))}

        {/* Edges */}
        {edgeList.map((e,i)=>{
          const sp=pos[e.s],tp=pos[e.t];if(!sp||!tp)return null;
          if(visIds&&!visIds.has(e.s)&&!visIds.has(e.t))return null;
          const isHlit=neighbors?(neighbors.has(e.s)&&neighbors.has(e.t)):true;
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
            markerEnd={isHlit?`url(#a-${e.t})`:undefined}
            style={{transition:"stroke 0.12s"}}
          />;
        })}

        {/* Nodes */}
        {nodes.map(n=>{
          const p=pos[n.id];if(!p)return null;
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

      {/* Tooltip */}
      {hover && pos[hover] && (()=>{
        const n=nodes.find(x=>x.id===hover);
        const pre=prereqEdges.filter(e=>e.t===hover).map(e=>e.s);
        const unl=prereqEdges.filter(e=>e.s===hover).map(e=>e.t);
        const col=colOf(n);
        const px=pos[hover].x/W*100, py=pos[hover].y/H*100;
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

// ── Main App ───────────────────────────────────────────────────────────
export default function App() {
  const [tab, setTab] = useState("subfield");
  const [sfFilter, setSfFilter] = useState("All");
  const [yrFilter, setYrFilter] = useState("All");

  const isSubfield = tab==="subfield";
  const legend = isSubfield ? SUBFIELD_COLORS : Object.fromEntries(Object.entries(YEAR_COLORS).map(([k,v])=>[YEAR_LABELS[k],v]));
  const filterOptions = isSubfield
    ? ["All",...Object.keys(SUBFIELD_COLORS)]
    : ["All",...Object.keys(YEAR_LABELS).map(k=>YEAR_LABELS[k])];
  const filterVal = isSubfield ? sfFilter : yrFilter;
  const setFilter = isSubfield ? setSfFilter : setYrFilter;
  const filterKey = isSubfield ? "subfield" : "yr";
  const filterValMapped = isSubfield ? filterVal : (Object.entries(YEAR_LABELS).find(([k,v])=>v===filterVal)||[])[0] || filterVal;

  return (
    <div style={{fontFamily:"system-ui,sans-serif",background:"#0f172a",minHeight:"100vh",color:"#e2e8f0",padding:"14px",boxSizing:"border-box"}}>
      <h1 style={{textAlign:"center",fontSize:"1.2rem",fontWeight:800,marginBottom:2,
        background:"linear-gradient(135deg,#6366f1,#ec4899)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>
        Pitt ECE Undergraduate Course Map
      </h1>
      <p style={{textAlign:"center",color:"#475569",fontSize:"0.74rem",marginBottom:12}}>
        Hover to highlight · Drag to rearrange · Filter by subfield or year
      </p>

      {/* Tabs */}
      <div style={{maxWidth:W+20,margin:"0 auto",display:"flex",gap:0,marginBottom:0}}>
        {[["subfield","🎨 Sub-field Map"],["prereq","🔗 Prerequisite Map"]].map(([key,lbl])=>(
          <button key={key} onClick={()=>setTab(key)} style={{
            flex:1,padding:"9px 0",fontWeight:700,fontSize:"0.85rem",cursor:"pointer",
            border:"1px solid #334155",borderBottom:tab===key?"none":"1px solid #334155",
            borderRadius:tab===key?"10px 10px 0 0":"10px 10px 0 0",
            background:tab===key?"#1e293b":"#0f172a",
            color:tab===key?"#f1f5f9":"#475569",
            marginRight:key==="subfield"?4:0,
            position:"relative",zIndex:tab===key?2:1,
          }}>{lbl}</button>
        ))}
      </div>

      {/* Description bar */}
      <div style={{maxWidth:W+20,margin:"0 auto",background:"#1e2d3d",borderLeft:"3px solid "+(isSubfield?"#6366f1":"#10b981"),
        padding:"7px 14px",fontSize:"0.76rem",color:"#94a3b8",borderRadius:"0",borderRight:"1px solid #334155",
        borderTop:"1px solid #334155",marginBottom:0}}>
        {isSubfield
          ? "Nodes colored by ECE sub-field. Edges represent topical/conceptual relationships between courses."
          : "Edges show formal prerequisite relationships. Columns represent academic year. Dashed border = elective."}
      </div>

      {/* Filter bar */}
      <div style={{maxWidth:W+20,margin:"0 auto",background:"#172033",borderLeft:"1px solid #334155",
        borderRight:"1px solid #334155",padding:"7px 10px",display:"flex",flexWrap:"wrap",gap:5}}>
        {filterOptions.map(f=>{
          const col = isSubfield ? (f==="All"?"#475569":SUBFIELD_COLORS[f]) : (f==="All"?"#475569":Object.values(YEAR_COLORS)[Object.values(YEAR_LABELS).indexOf(f)]);
          return <button key={f} onClick={()=>setFilter(f)} style={{
            background:filterVal===f?(col||"#475569")+"cc":"#1e293b",
            color:filterVal===f?"#fff":"#94a3b8",
            border:`1px solid ${(col||"#475569")}44`,
            borderRadius:20,padding:"2px 10px",fontSize:"0.72rem",cursor:"pointer",fontWeight:filterVal===f?700:400
          }}>{f}</button>;
        })}
      </div>

      {/* Column labels */}
      <div style={{maxWidth:W+20,margin:"0 auto",background:"#172033",borderLeft:"1px solid #334155",
        borderRight:"1px solid #334155",height:18,position:"relative"}}>
        {Object.entries(YEAR_X).map(([yr,cx])=>(
          <div key={yr} style={{position:"absolute",left:(cx/W*100)+"%",transform:"translateX(-50%)",
            fontSize:"0.65rem",color:YEAR_COLORS[yr],fontWeight:700,letterSpacing:"0.06em",textTransform:"uppercase"}}>
            {YEAR_LABELS[yr]}
          </div>
        ))}
      </div>

      {/* Graph */}
      <div style={{maxWidth:W+20,margin:"0 auto"}}>
        {tab==="subfield"
          ? <Graph key="sf" posInit={topicPos} edgeList={topicEdges} colorBy="subfield"
              filterKey="subfield" filterVal={sfFilter}/>
          : <Graph key="pr" posInit={prereqPos} edgeList={prereqEdges} colorBy="yr"
              filterKey="yr" filterVal={filterValMapped}/>
        }
      </div>

      {/* Legend */}
      <div style={{maxWidth:W+20,margin:"8px auto 0",display:"flex",gap:7,flexWrap:"wrap",justifyContent:"center"}}>
        {Object.entries(legend).map(([name,col])=>(
          <span key={name} style={{fontSize:"0.7rem",color:col,display:"flex",alignItems:"center",gap:4}}>
            <span style={{width:9,height:9,borderRadius:"50%",background:col+"33",border:`1.5px solid ${col}`,display:"inline-block"}}/>
            {name}
          </span>
        ))}
        <span style={{fontSize:"0.7rem",color:"#475569",display:"flex",alignItems:"center",gap:4,marginLeft:6}}>
          <span style={{width:9,height:9,borderRadius:"50%",border:"1.5px dashed #475569",display:"inline-block"}}/>
          Elective
        </span>
      </div>
    </div>
  );
}

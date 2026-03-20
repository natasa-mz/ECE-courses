// import { useState, useEffect, useRef, useCallback } from "react";

// const W = 900, H = 620;
// const NODE_R = 52;

// const CLUSTERS = [
//   {
//     id: "core_sophomore", label: "Sophomore\nCore", color: "#6366f1",
//     courses: ["ECE 0101","ECE 0102","ECE 0201","ECE 0202","ECE 0301","ECE 0302","ECE 0401","ECE 0402","MATH 0240"]
//   },
//   {
//     id: "core_junior", label: "Junior\nCore (ECE)", color: "#3b82f6",
//     courses: ["ECE 1212","ECE 1247","ECE 1259","ECE 1560","ECE 1673","ECE 1701","ECE 1895"]
//   },
//   {
//     id: "computers", label: "Computer\nArchitecture", color: "#8b5cf6",
//     courses: ["ECE 1110","ECE 1115","ECE 1165","ECE 1166","ECE 1170","ECE 1175","ECE 1195"]
//   },
//   {
//     id: "software", label: "Software &\nAlgorithms", color: "#ec4899",
//     courses: ["ECE 1140","ECE 1145","ECE 1147","ECE 1148","ECE 1180","ECE 1188"]
//   },
//   {
//     id: "networks", label: "Networks &\nSecurity", color: "#f59e0b",
//     courses: ["ECE 1150","ECE 1155"]
//   },
//   {
//     id: "vlsi", label: "VLSI &\nDigital Design", color: "#10b981",
//     courses: ["ECE 1192","ECE 1193","ECE 1238"]
//   },
//   {
//     id: "signals", label: "Signals &\nComms", color: "#06b6d4",
//     courses: ["ECE 1390","ECE 1395","ECE 1472","ECE 1473","ECE 1562"]
//   },
//   {
//     id: "photonics", label: "Photonics,\nFields & Nano", color: "#a855f7",
//     courses: ["ECE 1232","ECE 1250","ECE 1251","ECE 1266","ECE 1272"]
//   },
//   {
//     id: "power", label: "Power\nSystems", color: "#ef4444",
//     courses: ["ECE 1710","ECE 1750","ECE 1771","ECE 1773","ECE 1774","ECE 1775","ECE 1776"]
//   },
//   {
//     id: "robotics", label: "Robotics &\nMechatronics", color: "#14b8a6",
//     courses: ["ECE 1674","ECE 1675"]
//   },
//   {
//     id: "analog", label: "Analog\nElectronics", color: "#f97316",
//     courses: ["ECE 1215","ECE 1286"]
//   },
//   {
//     id: "capstone", label: "Design,\nResearch &\nCapstone", color: "#64748b",
//     courses: ["ECE 1885","ECE 1890","ECE 1893","ECE 1894","ECE 1895","ECE 1896","ECE 1898"]
//   }
// ];

// const EDGES = [
//   { source: "core_sophomore", target: "core_junior", label: "leads to" },
//   { source: "core_sophomore", target: "computers", label: "enables" },
//   { source: "core_sophomore", target: "software", label: "enables" },
//   { source: "core_sophomore", target: "vlsi", label: "enables" },
//   { source: "core_sophomore", target: "signals", label: "enables" },
//   { source: "core_sophomore", target: "power", label: "enables" },
//   { source: "core_junior", target: "signals", label: "deepens" },
//   { source: "core_junior", target: "photonics", label: "extends to" },
//   { source: "core_junior", target: "power", label: "extends to" },
//   { source: "core_junior", target: "robotics", label: "feeds" },
//   { source: "core_junior", target: "analog", label: "extends to" },
//   { source: "computers", target: "software", label: "paired with" },
//   { source: "computers", target: "vlsi", label: "implements" },
//   { source: "software", target: "networks", label: "enables" },
//   { source: "signals", target: "networks", label: "underlies" },
//   { source: "signals", target: "photonics", label: "extends" },
//   { source: "analog", target: "vlsi", label: "feeds into" },
//   { source: "power", target: "analog", label: "circuit design" },
//   { source: "robotics", target: "software", label: "uses" },
//   { source: "capstone", target: "core_junior", label: "" },
//   { source: "capstone", target: "computers", label: "" },
//   { source: "capstone", target: "power", label: "" },
// ];

// const COURSE_DETAILS = {
//   "ECE 0101": "Linear Circuits and Systems",
//   "ECE 0102": "Microelectronic Circuits",
//   "ECE 0201": "Digital Circuits and Systems",
//   "ECE 0202": "Embedded Processors & Interfacing",
//   "ECE 0301": "ECE Problem Solving with C++",
//   "ECE 0302": "Data Structures and Algorithms",
//   "ECE 0401": "ECE Analytical Methods",
//   "ECE 0402": "Signals, Systems & Probability",
//   "MATH 0240": "Analytic Geometry and Calculus 3",
//   "ECE 1212": "Electronic Circuit Design Lab",
//   "ECE 1247": "Semiconductor Device Theory",
//   "ECE 1259": "Electromagnetics",
//   "ECE 1560": "Digital Signal Processing",
//   "ECE 1673": "Linear Control Systems",
//   "ECE 1701": "Fundamentals of Electric Power Engineering",
//   "ECE 1895": "Junior Design Fundamentals",
//   "ECE 1110": "Computer Organization & Architecture",
//   "ECE 1115": "High Performance Computing",
//   "ECE 1165": "Dependable Systems",
//   "ECE 1166": "Parallel Systems",
//   "ECE 1170": "Special Topics: Computers",
//   "ECE 1175": "Embedded Systems Design",
//   "ECE 1195": "Advanced Digital Design",
//   "ECE 1140": "Systems & Project Engineering",
//   "ECE 1145": "Software Construction & Evolution",
//   "ECE 1147": "Algorithms for Big Data",
//   "ECE 1148": "Algorithmic Thinking",
//   "ECE 1180": "Computational Modeling & Simulation",
//   "ECE 1188": "Cyber-Physical Systems",
//   "ECE 1150": "Computer Networks",
//   "ECE 1155": "Information Security",
//   "ECE 1192": "Intro to VLSI Design",
//   "ECE 1193": "Advanced VLSI Design",
//   "ECE 1238": "Digital Electronics",
//   "ECE 1390": "Intro to Image Processing",
//   "ECE 1395": "Intro to Machine Learning",
//   "ECE 1472": "Analog Communication Systems",
//   "ECE 1473": "Digital Communication Systems",
//   "ECE 1562": "Digital & Analog Filters",
//   "ECE 1232": "Intro Lasers & Optical Electronics",
//   "ECE 1250": "Nanotechnology & Nano-Engineering",
//   "ECE 1251": "Micro & Nano Device Fabrication Lab",
//   "ECE 1266": "Applications of Fields & Waves",
//   "ECE 1272": "Simulation & Design of Silicon Photonics",
//   "ECE 1710": "Power Distribution Systems & Smart Grids",
//   "ECE 1750": "Power Electronics Conversion Theory",
//   "ECE 1771": "Electric Machinery",
//   "ECE 1773": "Power Generation, Operation & Control",
//   "ECE 1774": "Computer Analysis of Power Systems",
//   "ECE 1775": "Power Quality",
//   "ECE 1776": "Microgrid Concepts & Distributed Generation",
//   "ECE 1674": "Mechatronic Systems",
//   "ECE 1675": "Robotic Control",
//   "ECE 1215": "Electroacoustics & Audio Electronics",
//   "ECE 1286": "Analog Integrated Circuit Design",
//   "ECE 1885": "Departmental Seminar",
//   "ECE 1890": "ECE Prototyping Fundamentals",
//   "ECE 1893": "Undergraduate Research Project",
//   "ECE 1894": "Undergraduate Industry Project",
//   "ECE 1896": "Senior Design Project",
//   "ECE 1898": "Engineering Project",
// };

// // Badge labels for special cluster types
// const CLUSTER_BADGE = {
//   core_sophomore: "CORE",
//   core_junior: "CORE",
//   capstone: "CAPSTONE",
// };

// function initPositions() {
//   const cx = W/2, cy = H/2;
//   // place core_sophomore center-left, core_junior center, capstone center-right
//   const custom = {
//     core_sophomore: {x:160, y:300},
//     core_junior: {x:420, y:220}, // ECE junior core
//     capstone: {x:750, y:480},
//   };
//   const others = CLUSTERS.filter(c=>!custom[c.id]);
//   return CLUSTERS.map((c, i) => {
//     if (custom[c.id]) return {...custom[c.id], vx:0, vy:0};
//     const oi = others.findIndex(o=>o.id===c.id);
//     const a = (2*Math.PI*oi/others.length) - Math.PI/3;
//     return { x: cx+220*Math.cos(a), y: cy+190*Math.sin(a), vx:0, vy:0 };
//   });
// }

// export default function App() {
//   const [positions, setPositions] = useState(initPositions);
//   const [dragging, setDragging] = useState(null);
//   const [selected, setSelected] = useState(null);
//   const [hovered, setHovered] = useState(null);
//   const svgRef = useRef();
//   const dragOffset = useRef({x:0,y:0});

//   const onMouseDown = useCallback((e, i) => {
//     e.preventDefault(); e.stopPropagation();
//     const svg = svgRef.current.getBoundingClientRect();
//     dragOffset.current = { x: positions[i].x-(e.clientX-svg.left), y: positions[i].y-(e.clientY-svg.top) };
//     setDragging(i);
//   }, [positions]);

//   useEffect(() => {
//     const onMove = e => {
//       if (dragging===null) return;
//       const svg = svgRef.current?.getBoundingClientRect(); if(!svg) return;
//       const x = Math.max(NODE_R+5, Math.min(W-NODE_R-5, e.clientX-svg.left+dragOffset.current.x));
//       const y = Math.max(NODE_R+5, Math.min(H-NODE_R-5, e.clientY-svg.top+dragOffset.current.y));
//       setPositions(p => p.map((pos,i) => i===dragging ? {...pos,x,y} : pos));
//     };
//     const onUp = () => setDragging(null);
//     window.addEventListener("mousemove", onMove);
//     window.addEventListener("mouseup", onUp);
//     return () => { window.removeEventListener("mousemove",onMove); window.removeEventListener("mouseup",onUp); };
//   }, [dragging]);

//   const getPos = id => { const i = CLUSTERS.findIndex(c=>c.id===id); return positions[i]; };

//   const edgePath = (s, t) => {
//     if(!s||!t) return "";
//     const dx=t.x-s.x, dy=t.y-s.y, d=Math.sqrt(dx*dx+dy*dy)||1;
//     const mx=s.x+dx/2-dy/d*25, my=s.y+dy/2+dx/d*25;
//     return `M${s.x},${s.y} Q${mx},${my} ${t.x},${t.y}`;
//   };

//   const activeCluster = selected ?? hovered;
//   const activeCl = activeCluster ? CLUSTERS.find(c=>c.id===activeCluster) : null;

//   return (
//     <div style={{fontFamily:"system-ui,sans-serif",background:"#0f172a",minHeight:"100vh",color:"#e2e8f0",padding:"20px",boxSizing:"border-box"}}>
//       <h1 style={{textAlign:"center",fontSize:"1.4rem",fontWeight:700,marginBottom:2,background:"linear-gradient(135deg,#6366f1,#3b82f6)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>
//         ECE Undergraduate Course Clusters
//       </h1>
//       <p style={{textAlign:"center",color:"#64748b",fontSize:"0.8rem",marginBottom:16}}>University of Pittsburgh · Swanson School of Engineering · Click a cluster to explore · Drag to rearrange</p>

//       <div style={{display:"flex",gap:16,maxWidth:1120,margin:"0 auto",alignItems:"flex-start"}}>
//         <div style={{flex:1,background:"#1e293b",borderRadius:16,border:"1px solid #334155",overflow:"hidden"}}>
//           <svg ref={svgRef} width="100%" viewBox={`0 0 ${W} ${H}`} style={{display:"block",cursor:dragging!==null?"grabbing":"default"}}>
//             <defs>
//               {CLUSTERS.map(c=>(
//                 <marker key={c.id} id={`arr-${c.id}`} markerWidth="7" markerHeight="7" refX="5" refY="3" orient="auto">
//                   <path d="M0,0 L0,6 L7,3 z" fill={c.color+"88"} />
//                 </marker>
//               ))}
//             </defs>

//             {EDGES.map((e,i)=>{
//               const s=getPos(e.source), t=getPos(e.target);
//               const isActive = activeCluster && (e.source===activeCluster||e.target===activeCluster);
//               const sc = CLUSTERS.find(c=>c.id===e.source);
//               return (
//                 <g key={i} opacity={activeCluster&&!isActive?0.06:isActive?1:0.25}>
//                   <path d={edgePath(s,t)} fill="none" stroke={isActive?(sc?.color||"#94a3b8"):"#475569"}
//                     strokeWidth={isActive?2:1.5} markerEnd={`url(#arr-${e.target})`}
//                     strokeDasharray={isActive?"none":"4 3"} />
//                   {e.label && isActive && (()=>{
//                     const dx=t.x-s.x,dy=t.y-s.y,d=Math.sqrt(dx*dx+dy*dy)||1;
//                     const mx=s.x+dx/2-dy/d*25, my=s.y+dy/2+dx/d*25;
//                     return <text x={mx} y={my-6} fill="#94a3b8" fontSize={10} textAnchor="middle" style={{pointerEvents:"none"}}>{e.label}</text>;
//                   })()}
//                 </g>
//               );
//             })}

//             {CLUSTERS.map((c,i)=>{
//               const p = positions[i];
//               const isActive = activeCluster===c.id;
//               const isRelated = activeCluster && EDGES.some(e=>(e.source===activeCluster&&e.target===c.id)||(e.target===activeCluster&&e.source===c.id));
//               const dim = activeCluster && !isActive && !isRelated;
//               const badge = CLUSTER_BADGE[c.id];
//               return (
//                 <g key={c.id} transform={`translate(${p.x},${p.y})`}
//                   onMouseDown={e=>onMouseDown(e,i)}
//                   onMouseEnter={()=>setHovered(c.id)}
//                   onMouseLeave={()=>setHovered(null)}
//                   onClick={()=>setSelected(selected===c.id?null:c.id)}
//                   style={{cursor:"pointer"}} opacity={dim?0.15:1}>
//                   <circle r={NODE_R+5} fill={c.color+"12"} />
//                   <circle r={NODE_R} fill={isActive?c.color+"55":c.color+"25"} stroke={c.color} strokeWidth={isActive?3:1.5} />
//                   <text textAnchor="middle" fill="#f1f5f9" fontSize={10.5} fontWeight={700} style={{pointerEvents:"none",userSelect:"none"}}>
//                     {c.label.split("\n").map((line,li,arr)=>(
//                       <tspan key={li} x="0" dy={li===0?`${-(arr.length-1)*7}px`:"14px"}>{line}</tspan>
//                     ))}
//                   </text>
//                   <text textAnchor="middle" dy={`${NODE_R*0.58}px`} fill={c.color} fontSize={9.5} style={{pointerEvents:"none",userSelect:"none"}}>
//                     {c.courses.length} courses
//                   </text>
//                   {badge && (
//                     <g>
//                       <rect x={-18} y={-NODE_R-16} width={36} height={13} rx={6} fill={c.color} />
//                       <text x={0} y={-NODE_R-6} textAnchor="middle" fill="#fff" fontSize={8} fontWeight={800} style={{pointerEvents:"none",userSelect:"none"}}>{badge}</text>
//                     </g>
//                   )}
//                 </g>
//               );
//             })}
//           </svg>
//         </div>

//         <div style={{width:248,background:"#1e293b",borderRadius:16,border:"1px solid #334155",padding:"16px",minHeight:320,flexShrink:0}}>
//           {activeCl ? (
//             <>
//               <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4}}>
//                 <div style={{width:11,height:11,borderRadius:"50%",background:activeCl.color,flexShrink:0}} />
//                 <span style={{fontWeight:700,fontSize:"0.9rem",color:activeCl.color}}>{activeCl.label.replace("\n"," ")}</span>
//               </div>
//               {CLUSTER_BADGE[activeCl.id] && (
//                 <span style={{display:"inline-block",background:activeCl.color,color:"#fff",borderRadius:10,padding:"1px 8px",fontSize:"0.7rem",fontWeight:700,marginBottom:8}}>{CLUSTER_BADGE[activeCl.id]}</span>
//               )}
//               <div style={{fontSize:"0.72rem",color:"#64748b",marginBottom:6,textTransform:"uppercase",letterSpacing:"0.05em",marginTop:6}}>Courses</div>
//               <div style={{display:"flex",flexDirection:"column",gap:4,marginBottom:14,maxHeight:300,overflowY:"auto"}}>
//                 {activeCl.courses.map(code=>(
//                   <div key={code} style={{background:activeCl.color+"18",border:`1px solid ${activeCl.color}33`,borderRadius:7,padding:"4px 9px"}}>
//                     <div style={{color:activeCl.color,fontSize:"0.72rem",fontWeight:700}}>{code}</div>
//                     <div style={{color:"#94a3b8",fontSize:"0.7rem"}}>{COURSE_DETAILS[code]||""}</div>
//                   </div>
//                 ))}
//               </div>
//               {(()=>{
//                 const related = EDGES.filter(e=>e.source===activeCluster||e.target===activeCluster)
//                   .map(e=>e.source===activeCluster?e.target:e.source);
//                 return related.length>0 && (
//                   <>
//                     <div style={{fontSize:"0.72rem",color:"#64748b",marginBottom:6,textTransform:"uppercase",letterSpacing:"0.05em"}}>Connected to</div>
//                     <div style={{display:"flex",flexWrap:"wrap",gap:4}}>
//                       {related.map(rid=>{const rc=CLUSTERS.find(c=>c.id===rid); return rc?(
//                         <span key={rid} onClick={()=>setSelected(rid)}
//                           style={{background:rc.color+"22",border:`1px solid ${rc.color}55`,borderRadius:20,padding:"3px 9px",fontSize:"0.7rem",color:rc.color,cursor:"pointer"}}>
//                           {rc.label.replace("\n"," ")}
//                         </span>
//                       ):null;})}
//                     </div>
//                   </>
//                 );
//               })()}
//             </>
//           ) : (
//             <div style={{color:"#475569",fontSize:"0.85rem",textAlign:"center",marginTop:40,lineHeight:1.7}}>
//               Click any cluster to explore its courses and connections
//             </div>
//           )}
//         </div>
//       </div>

//       <div style={{maxWidth:1120,margin:"12px auto 0",display:"flex",flexWrap:"wrap",gap:5,justifyContent:"center"}}>
//         {CLUSTERS.map(c=>(
//           <span key={c.id} onClick={()=>setSelected(selected===c.id?null:c.id)}
//             style={{background:c.color+"22",border:`1px solid ${c.color}55`,borderRadius:20,padding:"3px 11px",fontSize:"0.73rem",color:c.color,cursor:"pointer",
//               outline:selected===c.id?`2px solid ${c.color}`:"none"}}>
//             {CLUSTER_BADGE[c.id] ? `★ ` : ""}{c.label.replace("\n"," ")}
//           </span>
//         ))}
//       </div>
//     </div>
//   );
// }

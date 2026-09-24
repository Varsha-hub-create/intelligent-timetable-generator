import React,{useEffect,useState} from "react";
import {createRoot} from "react-dom/client";
import axios from "axios";
import "./styles.css";

const API="http://localhost:5000/api";
const days=["","Monday","Tuesday","Wednesday","Thursday","Friday"];

function App(){
 const [data,setData]=useState({divisions:[],subjects:[],faculty:[],rooms:[]});
 const [tt,setTt]=useState([]);
 const [view,setView]=useState("division");
 const [selected,setSelected]=useState("");
 const [message,setMessage]=useState("");

 const load=async()=>{
   const [m,t]=await Promise.all([axios.get(API+"/master-data"),axios.get(API+"/timetable")]);
   setData(m.data); setTt(t.data);
   if(!selected && m.data.divisions[0]) setSelected(String(m.data.divisions[0].id));
 };
 useEffect(()=>{load().catch(e=>setMessage(e.message))},[]);

 const generate=async()=>{
   setMessage("Generating...");
   try{const r=await axios.post(API+"/generate");setMessage(r.data.message);await load();}
   catch(e){setMessage(e.response?.data?.message||e.message)}
 };
 const clear=async()=>{await axios.delete(API+"/timetable");setTt([]);setMessage("Timetable cleared");};

 const rows=Array.from({length:7},(_,i)=>i+1);
 const filtered=tt.filter(x=>{
   if(view==="division") return String(x.divisionId)===selected;
   if(view==="faculty") return String(x.facultyId)===selected;
   return String(x.roomId)===selected;
 });
 const get=(d,p)=>filtered.find(x=>x.day===d&&x.period===p);

 return <div className="app">
  <header><div><span className="badge">AI SCHEDULER</span><h1>Intelligent Timetable Generator</h1><p>Constraint-aware academic scheduling for colleges</p></div>
   <button className="primary" onClick={generate}>Generate Timetable</button>
  </header>
  <section className="stats">
   <div><b>{data.divisions.length}</b><span>Divisions</span></div>
   <div><b>{data.subjects.length}</b><span>Subjects</span></div>
   <div><b>{data.faculty.length}</b><span>Faculty</span></div>
   <div><b>{data.rooms.length}</b><span>Rooms</span></div>
  </section>
  {message && <div className="notice">{message}</div>}
  <main>
   <aside>
    <h3>Timetable View</h3>
    {["division","faculty","room"].map(v=><button className={view===v?"tab active":"tab"} onClick={()=>{setView(v);setSelected("")}} key={v}>{v[0].toUpperCase()+v.slice(1)}</button>)}
    <h3>Select {view}</h3>
    {(view==="division"?data.divisions:view==="faculty"?data.faculty:data.rooms).map(x=><button key={x.id} className={String(x.id)===selected?"item selected":"item"} onClick={()=>setSelected(String(x.id))}>{x.name}</button>)}
    <button className="danger" onClick={clear}>Clear Timetable</button>
   </aside>
   <section className="content">
    <div className="title-row"><div><h2>{view[0].toUpperCase()+view.slice(1)} Schedule</h2><p>Hard constraints are checked before every assignment.</p></div><span className="ok">● Conflict Safe</span></div>
    <div className="table-wrap"><table><thead><tr><th>Period</th>{days.slice(1).map(d=><th key={d}>{d}</th>)}</tr></thead>
    <tbody>{rows.map(p=><tr key={p}><td className="period">P{p}</td>{days.slice(1).map((_,i)=>{const x=get(i+1,p);return <td key={i}>{x?<div className="cell"><strong>{x.subject.code}</strong><span>{x.subject.name}</span><small>{view==="division"?x.faculty.name:view==="faculty"?x.division.name:x.room.name}</small></div>:<span className="free">Free</span>}</td>})}</tr>)}</tbody>
    </table></div>
    <div className="rules"><h3>Hard Constraints</h3><div><span>✓ Faculty conflict</span><span>✓ Division conflict</span><span>✓ Room conflict</span><span>✓ Capacity</span><span>✓ Room type</span><span>✓ Availability</span></div></div>
   </section>
  </main>
 </div>
}
createRoot(document.getElementById("root")).render(<App/>);
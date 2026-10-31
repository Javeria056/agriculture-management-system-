import { useState } from "react";
export default function ReportsAndLog() {
  const [logs] = useState(() => JSON.parse(localStorage.getItem("agri_activity") || '[]'));
  const exportCSV = () => {
    const csv = "user,action,entity,time\n" + logs.map(l=>`${l.user},${l.action},${l.entity},${l.time}`).join("\n");
    const blob = new Blob([csv], {type:'text/csv'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href=url; a.download='activity_report.csv'; a.click();
  };
  return (
    <div style={{background:'white', padding:'20px', borderRadius:'12px', marginTop:'15px'}}>
      <h3><i className="fa-solid fa-file-lines"></i> Reports & Activity Log [NEW]</h3>
      <button onClick={exportCSV} style={{padding:'8px 12px', background:'#0a3d2e', color:'white', border:'none', borderRadius:'8px', margin:'10px 0'}}><i className="fa-solid fa-download"></i> Export CSV</button>
      <button onClick={()=>window.print()} style={{padding:'8px 12px', background:'#1976d2', color:'white', border:'none', borderRadius:'8px', margin:'10px 5px'}}><i className="fa-solid fa-print"></i> Print</button>
      <div style={{maxHeight:'200px', overflow:'auto'}}>
        {logs.length===0 ? <p><i className="fa-solid fa-inbox"></i> No activity yet</p> :
        logs.map(l=><div key={l.id} style={{padding:'6px 0', borderBottom:'1px solid #eee', fontSize:'13px'}}><i className="fa-solid fa-clock"></i> {l.time} - {l.user} {l.action} {l.entity}</div>)}
      </div>
    </div>
  );
}
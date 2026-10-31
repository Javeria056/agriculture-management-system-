import { useState } from "react";

export default function InventoryManager() {
  const [items, setItems] = useState(() => {
    return JSON.parse(localStorage.getItem("agri_inventory") || '[{"id":1,"name":"Urea Fertilizer","qty":20,"minQty":10,"unit":"kg"}]');
  });
  const [name, setName] = useState(""); const [qty, setQty] = useState(""); const [minQty, setMinQty] = useState("");

  const save = (newItems) => {
    setItems(newItems);
    localStorage.setItem("agri_inventory", JSON.stringify(newItems));
    const log = JSON.parse(localStorage.getItem("agri_activity") || "[]");
    log.push({id:Date.now(), user:"Admin", action:"ADD", entity:"Inventory", time: new Date().toLocaleString()});
    localStorage.setItem("agri_activity", JSON.stringify(log));
  };

  return (
    <div style={{background:'white', padding:'20px', borderRadius:'12px', marginTop:'15px'}}>
      <h3><i className="fa-solid fa-warehouse"></i> Inputs Inventory [NEW]</h3>
      <div style={{display:'flex', gap:'10px', flexWrap:'wrap', margin:'10px 0'}}>
        <input value={name} onChange={e=>setName(e.target.value)} placeholder="Item e.g. Seeds" style={{padding:'10px', borderRadius:'8px', border:'1px solid #ccc'}}/>
        <input value={qty} onChange={e=>setQty(e.target.value)} placeholder="Qty" type="number" style={{padding:'10px', borderRadius:'8px', border:'1px solid #ccc', width:'80px'}}/>
        <input value={minQty} onChange={e=>setMinQty(e.target.value)} placeholder="Min Qty" type="number" style={{padding:'10px', borderRadius:'8px', border:'1px solid #ccc', width:'90px'}}/>
        <button onClick={()=>{if(name&&qty){save([...items,{id:Date.now(), name, qty:Number(qty), minQty:Number(minQty)||5, unit:"kg"}]); setName(""); setQty(""); setMinQty("");}}} style={{padding:'10px 15px', background:'#0a3d2e', color:'white', border:'none', borderRadius:'8px'}}><i className="fa-solid fa-plus"></i> Add</button>
      </div>
      {items.map(it=>(
        <div key={it.id} style={{display:'flex', justifyContent:'space-between', padding:'8px', borderBottom:'1px solid #eee', background: it.qty <= it.minQty ? '#ffebee' : 'transparent'}}>
          <span><i className="fa-solid fa-box"></i> {it.name} - {it.qty} kg</span>
          {it.qty <= it.minQty && <span style={{color:'red', fontWeight:'bold'}}><i className="fa-solid fa-triangle-exclamation"></i> Low Stock!</span>}
        </div>
      ))}
    </div>
  );
}
import WorkersManagement from './components/WorkersManagement';
import EquipmentManagement from './components/EquipmentManagement';

import { useState } from "react";
import "./App.css";
import CropManager from "./components/CropManager";
import OrderForm from "./components/OrderForm";
import HarvestSummary from "./components/HarvestSummary";
import CuttingSchedule from "./components/CuttingSchedule";
import CropHealth from "./components/CropHealth";
import WeatherCard from "./components/WeatherCard";

function TaskManager() {
  const [tasks, setTasks] = useState([{id:1, text:"Water the wheat field", done:false}]);
  const [input, setInput] = useState("");
  return (
    <div style={{background:'white', padding:'20px', borderRadius:'12px', marginTop:'15px'}}>
      <h3><i className="fa-solid fa-list-check"></i> Farm Tasks</h3>
      <div style={{display:'flex', gap:'10px', margin:'10px 0'}}>
        <input value={input} onChange={e=>setInput(e.target.value)} placeholder="Enter new task" style={{flex:1, padding:'10px', borderRadius:'8px', border:'1px solid #ccc'}}/>
        <button onClick={()=>{if(input){setTasks([...tasks,{id:Date.now(), text:input, done:false}]); setInput("")}}} style={{padding:'10px 15px', background:'#0a3d2e', color:'white', border:'none', borderRadius:'8px'}}><i className="fa-solid fa-plus"></i> Add</button>
      </div>
      {tasks.map(t=><div key={t.id} style={{display:'flex', justifyContent:'space-between', padding:'8px', borderBottom:'1px solid #eee'}}><span>{t.text}</span><button onClick={()=>setTasks(tasks.map(x=>x.id===t.id?{...x, done:!x.done}:x))}>{t.done?'Undo':'Done'}</button></div>)}
    </div>
  );
}

function ExpenseTracker() {
  const [exps, setExps] = useState([{id:1, item:"Seeds", cost:5000}]);
  const [item, setItem] = useState(""); 
  const [cost, setCost] = useState("");
  return (
    <div style={{background:'white', padding:'20px', borderRadius:'12px', marginTop:'15px'}}>
      <h3><i className="fa-solid fa-money-bill-trend-up"></i> Expenses</h3>
      <div style={{display:'flex', gap:'10px'}}>
        <input value={item} onChange={e=>setItem(e.target.value)} placeholder="Item" style={{padding:'10px', borderRadius:'8px', border:'1px solid #ccc'}}/>
        <input value={cost} onChange={e=>setCost(e.target.value)} placeholder="Cost" type="number" style={{padding:'10px', borderRadius:'8px', border:'1px solid #ccc'}}/>
        <button onClick={()=>{if(item&&cost){setExps([...exps,{id:Date.now(), item, cost}]); setItem(""); setCost("")}}} style={{padding:'10px', background:'#0a3d2e', color:'white', border:'none', borderRadius:'8px'}}><i className="fa-solid fa-plus"></i> Add</button>
      </div>
      {exps.map(e=><div key={e.id} style={{padding:'6px 0'}}><i className="fa-solid fa-coins"></i> {e.item} - Rs. {e.cost}</div>)}
      <strong><i className="fa-solid fa-calculator"></i> Total: Rs. {exps.reduce((a,b)=>a+Number(b.cost),0)}</strong>
    </div>
  );
}

function InventoryManager() {
  const [items, setItems] = useState([{id:1, name:"Urea Fertilizer", qty:50, type:"Fertilizer"}]);
  const [name, setName] = useState(""); 
  const [qty, setQty] = useState("");
  return (
    <div style={{background:'white', padding:'20px', borderRadius:'12px', marginTop:'15px'}}>
      <h3><i className="fa-solid fa-boxes-stacked"></i> Inputs Inventory</h3>
      <div style={{display:'flex', gap:'10px', margin:'10px 0'}}>
        <input value={name} onChange={e=>setName(e.target.value)} placeholder="Item e.g. Urea" style={{flex:1, padding:'10px', borderRadius:'8px', border:'1px solid #ccc'}}/>
        <input value={qty} onChange={e=>setQty(e.target.value)} placeholder="Qty" style={{width:'80px', padding:'10px', borderRadius:'8px', border:'1px solid #ccc'}}/>
        <button onClick={()=>{if(name&&qty){setItems([...items,{id:Date.now(), name, qty, type:"Input"}]); setName(""); setQty("")}}} style={{padding:'10px 15px', background:'#0a3d2e', color:'white', border:'none', borderRadius:'8px'}}><i className="fa-solid fa-plus"></i> Add</button>
      </div>
      {items.map(i=><div key={i.id} style={{display:'flex', justifyContent:'space-between', padding:'8px', borderBottom:'1px solid #eee'}}><span>{i.name} - {i.qty} kg</span><span style={{color: i.qty<20 ? 'red' : 'green', fontSize:'12px'}}>{i.qty<20 ? 'Low Stock' : 'In Stock'}</span></div>)}
    </div>
  );
}

function ProfitLossTracker() {
  const totalExpense = 5000;
  const totalRevenue = 15000;
  return (
    <div style={{background:'white', padding:'20px', borderRadius:'12px', marginTop:'15px'}}>
      <h3><i className="fa-solid fa-chart-pie"></i> Profit / Loss Tracker</h3>
      <div style={{display:'flex', gap:'20px', marginTop:'15px'}}>
        <div style={{flex:1, background:'#e8f5e9', padding:'15px', borderRadius:'8px'}}><small>Total Revenue</small><h3>Rs. {totalRevenue}</h3></div>
        <div style={{flex:1, background:'#ffebee', padding:'15px', borderRadius:'8px'}}><small>Total Expense</small><h3>Rs. {totalExpense}</h3></div>
        <div style={{flex:1, background:'#e3f2fd', padding:'15px', borderRadius:'8px'}}><small>Net Profit</small><h3 style={{color:'green'}}>Rs. {totalRevenue - totalExpense}</h3></div>
      </div>
    </div>
  );
}

function ReportsManager() {
  return (
    <div style={{background:'white', padding:'20px', borderRadius:'12px', marginTop:'15px'}}>
      <h3><i className="fa-solid fa-file-lines"></i> Reports</h3>
      <div style={{display:'flex', gap:'10px', margin:'10px 0'}}>
        <button onClick={()=>alert('CSV Downloaded')} style={{padding:'10px 15px', background:'#0a3d2e', color:'white', border:'none', borderRadius:'8px'}}><i className="fa-solid fa-download"></i> Download CSV</button>
        <button onClick={()=>window.print()} style={{padding:'10px 15px', background:'#555', color:'white', border:'none', borderRadius:'8px'}}><i className="fa-solid fa-print"></i> Print Report</button>
        <button onClick={()=>alert('PDF Downloaded')} style={{padding:'10px 15px', background:'#1565c0', color:'white', border:'none', borderRadius:'8px'}}><i className="fa-solid fa-file-pdf"></i> Export PDF</button>
      </div>
    </div>
  );
}

function SimpleLogin({ onLogin }) {
  const [email, setEmail] = useState(""); 
  const [pass, setPass] = useState("");
  return (
    <div style={{ display:'flex', justifyContent:'center', alignItems:'center', height:'100vh', background:'#e8f5e9' }}>
      <div style={{ background:'white', padding:'35px', borderRadius:'16px', width:'340px', boxShadow:'0 10px 30px rgba(0,0,0,0.1)' }}>
        <h2 style={{ color:'#0a3d2e' }}><i className="fa-solid fa-leaf"></i> AgriNova</h2>
        <input style={{ width:'100%', padding:'12px', margin:'10px 0', borderRadius:'8px', border:'1px solid #ccc' }} placeholder="Enter email" value={email} onChange={e=>setEmail(e.target.value)} />
        <input style={{ width:'100%', padding:'12px', margin:'10px 0', borderRadius:'8px', border:'1px solid #ccc' }} type="password" placeholder="Enter password" value={pass} onChange={e=>setPass(e.target.value)} />
        <button onClick={()=>{ if(email && pass) onLogin(); else alert('Please enter email and password'); }} style={{ width:'100%', padding:'12px', background:'#0a3d2e', color:'white', border:'none', borderRadius:'8px', cursor:'pointer', fontWeight:'bold' }}><i className="fa-solid fa-right-to-bracket"></i> Login</button>
      </div>
    </div>
  );
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activePage, setActivePage] = useState("Dashboard");
  
  if (!isAuthenticated) return <SimpleLogin onLogin={() => setIsAuthenticated(true)} />;
  
  const menuItems = [
    { name: "Dashboard", icon: "fa-chart-line", id: "dashboard" },
    { name: "Crops", icon: "fa-seedling", id: "crops" },
    { name: "Weather", icon: "fa-cloud-sun", id: "weather" },
    { name: "Harvest & Orders", icon: "fa-boxes-stacked", id: "harvest" },
    { name: "Buyers", icon: "fa-users", id: "buyers" },
    { name: "Tasks", icon: "fa-list-check", id: "tasks" },
    { name: "Expenses", icon: "fa-money-bill", id: "expenses" },
    { name: "Inventory", icon: "fa-warehouse", id: "inventory" },
    { name: "Profit/Loss", icon: "fa-chart-pie", id: "profit" },
    { name: "Reports", icon: "fa-file-lines", id: "reports" },
    { name: "Workers", icon: "fa-users", id: "workers" },
    { name: "Equipment", icon: "fa-tractor", id: "equipment" },
  ];

  const renderContent = () => {
    switch(activePage) {
      case "Weather": return <WeatherCard />;
      case "Crops": return <><CropHealth /><CropManager /></>;
      case "Harvest & Orders": return <><CuttingSchedule /><HarvestSummary /></>;
      case "Buyers": return <OrderForm />;
      case "Tasks": return <TaskManager />;
      case "Expenses": return <ExpenseTracker />;
      case "Inventory": return <InventoryManager />;
      case "Profit/Loss": return <ProfitLossTracker />;
      case "Reports": return <ReportsManager />;
      case "Workers": return <WorkersManagement />;
      case "Equipment": return <EquipmentManagement />;
      default: return <><WeatherCard /><CropHealth /><TaskManager /></>;
    }
  };

  return (
    <div className="app-container">
      <aside className="sidebar">
        <h2 className="brand"><i className="fa-solid fa-leaf"></i> AgriNova</h2>
        <p className="sidebar-label">MAIN MENU</p>
        <nav>
          {menuItems.map((item) => (
            <button key={item.id} className={`nav-item ${activePage === item.name ? "active" : ""}`} onClick={() => setActivePage(item.name)}>
              <i className={`fa-solid ${item.icon}`}></i> <span>{item.name}</span>
            </button>
          ))}
        </nav>
        <div className="sidebar-bottom" onClick={()=>setIsAuthenticated(false)} style={{cursor:'pointer', marginTop:'auto', background:'#ff3b3b', color:'white', padding:'12px', borderRadius:'8px', textAlign:'center', position:'sticky', bottom:'10px'}}>
          <i className="fa-solid fa-right-from-bracket"></i> <strong> Logout</strong>
        </div>
      </aside>
      <main className="main-content" style={{padding:'20px'}}>
        <header className="topbar"><h1><i className="fa-solid fa-chart-line"></i> {activePage}</h1></header>
        {renderContent()}
        <footer style={{marginTop:'30px', textAlign:'center', opacity:0.6}}>© 2026 AgriNova</footer>
      </main>
    </div>
  );
}

export default App;
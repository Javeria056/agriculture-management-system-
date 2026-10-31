export default function ProfitLossChart() {
  const exps = JSON.parse(localStorage.getItem("agri_expenses") || '[{"cost":5000},{"cost":3000}]');
  const totalExpense = exps.reduce((a,b)=>a+Number(b.cost||b),0);
  const totalRevenue = 15000; // demo harvest sale
  const profit = totalRevenue - totalExpense;
  return (
    <div style={{background:'white', padding:'20px', borderRadius:'12px', marginTop:'15px'}}>
      <h3><i className="fa-solid fa-chart-pie"></i> Profit / Loss Tracker [NEW]</h3>
      <div style={{display:'flex', gap:'15px', marginTop:'10px'}}>
        <div style={{flex:1, background:'#e8f5e9', padding:'15px', borderRadius:'10px'}}><i className="fa-solid fa-arrow-trend-up"></i> Revenue<br/><strong>Rs. {totalRevenue}</strong></div>
        <div style={{flex:1, background:'#ffebee', padding:'15px', borderRadius:'10px'}}><i className="fa-solid fa-arrow-trend-down"></i> Expense<br/><strong>Rs. {totalExpense}</strong></div>
        <div style={{flex:1, background: profit>=0?'#e3f2fd':'#fff3e0', padding:'15px', borderRadius:'10px'}}><i className="fa-solid fa-calculator"></i> Profit<br/><strong style={{color: profit>=0?'green':'red'}}>Rs. {profit} {profit>=0?'(Profit)':'(Loss)'}</strong></div>
      </div>
      <div style={{marginTop:'15px', height:'20px', background:'#eee', borderRadius:'10px', display:'flex', overflow:'hidden'}}>
        <div style={{width:`${(totalRevenue/(totalRevenue+totalExpense))*100}%`, background:'#4caf50'}}></div>
        <div style={{width:`${(totalExpense/(totalRevenue+totalExpense))*100}%`, background:'#f44336'}}></div>
      </div>
    </div>
  );
}
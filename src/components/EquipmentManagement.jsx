import { useState, useEffect } from 'react';

export default function EquipmentManagement() {
  const [equipment, setEquipment] = useState(() => {
    return JSON.parse(localStorage.getItem('agri_equipment') || '[]');
  });
  const [maintenance, setMaintenance] = useState(() => {
    return JSON.parse(localStorage.getItem('agri_maintenance') || '[]');
  });
  const [form, setForm] = useState({
    name: '', type: 'Tractor', status: 'Active', purchaseDate: '', serviceInterval: 90, lastServiceDate: '', notes: ''
  });
  const [editingId, setEditingId] = useState(null);
  const [logForm, setLogForm] = useState({
    equipmentId: '', date: '', description: '', cost: '', performedBy: ''
  });
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterType, setFilterType] = useState('All');

  useEffect(() => {
    localStorage.setItem('agri_equipment', JSON.stringify(equipment));
  }, [equipment]);

  useEffect(() => {
    localStorage.setItem('agri_maintenance', JSON.stringify(maintenance));
  }, [maintenance]);

  const calculateNextService = (lastDate, interval) => {
    if (!lastDate) return '';
    const d = new Date(lastDate);
    d.setDate(d.getDate() + parseInt(interval || 0));
    return d.toISOString().split('T')[0];
  };

  const handleSaveEquipment = () => {
    if (!form.name || form.name.length < 3) return alert('Equipment name must be at least 3 characters');
    if (!form.lastServiceDate) return alert('Please select last service date');
    if (!form.purchaseDate) return alert('Please select purchase date');
    
    const nextServiceDate = calculateNextService(form.lastServiceDate, form.serviceInterval);
    const newEquipment = {
      ...form,
      id: editingId || Date.now().toString(),
      serial: `EQ-${Date.now().toString().slice(-5)}`,
      nextServiceDate: nextServiceDate,
      serviceInterval: parseInt(form.serviceInterval),
      serviceIntervalDays: parseInt(form.serviceInterval)
    };

    if (editingId) {
      setEquipment(equipment.map(e => e.id === editingId ? newEquipment : e));
      setEditingId(null);
    } else {
      setEquipment([...equipment, newEquipment]);
    }
    setForm({ name: '', type: 'Tractor', status: 'Active', purchaseDate: '', serviceInterval: 90, lastServiceDate: '', notes: '' });
  };

  const handleEdit = (eq) => {
    setForm({
      name: eq.name,
      type: eq.type,
      status: eq.status,
      purchaseDate: eq.purchaseDate,
      serviceInterval: eq.serviceInterval || eq.serviceIntervalDays || 90,
      lastServiceDate: eq.lastServiceDate,
      notes: eq.notes || ''
    });
    setEditingId(eq.id);
    window.scrollTo(0, 0);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this equipment?')) {
      setEquipment(equipment.filter(e => e.id !== id));
    }
  };

  const handleAddLog = () => {
    if (!logForm.equipmentId) return alert('Select equipment');
    if (!logForm.date) return alert('Select date');
    const newLog = {
      ...logForm,
      id: Date.now().toString(),
      cost: parseFloat(logForm.cost) || 0
    };
    setMaintenance([...maintenance, newLog]);

    if (newLog.cost > 0) {
      const expenses = JSON.parse(localStorage.getItem('agri_expenses') || '[]');
      expenses.push({
        id: Date.now().toString(),
        category: 'Repair',
        amount: newLog.cost,
        date: newLog.date,
        note: `Maintenance: ${equipment.find(e=>e.id===newLog.equipmentId)?.name} - ${newLog.description}`,
        cropId: 'general'
      });
      localStorage.setItem('agri_expenses', JSON.stringify(expenses));
    }
    setEquipment(equipment.map(eq => eq.id === newLog.equipmentId ? {...eq, lastServiceDate: newLog.date, nextServiceDate: calculateNextService(newLog.date, eq.serviceInterval)} : eq));
    setLogForm({ equipmentId: '', date: '', description: '', cost: '', performedBy: '' });
  };

  const exportCSV = () => {
    const csv = ["Name,Type,Status,Purchase Date,Next Service Date,Notes", ...equipment.map(e => `${e.name},${e.type},${e.status},${e.purchaseDate},${e.nextServiceDate},${e.notes || ''}`)].join("\n");
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'equipment.csv'; a.click();
  };

  const getStatusInfo = (nextDate) => {
    if (!nextDate) return { text: 'No Date', days: 0, color: 'gray' };
    const diff = Math.ceil((new Date(nextDate) - new Date()) / (1000 * 60 * 60 * 24));
    if (diff < 0) return { text: `Overdue by ${Math.abs(diff)} days`, days: diff, color: 'red' };
    if (diff <= 7) return { text: `Due in ${diff} days`, days: diff, color: 'yellow' };
    return { text: `In ${diff} days`, days: diff, color: 'green' };
  };

  const filteredEquipment = equipment
    .filter(e => {
      const matchSearch = e.name.toLowerCase().includes(search.toLowerCase());
      const matchStatus = filterStatus === 'All' || e.status === filterStatus;
      const matchType = filterType === 'All' || e.type === filterType;
      return matchSearch && matchStatus && matchType;
    })
    .sort((a,b) => new Date(a.nextServiceDate) - new Date(b.nextServiceDate));

  const overdueList = equipment.filter(e => getStatusInfo(e.nextServiceDate).color === 'red');
  const dueSoonList = equipment.filter(e => getStatusInfo(e.nextServiceDate).color === 'yellow');
  const activeCount = equipment.filter(e => e.status === 'Active').length;
  const repairCount = equipment.filter(e => e.status === 'Under Repair').length;
  const idleCount = equipment.filter(e => e.status === 'Idle').length;

  return (
    <div style={{ fontFamily: 'Inter, sans-serif', background: '#f8fafc', minHeight: '100vh', padding: '16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div>
          <h1 style={{ fontSize: '20px', fontWeight: '800', margin: 0 }}>Equipment & Maintenance Tracker</h1>
          <p style={{ fontSize: '12px', color: '#64748b', margin: 0 }}>Manage your farm equipment, maintenance schedules, and service logs</p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={handleSaveEquipment} style={{ background: '#16a34a', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '6px', fontSize: '12px', cursor: 'pointer' }}>+ Add Equipment</button>
          <button onClick={exportCSV} style={{ background: '#fff', border: '1px solid #e2e8f0', padding: '6px 12px', borderRadius: '6px', fontSize: '12px', cursor: 'pointer' }}>↓ Export CSV</button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2.2fr 0.8fr', gap: '16px' }}>
        <div>
          <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '16px', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '14px', fontWeight: '700', margin: '0 0 12px 0' }}>Equipment Form<br/><span style={{ fontWeight: '400', fontSize: '11px', color: '#64748b' }}>Add or update equipment details</span></h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div><label style={{ fontSize: '11px', fontWeight: '600' }}>Name *</label><input placeholder="e.g. Tractor TR-102" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '12px' }} /></div>
              <div><label style={{ fontSize: '11px', fontWeight: '600' }}>Type</label><select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '12px' }}><option>Tractor</option><option>Water Pump</option><option>Sprayer</option><option>Harvester</option><option>Other</option></select></div>
              <div><label style={{ fontSize: '11px', fontWeight: '600' }}>Status</label><select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '12px' }}><option>Active</option><option>Under Repair</option><option>Idle</option></select></div>
              <div><label style={{ fontSize: '11px', fontWeight: '600' }}>Purchase Date *</label><input type="date" value={form.purchaseDate} onChange={e => setForm({ ...form, purchaseDate: e.target.value })} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '12px' }} /></div>
              <div><label style={{ fontSize: '11px', fontWeight: '600' }}>Last Service Date *</label><input type="date" value={form.lastServiceDate} onChange={e => setForm({ ...form, lastServiceDate: e.target.value })} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '12px' }} /></div>
              <div><label style={{ fontSize: '11px', fontWeight: '600' }}>Service Interval (Days)</label><input type="number" value={form.serviceInterval} onChange={e => setForm({ ...form, serviceInterval: e.target.value })} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '12px' }} /></div>
              <div style={{ gridColumn: 'span 2' }}><label style={{ fontSize: '11px', fontWeight: '600' }}>Notes</label><input placeholder="Any notes..." value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '12px' }} /></div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '12px' }}>
              <button onClick={handleSaveEquipment} style={{ background: '#16a34a', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '6px', fontSize: '12px', cursor: 'pointer' }}>{editingId ? 'Update Equipment' : 'Save Equipment'}</button>
              <button onClick={() => { setForm({ name: '', type: 'Tractor', status: 'Active', purchaseDate: '', serviceInterval: 90, lastServiceDate: '', notes: '' }); setEditingId(null); }} style={{ background: '#fff', border: '1px solid #e2e8f0', padding: '8px 16px', borderRadius: '6px', fontSize: '12px', cursor: 'pointer' }}>Reset</button>
            </div>
          </div>

          <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '16px', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '14px', fontWeight: '700', margin: '0 0 8px 0' }}>Equipment Table<br/><span style={{ fontWeight: '400', fontSize: '11px', color: '#64748b' }}>Registered Equipment</span></h3>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
              <input placeholder="Search by name..." value={search} onChange={e => setSearch(e.target.value)} style={{ flex: 1, padding: '6px 8px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '11px' }} />
              <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} style={{ padding: '6px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '11px' }}><option value="All">All Status</option><option>Active</option><option>Under Repair</option><option>Idle</option></select>
              <select value={filterType} onChange={e => setFilterType(e.target.value)} style={{ padding: '6px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '11px' }}><option value="All">All Types</option><option>Tractor</option><option>Water Pump</option><option>Sprayer</option><option>Harvester</option><option>Other</option></select>
            </div>
            <table style={{ width: '100%', fontSize: '11px', borderCollapse: 'collapse' }}>
              <thead><tr style={{ textAlign: 'left', color: '#64748b', borderBottom: '1px solid #e2e8f0' }}><th>Equipment</th><th>Type</th><th>Next Service Date</th><th>Status</th><th>Actions</th></tr></thead>
              <tbody>
                {filteredEquipment.map(eq => {
                  const info = getStatusInfo(eq.nextServiceDate);
                  return (
                    <tr key={eq.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '8px 0' }}><b>{eq.name}</b><br/><span style={{ fontSize: '10px', color: '#64748b' }}>Serial: {eq.serial}</span></td>
                      <td><span style={{ background: eq.type === 'Tractor' ? '#0ea5e9' : '#a855f7', color: '#fff', padding: '2px 6px', borderRadius: '4px', fontSize: '10px' }}>{eq.type}</span></td>
                      <td>{eq.nextServiceDate}<br/><span style={{ fontSize: '10px', color: info.color === 'red' ? '#ef4444' : info.color === 'yellow' ? '#ca8a04' : '#16a34a' }}>{info.text}</span></td>
                      <td><span style={{ background: eq.status === 'Active' ? '#22c55e' : eq.status === 'Under Repair' ? '#f97316' : '#94a3b8', color: '#fff', padding: '2px 6px', borderRadius: '4px', fontSize: '10px' }}>{eq.status}</span></td>
                      <td><button onClick={() => handleEdit(eq)} style={{ background: '#fff', border: '1px solid #e2e8f0', padding: '2px 6px', borderRadius: '4px', fontSize: '10px', cursor: 'pointer', marginRight: '4px' }}>Edit</button><button onClick={() => handleDelete(eq.id)} style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#ef4444', padding: '2px 6px', borderRadius: '4px', fontSize: '10px', cursor: 'pointer' }}>Delete</button></td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '16px' }}>
            <h3 style={{ fontSize: '14px', fontWeight: '700', margin: '0 0 8px 0' }}>Maintenance Log<br/><span style={{ fontWeight: '400', fontSize: '11px', color: '#64748b' }}>Recent maintenance activities</span></h3>
            <table style={{ width: '100%', fontSize: '11px', borderCollapse: 'collapse' }}>
              <thead><tr style={{ textAlign: 'left', color: '#64748b', borderBottom: '1px solid #e2e8f0' }}><th>Date</th><th>Equipment</th><th>Description</th><th>Cost</th><th>Performed By</th><th>Actions</th></tr></thead>
              <tbody>
                {maintenance.map(log => (
                  <tr key={log.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '6px 0' }}>{log.date}</td>
                    <td>{equipment.find(e=>e.id===log.equipmentId)?.name || '-'}</td>
                    <td>{log.description}</td>
                    <td>PKR {log.cost}</td>
                    <td>{log.performedBy}</td>
                    <td><button onClick={() => { if(window.confirm('Delete this log?')) setMaintenance(maintenance.filter(m => m.id !== log.id)) }} style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#ef4444', padding: '2px 6px', borderRadius: '4px', fontSize: '10px', cursor: 'pointer' }}>Delete</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div>
          <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '12px', marginBottom: '12px' }}>
            <h4 style={{ fontSize: '12px', fontWeight: '700', margin: '0 0 8px 0' }}>⚠ Service Due Panel</h4>
            {overdueList.length > 0 && (
              <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '6px', padding: '8px', marginBottom: '8px' }}>
                <div style={{ fontSize: '11px', fontWeight: '700', color: '#dc2626' }}>Overdue<br/><span style={{ fontWeight: '400', fontSize: '10px' }}>{overdueList.length} equipment is overdue for service</span></div>
                {overdueList.slice(0,5).map(eq => <div key={eq.id} style={{ fontSize: '10px', marginTop: '4px' }}><b>{eq.name}</b><br/><span style={{ color: '#ef4444' }}>{getStatusInfo(eq.nextServiceDate).text}</span></div>)}
              </div>
            )}
            {dueSoonList.length > 0 && (
              <div style={{ background: '#fefce8', border: '1px solid #fde68a', borderRadius: '6px', padding: '8px' }}>
                <div style={{ fontSize: '11px', fontWeight: '700', color: '#ca8a04' }}>Due Soon</div>
                {dueSoonList.slice(0,5).map(eq => <div key={eq.id} style={{ fontSize: '10px', marginTop: '4px' }}><b>{eq.name}</b><br/>Due on {eq.nextServiceDate}<br/>{getStatusInfo(eq.nextServiceDate).text}</div>)}
              </div>
            )}
            {overdueList.length === 0 && dueSoonList.length === 0 && <div style={{ fontSize: '11px', color: '#16a34a' }}>✅ All equipment OK</div>}
          </div>

          <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '12px' }}>
            <h4 style={{ fontSize: '12px', fontWeight: '700', margin: '0 0 8px 0' }}>Equipment Status</h4>
            <div style={{ border: '1px solid #bbf7d0', borderRadius: '6px', padding: '8px', marginBottom: '8px', background: '#f0fdf4' }}><div style={{ fontSize: '10px', color: '#16a34a' }}>Active</div><div style={{ fontSize: '18px', fontWeight: '800' }}>{activeCount}</div><div style={{ fontSize: '10px', color: '#64748b' }}>Operational</div></div>
            <div style={{ border: '1px solid #fed7aa', borderRadius: '6px', padding: '8px', marginBottom: '8px', background: '#fff7ed' }}><div style={{ fontSize: '10px', color: '#ea580c' }}>Under Repair</div><div style={{ fontSize: '18px', fontWeight: '800' }}>{repairCount}</div><div style={{ fontSize: '10px', color: '#64748b' }}>Repair in progress</div></div>
            <div style={{ border: '1px solid #cbd5e1', borderRadius: '6px', padding: '8px', background: '#f8fafc' }}><div style={{ fontSize: '10px', color: '#64748b' }}>Idle</div><div style={{ fontSize: '18px', fontWeight: '800' }}>{idleCount}</div><div style={{ fontSize: '10px', color: '#64748b' }}>Currently idle</div></div>
          </div>

          <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '12px', marginTop: '12px' }}>
            <h4 style={{ fontSize: '12px', fontWeight: '700' }}>Add Maintenance Log</h4>
            <select value={logForm.equipmentId} onChange={e => setLogForm({ ...logForm, equipmentId: e.target.value })} style={{ width: '100%', padding: '6px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '11px', marginBottom: '6px' }}><option value="">Select Equipment</option>{equipment.map(eq => <option key={eq.id} value={eq.id}>{eq.name}</option>)}</select>
            <input type="date" value={logForm.date} onChange={e => setLogForm({ ...logForm, date: e.target.value })} style={{ width: '100%', padding: '6px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '11px', marginBottom: '6px' }} />
            <input placeholder="Description" value={logForm.description} onChange={e => setLogForm({ ...logForm, description: e.target.value })} style={{ width: '100%', padding: '6px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '11px', marginBottom: '6px' }} />
            <input placeholder="Cost Rs." type="number" value={logForm.cost} onChange={e => setLogForm({ ...logForm, cost: e.target.value })} style={{ width: '100%', padding: '6px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '11px', marginBottom: '6px' }} />
            <input placeholder="Performed By" value={logForm.performedBy} onChange={e => setLogForm({ ...logForm, performedBy: e.target.value })} style={{ width: '100%', padding: '6px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '11px', marginBottom: '6px' }} />
            <button onClick={handleAddLog} style={{ width: '100%', background: '#0f3d2e', color: '#fff', padding: '8px', borderRadius: '6px', fontSize: '12px', border: 'none', cursor: 'pointer' }}>Add Maintenance</button>
          </div>
        </div>
      </div>
    </div>
  );
}
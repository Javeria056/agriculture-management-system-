import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addWorker, deleteWorker } from '../store/reducers/workersSlice';
import { markAttendance } from '../store/reducers/attendanceSlice';

const WorkersManagement = () => {
  const dispatch = useDispatch();
  const workers = useSelector((s) => s.workers.workers || []);
  const attendance = useSelector((s) => s.attendance.list || []);
  const [fullName, setFullName] = useState('');
  const [dailyWage, setDailyWage] = useState('');
  const [contact, setContact] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  const handleAdd = (e) => {
    e.preventDefault();
    if (!fullName || !dailyWage) return;
    dispatch(addWorker({ fullName, dailyWage: Number(dailyWage), contact }));
    setFullName('');
    setDailyWage('');
    setContact('');
  };

  const getStatusForDate = (workerId) => {
    const record = attendance.find((a) => String(a.workerId) === String(workerId) && a.date === selectedDate);
    return record ? record.status : 'Absent';
  };

  const totalPending = workers.reduce((sum, w) => {
    const days = attendance.filter((x) => String(x.workerId) === String(w.id) && x.status === 'Present').length;
    return sum + days * Number(w.dailyWage);
  }, 0);

  return (
    <div style={{ padding: '24px', background: '#f5f7f5', minHeight: '100vh', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      <div style={{ background: 'white', borderRadius: '16px', padding: '24px', border: '1px solid #e5e7eb' }}>
        <h1 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '16px' }}>Workers Management</h1>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <input style={{ border: '2px solid #d1d5db', borderRadius: '12px', padding: '12px 16px', flex: 1, minWidth: '180px' }} placeholder="Full Name" value={fullName} onChange={(e) => setFullName(e.target.value)} />
          <input style={{ border: '2px solid #d1d5db', borderRadius: '12px', padding: '12px 16px', flex: 1, minWidth: '180px' }} placeholder="Daily Wage" type="number" value={dailyWage} onChange={(e) => setDailyWage(e.target.value)} />
          <input style={{ border: '2px solid #d1d5db', borderRadius: '12px', padding: '12px 16px', flex: 1, minWidth: '180px' }} placeholder="Contact" value={contact} onChange={(e) => setContact(e.target.value)} />
          <button onClick={handleAdd} style={{ background: '#15803d', color: 'white', padding: '12px 32px', borderRadius: '12px', fontWeight: '700', border: 'none', cursor: 'pointer' }}>+ Add Worker</button>
        </div>
      </div>

      <div style={{ background: 'white', borderRadius: '16px', padding: '24px', border: '1px solid #e5e7eb' }}>
        <h2 style={{ fontSize: '20px', fontWeight: '800', marginBottom: '16px' }}>Workers List</h2>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '700px' }}>
            <thead>
              <tr style={{ background: '#f3f4f6', textAlign: 'left' }}>
                <th style={{ padding: '12px' }}>Name</th>
                <th style={{ padding: '12px' }}>Wage</th>
                <th style={{ padding: '12px' }}>Contact</th>
                <th style={{ padding: '12px' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {workers.map((w) => (
                <tr key={w.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                  <td style={{ padding: '12px', fontWeight: '600' }}>{w.fullName}</td>
                  <td style={{ padding: '12px' }}>PKR {w.dailyWage}</td>
                  <td style={{ padding: '12px' }}>{w.contact}</td>
                  <td style={{ padding: '12px', display: 'flex', gap: '8px' }}>
                    <button onClick={() => dispatch(markAttendance({ workerId: String(w.id), workerName: w.fullName, date: new Date().toISOString().split('T')[0], status: 'Present' }))} style={{ background: '#16a34a', color: 'white', padding: '8px 18px', borderRadius: '20px', border: 'none', fontWeight: '700', cursor: 'pointer' }}>Present</button>
                    <button onClick={() => dispatch(markAttendance({ workerId: String(w.id), workerName: w.fullName, date: new Date().toISOString().split('T')[0], status: 'Absent' }))} style={{ background: '#facc15', color: 'black', padding: '8px 18px', borderRadius: '20px', border: 'none', fontWeight: '700', cursor: 'pointer' }}>Absent</button>
                    <button onClick={() => dispatch(deleteWorker(w.id))} style={{ background: '#dc2626', color: 'white', padding: '8px 18px', borderRadius: '20px', border: 'none', fontWeight: '700', cursor: 'pointer' }}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div style={{ background: 'white', borderRadius: '16px', padding: '24px', border: '1px solid #e5e7eb' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px', flexWrap: 'wrap' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '800', margin: 0 }}>Attendance Register</h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginLeft: '16px' }}>
            <span style={{ fontSize: '14px', fontWeight: '600' }}>Date:</span>
            <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} style={{ border: '1px solid #d1d5db', borderRadius: '8px', padding: '6px 10px' }} />
            <span style={{ fontSize: '12px', color: '#6b7280' }}>Mark attendance for {selectedDate}</span>
          </div>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '700px' }}>
            <thead>
              <tr style={{ background: '#f3f4f6', textAlign: 'left' }}>
                <th style={{ padding: '10px' }}>Worker Name</th>
                <th style={{ padding: '10px' }}>Role</th>
                <th style={{ padding: '10px' }}>Status</th>
                <th style={{ padding: '10px' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {workers.map((w) => {
                const status = getStatusForDate(w.id);
                return (
                  <tr key={w.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                    <td style={{ padding: '10px', fontWeight: '600' }}>{w.fullName}</td>
                    <td style={{ padding: '10px' }}><span style={{ background: '#dcfce7', color: '#166534', padding: '4px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: '700' }}>Field Worker</span></td>
                    <td style={{ padding: '10px' }}><span style={{ background: status === 'Present' ? '#dcfce7' : '#fee2e2', color: status === 'Present' ? '#166534' : '#991b1b', padding: '4px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: '700' }}>{status}</span></td>
                    <td style={{ padding: '10px', display: 'flex', gap: '8px' }}>
                      <button onClick={() => dispatch(markAttendance({ workerId: String(w.id), workerName: w.fullName, date: selectedDate, status: 'Present' }))} style={{ background: 'white', border: '1.5px solid #16a34a', color: '#16a34a', padding: '6px 14px', borderRadius: '6px', fontWeight: '700', cursor: 'pointer' }}>Present</button>
                      <button onClick={() => dispatch(markAttendance({ workerId: String(w.id), workerName: w.fullName, date: selectedDate, status: 'Absent' }))} style={{ background: status === 'Absent' ? '#dc2626' : 'white', border: '1.5px solid #dc2626', color: status === 'Absent' ? 'white' : '#dc2626', padding: '6px 14px', borderRadius: '6px', fontWeight: '700', cursor: 'pointer' }}>Absent</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div style={{ background: 'white', borderRadius: '16px', padding: '24px', border: '1px solid #e5e7eb' }}>
        <h2 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '16px' }}>Wage Summary</h2>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '700px' }}>
            <thead>
              <tr style={{ background: '#f3f4f6', textAlign: 'left' }}>
                <th style={{ padding: '10px' }}>Worker</th>
                <th style={{ padding: '10px' }}>Days Present</th>
                <th style={{ padding: '10px' }}>Daily Wage (PKR)</th>
                <th style={{ padding: '10px' }}>Total Wage (PKR)</th>
                <th style={{ padding: '10px' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {workers.map((w) => {
                const days = attendance.filter((x) => String(x.workerId) === String(w.id) && x.status === 'Present').length;
                const total = days * Number(w.dailyWage);
                return (
                  <tr key={w.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                    <td style={{ padding: '10px', fontWeight: '600' }}>{w.fullName}</td>
                    <td style={{ padding: '10px' }}>{days}</td>
                    <td style={{ padding: '10px' }}>{w.dailyWage}</td>
                    <td style={{ padding: '10px', fontWeight: '800' }}>PKR {total.toLocaleString()}</td>
                    <td style={{ padding: '10px' }}><button style={{ background: '#15803d', color: 'white', padding: '6px 14px', borderRadius: '6px', border: 'none', fontSize: '12px', fontWeight: '700', cursor: 'pointer' }}>Pay Wages</button></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '12px', marginTop: '16px', borderTop: '1px solid #e5e7eb', paddingTop: '16px', flexWrap: 'wrap' }}>
          <span style={{ fontWeight: '800', fontSize: '14px' }}>Total Pending Wages: PKR {totalPending.toLocaleString()}</span>
          <button style={{ background: '#15803d', color: 'white', padding: '8px 18px', borderRadius: '8px', border: 'none', fontWeight: '700', cursor: 'pointer' }}>Pay All Wages</button>
        </div>
      </div>

    </div>
  );
};

export default WorkersManagement;
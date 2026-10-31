import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { login } from '../store/reducers/authSlice';
import { useNavigate } from 'react-router-dom';

export default function Login(){
  const [user,setUser]=useState(''); const [role,setRole]=useState('manager');
  const dispatch=useDispatch(); const nav=useNavigate();
  const handleLogin=()=>{
    if(!user) return alert('Name likho');
    dispatch(login({username:user, role:role}));
    nav('/');
  }
  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="card p-4 shadow" style={{width:'350px'}}>
        <h3 className="text-center mb-3">AgriNova Login</h3>
        <input className="form-control mb-2" placeholder="Username" onChange={e=>setUser(e.target.value)} />
        <select className="form-select mb-3" onChange={e=>setRole(e.target.value)}>
          <option value="manager">Farm Manager</option>
          <option value="admin">Administrator</option>
        </select>
        <button className="btn btn-success w-100" onClick={handleLogin}>Login</button>
      </div>
    </div>
  )
}
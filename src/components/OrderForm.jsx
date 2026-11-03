import { useEffect, useState } from "react";

const initialStock = {
  Wheat: 700,
  Corn: 600,
  Potato: 450,
  Tomato: 300,
};

function readStorage(key, fallback) {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : fallback;
  } catch {
    return fallback;
  }
}

function OrderForm() {
  const [form, setForm] = useState({
    name: "",
    cnic: "",
    crop: "Wheat",
    quantity: "",
    date: "",
    photo: "",
  });

  const [buyers, setBuyers] = useState(() => readStorage("agrinovaOrders", []));
  const [stock, setStock] = useState(() => readStorage("agrinovaStock", initialStock));
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    localStorage.setItem("agrinovaOrders", JSON.stringify(buyers));
  }, [buyers]);

  useEffect(() => {
    localStorage.setItem("agrinovaStock", JSON.stringify(stock));
  }, [stock]);

  useEffect(() => {
    const log = readStorage("agri_activity", []);
    if (buyers.length > 0) {
      localStorage.setItem("agri_activity", JSON.stringify(log));
    }
  }, [buyers]);

  const handlePhoto = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 1024 * 1024) {
      setError("Image must be less than 1 MB");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setForm({ ...form, photo: reader.result });
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(""); setMessage("");

    if (form.name.length < 3) return setError("Full Name min 3 characters");
    if (!/^\d{5}-\d{7}-\d{1}$/.test(form.cnic)) return setError("CNIC format: 12345-1234567-1");
    if (!form.date) return setError("Delivery Date required");
    if (Number(form.quantity) > stock[form.crop]) return setError(`Only ${stock[form.crop]} kg available for ${form.crop}`);

    const newBuyer = { id: Date.now(), ...form, quantity: Number(form.quantity) };
    setBuyers([...buyers, newBuyer]);
    setStock({ ...stock, [form.crop]: stock[form.crop] - Number(form.quantity) });
    
    // activity log
    const logs = readStorage("agri_activity", []);
    logs.push({ id: Date.now(), user: "Admin", action: "ADD", entity: `Buyer ${form.name}`, time: new Date().toLocaleString() });
    localStorage.setItem("agri_activity", JSON.stringify(logs));

    setMessage("Buyer Saved Successfully!");
    setForm({ name: "", cnic: "", crop: "Wheat", quantity: "", date: "", photo: "" });
  };

  const filtered = buyers.filter(b => b.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div style={{ background: 'white', padding: '20px', borderRadius: '12px' }}>
      <h2><i className="fa-solid fa-user-plus"></i> Buyer Registration</h2>
      <p style={{ color: '#666', fontSize: '14px', marginBottom: '15px' }}>Register buyers and manage crop orders</p>

      <div style={{ background: '#f3f4f6', padding: '12px', borderRadius: '8px', marginBottom: '15px', display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
        {Object.keys(stock).map(c => <span key={c}><strong>{c}</strong> {stock[c]} kg</span>)}
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        <div>
          <label style={{ fontSize: '12px', fontWeight: 'bold' }}>Full Name</label>
          <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Enter buyer name" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ccc', marginTop: '4px' }} />
        </div>
        <div>
          <label style={{ fontSize: '12px', fontWeight: 'bold' }}>Delivery Date</label>
          <input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ccc', marginTop: '4px' }} />
        </div>
        <div>
          <label style={{ fontSize: '12px', fontWeight: 'bold' }}>CNIC Number (12345-1234567-1)</label>
          <input value={form.cnic} onChange={e => setForm({ ...form, cnic: e.target.value })} placeholder="12345-1234567-1" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ccc', marginTop: '4px' }} />
        </div>
        <div>
          <label style={{ fontSize: '12px', fontWeight: 'bold' }}>CNIC Photo (JPG/PNG, max 1 MB)</label>
          <input type="file" accept=".jpg,.png" onChange={handlePhoto} style={{ width: '100%', padding: '7px', borderRadius: '8px', border: '1px solid #ccc', marginTop: '4px' }} />
        </div>
        <div>
          <label style={{ fontSize: '12px', fontWeight: 'bold' }}>Crop</label>
          <select value={form.crop} onChange={e => setForm({ ...form, crop: e.target.value })} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ccc', marginTop: '4px' }}>
            <option>Wheat</option><option>Corn</option><option>Potato</option><option>Tomato</option>
          </select>
        </div>
        <div>
          <label style={{ fontSize: '12px', fontWeight: 'bold' }}>Quantity (kg)</label>
          <input type="number" value={form.quantity} onChange={e => setForm({ ...form, quantity: e.target.value })} placeholder={`Available ${stock[form.crop]} kg`} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ccc', marginTop: '4px' }} />
        </div>
        <div style={{ gridColumn: '1 / -1' }}>
          {error && <p style={{ color: 'red', fontSize: '13px' }}><i className="fa-solid fa-circle-exclamation"></i> {error}</p>}
          {message && <p style={{ color: 'green', fontSize: '13px' }}><i className="fa-solid fa-check"></i> {message}</p>}
          <button type="submit" style={{ marginTop: '10px', padding: '12px 20px', background: '#0a3d2e', color: 'white', border: 'none', borderRadius: '8px' }}><i className="fa-solid fa-floppy-disk"></i> Save Buyer</button>
        </div>
      </form>

      <h3 style={{ marginTop: '25px' }}>Registered Buyers</h3>
      <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search buyer..." style={{ padding: '8px', borderRadius: '6px', border: '1px solid #ccc', margin: '10px 0', width: '200px' }} />
      {filtered.length === 0 ? <p style={{ color: '#888', fontSize: '13px' }}>No record(s) yet</p> : filtered.map(b => <div key={b.id} style={{ padding: '8px', borderBottom: '1px solid #eee', fontSize: '13px' }}>{b.name} - {b.crop} {b.quantity}kg - {b.cnic}</div>)}
    </div>
  );
}

export default OrderForm;
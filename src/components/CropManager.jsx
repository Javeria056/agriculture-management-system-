
import { useEffect, useState } from "react";

const starterCrops = [
  { id: 1, name: "Wheat", field: "Field A", quantity: 1200, health: 85 },
  { id: 2, name: "Corn", field: "Field B", quantity: 900, health: 72 },
  { id: 3, name: "Potato", field: "Field C", quantity: 650, health: 48 },
  { id: 4, name: "Tomato", field: "Field D", quantity: 500, health: 25 },
];

function loadCrops() {
  try {
    const saved = localStorage.getItem("agrinovaCrops");
    return saved ? JSON.parse(saved) : starterCrops;
  } catch {
    return starterCrops;
  }
}

function CropManager() {
  const [crops, setCrops] = useState(loadCrops);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: "",
    field: "",
    quantity: "",
    health: "80",
  });

  useEffect(() => {
    localStorage.setItem("agrinovaCrops", JSON.stringify(crops));
  }, [crops]);

  function handleChange(event) {
    setForm({ ...form, [event.target.name]: event.target.value });
  }

  function resetForm() {
    setForm({ name: "", field: "", quantity: "", health: "80" });
    setEditingId(null);
  }

  function saveCrop(event) {
    event.preventDefault();
    setMessage("");
    setError("");

    const name = form.name.trim();
    const field = form.field.trim();
    const quantity = Number(form.quantity);
    const health = Number(form.health);

    if (name.length < 2 || field.length < 2) {
      setError("Enter a crop name and field name.");
      return;
    }

    if (!Number.isFinite(quantity) || quantity <= 0) {
      setError("Quantity must be greater than zero.");
      return;
    }

    if (!Number.isFinite(health) || health < 0 || health > 100) {
      setError("Health score must be between 0 and 100.");
      return;
    }

    const duplicate = crops.some(
      (crop) =>
        crop.name.toLowerCase() === name.toLowerCase() &&
        crop.id !== editingId
    );

    if (duplicate) {
      setError("A crop with this name already exists.");
      return;
    }

    let updated;

    if (editingId !== null) {
      updated = crops.map((crop) =>
        crop.id === editingId
          ? { ...crop, name, field, quantity, health }
          : crop
      );
      setMessage("Crop updated successfully.");
    } else {
      updated = [
        ...crops,
        { id: Date.now(), name, field, quantity, health },
      ];
      setMessage("Crop added successfully.");
    }

    try {
      localStorage.setItem("agrinovaCrops", JSON.stringify(updated));
      setCrops(updated);
      resetForm();
    } catch {
      setError("Could not save crop data in browser storage.");
      setMessage("");
    }
  }

  function editCrop(crop) {
    setEditingId(crop.id);
    setForm({
      name: crop.name,
      field: crop.field,
      quantity: String(crop.quantity),
      health: String(crop.health),
    });
    setMessage("");
    setError("");
  }

  function deleteCrop(id) {
    const crop = crops.find((item) => item.id === id);
    if (!crop) return;

    if (!window.confirm(`Delete ${crop.name} from crop records?`)) return;

    const updated = crops.filter((item) => item.id !== id);

    try {
      localStorage.setItem("agrinovaCrops", JSON.stringify(updated));
      setCrops(updated);

      if (editingId === id) resetForm();

      setMessage("Crop record deleted.");
      setError("");
    } catch {
      setError("Could not delete crop record.");
    }
  }

  function getStatus(health) {
    if (health >= 70) return "Healthy";
    if (health >= 40) return "Needs Attention";
    return "Critical";
  }

  const filteredCrops = crops.filter((crop) => {
    const matchesSearch =
      crop.name.toLowerCase().includes(search.toLowerCase()) ||
      crop.field.toLowerCase().includes(search.toLowerCase());

    const matchesFilter =
      filter === "All" || getStatus(crop.health) === filter;

    return matchesSearch && matchesFilter;
  });

  function exportCSV() {
    const headings = ["Crop", "Field", "Quantity (kg)", "Health Score", "Status"];
    const rows = filteredCrops.map((crop) => [
      crop.name,
      crop.field,
      crop.quantity,
      crop.health,
      getStatus(crop.health),
    ]);

    const escapeCell = (value) =>
      `"${String(value).replace(/"/g, '""')}"`;

    const csv = [headings, ...rows]
      .map((row) => row.map(escapeCell).join(","))
      .join("\r\n");

    const blob = new Blob(["\uFEFF" + csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "agrinova-crops.csv";
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <section className="content-card crop-manager">
      <div className="section-heading crop-manager-heading">
        <div>
          <h2>
            <i className="fa-solid fa-seedling"></i> Crop Management
          </h2>
          <p>Add, update, search and manage your crop records</p>
        </div>

        <button type="button" className="crop-export-btn" onClick={exportCSV}>
          <i className="fa-solid fa-file-csv"></i> Export CSV
        </button>
      </div>

      <form className="crop-form" onSubmit={saveCrop}>
        <label>
          Crop Name
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="e.g. Rice"
            required
          />
        </label>

        <label>
          Field Name
          <input
            name="field"
            value={form.field}
            onChange={handleChange}
            placeholder="e.g. Field E"
            required
          />
        </label>

        <label>
          Quantity (kg)
          <input
            name="quantity"
            type="number"
            min="1"
            value={form.quantity}
            onChange={handleChange}
            placeholder="Enter quantity"
            required
          />
        </label>

        <label>
          Health Score (%)
          <input
            name="health"
            type="number"
            min="0"
            max="100"
            value={form.health}
            onChange={handleChange}
            required
          />
        </label>

        <div className="crop-form-actions">
          <button className="crop-save-btn" type="submit">
            <i className={`fa-solid ${editingId !== null ? "fa-pen" : "fa-plus"}`}></i>
            {editingId !== null ? " Update Crop" : " Add Crop"}
          </button>

          {editingId !== null && (
            <button
              className="crop-cancel-btn"
              type="button"
              onClick={resetForm}
            >
              Cancel
            </button>
          )}
        </div>

        {error && <p className="form-error">{error}</p>}
        {message && <p className="form-success">{message}</p>}
      </form>

      <div className="crop-filters">
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search crop or field..."
          aria-label="Search crop or field"
        />

        <select
          value={filter}
          onChange={(event) => setFilter(event.target.value)}
          aria-label="Filter crop health"
        >
          <option value="All">All Health Statuses</option>
          <option value="Healthy">Healthy</option>
          <option value="Needs Attention">Needs Attention</option>
          <option value="Critical">Critical</option>
        </select>
      </div>

      <div className="harvest-table-wrap">
        <table className="harvest-table">
          <thead>
            <tr>
              <th>Crop</th>
              <th>Field</th>
              <th>Quantity</th>
              <th>Health</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredCrops.map((crop) => (
              <tr key={crop.id}>
                <td>{crop.name}</td>
                <td>{crop.field}</td>
                <td>{Number(crop.quantity).toLocaleString()} kg</td>
                <td>{crop.health}%</td>
                <td>
                  <span className={`crop-status status-${getStatus(crop.health).toLowerCase().replaceAll(" ", "-")}`}>
                    {getStatus(crop.health)}
                  </span>
                </td>
                <td className="crop-action-cell">
                  <button
                    type="button"
                    className="crop-edit-btn"
                    onClick={() => editCrop(crop)}
                    aria-label={`Edit ${crop.name}`}
                  >
                    <i className="fa-solid fa-pen"></i>
                  </button>

                  <button
                    type="button"
                    className="crop-delete-btn"
                    onClick={() => deleteCrop(crop.id)}
                    aria-label={`Delete ${crop.name}`}
                  >
                    <i className="fa-solid fa-trash"></i>
                  </button>
                </td>
              </tr>
            ))}

            {filteredCrops.length === 0 && (
              <tr>
                <td colSpan="6">No matching crops found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default CropManager;

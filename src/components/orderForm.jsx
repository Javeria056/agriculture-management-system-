
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

  const [buyers, setBuyers] = useState(() =>
    readStorage("agrinovaOrders", [])
  );

  const [stock, setStock] = useState(() =>
    readStorage("agrinovaStock", initialStock)
  );

  const [search, setSearch] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    localStorage.setItem("agrinovaStock", JSON.stringify(stock));
  }, [stock]);

  function handleChange(event) {
    const { name, value } = event.target;

    if (name === "cnic") {
      const digits = value.replace(/\D/g, "").slice(0, 13);
      let formatted = digits.slice(0, 5);

      if (digits.length > 5) {
        formatted += "-" + digits.slice(5, 12);
      }

      if (digits.length > 12) {
        formatted += "-" + digits.slice(12, 13);
      }

      setForm((previous) => ({ ...previous, cnic: formatted }));
      return;
    }

    setForm((previous) => ({ ...previous, [name]: value }));
  }

  function handlePhoto(event) {
    const file = event.target.files[0];
    setError("");
    setMessage("");

    if (!file) return;

    if (!["image/jpeg", "image/png"].includes(file.type)) {
      setError("Please select a JPG or PNG image.");
      event.target.value = "";
      return;
    }

    if (file.size > 1024 * 1024) {
      setError("Image must be 1 MB or smaller.");
      event.target.value = "";
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      setForm((previous) => ({
        ...previous,
        photo: reader.result,
      }));
    };

    reader.readAsDataURL(file);
  }

  function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setMessage("");

    const name = form.name.trim();
    const cnic = form.cnic.replace(/\D/g, "");
    const quantity = Number(form.quantity);

    if (!/^[A-Za-z ]{3,}$/.test(name)) {
      setError("Name must have at least 3 letters and spaces only.");
      return;
    }

    if (cnic.length !== 13) {
      setError("Enter a valid 13-digit CNIC.");
      return;
    }

    if (buyers.some((buyer) => buyer.cnic === cnic)) {
      setError("This CNIC is already registered.");
      return;
    }

    if (!form.photo) {
      setError("Please upload a JPG or PNG image.");
      return;
    }

    if (!Number.isFinite(quantity) || quantity <= 0) {
      setError("Enter a valid quantity greater than zero.");
      return;
    }

    if (quantity > (Number(stock[form.crop]) || 0)) {
      setError(
        `Only ${Number(stock[form.crop]) || 0} kg of ${form.crop} is available.`
      );
      return;
    }

    if (!form.date) {
      setError("Please select a delivery date.");
      return;
    }

    const newBuyer = {
      id: Date.now(),
      name,
      cnic,
      crop: form.crop,
      quantity,
      date: form.date,
      photo: form.photo,
    };

    const updatedBuyers = [...buyers, newBuyer];

    const updatedStock = {
      ...stock,
      [form.crop]: Number(stock[form.crop]) - quantity,
    };

    try {
      localStorage.setItem(
        "agrinovaOrders",
        JSON.stringify(updatedBuyers)
      );

      localStorage.setItem(
        "agrinovaStock",
        JSON.stringify(updatedStock)
      );
    } catch {
      setError("Could not save. Try using a smaller image.");
      return;
    }

    setBuyers(updatedBuyers);
    setStock(updatedStock);

    window.dispatchEvent(new Event("agrinova-updated"));

    setForm({
      name: "",
      cnic: "",
      crop: "Wheat",
      quantity: "",
      date: "",
      photo: "",
    });

    event.target.reset();
    setMessage("Buyer saved successfully and stock updated.");
  }

  function deleteBuyer(id) {
    const buyerToDelete = buyers.find((buyer) => buyer.id === id);

    if (!buyerToDelete) return;

    const updatedBuyers = buyers.filter((buyer) => buyer.id !== id);

    const updatedStock = {
      ...stock,
      [buyerToDelete.crop]:
        Number(stock[buyerToDelete.crop] || 0) +
        Number(buyerToDelete.quantity),
    };

    try {
      localStorage.setItem(
        "agrinovaOrders",
        JSON.stringify(updatedBuyers)
      );

      localStorage.setItem(
        "agrinovaStock",
        JSON.stringify(updatedStock)
      );

      setBuyers(updatedBuyers);
      setStock(updatedStock);
      setMessage("Buyer deleted and crop stock restored.");
      setError("");

      window.dispatchEvent(new Event("agrinova-updated"));
    } catch {
      setError("Could not update saved records.");
    }
  }

  const filteredBuyers = buyers.filter(
    (buyer) =>
      buyer.name.toLowerCase().includes(search.toLowerCase()) ||
      buyer.cnic.includes(search.replace(/\D/g, ""))
  );

  return (
    <section className="content-card buyer-form-card">
      <div className="section-heading">
        <div>
          <h2>
            <i className="fa-solid fa-user-plus"></i> Buyer Registration
          </h2>
          <p>Register buyers and manage crop orders</p>
        </div>
      </div>

      <div className="available-stock">
        {Object.entries(stock).map(([crop, amount]) => (
          <div className="stock-chip" key={crop}>
            <span>{crop}</span>
            <strong>{amount} kg</strong>
          </div>
        ))}
      </div>

      <form className="buyer-form" onSubmit={handleSubmit}>
        <label>
          Full Name
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Enter buyer name"
            required
          />
        </label>

        <label>
          CNIC Number
          <input
            name="cnic"
            value={form.cnic}
            onChange={handleChange}
            placeholder="12345-1234567-1"
            inputMode="numeric"
            required
          />
        </label>

        <label>
          Crop
          <select name="crop" value={form.crop} onChange={handleChange}>
            {Object.keys(stock).map((crop) => (
              <option key={crop} value={crop}>
                {crop}
              </option>
            ))}
          </select>
        </label>

        <label>
          Quantity (kg)
          <input
            name="quantity"
            type="number"
            min="1"
            max={stock[form.crop] || 0}
            value={form.quantity}
            onChange={handleChange}
            placeholder={`Available: ${stock[form.crop] || 0} kg`}
            required
          />
        </label>

        <label>
          Delivery Date
          <input
            name="date"
            type="date"
            value={form.date}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          CNIC Photo (JPG/PNG, max 1 MB)
          <input
            type="file"
            accept="image/jpeg,image/png"
            onChange={handlePhoto}
            required={!form.photo}
          />
        </label>

        {form.photo && (
          <div className="buyer-photo-preview">
            <img src={form.photo} alt="Uploaded document preview" />
            <button
              type="button"
              onClick={() =>
                setForm((previous) => ({ ...previous, photo: "" }))
              }
            >
              Remove Photo
            </button>
          </div>
        )}

        {error && <p className="form-error">{error}</p>}
        {message && <p className="form-success">{message}</p>}

        <button className="submit-order-btn" type="submit">
          <i className="fa-solid fa-floppy-disk"></i> Save Buyer
        </button>
      </form>

      <div className="buyer-table-section">
        <div className="section-heading">
          <div>
            <h2>Registered Buyers</h2>
            <p>{buyers.length} saved record(s)</p>
          </div>
        </div>

        <input
          className="buyer-search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search by buyer name or CNIC"
        />

        <div className="harvest-table-wrap">
          <table className="harvest-table">
            <thead>
              <tr>
                <th>Buyer</th>
                <th>CNIC</th>
                <th>Crop</th>
                <th>Quantity</th>
                <th>Date</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredBuyers.map((buyer) => (
                <tr key={buyer.id}>
                  <td>{buyer.name}</td>
                  <td>
                    {buyer.cnic.replace(
                      /^(\d{5})(\d{7})(\d)$/,
                      "$1-$2-$3"
                    )}
                  </td>
                  <td>{buyer.crop}</td>
                  <td>{buyer.quantity} kg</td>
                  <td>{buyer.date}</td>
                  <td>
                    <button
                      type="button"
                      className="delete-buyer-btn"
                      onClick={() => deleteBuyer(buyer.id)}
                    >
                      <i className="fa-solid fa-trash"></i> Delete
                    </button>
                  </td>
                </tr>
              ))}

              {filteredBuyers.length === 0 && (
                <tr>
                  <td colSpan="6">No buyer records found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

export default OrderForm;

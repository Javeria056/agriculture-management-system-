
import { useEffect, useState } from "react";

const harvestedCrops = {
  Wheat: 1200,
  Corn: 900,
  Potato: 650,
  Tomato: 500,
};

function readStorage(key, fallback) {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : fallback;
  } catch {
    return fallback;
  }
}

function HarvestSummary() {
  const [stock, setStock] = useState(() =>
    readStorage("agrinovaStock", {
      Wheat: 700,
      Corn: 600,
      Potato: 450,
      Tomato: 300,
    })
  );

  const [orders, setOrders] = useState(() =>
    readStorage("agrinovaOrders", [])
  );

  useEffect(() => {
    function updateSummary() {
      setStock(readStorage("agrinovaStock", {
        Wheat: 700,
        Corn: 600,
        Potato: 450,
        Tomato: 300,
      }));
      setOrders(readStorage("agrinovaOrders", []));
    }

    window.addEventListener("agrinova-updated", updateSummary);
    window.addEventListener("storage", updateSummary);

    return () => {
      window.removeEventListener("agrinova-updated", updateSummary);
      window.removeEventListener("storage", updateSummary);
    };
  }, []);

  const totalHarvested = Object.values(harvestedCrops).reduce(
    (sum, amount) => sum + amount,
    0
  );

  const totalStock = Object.values(stock).reduce(
    (sum, amount) => sum + Number(amount || 0),
    0
  );

  const totalSold = Math.max(0, totalHarvested - totalStock);
  const totalOrders = orders.length;

  return (
    <section className="content-card harvest-summary">
      <div className="section-heading">
        <div>
          <h2>
            <i className="fa-solid fa-chart-column"></i> Harvest & Orders
          </h2>
          <p>Track harvested crops, sales and remaining stock</p>
        </div>
      </div>

      <div className="harvest-stats">
        <div className="harvest-stat">
          <span>Total Harvested</span>
          <strong>{totalHarvested.toLocaleString()} kg</strong>
        </div>

        <div className="harvest-stat">
          <span>Orders Received</span>
          <strong>{totalOrders}</strong>
        </div>

        <div className="harvest-stat">
          <span>Quantity Sold</span>
          <strong>{totalSold.toLocaleString()} kg</strong>
        </div>

        <div className="harvest-stat">
          <span>Remaining Stock</span>
          <strong>{totalStock.toLocaleString()} kg</strong>
        </div>
      </div>

      <div className="harvest-table-wrap">
        <table className="harvest-table">
          <thead>
            <tr>
              <th>Crop</th>
              <th>Total Harvested</th>
              <th>Available Stock</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(harvestedCrops).map(([crop, amount]) => (
              <tr key={crop}>
                <td>{crop}</td>
                <td>{amount.toLocaleString()} kg</td>
                <td>{Number(stock[crop] || 0).toLocaleString()} kg</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default HarvestSummary;

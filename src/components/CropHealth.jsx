
import { useState } from "react";

const initialCrops = [
  { id: 1, name: "Wheat", field: "Field A", growth: 85 },
  { id: 2, name: "Corn", field: "Field B", growth: 72 },
  { id: 3, name: "Potato", field: "Field C", growth: 48 },
  { id: 4, name: "Tomato", field: "Field D", growth: 25 },
];

function getHealth(growth) {
  if (growth >= 70) return { label: "Healthy", className: "healthy" };
  if (growth >= 40) return { label: "Needs Attention", className: "attention" };
  return { label: "Critical", className: "critical" };
}

function CropHealth() {
  const [crops] = useState(initialCrops);

  return (
    <section className="content-card crop-health-card">
      <div className="section-heading">
        <div>
          <h2>
            <i className="fa-solid fa-seedling"></i> Crop Health
          </h2>
          <p>Monitor crop growth and health status</p>
        </div>
        <span className="status-pill">{crops.length} Crops</span>
      </div>

      <div className="crop-list">
        {crops.map((crop) => {
          const health = getHealth(crop.growth);

          return (
            <div className="crop-row" key={crop.id}>
              <div className="crop-info">
                <div className="crop-icon">
                  <i className="fa-solid fa-leaf"></i>
                </div>

                <div>
                  <strong>{crop.name}</strong>
                  <p>{crop.field}</p>
                </div>
              </div>

              <div className="crop-progress">
                <div className="crop-progress-label">
                  <span>Growth</span>
                  <strong>{crop.growth}%</strong>
                </div>

                <div className="progress-track">
                  <div
                    className={`progress-fill ${health.className}`}
                    style={{ width: `${crop.growth}%` }}
                  />
                </div>
              </div>

              <span className={`health-badge ${health.className}`}>
                {health.label}
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default CropHealth;

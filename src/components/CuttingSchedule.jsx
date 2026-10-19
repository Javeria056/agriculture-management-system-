
const harvests = [
  {
    id: 1,
    crop: "Wheat",
    field: "Field A",
    date: "2026-10-20",
  },
  {
    id: 2,
    crop: "Corn",
    field: "Field B",
    date: "2026-10-24",
  },
  {
    id: 3,
    crop: "Potato",
    field: "Field C",
    date: "2026-10-16",
  },
];

function CuttingSchedule() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  function getDaysRemaining(date) {
    const harvestDate = new Date(`${date}T00:00:00`);
    return Math.ceil((harvestDate - today) / (1000 * 60 * 60 * 24));
  }

  return (
    <section className="content-card cutting-card">
      <div className="section-heading">
        <div>
          <h2>
            <i className="fa-solid fa-calendar-days"></i> Cutting Schedule
          </h2>
          <p>Upcoming and overdue crop harvests</p>
        </div>
      </div>

      <div className="cutting-list">
        {harvests.map((item) => {
          const days = getDaysRemaining(item.date);

          return (
            <div className="cutting-row" key={item.id}>
              <div className="cutting-icon">
                <i className="fa-solid fa-wheat-awn"></i>
              </div>

              <div className="cutting-details">
                <strong>{item.crop}</strong>
                <span>{item.field}</span>
                <small>
                  <i className="fa-regular fa-calendar"></i>{" "}
                  {new Date(`${item.date}T00:00:00`).toLocaleDateString()}
                </small>
              </div>

              <span
                className={`cutting-status ${
                  days < 0 ? "overdue" : days === 0 ? "due" : "upcoming"
                }`}
              >
                {days < 0
                  ? `${Math.abs(days)} days overdue`
                  : days === 0
                  ? "Due today"
                  : `${days} days left`}
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default CuttingSchedule;

import { useState } from "react";
import "./App.css";

import CropManager from "./components/CropManager";
import OrderForm from "./components/OrderForm";
import HarvestSummary from "./components/HarvestSummary";
import CuttingSchedule from "./components/CuttingSchedule";
import CropHealth from "./components/CropHealth";
import WeatherCard from "./components/WeatherCard";

function App() {
  const [activePage, setActivePage] = useState("Dashboard");

  const menuItems = [
    { name: "Dashboard", icon: "fa-chart-line", id: "dashboard" },
    { name: "Crops", icon: "fa-seedling", id: "crops" },
    { name: "Weather", icon: "fa-cloud-sun", id: "weather" },
    {
      name: "Harvest & Orders",
      icon: "fa-boxes-stacked",
      id: "harvest",
    },
    { name: "Buyers", icon: "fa-users", id: "buyers" },
  ];

  function handleNavigation(item) {
    setActivePage(item.name);

    const target = document.getElementById(item.id);

    if (target) {
      const top =
        target.getBoundingClientRect().top + window.scrollY - 20;

      window.scrollTo({
        top: Math.max(0, top),
        behavior: "smooth",
      });
    }
  }

  return (
    <div className="app-container">
      <aside className="sidebar">
        <h2 className="brand">
          <i className="fa-solid fa-leaf"></i> AgriNova
        </h2>

        <p className="sidebar-label">MAIN MENU</p>

        <nav>
          {menuItems.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`nav-item ${
                activePage === item.name ? "active" : ""
              }`}
              onClick={() => handleNavigation(item)}
            >
              <i className={`fa-solid ${item.icon}`}></i>
              <span>{item.name}</span>
            </button>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <i className="fa-solid fa-user-tie"></i>
          <div>
            <strong>Farm Manager</strong>
            <small>Administrator</small>
          </div>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div>
            <p className="welcome-text">
              AGRICULTURE MANAGEMENT SYSTEM
            </p>
            <h1>{activePage}</h1>
          </div>

          <div className="date-label">
            <i className="fa-regular fa-calendar"></i> Farm Overview
          </div>
        </header>

        <section id="dashboard" className="dashboard-section">
          <div className="welcome-banner">
            <div>
              <span className="banner-tag">SMART FARMING</span>
              <h2>Grow smarter, harvest better.</h2>
              <p>
                Manage your crops, monitor farm conditions, and track
                your harvest in one place.
              </p>
            </div>

            <i className="fa-solid fa-wheat-awn banner-icon"></i>
          </div>

          <section className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon green">
                <i className="fa-solid fa-seedling"></i>
              </div>
              <p>Crop Management</p>
              <h2>My Crops</h2>
              <small>Add, edit and manage crop records</small>
            </div>

            <div className="stat-card">
              <div className="stat-icon blue">
                <i className="fa-solid fa-cloud-sun"></i>
              </div>
              <p>Weather</p>
              <h2>Live Forecast</h2>
              <small>Weather and humidity information</small>
            </div>

            <div className="stat-card">
              <div className="stat-icon orange">
                <i className="fa-solid fa-boxes-stacked"></i>
              </div>
              <p>Harvest</p>
              <h2>Schedule</h2>
              <small>Cutting dates and available stock</small>
            </div>

            <div className="stat-card">
              <div className="stat-icon purple">
                <i className="fa-solid fa-users"></i>
              </div>
              <p>Buyers</p>
              <h2>Orders</h2>
              <small>Register buyers and record sales</small>
            </div>
          </section>
        </section>

        <section id="weather" className="app-section">
          <WeatherCard />
        </section>

        <section id="crops" className="app-section">
          <CropHealth />
          <CropManager />
        </section>

        <section id="harvest" className="app-section">
          <CuttingSchedule />
          <HarvestSummary />
        </section>

        <section id="buyers" className="app-section">
          <OrderForm />
        </section>

        <footer>
          © 2026 AgriNova | Agriculture Management System
        </footer>
      </main>
    </div>
  );
}

export default App;

import { useWeather } from "../hooks/useWeather";

function WeatherCard() {
  const { weather, loading, error, lastUpdated, refreshWeather } =
    useWeather();

  if (loading && !weather) {
    return (
      <section className="content-card weather-card">
        <h2>
          <i className="fa-solid fa-cloud-sun"></i> Live Weather
        </h2>
        <p>Loading weather data...</p>
      </section>
    );
  }

  if (error && !weather) {
    return (
      <section className="content-card weather-card">
        <h2>Live Weather</h2>
        <p>{error}</p>
        <button className="weather-refresh" onClick={refreshWeather}>
          <i className="fa-solid fa-rotate-right"></i> Try Again
        </button>
      </section>
    );
  }

  const current = weather?.current;
  const todayRain = weather?.daily?.precipitation_probability_max?.[0];

  return (
    <section className="content-card weather-card">
      <div className="weather-heading">
        <div>
          <p className="welcome-text">FARM WEATHER</p>
          <h2>
            <i className="fa-solid fa-cloud-sun"></i> Live Weather
          </h2>
        </div>

        <button
          className="weather-refresh"
          onClick={refreshWeather}
          disabled={loading}
          title="Refresh weather"
        >
          <i className="fa-solid fa-rotate-right"></i>
          {" "}Refresh
        </button>
      </div>

      {error && <p className="weather-error">{error}</p>}

      <div className="weather-grid">
        <div className="weather-item">
          <i className="fa-solid fa-temperature-half"></i>
          <span>Temperature</span>
          <strong>
            {current ? `${current.temperature_2m} °C` : "--"}
          </strong>
        </div>

        <div className="weather-item">
          <i className="fa-solid fa-droplet"></i>
          <span>Humidity</span>
          <strong>
            {current ? `${current.relative_humidity_2m}%` : "--"}
          </strong>
        </div>

        <div className="weather-item">
          <i className="fa-solid fa-wind"></i>
          <span>Wind Speed</span>
          <strong>
            {current ? `${current.wind_speed_10m} km/h` : "--"}
          </strong>
        </div>

        <div className="weather-item">
          <i className="fa-solid fa-cloud-rain"></i>
          <span>Rain Chance</span>
          <strong>
            {todayRain != null ? `${todayRain}%` : "--"}
          </strong>
        </div>
      </div>

      <p className="weather-updated">
        {lastUpdated
          ? `Last updated: ${lastUpdated.toLocaleTimeString()}`
          : "Waiting for weather data"}
      </p>
      
<div className="forecast-section">
  <h3>5-Day Weather Forecast</h3>

  <div className="forecast-grid">
    {weather?.daily?.time?.map((day, index) => (
      <div className="forecast-item" key={day}>
        <p>
          {new Date(`${day}T12:00:00`).toLocaleDateString("en-US", {
            weekday: "short",
          })}
        </p>

        <i className="fa-solid fa-cloud-sun"></i>

        <strong>
          {weather.daily.temperature_2m_max[index]}°C
        </strong>

        <span>
          Rain:{" "}
          {weather.daily.precipitation_probability_max?.[index] ?? "--"}%
        </span>

        <small>
          Low: {weather.daily.temperature_2m_min[index]}°C
        </small>
      </div>
    ))}
  </div>
</div>

    </section>
  );
}

export default WeatherCard;


const WEATHER_URL = "https://api.open-meteo.com/v1/forecast";

export async function getWeather(
  latitude = 31.4504,
  longitude = 73.1350
) {
  const params = new URLSearchParams({
    latitude: String(latitude),
    longitude: String(longitude),
    current:
      "temperature_2m,relative_humidity_2m,wind_speed_10m",
    daily:
      "weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max",
    forecast_days: "5",
    timezone: "auto",
  });

  const response = await fetch(`${WEATHER_URL}?${params}`);

  if (!response.ok) {
    throw new Error("Weather data could not be loaded.");
  }

  return response.json();
}

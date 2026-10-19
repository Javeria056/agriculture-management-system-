
import { useCallback, useEffect, useState } from "react";
import { getWeather } from "../services/weatherApi";

export function useWeather() {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [lastUpdated, setLastUpdated] = useState(null);

  const refreshWeather = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getWeather();

      setWeather(data);
      setLastUpdated(new Date());
    } catch (err) {
      setError(err.message || "Unable to load weather.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshWeather();

    const interval = setInterval(refreshWeather, 15 * 60 * 1000);

    return () => clearInterval(interval);
  }, [refreshWeather]);

  return {
    weather,
    loading,
    error,
    lastUpdated,
    refreshWeather,
  };
}

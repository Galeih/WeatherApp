// src/Forecast.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Calendar, Thermometer, Cloud, Droplet } from "lucide-react";

function Forecast({ city, coords }) {
  const [forecastData, setForecastData] = useState([]);
  const [loadingForecast, setLoadingForecast] = useState(false);
  const [errorForecast, setErrorForecast] = useState(null);

  // Fonction pour grouper les prévisions par date
  const groupForecastByDate = (list) => {
    if (!Array.isArray(list)) return [];
    const daily = {};
    list.forEach((item) => {
      // Conversion du timestamp en date (exemple "2025-04-08")
      const date = new Date(item.dt * 1000).toISOString().split("T")[0];
      // Pour chaque date, on conserve le premier item
      if (!daily[date]) {
        daily[date] = item;
      }
    });
    return Object.values(daily);
  };

  const fetchForecast = async () => {
    setLoadingForecast(true);
    try {
      let url = "";
      if (coords) {
        const { lat, lng } = coords;
        url = `http://localhost:3000/forecast?lat=${lat}&lon=${lng}`;
      } else {
        url = `http://localhost:3000/forecast?city=${city}`;
      }
      
      console.log("[Forecast] final URL =", url);
      const response = await axios.get(url);
      // Vérifier si la réponse contient bien la propriété "list"
      if (response.data && response.data.list) {
        const grouped = groupForecastByDate(response.data.list);
        setForecastData(grouped);
        setErrorForecast(null);
      } else {
        console.error("La réponse ne contient pas la propriété 'list':", response.data);
        setErrorForecast("Données de prévisions manquantes");
        setForecastData([]);
      }
    } catch (err) {
      console.error(err);
      setErrorForecast("Erreur lors de la récupération des prévisions météo");
      setForecastData([]);
    }
    setLoadingForecast(false);
  };

  useEffect(() => {
    if (city || coords) {
      fetchForecast();
    }
  }, [city, coords]);

  return (
    <div className="mt-6">
      <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center space-x-2">
        <Calendar className="w-5 h-5" />
        <span>Prévisions sur plusieurs jours</span>
      </h3>
      {loadingForecast && <p className="text-blue-600 font-medium">Chargement des prévisions...</p>}
      {errorForecast && <p className="text-red-500 font-semibold">{errorForecast}</p>}
      {forecastData.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {forecastData.map((item) => (
            <div key={item.dt} className="bg-blue-50 p-4 rounded-lg shadow">
              <p className="text-gray-700 font-medium">
                {new Date(item.dt * 1000).toLocaleDateString("fr-FR", {
                  weekday: "short",
                  day: "numeric",
                  month: "short",
                })}
              </p>
              <p className="flex items-center space-x-1 text-gray-700">
                <Thermometer className="w-4 h-4" />
                <span>{item.main.temp} °C</span>
              </p>
              <p className="flex items-center space-x-1 text-gray-700">
                <Cloud className="w-4 h-4" />
                <span>{item.weather[0].description}</span>
              </p>
              <p className="flex items-center space-x-1 text-gray-700">
                <Droplet className="w-4 h-4" />
                <span>{item.main.humidity} %</span>
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Forecast;

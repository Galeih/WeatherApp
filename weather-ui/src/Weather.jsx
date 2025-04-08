// src/Weather.jsx
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Search } from "lucide-react";
import MapSelector from "./MapSelector";
import Forecast from "./Forecast";

function Weather() {
  const [weather, setWeather] = useState(null);
  const [city, setCity] = useState("Paris");
  const [coords, setCoords] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Historique et favoris
  const [searchHistory, setSearchHistory] = useState([]);
  const [favorites, setFavorites] = useState([]);

  // Contrôle de l'affichage de l'historique
  const [showHistory, setShowHistory] = useState(false);

  // Référence pour gérer le clic en dehors du dropdown d'historique
  const historyRef = useRef(null);

  // Chargement initial depuis localStorage
  useEffect(() => {
    const storedHistory = localStorage.getItem("weatherHistory");
    const storedFavorites = localStorage.getItem("weatherFavorites");
    if (storedHistory) {
      setSearchHistory(JSON.parse(storedHistory));
    }
    if (storedFavorites) {
      setFavorites(JSON.parse(storedFavorites));
    }
  }, []);

  // Sauvegarde localStorage
  const saveHistory = (newHistory) => {
    setSearchHistory(newHistory);
    localStorage.setItem("weatherHistory", JSON.stringify(newHistory));
  };
  const saveFavorites = (newFavs) => {
    setFavorites(newFavs);
    localStorage.setItem("weatherFavorites", JSON.stringify(newFavs));
  };

  // Ajouter dans l'historique
  const addToHistory = (cityName, latLng) => {
    const newEntry = {
      city: cityName || "",
      coords: latLng || null,
      timestamp: Date.now(),
    };
    const updated = [newEntry, ...searchHistory];
    saveHistory(updated);
  };

  // Ajouter aux favoris
  const addToFavorites = (cityName, latLng) => {
    const alreadyFav = favorites.some(
      (f) =>
        f.city === cityName &&
        f.coords?.lat === latLng?.lat &&
        f.coords?.lng === latLng?.lng
    );
    if (alreadyFav) return; // on évite les doublons

    const newFav = {
      city: cityName || "",
      coords: latLng || null,
      timestamp: Date.now(),
    };
    const updated = [newFav, ...favorites];
    saveFavorites(updated);
  };

  // Retirer un favori
  const removeFavorite = (ts) => {
    const filtered = favorites.filter((f) => f.timestamp !== ts);
    saveFavorites(filtered);
  };

  // Recharger une recherche depuis l'historique ou un favori
  const handleLoadSearch = (entry) => {
    setShowHistory(false); // On referme le dropdown
    if (entry.city) {
      setCity(entry.city);
      setCoords(null);
    } else if (entry.coords) {
      setCity("");
      setCoords(entry.coords);
    }
    fetchWeather();
  };

  // Requête vers notre backend
  const fetchWeather = async () => {
    setLoading(true);
    try {
      let response;
      if (coords) {
        const { lat, lng } = coords;
        response = await axios.get(`http://localhost:3000/weather?lat=${lat}&lon=${lng}`);
      } else {
        response = await axios.get(`http://localhost:3000/weather?city=${city}`);
      }
      setWeather(response.data);
      setError(null);

      // Mise à jour de l'historique
      if (coords) {
        addToHistory("", coords);
      } else {
        addToHistory(city, null);
      }

      // Normaliser les coords si on vient de chercher par ville
      if (!coords && response.data.coord) {
        setCoords({
          lat: response.data.coord.lat,
          lng: response.data.coord.lon,
        });
      }
    } catch (err) {
      setError("Erreur lors de la récupération des données météo");
      setWeather(null);
    }
    setLoading(false);
  };

  // Initial fetch
  useEffect(() => {
    fetchWeather();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Gestion de la sélection sur la carte
  const handleMapSelect = (latlng) => {
    setCoords(latlng);
    setCity("");
    fetchWeather();
  };

  // Affichage
  const title = coords
    ? `Météo à la position (${coords.lat.toFixed(2)}, ${coords.lng.toFixed(2)})`
    : `Météo à ${city}`;

  // Fermer l'historique quand on clique en dehors
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (historyRef.current && !historyRef.current.contains(e.target)) {
        setShowHistory(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="max-w-7xl mx-auto p-4">
      <div className="flex gap-4">
        {/* Colonne principale (carte + météo + form) */}
        <div className="flex-1 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">{title}</h2>

          {/* Barre de recherche + dropdown historique */}
          <div className="relative mb-4" ref={historyRef}>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                className="flex-grow px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                placeholder="Entrez une ville"
                value={city}
                onFocus={() => setShowHistory(true)} // Affiche l'historique lors du clic
                onChange={(e) => {
                  setCity(e.target.value);
                  setCoords(null);
                }}
              />
              <button
                onClick={fetchWeather}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 inline-flex items-center space-x-1 transition-colors"
              >
                <Search className="w-4 h-4" />
                <span>Rechercher</span>
              </button>
            </div>
            {/* Dropdown historique (visible si showHistory = true) */}
            {showHistory && (
              <div className="absolute z-10 bg-white border border-gray-300 rounded shadow-md mt-1 w-full max-h-48 overflow-auto">
                {searchHistory.length === 0 ? (
                  <p className="p-2 text-gray-500">Aucune recherche récente.</p>
                ) : (
                  searchHistory.map((entry) => (
                    <button
                      key={entry.timestamp}
                      onClick={() => handleLoadSearch(entry)}
                      className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                    >
                      {entry.city
                        ? `Ville : ${entry.city}`
                        : `Position : (${entry.coords.lat.toFixed(2)}, ${entry.coords.lng.toFixed(2)})`}
                    </button>
                  ))
                )}
              </div>
            )}
          </div>

          {/* Carte */}
          <div className="mb-4">
            <p className="mb-2 text-gray-600">Ou sélectionnez un point sur la carte :</p>
            <MapSelector position={coords} onSelect={handleMapSelect} />
          </div>

          {/* Bouton favoris */}
          {(coords || city) && (
            <button
              onClick={() => addToFavorites(city, coords)}
              className="mb-4 bg-yellow-400 text-black px-4 py-2 rounded hover:bg-yellow-500 transition-colors"
            >
              Ajouter aux favoris
            </button>
          )}

          {/* État de chargement et erreur */}
          {loading && <p className="text-blue-600 font-medium">Chargement...</p>}
          {error && <p className="text-red-500 font-semibold">{error}</p>}

          {/* Météo actuelle */}
          {weather && !loading && (
            <div className="mt-4 space-y-2">
              <p className="text-lg text-gray-700">
                <strong>Température :</strong> {weather.main.temp} °C
              </p>
              <p className="text-lg text-gray-700">
                <strong>Conditions :</strong> {weather.weather[0].description}
              </p>
              <p className="text-lg text-gray-700">
                <strong>Humidité :</strong> {weather.main.humidity} %
              </p>
            </div>
          )}

          {/* Prévisions multi-jours */}
          <Forecast city={city} coords={coords} />
        </div>

        {/* Colonne de droite : Favoris */}
        <div className="w-80 bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Favoris</h3>
          {favorites.length === 0 ? (
            <p className="text-gray-500">Aucun favori pour l'instant.</p>
          ) : (
            <ul className="space-y-2">
              {favorites.map((fav) => (
                <li key={fav.timestamp} className="flex items-center justify-between">
                  <button
                    onClick={() => handleLoadSearch(fav)}
                    className="text-blue-600 hover:underline"
                  >
                    {fav.city
                      ? `Ville : ${fav.city}`
                      : `Position : (${fav.coords.lat.toFixed(2)}, ${fav.coords.lng.toFixed(2)})`}
                  </button>
                  <button
                    onClick={() => removeFavorite(fav.timestamp)}
                    className="ml-2 text-red-600 hover:underline text-sm"
                  >
                    Retirer
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default Weather;

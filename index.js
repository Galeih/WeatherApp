// index.js
const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

// Endpoint pour récupérer les prévisions sur plusieurs jours
app.get('/forecast', async (req, res) => {
  const { city, lat, lon } = req.query;

  // Vérifier que l'utilisateur a fourni soit une ville, soit des coordonnées
  if (!city && (!lat || !lon)) {
    return res.status(400).json({ error: "Veuillez fournir une ville ou des coordonnées (lat et lon)." });
  }

  try {
    const apiKey = process.env.OPENWEATHERMAP_API_KEY;
    let url;

    if (lat && lon) {
      // Prévisions selon des coordonnées
      url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=fr`;
    } else {
      // Prévisions pour une ville
      url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric&lang=fr`;
    }

    const response = await axios.get(url);
    res.json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur lors de la récupération des prévisions météo." });
  }
});

// Endpoint existant pour la météo actuelle
app.get('/weather', async (req, res) => {
    const { city, lat, lon } = req.query;

    // Vérifier que l'utilisateur a fourni soit une ville, soit des coordonnées (lat et lon)
    if (!city && (!lat || !lon)) {
        return res.status(400).json({ error: "Veuillez fournir une ville ou des coordonnées (lat et lon)." });
    }

    try {
        const apiKey = process.env.OPENWEATHERMAP_API_KEY;
        let url;
        
        if (lat && lon) {
            // Utilisation des coordonnées pour récupérer la météo
            url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=fr`;
        } else {
            // Utilisation de la ville pour récupérer la météo
            url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric&lang=fr`;
        }
        
        const response = await axios.get(url);
        res.json(response.data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erreur lors de la récupération des données météo." });
    }
});

// Lancement du serveur
app.listen(PORT, () => {
  console.log(`Serveur lancé sur le port ${PORT}`);
});

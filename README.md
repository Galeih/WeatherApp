# WeatherApp

Une application météo full-stack simple avec un’API Node.js en backend et une interface React (Vite) en frontend. Le backend expose une API REST pour récupérer les données météo actuelles depuis OpenWeatherMap, et le frontend fournit une UI réactive pour interroger la météo d’une ville.

---

## Table des matières

* [Fonctionnalités](#fonctionnalités)
* [Prérequis](#prérequis)
* [Structure du projet](#structure-du-projet)
* [Variables d’environnement](#variables-denvironnement)
* [Installation](#installation)

  * [Backend](#backend)
  * [Frontend](#frontend)
* [Scripts](#scripts)
* [Utilisation](#utilisation)

---

## Fonctionnalités

* **Météo actuelle** : Récupère la température, l’humidité et la description pour une ville donnée.
* **API Express** : Serveur HTTP léger en Node.js avec Express.
* **Configuration par environnement** : Gestion sécurisée de la clé API avec dotenv.
* **Frontend React** : UI rapide et réactive construite avec Vite.
* **Select2 (optionnel)** : Composant multi-sélection enrichi pour la sélection de compétences.

---

## Prérequis

* Node.js (v14+)
* npm (v6+)
* Clé API OpenWeatherMap

---

## Structure du projet

```bash
WeatherApp-master/
├── .env                # Variables d’environnement pour le backend
├── index.js            # Point d’entrée de l’API Node.js
├── package.json        # Dépendances et scripts du backend
├── start.js            # Script pour lancer backend et frontend ensemble
└── weather-ui/         # Frontend React (Vite)
    ├── .env            # (Optionnel) Variables d’environnement du frontend
    ├── package.json    # Dépendances et scripts du frontend
    ├── src/            # Code source React
    └── vite.config.js  # Configuration Vite
```

---

## Variables d’environnement

Créez un fichier `.env` à la racine du **backend** :

```ini
OPENWEATHERMAP_API_KEY=<votre_clé_api_openweathermap>
PORT=3000
```

> **Note :** ne commitez jamais `.env` dans le contrôle de version.

---

## Installation

### Backend

1. Placez-vous dans le dossier backend :

   ```bash
   cd WeatherApp-master
   ```
2. Installez les dépendances :

   ```bash
   npm install
   ```

### Frontend

1. Placez-vous dans le dossier frontend :

   ```bash
   cd weather-ui
   ```
2. Installez les dépendances :

   ```bash
   npm install
   ```

---

## Scripts

Depuis la racine du **backend** (`WeatherApp-master`) :

| Commande        | Description                               |
| --------------- | ----------------------------------------- |
| `npm start`     | Démarrer l’API Node.js (production)       |
| `npm run dev`   | Démarrer l’API Node.js avec nodemon (dev) |
| `node start.js` | Lancer backend et frontend simultanément  |

Depuis le **frontend** (`weather-ui`) :

| Commande          | Description                     |
| ----------------- | ------------------------------- |
| `npm run dev`     | Démarrer le serveur de dev Vite |
| `npm run build`   | Générer les assets pour la prod |
| `npm run preview` | Prévisualiser la build prod     |

---

## Utilisation

1. **Démarrer l’application** :

   ```bash
   cd WeatherApp-master
   node start.js
   ```

2. **Accéder au frontend** :
   Ouvrez votre navigateur à l’adresse `http://localhost:5173`.

3. **Rechercher la météo** :
   Entrez le nom d’une ville pour afficher les conditions météo actuelles.

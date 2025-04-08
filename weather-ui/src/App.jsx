// src/App.jsx
import React, { useState, useEffect } from 'react'
import { Cloud, Sun, Moon } from 'lucide-react'
import Weather from './Weather.jsx'

function App() {
  const [darkMode, setDarkMode] = useState(false)

  useEffect(() => {
    const storedMode = localStorage.getItem("darkMode")
    if (storedMode === "true") {
      setDarkMode(true)
      document.documentElement.classList.add("dark")
    }
  }, [])

  const toggleDarkMode = () => {
    const newMode = !darkMode
    setDarkMode(newMode)
    localStorage.setItem("darkMode", newMode)
    if (newMode) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-blue-100 to-white dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
      {/* Header */}
      <header className="bg-blue-600 text-white py-4 shadow-md dark:bg-gray-700 transition-colors duration-300">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Cloud className="w-8 h-8" />
            <h1 className="text-2xl font-bold">WeatherApp</h1>
          </div>
          <div className="flex items-center gap-4">
            <nav>
              <ul className="flex gap-4">
                <li><a href="/" className="hover:underline">Accueil</a></li>
                <li><a href="/about" className="hover:underline">À propos</a></li>
                <li><a href="/contact" className="hover:underline">Contact</a></li>
              </ul>
            </nav>
            <button
              onClick={toggleDarkMode}
              className="p-2 bg-gray-200 rounded hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500 transition-colors duration-300"
            >
              {darkMode ? (
                <Sun className="w-5 h-5 text-yellow-500" />
              ) : (
                <Moon className="w-5 h-5 text-blue-900" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Contenu principal */}
      <main className="flex-grow container mx-auto px-4 py-8 transition-colors duration-300">
        <Weather />
      </main>

      {/* Footer */}
      <footer className="bg-blue-950 text-white py-4 dark:bg-gray-800 transition-colors duration-300">
        <div className="container mx-auto px-4 text-center">
          <p>© 2025 WeatherApp. Tous droits réservés.</p>
        </div>
      </footer>
    </div>
  )
}

export default App

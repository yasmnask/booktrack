"use client";

import { useState, useEffect } from "react";
import { Routes, Route, useLocation, Link } from "react-router-dom";
import { Button } from "./components/ui/button";
import { BookOpen, Moon, Sun } from "lucide-react";

// Import components
import ScrollToTop from "./components/ScrollToTop";

// Import pages
import HomePage from "./pages/HomePage";
import FavoriteBookPage from "./pages/FavoriteBookPage";
import SearchPage from "./pages/SearchPage";
import BookDetailPage from "./pages/BookDetailPage";

function App() {
  // Initialize dark mode from localStorage or default to false
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem("booktrack-darkmode");
    return saved ? JSON.parse(saved) : false;
  });

  const [language, setLanguage] = useState<"id" | "en">(() => {
    const saved = localStorage.getItem("booktrack-language");
    return saved ? (saved as "id" | "en") : "id";
  });

  const { pathname } = useLocation();

  // Translations object
  const translations = {
    id: {
      home: "Beranda",
      favorites: "Favorit",
      search: "Cari Buku",
      footerText: "Temukan dan simpan buku favorit Anda.",
    },
    en: {
      home: "Home",
      favorites: "Favorites",
      search: "Search Books",
      footerText: "Discover and save your favorite books.",
    },
  };

  const t = translations[language];

  const toggleLanguage = () => {
    const newLanguage = language === "id" ? "en" : "id";
    setLanguage(newLanguage);
    localStorage.setItem("booktrack-language", newLanguage);
  };

  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    localStorage.setItem("booktrack-darkmode", JSON.stringify(newDarkMode));
  };

  // Apply dark mode class to document body
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  // Scroll to top when route changes
  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  }, [pathname]);

  return (
    <div
      className={`min-h-screen transition-colors duration-300 relative ${
        isDarkMode ? "dark bg-gray-900" : "bg-gray-50"
      }`}
    >
      {/* Scroll to top component */}
      <ScrollToTop />

      {/* Header - z-index 40 agar selalu di atas */}
      <header
        className={`shadow-sm border-b transition-colors duration-300 relative z-40 ${
          isDarkMode
            ? "bg-gray-800 border-gray-700"
            : "bg-white border-gray-200"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <BookOpen
                className={`h-8 w-8 ${
                  isDarkMode ? "text-gray-300" : "text-gray-700"
                }`}
              />
              <h1
                className={`text-2xl font-bold ${
                  isDarkMode ? "text-white" : "text-gray-900"
                }`}
              >
                BookTrack
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <nav className="hidden md:flex space-x-8">
                <Link
                  to="/"
                  className={`transition-colors ${
                    isDarkMode
                      ? "text-gray-300 hover:text-white"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  {t.home}
                </Link>
                <Link
                  to="/search"
                  className={`transition-colors ${
                    isDarkMode
                      ? "text-gray-300 hover:text-white"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  {t.search}
                </Link>
                <Link
                  to="/favorites"
                  className={`transition-colors ${
                    isDarkMode
                      ? "text-gray-300 hover:text-white"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  {t.favorites}
                </Link>
              </nav>
              <Button
                variant="outline"
                size="sm"
                onClick={toggleLanguage}
                className={`${
                  isDarkMode
                    ? "border-gray-600 text-gray-300 hover:bg-gray-700"
                    : "border-gray-300 text-gray-700 hover:bg-gray-50"
                } bg-transparent`}
              >
                {language === "id" ? "EN" : "ID"}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={toggleDarkMode}
                className={`${
                  isDarkMode
                    ? "border-gray-600 text-gray-300 hover:bg-gray-700"
                    : "border-gray-300 text-gray-700 hover:bg-gray-50"
                } bg-transparent`}
              >
                {isDarkMode ? (
                  <Sun className="h-4 w-4" />
                ) : (
                  <Moon className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Routes - Konten utama halaman, z-index 30 agar di atas background animasi */}
      <div className="relative z-30">
        <Routes>
          <Route
            path="/"
            element={<HomePage isDarkMode={isDarkMode} language={language} />}
          />
          <Route
            path="/search"
            element={<SearchPage isDarkMode={isDarkMode} language={language} />}
          />
          <Route
            path="/favorites"
            element={
              <FavoriteBookPage isDarkMode={isDarkMode} language={language} />
            }
          />
          <Route
            path="/book/:bookId"
            element={
              <BookDetailPage isDarkMode={isDarkMode} language={language} />
            }
          />
        </Routes>
      </div>

      {/* Footer - z-index 40 agar selalu di atas */}
      <footer
        className={`py-8 transition-colors duration-300 relative z-40 ${
          isDarkMode ? "bg-gray-900 text-white" : "bg-gray-900 text-white"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <BookOpen className="h-6 w-6" />
            <span className="text-lg sm:text-xl font-bold">BookTrack</span>
          </div>
          <p className="text-gray-400 text-sm sm:text-base">
            © 2025 BookTrack. {t.footerText}
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;

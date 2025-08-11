"use client";

import type React from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Star, Heart, ArrowLeft, Search, Filter, BookOpen } from "lucide-react";
import { useFavorites } from "../hooks/useFavorites";
import { ScrollReveal } from "../components/ScrollReveal";

interface FavoriteBookPageProps {
  isDarkMode: boolean;
  language: "id" | "en";
}

const FavoriteBookPage = ({ isDarkMode, language }: FavoriteBookPageProps) => {
  const { favorites, removeFromFavorites, isLoaded } = useFavorites();
  const [sortBy, setSortBy] = useState<"title" | "author" | "rating" | "genre">(
    "title"
  );
  const [filterGenre, setFilterGenre] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const genres = Array.from(new Set(favorites.map((book) => book.genre)));

  const translations = {
    id: {
      backToHome: "Kembali ke Beranda",
      myFavoriteBooks: "Buku Favorit Saya",
      favoriteCollection: "Koleksi buku yang telah Anda simpan sebagai favorit",
      totalFavorites: "Total Favorit",
      differentGenres: "Genre Berbeda",
      averageRating: "Rating Rata-rata",
      noFavoriteBooks: "Belum Ada Buku Favorit",
      noFavoritesDesc:
        "Mulai tambahkan buku ke favorit Anda dari halaman beranda untuk melihatnya di sini.",
      exploreBooks: "Jelajahi Buku",
      searchPlaceholder: "Cari berdasarkan judul atau penulis...",
      allGenres: "Semua Genre",
      sortTitle: "Urutkan: Judul",
      sortAuthor: "Urutkan: Penulis",
      sortRating: "Urutkan: Rating",
      sortGenre: "Urutkan: Genre",
      showing: "Menampilkan",
      of: "dari",
      favoriteBooks: "buku favorit",
      by: "oleh",
      removeFromFavorites: "Hapus dari Favorit",
      noResults: "Tidak Ada Hasil",
      noResultsDesc:
        "Tidak ada buku yang cocok dengan pencarian atau filter Anda.",
      loading: "Memuat...",
    },
    en: {
      backToHome: "Back to Home",
      myFavoriteBooks: "My Favorite Books",
      favoriteCollection: "Collection of books you have saved as favorites",
      totalFavorites: "Total Favorites",
      differentGenres: "Different Genres",
      averageRating: "Average Rating",
      noFavoriteBooks: "No Favorite Books Yet",
      noFavoritesDesc:
        "Start adding books to your favorites from the homepage to see them here.",
      exploreBooks: "Explore Books",
      searchPlaceholder: "Search by title or author...",
      allGenres: "All Genres",
      sortTitle: "Sort: Title",
      sortAuthor: "Sort: Author",
      sortRating: "Sort: Rating",
      sortGenre: "Sort: Genre",
      showing: "Showing",
      of: "of",
      favoriteBooks: "favorite books",
      by: "by",
      removeFromFavorites: "Remove from Favorites",
      noResults: "No Results",
      noResultsDesc: "No books match your search or filter criteria.",
      loading: "Loading...",
    },
  };

  const t = translations[language];

  if (!isLoaded) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center ${
          isDarkMode ? "bg-gray-900" : "bg-gray-50"
        }`}
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className={isDarkMode ? "text-gray-300" : "text-gray-600"}>
            {t.loading}
          </p>
        </div>
      </div>
    );
  }

  const filteredAndSortedFavorites = favorites
    .filter((book) => {
      const matchesSearch =
        book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.author.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesGenre = filterGenre === "all" || book.genre === filterGenre;
      return matchesSearch && matchesGenre;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "title":
          return a.title.localeCompare(b.title);
        case "author":
          return a.author.name.localeCompare(b.author.name);
        case "rating":
          return b.rating - a.rating;
        case "genre":
          return a.genre.localeCompare(b.genre);
        default:
          return 0;
      }
    });

  const handleRemoveFromFavorites = (e: React.MouseEvent, bookId: string) => {
    e.preventDefault();
    e.stopPropagation();
    removeFromFavorites(bookId);
  };

  return (
    <div
      className={`min-h-screen ${isDarkMode ? "bg-gray-900" : "bg-gray-50"}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <ScrollReveal delay={0.5} animationType="slideLeft">
              <Link to="/">
                <Button
                  variant="outline"
                  size="sm"
                  className={`flex items-center gap-2 ${
                    isDarkMode
                      ? "bg-gray-800 border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white"
                      : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <ArrowLeft className="w-4 h-4" />
                  {t.backToHome}
                </Button>
              </Link>
            </ScrollReveal>
          </div>

          <div className="text-center mb-8">
            <ScrollReveal delay={0.1} animationType="fadeIn">
              <h1
                className={`text-3xl sm:text-4xl font-bold mb-4 ${
                  isDarkMode ? "text-white" : "text-gray-900"
                }`}
              >
                {t.myFavoriteBooks}
              </h1>
            </ScrollReveal>
            <ScrollReveal delay={0.1} animationType="fadeIn">
              <p
                className={`text-lg ${
                  isDarkMode ? "text-gray-300" : "text-gray-600"
                }`}
              >
                {t.favoriteCollection}
              </p>
            </ScrollReveal>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <ScrollReveal delay={0.1} animationType="slideLeft">
              <div
                className={`rounded-lg p-6 text-center border ${
                  isDarkMode
                    ? "bg-gray-800 border-gray-700"
                    : "bg-white border-gray-200"
                }`}
              >
                <div
                  className={`text-2xl font-bold mb-2 ${
                    isDarkMode ? "text-blue-400" : "text-blue-600"
                  }`}
                >
                  {favorites.length}
                </div>
                <div
                  className={`text-sm ${
                    isDarkMode ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  {t.totalFavorites}
                </div>
              </div>
            </ScrollReveal>
            <ScrollReveal delay={0.1} animationType="slideUp">
              <div
                className={`rounded-lg p-6 text-center border ${
                  isDarkMode
                    ? "bg-gray-800 border-gray-700"
                    : "bg-white border-gray-200"
                }`}
              >
                <div
                  className={`text-2xl font-bold mb-2 ${
                    isDarkMode ? "text-green-400" : "text-green-600"
                  }`}
                >
                  {genres.length}
                </div>
                <div
                  className={`text-sm ${
                    isDarkMode ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  {t.differentGenres}
                </div>
              </div>
            </ScrollReveal>
            <ScrollReveal delay={0.1} animationType="slideRight">
              <div
                className={`rounded-lg p-6 text-center border ${
                  isDarkMode
                    ? "bg-gray-800 border-gray-700"
                    : "bg-white border-gray-200"
                }`}
              >
                <div
                  className={`text-2xl font-bold mb-2 ${
                    isDarkMode ? "text-purple-400" : "text-purple-600"
                  }`}
                >
                  {favorites.length > 0
                    ? (
                        favorites.reduce((sum, book) => sum + book.rating, 0) /
                        favorites.length
                      ).toFixed(1)
                    : "0.0"}
                </div>
                <div
                  className={`text-sm ${
                    isDarkMode ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  {t.averageRating}
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>

        {favorites.length === 0 ? (
          <ScrollReveal delay={1.2} animationType="scaleIn">
            /* Empty State */
            <div className="text-center py-16">
              <BookOpen
                className={`w-24 h-24 mx-auto mb-6 ${
                  isDarkMode ? "text-gray-600" : "text-gray-300"
                }`}
              />
              <h3
                className={`text-2xl font-semibold mb-4 ${
                  isDarkMode ? "text-white" : "text-gray-900"
                }`}
              >
                {t.noFavoriteBooks}
              </h3>
              <p
                className={`mb-8 max-w-md mx-auto ${
                  isDarkMode ? "text-gray-300" : "text-gray-600"
                }`}
              >
                {t.noFavoritesDesc}
              </p>
              <Link to="/">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                  {t.exploreBooks}
                </Button>
              </Link>
            </div>
          </ScrollReveal>
        ) : (
          <>
            <ScrollReveal delay={0.1} animationType="slideUp">
              {/* Search and Filter Controls */}
              <div
                className={`rounded-lg p-6 mb-8 border ${
                  isDarkMode
                    ? "bg-gray-800 border-gray-700"
                    : "bg-white border-gray-200"
                }`}
              >
                <div className="flex flex-col sm:flex-row gap-4">
                  {/* Search */}
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder={t.searchPlaceholder}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-transparent ${
                        isDarkMode
                          ? "border-gray-600 bg-gray-700 text-white"
                          : "border-gray-300 bg-white text-gray-900"
                      }`}
                    />
                  </div>

                  {/* Genre Filter */}
                  <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4 text-gray-400" />
                    <select
                      value={filterGenre}
                      onChange={(e) => setFilterGenre(e.target.value)}
                      className={`px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        isDarkMode
                          ? "border-gray-600 bg-gray-700 text-white"
                          : "border-gray-300 bg-white text-gray-900"
                      }`}
                    >
                      <option value="all">{t.allGenres}</option>
                      {genres.map((genre) => (
                        <option key={genre} value={genre}>
                          {genre}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Sort */}
                  <select
                    value={sortBy}
                    onChange={(e) =>
                      setSortBy(
                        e.target.value as
                          | "title"
                          | "author"
                          | "rating"
                          | "genre"
                      )
                    }
                    className={`px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      isDarkMode
                        ? "border-gray-600 bg-gray-700 text-white"
                        : "border-gray-300 bg-white text-gray-900"
                    }`}
                  >
                    <option value="title">{t.sortTitle}</option>
                    <option value="author">{t.sortAuthor}</option>
                    <option value="rating">{t.sortRating}</option>
                    <option value="genre">{t.sortGenre}</option>
                  </select>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.1} animationType="slideUp">
              {/* Results Info */}
              <div className="mb-6">
                <p className={isDarkMode ? "text-gray-300" : "text-gray-600"}>
                  {t.showing} {filteredAndSortedFavorites.length} {t.of}{" "}
                  {favorites.length} {t.favoriteBooks}
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={1.2} animationType="slideUp">
              {/* Books Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredAndSortedFavorites.map((book) => (
                  <Link
                    key={book._id}
                    to={`/book/${book._id}`}
                    className="block"
                  >
                    <Card
                      className={`hover:shadow-lg transition-all duration-300 cursor-pointer ${
                        isDarkMode
                          ? "bg-gray-800 border-gray-700"
                          : "bg-white border-gray-200"
                      }`}
                    >
                      <CardHeader className="pb-4">
                        <div className="flex justify-center mb-4">
                          <img
                            src={book.cover || "/placeholder.svg"}
                            alt={book.title}
                            className="w-20 h-28 sm:w-24 sm:h-32 object-cover rounded-md shadow-sm hover:scale-105 transition-transform duration-200"
                          />
                        </div>
                        <CardTitle
                          className={`text-base sm:text-lg font-semibold text-center line-clamp-2 ${
                            isDarkMode ? "text-white" : "text-gray-900"
                          }`}
                        >
                          {book.title}
                        </CardTitle>
                        <CardDescription
                          className={`text-center text-sm ${
                            isDarkMode ? "text-gray-300" : "text-gray-600"
                          }`}
                        >
                          {t.by} {book.author.name}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="flex items-center justify-between mb-3">
                          <Badge
                            variant="secondary"
                            className={`text-xs ${
                              isDarkMode
                                ? "bg-gray-700 text-gray-300"
                                : "bg-gray-100 text-gray-700"
                            }`}
                          >
                            {book.genre}
                          </Badge>
                          <div className="flex items-center space-x-1">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            <span
                              className={`text-sm font-medium ${
                                isDarkMode ? "text-gray-300" : "text-gray-700"
                              }`}
                            >
                              {book.rating.toFixed(1)}
                            </span>
                          </div>
                        </div>
                        <p
                          className={`text-xs sm:text-sm mb-4 line-clamp-2 ${
                            isDarkMode ? "text-gray-400" : "text-gray-600"
                          }`}
                        >
                          {book.description}
                        </p>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) =>
                            handleRemoveFromFavorites(e, book._id)
                          }
                          className={`w-full text-xs sm:text-sm transition-colors bg-transparent ${
                            isDarkMode
                              ? "border-red-400 text-red-400 hover:bg-red-500/10"
                              : "border-red-500 text-red-600 hover:bg-red-50"
                          }`}
                        >
                          <Heart className="w-4 h-4 mr-2 fill-current" />
                          {t.removeFromFavorites}
                        </Button>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </ScrollReveal>

            {filteredAndSortedFavorites.length === 0 && (
              <div className="text-center py-12">
                <Search
                  className={`w-16 h-16 mx-auto mb-4 ${
                    isDarkMode ? "text-gray-600" : "text-gray-300"
                  }`}
                />
                <h3
                  className={`text-xl font-semibold mb-2 ${
                    isDarkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  {t.noResults}
                </h3>
                <p className={isDarkMode ? "text-gray-300" : "text-gray-600"}>
                  {t.noResultsDesc}
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default FavoriteBookPage;

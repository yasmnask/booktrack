"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import {
  Star,
  Heart,
  ArrowLeft,
  Search,
  BookOpen,
  X,
  Loader2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useFavorites } from "../hooks/useFavorites";
import { bookService } from "../services/bookService";
import { convertToFavoriteBook, getBookRating } from "../utils/bookUtils";
import type { Book, ApiResponse } from "../types/book";
import RecommendedBooks from "../components/RecommendedBook";

interface SearchPageProps {
  isDarkMode: boolean;
  language: "id" | "en";
}

const SearchPage = ({ isDarkMode, language }: SearchPageProps) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [books, setBooks] = useState<Book[]>([]);
  const [pagination, setPagination] = useState<
    ApiResponse["pagination"] | null
  >(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const { isFavorite, toggleFavorite } = useFavorites();

  // Translations
  const translations = {
    id: {
      backToHome: "Kembali ke Beranda",
      searchBooks: "Cari Buku",
      findFavoriteBooks: "Temukan buku favorit Anda dari koleksi kami",
      searchPlaceholder: "Cari berdasarkan judul, penulis, atau deskripsi...",
      searching: "Mencari...",
      showing: "Menampilkan",
      of: "dari",
      books: "buku",
      for: "untuk",
      page: "Halaman",
      noResultsFound: "Tidak Ada Hasil Ditemukan",
      startSearch: "Mulai Pencarian",
      noResultsDesc: "Tidak ada buku yang cocok dengan",
      tryDifferent: "Coba kata kunci lain.",
      startSearchDesc:
        "Ketik kata kunci di atas untuk mencari buku yang Anda inginkan.",
      clearSearch: "Hapus Pencarian",
      by: "oleh",
      addToFavorites: "Tambah ke Favorit",
      removeFromFavorites: "Hapus dari Favorit",
      loading: "Memuat...",
      errorLoading: "Gagal memuat buku",
      tryAgain: "Coba Lagi",
      previous: "Sebelumnya",
      next: "Selanjutnya",
    },
    en: {
      backToHome: "Back to Home",
      searchBooks: "Search Books",
      findFavoriteBooks: "Find your favorite books from our collection",
      searchPlaceholder: "Search by title, author, or description...",
      searching: "Searching...",
      showing: "Showing",
      of: "of",
      books: "books",
      for: "for",
      page: "Page",
      noResultsFound: "No Results Found",
      startSearch: "Start Searching",
      noResultsDesc: "No books match",
      tryDifferent: "Try different keywords.",
      startSearchDesc: "Type keywords above to search for books you want.",
      clearSearch: "Clear Search",
      by: "by",
      addToFavorites: "Add to Favorites",
      removeFromFavorites: "Remove from Favorites",
      loading: "Loading...",
      errorLoading: "Failed to load books",
      tryAgain: "Try Again",
      previous: "Previous",
      next: "Next",
    },
  };

  const t = translations[language];

  useEffect(() => {
    const query = searchParams.get("q");
    const page = Number.parseInt(searchParams.get("page") || "1");
    if (query) {
      setSearchQuery(query);
      setCurrentPage(page);
      performSearch(query, page);
    } else {
      loadAllBooks(page);
    }
  }, [searchParams]);

  const performSearch = async (query: string, page = 1) => {
    try {
      setLoading(true);
      setError(null);
      const response = await bookService.searchBooks(query, page);
      setBooks(response.books);
      setPagination(response.pagination);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      setBooks([]);
      setPagination(null);
    } finally {
      setLoading(false);
    }
  };

  const loadAllBooks = async (page = 1) => {
    try {
      setLoading(true);
      setError(null);
      const response = await bookService.getAllBooks(page);
      setBooks(response.books);
      setPagination(response.pagination);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      setBooks([]);
      setPagination(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);

    if (query.trim()) {
      setSearchParams({ q: query.trim(), page: "1" });
    } else {
      setSearchParams({ page: "1" });
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    const params: Record<string, string> = { page: page.toString() };
    if (searchQuery.trim()) {
      params.q = searchQuery.trim();
    }
    setSearchParams(params);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const clearSearch = () => {
    setSearchQuery("");
    setCurrentPage(1);
    setSearchParams({ page: "1" });
  };

  const handleFavoriteClick = (e: React.MouseEvent, book: Book) => {
    e.preventDefault();
    e.stopPropagation();
    const favoriteBook = convertToFavoriteBook(book);
    toggleFavorite(favoriteBook);
  };

  const retryFetch = () => {
    if (searchQuery.trim()) {
      performSearch(searchQuery, currentPage);
    } else {
      loadAllBooks(currentPage);
    }
  };

  return (
    <div
      className={`min-h-screen ${isDarkMode ? "bg-gray-900" : "bg-gray-50"}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-6">
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
          </div>

          <div className="text-center mb-8">
            <h1
              className={`text-3xl sm:text-4xl font-bold mb-4 ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}
            >
              {t.searchBooks}
            </h1>
            <p
              className={`text-lg ${
                isDarkMode ? "text-gray-300" : "text-gray-600"
              }`}
            >
              {t.findFavoriteBooks}
            </p>
          </div>
        </div>
        {/* Search Bar */}
        <div
          className={`rounded-lg p-6 mb-8 border ${
            isDarkMode
              ? "bg-gray-800 border-gray-700"
              : "bg-white border-gray-200"
          }`}
        >
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder={t.searchPlaceholder}
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className={`w-full pl-12 pr-12 py-3 text-lg border rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-transparent ${
                isDarkMode
                  ? "border-gray-600 bg-gray-700 text-white"
                  : "border-gray-300 bg-white text-gray-900"
              }`}
            />
            {searchQuery && (
              <button
                onClick={clearSearch}
                className={`absolute right-3 top-1/2 transform -translate-y-1/2 hover:text-gray-600 ${
                  isDarkMode
                    ? "text-gray-400 hover:text-gray-300"
                    : "text-gray-400"
                }`}
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
        {/* Recommended Books (You Might Like) */}
        {!searchQuery && (
          <div className="mb-10">
            <RecommendedBooks isDarkMode={isDarkMode} language={language} />
          </div>
        )}
        {/* Search Results Info */}
        <div className="mb-6 mt-10">
          <div className="flex items-center justify-between">
            <p className={isDarkMode ? "text-gray-300" : "text-gray-600"}>
              {loading ? (
                <span className="flex items-center">
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  {t.searching}
                </span>
              ) : pagination ? (
                <>
                  {t.showing} {books.length} {t.of} {pagination.totalItems}{" "}
                  {t.books}
                  {searchQuery && (
                    <span className="ml-2">
                      {t.for} "
                      <span
                        className={`font-semibold ${
                          isDarkMode ? "text-blue-400" : "text-blue-600"
                        }`}
                      >
                        {searchQuery}
                      </span>
                      "
                    </span>
                  )}
                  {pagination.totalPages > 1 && (
                    <span className="ml-2">
                      - {t.page} {pagination.currentPage} {t.of}{" "}
                      {pagination.totalPages}
                    </span>
                  )}
                </>
              ) : null}
            </p>

            {searchQuery && (
              <Button
                variant="outline"
                size="sm"
                onClick={clearSearch}
                className={`bg-transparent ${
                  isDarkMode ? "text-gray-300" : "text-gray-600"
                }`}
              >
                <X className="w-4 h-4 mr-2" />
                {t.clearSearch}
              </Button>
            )}
          </div>
        </div>
        {/* Error State */}
        {error && (
          <div className="text-center py-12">
            <p
              className={`mb-4 ${isDarkMode ? "text-red-400" : "text-red-600"}`}
            >
              {t.errorLoading}: {error}
            </p>
            <Button onClick={retryFetch} variant="outline">
              {t.tryAgain}
            </Button>
          </div>
        )}
        {/* Search Results */}
        {!error && (
          <>
            {books.length === 0 && !loading ? (
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
                  {searchQuery ? t.noResultsFound : t.startSearch}
                </h3>
                <p
                  className={`mb-8 max-w-md mx-auto ${
                    isDarkMode ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  {searchQuery
                    ? `${t.noResultsDesc} "${searchQuery}". ${t.tryDifferent}`
                    : t.startSearchDesc}
                </p>
                {searchQuery && (
                  <Button onClick={clearSearch} variant="outline">
                    {t.clearSearch}
                  </Button>
                )}
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {books.map((book) => {
                    const isBookFavorite = isFavorite(book._id);
                    const bookRating = getBookRating(book);
                    return (
                      <Link
                        key={book._id}
                        to={`/book/${book._id}`}
                        className="block"
                      >
                        <Card
                          className={`hover:shadow-lg transition-all duration-300 ${
                            isDarkMode
                              ? "bg-gray-800 border-gray-700 hover:shadow-gray-950"
                              : "bg-white border-gray-200"
                          }`}
                        >
                          <CardHeader className="pb-4">
                            <div className="flex justify-center mb-4">
                              <img
                                src={book.cover_image || "/placeholder.svg"}
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
                                {book.category?.name || "Unknown"}
                              </Badge>
                              <div className="flex items-center space-x-1">
                                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                <span
                                  className={`text-sm font-medium ${
                                    isDarkMode
                                      ? "text-gray-300"
                                      : "text-gray-700"
                                  }`}
                                >
                                  {bookRating.toFixed(1)}
                                </span>
                              </div>
                            </div>
                            <p
                              className={`text-xs sm:text-sm mb-4 line-clamp-2 ${
                                isDarkMode ? "text-gray-400" : "text-gray-600"
                              }`}
                            >
                              {book.summary}
                            </p>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={(e) => handleFavoriteClick(e, book)}
                              className={`w-full text-xs sm:text-sm transition-colors bg-transparent ${
                                isBookFavorite
                                  ? isDarkMode
                                    ? "border-red-400 text-red-400 hover:bg-red-500/10"
                                    : "border-red-500 text-red-600 hover:bg-red-50"
                                  : isDarkMode
                                  ? "border-gray-600 text-gray-300 hover:bg-gray-700"
                                  : "border-gray-300 text-gray-700 hover:bg-gray-50"
                              }`}
                            >
                              <Heart
                                className={`w-4 h-4 mr-2 ${
                                  isBookFavorite ? "fill-current" : ""
                                }`}
                              />
                              {isBookFavorite
                                ? t.removeFromFavorites
                                : t.addToFavorites}
                            </Button>
                          </CardContent>
                        </Card>
                      </Link>
                    );
                  })}
                </div>

                {/* Pagination */}
                {pagination && pagination.totalPages > 1 && (
                  <div className="flex justify-center items-center mt-8 gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={!pagination.hasPrevPage || loading}
                      className={`bg-transparent ${
                        isDarkMode ? "text-gray-300" : "text-gray-600"
                      }`}
                    >
                      <ChevronLeft className="w-4 h-4 mr-1" />
                      {t.previous}
                    </Button>

                    <span
                      className={`px-4 py-2 text-sm ${
                        isDarkMode ? "text-gray-300" : "text-gray-600"
                      }`}
                    >
                      {t.page} {pagination.currentPage} {t.of}{" "}
                      {pagination.totalPages}
                    </span>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={!pagination.hasNextPage || loading}
                      className={`bg-transparent ${
                        isDarkMode ? "text-gray-300" : "text-gray-600"
                      }`}
                    >
                      {t.next}
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default SearchPage;

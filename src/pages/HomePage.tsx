"use client";

import type React from "react";
import { useState, useEffect, useRef } from "react";
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
  Search,
  Loader2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useFavorites } from "../hooks/useFavorites";
import { Link } from "react-router-dom";
import { bookService } from "../services/bookService";
import { convertToFavoriteBook, getBookRating } from "../utils/bookUtils";
import type { Book } from "../types/book";
import ScrollToTop from "../components/ScrollToTop";

interface HomePageProps {
  isDarkMode: boolean;
  language: "id" | "en";
}

export default function HomePage({ isDarkMode, language }: HomePageProps) {
  const { isFavorite, toggleFavorite, isLoaded } = useFavorites();
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);

  // Buat ref untuk bagian "Popular Books"
  const popularBooksRef = useRef<HTMLElement>(null);
  // Tambahkan ref reloadnya
  const isInitialLoad = useRef(true);

  // Translations object
  const translations = {
    id: {
      heroTitle: "Temukan Buku Favorit Anda",
      heroSubtitle:
        "Jelajahi koleksi buku populer dan simpan buku-buku favorit Anda dalam satu tempat",
      searchBooks: "Cari Buku",
      viewFavorites: "Lihat Favorit",
      popularBooksTitle: "Buku Populer",
      popularBooksSubtitle: "Buku-buku yang sedang trending dan banyak dibaca",
      addToFavorites: "Tambah ke Favorit",
      removeFromFavorites: "Hapus dari Favorit",
      by: "oleh",
      booksCollection: "Koleksi Buku",
      viewDetail: "Lihat Detail",
      loading: "Memuat...",
      errorLoading: "Gagal memuat buku",
      tryAgain: "Coba Lagi",
      showingBooks: "Menampilkan",
      ofTotalBooks: "dari",
      totalBooksAvailable: "buku tersedia",
      previous: "Sebelumnya",
      next: "Selanjutnya",
      page: "Halaman",
    },
    en: {
      heroTitle: "Find Your Favorite Books",
      heroSubtitle:
        "Explore popular book collections and save your favorite books in one place",
      searchBooks: "Search Books",
      viewFavorites: "View Favorites",
      popularBooksTitle: "Popular Books",
      popularBooksSubtitle: "Trending books that are widely read",
      addToFavorites: "Add to Favorites",
      removeFromFavorites: "Remove from Favorites",
      by: "by",
      booksCollection: "Book Collection",
      viewDetail: "View Detail",
      loading: "Loading...",
      errorLoading: "Failed to load books",
      tryAgain: "Try Again",
      showingBooks: "Showing",
      ofTotalBooks: "of",
      totalBooksAvailable: "books available",
      previous: "Previous",
      next: "Next",
      page: "Page",
    },
  };

  const t = translations[language];

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await bookService.getAllBooks(currentPage);
        setBooks(response.books);
        setPagination(response.pagination);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, [currentPage]);

  const isFirstLoad = useRef(true);

  useEffect(() => {
    if (!loading && !error) {
      if (isFirstLoad.current) {
        window.scrollTo({ top: 0, behavior: "smooth" });
        console.log("Scrolled to top (first load)");
        isFirstLoad.current = false; // Set jadi false setelah first load
      } else if (popularBooksRef.current) {
        popularBooksRef.current.scrollIntoView({ behavior: "smooth" });
        console.log("Scrolled to Popular Books section");
      }
    }
  }, [loading, error, currentPage]);

  const handleFavoriteClick = (e: React.MouseEvent, book: Book) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isLoaded) return;

    const favoriteBook = convertToFavoriteBook(book);
    toggleFavorite(favoriteBook);

    const action = isFavorite(book._id) ? "removed from" : "added to";
    console.log(`Book "${book.title}" ${action} favorites`);
  };

  const retryFetch = () => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await bookService.getAllBooks(currentPage);
        setBooks(response.books);
        setPagination(response.pagination);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll ke bagian "Popular Books"
    popularBooksRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const getPageNumbers = (currentPage: number, totalPages: number) => {
    const pageNumbers: (number | string)[] = [];
    const maxVisiblePages = 3;

    if (totalPages <= maxVisiblePages + 2) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      pageNumbers.push(1);

      if (currentPage > 2 + Math.floor(maxVisiblePages / 2)) {
        pageNumbers.push("...");
      }

      let startPage = Math.max(
        2,
        currentPage - Math.floor(maxVisiblePages / 2)
      );
      let endPage = Math.min(
        totalPages - 1,
        currentPage + Math.floor(maxVisiblePages / 2)
      );

      if (currentPage <= Math.floor(maxVisiblePages / 2) + 1) {
        endPage = Math.min(totalPages - 1, maxVisiblePages + 1);
      }
      if (currentPage >= totalPages - Math.floor(maxVisiblePages / 2)) {
        startPage = Math.max(2, totalPages - maxVisiblePages);
      }

      for (let i = startPage; i <= endPage; i++) {
        if (!pageNumbers.includes(i)) {
          pageNumbers.push(i);
        }
      }

      if (currentPage < totalPages - 1 - Math.floor(maxVisiblePages / 2)) {
        pageNumbers.push("...");
      }

      if (totalPages > 1 && !pageNumbers.includes(totalPages)) {
        pageNumbers.push(totalPages);
      }
    }
    return pageNumbers;
  };

  return (
    <div>
      {/* Hero Section with Background */}
      <section
        className={`min-h-screen flex items-center justify-center relative transition-colors duration-300 ${
          isDarkMode ? "bg-gray-800" : "bg-white"
        }`}
        style={{
          backgroundImage: `url('/images/open-book.png')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        {/* Overlay for better text readability */}
        <div
          className={`absolute inset-0 ${
            isDarkMode ? "bg-gray-900/80" : "bg-white/85"
          }`}
        ></div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-20 relative z-10">
          <h2
            className={`text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 ${
              isDarkMode ? "text-white" : "text-gray-900"
            }`}
          >
            {t.heroTitle}
          </h2>
          <p
            className={`text-xl sm:text-2xl mb-12 max-w-3xl mx-auto leading-relaxed ${
              isDarkMode ? "text-gray-200" : "text-gray-700"
            }`}
          >
            {t.heroSubtitle}
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
            <Link to="/search">
              <Button
                size="lg"
                className={`text-lg px-8 py-4 ${
                  isDarkMode
                    ? "bg-blue-600 hover:bg-blue-700"
                    : "bg-gray-900 hover:bg-gray-800"
                } text-white shadow-lg`}
              >
                <Search className="w-5 h-5 mr-3" />
                {t.searchBooks}
              </Button>
            </Link>
            <Link to="/favorites">
              <Button
                variant="outline"
                size="lg"
                className={`text-lg px-8 py-4 ${
                  isDarkMode
                    ? "border-gray-300 text-gray-200 hover:bg-gray-700/50 bg-gray-800/50"
                    : "border-gray-600 text-gray-800 hover:bg-gray-100/50 bg-white/50"
                } backdrop-blur-sm shadow-lg`}
              >
                {t.viewFavorites}
              </Button>
            </Link>
          </div>

          {/* Scroll indicator */}
          <div className="animate-bounce">
            <div
              className={`w-6 h-10 border-2 rounded-full mx-auto ${
                isDarkMode ? "border-gray-300" : "border-gray-600"
              }`}
            >
              <div
                className={`w-1 h-3 rounded-full mx-auto mt-2 animate-pulse ${
                  isDarkMode ? "bg-gray-300" : "bg-gray-600"
                }`}
              ></div>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Books Section */}
      <section ref={popularBooksRef} className="py-16">
        {" "}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h3
              className={`text-2xl sm:text-3xl font-bold mb-4 ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}
            >
              {t.popularBooksTitle}
            </h3>
            <p
              className={`${
                isDarkMode ? "text-gray-300" : "text-gray-600"
              } mb-8`}
            >
              {t.popularBooksSubtitle}
            </p>
          </div>
          {/* Book Count Display */}
          {pagination && !loading && !error && (
            <div className="text-center mb-12">
              <p
                className={`inline-block px-4 py-2 rounded-lg text-base font-medium ${
                  isDarkMode
                    ? "bg-gray-700 text-gray-300"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {t.showingBooks}{" "}
                <span className="font-bold">{books.length}</span>{" "}
                {t.ofTotalBooks}{" "}
                <span className="font-bold">{pagination.totalItems}</span>{" "}
                {t.totalBooksAvailable}
              </p>
            </div>
          )}
          {/* Loading State */}
          {loading && (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
              <span
                className={`ml-2 ${
                  isDarkMode ? "text-gray-300" : "text-gray-600"
                }`}
              >
                {t.loading}
              </span>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="text-center py-12">
              <p
                className={`mb-4 ${
                  isDarkMode ? "text-red-400" : "text-red-600"
                }`}
              >
                {t.errorLoading}: {error}
              </p>
              <Button onClick={retryFetch} variant="outline">
                {t.tryAgain}
              </Button>
            </div>
          )}

          {/* Books Grid */}
          {!loading && !error && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {books.map((book) => {
                  const isBookFavorite = isLoaded
                    ? isFavorite(book._id)
                    : false;
                  const bookRating = getBookRating(book);
                  return (
                    <Link
                      key={book._id}
                      to={`/book/${book._id}`}
                      className="block"
                    >
                      <Card
                        className={`hover:shadow-lg transition-all duration-300 cursor-pointer ${
                          isDarkMode
                            ? "bg-gray-800 border-gray-700 hover:shadow-gray-900/20"
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
                                  isDarkMode ? "text-gray-300" : "text-gray-700"
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

                          {/* Action Buttons */}
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={(e) => handleFavoriteClick(e, book)}
                              disabled={!isLoaded}
                              className={`flex-1 text-xs sm:text-sm transition-colors ${
                                isBookFavorite
                                  ? isDarkMode
                                    ? "border-red-500 text-red-400 hover:bg-red-500/10"
                                    : "border-red-500 text-red-600 hover:bg-red-50"
                                  : isDarkMode
                                  ? "border-gray-600 text-gray-300 hover:bg-gray-700"
                                  : "border-gray-300 text-gray-700 hover:bg-gray-50"
                              } bg-transparent`}
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
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  );
                })}
              </div>

              {/* Pagination Controls */}
              {pagination && pagination.totalPages > 1 && (
                <div className="flex justify-center items-center mt-8 gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={!pagination.hasPrevPage || loading}
                    className={`bg-transparent ${
                      isDarkMode
                        ? "border-gray-600 text-gray-300 hover:bg-gray-700"
                        : "border-gray-300 text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    {t.previous}
                  </Button>

                  {getPageNumbers(currentPage, pagination.totalPages).map(
                    (pageNumber, index) =>
                      pageNumber === "..." ? (
                        <span
                          key={index}
                          className={`px-2 py-2 text-sm ${
                            isDarkMode ? "text-gray-400" : "text-gray-500"
                          }`}
                        >
                          ...
                        </span>
                      ) : (
                        <Button
                          key={pageNumber}
                          variant={
                            pageNumber === currentPage ? "default" : "outline"
                          }
                          size="sm"
                          onClick={() => handlePageChange(pageNumber as number)}
                          disabled={loading}
                          className={
                            pageNumber === currentPage
                              ? "bg-blue-600 text-white hover:bg-blue-700"
                              : `bg-transparent ${
                                  isDarkMode
                                    ? "border-gray-600 text-gray-300 hover:bg-gray-700"
                                    : "border-gray-300 text-gray-700 hover:bg-gray-50"
                                }`
                          }
                        >
                          {pageNumber}
                        </Button>
                      )
                  )}

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={!pagination.hasNextPage || loading}
                    className={`bg-transparent ${
                      isDarkMode
                        ? "border-gray-600 text-gray-300 hover:bg-gray-700"
                        : "border-gray-300 text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {t.next}
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  );
}

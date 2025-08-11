"use client";

import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import {
  Star,
  Heart,
  ArrowLeft,
  Calendar,
  BookOpen,
  Globe,
  Building,
  Hash,
  MessageCircle,
  Share2,
  Loader2,
  ExternalLink,
} from "lucide-react";
import { useFavorites } from "../hooks/useFavorites";
import { bookService } from "../services/bookService";
import {
  convertToFavoriteBook,
  getBookRating,
  formatPrice,
} from "../utils/bookUtils";
import type { Book } from "../types/book";

interface BookDetailPageProps {
  isDarkMode: boolean;
  language: "id" | "en";
}

const BookDetailPage = ({ isDarkMode, language }: BookDetailPageProps) => {
  const { bookId } = useParams<{ bookId: string }>();
  const navigate = useNavigate();
  const { isFavorite, toggleFavorite } = useFavorites();
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"overview" | "reviews">(
    "overview"
  );

  // Translations
  const translations = {
    id: {
      bookNotFound: "Buku Tidak Ditemukan",
      bookNotFoundDesc: "Maaf, buku yang Anda cari tidak dapat ditemukan.",
      backToHome: "Kembali ke Beranda",
      home: "Beranda",
      searchBooks: "Cari Buku",
      back: "Kembali",
      by: "oleh",
      addToFavorites: "Tambah ke Favorit",
      removeFromFavorites: "Hapus dari Favorit",
      share: "Bagikan",
      download: "Download",
      overview: "Ringkasan",
      reviews: "Ulasan",
      aboutBook: "Tentang Buku Ini",
      publicationDetails: "Detail Publikasi",
      specifications: "Spesifikasi",
      pages: "hal",
      language: "Bahasa",
      rating: "Rating",
      readerReviews: "Ulasan Pembaca",
      noReviews: "Belum ada ulasan untuk buku ini.",
      similarBooks: "Buku Serupa",
      linkCopied: "Link berhasil disalin ke clipboard!",
      loading: "Memuat...",
      errorLoading: "Gagal memuat buku",
      tryAgain: "Coba Lagi",
      price: "Harga",
      publisher: "Penerbit",
      publishedDate: "Tanggal Terbit",
      isbn: "ISBN",
      format: "Format",
      buyLinks: "Beli Buku",
      tags: "Tag",
    },
    en: {
      bookNotFound: "Book Not Found",
      bookNotFoundDesc: "Sorry, the book you are looking for cannot be found.",
      backToHome: "Back to Home",
      home: "Home",
      searchBooks: "Search Books",
      back: "Back",
      by: "by",
      addToFavorites: "Add to Favorites",
      removeFromFavorites: "Remove from Favorites",
      share: "Share",
      download: "Download",
      overview: "Overview",
      reviews: "Reviews",
      aboutBook: "About This Book",
      publicationDetails: "Publication Details",
      specifications: "Specifications",
      pages: "pages",
      language: "Language",
      rating: "Rating",
      readerReviews: "Reader Reviews",
      noReviews: "No reviews for this book yet.",
      similarBooks: "Similar Books",
      linkCopied: "Link copied to clipboard!",
      loading: "Loading...",
      errorLoading: "Failed to load book",
      tryAgain: "Try Again",
      price: "Price",
      publisher: "Publisher",
      publishedDate: "Published Date",
      isbn: "ISBN",
      format: "Format",
      buyLinks: "Buy Book",
      tags: "Tags",
    },
  };

  const t = translations[language];

  // Fetch book data
  useEffect(() => {
    const fetchBook = async () => {
      if (!bookId) return;

      try {
        setLoading(true);
        setError(null);
        const bookData = await bookService.getBookById(bookId);
        setBook(bookData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchBook();
  }, [bookId]);

  if (loading) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center ${
          isDarkMode ? "bg-gray-900" : "bg-gray-50"
        }`}
      >
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-blue-600" />
          <p className={isDarkMode ? "text-gray-300" : "text-gray-600"}>
            {t.loading}
          </p>
        </div>
      </div>
    );
  }

  if (error || !book) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center ${
          isDarkMode ? "bg-gray-900" : "bg-gray-50"
        }`}
      >
        <div className="text-center">
          <BookOpen
            className={`w-24 h-24 mx-auto mb-6 ${
              isDarkMode ? "text-gray-600" : "text-gray-300"
            }`}
          />
          <h1
            className={`text-2xl font-bold mb-4 ${
              isDarkMode ? "text-white" : "text-gray-900"
            }`}
          >
            {t.bookNotFound}
          </h1>
          <p
            className={`mb-8 ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}
          >
            {error ? `${t.errorLoading}: ${error}` : t.bookNotFoundDesc}
          </p>
          <div className="flex gap-4 justify-center">
            <Link to="/">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                <ArrowLeft className="w-4 h-4 mr-2" />
                {t.backToHome}
              </Button>
            </Link>
            {error && (
              <Button
                variant="outline"
                onClick={() => window.location.reload()}
              >
                {t.tryAgain}
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  }

  const isBookFavorite = isFavorite(book._id);
  const bookRating = getBookRating(book);

  const handleFavoriteClick = () => {
    const favoriteBook = convertToFavoriteBook(book);
    toggleFavorite(favoriteBook);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: book.title,
        text: `${language === "id" ? "Lihat" : "Check out"} "${book.title}" ${
          t.by
        } ${book.author.name}`,
        url: window.location.href,
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert(t.linkCopied);
    }
  };

  return (
    <div
      className={`min-h-screen ${isDarkMode ? "bg-gray-900" : "bg-gray-50"}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-8 text-sm">
          <Link
            to="/"
            className={`hover:underline ${
              isDarkMode ? "text-blue-400" : "text-blue-600"
            }`}
          >
            {t.home}
          </Link>
          <span className={isDarkMode ? "text-gray-400" : "text-gray-400"}>
            /
          </span>
          <Link
            to="/search"
            className={`hover:underline ${
              isDarkMode ? "text-blue-400" : "text-blue-600"
            }`}
          >
            {t.searchBooks}
          </Link>
          <span className={isDarkMode ? "text-gray-400" : "text-gray-400"}>
            /
          </span>
          <span
            className={`truncate ${
              isDarkMode ? "text-gray-300" : "text-gray-600"
            }`}
          >
            {book.title}
          </span>
        </div>

        {/* Back Button */}
        <div className="mb-6">
          <Button
            variant="outline"
            onClick={() => navigate(-1)}
            className={`flex items-center gap-2 ${
              isDarkMode
                ? "bg-stone-50 border-gray-300 text-gray-700 hover:bg-gray-50"
                : "bg-blue-50 border-gray-600 text-gray-700 hover:bg-gray-700 hover:text-white"
            }`}
          >
            <ArrowLeft className="w-4 h-4" />
            {t.back}
          </Button>
        </div>

        {/* Book Header */}
        <div
          className={`rounded-lg shadow-sm border p-6 mb-8 ${
            isDarkMode
              ? "bg-gray-800 border-gray-700 hover:shadow-gray-950"
              : "bg-white border-gray-200"
          }`}
        >
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Book Cover */}
            <div className="lg:col-span-1">
              <div className="flex justify-center lg:justify-start">
                <img
                  src={book.cover_image || "/placeholder.svg"}
                  alt={book.title}
                  className="w-64 h-96 object-cover rounded-lg shadow-lg"
                />
              </div>
            </div>

            {/* Book Info */}
            <div className="lg:col-span-2">
              <div className="flex flex-col h-full">
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h1
                        className={`text-3xl sm:text-4xl font-bold mb-2 ${
                          isDarkMode ? "text-white" : "text-gray-900"
                        }`}
                      >
                        {book.title}
                      </h1>
                      <p
                        className={`text-xl mb-4 ${
                          isDarkMode ? "text-gray-300" : "text-gray-600"
                        }`}
                      >
                        {t.by}{" "}
                        <span className="font-semibold">
                          {book.author.name}
                        </span>
                      </p>
                    </div>
                  </div>

                  {/* Rating & Genre */}
                  <div className="flex items-center gap-4 mb-6">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`w-5 h-5 ${
                              star <= Math.round(bookRating)
                                ? "fill-yellow-400 text-yellow-400"
                                : isDarkMode
                                ? "text-gray-600"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <span
                        className={`text-lg font-semibold ${
                          isDarkMode ? "text-white" : "text-gray-900"
                        }`}
                      >
                        {bookRating.toFixed(1)}
                      </span>
                    </div>
                    {book.category?.name && (
                      <Badge variant="secondary" className="text-sm">
                        {book.category.name}
                      </Badge>
                    )}
                  </div>

                  {/* Description */}
                  <p
                    className={`text-lg leading-relaxed mb-6 ${
                      isDarkMode ? "text-gray-300" : "text-gray-600"
                    }`}
                  >
                    {book.summary}
                  </p>

                  {/* Book Details */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                    {book.details.published_date && (
                      <div
                        className={`flex items-center gap-2 text-sm ${
                          isDarkMode ? "text-gray-300" : "text-gray-600"
                        }`}
                      >
                        <Calendar className="w-4 h-4" />
                        <span>{book.details.published_date}</span>
                      </div>
                    )}
                    {book.details.total_pages && (
                      <div
                        className={`flex items-center gap-2 text-sm ${
                          isDarkMode ? "text-gray-300" : "text-gray-600"
                        }`}
                      >
                        <BookOpen className="w-4 h-4" />
                        <span>{book.details.total_pages}</span>
                      </div>
                    )}
                    {book.details.price && (
                      <div
                        className={`flex items-center gap-2 text-sm ${
                          isDarkMode ? "text-gray-300" : "text-gray-600"
                        }`}
                      >
                        <span className="font-semibold text-green-600">
                          {formatPrice(book.details.price)}
                        </span>
                      </div>
                    )}
                    <div
                      className={`flex items-center gap-2 text-sm ${
                        isDarkMode ? "text-gray-300" : "text-gray-600"
                      }`}
                    >
                      <Building className="w-4 h-4" />
                      <span>{book.publisher}</span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    onClick={handleFavoriteClick}
                    className={`flex-1 ${
                      isBookFavorite
                        ? "bg-red-600 hover:bg-red-700 text-white"
                        : "bg-blue-600 hover:bg-blue-700 text-white"
                    }`}
                  >
                    <Heart
                      className={`w-4 h-4 mr-2 ${
                        isBookFavorite ? "fill-current" : ""
                      }`}
                    />
                    {isBookFavorite ? t.removeFromFavorites : t.addToFavorites}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleShare}
                    className={`flex items-center gap-2 ${
                      isDarkMode
                        ? "bg-stone-50 border-gray-300 text-gray-700 hover:bg-gray-50"
                        : "bg-blue-50 border-gray-600 text-gray-700 hover:bg-gray-700 hover:text-white"
                    }`}
                  >
                    <Share2 className="w-4 h-4 mr-2" />
                    {t.share}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div
          className={`rounded-lg shadow-sm border mb-8 ${
            isDarkMode
              ? "bg-gray-800 border-gray-700"
              : "bg-white border-gray-200"
          }`}
        >
          <div
            className={`border-b ${
              isDarkMode ? "border-gray-700" : "border-gray-200"
            }`}
          >
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab("overview")}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "overview"
                    ? isDarkMode
                      ? "border-blue-400 text-blue-400"
                      : "border-blue-500 text-blue-600"
                    : isDarkMode
                    ? "border-transparent text-gray-400 hover:text-gray-300"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                {t.overview}
              </button>
              <button
                onClick={() => setActiveTab("reviews")}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "reviews"
                    ? isDarkMode
                      ? "border-blue-400 text-blue-400"
                      : "border-blue-500 text-blue-600"
                    : isDarkMode
                    ? "border-transparent text-gray-400 hover:text-gray-300"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                {t.reviews}
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === "overview" && (
              <div>
                <h3
                  className={`text-xl font-semibold mb-4 ${
                    isDarkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  {t.aboutBook}
                </h3>
                <p
                  className={`leading-relaxed mb-6 ${
                    isDarkMode ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  {book.summary}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4
                      className={`font-semibold mb-3 ${
                        isDarkMode ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {t.publicationDetails}
                    </h4>
                    <div className="space-y-2 text-sm">
                      {book.details.isbn && (
                        <div className="flex items-center gap-2">
                          <Hash className="w-4 h-4 text-gray-400" />
                          <span
                            className={
                              isDarkMode ? "text-gray-300" : "text-gray-600"
                            }
                          >
                            {t.isbn}: {book.details.isbn}
                          </span>
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <Building className="w-4 h-4 text-gray-400" />
                        <span
                          className={
                            isDarkMode ? "text-gray-300" : "text-gray-600"
                          }
                        >
                          {t.publisher}: {book.publisher}
                        </span>
                      </div>
                      {book.details.published_date && (
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span
                            className={
                              isDarkMode ? "text-gray-300" : "text-gray-600"
                            }
                          >
                            {t.publishedDate}: {book.details.published_date}
                          </span>
                        </div>
                      )}
                      {book.details.price && (
                        <div className="flex items-center gap-2">
                          <span className="w-4 h-4 text-green-600 font-bold">
                            $
                          </span>
                          <span
                            className={
                              isDarkMode ? "text-gray-300" : "text-gray-600"
                            }
                          >
                            {t.price}: {formatPrice(book.details.price)}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <h4
                      className={`font-semibold mb-3 ${
                        isDarkMode ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {t.specifications}
                    </h4>
                    <div className="space-y-2 text-sm">
                      {book.details.total_pages && (
                        <div className="flex items-center gap-2">
                          <BookOpen className="w-4 h-4 text-gray-400" />
                          <span
                            className={
                              isDarkMode ? "text-gray-300" : "text-gray-600"
                            }
                          >
                            {book.details.total_pages}
                          </span>
                        </div>
                      )}
                      {book.details.size && (
                        <div className="flex items-center gap-2">
                          <Globe className="w-4 h-4 text-gray-400" />
                          <span
                            className={
                              isDarkMode ? "text-gray-300" : "text-gray-600"
                            }
                          >
                            {language === "id" ? "Ukuran" : "Size"}:{" "}
                            {book.details.size}
                          </span>
                        </div>
                      )}
                      {book.details.format && (
                        <div className="flex items-center gap-2">
                          <BookOpen className="w-4 h-4 text-gray-400" />
                          <span
                            className={
                              isDarkMode ? "text-gray-300" : "text-gray-600"
                            }
                          >
                            {t.format}: {book.details.format}
                          </span>
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <Star className="w-4 h-4 text-gray-400" />
                        <span
                          className={
                            isDarkMode ? "text-gray-300" : "text-gray-600"
                          }
                        >
                          {t.rating}: {bookRating.toFixed(1)}/5
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Tags */}
                {book.tags && book.tags.length > 0 && (
                  <div className="mt-6">
                    <h4
                      className={`font-semibold mb-3 ${
                        isDarkMode ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {t.tags}
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {book.tags.map((tag, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className={`text-xs ${
                            isDarkMode
                              ? "border-gray-600 text-gray-300"
                              : "border-gray-300 text-gray-600"
                          }`}
                        >
                          {tag.name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Buy Links */}
                {book.buy_links && book.buy_links.length > 0 && (
                  <div className="mt-6">
                    <h4
                      className={`font-semibold mb-3 ${
                        isDarkMode ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {t.buyLinks}
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {book.buy_links.map((link, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          size="sm"
                          className={`flex items-center gap-2 ${
                            isDarkMode
                              ? "bg-stone-50 border-gray-300 text-gray-700 hover:bg-gray-50"
                              : "bg-blue-50 border-gray-600 text-gray-700 hover:bg-gray-700 hover:text-white"
                          }`}
                        >
                          <a
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2"
                          >
                            <ExternalLink className="w-4 h-4" />
                            {link.store}
                          </a>
                        </Button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === "reviews" && (
              <div>
                <h3
                  className={`text-xl font-semibold mb-6 ${
                    isDarkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  {t.readerReviews}
                </h3>

                <div className="text-center py-8">
                  <MessageCircle
                    className={`w-16 h-16 mx-auto mb-4 ${
                      isDarkMode ? "text-gray-600" : "text-gray-300"
                    }`}
                  />
                  <p className={isDarkMode ? "text-gray-400" : "text-gray-500"}>
                    {t.noReviews}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetailPage;

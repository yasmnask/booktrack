"use client";

import type React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Star, Loader2 } from "lucide-react";
import { useUserActivity } from "../hooks/useUserActivity";
import { bookService } from "../services/bookService";
import { getBookRating } from "../utils/bookUtils";
import type { Book } from "../types/book";
import { useState, useEffect } from "react";

interface RecommendedBooksProps {
  isDarkMode: boolean;
  language: "id" | "en";
}

const RecommendedBooks: React.FC<RecommendedBooksProps> = ({
  isDarkMode,
  language,
}) => {
  const { activityLog, isLoaded: activityLoaded } = useUserActivity();
  const [recommendedBooks, setRecommendedBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const translations = {
    id: {
      youMightLike: "Kamu Mungkin Suka",
      basedOnActivity: "Berdasarkan aktivitas Anda",
      noRecommendations: "Tidak ada rekomendasi saat ini.",
      noRecommendationsDesc:
        "Jelajahi lebih banyak buku untuk mendapatkan rekomendasi yang dipersonalisasi!",
      loadingRecommendations: "Memuat rekomendasi...",
      by: "oleh",
    },
    en: {
      youMightLike: "You Might Like",
      basedOnActivity: "Based on your activity",
      noRecommendations: "No recommendations available yet.",
      noRecommendationsDesc:
        "Explore more books to get personalized recommendations!",
      loadingRecommendations: "Loading recommendations...",
      by: "by",
    },
  };

  const t = translations[language];

  useEffect(() => {
    const fetchRecommendations = async () => {
      if (!activityLoaded) return;

      setLoading(true);
      setError(null);
      try {
        const recentBookIds = activityLog
          .filter(
            (a) =>
              a.type === "view" || a.type === "favorite" || a.type === "review"
          )
          .map((a) => a.bookId);

        if (recentBookIds.length === 0) {
          // If no activity, fetch some random popular books
          const response = await bookService.getAllBooks(1);
          setRecommendedBooks(response.books.slice(0, 4)); // Show first 4 popular books
          setLoading(false);
          return;
        }

        // Simple recommendation logic:
        // 1. Get genres and authors from recent activity
        const relevantGenres = Array.from(
          new Set(activityLog.map((a) => a.genre).filter(Boolean))
        );
        const relevantAuthors = Array.from(
          new Set(activityLog.map((a) => a.authorName).filter(Boolean))
        );

        let recommended: Book[] = [];
        const fetchedBookIds = new Set<string>();

        // Try to get books by relevant genres
        for (const genre of relevantGenres) {
          if (recommended.length >= 4) break;
          const response = await bookService.searchBooks(genre as string, 1);
          response.books.forEach((book) => {
            if (
              !recentBookIds.includes(book._id) &&
              !fetchedBookIds.has(book._id) &&
              recommended.length < 4
            ) {
              recommended.push(book);
              fetchedBookIds.add(book._id);
            }
          });
        }

        // If not enough, try to get books by relevant authors
        if (recommended.length < 4) {
          for (const author of relevantAuthors) {
            if (recommended.length >= 4) break;
            const response = await bookService.searchBooks(author as string, 1);
            response.books.forEach((book) => {
              if (
                !recentBookIds.includes(book._id) &&
                !fetchedBookIds.has(book._id) &&
                recommended.length < 4
              ) {
                recommended.push(book);
                fetchedBookIds.add(book._id);
              }
            });
          }
        }

        // If still not enough, fill with random popular books
        if (recommended.length < 4) {
          const response = await bookService.getAllBooks(1);
          response.books.forEach((book) => {
            if (
              !recentBookIds.includes(book._id) &&
              !fetchedBookIds.has(book._id) &&
              recommended.length < 4
            ) {
              recommended.push(book);
              fetchedBookIds.add(book._id);
            }
          });
        }

        setRecommendedBooks(recommended);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [activityLog, activityLoaded]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
        <span
          className={`ml-2 ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}
        >
          {t.loadingRecommendations}
        </span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className={`text-red-500 ${isDarkMode ? "text-red-400" : ""}`}>
          Error: {error}
        </p>
      </div>
    );
  }

  return (
    <div className="mt-12">
      <h3
        className={`text-2xl font-bold mb-2 ${
          isDarkMode ? "text-white" : "text-gray-900"
        }`}
      >
        {t.youMightLike}
      </h3>
      <p
        className={`text-lg mb-6 ${
          isDarkMode ? "text-gray-300" : "text-gray-600"
        }`}
      >
        {t.basedOnActivity}
      </p>

      {recommendedBooks.length === 0 ? (
        <div className="text-center py-8">
          <p className={isDarkMode ? "text-gray-400" : "text-gray-500"}>
            {t.noRecommendations}
          </p>
          <p className={isDarkMode ? "text-gray-400" : "text-gray-500"}>
            {t.noRecommendationsDesc}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {recommendedBooks.map((book) => (
            <Link key={book._id} to={`/book/${book._id}`} className="block">
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
                      className="w-20 h-28 sm:w-24 sm:h-32 object-cover rounded-md shadow-sm"
                    />
                  </div>
                  <CardTitle
                    className={`text-base sm:text-lg font-semibold text-center line-clamp-2 ${
                      isDarkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {book.title}
                  </CardTitle>
                  <p
                    className={`text-center text-sm ${
                      isDarkMode ? "text-gray-300" : "text-gray-600"
                    }`}
                  >
                    {t.by} {book.author.name}
                  </p>
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
                        {getBookRating(book).toFixed(1)}
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
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecommendedBooks;

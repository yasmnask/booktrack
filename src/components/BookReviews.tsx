"use client";

import type React from "react";
import { Star, User, Calendar, Trash2 } from "lucide-react";
import type { UserReview } from "../types/reading";
import { Button } from "./ui/button";

interface BookReviewsProps {
  reviews: UserReview[];
  onDeleteReview: (reviewId: string) => void;
  isDarkMode: boolean;
  language: "id" | "en";
}

const BookReviews: React.FC<BookReviewsProps> = ({
  reviews,
  onDeleteReview,
  isDarkMode,
  language,
}) => {
  const translations = {
    id: {
      readerReviews: "Ulasan Pembaca",
      noReviews: "Belum ada ulasan untuk buku ini.",
      deleteReview: "Hapus Ulasan",
      confirmDelete: "Apakah Anda yakin ingin menghapus ulasan ini?",
    },
    en: {
      readerReviews: "Reader Reviews",
      noReviews: "No reviews for this book yet.",
      deleteReview: "Delete Review",
      confirmDelete: "Are you sure you want to delete this review?",
    },
  };

  const t = translations[language];

  const handleDeleteClick = (reviewId: string) => {
    if (window.confirm(t.confirmDelete)) {
      onDeleteReview(reviewId);
    }
  };

  return (
    <div>
      <h3
        className={`text-xl font-semibold mb-6 ${
          isDarkMode ? "text-white" : "text-gray-900"
        }`}
      >
        {t.readerReviews} ({reviews.length})
      </h3>

      {reviews.length === 0 ? (
        <div className="text-center py-8">
          <p className={isDarkMode ? "text-gray-400" : "text-gray-500"}>
            {t.noReviews}
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {reviews.map((review) => (
            <div
              key={review.id}
              className={`p-4 rounded-lg border ${
                isDarkMode
                  ? "bg-gray-800 border-gray-700"
                  : "bg-white border-gray-200"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <User
                    className={`w-5 h-5 ${
                      isDarkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  />
                  <span
                    className={`font-semibold ${
                      isDarkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {review.userName}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-4 h-4 ${
                        star <= review.rating
                          ? "fill-yellow-400 text-yellow-400"
                          : isDarkMode
                          ? "text-gray-600"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
              </div>
              <p
                className={`text-sm mb-3 ${
                  isDarkMode ? "text-gray-300" : "text-gray-600"
                }`}
              >
                {review.comment}
              </p>
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1">
                  <Calendar
                    className={`w-3 h-3 ${
                      isDarkMode ? "text-gray-500" : "text-gray-400"
                    }`}
                  />
                  <span
                    className={isDarkMode ? "text-gray-400" : "text-gray-500"}
                  >
                    {review.date}
                  </span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDeleteClick(review.id)}
                  className={`h-6 px-2 text-xs ${
                    isDarkMode
                      ? "border-red-600 text-red-400 hover:bg-red-500/10"
                      : "border-red-500 text-red-600 hover:bg-red-50"
                  } bg-transparent`}
                >
                  <Trash2 className="w-3 h-3 mr-1" />
                  {t.deleteReview}
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BookReviews;

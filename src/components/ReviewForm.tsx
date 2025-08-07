"use client";

import type React from "react";
import { useState } from "react";
import { Button } from "./ui/button";
// import { Textarea } from "./ui/textarea";
import { Star, Send, Loader2 } from "lucide-react";
import type { UserReview } from "../types/reading";

interface ReviewFormProps {
  bookId: string;
  onAddReview: (review: Omit<UserReview, "id" | "date" | "bookId">) => void;
  isDarkMode: boolean;
  language: "id" | "en";
}

const ReviewForm: React.FC<ReviewFormProps> = ({
  onAddReview,
  isDarkMode,
  language,
}) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [userName, setUserName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const translations = {
    id: {
      leaveReview: "Tinggalkan Ulasan Anda",
      yourRating: "Rating Anda",
      yourName: "Nama Anda",
      yourComment: "Komentar Anda",
      submitReview: "Kirim Ulasan",
      nameRequired: "Nama diperlukan.",
      ratingRequired: "Rating diperlukan.",
      commentRequired: "Komentar diperlukan.",
      reviewSubmitted: "Ulasan berhasil dikirim!",
    },
    en: {
      leaveReview: "Leave Your Review",
      yourRating: "Your Rating",
      yourName: "Your Name",
      yourComment: "Your Comment",
      submitReview: "Submit Review",
      nameRequired: "Name is required.",
      ratingRequired: "Rating is required.",
      commentRequired: "Comment is required.",
      reviewSubmitted: "Review submitted successfully!",
    },
  };

  const t = translations[language];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!userName.trim()) {
      setError(t.nameRequired);
      return;
    }
    if (rating === 0) {
      setError(t.ratingRequired);
      return;
    }
    if (!comment.trim()) {
      setError(t.commentRequired);
      return;
    }

    setIsSubmitting(true);
    // Simulate API call or complex logic
    await new Promise((resolve) => setTimeout(resolve, 1000));

    onAddReview({
      userName: userName.trim(),
      rating,
      comment: comment.trim(),
    });

    setRating(0);
    setComment("");
    setUserName("");
    setIsSubmitting(false);
    alert(t.reviewSubmitted); // Simple feedback
  };

  return (
    <div
      className={`p-6 rounded-lg border ${
        isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
      }`}
    >
      <h3
        className={`text-xl font-semibold mb-4 ${
          isDarkMode ? "text-white" : "text-gray-900"
        }`}
      >
        {t.leaveReview}
      </h3>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label
            htmlFor="userName"
            className={`block text-sm font-medium mb-2 ${
              isDarkMode ? "text-gray-300" : "text-gray-700"
            }`}
          >
            {t.yourName}
          </label>
          <input
            type="text"
            id="userName"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            className={`w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
              isDarkMode
                ? "bg-gray-700 border-gray-600 text-white"
                : "bg-gray-50 border-gray-300 text-gray-900"
            }`}
            placeholder="John Doe"
            required
          />
        </div>
        <div className="mb-4">
          <label
            className={`block text-sm font-medium mb-2 ${
              isDarkMode ? "text-gray-300" : "text-gray-700"
            }`}
          >
            {t.yourRating}
          </label>
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`w-6 h-6 cursor-pointer transition-colors ${
                  star <= rating
                    ? "fill-yellow-400 text-yellow-400"
                    : isDarkMode
                    ? "text-gray-600 hover:text-gray-400"
                    : "text-gray-300 hover:text-gray-500"
                }`}
                onClick={() => setRating(star)}
              />
            ))}
          </div>
        </div>
        <div className="mb-4">
          <label
            htmlFor="comment"
            className={`block text-sm font-medium mb-2 ${
              isDarkMode ? "text-gray-300" : "text-gray-700"
            }`}
          >
            {t.yourComment}
          </label>
          <textarea
            id="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={4}
            className={`w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
              isDarkMode
                ? "bg-gray-700 border-gray-600 text-white"
                : "bg-gray-50 border-gray-300 text-gray-900"
            }`}
            placeholder="Tulis ulasan Anda di sini..."
            required
          />
        </div>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        <Button
          type="submit"
          disabled={isSubmitting}
          className={`w-full ${
            isDarkMode
              ? "bg-blue-600 hover:bg-blue-700 text-white"
              : "bg-blue-600 hover:bg-blue-700 text-white"
          }`}
        >
          {isSubmitting ? (
            <Loader2 className="w-4 h-4 animate-spin mr-2" />
          ) : (
            <Send className="w-4 h-4 mr-2" />
          )}
          {t.submitReview}
        </Button>
      </form>
    </div>
  );
};

export default ReviewForm;

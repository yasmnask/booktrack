"use client";

import { useState, useEffect, useCallback } from "react";
import type { UserReview } from "../types/reading";

const STORAGE_KEY = "booktrack-reviews";

export const useReviews = () => {
  const [reviews, setReviews] = useState<UserReview[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const savedReviews = localStorage.getItem(STORAGE_KEY);
      if (savedReviews) {
        const parsedReviews = JSON.parse(savedReviews);
        setReviews(Array.isArray(parsedReviews) ? parsedReviews : []);
      }
    } catch (error) {
      console.error("Error loading reviews:", error);
      setReviews([]);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(reviews));
      } catch (error) {
        console.error("Error saving reviews:", error);
      }
    }
  }, [reviews, isLoaded]);

  const getReviewsForBook = useCallback(
    (bookId: string) => {
      return reviews.filter((review) => review.bookId === bookId);
    },
    [reviews]
  );

  const addReview = useCallback((review: Omit<UserReview, "id" | "date">) => {
    setReviews((prev) => {
      const newReview: UserReview = {
        ...review,
        id: crypto.randomUUID(), // Generate a unique ID for the review
        date: new Date().toISOString().split("T")[0], // YYYY-MM-DD
      };
      return [...prev, newReview];
    });
  }, []);

  const deleteReview = useCallback((reviewId: string) => {
    setReviews((prev) => prev.filter((review) => review.id !== reviewId));
  }, []);

  return {
    reviews,
    getReviewsForBook,
    addReview,
    deleteReview,
    isLoaded,
  };
};

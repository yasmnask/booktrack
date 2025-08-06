"use client";

import { useState, useEffect, useCallback } from "react";
import type { FavoriteBook } from "../types/book";

//udah di local storage
const STORAGE_KEY = "booktrack-favorites";

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<FavoriteBook[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load favorites from localStorage on mount
  useEffect(() => {
    try {
      const savedFavorites = localStorage.getItem(STORAGE_KEY);
      if (savedFavorites) {
        const parsedFavorites = JSON.parse(savedFavorites);
        setFavorites(Array.isArray(parsedFavorites) ? parsedFavorites : []);
      }
    } catch (error) {
      console.error("Error loading favorites:", error);
      setFavorites([]);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save favorites to localStorage whenever favorites change
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
      } catch (error) {
        console.error("Error saving favorites:", error);
      }
    }
  }, [favorites, isLoaded]);

  const addToFavorites = useCallback((book: FavoriteBook) => {
    setFavorites((prev) => {
      const isAlreadyFavorite = prev.some((fav) => fav._id === book._id);
      if (isAlreadyFavorite) {
        return prev;
      }
      const newFavorites = [...prev, book];
      console.log("Added to favorites:", book.title);
      return newFavorites;
    });
  }, []);

  const removeFromFavorites = useCallback((bookId: string) => {
    setFavorites((prev) => {
      const newFavorites = prev.filter((book) => book._id !== bookId);
      console.log("Removed from favorites:", bookId);
      return newFavorites;
    });
  }, []);

  const isFavorite = useCallback(
    (bookId: string) => {
      return favorites.some((book) => book._id === bookId);
    },
    [favorites]
  );

  const toggleFavorite = useCallback(
    (book: FavoriteBook) => {
      if (isFavorite(book._id)) {
        removeFromFavorites(book._id);
      } else {
        addToFavorites(book);
      }
    },
    [isFavorite, addToFavorites, removeFromFavorites]
  );

  return {
    favorites,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
    toggleFavorite,
    isLoaded,
  };
};

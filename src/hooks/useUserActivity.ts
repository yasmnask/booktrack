"use client";

import { useState, useEffect, useCallback } from "react";
import type { UserActivity } from "../types/reading";
import type { Book } from "../types/book";

const STORAGE_KEY = "booktrack-user-activity";
const MAX_ACTIVITY_ITEMS = 100; // Limit the number of stored activities

export const useUserActivity = () => {
  const [activityLog, setActivityLog] = useState<UserActivity[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const savedActivity = localStorage.getItem(STORAGE_KEY);
      if (savedActivity) {
        const parsedActivity = JSON.parse(savedActivity);
        setActivityLog(Array.isArray(parsedActivity) ? parsedActivity : []);
      }
    } catch (error) {
      console.error("Error loading user activity:", error);
      setActivityLog([]);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (isLoaded) {
      try {
        // Keep only the most recent activities
        const recentActivity = activityLog.slice(-MAX_ACTIVITY_ITEMS);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(recentActivity));
      } catch (error) {
        console.error("Error saving user activity:", error);
      }
    }
  }, [activityLog, isLoaded]);

  const trackActivity = useCallback(
    (bookId: string, type: UserActivity["type"], book?: Book) => {
      setActivityLog((prev) => {
        const newActivity: UserActivity = {
          bookId,
          timestamp: Date.now(),
          type,
          genre: book?.category?.name ?? undefined,
          authorName: book?.author?.name,
        };
        return [...prev, newActivity];
      });
    },
    []
  );

  const getRecentActivity = useCallback(() => {
    return activityLog.slice().reverse(); // Return most recent first
  }, [activityLog]);

  return {
    activityLog,
    trackActivity,
    getRecentActivity,
    isLoaded,
  };
};

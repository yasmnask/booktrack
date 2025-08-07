export type ReadingStatusType =
  | "none"
  | "wantToRead"
  | "currentlyReading"
  | "read"
  | "all";

export interface ReadingStatus {
  bookId: string;
  status: ReadingStatusType;
  progress?: number; // Percentage for 'currentlyReading'
  startedDate?: string;
  finishedDate?: string;
}

export interface UserReview {
  id: string; // Unique ID for the review
  bookId: string;
  userName: string;
  rating: number; // 1-5 stars
  comment: string;
  date: string;
}

export interface UserActivity {
  bookId: string;
  timestamp: number; // Unix timestamp
  type: "view" | "favorite" | "statusChange" | "review";
  genre?: string; // For recommendation
  authorName?: string; // For recommendation
}

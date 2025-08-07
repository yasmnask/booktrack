import type { Book, FavoriteBook } from "../types/book";
import type { UserReview } from "../types/reading"; // New import

// Convert API book to favorite book format
export const convertToFavoriteBook = (book: Book): FavoriteBook => {
  return {
    _id: book._id,
    title: book.title,
    author: book.author,
    rating: 4.5, // Default rating since API doesn't provide ratings
    genre: book.category?.name || "Unknown",
    cover: book.cover_image,
    description: book.summary,
    publishedYear: book.details.published_date
      ? new Date(book.details.published_date).getFullYear()
      : undefined,
    pages: book.details.total_pages
      ? Number.parseInt(book.details.total_pages.replace(" pages", ""))
      : undefined,
    language: "Indonesian", // Default language
    isbn: book.details.isbn,
    publisher: book.publisher,
    summary: book.summary,
  };
};

// Convert favorite book back to API book format (for compatibility)
export const convertFromFavoriteBook = (favoriteBook: FavoriteBook): Book => {
  return {
    _id: favoriteBook._id,
    title: favoriteBook.title,
    cover_image: favoriteBook.cover,
    author: favoriteBook.author,
    category: {
      name: favoriteBook.genre,
      url: null,
    },
    summary: favoriteBook.summary || favoriteBook.description,
    details: {
      no_gm: "",
      isbn: favoriteBook.isbn || "",
      price: "",
      total_pages: favoriteBook.pages ? `${favoriteBook.pages} pages` : "",
      size: "",
      published_date: favoriteBook.publishedYear
        ? `${favoriteBook.publishedYear}`
        : "",
      format: "Soft Cover",
    },
    tags: [],
    buy_links: [],
    publisher: favoriteBook.publisher || "",
  };
};

// Extract price number from price string
export const extractPrice = (priceString: string): number => {
  const match = priceString.match(/[\d,]+/);
  if (match) {
    return Number.parseInt(match[0].replace(/,/g, ""));
  }
  return 0;
};

// Format price for display
export const formatPrice = (priceString: string): string => {
  return priceString || "Price not available";
};

// Get book rating (placeholder since API doesn't provide ratings)
// Modified to include user reviews
export const getBookRating = (
  book: Book,
  userReviews: UserReview[] = []
): number => {
  // Generate a consistent base rating based on book ID (for books without user reviews)
  const hash = book._id.split("").reduce((a, b) => {
    a = (a << 5) - a + b.charCodeAt(0);
    return a & a;
  }, 0);
  const baseRating = Math.abs(hash % 11) / 10 + 4; // Rating between 4.0 and 5.0

  const relevantReviews = userReviews.filter(
    (review) => review.bookId === book._id
  );

  if (relevantReviews.length === 0) {
    return baseRating;
  }

  const totalRating = relevantReviews.reduce(
    (sum, review) => sum + review.rating,
    0
  );
  const averageUserRating = totalRating / relevantReviews.length;

  // Combine base rating with user reviews (e.g., 70% user rating, 30% base rating)
  // This is a simple heuristic. You can adjust the weighting.
  return averageUserRating * 0.7 + baseRating * 0.3;
};

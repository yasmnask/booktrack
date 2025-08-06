import type { Book, ApiResponse } from "../types/book";

const BASE_URL = "https://bukuacak-9bdcb4ef2605.herokuapp.com/api/v1";
const ITEMS_PER_PAGE = 15; // Set to 15 books per page as requested

export const bookService = {
  // Get all books with pagination
  async getAllBooks(page = 1): Promise<ApiResponse> {
    try {
      const response = await fetch(
        `${BASE_URL}/book?sort=desc&page=${page}&limit=${ITEMS_PER_PAGE}`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching books:", error);
      throw error;
    }
  },

  // Get book by ID
  async getBookById(id: string): Promise<Book> {
    try {
      const response = await fetch(`${BASE_URL}/book/${id}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching book by ID:", error);
      throw error;
    }
  },

  // Search books
  async searchBooks(keyword: string, page = 1): Promise<ApiResponse> {
    try {
      const response = await fetch(
        `${BASE_URL}/book?keyword=${encodeURIComponent(
          keyword
        )}&page=${page}&limit=${ITEMS_PER_PAGE}`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error searching books:", error);
      throw error;
    }
  },
};

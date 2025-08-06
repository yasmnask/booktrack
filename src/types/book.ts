export interface Author {
  name: string;
  url: string;
}

export interface Category {
  name: string | null;
  url: string | null;
}

export interface BookDetails {
  no_gm: string;
  isbn: string;
  price: string;
  total_pages: string;
  size: string;
  published_date: string;
  format: string;
}

export interface Tag {
  name: string;
  url: string;
}

export interface BuyLink {
  store: string;
  url: string;
}

export interface Book {
  _id: string;
  title: string;
  cover_image: string;
  author: Author;
  category: Category;
  summary: string;
  details: BookDetails;
  tags: Tag[];
  buy_links: BuyLink[];
  publisher: string;
}

export interface ApiResponse {
  books: Book[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export interface Review {
  id: number;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

// For favorites compatibility
export interface FavoriteBook {
  _id: string;
  title: string;
  author: Author;
  rating: number;
  genre: string;
  cover: string;
  description: string;
  publishedYear?: number;
  pages?: number;
  language?: string;
  isbn?: string;
  publisher?: string;
  summary?: string;
}

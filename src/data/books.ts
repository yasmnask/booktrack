export interface Book {
  id: number;
  title: string;
  author: string;
  rating: number;
  genre: string;
  cover: string;
  description: string;
  publishedYear: number;
  pages: number;
  language: string;
  isbn: string;
  publisher: string;
  summary: string;
  reviews: Review[];
}

export interface Review {
  id: number;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

export const allBooks: Book[] = [
  {
    id: 1,
    title: "The Psychology of Money",
    author: "Morgan Housel",
    rating: 4.8,
    genre: "Finance",
    cover: "/placeholder.svg?height=400&width=300&text=Psychology+of+Money",
    description: "Timeless lessons on wealth, greed, and happiness",
    publishedYear: 2020,
    pages: 256,
    language: "English",
    isbn: "978-0857197689",
    publisher: "Harriman House",
    summary:
      "The Psychology of Money is a fascinating look at the strange ways people think about money and teaches you how to make better sense of one of life's most important topics. Doing well with money isn't necessarily about what you know. It's about how you behave. And behavior is hard to teach, even to really smart people.",
    reviews: [
      {
        id: 1,
        userName: "Sarah Johnson",
        rating: 5,
        comment:
          "Buku yang sangat insightful tentang psikologi keuangan. Mengubah cara pandang saya tentang uang.",
        date: "2024-01-15",
      },
      {
        id: 2,
        userName: "Ahmad Rahman",
        rating: 4,
        comment:
          "Penjelasan yang mudah dipahami dengan contoh-contoh yang relevan.",
        date: "2024-01-10",
      },
    ],
  },
  {
    id: 2,
    title: "Atomic Habits",
    author: "James Clear",
    rating: 4.9,
    genre: "Self-Help",
    cover: "/placeholder.svg?height=400&width=300&text=Atomic+Habits",
    description: "An easy & proven way to build good habits",
    publishedYear: 2018,
    pages: 320,
    language: "English",
    isbn: "978-0735211292",
    publisher: "Avery",
    summary:
      "No matter your goals, Atomic Habits offers a proven framework for improving--every day. James Clear, one of the world's leading experts on habit formation, reveals practical strategies that will teach you exactly how to form good habits, break bad ones, and master the tiny behaviors that lead to remarkable results.",
    reviews: [
      {
        id: 1,
        userName: "Lisa Chen",
        rating: 5,
        comment: "Buku terbaik tentang habit formation yang pernah saya baca!",
        date: "2024-01-20",
      },
      {
        id: 2,
        userName: "David Wilson",
        rating: 5,
        comment: "Practical dan actionable. Sudah mengubah hidup saya.",
        date: "2024-01-18",
      },
    ],
  },
  {
    id: 3,
    title: "The Midnight Library",
    author: "Matt Haig",
    rating: 4.6,
    genre: "Fiction",
    cover: "/placeholder.svg?height=400&width=300&text=Midnight+Library",
    description: "A novel about all the choices that go into a life lived",
    publishedYear: 2020,
    pages: 288,
    language: "English",
    isbn: "978-0525559474",
    publisher: "Viking",
    summary:
      "Between life and death there is a library, and within that library, the shelves go on forever. Every book provides a chance to try another life you could have lived. To see how things would be if you had made other choices... Would you have done anything different, if you had the chance to undo your regrets?",
    reviews: [
      {
        id: 1,
        userName: "Emma Thompson",
        rating: 5,
        comment:
          "Cerita yang sangat menyentuh dan philosophical. Membuat saya merenungkan hidup.",
        date: "2024-01-12",
      },
    ],
  },
  {
    id: 4,
    title: "Sapiens",
    author: "Yuval Noah Harari",
    rating: 4.7,
    genre: "History",
    cover: "/placeholder.svg?height=400&width=300&text=Sapiens",
    description: "A brief history of humankind",
    publishedYear: 2011,
    pages: 443,
    language: "English",
    isbn: "978-0062316097",
    publisher: "Harper",
    summary:
      "From a renowned historian comes a groundbreaking narrative of humanity's creation and evolution—a #1 international bestseller—that explores the ways in which biology and history have defined us and enhanced our understanding of what it means to be 'human.'",
    reviews: [
      {
        id: 1,
        userName: "Michael Brown",
        rating: 5,
        comment: "Mind-blowing! Perspektif baru tentang sejarah manusia.",
        date: "2024-01-08",
      },
    ],
  },
  {
    id: 5,
    title: "The Silent Patient",
    author: "Alex Michaelides",
    rating: 4.5,
    genre: "Thriller",
    cover: "/placeholder.svg?height=400&width=300&text=Silent+Patient",
    description: "A psychological thriller about a woman's act of violence",
    publishedYear: 2019,
    pages: 336,
    language: "English",
    isbn: "978-1250301697",
    publisher: "Celadon Books",
    summary:
      "Alicia Berenson's life is seemingly perfect. A famous painter married to an in-demand fashion photographer, she lives in a grand house overlooking a park in one of London's most desirable areas. One evening her husband Gabriel returns home late from a fashion shoot, and Alicia shoots him five times in the face, and then never speaks another word.",
    reviews: [
      {
        id: 1,
        userName: "Jennifer Lee",
        rating: 4,
        comment:
          "Plot twist yang tidak terduga! Thriller yang sangat engaging.",
        date: "2024-01-05",
      },
    ],
  },
  {
    id: 6,
    title: "Educated",
    author: "Tara Westover",
    rating: 4.8,
    genre: "Memoir",
    cover: "/placeholder.svg?height=400&width=300&text=Educated",
    description: "A memoir about education and transformation",
    publishedYear: 2018,
    pages: 334,
    language: "English",
    isbn: "978-0399590504",
    publisher: "Random House",
    summary:
      "Educated is an account of the struggle for self-invention. It is a tale of fierce family loyalty, and of the grief that comes from severing one's closest ties. With the acute insight that distinguishes all great writers, Westover has crafted a universal coming-of-age story that gets to the heart of what an education is and what it offers: the perspective to see one's life through new eyes, and the will to change it.",
    reviews: [
      {
        id: 1,
        userName: "Rachel Green",
        rating: 5,
        comment:
          "Memoir yang sangat powerful dan inspiring. Tidak bisa berhenti membaca!",
        date: "2024-01-03",
      },
    ],
  },
];

export const getBookById = (id: number): Book | undefined => {
  return allBooks.find((book) => book.id === id);
};

export const getBooksByGenre = (genre: string): Book[] => {
  return allBooks.filter((book) => book.genre === genre);
};

export const searchBooks = (query: string): Book[] => {
  const lowercaseQuery = query.toLowerCase();
  return allBooks.filter(
    (book) =>
      book.title.toLowerCase().includes(lowercaseQuery) ||
      book.author.toLowerCase().includes(lowercaseQuery) ||
      book.description.toLowerCase().includes(lowercaseQuery)
  );
};

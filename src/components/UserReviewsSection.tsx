"use client";
import { Star } from "lucide-react";
import { Avatar, AvatarFallback } from "../components/ui/avatar";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";

interface Review {
  id: number;
  userName: string;
  rating: number;
  reviewText: { id: string; en: string };
}

const reviews: Review[] = [
  {
    id: 1,
    userName: "Hendra",
    rating: 5,
    reviewText: {
      id: "Gila sih, aplikasi ini ngebantu banget buat ngatur bacaan. Fitur dark mode-nya bikin mata nyaman, jadi makin semangat baca buku!",
      en: "This app is crazy helpful for organizing my reading. Its dark mode feature is comfortable for my eyes, making me more excited to read!",
    },
  },
  {
    id: 2,
    userName: "Siti Rahmawati",
    rating: 4,
    reviewText: {
      id: "Booktrack ini keren parah! Fitur 'You Might Like'-nya bikin nemu buku baru terus. Rekomen banget buat yang suka baca.",
      en: "Booktrack is super cool! Its 'You Might Like' feature keeps me discovering new books. Highly recommended for book lovers.",
    },
  },
  {
    id: 3,
    userName: "Udin Sarifudin",
    rating: 5,
    reviewText: {
      id: "Mantap jiwa! Desainnya cakep, fiturnya lengkap. Gak bakal nyasar lagi deh nyari buku. Top!",
      en: "Awesome! The design is great, and it's packed with features. I'll never get lost looking for books again. Top-notch!",
    },
  },
];

interface UserReviewsSectionProps {
  isDarkMode: boolean;
  language: "id" | "en";
  title: string;
  subtitle: string;
}

export default function UserReviewsSection({
  isDarkMode,
  language,
  title,
  subtitle,
}: UserReviewsSectionProps) {
  return (
    <section
      className={`w-full py-12 md:py-24 lg:py-32 relative z-40 ${
        isDarkMode ? "bg-gray-700 text-gray-300" : "bg-gray-100 text-gray-700"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2
              className={`text-2xl font-bold tracking-tighter sm:text-5xl ${
                isDarkMode
                  ? " bg-gray-700 text-white"
                  : " bg-gray-100 text-gray-900"
              }`}
            >
              {title}
            </h2>
            <p
              className={`max-w-[900px] md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed ${
                isDarkMode
                  ? " bg-gray-700 text-white"
                  : " bg-gray-100 text-gray-500"
              }`}
            >
              {subtitle}
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl items-start gap-6 py-12 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1">
          {reviews.map((review) => (
            <Card
              key={review.id}
              className={`flex flex-col h-full hover:shadow-lg transition-all duration-300 hover:scale-[1.02] cursor-pointer ${
                isDarkMode
                  ? "border-gray-600 hover:shadow-blue-300"
                  : "border-gray-300"
              }`}
            >
              <CardHeader className="flex flex-row items-center gap-4 pb-4">
                <Avatar className="h-10 w-10">
                  <AvatarFallback
                    className={`text-xl font-bold ${
                      isDarkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {review.userName
                      .split(" ")
                      .map((n: string) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="grid gap-1">
                  <CardTitle
                    className={`text-xl font-semibold ${
                      isDarkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {review.userName}
                  </CardTitle>
                  <div className="flex items-center gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < review.rating
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-400 dark:text-gray-600"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </CardHeader>
              <CardContent
                className={` ${isDarkMode ? "text-white" : "text-gray-800"}`}
              >
                <p className="mb-2 italic">"{review.reviewText[language]}"</p>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400"></p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

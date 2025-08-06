"use client";

import { useMemo } from "react";
import { Book } from "lucide-react";

interface BookParticle {
  id: string;
  top: number;
  left: number;
  rotation: number; // Initial random rotation
  size: number;
}

interface AnimatedBooksProps {
  isDarkMode: boolean;
  scrollFactor: number; // 0 = fully visible, 1 = fully disappeared
  scrollY: number; // Current scroll position
}

const AnimatedBooks = ({
  isDarkMode,
  scrollFactor,
  scrollY,
}: AnimatedBooksProps) => {
  // Memoize book particles to prevent re-generation on every render
  const bookParticles = useMemo(() => {
    const particles: BookParticle[] = [];
    const numberOfBooks = 30; // Adjust as needed

    for (let i = 0; i < numberOfBooks; i++) {
      particles.push({
        id: `book-${i}`,
        top: Math.random() * 100, // % of viewport height
        left: Math.random() * 100, // % of viewport width
        rotation: Math.random() * 360, // degrees
        size: Math.random() * (40 - 20) + 20, // size between 20px and 40px
      });
    }
    return particles;
  }, []);

  // Constants for parallax and rotation speed
  const parallaxSpeed = 0.15; // How fast books move relative to scroll (0.15 means 15% of scroll speed)
  const rotationSpeed = 0.05; // How much books rotate per pixel scrolled

  return (
    <div
      className="fixed inset-0 overflow-hidden pointer-events-none z-10" // z-10 for middle layer
      aria-hidden="true"
      style={{
        transform: `translateY(${scrollY * parallaxSpeed}px)`, // Parallax effect
      }}
    >
      {bookParticles.map((book) => (
        <Book
          key={book.id}
          className={`absolute transition-opacity duration-500 ease-out`} // Only opacity transition here
          style={{
            top: `${book.top}%`,
            left: `${book.left}%`,
            transform: `translate(-50%, -50%) rotate(${
              book.rotation + scrollY * rotationSpeed
            }deg) scale(${1 - scrollFactor})`, // Rotation and scale
            opacity: `${1 - scrollFactor}`,
            color: isDarkMode ? "white" : "black",
            width: `${book.size}px`,
            height: `${book.size}px`,
          }}
        />
      ))}
    </div>
  );
};

export default AnimatedBooks;

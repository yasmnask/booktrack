"use client";

import { useMemo, useEffect, useState } from "react";
import { Book } from "lucide-react";

interface BookParticle {
  id: string;
  top: number;
  left: number;
  rotation: number;
  size: number;

  floatAmplitudeX: number; // Max horizontal movement
  floatAmplitudeY: number; // Max vertical movement
  floatSpeedX: number; // Speed of horizontal float
  floatSpeedY: number; // Speed of vertical float
  animationOffset: number; // To desynchronize animations
}

interface AnimatedBooksProps {
  isDarkMode: boolean;
  scrollFactor: number;
  scrollY: number;
}

const AnimatedBooks = ({
  isDarkMode,
  scrollFactor,
  scrollY,
}: AnimatedBooksProps) => {
  const [time, setTime] = useState(0); // State to drive continuous animation

  // Use requestAnimationFrame for smooth animation updates
  useEffect(() => {
    let animationFrameId: number;
    const animate = (currentTime: DOMHighResTimeStamp) => {
      setTime(currentTime * 0.001); // Convert to seconds for easier calculation
      animationFrameId = requestAnimationFrame(animate);
    };
    animationFrameId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  const bookParticles = useMemo(() => {
    const particles: BookParticle[] = [];
    const numberOfBooks = 30;

    for (let i = 0; i < numberOfBooks; i++) {
      particles.push({
        id: `book-${i}`,
        top: Math.random() * 100, // % of viewport height
        left: Math.random() * 100, // % of viewport width
        rotation: Math.random() * 360, // initial random degrees
        size: Math.random() * (40 - 20) + 20, // size between 20px and 40px
        floatAmplitudeX: Math.random() * (50 - 15) + 15, // 15 to 50px
        floatAmplitudeY: Math.random() * (40 - 10) + 10, // 10 to 40px
        floatSpeedX: Math.random() * (0.2 - 0.08) + 0.08, // 0.08 to 0.2
        floatSpeedY: Math.random() * (0.25 - 0.1) + 0.1, // 0.1 to 0.25
        animationOffset: Math.random() * Math.PI * 2,
      });
    }
    return particles;
  }, []);

  // Constants for parallax and rotation speed
  const parallaxSpeed = 0.45; // How fast books move relative to scroll
  const rotationSpeed = 0.002; // radians per second (bisa kamu adjust sendiri)

  return (
    <div
      className="fixed inset-0 overflow-hidden pointer-events-none z-10" // z-10 for middle layer
      aria-hidden="true"
      style={{
        transform: `translateY(${scrollY * parallaxSpeed}px)`, // Parallax effect for the container
      }}
    >
      {bookParticles.map((book) => {
        const floatX =
          Math.sin(time * book.floatSpeedX + book.animationOffset) *
          book.floatAmplitudeX;
        const floatY =
          Math.cos(time * book.floatSpeedY + book.animationOffset) *
          book.floatAmplitudeY;
        const rotationAngle =
          book.rotation + ((time * rotationSpeed * 180) % 360);

        return (
          <Book
            key={book.id}
            className={`absolute transition-opacity duration-500 ease-out`}
            style={{
              top: `${book.top}%`,
              left: `${book.left}%`,
              // Combined transforms: translate(-50%, -50%) for centering, then rotation, scale, and dynamic float
              transform: `translate(-50%, -50%) rotate(${rotationAngle}deg) scale(${
                1 - scrollFactor
              }) translateX(${floatX}px) translateY(${floatY}px)`,
              opacity: `${1 - scrollFactor}`, // Disappearance based on scroll
              color: isDarkMode ? "white" : "black",
              width: `${book.size}px`,
              height: `${book.size}px`,
            }}
          />
        );
      })}
    </div>
  );
};

export default AnimatedBooks;

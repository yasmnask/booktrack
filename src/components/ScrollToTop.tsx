"use client";

import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Scroll to top when route changes
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth", // Optional: smooth scrolling
    });
  }, [pathname]);

  return null;
};

export default ScrollToTop;

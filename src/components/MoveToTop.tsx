"use client";

import { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react";

export function MoveToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);

    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  if (!isVisible) {
    return null;
  }

  return (
    <button
      onClick={scrollToTop}
      className="fixed bottom-8 right-8 bg-brand-primary text-white p-1 rounded-full shadow-lg hover:opacity-90 transition-opacity z-50"
      aria-label="回到頂部"
    >
      <ArrowUp className="w-6 h-6" />
    </button>
  );
}

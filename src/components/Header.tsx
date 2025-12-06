"use client";

import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { useState } from "react";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { href: "/about", label: "About Us" },
    { href: "/forum", label: "Forum" },
    { href: "/contact", label: "Contact Us" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-neutral-100 shadow-sm">
      <nav className="max-w-7xl mx-auto px-4 py-2 md:px-6 md:py-1">
        <div className="flex items-center justify-between">
          {/* Logo - 左侧 */}
          <div className="relative md:absolute md:left-10">
            <Link href="/">
              <Image
                src="/R.collective logo.png"
                alt="R.co Logo"
                width={200}
                height={120}
                className="h-10 w-auto md:h-16"
                priority
              />
            </Link>
          </div>

          {/* Navigation Links - 居中 (桌機版) */}
          <div className="hidden md:flex items-center gap-12 flex-1 justify-center">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-neutral-300 hover:text-brand-primary transition-colors duration-200 text-lg font-light"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* 漢堡選單按鈕 (手機版) */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-neutral-900 hover:text-brand-primary transition-colors"
            aria-label={isMenuOpen ? "關閉選單" : "開啟選單"}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu - 可收縮 */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            isMenuOpen ? "max-h-60 opacity-100 mt-4" : "max-h-0 opacity-0"
          }`}
        >
          <div className="flex flex-col gap-1 pb-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMenuOpen(false)}
                className="text-neutral-300 hover:text-brand-primary hover:bg-neutral-50 transition-colors py-3 px-2 rounded-lg"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </nav>
    </header>
  );
}

"use client";

import Link from "next/link";
import Image from "next/image";
import { Search } from "lucide-react";
import { useState } from "react";

export function Header() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const navLinks = [
    { href: "/about", label: "About Us" },
    { href: "/forum", label: "Forum" },
    { href: "/contact", label: "Contact Us" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-neutral-100 shadow-sm">
      <nav className="max-w-7xl mx-auto px-6 py-1">
        <div className="flex items-center">
          {/* Logo - 左侧 */}
          <div className="absolute left-10">
            <Link href="/" >
              <Image
                src="/R.coLogo.png"
                alt="R.co Logo"
                width={80}
                height={30}
                className="h-8 w-auto"
                priority
              />
            </Link>
          </div>

          {/* Navigation Links - 居中 */}
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

        </div>

        {/* Mobile Menu */}
        <div className="md:hidden mt-4 flex flex-col gap-3">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-neutral-300 hover:text-brand-primary transition-colors py-2"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Search Bar (expandable) */}
        {/* {isSearchOpen && (
          <div className="mt-4 animate-in slide-in-from-top">
            <input
              type="search"
              placeholder="搜尋..."
              className="w-full px-4 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent"
              autoFocus
            />
          </div>
        )} */}
      </nav>
    </header>
  );
}

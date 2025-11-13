"use client";

import Link from "next/link";
import Image from "next/image";
import { Mail, Instagram, Facebook } from "lucide-react";

export function Footer() {
  const navLinks = [
    { href: "/about", label: "About Us" },
    { href: "/forum", label: "Forum" },
    { href: "/contact", label: "Contact Us" },
  ];

  const socialLinks = [
    { href: "mailto:contact@rco.com", icon: Mail, label: "Email" },
    { href: "https://instagram.com", icon: Instagram, label: "Instagram" },
    { href: "https://facebook.com", icon: Facebook, label: "Facebook" },
  ];

  return (
    <footer className="w-full bg-black">
      {/* 主要內容區 */}
      <div className="mx-auto max-w-[1680px] px-6 py-8 md:px-12 md:py-10">
        <div className="flex flex-col items-center justify-between gap-8 md:flex-row">
          {/* 左側：Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="block">
              <div className="relative h-16 w-32">
                <Image
                  src="/R.coLogo.png"
                  alt="R.co"
                  fill
                  className="object-contain brightness-0 invert"
                  priority
                />
              </div>
            </Link>
          </div>

          {/* 右側：導航與社交媒體 */}
          <div className="flex flex-col items-center gap-6 md:items-end">
            {/* 導航鏈接 */}
            <nav className="flex items-center gap-6 text-white">
              {navLinks.map((link, index) => (
                <div key={link.href} className="flex items-center gap-6">
                  <Link
                    href={link.href}
                    className="text-base transition-colors hover:text-brand-primary md:text-lg"
                  >
                    {link.label}
                  </Link>
                  {index < navLinks.length - 1 && (
                    <span className="text-neutral-300">|</span>
                  )}
                </div>
              ))}
            </nav>

            {/* 社交媒體圖標 */}
            <div className="flex items-center gap-4">
              {socialLinks.map((social) => (
                <Link
                  key={social.href}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white transition-colors hover:text-brand-primary"
                  aria-label={social.label}
                >
                  <social.icon className="h-6 w-6" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 版權資訊 */}
      <div className="w-full bg-neutral-300 py-4">
        <p className="text-center text-sm text-white">
          版權所有 Copyright © 2020 All Right Reserved by R.co
        </p>
      </div>
    </footer>
  );
}

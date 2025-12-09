"use client";
import { useState } from "react";
import { Menu, X, ChevronDown, ChevronRight } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export const Sidebar = () => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(true);
  const [sectionsOpen, setSectionsOpen] = useState(true);
  const [pagesOpen, setPagesOpen] = useState(true);

  const sectionLinks = [
    { href: "/admin/section1", label: "主視覺區" },
    { href: "/admin/marquee", label: "品牌輪播" },
    { href: "/admin/section7", label: "立足台灣" },
    { href: "/admin/section2", label: "團隊成員" },
    { href: "/admin/section3", label: "空間探索" },
    { href: "/admin/section4", label: "客戶見證" },
    { href: "/admin/section6", label: "FAQ 問答" },
  ];

  const pageLinks = [
    { href: "/admin/about", label: "關於我們" },
    { href: "/admin/contact", label: "聯絡我們" },
    { href: "/admin/contact-messages", label: "客戶訊息" },
  ];

  return (
    <div className="flex flex-col h-full">
      <div
        className={`bg-gray-800 text-white ${
          isOpen ? "w-[256px] min-w-[256px] max-w-[256px]" : "w-16"
        } flex-1 transition-all h-full flex flex-col`}
      >
        <div className="flex items-center justify-end p-4 flex-shrink-0">
          <button onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
        {isOpen && (
          <nav className="mt-4 space-y-1 overflow-y-auto flex-1">
            {/* 首頁區塊管理 */}
            <div>
              <button
                onClick={() => setSectionsOpen(!sectionsOpen)}
                className="w-full flex items-center justify-between px-4 py-2 hover:bg-gray-700 text-left"
              >
                <span>首頁區塊管理</span>
                {sectionsOpen ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
              </button>
              {sectionsOpen && (
                <div className="ml-4 space-y-1">
                  {sectionLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={`block px-4 py-2 hover:bg-gray-700 text-sm ${
                        pathname === link.href ? "bg-gray-700 border-l-2 border-blue-400" : ""
                      }`}
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <div className="border-t border-gray-700 my-4"></div>

            {/* 其他頁面管理 */}
            <div>
              <button
                onClick={() => setPagesOpen(!pagesOpen)}
                className="w-full flex items-center justify-between px-4 py-2 hover:bg-gray-700 text-left"
              >
                <span>其他頁面管理</span>
                {pagesOpen ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
              </button>
              {pagesOpen && (
                <div className="ml-4 space-y-1">
                  {pageLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={`block px-4 py-2 hover:bg-gray-700 text-sm ${
                        pathname === link.href ? "bg-gray-700 border-l-2 border-blue-400" : ""
                      }`}
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <div className="border-t border-gray-700 my-4"></div>

            {/* 論壇管理 */}
            <Link
              href="/admin/forum-categories"
              className={`block px-4 py-2 hover:bg-gray-700 ${
                pathname === "/admin/forum-categories" ? "bg-gray-700" : ""
              }`}
            >
              論壇分類
            </Link>
            <Link
              href="/admin/forum-posts"
              className={`block px-4 py-2 hover:bg-gray-700 ${
                pathname === "/admin/forum-posts" ? "bg-gray-700" : ""
              }`}
            >
              論壇文章
            </Link>
            <Link
              href="/admin/forum-new"
              className={`block px-4 py-2 hover:bg-gray-700 ${
                pathname === "/admin/forum-new" ? "bg-gray-700" : ""
              }`}
            >
              新增文章
            </Link>
          </nav>
        )}
      </div>
    </div>
  );
};

"use client";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export const Sidebar = () => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="flex flex-col">
      <div
        className={`bg-gray-800 text-white ${
          isOpen ? "w-64" : "w-16"
        } flex-1  transition-all min-h-screen`}
      >
        <div className="flex items-center justify-end p-4">
          <button onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
        {isOpen && (
          <nav className="mt-4 space-y-2">
            <Link
              href="/admin/home-page"
              className={`block px-4 py-2 hover:bg-gray-700 ${
                pathname === "/admin/home-page" ? "bg-gray-700" : ""
              }`}
            >
              首頁內容
            </Link>
            <div className="border-t border-gray-700 my-4"></div>
            <Link
              href="/admin/logo"
              className={`block px-4 py-2 hover:bg-gray-700 ${
                pathname === "/admin/logo" ? "bg-gray-700" : ""
              }`}
            >
              Logo 設定
            </Link>
            <Link
              href="/admin/color"
              className={`block px-4 py-2 hover:bg-gray-700 ${
                pathname === "/admin/color" ? "bg-gray-700" : ""
              }`}
            >
              顏色配置
            </Link>
          </nav>
        )}
      </div>
    </div>
  );
};

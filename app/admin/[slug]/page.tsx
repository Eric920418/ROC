"use client";

import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Sidebar } from "@/components/Admin/Sidebar";
import { HomePage } from "@/components/Edit/HomePage";
import { Logo } from "@/components/Edit/Logo";
import { Color } from "@/components/Edit/Color";
import { ForumCategories } from "@/components/Edit/ForumCategories";
import { ForumPosts } from "@/components/Edit/ForumPosts";
import { useEffect } from "react";

export default function AdminPage() {
  const params = useParams();
  const { slug } = params;
  const router = useRouter();
  const { data: session, status } = useSession();

  const EditPages = [
    { slug: "home-page", component: <HomePage /> },
    { slug: "logo", component: <Logo /> },
    { slug: "color", component: <Color /> },
    { slug: "forum-categories", component: <ForumCategories /> },
    { slug: "forum-posts", component: <ForumPosts /> },
  ];

  useEffect(() => {
    // 如果未登入，重定向到登入頁面
    if (status === "unauthenticated") {
      router.replace("/admin/login");
    }
  }, [status, router]);

  // 顯示載入狀態
  if (status === "loading") {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // 如果未登入，不渲染任何內容（等待重定向）
  if (!session) {
    return null;
  }

  // 找到對應的頁面組件
  const currentPage = EditPages.find((page) => page.slug === slug);
  if (!currentPage) {
    return <div>頁面不存在</div>;
  }

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 p-10 overflow-auto">{currentPage.component}</div>
    </div>
  );
}

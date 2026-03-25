"use client";

import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Sidebar } from "@/components/Admin/Sidebar";
import { ForumCategories } from "@/components/Edit/ForumCategories";
import { ForumPosts } from "@/components/Edit/ForumPosts";
import { ForumNewPost } from "@/components/Edit/ForumNewPost";
import { Section1Edit } from "@/components/Edit/Section1Edit";
import { MarqueeEdit } from "@/components/Edit/MarqueeEdit";
import { Section2Edit } from "@/components/Edit/Section2Edit";
import { Section3Edit } from "@/components/Edit/Section3Edit";
import { Section4Edit } from "@/components/Edit/Section4Edit";
import { Section6Edit } from "@/components/Edit/Section6Edit";
import { Section7Edit } from "@/components/Edit/Section7Edit";
import { AboutEdit } from "@/components/Edit/AboutEdit";
import { ContactEdit } from "@/components/Edit/ContactEdit";
import { ContactMessages } from "@/components/Edit/ContactMessages";
import { VideoHeroEdit } from "@/components/Edit/VideoHeroEdit";
import { MasonryEdit } from "@/components/Edit/MasonryEdit";
import { useEffect } from "react";

export default function AdminPage() {
  const params = useParams();
  const { slug } = params;
  const router = useRouter();
  const { data: session, status } = useSession();

  const EditPages = [
    // 首頁區塊
    { slug: "video-hero", component: <VideoHeroEdit /> },
    { slug: "section1", component: <Section1Edit /> },
    { slug: "marquee", component: <MarqueeEdit /> },
    { slug: "section7", component: <Section7Edit /> },
    { slug: "section2", component: <Section2Edit /> },
    { slug: "section3", component: <Section3Edit /> },
    { slug: "masonry", component: <MasonryEdit /> },
    { slug: "section4", component: <Section4Edit /> },
    { slug: "section6", component: <Section6Edit /> },
    // 其他頁面
    { slug: "about", component: <AboutEdit /> },
    { slug: "contact", component: <ContactEdit /> },
    { slug: "contact-messages", component: <ContactMessages /> },
    // 論壇管理
    { slug: "forum-categories", component: <ForumCategories /> },
    { slug: "forum-posts", component: <ForumPosts /> },
    { slug: "forum-new", component: <ForumNewPost /> },
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
    <div className="flex h-screen bg-white">
      <Sidebar />
      <div className="flex-1 p-10 overflow-auto">{currentPage.component}</div>
    </div>
  );
}

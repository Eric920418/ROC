"use client";
import { usePathname } from "next/navigation";
import { useModalContext } from "@/components/ModalContext";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { MoveToTop } from "@/components/MoveToTop";

export default function ClientLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isModalOpen } = useModalContext();
  const pathname = usePathname();
  const isAdminPage = pathname.startsWith("/admin");

  return (
    <>
      {!isAdminPage && !isModalOpen && <Header />}
      {children}
      {!isAdminPage && !isModalOpen && <Footer />}
      {!isAdminPage && !isModalOpen && <MoveToTop />}
    </>
  );
}

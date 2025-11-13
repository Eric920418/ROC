"use client";

import { SessionProvider } from "next-auth/react";
import { ModalProvider } from "@/components/ModalContext";
import ClientLayoutWrapper from "@/components/ClientLayoutWrapper";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ModalProvider>
        <ClientLayoutWrapper>{children}</ClientLayoutWrapper>
      </ModalProvider>
    </SessionProvider>
  );
}

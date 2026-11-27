"use client";

import { usePathname } from "next/navigation";
import { Sidebar } from "@/components/sidebar";

export function AppShell({ children }: { children: React.ReactNode }) {
  const isLoginPage = usePathname() === "/login";

  return (
    <div className="flex min-h-screen">
      {!isLoginPage && <Sidebar />}
      <main className={isLoginPage ? "min-h-screen flex-1" : "ml-64 min-h-screen flex-1"}>
        {children}
      </main>
    </div>
  );
}

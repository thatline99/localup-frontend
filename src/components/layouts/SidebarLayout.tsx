"use client";
import { ReactNode, useState } from "react";
import Link from "next/link";

interface SidebarLayoutProps {
  sidebar: ReactNode;
  header?: ReactNode;
  children: ReactNode;
}

export default function SidebarLayout({
  sidebar,
  header,
  children,
}: SidebarLayoutProps) {
  const [open, setOpen] = useState(true);

  return (
    <div className="flex min-h-screen">
      {open && (
        <aside className="w-64 border-r bg-background p-4">{sidebar}</aside>
      )}
      <div className="flex flex-1 flex-col">
        <header className="flex items-center justify-between border-b p-4">
          <div className="flex items-center gap-2">
            {header}
            <button
              type="button"
              className="rounded border px-2 py-1"
              onClick={() => setOpen((prev) => !prev)}
            >
              {open ? "닫기" : "열기"}
            </button>
          </div>
          <Link href="/sign-in" className="text-sm font-medium underline">
            로그인
          </Link>
        </header>
        <main className="flex-1 p-4">{children}</main>
      </div>
    </div>
  );
}

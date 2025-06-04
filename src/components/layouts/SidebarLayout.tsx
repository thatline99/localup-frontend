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
  const [open, setOpen] = useState(false);

  return (
    <div className="flex min-h-screen overflow-x-hidden">
      {open && (
        <div
          className="fixed inset-0 z-10 bg-black/50 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-20 w-64 border-r bg-background p-4 transition-transform duration-300 ${open ? "translate-x-0" : "-translate-x-full"} md:static md:translate-x-0`}
      >
        <div className="mb-4 flex items-center justify-between md:hidden">
          {sidebar}
          <button
            type="button"
            className="rounded border px-2 py-1"
            onClick={() => setOpen(false)}
          >
            닫기
          </button>
        </div>
        <div className="hidden md:block">{sidebar}</div>
      </aside>
      <div className="flex flex-1 flex-col">
        <header className="flex items-center justify-between border-b p-4">
          <div className="flex items-center gap-2">
            {header}
            <button
              type="button"
              className="rounded border px-2 py-1 md:hidden"
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

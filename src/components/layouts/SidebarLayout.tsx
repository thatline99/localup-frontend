import { ReactNode } from "react";

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
  return (
    <div className="flex min-h-screen">
      <aside className="w-64 border-r bg-background p-4">{sidebar}</aside>
      <div className="flex flex-1 flex-col">
        {header && <header className="border-b p-4">{header}</header>}
        <main className="flex-1 p-4">{children}</main>
      </div>
    </div>
  );
}

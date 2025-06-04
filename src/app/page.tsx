import SidebarLayout from "@/components/layouts/SidebarLayout";

export default function Home() {
  return (
    <SidebarLayout
      sidebar={<nav className="p-2">Sidebar</nav>}
      header={<h1 className="text-xl font-semibold">Header</h1>}
    >
      <div className="flex h-full items-center justify-center">
        <p className="text-4xl font-bold">홈페이지 Develop 2</p>
      </div>
    </SidebarLayout>
  );
}

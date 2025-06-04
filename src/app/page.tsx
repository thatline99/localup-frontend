import SidebarLayout from "@/components/layouts/SidebarLayout";
import AdCarousel from "@/components/AdCarousel";
import Header from "@/components/Header";
import GraphExample from "@/components/GraphExample";

const images = [
  "https://via.placeholder.com/800x200?text=Ad+1",
  "https://via.placeholder.com/800x200?text=Ad+2",
  "https://via.placeholder.com/800x200?text=Ad+3",
];

export default function Home() {
  return (
    <SidebarLayout
      sidebar={<nav className="p-2">Sidebar</nav>}
      header={<Header />}
    >
      <AdCarousel images={images} />
      <div className="mt-4 grid grid-cols-12 gap-4">
        <div className="col-span-4">
          <div className="rounded border p-4 text-center">날씨 예시</div>
        </div>
        <div className="col-span-8 space-y-4">
          <GraphExample />
          <GraphExample />
        </div>
      </div>
    </SidebarLayout>
  );
}

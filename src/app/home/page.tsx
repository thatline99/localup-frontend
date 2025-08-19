import SidebarLayout from "@/components/layouts/SidebarLayout";
import AdCarousel from "@/components/AdCarousel";
import Header from "@/components/Header";
import {auth} from '@/auth'
import { redirect } from "next/navigation";

const images = [
  "https://via.placeholder.com/800x200?text=Ad+1",
  "https://via.placeholder.com/800x200?text=Ad+2",
  "https://via.placeholder.com/800x200?text=Ad+3",
];

export default async function Home() {
  const session = await auth();
  if(!session) redirect('/')
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
        <div className="col-span-8">
          <div className="rounded border p-4 text-center">그래프 예시</div>
        </div>
      </div>
    </SidebarLayout>
  );
}

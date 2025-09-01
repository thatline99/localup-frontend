"use client";

import { PageLayout } from "@/components/dashboard/PageLayout";

export default function DashboardPage() {
  return (
    <PageLayout title="대시보드" description="">
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-gray-500">대시보드 콘텐츠가 여기에 표시됩니다.</p>
      </div>
    </PageLayout>
  );
}
"use client";

import { PageLayout } from "@/components/dashboard/PageLayout";
import { BusinessMetrics } from "@/components/dashboard/BusinessMetrics";
import { WeatherWidget } from "@/components/dashboard/WeatherWidget";
import { EventsWidget } from "@/components/dashboard/EventsWidget";

export default function DashboardPage() {
  return (
    <PageLayout 
      title="대시보드" 
      description="오늘의 비즈니스 현황을 한눈에 확인하세요"
    >
      <div className="space-y-6">
        {/* 비즈니스 메트릭 카드들 */}
        <div>
          <h2 className="text-lg font-semibold text-neutral-900 mb-4">
            📊 비즈니스 예측
          </h2>
          <BusinessMetrics />
        </div>

        {/* 날씨와 이벤트 위젯 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <WeatherWidget />
          </div>
          
          <div>
            <EventsWidget />
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
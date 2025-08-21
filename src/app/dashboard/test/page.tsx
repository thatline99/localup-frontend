"use client";

import { MetricCard } from "@/components/dashboard/MetricCard";
import { WeatherWidget } from "@/components/dashboard/WeatherWidget";
import { EventsWidget } from "@/components/dashboard/EventsWidget";
import { TrendsWidget } from "@/components/dashboard/TrendsWidget";
import { ReviewsWidget } from "@/components/dashboard/ReviewsWidget";
import { CompetitorsWidget } from "@/components/dashboard/CompetitorsWidget";
import { AIRecommendations } from "@/components/dashboard/AIRecommendations";
import { PageLayout } from "@/components/dashboard/PageLayout";
import { useEffect, useState } from "react";
import { getDashboardTest } from "@/app/lib/api/dashboard/dashboard";
import type { SigunguEventWithDates } from "@/types/dashboard/sigunguEventWithDates";
import MainEventCard from "@/components/dashboard/MainEventCard";

export default function DashboardPage() {
  const [event, setEvent] = useState<SigunguEventWithDates | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await getDashboardTest("11110");
        if (res.code !== "SUCCESS" || !res.data) {
          throw new Error(res.message || "Invalid response");
        }
        setEvent(res.data);
      } catch (e: any) {
        setErr(e?.message ?? "Failed to load");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <PageLayout
      title="대시보드"
      description="오늘의 비즈니스 현황을 한눈에 확인하세요"
    >
      {/* ✅ 메인 이벤트 카드 (분리 적용) */}
      <MainEventCard event={event} loading={loading} err={err} />

      {/* 주요 지표 */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="오늘 예상 방문객"
          value="342"
          change={23}
          trend="up"
          icon={
            <svg
              className="h-8 w-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
          }
        />
        <MetricCard
          title="현재 대기 시간"
          value="15분"
          change={-5}
          trend="down"
          subtitle="평균 대비"
          icon={
            <svg
              className="h-8 w-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          }
        />
        <MetricCard
          title="오늘 매출"
          value="3.2M"
          change={15}
          trend="up"
          subtitle="전일 대비"
          icon={
            <svg
              className="h-8 w-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          }
        />
        <MetricCard
          title="리뷰 평점"
          value="4.8"
          change={0.2}
          trend="up"
          subtitle="이번 달"
          icon={
            <svg
              className="h-8 w-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674z"
              />
            </svg>
          }
        />
      </div>

      {/* 위젯 그리드 */}
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6">
          <WeatherWidget />
          <EventsWidget />
        </div>
        <div className="space-y-6">
          <TrendsWidget />
          <ReviewsWidget />
        </div>
        <div className="space-y-6">
          <AIRecommendations />
          <CompetitorsWidget />
        </div>
      </div>
    </PageLayout>
  );
}

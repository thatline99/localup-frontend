'use client';

import { useEffect, useState } from 'react';
import { MetricCard } from './MetricCard';
import { getShortTermForecast } from '@/app/lib/api/dashboard/dashboard';
import useUserStore from '@/store/userStore';

interface BusinessMetric {
  value: number;
  change: number;
  trend: 'up' | 'down' | 'stable';
  confidence: number;
}

interface MetricsData {
  todayRevenue: BusinessMetric;
  todayVisitors: BusinessMetric;
  tomorrowRevenue: BusinessMetric;
  tomorrowVisitors: BusinessMetric;
}

export const BusinessMetrics = () => {
  const [metrics, setMetrics] = useState<MetricsData | null>(null);
  const [loading, setLoading] = useState(true);
  const { businessInfo } = useUserStore();

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        // 날씨 데이터 가져오기
        const weatherResponse = await getShortTermForecast();
        
        // 비즈니스 메트릭 예측 API 호출
        const response = await fetch('/api/ai/business-metrics', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            weatherData: weatherResponse.data?.shortTermForecasts,
            businessInfo,
            historicalData: {
              averageRevenue: 3500000, // 임시 데이터
              averageVisitors: 150,
              peakHours: [12, 13, 18, 19, 20]
            }
          }),
          credentials: 'include'
        });

        if (response.ok) {
          const data = await response.json();
          setMetrics({
            todayRevenue: data.todayRevenue,
            todayVisitors: data.todayVisitors,
            tomorrowRevenue: data.tomorrowRevenue,
            tomorrowVisitors: data.tomorrowVisitors
          });
        }
      } catch (error) {
        console.error('메트릭 데이터 로드 실패:', error);
        // 기본값 설정
        setMetrics({
          todayRevenue: { value: 3500000, change: 0, trend: 'stable', confidence: 0.5 },
          todayVisitors: { value: 150, change: 0, trend: 'stable', confidence: 0.5 },
          tomorrowRevenue: { value: 3500000, change: 0, trend: 'stable', confidence: 0.5 },
          tomorrowVisitors: { value: 150, change: 0, trend: 'stable', confidence: 0.5 }
        });
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, [businessInfo]);

  const formatRevenue = (value: number) => {
    if (value >= 10000000) {
      return `${(value / 10000000).toFixed(1)}천만원`;
    } else if (value >= 10000) {
      return `${(value / 10000).toFixed(0)}만원`;
    }
    return `${value.toLocaleString()}원`;
  };

  const formatVisitors = (value: number) => {
    return `${Math.round(value).toLocaleString()}명`;
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="animate-pulse">
            <div className="bg-gray-200 rounded-lg h-32"></div>
          </div>
        ))}
      </div>
    );
  }

  if (!metrics) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <MetricCard
        title="오늘 예상 매출"
        value={formatRevenue(metrics.todayRevenue.value)}
        change={metrics.todayRevenue.change}
        trend={metrics.todayRevenue.trend === 'up' ? 'up' : 'down'}
        subtitle="전일 대비"
        icon={
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        }
      />
      
      <MetricCard
        title="오늘 예상 방문객"
        value={formatVisitors(metrics.todayVisitors.value)}
        change={metrics.todayVisitors.change}
        trend={metrics.todayVisitors.trend === 'up' ? 'up' : 'down'}
        subtitle="전일 대비"
        icon={
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        }
      />
      
      <MetricCard
        title="내일 예상 매출"
        value={formatRevenue(metrics.tomorrowRevenue.value)}
        change={metrics.tomorrowRevenue.change}
        trend={metrics.tomorrowRevenue.trend === 'up' ? 'up' : 'down'}
        subtitle="오늘 대비"
        icon={
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
        }
      />
      
      <MetricCard
        title="내일 예상 방문객"
        value={formatVisitors(metrics.tomorrowVisitors.value)}
        change={metrics.tomorrowVisitors.change}
        trend={metrics.tomorrowVisitors.trend === 'up' ? 'up' : 'down'}
        subtitle="오늘 대비"
        icon={
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
          </svg>
        }
      />
    </div>
  );
};
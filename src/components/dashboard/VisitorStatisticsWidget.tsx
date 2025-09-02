'use client';

import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui';
import { getVisitorStatistics } from '@/app/lib/api/dashboard/dashboard';
import { VisitorStatisticsInformation } from '@/types/dashboard/getVisitorStatisticsResponse';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

export const VisitorStatisticsWidget = () => {
  const [visitorData, setVisitorData] = useState<VisitorStatisticsInformation | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVisitorData = async () => {
      try {
        // 작년 동기 일주일 날짜 계산
        const today = new Date();
        const lastYear = new Date(today);
        lastYear.setFullYear(today.getFullYear() - 1);

        // 일주일 전부터 오늘까지
        const startDate = new Date(lastYear);
        startDate.setDate(lastYear.getDate() - 6);

        const formatDate = (date: Date) => {
          const year = date.getFullYear();
          const month = String(date.getMonth() + 1).padStart(2, '0');
          const day = String(date.getDate()).padStart(2, '0');
          return `${year}-${month}-${day}`;
        };

        const response = await getVisitorStatistics(
          formatDate(startDate),
          formatDate(lastYear)
        );

        if (response.code === 'SUCCESS' && response.data) {
          setVisitorData(response.data);
        }
      } catch (error) {
        console.error('방문객 통계 데이터 로드 실패:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchVisitorData();
  }, []);

  const formatChartData = () => {
    if (!visitorData?.visitorStatistics) return [];

    return visitorData.visitorStatistics.map(stat => ({
      date: stat.date.slice(5), // MM-DD 형식으로 표시
      지역: stat.localVisitors || stat.localVisitorCount || 0,
      국내: stat.domesticVisitors || stat.domesticVisitorCount || 0,
      해외: stat.foreignVisitors || stat.foreignVisitorCount || 0,
      총합: (stat.localVisitors || stat.localVisitorCount || 0) + 
            (stat.domesticVisitors || stat.domesticVisitorCount || 0) + 
            (stat.foreignVisitors || stat.foreignVisitorCount || 0)
    }));
  };

  const formatNumber = (num: number | undefined | null) => {
    if (num === undefined || num === null) return '0';
    return num.toLocaleString('ko-KR');
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>작년 동기 방문객 통계</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center">
            <div className="animate-pulse text-neutral-500">
              데이터를 불러오는 중...
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!visitorData || !visitorData.visitorStatistics?.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>작년 동기 방문객 통계</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center text-neutral-500">
            방문객 통계 데이터를 불러올 수 없습니다
          </div>
        </CardContent>
      </Card>
    );
  }

  const lastDayStats = visitorData.visitorStatistics?.[visitorData.visitorStatistics.length - 1];
  const chartData = formatChartData();

  return (
    <Card>
      <CardHeader>
        <CardTitle>작년 동기 방문객 통계</CardTitle>
      </CardHeader>
      <CardContent>
        {/* 요약 통계 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600">
              {formatNumber(lastDayStats?.localVisitors || lastDayStats?.localVisitorCount)}
            </p>
            <p className="text-sm text-neutral-600">지역 방문객</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">
              {formatNumber(lastDayStats?.domesticVisitors || lastDayStats?.domesticVisitorCount)}
            </p>
            <p className="text-sm text-neutral-600">국내 방문객</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-purple-600">
              {formatNumber(lastDayStats?.foreignVisitors || lastDayStats?.foreignVisitorCount)}
            </p>
            <p className="text-sm text-neutral-600">해외 방문객</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-neutral-900">
              {formatNumber(
                (lastDayStats?.localVisitors || lastDayStats?.localVisitorCount || 0) +
                (lastDayStats?.domesticVisitors || lastDayStats?.domesticVisitorCount || 0) +
                (lastDayStats?.foreignVisitors || lastDayStats?.foreignVisitorCount || 0)
              )}
            </p>
            <p className="text-sm text-neutral-600">총 방문객</p>
          </div>
        </div>

        {/* 차트 */}
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 12 }}
                stroke="#6b7280"
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                stroke="#6b7280"
                tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px'
                }}
                formatter={(value: number) => formatNumber(value)}
              />
              <Legend 
                wrapperStyle={{ fontSize: '12px' }}
              />
              <Line 
                type="monotone" 
                dataKey="지역" 
                stroke="#3b82f6" 
                strokeWidth={2}
                dot={{ r: 3 }}
                activeDot={{ r: 5 }}
              />
              <Line 
                type="monotone" 
                dataKey="국내" 
                stroke="#10b981" 
                strokeWidth={2}
                dot={{ r: 3 }}
                activeDot={{ r: 5 }}
              />
              <Line 
                type="monotone" 
                dataKey="해외" 
                stroke="#8b5cf6" 
                strokeWidth={2}
                dot={{ r: 3 }}
                activeDot={{ r: 5 }}
              />
              <Line 
                type="monotone" 
                dataKey="총합" 
                stroke="#111827" 
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={{ r: 3 }}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

      </CardContent>
    </Card>
  );
};
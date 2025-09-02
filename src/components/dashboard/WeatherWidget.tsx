'use client';

import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui';
import { getShortTermForecast } from '@/app/lib/api/dashboard/dashboard';
import { ShortTermForecast } from '@/types/dashboard/getShortTermForecastResponse';
import useUserStore from '@/store/userStore';

export const WeatherWidget = () => {
  const [weatherData, setWeatherData] = useState<ShortTermForecast[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [weatherInsight, setWeatherInsight] = useState<string | null>(null);
  const { businessInfo } = useUserStore();

  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        const response = await getShortTermForecast();
        if (response.code === 'SUCCESS' && response.data) {
          setWeatherData(response.data.shortTermForecasts);
          
          // AI 인사이트 요청
          if (businessInfo) {
            fetchWeatherInsight(response.data.shortTermForecasts);
          }
        }
      } catch (error) {
        console.error('날씨 데이터 로드 실패:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchWeatherData();
  }, [businessInfo]);

  const fetchWeatherInsight = async (forecasts: ShortTermForecast[]) => {
    try {
      const response = await fetch('/api/ai/weather-insight', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          forecasts: forecasts.slice(0, 4),
          businessInfo 
        }),
        credentials: 'include'
      });

      if (response.ok) {
        const data = await response.json();
        setWeatherInsight(data.insight);
      }
    } catch (error) {
      console.error('날씨 인사이트 생성 실패:', error);
    }
  };

  const getWeatherIcon = (condition: string | null) => {
    switch (condition) {
      case 'SUNNY': return '☀️';
      case 'PARTLY_CLOUDY': return '⛅';
      case 'CLOUDY': return '☁️';
      default: return '🌤️';
    }
  };

  const getDayLabel = (index: number) => {
    const labels = ['오늘', '내일', '모레', '글피'];
    return labels[index] || `${index + 1}일 후`;
  };

  const getDominantCondition = (forecast: ShortTermForecast) => {
    const conditions = forecast.hourlyShortTermForecasts.map(h => h.skyCondition);
    const counts: Record<string, number> = {};
    conditions.forEach(c => counts[c] = (counts[c] || 0) + 1);
    return Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b);
  };

  const getMaxPrecipitation = (forecast: ShortTermForecast) => {
    return Math.max(...forecast.hourlyShortTermForecasts.map(h => h.precipitationProbability || 0));
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>날씨 영향 분석</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-20 bg-gray-200 rounded"></div>
            <div className="grid grid-cols-4 gap-3">
              {[1,2,3,4].map(i => (
                <div key={i} className="h-24 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>날씨 영향 분석</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {weatherInsight && (
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <span className="font-medium text-amber-800">AI 날씨 분석</span>
              </div>
              <p className="mt-2 text-sm text-amber-700">
                {weatherInsight}
              </p>
            </div>
          )}

          <div className="grid grid-cols-4 gap-3">
            {weatherData?.slice(0, 4).map((forecast, index) => {
              const dominantCondition = getDominantCondition(forecast);
              const maxPrecipitation = getMaxPrecipitation(forecast);
              
              return (
                <div key={forecast.date} className="text-center">
                  <p className="text-xs text-neutral-500 mb-1">{getDayLabel(index)}</p>
                  <div className="text-2xl mb-2">{getWeatherIcon(dominantCondition)}</div>
                  <p className="text-sm font-medium">{forecast.dailyMaximumTemperature || '-'}°</p>
                  <p className="text-xs text-neutral-500">{forecast.dailyMinimumTemperature || '-'}°</p>
                  {maxPrecipitation > 0 && (
                    <p className="text-xs text-blue-600 mt-1">{maxPrecipitation}%</p>
                  )}
                </div>
              );
            })}
          </div>

          {businessInfo && (
            <div className="pt-4 border-t">
              <p className="text-xs text-neutral-500 mb-2">
                📍 {businessInfo.address || '사업장 주소'}
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
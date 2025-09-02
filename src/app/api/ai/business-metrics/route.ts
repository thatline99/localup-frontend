import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

interface HistoricalMetrics {
  averageRevenue?: number;
  averageVisitors?: number;
  peakHours?: number[];
}

interface BusinessInfo {
  name?: string;
  address?: string;
  category?: string;
  description?: string;
}

interface WeatherData {
  date: string;
  dailyMinimumTemperature?: number;
  dailyMaximumTemperature?: number;
  hourlyShortTermForecasts?: Array<{
    precipitationProbability?: number;
  }>;
}

async function generateBusinessMetrics(
  weatherData: WeatherData[] | undefined,
  businessInfo: BusinessInfo | undefined,
  historicalData: HistoricalMetrics | undefined,
  accessToken: string
) {
  try {
    // 백엔드 대시보드 API 호출
    const response = await fetch(
      `${process.env.BACKEND_API_URL}/dashboard/business-metrics`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Cookie: `accessToken=${accessToken}`,
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          weatherData,
          businessInfo,
          historicalData
        }),
      }
    );

    if (!response.ok) {
      return generateDefaultMetrics(weatherData, historicalData);
    }

    const result = await response.json();
    return result.data || generateDefaultMetrics(weatherData, historicalData);
  } catch (error) {
    console.error("Business metrics generation error:", error);
    return generateDefaultMetrics(weatherData, historicalData);
  }
}

function generateDefaultMetrics(
  weatherData: WeatherData[] | undefined,
  historicalData: HistoricalMetrics | undefined
) {
  const baseRevenue = historicalData?.averageRevenue || 3500000;
  const baseVisitors = historicalData?.averageVisitors || 150;
  
  // 날씨에 따른 변동 계산
  let weatherImpact = 0;
  if (weatherData && weatherData.length > 0) {
    const todayForecast = weatherData[0];
    const maxRain = Math.max(
      ...(todayForecast.hourlyShortTermForecasts?.map(h => h.precipitationProbability || 0) || [0])
    );
    
    if (maxRain > 60) {
      weatherImpact = -0.2; // 비오면 20% 감소
    } else if (maxRain > 30) {
      weatherImpact = -0.1; // 비 조금 오면 10% 감소
    }
  }

  return {
    todayRevenue: {
      value: baseRevenue * (1 + weatherImpact),
      change: weatherImpact * 100,
      trend: weatherImpact < 0 ? "down" : weatherImpact > 0 ? "up" : "stable",
      confidence: 0.6
    },
    todayVisitors: {
      value: baseVisitors * (1 + weatherImpact),
      change: weatherImpact * 100,
      trend: weatherImpact < 0 ? "down" : weatherImpact > 0 ? "up" : "stable",
      confidence: 0.6
    },
    tomorrowRevenue: {
      value: baseRevenue,
      change: 0,
      trend: "stable",
      confidence: 0.5
    },
    tomorrowVisitors: {
      value: baseVisitors,
      change: 0,
      trend: "stable",
      confidence: 0.5
    },
    recommendations: [
      "날씨 변화에 따른 재고 조정 필요",
      "온라인 프로모션 강화 고려",
      "피크 시간대 직원 배치 최적화"
    ],
    generatedAt: new Date().toISOString()
  };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { weatherData, businessInfo, historicalData } = body;

    // 세션에서 백엔드 토큰 가져오기
    const sessionResponse = await fetch(
      new URL("/api/auth/session", request.url),
      {
        headers: request.headers,
      }
    );

    if (!sessionResponse.ok) {
      // 비로그인 상태에서도 기본 메트릭 제공
      return NextResponse.json(
        generateDefaultMetrics(weatherData, historicalData)
      );
    }

    const sessionData = await sessionResponse.json();
    const backendAccessToken = sessionData.user?.backendAccessToken;

    let metrics;
    if (backendAccessToken) {
      metrics = await generateBusinessMetrics(
        weatherData,
        businessInfo,
        historicalData,
        backendAccessToken
      );
    } else {
      metrics = generateDefaultMetrics(weatherData, historicalData);
    }

    return NextResponse.json(metrics);
  } catch (error) {
    console.error("Business metrics API error:", error);
    return NextResponse.json(
      generateDefaultMetrics(undefined, undefined),
      { status: 200 }
    );
  }
}
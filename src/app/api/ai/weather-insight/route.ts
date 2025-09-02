import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

async function generateWeatherInsight(
  forecasts: any[], 
  businessInfo: any,
  accessToken: string
) {
  try {
    // 백엔드 대시보드 API 호출 (수정된 경로)
    const response = await fetch(
      `${process.env.BACKEND_API_URL}/dashboard/weather-insight`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Cookie: `accessToken=${accessToken}`,
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          weatherData: forecasts,
          businessInfo: businessInfo
        }),
      }
    );

    if (!response.ok) {
      // 백엔드 API가 없으면 프론트엔드에서 기본 로직으로 생성
      return generateDefaultInsight(forecasts, businessInfo);
    }

    const result = await response.json();
    return result.data?.insight || generateDefaultInsight(forecasts, businessInfo);
  } catch (error) {
    console.error("Weather insight generation error:", error);
    return generateDefaultInsight(forecasts, businessInfo);
  }
}

function generateDefaultInsight(forecasts: any[], businessInfo: any) {
  if (!forecasts || forecasts.length === 0) {
    return "날씨 데이터를 불러올 수 없습니다.";
  }

  const todayForecast = forecasts[0];
  const tomorrowForecast = forecasts[1];
  
  // 비 예보 체크
  const todayRain = Math.max(...(todayForecast?.hourlyShortTermForecasts?.map((h: any) => 
    h.precipitationProbability || 0) || [0]));
  const tomorrowRain = Math.max(...(tomorrowForecast?.hourlyShortTermForecasts?.map((h: any) => 
    h.precipitationProbability || 0) || [0]));

  // 온도 체크
  const todayHigh = todayForecast?.dailyMaximumTemperature || 0;
  const todayLow = todayForecast?.dailyMinimumTemperature || 0;

  let insight = "";

  // 비즈니스 타입별 맞춤 인사이트
  const businessCategory = businessInfo?.category?.toLowerCase() || "";
  
  if (todayRain > 60) {
    if (businessCategory.includes("음식") || businessCategory.includes("카페")) {
      insight = `오늘 강수 확률 ${todayRain}%로 비가 예상됩니다. 배달 주문 증가에 대비하고 실내 좌석을 정리해주세요.`;
    } else if (businessCategory.includes("관광") || businessCategory.includes("야외")) {
      insight = `오늘 강수 확률 ${todayRain}%입니다. 실내 프로그램을 준비하고 우산 대여 서비스를 운영하세요.`;
    } else {
      insight = `오늘 비 예보(${todayRain}%)로 방문객이 평소보다 20-30% 감소할 수 있습니다. 온라인 프로모션을 강화하세요.`;
    }
  } else if (tomorrowRain > 60) {
    insight = `내일 비 예보(${tomorrowRain}%)가 있습니다. 미리 재고를 조정하고 우천 시 프로모션을 준비하세요.`;
  } else if (todayHigh > 30) {
    if (businessCategory.includes("음식") || businessCategory.includes("카페")) {
      insight = `오늘 최고 ${todayHigh}°C의 더운 날씨입니다. 시원한 메뉴와 음료 재고를 늘리고 에어컨을 미리 점검하세요.`;
    } else {
      insight = `오늘 ${todayHigh}°C의 무더운 날씨가 예상됩니다. 실내 냉방을 강화하고 고객 휴식 공간을 마련하세요.`;
    }
  } else if (todayLow < 5) {
    if (businessCategory.includes("음식") || businessCategory.includes("카페")) {
      insight = `오늘 최저 ${todayLow}°C의 추운 날씨입니다. 따뜻한 메뉴를 추천하고 실내 온도를 적절히 유지하세요.`;
    } else {
      insight = `오늘 ${todayLow}°C의 추운 날씨가 예상됩니다. 난방을 미리 가동하고 따뜻한 서비스를 제공하세요.`;
    }
  } else {
    // 맑은 날씨
    const skyCondition = todayForecast?.hourlyShortTermForecasts?.[12]?.skyCondition || "SUNNY";
    if (skyCondition === "SUNNY") {
      insight = `오늘은 맑은 날씨로 ${todayLow}~${todayHigh}°C입니다. 야외 테이블을 준비하고 SNS 사진 스팟을 마련해보세요.`;
    } else {
      insight = `오늘은 ${todayLow}~${todayHigh}°C의 온화한 날씨입니다. 평균적인 방문객이 예상되니 일반적인 운영을 준비하세요.`;
    }
  }

  return insight;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { forecasts, businessInfo } = body;

    // 세션에서 백엔드 토큰 가져오기
    const sessionResponse = await fetch(
      new URL("/api/auth/session", request.url),
      {
        headers: request.headers,
      }
    );

    if (!sessionResponse.ok) {
      // 비로그인 상태에서도 기본 인사이트 제공
      return NextResponse.json({
        insight: generateDefaultInsight(forecasts, businessInfo)
      });
    }

    const sessionData = await sessionResponse.json();
    const backendAccessToken = sessionData.user?.backendAccessToken;

    let insight;
    if (backendAccessToken) {
      insight = await generateWeatherInsight(forecasts, businessInfo, backendAccessToken);
    } else {
      insight = generateDefaultInsight(forecasts, businessInfo);
    }

    return NextResponse.json({ insight });
  } catch (error) {
    console.error("Weather insight API error:", error);
    return NextResponse.json(
      { insight: "날씨 분석 중 오류가 발생했습니다." },
      { status: 200 } // 에러여도 200으로 반환하여 UI가 깨지지 않도록
    );
  }
}
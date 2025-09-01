"use client";

import { useEffect, useState, useRef } from "react";
import {
  getDashboard,
  getShortTermForecast,
  getVisitorStatistics,
} from "@/app/lib/api/dashboard/dashboard";
import {
  GetDashboardInformationResponse,
  LocationEvent,
  TouristAttractionRanking,
} from "@/types/dashboard/getDashboardInformationResponse";
import {
  VisitorStatistic,
  VisitorStatisticsInformation,
} from "@/types/dashboard/getVisitorStatisticsResponse";
import {
  GetShortTermForecastResponse,
  ShortTermForecast,
  HourlyShortTermForecast,
} from "@/types/dashboard/getShortTermForecastResponse";
import { PageLayout } from "@/components/dashboard/PageLayout";
import Script from "next/script";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    kakao: any;
  }
}

export default function DashboardPage() {

  // 로그인 및 사업정보 등록 여부에 따른 리다이렉트 처리를 위한 상태 및 훅
  const { data: session } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  const [dashboardData, setDashboardData] =
    useState<GetDashboardInformationResponse | null>(null);
  const [visitorStatisticsData, setVisitorStatisticsData] =
    useState<VisitorStatisticsInformation | null>(null);
  const [weatherData, setWeatherData] =
    useState<GetShortTermForecastResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [weatherRefreshing, setWeatherRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedWeatherTab, setSelectedWeatherTab] = useState<
    "all" | "today" | "tomorrow" | "dayAfter"
  >("all");
  const [selectedAttraction, setSelectedAttraction] = useState<number | null>(
    null,
  );
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>("");
  const [selectedEvent, setSelectedEvent] = useState<number | null>(null);
  const [weatherCardExpanded, setWeatherCardExpanded] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);

  // 평균값 애니메이션을 위한 state
  const [animatedTemp, setAnimatedTemp] = useState(0);
  const [animatedPrecip, setAnimatedPrecip] = useState(0);
  const [animatedHumidity, setAnimatedHumidity] = useState(0);
  const [animatedWind, setAnimatedWind] = useState(0);
  const mapRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mapInstanceRef = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const markersRef = useRef<any[]>([]);
  const eventMapRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const eventMapInstanceRef = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const eventMarkersRef = useRef<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
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
          const month = String(date.getMonth() + 1).padStart(2, "0");
          const day = String(date.getDate()).padStart(2, "0");
          return `${year}-${month}-${day}`;
        };

        const [dashboardResponse, weatherResponse, visitorResponse] =
          await Promise.all([
            getDashboard(),
            getShortTermForecast(),
            getVisitorStatistics(formatDate(startDate), formatDate(lastYear)),
          ]);

        if (dashboardResponse.code === "SUCCESS" && dashboardResponse.data) {
          setDashboardData(dashboardResponse.data);
        } else {
          setError("대시보드 데이터를 불러오는데 실패했습니다.");
        }

        if (weatherResponse.code === "SUCCESS" && weatherResponse.data) {
          setWeatherData(weatherResponse);
        } else {
          setError("날씨 데이터를 불러오는데 실패했습니다.");
        }

        if (visitorResponse.code === "SUCCESS" && visitorResponse.data) {
          setVisitorStatisticsData(visitorResponse.data);
        }
      } catch {
        setError("API 호출 중 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // 화면 크기 감지
  useEffect(() => {
    setMounted(true);
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // 초기값 설정
    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

    // 프로필 및 사업정보 존재 여부 확인
  useEffect(() => {
    const checkUserStatus = async () => {
      if (!session?.user) {
        setIsLoading(false);
        return;
      }

      // 재인증이 필요한 경우 로그인 페이지로 리다이렉트
      if ((session.user as { needsReauth?: boolean }).needsReauth) {
        router.replace('/sign-in?message=재로그인이 필요합니다');
        return;
      }

      try {
        // 1. 먼저 프로필 정보 확인
        const profileResponse = await fetch('/api/user/profile', {
          credentials: 'include'
        });

        if (profileResponse.status === 401) {
          // 백엔드 토큰 문제 - 재로그인 필요
          router.replace('/sign-in?message=재로그인이 필요합니다');
          return;
        }

        if (profileResponse.ok) {
          const profileData = await profileResponse.json();
          
          // 프로필이 완성되지 않은 경우
          if (!profileData.data?.isProfileCompleted) {
            router.replace('/profile-setup');
            return;
          }

          // 사업정보가 없는 경우
          if (!profileData.data?.hasBusinessInfo) {
            // 재시도 로직 (방금 등록한 경우 대비)
            setTimeout(async () => {
              try {
                const retryResponse = await fetch('/api/user/profile', {
                  credentials: 'include'
                });
                
                if (retryResponse.ok) {
                  const retryData = await retryResponse.json();
                  if (!retryData.data?.hasBusinessInfo) {
                    router.replace('/business-setup');
                  } else {
                    setIsLoading(false);
                  }
                } else {
                  setIsLoading(false);
                }
              } catch (error) {
                console.error('프로필 재확인 오류:', error);
                setIsLoading(false);
              }
            }, 1000);
            return;
          }
        }

        // 프로필과 사업정보가 모두 있는 경우 대시보드 표시
        setIsLoading(false);
      } catch (error) {
        console.error('사용자 상태 확인 오류:', error);
        setIsLoading(false);
      }
    };

    checkUserStatus();
  }, [session?.user, router]);

  useEffect(() => {
    if (dashboardData && mapInstanceRef.current) {
      createMarkers(mapInstanceRef.current);
    }
  }, [dashboardData, selectedCategory, selectedSubCategory, createMarkers]);

  useEffect(() => {
    if (dashboardData && eventMapInstanceRef.current) {
      createEventMarkers(eventMapInstanceRef.current);
    }
  }, [dashboardData, selectedEvent, createEventMarkers]);

  // 평균값 애니메이션 효과
  useEffect(() => {
    const filteredData = getFilteredWeatherData();
    if (!filteredData || filteredData.length === 0) return;

    const forecast = filteredData[0];
    if (!forecast) return;

    // 평균값 계산
    const avgTemperature =
      forecast.hourlyShortTermForecasts.reduce(
        (sum, h) => sum + (h.temperature || 0),
        0,
      ) / forecast.hourlyShortTermForecasts.length;
    const avgPrecipitation =
      forecast.hourlyShortTermForecasts.reduce(
        (sum, h) => sum + (h.precipitationProbability || 0),
        0,
      ) / forecast.hourlyShortTermForecasts.length;
    const avgHumidity =
      forecast.hourlyShortTermForecasts.reduce(
        (sum, h) => sum + (h.humidity || 0),
        0,
      ) / forecast.hourlyShortTermForecasts.length;
    const avgWindSpeed =
      forecast.hourlyShortTermForecasts.reduce(
        (sum, h) => sum + (h.windSpeed || 0),
        0,
      ) / forecast.hourlyShortTermForecasts.length;

    const duration = 300; // 0.3초
    const steps = 15;
    const interval = duration / steps;

    let tempStep = 0;
    let precipStep = 0;
    let humidityStep = 0;
    let windStep = 0;

    const timer = setInterval(() => {
      tempStep++;
      precipStep++;
      humidityStep++;
      windStep++;

      if (tempStep <= steps) {
        setAnimatedTemp((avgTemperature * tempStep) / steps);
      }
      if (precipStep <= steps) {
        setAnimatedPrecip((avgPrecipitation * precipStep) / steps);
      }
      if (humidityStep <= steps) {
        setAnimatedHumidity((avgHumidity * humidityStep) / steps);
      }
      if (windStep <= steps) {
        setAnimatedWind((avgWindSpeed * windStep) / steps);
      }

      if (
        tempStep > steps &&
        precipStep > steps &&
        humidityStep > steps &&
        windStep > steps
      ) {
        clearInterval(timer);
      }
    }, interval);

    return () => clearInterval(timer);
  }, [weatherData, selectedWeatherTab]);

  function getUniqueCategories(): string[] {
    if (
      !dashboardData?.lastMonthlyTouristAttractionRankingInformation
        ?.lastMonthlyTouristAttractionRankingList
    )
      return [];
    const categories = new Set(
      dashboardData.lastMonthlyTouristAttractionRankingInformation.lastMonthlyTouristAttractionRankingList.map(
        (attraction) => attraction.category,
      ),
    );
    return Array.from(categories).sort();
  }

  function getUniqueSubCategories(): string[] {
    if (
      !dashboardData?.lastMonthlyTouristAttractionRankingInformation
        ?.lastMonthlyTouristAttractionRankingList ||
      !selectedCategory
    )
      return [];
    const subCategories = new Set(
      dashboardData.lastMonthlyTouristAttractionRankingInformation.lastMonthlyTouristAttractionRankingList
        .filter((attraction) => attraction.category === selectedCategory)
        .map((attraction) => attraction.subCategory),
    );
    return Array.from(subCategories).sort();
  }

  function getFilteredAttractions(): TouristAttractionRanking[] {
    if (
      !dashboardData?.lastMonthlyTouristAttractionRankingInformation
        ?.lastMonthlyTouristAttractionRankingList
    )
      return [];

    let filtered =
      dashboardData.lastMonthlyTouristAttractionRankingInformation
        .lastMonthlyTouristAttractionRankingList;

    if (selectedCategory) {
      filtered = filtered.filter(
        (attraction) => attraction.category === selectedCategory,
      );
    }

    if (selectedSubCategory) {
      filtered = filtered.filter(
        (attraction) => attraction.subCategory === selectedSubCategory,
      );
    }

    return filtered;
  }

  function resetFilters() {
    setSelectedCategory("");
    setSelectedSubCategory("");
    setSelectedAttraction(null);
  }

  function getMaxValue() {
    if (!visitorStatisticsData || !visitorStatisticsData.visitorStatistics) {
      return 0;
    }

    const stats = visitorStatisticsData.visitorStatistics;
    let max = 0;
    stats.forEach((stat) => {
      const total =
        stat.localVisitors + stat.domesticVisitors + stat.foreignVisitors;
      max = Math.max(
        max,
        stat.localVisitors,
        stat.domesticVisitors,
        stat.foreignVisitors,
        total,
      );
    });
    return max;
  }

  function renderChart() {
    if (!visitorStatisticsData || !visitorStatisticsData.visitorStatistics) {
      return null;
    }

    const stats = visitorStatisticsData.visitorStatistics;
    const maxValue = getMaxValue();
    const height = 150; // 차트 높이

    // 각 라인의 포인트들을 생성
    const localPoints = stats
      .map((stat, index) => {
        const x = 50 + index * 80;
        const y = height - (stat.localVisitors / maxValue) * height + 20;
        return `${x},${y}`;
      })
      .join(" ");

    const domesticPoints = stats
      .map((stat, index) => {
        const x = 50 + index * 80;
        const y = height - (stat.domesticVisitors / maxValue) * height + 20;
        return `${x},${y}`;
      })
      .join(" ");

    const foreignPoints = stats
      .map((stat, index) => {
        const x = 50 + index * 80;
        const y = height - (stat.foreignVisitors / maxValue) * height + 20;
        return `${x},${y}`;
      })
      .join(" ");

    const totalPoints = stats
      .map((stat, index) => {
        const x = 50 + index * 80;
        const total =
          stat.localVisitors + stat.domesticVisitors + stat.foreignVisitors;
        const y = height - (total / maxValue) * height + 20;
        return `${x},${y}`;
      })
      .join(" ");

    return (
      <g>
        {/* 지역 방문객 라인 */}
        <polyline
          points={localPoints}
          fill="none"
          stroke="#3B82F6"
          strokeWidth="2"
        />
        {/* 국내 방문객 라인 */}
        <polyline
          points={domesticPoints}
          fill="none"
          stroke="#10B981"
          strokeWidth="2"
        />
        {/* 해외 방문객 라인 */}
        <polyline
          points={foreignPoints}
          fill="none"
          stroke="#8B5CF6"
          strokeWidth="2"
        />
        {/* 총 방문객 라인 */}
        <polyline
          points={totalPoints}
          fill="none"
          stroke="#F97316"
          strokeWidth="3"
          strokeDasharray="5,5"
        />

        {/* 데이터 포인트 점들 */}
        {stats.map((stat, index) => {
          const x = 50 + index * 80;
          const localY = height - (stat.localVisitors / maxValue) * height + 20;
          const domesticY =
            height - (stat.domesticVisitors / maxValue) * height + 20;
          const foreignY =
            height - (stat.foreignVisitors / maxValue) * height + 20;
          const total =
            stat.localVisitors + stat.domesticVisitors + stat.foreignVisitors;
          const totalY = height - (total / maxValue) * height + 20;

          return (
            <g key={index}>
              <circle
                cx={x}
                cy={localY}
                r="4"
                fill="#3B82F6"
                className="hover:r-6 cursor-pointer"
              />
              <circle
                cx={x}
                cy={domesticY}
                r="4"
                fill="#10B981"
                className="hover:r-6 cursor-pointer"
              />
              <circle
                cx={x}
                cy={foreignY}
                r="4"
                fill="#8B5CF6"
                className="hover:r-6 cursor-pointer"
              />
              <circle
                cx={x}
                cy={totalY}
                r="5"
                fill="#F97316"
                stroke="#fff"
                strokeWidth="2"
                className="hover:r-7 cursor-pointer"
              />

              {/* 투명한 호버 영역 */}
              <rect
                x={x - 15}
                y="0"
                width="30"
                height={height + 20}
                fill="transparent"
                className="cursor-pointer"
                onMouseEnter={(e) => showTooltip(e, stat)}
                onMouseLeave={hideTooltip}
              />
            </g>
          );
        })}
      </g>
    );
  }

  function showTooltip(e: React.MouseEvent, stat: VisitorStatistic) {
    const tooltip = document.getElementById("tooltip");
    const tooltipContent = document.getElementById("tooltip-content");

    if (tooltip && tooltipContent) {
      const date = new Date(stat.date);
      const total =
        stat.localVisitors + stat.domesticVisitors + stat.foreignVisitors;
      tooltipContent.innerHTML = `
        <div><strong>${date.toLocaleDateString("ko-KR", { month: "short", day: "numeric", weekday: "short" })}</strong></div>
        <div>지역: ${stat.localVisitors.toLocaleString()}</div>
        <div>국내: ${stat.domesticVisitors.toLocaleString()}</div>
        <div>해외: ${stat.foreignVisitors.toLocaleString()}</div>
        <div style="border-top: 1px solid #374151; padding-top: 4px; margin-top: 4px;"><strong>총합: ${total.toLocaleString()}</strong></div>
      `;
      tooltip.classList.remove("opacity-0");
      tooltip.classList.add("opacity-100");
    }
  }

  function hideTooltip() {
    const tooltip = document.getElementById("tooltip");
    if (tooltip) {
      tooltip.classList.remove("opacity-100");
      tooltip.classList.add("opacity-0");
    }
  }

  const getWeatherIcon = (condition: string) => {
    switch (condition) {
      case "SUNNY":
        return "☀️"; // 맑음
      case "PARTLY_CLOUDY":
        return "⛅"; // 구름 많음
      case "CLOUDY":
        return "☁️"; // 흐림
      default:
        return "🌤️";
    }
  };

  const getPrecipitationIcon = (precipitationType: string | null) => {
    switch (precipitationType) {
      case "RAIN":
        return "🌧️";
      case "RAIN_AND_SNOW":
        return "🌨️";
      case "SHOWER":
        return "🌦️";
      case "NONE":
        return ""; // 아무것도 표시하지 않음
      case null:
      default:
        return ""; // 아무것도 표시하지 않음
    }
  };

  const getPrecipitationText = (precipitationType: string | null) => {
    switch (precipitationType) {
      case "RAIN":
        return "비";
      case "RAIN_AND_SNOW":
        return "비/눈";
      case "SHOWER":
        return "소나기";
      case "NONE":
        return "-";
      case null:
      default:
        return "-";
    }
  };

  const getSkyConditionText = (skyCondition: string | null) => {
    switch (skyCondition) {
      case "SUNNY":
        return "맑음";
      case "PARTLY_CLOUDY":
        return "구름 많음";
      case "CLOUDY":
        return "흐림";
      default:
        return "맑음";
    }
  };

  // 바람 방향 계산 (바람이 부는 방향)
  const getWindDirection = (
    windDirection: number | null,
    windU: number | null,
    windV: number | null,
  ) => {
    // windDirection이 있으면 우선 사용
    if (windDirection !== null && windDirection !== undefined) {
      return windDirection;
    }

    // windU, windV 컴포넌트로 방향 계산
    if (windU !== null && windV !== null) {
      let direction = Math.atan2(windV, windU) * (180 / Math.PI);
      direction = (direction + 360) % 360; // 0-360도로 정규화
      return direction;
    }

    return null;
  };

  // 바람 방향 화살표 SVG 생성
  const getWindArrow = (direction: number | null) => {
    if (direction === null) return null;

    return (
      <svg width="12" height="12" viewBox="0 0 24 24" className="inline-block">
        <g transform={`rotate(${direction} 12 12)`}>
          <path
            d="M12 2 L16 10 L12 8 L8 10 Z"
            fill="#4B5563"
            stroke="#374151"
            strokeWidth="0.5"
          />
        </g>
      </svg>
    );
  };

  // 바람 방향 텍스트
  const getWindDirectionText = (direction: number | null) => {
    if (direction === null) return "";

    const directions = [
      "북풍",
      "북북동풍",
      "북동풍",
      "동북동풍",
      "동풍",
      "동남동풍",
      "남동풍",
      "남남동풍",
      "남풍",
      "남남서풍",
      "남서풍",
      "서남서풍",
      "서풍",
      "서북서풍",
      "북서풍",
      "북북서풍",
    ];

    const index = Math.round(direction / 22.5) % 16;
    return directions[index];
  };

  // 바람 속도 색상
  const getWindSpeedColor = (speed: number | null) => {
    if (!speed) return "#6B7280";
    if (speed >= 9) return "#DC2626"; // 강함 - 빨간색
    if (speed >= 4) return "#F59E0B"; // 보통 - 주황색
    return "#10B981"; // 약함 - 초록색
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const getDominantWeatherCondition = (hourlyForecasts: any[]) => {
    const conditionCounts: { [key: string]: number } = {};

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    hourlyForecasts.forEach((forecast: any) => {
      const condition = forecast.skyCondition;
      conditionCounts[condition] = (conditionCounts[condition] || 0) + 1;
    });

    return Object.keys(conditionCounts).reduce((a, b) =>
      conditionCounts[a] > conditionCounts[b] ? a : b,
    );
  };

  const getFilteredWeatherData = () => {
    if (!weatherData?.data?.shortTermForecasts) return [];

    const today = new Date();
    const todayStr = today.toISOString().split("T")[0];
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split("T")[0];
    const dayAfter = new Date(today);
    dayAfter.setDate(today.getDate() + 2);
    const dayAfterStr = dayAfter.toISOString().split("T")[0];

    switch (selectedWeatherTab) {
      case "today":
        return weatherData.data.shortTermForecasts.filter(
          (f) => f.date === todayStr,
        );
      case "tomorrow":
        return weatherData.data.shortTermForecasts.filter(
          (f) => f.date === tomorrowStr,
        );
      case "dayAfter":
        return weatherData.data.shortTermForecasts.filter(
          (f) => f.date === dayAfterStr,
        );
      default:
        return weatherData.data.shortTermForecasts;
    }
  };

  const renderWeatherContent = () => {
    const filteredData = getFilteredWeatherData();

    if (selectedWeatherTab === "all") {
      return renderWeatherOverview();
    } else {
      return renderDetailedWeather(filteredData[0]);
    }
  };

  const renderWeatherOverview = () => {
    if (!weatherData?.data?.shortTermForecasts) return null;

    return (
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        {weatherData.data.shortTermForecasts
          .slice(0, 3)
          .map((forecast: ShortTermForecast, index: number) => {
            const dominantCondition = getDominantWeatherCondition(
              forecast.hourlyShortTermForecasts,
            );

            // 해당 날짜의 강수 정보 가져오기
            const precipitationInfo = forecast.hourlyShortTermForecasts.reduce(
              (acc, hourly) => {
                const type = hourly.precipitationType || "NONE";
                acc[type] = (acc[type] || 0) + 1;
                return acc;
              },
              {} as Record<string, number>,
            );

            // 가장 빈번한 강수 타입 찾기
            const dominantPrecipitation = Object.keys(precipitationInfo).reduce(
              (a, b) => (precipitationInfo[a] > precipitationInfo[b] ? a : b),
            );

            // 적설량 정보 확인
            const hasSnowfall = forecast.hourlyShortTermForecasts.some(
              (hourly) =>
                hourly.snowfallAmount &&
                hourly.snowfallAmount !== "NONE" &&
                hourly.snowfallAmount !== "적설없음",
            );

            // 평균값 계산
            const avgPrecipitation =
              forecast.hourlyShortTermForecasts.reduce(
                (sum, h) => sum + (h.precipitationProbability || 0),
                0,
              ) / forecast.hourlyShortTermForecasts.length;
            const avgHumidity =
              forecast.hourlyShortTermForecasts.reduce(
                (sum, h) => sum + (h.humidity || 0),
                0,
              ) / forecast.hourlyShortTermForecasts.length;
            const avgWindSpeed =
              forecast.hourlyShortTermForecasts.reduce(
                (sum, h) => sum + (h.windSpeed || 0),
                0,
              ) / forecast.hourlyShortTermForecasts.length;

            const dayNames = ["오늘", "내일", "모레"];
            return (
              <div key={index} className="rounded-lg bg-gray-50 p-3">
                {/* 상단 섹션 - 한 줄로 정리 */}
                <div className="mb-2 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="text-3xl">
                      {getWeatherIcon(dominantCondition)}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-gray-800">
                        {dayNames[index]}
                      </span>
                      <span className="text-sm text-gray-500">
                        {new Date(forecast.date)
                          .toLocaleDateString("ko-KR", {
                            month: "2-digit",
                            day: "2-digit",
                          })
                          .replace(/\. /g, "월 ")
                          .replace(".", "일")}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="font-bold">
                      <span className="text-lg text-red-500">
                        {forecast.dailyMaximumTemperature ?? "-"}°
                      </span>
                      <span className="mx-1 text-gray-400">/</span>
                      <span className="text-lg text-blue-500">
                        {forecast.dailyMinimumTemperature ?? "-"}°
                      </span>
                    </div>
                    {(dominantPrecipitation !== "NONE" || hasSnowfall) && (
                      <div className="text-sm font-medium text-blue-600">
                        {getPrecipitationText(dominantPrecipitation)}
                        {hasSnowfall && <span className="ml-1">❄️</span>}
                      </div>
                    )}
                  </div>
                </div>

                {/* 평균 데이터 섹션 - 더 컴팩트하게 */}
                <div className="grid grid-cols-3 gap-2 border-t border-gray-200 pt-2">
                  <div className="text-center">
                    <div className="text-xs text-gray-500">평균 강수 확률</div>
                    <div className="text-sm font-semibold text-blue-600">
                      {avgPrecipitation.toFixed(0)} %
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-gray-500">평균 습도</div>
                    <div className="text-sm font-semibold text-green-600">
                      {avgHumidity.toFixed(0)} %
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-gray-500">평균 풍속</div>
                    <div
                      className="text-sm font-semibold"
                      style={{ color: getWindSpeedColor(avgWindSpeed) }}
                    >
                      {avgWindSpeed.toFixed(1)}{" "}
                      <span className="text-xs">m/s</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
      </div>
    );
  };

  const renderDetailedWeather = (forecast: ShortTermForecast | undefined) => {
    if (!forecast)
      return (
        <div className="text-center text-gray-500">데이터가 없습니다.</div>
      );

    return (
      <div className="space-y-4">
        {/* 상단: 온도 차트와 평균 데이터 */}
        <div className="grid grid-cols-1 gap-3 xl:grid-cols-10">
          {/* 온도 차트 (8칸) */}
          <div className="rounded-lg bg-gray-50 p-3 xl:col-span-8">
            <h3 className="mb-2 text-base font-medium text-gray-900">
              시간별 온도
            </h3>
            <svg
              className="h-48 w-full"
              viewBox="0 0 800 180"
              key={`temp-chart-${selectedWeatherTab}-${forecast.date}`}
            >
              {renderTemperatureChart(forecast.hourlyShortTermForecasts)}
            </svg>
          </div>

          {/* 평균 데이터 (2칸) */}
          <div className="flex flex-col gap-2 md:flex-row xl:col-span-2 xl:flex-col">
            {/* 평균 온도 */}
            <div className="flex flex-1 items-center justify-between rounded-lg bg-gray-50 p-3">
              <span className="text-sm font-medium text-gray-900">
                평균 온도
              </span>
              <div className="flex items-center">
                <span className="text-2xl font-bold text-red-500">
                  {animatedTemp.toFixed(1)}
                </span>
                <span className="ml-1 text-lg font-medium text-red-500">
                  °C
                </span>
              </div>
            </div>

            {/* 평균 강수 확률 */}
            <div className="flex flex-1 items-center justify-between rounded-lg bg-gray-50 p-3">
              <span className="text-sm font-medium text-gray-900">
                평균 강수 확률
              </span>
              <div className="flex items-center">
                <span className="text-2xl font-bold text-blue-600">
                  {animatedPrecip.toFixed(0)}
                </span>
                <span className="ml-1 text-lg font-medium text-blue-600">
                  %
                </span>
              </div>
            </div>

            {/* 평균 습도 */}
            <div className="flex flex-1 items-center justify-between rounded-lg bg-gray-50 p-3">
              <span className="text-sm font-medium text-gray-900">
                평균 습도
              </span>
              <div className="flex items-center">
                <span className="text-2xl font-bold text-green-600">
                  {animatedHumidity.toFixed(0)}
                </span>
                <span className="ml-1 text-lg font-medium text-green-600">
                  %
                </span>
              </div>
            </div>

            {/* 평균 풍속 */}
            <div className="flex flex-1 items-center justify-between rounded-lg bg-gray-50 p-3">
              <span className="text-sm font-medium text-gray-900">
                평균 풍속
              </span>
              <div className="flex items-center">
                <span
                  className="text-2xl font-bold"
                  style={{ color: getWindSpeedColor(animatedWind) }}
                >
                  {animatedWind.toFixed(1)}
                </span>
                <span
                  className="ml-1 text-lg font-medium"
                  style={{ color: getWindSpeedColor(animatedWind) }}
                >
                  m/s
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 하단: 강수, 습도, 바람 정보 */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-10">
          {/* 상태 (4칸) */}
          <div className="rounded-lg bg-gray-50 p-3 lg:col-span-4">
            <h4 className="mb-2 text-sm font-medium text-gray-900">상태</h4>
            <div className="space-y-1">
              {forecast.hourlyShortTermForecasts
                .filter((_, index) => index % 3 === 0) // 3시간 단위로 표시
                .map((hourly, index) => (
                  <div key={index} className="flex items-center p-1 text-xs">
                    <span className="w-10 text-center font-medium text-gray-600">
                      {hourly.time.slice(0, 2)}시
                    </span>

                    <div className="ml-2 flex w-20 items-center gap-1">
                      <span className="text-xs">
                        {getWeatherIcon(hourly.skyCondition)}
                      </span>
                      <span className="whitespace-nowrap text-xs text-gray-500">
                        {getSkyConditionText(hourly.skyCondition)}
                      </span>
                    </div>

                    <div className="ml-2 flex w-16 items-center gap-1">
                      {getPrecipitationIcon(hourly.precipitationType) ? (
                        <span className="text-xs">
                          {getPrecipitationIcon(hourly.precipitationType)}
                        </span>
                      ) : (
                        <span className="text-xs">-</span>
                      )}
                      <span className="whitespace-nowrap text-xs font-medium text-blue-600">
                        {getPrecipitationIcon(hourly.precipitationType)
                          ? getPrecipitationText(hourly.precipitationType)
                          : "-"}
                      </span>
                    </div>

                    <div className="ml-2 h-1.5 flex-1 rounded-full bg-gray-200">
                      <div
                        className="h-1.5 rounded-full transition-all duration-300"
                        style={{
                          width: `${hourly.precipitationProbability || 0}%`,
                          backgroundColor:
                            (hourly.precipitationProbability || 0) > 70
                              ? "#EF4444"
                              : (hourly.precipitationProbability || 0) > 40
                                ? "#F59E0B"
                                : "#3B82F6",
                        }}
                      ></div>
                    </div>

                    <div className="ml-1 flex w-10 items-center justify-end">
                      <span className="text-right text-xs font-medium text-gray-800">
                        {hourly.precipitationProbability || 0}
                      </span>
                      <span className="ml-0.5 text-xs font-medium text-gray-800">
                        %
                      </span>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* 습도 (2칸) */}
          <div className="rounded-lg bg-gray-50 p-3 lg:col-span-2">
            <h4 className="mb-2 text-sm font-medium text-gray-900">습도</h4>
            <div className="space-y-1">
              {forecast.hourlyShortTermForecasts
                .filter((_, index) => index % 3 === 0)
                .map((hourly, index) => (
                  <div key={index} className="flex items-center p-1 text-xs">
                    <span className="w-10 text-center font-medium text-gray-600">
                      {hourly.time.slice(0, 2)}시
                    </span>

                    <div className="ml-2 h-1.5 flex-1 rounded-full bg-gray-200">
                      <div
                        className="h-1.5 rounded-full bg-green-500 transition-all duration-300"
                        style={{ width: `${hourly.humidity || 0}%` }}
                      ></div>
                    </div>

                    <div className="ml-1 flex w-10 items-center justify-end">
                      <span className="text-right text-xs font-medium text-gray-800">
                        {hourly.humidity || 0}
                      </span>
                      <span className="ml-0.5 text-xs font-medium text-gray-800">
                        %
                      </span>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* 바람 정보 (4칸) */}
          <div className="rounded-lg bg-gray-50 p-3 lg:col-span-4">
            <h4 className="mb-2 text-sm font-medium text-gray-900">바람</h4>
            <div className="space-y-1">
              {forecast.hourlyShortTermForecasts
                .filter((_, index) => index % 3 === 0)
                .map((hourly, index) => (
                  <div key={index} className="flex items-center p-1 text-xs">
                    <span className="w-10 text-center font-medium text-gray-600">
                      {hourly.time.slice(0, 2)}시
                    </span>

                    <div className="ml-2 flex w-20 items-center gap-1">
                      {getWindArrow(
                        getWindDirection(
                          hourly.windDirection,
                          hourly.windUComponent,
                          hourly.windVComponent,
                        ),
                      )}
                      <span className="whitespace-nowrap text-xs text-gray-500">
                        {getWindDirectionText(
                          getWindDirection(
                            hourly.windDirection,
                            hourly.windUComponent,
                            hourly.windVComponent,
                          ),
                        )}
                      </span>
                    </div>

                    <div className="ml-2 h-1.5 flex-1 rounded-full bg-gray-200">
                      <div
                        className="h-1.5 rounded-full transition-all duration-300"
                        style={{
                          width: `${Math.min(((hourly.windSpeed || 0) / 15) * 100, 100)}%`,
                          backgroundColor: getWindSpeedColor(
                            hourly.windSpeed || 0,
                          ),
                        }}
                      ></div>
                    </div>

                    <div className="ml-1 flex w-12 items-center justify-end">
                      <span
                        className="text-right text-xs font-medium"
                        style={{
                          color: getWindSpeedColor(hourly.windSpeed || 0),
                        }}
                      >
                        {(hourly.windSpeed || 0).toFixed(1)}
                      </span>
                      <span
                        className="ml-0.5 text-xs font-medium"
                        style={{
                          color: getWindSpeedColor(hourly.windSpeed || 0),
                        }}
                      >
                        m/s
                      </span>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderTemperatureChart = (hourlyData: HourlyShortTermForecast[]) => {
    // 모바일에서는 3시간 간격 데이터만 사용 (mounted 후에만 적용)
    const filteredData =
      mounted && isMobile
        ? hourlyData.filter((_, index) => index % 3 === 0)
        : hourlyData;

    const maxTemp = Math.max(...filteredData.map((h) => h.temperature || 0));
    const minTemp = Math.min(...filteredData.map((h) => h.temperature || 0));
    const tempRange = maxTemp - minTemp || 10;

    const points = filteredData.map((hourly, index) => {
      const x = 20 + index * (760 / Math.max(filteredData.length - 1, 1));
      const y =
        140 - (((hourly.temperature || minTemp) - minTemp) / tempRange) * 100;
      return { x, y, temp: hourly.temperature, time: hourly.time };
    });

    // 부드러운 곡선을 위한 베지어 곡선 경로 생성
    const createPath = () => {
      if (points.length < 2) return "";

      let path = `M ${points[0].x},${points[0].y}`;

      for (let i = 0; i < points.length - 1; i++) {
        const current = points[i];
        const next = points[i + 1];
        const controlX1 = current.x + (next.x - current.x) * 0.3;
        const controlY1 = current.y;
        const controlX2 = next.x - (next.x - current.x) * 0.3;
        const controlY2 = next.y;

        path += ` C ${controlX1},${controlY1} ${controlX2},${controlY2} ${next.x},${next.y}`;
      }

      return path;
    };

    return (
      <g>
        {/* 배경 그리드 라인 */}
        {[0, 30, 60, 90, 120].map((y) => (
          <line
            key={y}
            x1="0"
            y1={20 + y}
            x2="800"
            y2={20 + y}
            stroke="#e5e7eb"
            strokeWidth="0.5"
            strokeDasharray="2,4"
          />
        ))}

        {/* 온도 라인 그라데이션 */}
        <defs>
          <linearGradient id="tempGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ef4444" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#ef4444" stopOpacity="0.05" />
          </linearGradient>
        </defs>

        {/* 영역 채우기 */}
        <path
          d={`${createPath()} L ${points[points.length - 1].x},150 L ${points[0].x},150 Z`}
          fill="url(#tempGradient)"
          opacity="0"
        >
          <animate
            attributeName="opacity"
            from="0"
            to="1"
            dur="0.3s"
            fill="freeze"
          />
        </path>

        {/* 온도 라인 */}
        <path
          d={createPath()}
          fill="none"
          stroke="#ef4444"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0"
        >
          <animate
            attributeName="opacity"
            from="0"
            to="1"
            dur="0.3s"
            fill="freeze"
          />
        </path>

        {/* 온도 점과 라벨 */}
        {points.map((point, index) => (
          <g key={index} opacity="0">
            <animate
              attributeName="opacity"
              from="0"
              to="1"
              dur="0.3s"
              begin={`${index * 0.02}s`}
              fill="freeze"
            />
            <circle
              cx={point.x}
              cy={point.y}
              r="4"
              fill="#ef4444"
              stroke="#fff"
              strokeWidth="2"
            />
            <text
              x={point.x}
              y={point.y - 10}
              textAnchor="middle"
              className="fill-red-600 text-xs font-bold"
            >
              {point.temp}°
            </text>
            {index % 3 === 0 && (
              <text
                x={point.x}
                y={165}
                textAnchor="middle"
                className="fill-gray-700 text-xs font-bold"
              >
                {point.time?.slice(0, 2)}시
              </text>
            )}
          </g>
        ))}
      </g>
    );
  };

  if (loading) {
    return (
      <PageLayout title="대시보드" description="데이터를 불러오는 중...">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-primary-600"></div>
            <p className="mt-4 text-gray-600">데이터를 불러오는 중...</p>
          </div>
        </div>
      </PageLayout>
    );
  }

  if (error) {
    return (
      <PageLayout title="대시보드" description="오류가 발생했습니다">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="mb-4 text-xl text-red-500">⚠️</div>
            <p className="text-red-600">{error}</p>
          </div>
        </div>
      </PageLayout>
    );
  }

  if (!dashboardData || !weatherData) {
    return (
      <PageLayout title="대시보드" description="데이터가 없습니다">
        <div className="flex items-center justify-center py-12">
          <p className="text-gray-600">표시할 데이터가 없습니다.</p>
        </div>
      </PageLayout>
    );
  }

  if (isLoading) {
    return (
      <PageLayout title="대시보드" description="로딩 중...">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
            <p className="mt-4 text-neutral-600">대시보드를 불러오는 중...</p>
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout
      title="대시보드"
      description="오늘의 비즈니스 현황을 한눈에 확인하세요"
    >
      {/* 알림 배너 - 메인 이벤트 */}
      {dashboardData?.sigunguMainEventInformation?.sigunguMainEvent && (
        <div className="mb-6 rounded-lg border border-primary-200 bg-primary-50 p-4">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0">
              <svg
                className="mt-0.5 h-5 w-5 text-primary-600"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-primary-900">
                {
                  dashboardData.sigunguMainEventInformation.sigunguMainEvent
                    .title
                }
              </h3>
              <p className="mt-1 text-sm text-primary-700">
                {
                  dashboardData.sigunguMainEventInformation.sigunguMainEvent
                    .startDate
                }{" "}
                ~{" "}
                {
                  dashboardData.sigunguMainEventInformation.sigunguMainEvent
                    .endDate
                }
              </p>
              <p className="text-sm text-primary-700">
                📍{" "}
                {
                  dashboardData.sigunguMainEventInformation.sigunguMainEvent
                    .address
                }
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 2열 그리드 레이아웃 */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* 첫 번째 행 - 날씨 카드 */}
        <div className="rounded-lg bg-white shadow lg:col-span-2">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">날씨 정보</h2>
              <div className="flex items-center gap-2">
                {weatherData?.data?.updatedDate && weatherCardExpanded && (
                  <span className="text-sm text-gray-500">
                    {(() => {
                      const date = new Date(weatherData.data.updatedDate);
                      const year = date.getFullYear();
                      const month = String(date.getMonth() + 1).padStart(
                        2,
                        "0",
                      );
                      const day = String(date.getDate()).padStart(2, "0");
                      const hour = String(date.getHours()).padStart(2, "0");
                      const minute = String(date.getMinutes()).padStart(2, "0");

                      // 모바일에서는 짧은 형식, 데스크톱에서는 긴 형식
                      return (
                        <>
                          <span className="hidden sm:inline">
                            업데이트: {year}년 {month}월 {day}일 {hour}:{minute}
                          </span>
                          <span className="inline sm:hidden">
                            {year}.{month}.{day} {hour}:{minute}
                          </span>
                        </>
                      );
                    })()}
                  </span>
                )}
                {weatherCardExpanded && (
                  <button
                    onClick={async () => {
                      setWeatherRefreshing(true);
                      try {
                        const weatherResponse = await getShortTermForecast();
                        if (
                          weatherResponse.code === "SUCCESS" &&
                          weatherResponse.data
                        ) {
                          setWeatherData(weatherResponse);
                        }
                      } catch {
                        setError("날씨 데이터 새로고침에 실패했습니다.");
                      } finally {
                        setWeatherRefreshing(false);
                      }
                    }}
                    disabled={weatherRefreshing}
                    className="rounded-md p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 disabled:cursor-not-allowed disabled:opacity-50"
                    title="날씨 정보 새로고침"
                  >
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                      />
                    </svg>
                  </button>
                )}
                <button
                  onClick={() => setWeatherCardExpanded(!weatherCardExpanded)}
                  className="rounded-md p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
                  title={weatherCardExpanded ? "접기" : "펼치기"}
                >
                  <svg
                    className={`h-5 w-5 transition-transform duration-200 ${weatherCardExpanded ? "" : "rotate-180"}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 15l7-7 7 7"
                    />
                  </svg>
                </button>
              </div>
            </div>

            {/* 날씨 탭 - 카드가 펼쳐졌을 때만 표시 */}
            {weatherCardExpanded && (
              <>
                <div className="mb-6 mt-4 flex space-x-1 rounded-lg bg-gray-100 p-1">
                  {[
                    { key: "all", label: "전체" },
                    { key: "today", label: "오늘" },
                    { key: "tomorrow", label: "내일" },
                    { key: "dayAfter", label: "모레" },
                  ].map((tab) => (
                    <button
                      key={tab.key}
                      onClick={() =>
                        setSelectedWeatherTab(
                          tab.key as "all" | "today" | "tomorrow" | "dayAfter",
                        )
                      }
                      className={`flex-1 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                        selectedWeatherTab === tab.key
                          ? "bg-white text-blue-600 shadow-sm"
                          : "text-gray-600 hover:text-gray-900"
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* 날씨 내용 */}
                {weatherRefreshing ? (
                  <div className="animate-pulse">
                    {selectedWeatherTab === "all" ? (
                      // 전체 탭 스켈레톤
                      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
                        {[1, 2, 3].map((i) => (
                          <div key={i} className="rounded-lg bg-gray-200 p-3">
                            <div className="mb-2 flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className="h-8 w-8 rounded-full bg-gray-300"></div>
                                <div className="space-y-1">
                                  <div className="h-4 w-12 rounded bg-gray-300"></div>
                                  <div className="h-3 w-16 rounded bg-gray-300"></div>
                                </div>
                              </div>
                              <div className="h-5 w-20 rounded bg-gray-300"></div>
                            </div>
                            <div className="grid grid-cols-3 gap-2 border-t border-gray-300 pt-2">
                              {[1, 2, 3].map((j) => (
                                <div key={j} className="text-center">
                                  <div className="mx-auto mb-1 h-3 w-16 rounded bg-gray-300"></div>
                                  <div className="mx-auto h-4 w-10 rounded bg-gray-300"></div>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      // 상세 탭 스켈레톤
                      <div className="space-y-4">
                        {/* 온도 차트 스켈레톤 */}
                        <div className="grid grid-cols-1 gap-3 xl:grid-cols-10">
                          <div className="rounded-lg bg-gray-200 p-3 xl:col-span-8">
                            <div className="mb-2 h-5 w-24 rounded bg-gray-300"></div>
                            <div className="h-48 rounded bg-gray-300"></div>
                          </div>
                          <div className="flex flex-col gap-2 md:flex-row xl:col-span-2 xl:flex-col">
                            {[1, 2, 3, 4].map((i) => (
                              <div
                                key={i}
                                className="flex-1 rounded-lg bg-gray-200 p-3"
                              >
                                <div className="mb-2 h-4 w-20 rounded bg-gray-300"></div>
                                <div className="ml-auto h-6 w-16 rounded bg-gray-300"></div>
                              </div>
                            ))}
                          </div>
                        </div>
                        {/* 하단 정보 스켈레톤 */}
                        <div className="grid grid-cols-1 gap-4 lg:grid-cols-10">
                          <div className="rounded-lg bg-gray-200 p-3 lg:col-span-4">
                            <div className="mb-2 h-5 w-12 rounded bg-gray-300"></div>
                            <div className="space-y-2">
                              {[1, 2, 3].map((i) => (
                                <div
                                  key={i}
                                  className="h-6 rounded bg-gray-300"
                                ></div>
                              ))}
                            </div>
                          </div>
                          <div className="rounded-lg bg-gray-200 p-3 lg:col-span-2">
                            <div className="mb-2 h-5 w-12 rounded bg-gray-300"></div>
                            <div className="space-y-2">
                              {[1, 2, 3].map((i) => (
                                <div
                                  key={i}
                                  className="h-6 rounded bg-gray-300"
                                ></div>
                              ))}
                            </div>
                          </div>
                          <div className="rounded-lg bg-gray-200 p-3 lg:col-span-4">
                            <div className="mb-2 h-5 w-12 rounded bg-gray-300"></div>
                            <div className="space-y-2">
                              {[1, 2, 3].map((i) => (
                                <div
                                  key={i}
                                  className="h-6 rounded bg-gray-300"
                                ></div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  renderWeatherContent()
                )}
              </>
            )}
          </div>

          {/* Footer - API 제공 정보 */}
          {weatherCardExpanded && (
            <div className="px-6 py-3">
              <div className="flex items-center justify-end text-xs text-gray-500">
                <svg
                  className="mr-1 h-3 w-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>데이터 제공: 기상청</span>
              </div>
            </div>
          )}
        </div>

        {/* 첫 번째 행 - 방문객 통계 */}
        <div className="rounded-lg bg-white p-6 shadow">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">
            작년 동기 방문객 통계
          </h2>
          {visitorStatisticsData &&
          visitorStatisticsData.visitorStatistics &&
          visitorStatisticsData.visitorStatistics.length > 0 ? (
            <div className="relative h-64">
              {/* 범례 */}
              <div className="mb-4 flex justify-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-blue-500"></div>
                  <span className="text-sm text-gray-600">지역 방문객</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-green-500"></div>
                  <span className="text-sm text-gray-600">국내 방문객</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-purple-500"></div>
                  <span className="text-sm text-gray-600">해외 방문객</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-orange-500"></div>
                  <span className="text-sm font-medium text-gray-600">
                    총 방문객
                  </span>
                </div>
              </div>

              {/* 차트 SVG */}
              <svg className="h-48 w-full" viewBox="0 0 600 200">
                {/* 배경 그리드 */}
                <defs>
                  <pattern
                    id="grid"
                    width="60"
                    height="40"
                    patternUnits="userSpaceOnUse"
                  >
                    <path
                      d="M 60 0 L 0 0 0 40"
                      fill="none"
                      stroke="#e5e7eb"
                      strokeWidth="1"
                      strokeDasharray="3,3"
                    />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />

                {/* 데이터 라인 */}
                {renderChart()}

                {/* X축 라벨 */}
                {visitorStatisticsData &&
                  visitorStatisticsData.visitorStatistics &&
                  visitorStatisticsData.visitorStatistics.map((stat, index) => {
                    const x = 50 + index * 80;
                    const date = new Date(stat.date);
                    return (
                      <text
                        key={index}
                        x={x}
                        y={190}
                        textAnchor="middle"
                        className="fill-gray-600 text-xs"
                      >
                        {date.getMonth() + 1}/{date.getDate()}
                      </text>
                    );
                  })}
              </svg>

              {/* 호버 툴팁 */}
              <div
                className="pointer-events-none absolute bottom-2 left-2 rounded bg-gray-800 p-2 text-xs text-white opacity-0 transition-opacity"
                id="tooltip"
              >
                <div id="tooltip-content"></div>
              </div>
            </div>
          ) : (
            <div className="flex h-64 items-center justify-center text-gray-500">
              <div className="text-center">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
                <p className="mt-2 text-sm">
                  방문객 통계 데이터를 불러올 수 없습니다
                </p>
              </div>
            </div>
          )}
        </div>

        {/* 두 번째 행 - 관광지 랭킹 (2칸 차지) */}
        <div className="rounded-lg bg-white p-6 shadow lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">
              지난달 인기 관광지 TOP 100
            </h2>
            <div className="flex items-center gap-3">
              {/* 카테고리 필터 */}
              <select
                value={selectedCategory}
                onChange={(e) => {
                  setSelectedCategory(e.target.value);
                  if (e.target.value === "") setSelectedSubCategory("");
                }}
                className="rounded-md border border-gray-300 px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="">대분류</option>
                {getUniqueCategories().map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>

              {/* 서브 카테고리 필터 */}
              <select
                value={selectedSubCategory}
                onChange={(e) => setSelectedSubCategory(e.target.value)}
                className="rounded-md border border-gray-300 px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                disabled={!selectedCategory}
              >
                <option value="">소분류</option>
                {getUniqueSubCategories().map((subCategory) => (
                  <option key={subCategory} value={subCategory}>
                    {subCategory}
                  </option>
                ))}
              </select>

              {/* 초기화 버튼 */}
              <button
                onClick={resetFilters}
                className="flex items-center gap-1 rounded-md bg-gray-100 px-3 py-1 text-sm text-gray-700 transition-colors hover:bg-gray-200"
              >
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                초기화
              </button>
            </div>
          </div>
          <div className="flex h-[600px] gap-6">
            {/* 왼쪽: 랭킹 리스트 */}
            <div className="w-1/2">
              <div className="h-full space-y-2 overflow-y-auto pr-4">
                {getFilteredAttractions().map((attraction, index) => {
                  const originalIndex =
                    dashboardData?.lastMonthlyTouristAttractionRankingInformation?.lastMonthlyTouristAttractionRankingList?.findIndex(
                      (item) => item.rank === attraction.rank,
                    ) ?? -1;
                  return (
                    <div
                      key={`${attraction.rank}-${attraction.name}-${index}`}
                      className={`flex cursor-pointer items-center gap-3 rounded-lg p-3 transition-colors ${
                        selectedAttraction === originalIndex
                          ? "border-2 border-primary-300 bg-primary-100"
                          : "bg-gray-50 hover:bg-gray-100"
                      }`}
                      onClick={() =>
                        handleAttractionClick(attraction, originalIndex)
                      }
                    >
                      <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary-600 text-sm font-bold text-white">
                        {attraction.rank}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="truncate font-medium text-gray-900">
                          {attraction.name}
                        </div>
                        <div className="text-sm text-gray-600">
                          {attraction.category}
                          {attraction.subCategory
                            ? ` > ${attraction.subCategory}`
                            : ""}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 오른쪽: 카카오 맵 */}
            <div className="w-1/2">
              <div
                ref={mapRef}
                className="h-full w-full rounded-lg bg-gray-200"
                style={{ minHeight: "400px" }}
              ></div>
            </div>
          </div>
        </div>

        {/* 세 번째 행 - 진행 중/예정 이벤트 (2칸 차지) */}
        <div className="rounded-lg bg-white p-6 shadow lg:col-span-2">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">
            이달 진행/예정 이벤트
          </h2>
          <div className="flex h-[600px] gap-6">
            {/* 왼쪽: 이벤트 그리드 */}
            <div className="w-3/5">
              <div className="h-full overflow-y-auto pr-4">
                <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
                  {dashboardData?.ongoingOrUpComingSigunguEventsFromTodayToMonthEndInformation?.sigunguEvents?.map(
                    (event: LocationEvent, index: number) => {
                      const today = new Date().toISOString().split("T")[0];
                      const isOngoing =
                        event.startDate <= today && event.endDate >= today;
                      const isUpcoming = event.startDate > today;

                      return (
                        <div
                          key={index}
                          className={`group cursor-pointer overflow-hidden rounded-lg border transition-all hover:shadow-lg ${
                            selectedEvent === index
                              ? "border-primary-400 shadow-md"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                          onClick={() => handleEventClick(event, index)}
                        >
                          {/* 이벤트 이미지 */}
                          <div className="relative h-40 bg-gray-200">
                            <img
                              src={
                                event.originalImageUrl ||
                                event.thumbnailImageUrl
                              }
                              alt={event.title}
                              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                              onError={(e) => {
                                const target =
                                  e.currentTarget as HTMLImageElement;
                                target.src = event.thumbnailImageUrl;
                                target.onerror = () => {
                                  target.style.display = "none";
                                  const placeholder =
                                    target.parentElement?.querySelector(
                                      ".placeholder",
                                    );
                                  if (placeholder)
                                    placeholder.classList.remove("hidden");
                                };
                              }}
                            />
                            <div className="placeholder absolute inset-0 flex hidden items-center justify-center">
                              <svg
                                className="h-12 w-12 text-gray-400"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </div>

                            {/* 상태 배지 */}
                            <div className="absolute right-3 top-3">
                              {isOngoing && (
                                <span className="inline-flex items-center rounded-full bg-red-500 px-2.5 py-0.5 text-xs font-medium text-white shadow-lg">
                                  <span className="mr-1.5 h-1.5 w-1.5 animate-pulse rounded-full bg-white"></span>
                                  진행 중
                                </span>
                              )}
                              {isUpcoming && (
                                <span className="inline-flex items-center rounded-full bg-blue-500 px-2.5 py-0.5 text-xs font-medium text-white shadow-lg">
                                  <svg
                                    className="mr-1 h-3 w-3"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                  >
                                    <path
                                      fillRule="evenodd"
                                      d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                                      clipRule="evenodd"
                                    />
                                  </svg>
                                  예정
                                </span>
                              )}
                            </div>
                          </div>

                          {/* 이벤트 정보 */}
                          <div className="p-4">
                            <h3 className="mb-3 line-clamp-2 text-sm font-semibold leading-tight text-gray-900">
                              {event.title}
                            </h3>

                            <div className="space-y-2">
                              <div className="flex items-center gap-2 text-xs text-gray-600">
                                <svg
                                  className="h-4 w-4 text-gray-400"
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                                <span className="font-medium">
                                  {event.startDate}
                                </span>
                                <span className="text-gray-400">~</span>
                                <span className="font-medium">
                                  {event.endDate}
                                </span>
                              </div>

                              <div className="flex items-start gap-2 text-xs text-gray-600">
                                <svg
                                  className="mt-0.5 h-4 w-4 flex-shrink-0 text-gray-400"
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                                <span className="line-clamp-2 leading-tight">
                                  {event.address}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    },
                  )}
                </div>
              </div>
            </div>

            {/* 오른쪽: 이벤트 지도 */}
            <div className="w-2/5">
              <div className="relative h-full overflow-hidden rounded-lg bg-gray-200">
                <div ref={eventMapRef} className="h-full w-full"></div>

                {/* 선택된 이벤트 정보 오버레이 */}
                {selectedEvent !== null &&
                  dashboardData
                    ?.ongoingOrUpComingSigunguEventsFromTodayToMonthEndInformation
                    ?.sigunguEvents?.[selectedEvent] && (
                    <div className="absolute bottom-4 left-4 right-4 rounded-lg border bg-white p-3 shadow-lg">
                      <div className="flex items-start gap-3">
                        <img
                          src={
                            dashboardData
                              .ongoingOrUpComingSigunguEventsFromTodayToMonthEndInformation
                              .sigunguEvents[selectedEvent].thumbnailImageUrl
                          }
                          alt={
                            dashboardData
                              .ongoingOrUpComingSigunguEventsFromTodayToMonthEndInformation
                              .sigunguEvents[selectedEvent].title
                          }
                          className="h-12 w-12 rounded object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = "none";
                          }}
                        />
                        <div className="min-w-0 flex-1">
                          <h4 className="line-clamp-1 text-sm font-medium text-gray-900">
                            {
                              dashboardData
                                .ongoingOrUpComingSigunguEventsFromTodayToMonthEndInformation
                                .sigunguEvents[selectedEvent].title
                            }
                          </h4>
                          <p className="mt-1 text-xs text-gray-600">
                            {
                              dashboardData
                                .ongoingOrUpComingSigunguEventsFromTodayToMonthEndInformation
                                .sigunguEvents[selectedEvent].startDate
                            }{" "}
                            ~{" "}
                            {
                              dashboardData
                                .ongoingOrUpComingSigunguEventsFromTodayToMonthEndInformation
                                .sigunguEvents[selectedEvent].endDate
                            }
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Script
        src={`https://dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_MAP_KEY}&autoload=false`}
        onLoad={initializeMap}
      />
    </PageLayout>
  );

  function initializeMap() {
    if (typeof window !== "undefined" && window.kakao && window.kakao.maps) {
      window.kakao.maps.load(() => {
        // 관광지 지도
        if (mapRef.current && dashboardData) {
          const mapOption = {
            center: new window.kakao.maps.LatLng(37.5665, 126.978), // 서울 중심
            level: 8,
          };

          const map = new window.kakao.maps.Map(mapRef.current, mapOption);
          mapInstanceRef.current = map;

          // 마커 생성
          createMarkers(map);
        }

        // 이벤트 지도
        if (eventMapRef.current && dashboardData) {
          const eventMapOption = {
            center: new window.kakao.maps.LatLng(37.5665, 126.978), // 서울 중심
            level: 6,
          };

          const eventMap = new window.kakao.maps.Map(
            eventMapRef.current,
            eventMapOption,
          );
          eventMapInstanceRef.current = eventMap;

          // 이벤트 마커 생성
          createEventMarkers(eventMap);
        }
      });
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function createMarkers(map: any) {
    if (!dashboardData) return;

    // 기존 마커 제거
    markersRef.current.forEach((marker) => marker.setMap(null));
    markersRef.current = [];

    const filteredAttractions = getFilteredAttractions();

    filteredAttractions.forEach((attraction) => {
      const markerPosition = new window.kakao.maps.LatLng(
        attraction.latitude,
        attraction.longitude,
      );

      const marker = new window.kakao.maps.Marker({
        position: markerPosition,
        title: attraction.name,
      });

      marker.setMap(map);
      markersRef.current.push(marker);

      // 마커 클릭 이벤트
      const originalIndex =
        dashboardData?.lastMonthlyTouristAttractionRankingInformation?.lastMonthlyTouristAttractionRankingList?.findIndex(
          (item) => item.rank === attraction.rank,
        ) ?? -1;
      window.kakao.maps.event.addListener(marker, "click", () => {
        setSelectedAttraction(originalIndex);
      });
    });
  }

  function handleAttractionClick(
    attraction: TouristAttractionRanking,
    index: number,
  ) {
    setSelectedAttraction(index);

    if (mapInstanceRef.current) {
      const moveLatLon = new window.kakao.maps.LatLng(
        attraction.latitude,
        attraction.longitude,
      );
      mapInstanceRef.current.setCenter(moveLatLon);
      mapInstanceRef.current.setLevel(4);
    }
  }

  function handleEventClick(event: LocationEvent, index: number) {
    setSelectedEvent(index);

    if (eventMapInstanceRef.current) {
      const moveLatLon = new window.kakao.maps.LatLng(
        event.latitude,
        event.longitude,
      );
      eventMapInstanceRef.current.setCenter(moveLatLon);
      eventMapInstanceRef.current.setLevel(5);
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function createEventMarkers(map: any) {
    if (
      !dashboardData
        ?.ongoingOrUpComingSigunguEventsFromTodayToMonthEndInformation
        ?.sigunguEvents
    )
      return;

    // 기존 마커 제거
    eventMarkersRef.current.forEach((marker) => marker.setMap(null));
    eventMarkersRef.current = [];

    dashboardData.ongoingOrUpComingSigunguEventsFromTodayToMonthEndInformation.sigunguEvents.forEach(
      (event, index) => {
        const markerPosition = new window.kakao.maps.LatLng(
          event.latitude,
          event.longitude,
        );

        // 커스텀 마커 이미지 (축제 아이콘)
        const imageSize = new window.kakao.maps.Size(30, 35);
        const imageOption = { offset: new window.kakao.maps.Point(15, 35) };

        // 선택된 이벤트면 다른 색상으로 표시
        const markerImageSrc =
          selectedEvent === index
            ? "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAiIGhlaWdodD0iMzUiIHZpZXdCb3g9IjAgMCAzMCAzNSIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTE1IDM1TDI1IDIwQzI1IDE0LjQ3NzIgMjAuNTIyOCAxMCAxNSAxMEM5LjQ3NzE1IDEwIDUgMTQuNDc3MiA1IDIwTDE1IDM1WiIgZmlsbD0iI0Y5NzMxNiIgc3Ryb2tlPSIjRkZGIiBzdHJva2Utd2lkdGg9IjIiLz4KPHN2ZyB4PSI5IiB5PSIxMyIgd2lkdGg9IjEyIiBoZWlnaHQ9IjEyIiB2aWV3Qm94PSIwIDAgMjQgMjQiIGZpbGw9IndoaXRlIj4KPHN2ZyBmaWxsPSJjdXJyZW50Q29sb3IiIHZpZXdCb3g9IjAgMCAyNCAyNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDJMMTMuMDkgOC4yNkwyMSA5TDEzLjA5IDE1Ljc0TDEyIDIyTDEwLjkxIDE1Ljc0TDMgOUwxMC45MSA4LjI2TDEyIDJaIi8+Cjwvc3ZnPgo8L3N2Zz4KPC9zdmc+"
            : "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAiIGhlaWdodD0iMzUiIHZpZXdCb3g9IjAgMCAzMCAzNSIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTE1IDM1TDI1IDIwQzI1IDE0LjQ3NzIgMjAuNTIyOCAxMCAxNSAxMEM5LjQ3NzE1IDEwIDUgMTQuNDc3MiA1IDIwTDE1IDM1WiIgZmlsbD0iIzEwQjk4MSIgc3Ryb2tlPSIjRkZGIiBzdHJva2Utd2lkdGg9IjIiLz4KPHN2ZyB4PSI5IiB5PSIxMyIgd2lkdGg9IjEyIiBoZWlnaHQ9IjEyIiB2aWV3Qm94PSIwIDAgMjQgMjQiIGZpbGw9IndoaXRlIj4KPHN2ZyBmaWxsPSJjdXJyZW50Q29sb3IiIHZpZXdCb3g9IjAgMCAyNCAyNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDJMMTMuMDkgOC4yNkwyMSA5TDEzLjA5IDE1Ljc0TDEyIDIyTDEwLjkxIDE1Ljc0TDMgOUwxMC45MSA4LjI2TDEyIDJaIi8+Cjwvc3ZnPgo8L3N2Zz4KPC9zdmc+";

        const markerImage = new window.kakao.maps.MarkerImage(
          markerImageSrc,
          imageSize,
          imageOption,
        );

        const marker = new window.kakao.maps.Marker({
          position: markerPosition,
          title: event.title,
          image: markerImage,
        });

        marker.setMap(map);
        eventMarkersRef.current.push(marker);

        // 마커 클릭 이벤트
        window.kakao.maps.event.addListener(marker, "click", () => {
          setSelectedEvent(index);
        });
      },
    );
  }
}

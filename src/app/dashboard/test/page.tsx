"use client";

import { useEffect, useState, useRef } from "react";
import { getDashboardTest } from "@/app/lib/api/dashboard/dashboard";
import { GetDashboardInformationResponse, DailyWeather, LocationEvent, TouristAttractionRanking, VisitorStatistics } from "@/types/dashboard/getDashboardInformationResponse";
import { PageLayout } from "@/components/dashboard/PageLayout";
import Script from "next/script";

declare global {
  interface Window {
    kakao: any;
  }
}

export default function DashboardPage() {
  const [dashboardData, setDashboardData] = useState<GetDashboardInformationResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedAttraction, setSelectedAttraction] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>("");
  const [selectedEvent, setSelectedEvent] = useState<number | null>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const eventMapRef = useRef<HTMLDivElement>(null);
  const eventMapInstanceRef = useRef<any>(null);
  const eventMarkersRef = useRef<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getDashboardTest();
        if (response.code === "SUCCESS" && response.data) {
          setDashboardData(response.data);
        } else {
          setError("데이터를 불러오는데 실패했습니다.");
        }
      } catch (err) {
        setError("API 호출 중 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (dashboardData && mapInstanceRef.current) {
      createMarkers(mapInstanceRef.current);
    }
  }, [dashboardData, selectedCategory, selectedSubCategory]);

  useEffect(() => {
    if (dashboardData && eventMapInstanceRef.current) {
      createEventMarkers(eventMapInstanceRef.current);
    }
  }, [dashboardData, selectedEvent]);

  function getUniqueCategories(): string[] {
    if (!dashboardData) return [];
    const categories = new Set(
      dashboardData.lastMonthlyTouristAttractionRankingInformation.lastMonthlyTouristAttractionRankingList
        .map(attraction => attraction.category)
    );
    return Array.from(categories).sort();
  }

  function getUniqueSubCategories(): string[] {
    if (!dashboardData || !selectedCategory) return [];
    const subCategories = new Set(
      dashboardData.lastMonthlyTouristAttractionRankingInformation.lastMonthlyTouristAttractionRankingList
        .filter(attraction => attraction.category === selectedCategory)
        .map(attraction => attraction.subCategory)
    );
    return Array.from(subCategories).sort();
  }

  function getFilteredAttractions(): TouristAttractionRanking[] {
    if (!dashboardData) return [];
    
    let filtered = dashboardData.lastMonthlyTouristAttractionRankingInformation.lastMonthlyTouristAttractionRankingList;
    
    if (selectedCategory) {
      filtered = filtered.filter(attraction => attraction.category === selectedCategory);
    }
    
    if (selectedSubCategory) {
      filtered = filtered.filter(attraction => attraction.subCategory === selectedSubCategory);
    }
    
    return filtered;
  }

  function resetFilters() {
    setSelectedCategory("");
    setSelectedSubCategory("");
    setSelectedAttraction(null);
  }

  function getChartData() {
    if (!dashboardData) return [];
    
    return dashboardData.lastYearSameWeekVisitorStatisticsInformation.visitorStatistics.map(stat => ({
      date: stat.date,
      localVisitors: stat.localVisitors,
      domesticVisitors: stat.domesticVisitors,
      foreignVisitors: stat.foreignVisitors
    }));
  }

  function getMaxValue() {
    if (!dashboardData) return 0;
    
    const stats = dashboardData.lastYearSameWeekVisitorStatisticsInformation.visitorStatistics;
    let max = 0;
    stats.forEach(stat => {
      const total = stat.localVisitors + stat.domesticVisitors + stat.foreignVisitors;
      max = Math.max(max, stat.localVisitors, stat.domesticVisitors, stat.foreignVisitors, total);
    });
    return max;
  }

  function renderChart() {
    if (!dashboardData) return null;
    
    const stats = dashboardData.lastYearSameWeekVisitorStatisticsInformation.visitorStatistics;
    const maxValue = getMaxValue();
    const height = 150; // 차트 높이
    const width = 500; // 차트 너비
    
    // 각 라인의 포인트들을 생성
    const localPoints = stats.map((stat, index) => {
      const x = 50 + (index * 80);
      const y = height - (stat.localVisitors / maxValue) * height + 20;
      return `${x},${y}`;
    }).join(' ');
    
    const domesticPoints = stats.map((stat, index) => {
      const x = 50 + (index * 80);
      const y = height - (stat.domesticVisitors / maxValue) * height + 20;
      return `${x},${y}`;
    }).join(' ');
    
    const foreignPoints = stats.map((stat, index) => {
      const x = 50 + (index * 80);
      const y = height - (stat.foreignVisitors / maxValue) * height + 20;
      return `${x},${y}`;
    }).join(' ');
    
    const totalPoints = stats.map((stat, index) => {
      const x = 50 + (index * 80);
      const total = stat.localVisitors + stat.domesticVisitors + stat.foreignVisitors;
      const y = height - (total / maxValue) * height + 20;
      return `${x},${y}`;
    }).join(' ');
    
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
          const x = 50 + (index * 80);
          const localY = height - (stat.localVisitors / maxValue) * height + 20;
          const domesticY = height - (stat.domesticVisitors / maxValue) * height + 20;
          const foreignY = height - (stat.foreignVisitors / maxValue) * height + 20;
          const total = stat.localVisitors + stat.domesticVisitors + stat.foreignVisitors;
          const totalY = height - (total / maxValue) * height + 20;
          
          return (
            <g key={index}>
              <circle cx={x} cy={localY} r="4" fill="#3B82F6" className="hover:r-6 cursor-pointer" />
              <circle cx={x} cy={domesticY} r="4" fill="#10B981" className="hover:r-6 cursor-pointer" />
              <circle cx={x} cy={foreignY} r="4" fill="#8B5CF6" className="hover:r-6 cursor-pointer" />
              <circle cx={x} cy={totalY} r="5" fill="#F97316" stroke="#fff" strokeWidth="2" className="hover:r-7 cursor-pointer" />
              
              {/* 투명한 호버 영역 */}
              <rect 
                x={x - 15} 
                y="0" 
                width="30" 
                height={height + 20}
                fill="transparent"
                className="cursor-pointer"
                onMouseEnter={(e) => showTooltip(e, stat, index)}
                onMouseLeave={hideTooltip}
              />
            </g>
          );
        })}
      </g>
    );
  }

  function showTooltip(e: React.MouseEvent, stat: VisitorStatistics, index: number) {
    const tooltip = document.getElementById('tooltip');
    const tooltipContent = document.getElementById('tooltip-content');
    
    if (tooltip && tooltipContent) {
      const date = new Date(stat.date);
      const total = stat.localVisitors + stat.domesticVisitors + stat.foreignVisitors;
      tooltipContent.innerHTML = `
        <div><strong>${date.toLocaleDateString('ko-KR', { month: 'short', day: 'numeric', weekday: 'short' })}</strong></div>
        <div>지역: ${stat.localVisitors.toLocaleString()}</div>
        <div>국내: ${stat.domesticVisitors.toLocaleString()}</div>
        <div>해외: ${stat.foreignVisitors.toLocaleString()}</div>
        <div style="border-top: 1px solid #374151; padding-top: 4px; margin-top: 4px;"><strong>총합: ${total.toLocaleString()}</strong></div>
      `;
      tooltip.classList.remove('opacity-0');
      tooltip.classList.add('opacity-100');
    }
  }

  function hideTooltip() {
    const tooltip = document.getElementById('tooltip');
    if (tooltip) {
      tooltip.classList.remove('opacity-100');
      tooltip.classList.add('opacity-0');
    }
  }

  const getWeatherIcon = (condition: string) => {
    switch (condition) {
      case "SUNNY":
        return "☀️";
      case "CLOUDY":
        return "☁️";
      case "PARTLY_CLOUDY":
        return "⛅";
      case "RAINY":
        return "🌧️";
      case "SHOWER":
        return "🌦️";
      case "THUNDERSTORM":
        return "⛈️";
      case "SNOW":
        return "❄️";
      case "FOG":
        return "🌫️";
      default:
        return "🌤️";
    }
  };

  if (loading) {
    return (
      <PageLayout title="대시보드" description="데이터를 불러오는 중...">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
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
            <div className="text-red-500 text-xl mb-4">⚠️</div>
            <p className="text-red-600">{error}</p>
          </div>
        </div>
      </PageLayout>
    );
  }

  if (!dashboardData) {
    return (
      <PageLayout title="대시보드" description="데이터가 없습니다">
        <div className="flex items-center justify-center py-12">
          <p className="text-gray-600">표시할 데이터가 없습니다.</p>
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
      {dashboardData.sigunguMainEventInformation.sigunguMainEvent && (
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
                {dashboardData.sigunguMainEventInformation.sigunguMainEvent.title}
              </h3>
              <p className="mt-1 text-sm text-primary-700">
                {dashboardData.sigunguMainEventInformation.sigunguMainEvent.startDate} ~ {dashboardData.sigunguMainEventInformation.sigunguMainEvent.endDate}
              </p>
              <p className="text-sm text-primary-700">
                📍 {dashboardData.sigunguMainEventInformation.sigunguMainEvent.address}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 2열 그리드 레이아웃 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 첫 번째 행 - 날씨 카드 */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">날씨 정보</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {dashboardData.weatherInformation.dailyWeatherList.map((weather: DailyWeather, index: number) => (
              <div key={index} className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-3xl mb-2">{getWeatherIcon(weather.condition)}</div>
                <div className="text-sm text-gray-600 mb-1">
                  {new Date(weather.date).toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' })}
                </div>
                <div className="text-lg font-semibold">
                  <span className="text-red-500">{weather.maximumTemperature}°</span> / <span className="text-blue-500">{weather.minimumTemperature}°</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 첫 번째 행 - 방문객 통계 */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">작년 동기 방문객 통계</h2>
          <div className="h-64 relative">
            {/* 범례 */}
            <div className="flex justify-center gap-4 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-sm text-gray-600">지역 방문객</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-600">국내 방문객</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                <span className="text-sm text-gray-600">해외 방문객</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                <span className="text-sm text-gray-600 font-medium">총 방문객</span>
              </div>
            </div>
            
            {/* 차트 SVG */}
            <svg className="w-full h-48" viewBox="0 0 600 200">
              {/* 배경 그리드 */}
              <defs>
                <pattern id="grid" width="60" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 60 0 L 0 0 0 40" fill="none" stroke="#e5e7eb" strokeWidth="1" strokeDasharray="3,3"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
              
              {/* 데이터 라인 */}
              {renderChart()}
              
              {/* X축 라벨 */}
              {dashboardData.lastYearSameWeekVisitorStatisticsInformation.visitorStatistics.map((stat, index) => {
                const x = 50 + (index * 80);
                const date = new Date(stat.date);
                return (
                  <text key={index} x={x} y={190} textAnchor="middle" className="text-xs fill-gray-600">
                    {date.getMonth() + 1}/{date.getDate()}
                  </text>
                );
              })}
            </svg>
            
            {/* 호버 툴팁 */}
            <div className="absolute bottom-2 left-2 bg-gray-800 text-white p-2 rounded text-xs opacity-0 pointer-events-none transition-opacity" id="tooltip">
              <div id="tooltip-content"></div>
            </div>
          </div>
        </div>

        {/* 두 번째 행 - 관광지 랭킹 (2칸 차지) */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">지난달 인기 관광지 TOP 100</h2>
            <div className="flex items-center gap-3">
              {/* 카테고리 필터 */}
              <select 
                value={selectedCategory} 
                onChange={(e) => {
                  setSelectedCategory(e.target.value);
                  if (e.target.value === "") setSelectedSubCategory("");
                }}
                className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="">대분류</option>
                {getUniqueCategories().map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
              
              {/* 서브 카테고리 필터 */}
              <select 
                value={selectedSubCategory} 
                onChange={(e) => setSelectedSubCategory(e.target.value)}
                className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                disabled={!selectedCategory}
              >
                <option value="">소분류</option>
                {getUniqueSubCategories().map(subCategory => (
                  <option key={subCategory} value={subCategory}>{subCategory}</option>
                ))}
              </select>
              
              {/* 초기화 버튼 */}
              <button
                onClick={resetFilters}
                className="flex items-center gap-1 px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md text-sm transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                초기화
              </button>
            </div>
          </div>
          <div className="flex gap-6 h-[600px]">
            {/* 왼쪽: 랭킹 리스트 */}
            <div className="w-1/2">
              <div className="h-full overflow-y-auto pr-4 space-y-2">
                {getFilteredAttractions()
                  .map((attraction, index) => {
                    const originalIndex = dashboardData.lastMonthlyTouristAttractionRankingInformation.lastMonthlyTouristAttractionRankingList.findIndex(
                      item => item.rank === attraction.rank
                    );
                    return (
                      <div 
                        key={attraction.rank} 
                        className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                          selectedAttraction === originalIndex 
                            ? 'bg-primary-100 border-2 border-primary-300' 
                            : 'bg-gray-50 hover:bg-gray-100'
                        }`}
                        onClick={() => handleAttractionClick(attraction, originalIndex)}
                      >
                        <div className="w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                          {attraction.rank}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-gray-900 truncate">{attraction.name}</div>
                          <div className="text-sm text-gray-600">{attraction.category} > {attraction.subCategory}</div>
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
                className="w-full h-full bg-gray-200 rounded-lg"
                style={{ minHeight: '400px' }}
              ></div>
            </div>
          </div>
        </div>

        {/* 세 번째 행 - 진행 중/예정 이벤트 (2칸 차지) */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">이달 진행/예정 이벤트</h2>
          <div className="flex gap-6 h-[600px]">
            {/* 왼쪽: 이벤트 그리드 */}
            <div className="w-3/5">
              <div className="h-full overflow-y-auto pr-4">
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                  {dashboardData.ongoingOrUpComingSigunguEventsFromTodayToMonthEndInformation.sigunguEvents.map((event: LocationEvent, index: number) => {
                    const today = new Date().toISOString().split('T')[0];
                    const isOngoing = event.startDate <= today && event.endDate >= today;
                    const isUpcoming = event.startDate > today;
                    
                    return (
                      <div 
                        key={index} 
                        className={`border rounded-lg overflow-hidden cursor-pointer transition-all hover:shadow-lg group ${
                          selectedEvent === index 
                            ? 'border-primary-400 shadow-md' 
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => handleEventClick(event, index)}
                      >
                        {/* 이벤트 이미지 */}
                        <div className="relative h-40 bg-gray-200">
                          <img 
                            src={event.originalImageUrl || event.thumbnailImageUrl} 
                            alt={event.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            onError={(e) => {
                              const target = e.currentTarget as HTMLImageElement;
                              target.src = event.thumbnailImageUrl;
                              target.onerror = () => {
                                target.style.display = 'none';
                                const placeholder = target.parentElement?.querySelector('.placeholder');
                                if (placeholder) placeholder.classList.remove('hidden');
                              };
                            }}
                          />
                          <div className="placeholder hidden absolute inset-0 flex items-center justify-center">
                            <svg className="w-12 h-12 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                            </svg>
                          </div>
                          
                          {/* 상태 배지 */}
                          <div className="absolute top-3 right-3">
                            {isOngoing && (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-500 text-white shadow-lg">
                                <span className="w-1.5 h-1.5 bg-white rounded-full mr-1.5 animate-pulse"></span>
                                진행 중
                              </span>
                            )}
                            {isUpcoming && (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-500 text-white shadow-lg">
                                <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                                </svg>
                                예정
                              </span>
                            )}
                          </div>
                        </div>
                        
                        {/* 이벤트 정보 */}
                        <div className="p-4">
                          <h3 className="font-semibold text-gray-900 text-sm leading-tight mb-3 line-clamp-2">
                            {event.title}
                          </h3>
                          
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 text-xs text-gray-600">
                              <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                              </svg>
                              <span className="font-medium">{event.startDate}</span>
                              <span className="text-gray-400">~</span>
                              <span className="font-medium">{event.endDate}</span>
                            </div>
                            
                            <div className="flex items-start gap-2 text-xs text-gray-600">
                              <svg className="w-4 h-4 mt-0.5 text-gray-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                              </svg>
                              <span className="line-clamp-2 leading-tight">{event.address}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
            
            {/* 오른쪽: 이벤트 지도 */}
            <div className="w-2/5">
              <div className="h-full bg-gray-200 rounded-lg relative overflow-hidden">
                <div 
                  ref={eventMapRef} 
                  className="w-full h-full"
                ></div>
                
                {/* 선택된 이벤트 정보 오버레이 */}
                {selectedEvent !== null && (
                  <div className="absolute bottom-4 left-4 right-4 bg-white rounded-lg shadow-lg p-3 border">
                    <div className="flex items-start gap-3">
                      <img 
                        src={dashboardData.ongoingOrUpComingSigunguEventsFromTodayToMonthEndInformation.sigunguEvents[selectedEvent].thumbnailImageUrl}
                        alt={dashboardData.ongoingOrUpComingSigunguEventsFromTodayToMonthEndInformation.sigunguEvents[selectedEvent].title}
                        className="w-12 h-12 object-cover rounded"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm text-gray-900 line-clamp-1">
                          {dashboardData.ongoingOrUpComingSigunguEventsFromTodayToMonthEndInformation.sigunguEvents[selectedEvent].title}
                        </h4>
                        <p className="text-xs text-gray-600 mt-1">
                          {dashboardData.ongoingOrUpComingSigunguEventsFromTodayToMonthEndInformation.sigunguEvents[selectedEvent].startDate} ~ {dashboardData.ongoingOrUpComingSigunguEventsFromTodayToMonthEndInformation.sigunguEvents[selectedEvent].endDate}
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
    if (typeof window !== 'undefined' && window.kakao && window.kakao.maps) {
      window.kakao.maps.load(() => {
        // 관광지 지도
        if (mapRef.current && dashboardData) {
          const mapOption = {
            center: new window.kakao.maps.LatLng(37.5665, 126.9780), // 서울 중심
            level: 8
          };
          
          const map = new window.kakao.maps.Map(mapRef.current, mapOption);
          mapInstanceRef.current = map;
          
          // 마커 생성
          createMarkers(map);
        }
        
        // 이벤트 지도
        if (eventMapRef.current && dashboardData) {
          const eventMapOption = {
            center: new window.kakao.maps.LatLng(37.5665, 126.9780), // 서울 중심
            level: 6
          };
          
          const eventMap = new window.kakao.maps.Map(eventMapRef.current, eventMapOption);
          eventMapInstanceRef.current = eventMap;
          
          // 이벤트 마커 생성
          createEventMarkers(eventMap);
        }
      });
    }
  }

  function createMarkers(map: any) {
    if (!dashboardData) return;
    
    // 기존 마커 제거
    markersRef.current.forEach(marker => marker.setMap(null));
    markersRef.current = [];
    
    const filteredAttractions = getFilteredAttractions();
    
    filteredAttractions.forEach((attraction) => {
      const markerPosition = new window.kakao.maps.LatLng(attraction.latitude, attraction.longitude);
      
      const marker = new window.kakao.maps.Marker({
        position: markerPosition,
        title: attraction.name
      });
      
      marker.setMap(map);
      markersRef.current.push(marker);
      
      // 마커 클릭 이벤트
      const originalIndex = dashboardData.lastMonthlyTouristAttractionRankingInformation.lastMonthlyTouristAttractionRankingList.findIndex(
        item => item.rank === attraction.rank
      );
      window.kakao.maps.event.addListener(marker, 'click', () => {
        setSelectedAttraction(originalIndex);
      });
    });
  }

  function handleAttractionClick(attraction: TouristAttractionRanking, index: number) {
    setSelectedAttraction(index);
    
    if (mapInstanceRef.current) {
      const moveLatLon = new window.kakao.maps.LatLng(attraction.latitude, attraction.longitude);
      mapInstanceRef.current.setCenter(moveLatLon);
      mapInstanceRef.current.setLevel(4);
    }
  }

  function handleEventClick(event: LocationEvent, index: number) {
    setSelectedEvent(index);
    
    if (eventMapInstanceRef.current) {
      const moveLatLon = new window.kakao.maps.LatLng(event.latitude, event.longitude);
      eventMapInstanceRef.current.setCenter(moveLatLon);
      eventMapInstanceRef.current.setLevel(5);
    }
  }

  function createEventMarkers(map: any) {
    if (!dashboardData) return;
    
    // 기존 마커 제거
    eventMarkersRef.current.forEach(marker => marker.setMap(null));
    eventMarkersRef.current = [];
    
    dashboardData.ongoingOrUpComingSigunguEventsFromTodayToMonthEndInformation.sigunguEvents.forEach((event, index) => {
      const markerPosition = new window.kakao.maps.LatLng(event.latitude, event.longitude);
      
      // 커스텀 마커 이미지 (축제 아이콘)
      const imageSize = new window.kakao.maps.Size(30, 35);
      const imageOption = { offset: new window.kakao.maps.Point(15, 35) };
      
      // 선택된 이벤트면 다른 색상으로 표시
      const markerImageSrc = selectedEvent === index 
        ? 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAiIGhlaWdodD0iMzUiIHZpZXdCb3g9IjAgMCAzMCAzNSIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTE1IDM1TDI1IDIwQzI1IDE0LjQ3NzIgMjAuNTIyOCAxMCAxNSAxMEM5LjQ3NzE1IDEwIDUgMTQuNDc3MiA1IDIwTDE1IDM1WiIgZmlsbD0iI0Y5NzMxNiIgc3Ryb2tlPSIjRkZGIiBzdHJva2Utd2lkdGg9IjIiLz4KPHN2ZyB4PSI5IiB5PSIxMyIgd2lkdGg9IjEyIiBoZWlnaHQ9IjEyIiB2aWV3Qm94PSIwIDAgMjQgMjQiIGZpbGw9IndoaXRlIj4KPHN2ZyBmaWxsPSJjdXJyZW50Q29sb3IiIHZpZXdCb3g9IjAgMCAyNCAyNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDJMMTMuMDkgOC4yNkwyMSA5TDEzLjA5IDE1Ljc0TDEyIDIyTDEwLjkxIDE1Ljc0TDMgOUwxMC45MSA4LjI2TDEyIDJaIi8+Cjwvc3ZnPgo8L3N2Zz4KPC9zdmc+' 
        : 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAiIGhlaWdodD0iMzUiIHZpZXdCb3g9IjAgMCAzMCAzNSIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTE1IDM1TDI1IDIwQzI1IDE0LjQ3NzIgMjAuNTIyOCAxMCAxNSAxMEM5LjQ3NzE1IDEwIDUgMTQuNDc3MiA1IDIwTDE1IDM1WiIgZmlsbD0iIzEwQjk4MSIgc3Ryb2tlPSIjRkZGIiBzdHJva2Utd2lkdGg9IjIiLz4KPHN2ZyB4PSI5IiB5PSIxMyIgd2lkdGg9IjEyIiBoZWlnaHQ9IjEyIiB2aWV3Qm94PSIwIDAgMjQgMjQiIGZpbGw9IndoaXRlIj4KPHN2ZyBmaWxsPSJjdXJyZW50Q29sb3IiIHZpZXdCb3g9IjAgMCAyNCAyNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDJMMTMuMDkgOC4yNkwyMSA5TDEzLjA5IDE1Ljc0TDEyIDIyTDEwLjkxIDE1Ljc0TDMgOUwxMC45MSA4LjI2TDEyIDJaIi8+Cjwvc3ZnPgo8L3N2Zz4KPC9zdmc+'
      
      const markerImage = new window.kakao.maps.MarkerImage(markerImageSrc, imageSize, imageOption);
      
      const marker = new window.kakao.maps.Marker({
        position: markerPosition,
        title: event.title,
        image: markerImage
      });
      
      marker.setMap(map);
      eventMarkersRef.current.push(marker);
      
      // 마커 클릭 이벤트
      window.kakao.maps.event.addListener(marker, 'click', () => {
        setSelectedEvent(index);
      });
    });
  }
}

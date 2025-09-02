'use client';

import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui';
import { getDashboard } from '@/app/lib/api/dashboard/dashboard';
import { TouristAttractionRanking } from '@/types/dashboard/getDashboardInformationResponse';

export const TouristRankingWidget = () => {
  const [rankings, setRankings] = useState<TouristAttractionRanking[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(0); // 0: 1-5위, 1: 6-10위

  useEffect(() => {
    const fetchRankings = async () => {
      try {
        const response = await getDashboard();
        if (response.code === 'SUCCESS' && response.data) {
          // 백엔드 응답 구조에 맞게 수정
          const rankings = response.data.lastMonthlyTouristAttractionRankingInformation?.lastMonthlyTouristAttractionRankingList || [];
          setRankings(rankings.map((item: any) => ({
            contentId: item.name, // contentId 대신 name 사용
            title: item.name,
            categoryName: item.category,
            subCategoryName: item.subCategory,
            address: '', // 주소 정보가 없음
            thumbnailImageUrl: null,
            latitude: item.latitude,
            longitude: item.longitude
          })));
        }
      } catch (error) {
        console.error('관광지 랭킹 데이터 로드 실패:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRankings();
  }, []);

  // 카테고리 추출
  const categories = Array.from(new Set(rankings.map(item => item.categoryName))).filter(Boolean);
  
  // 카테고리 변경 시 페이지 초기화
  useEffect(() => {
    setCurrentPage(0);
  }, [selectedCategory]);

  // 필터링된 랭킹
  const filteredRankings = selectedCategory 
    ? rankings.filter(item => item.categoryName === selectedCategory)
    : rankings;

  // 현재 페이지에 따라 5개씩 표시
  const startIndex = currentPage * 5;
  const endIndex = startIndex + 5;
  const displayRankings = filteredRankings.slice(startIndex, endIndex);
  const totalPages = Math.ceil(Math.min(filteredRankings.length, 10) / 5);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case '관광지':
        return '🏛️';
      case '문화시설':
        return '🎭';
      case '축제공연행사':
        return '🎪';
      case '레포츠':
        return '⛷️';
      case '숙박':
        return '🏨';
      case '쇼핑':
        return '🛍️';
      case '음식점':
        return '🍽️';
      default:
        return '📍';
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>지난달 인기 관광지 TOP 10</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="animate-pulse">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gray-200 rounded"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (rankings.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>지난달 인기 관광지 TOP 10</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-32 text-neutral-500">
            <p className="text-sm">관광지 랭킹 데이터가 없습니다</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>지난달 인기 관광지 TOP 10</CardTitle>
          {categories.length > 0 && (
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="text-sm border rounded-lg px-3 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">전체</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {displayRankings.map((item, index) => {
            const actualRank = rankings.findIndex(r => r.contentId === item.contentId) + 1;
            
            return (
              <div
                key={item.contentId}
                className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-neutral-50 transition-colors"
              >
                {/* 순위 */}
                <div className="flex-shrink-0 w-6 text-center">
                  {actualRank <= 3 ? (
                    <span className={`text-sm font-bold ${
                      actualRank === 1 ? 'text-yellow-600' :
                      actualRank === 2 ? 'text-gray-500' :
                      'text-orange-600'
                    }`}>
                      {actualRank}
                    </span>
                  ) : (
                    <span className="text-sm text-neutral-500">
                      {actualRank}
                    </span>
                  )}
                </div>

                {/* 관광지 정보 */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1">
                    <span className="text-xs">
                      {getCategoryIcon(item.categoryName)}
                    </span>
                    <h4 className="text-xs font-medium text-neutral-900 line-clamp-1">
                      {item.title}
                    </h4>
                  </div>
                  <p className="text-[10px] text-neutral-500 line-clamp-1">
                    {item.categoryName} {item.subCategoryName ? `• ${item.subCategoryName}` : ''}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* 페이지네이션 버튼 */}
        {filteredRankings.length > 5 && (
          <div className="mt-3 pt-3 border-t flex items-center justify-between">
            <button
              onClick={() => setCurrentPage(0)}
              disabled={currentPage === 0}
              className={`px-3 py-1.5 text-xs rounded-lg transition-colors ${
                currentPage === 0
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-primary-50 text-primary-600 hover:bg-primary-100'
              }`}
            >
              1-5위
            </button>
            
            <span className="text-xs text-neutral-500">
              {startIndex + 1}-{Math.min(endIndex, filteredRankings.length)}위
            </span>
            
            <button
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1 || filteredRankings.length <= 5}
              className={`px-3 py-1.5 text-xs rounded-lg transition-colors ${
                currentPage === 1 || filteredRankings.length <= 5
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-primary-50 text-primary-600 hover:bg-primary-100'
              }`}
            >
              6-10위
            </button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
'use client';

import { useState } from 'react';
import { Card, CardContent, Badge } from '@/components/ui';
import { TrendChart } from '@/components/trends/TrendChart';
import { HeatMap } from '@/components/trends/HeatMap';
import { BuzzAnalysis } from '@/components/trends/BuzzAnalysis';
import { PredictionModel } from '@/components/trends/PredictionModel';
import { PageLayout } from '@/components/dashboard/PageLayout';

export default function TrendsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState<'day' | 'week' | 'month' | 'quarter' | 'year'>('week');
  const [selectedRegion, setSelectedRegion] = useState('부산');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const periods = [
    { value: 'day', label: '일' },
    { value: 'week', label: '주' },
    { value: 'month', label: '월' },
    { value: 'quarter', label: '분기' },
    { value: 'year', label: '년' },
  ];

  const categories = [
    { value: 'all', label: '전체' },
    { value: 'restaurant', label: '음식점' },
    { value: 'accommodation', label: '숙박' },
    { value: 'retail', label: '소매' },
    { value: 'experience', label: '체험' },
  ];

  return (
    <PageLayout
      title="트렌드 분석"
      description="실시간 시장 동향을 파악하고 미래를 예측하세요"
    >

      {/* 필터 영역 */}
      <Card className="mb-6">
        <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* 기간 선택 */}
          <div>
            <label className="text-sm font-medium text-neutral-700 mb-2 block">
              기간 선택
            </label>
            <div className="flex gap-1">
              {periods.map((period) => (
                <button
                  key={period.value}
                  onClick={() => setSelectedPeriod(period.value as 'day' | 'week' | 'month' | 'quarter' | 'year')}
                  className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                    selectedPeriod === period.value
                      ? 'bg-primary-600 text-white'
                      : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                  }`}
                >
                  {period.label}
                </button>
              ))}
            </div>
          </div>

          {/* 지역 선택 */}
          <div>
            <label className="text-sm font-medium text-neutral-700 mb-2 block">
              지역 선택
            </label>
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm"
            >
              <option value="부산">부산 전체</option>
              <option value="해운대">해운대구</option>
              <option value="중구">중구</option>
              <option value="서면">부산진구</option>
              <option value="광안리">수영구</option>
            </select>
          </div>

          {/* 업종 선택 */}
          <div>
            <label className="text-sm font-medium text-neutral-700 mb-2 block">
              업종 선택
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm"
            >
              {categories.map((category) => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
          </div>
        </div>
        </CardContent>
      </Card>

      {/* 주요 인사이트 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-neutral-600">방문객 증가율</p>
              <Badge variant="secondary">주간</Badge>
            </div>
            <p className="text-2xl font-bold text-neutral-900">+23.5%</p>
            <p className="text-xs text-emerald-600 mt-2">전주 대비 8.3% 상승</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-neutral-600">평균 체류시간</p>
              <Badge variant="secondary">일간</Badge>
            </div>
            <p className="text-2xl font-bold text-neutral-900">2.5시간</p>
            <p className="text-xs text-rose-600 mt-2">전일 대비 0.2시간 감소</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-neutral-600">인기 키워드</p>
              <Badge variant="secondary">실시간</Badge>
            </div>
            <p className="text-2xl font-bold text-neutral-900">#영화제</p>
            <p className="text-xs text-neutral-600 mt-2">언급량 5,672회</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-neutral-600">매출 예측</p>
              <Badge variant="secondary">30일</Badge>
            </div>
            <p className="text-2xl font-bold text-neutral-900">+15%</p>
            <p className="text-xs text-primary-600 mt-2">신뢰도 89%</p>
          </CardContent>
        </Card>
      </div>

      {/* 차트 그리드 */}
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <TrendChart />
          <HeatMap region={selectedRegion} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <BuzzAnalysis category={selectedCategory} />
          <PredictionModel period={selectedPeriod} />
        </div>
      </div>
    </PageLayout>
  );
}
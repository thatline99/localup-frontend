"use client";

import { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Button,
  Badge,
  Input,
} from "@/components/ui";
import { PageLayout } from "@/components/dashboard/PageLayout";

interface Competitor {
  id: string;
  name: string;
  type: string;
  distance: string;
  rating: number;
  reviewCount: number;
  priceRange: string;
  features: string[];
  recentChanges: {
    type: "price" | "menu" | "promotion" | "review";
    description: string;
    date: Date;
  }[];
  metrics: {
    estimatedRevenue: string;
    customerSatisfaction: number;
    marketShare: number;
  };
}

export default function CompetitorsPage() {
  const [selectedCompetitor, setSelectedCompetitor] = useState<string | null>(
    null,
  );
  const [showAddModal, setShowAddModal] = useState(false);

  const competitors: Competitor[] = [
    {
      id: "1",
      name: "바다향기 횟집",
      type: "해산물 전문점",
      distance: "200m",
      rating: 4.7,
      reviewCount: 1234,
      priceRange: "₩₩₩",
      features: ["활어회", "개별룸", "단체석", "주차장"],
      recentChanges: [
        {
          type: "promotion",
          description: "영화제 특별 세트 메뉴 출시",
          date: new Date("2024-10-08"),
        },
        {
          type: "price",
          description: "주요 메뉴 5% 인상",
          date: new Date("2024-10-01"),
        },
      ],
      metrics: {
        estimatedRevenue: "월 1.2억",
        customerSatisfaction: 92,
        marketShare: 18,
      },
    },
    {
      id: "2",
      name: "해운대 갈비집",
      type: "한식당",
      distance: "350m",
      rating: 4.5,
      reviewCount: 892,
      priceRange: "₩₩",
      features: ["숯불구이", "무료주차", "24시간", "배달가능"],
      recentChanges: [
        {
          type: "menu",
          description: "신메뉴 3종 추가",
          date: new Date("2024-10-05"),
        },
        {
          type: "review",
          description: "평점 0.2점 상승",
          date: new Date("2024-10-03"),
        },
      ],
      metrics: {
        estimatedRevenue: "월 8천만",
        customerSatisfaction: 88,
        marketShare: 12,
      },
    },
    {
      id: "3",
      name: "오션뷰 카페",
      type: "카페",
      distance: "150m",
      rating: 4.8,
      reviewCount: 2341,
      priceRange: "₩₩",
      features: ["오션뷰", "루프탑", "디저트", "펫프렌들리"],
      recentChanges: [
        {
          type: "promotion",
          description: "SNS 이벤트 진행 중",
          date: new Date("2024-10-09"),
        },
        {
          type: "menu",
          description: "가을 시즌 메뉴 출시",
          date: new Date("2024-09-25"),
        },
      ],
      metrics: {
        estimatedRevenue: "월 6천만",
        customerSatisfaction: 94,
        marketShare: 15,
      },
    },
  ];

  const selectedData = competitors.find((c) => c.id === selectedCompetitor);

  return (
    <PageLayout
      title="경쟁사 분석"
      description="주변 경쟁업체를 모니터링하고 차별화 전략을 수립하세요"
    >
      {/* 요약 카드 */}
      <div className="mb-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent>
            <p className="mb-2 text-sm text-neutral-600">모니터링 업체</p>
            <p className="text-2xl font-bold text-neutral-900">
              {competitors.length}개
            </p>
            <p className="mt-2 text-xs text-emerald-600">활성 모니터링</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <p className="mb-2 text-sm text-neutral-600">평균 평점</p>
            <p className="text-2xl font-bold text-neutral-900">4.67</p>
            <p className="mt-2 text-xs text-neutral-600">우리 가게: 4.8</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <p className="mb-2 text-sm text-neutral-600">시장 점유율</p>
            <p className="text-2xl font-bold text-primary-600">25%</p>
            <p className="mt-2 text-xs text-emerald-600">1위</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <p className="mb-2 text-sm text-neutral-600">가격 경쟁력</p>
            <p className="text-2xl font-bold text-neutral-900">중상</p>
            <p className="mt-2 text-xs text-amber-600">평균 대비 +10%</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* 경쟁사 목록 */}
        <div>
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>경쟁사 목록</CardTitle>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setShowAddModal(true)}
                >
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {competitors.map((competitor) => (
                  <button
                    key={competitor.id}
                    onClick={() => setSelectedCompetitor(competitor.id)}
                    className={`w-full rounded-lg border p-4 text-left transition-all ${
                      selectedCompetitor === competitor.id
                        ? "border-primary-600 bg-primary-50"
                        : "border-neutral-200 hover:border-neutral-300"
                    }`}
                  >
                    <div className="mb-2 flex items-start justify-between">
                      <h4 className="font-medium text-neutral-900">
                        {competitor.name}
                      </h4>
                      <Badge variant="outline" className="text-xs">
                        {competitor.distance}
                      </Badge>
                    </div>
                    <p className="mb-2 text-sm text-neutral-600">
                      {competitor.type}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <svg
                          className="h-4 w-4 fill-current text-amber-400"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <span className="text-sm font-medium">
                          {competitor.rating}
                        </span>
                        <span className="text-xs text-neutral-500">
                          ({competitor.reviewCount})
                        </span>
                      </div>
                      <span className="text-sm text-neutral-600">
                        {competitor.priceRange}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 상세 분석 */}
        <div className="lg:col-span-2">
          {selectedData ? (
            <div className="space-y-6">
              {/* SWOT 분석 */}
              <Card>
                <CardHeader>
                  <CardTitle>SWOT 분석: {selectedData.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="rounded-lg bg-emerald-50 p-4">
                      <h4 className="mb-2 font-medium text-emerald-900">
                        강점 (Strengths)
                      </h4>
                      <ul className="space-y-1 text-sm text-emerald-700">
                        <li>
                          • 높은 고객 만족도 (
                          {selectedData.metrics.customerSatisfaction}%)
                        </li>
                        <li>• 우수한 접근성 ({selectedData.distance})</li>
                        <li>• 특화 메뉴 보유</li>
                      </ul>
                    </div>
                    <div className="rounded-lg bg-rose-50 p-4">
                      <h4 className="mb-2 font-medium text-rose-900">
                        약점 (Weaknesses)
                      </h4>
                      <ul className="space-y-1 text-sm text-rose-700">
                        <li>• 높은 가격대</li>
                        <li>• 주차 공간 부족</li>
                        <li>• 온라인 마케팅 미흡</li>
                      </ul>
                    </div>
                    <div className="rounded-lg bg-blue-50 p-4">
                      <h4 className="mb-2 font-medium text-blue-900">
                        기회 (Opportunities)
                      </h4>
                      <ul className="space-y-1 text-sm text-blue-700">
                        <li>• 관광객 증가 추세</li>
                        <li>• 배달 서비스 확대 가능</li>
                        <li>• 프랜차이즈 기회</li>
                      </ul>
                    </div>
                    <div className="rounded-lg bg-amber-50 p-4">
                      <h4 className="mb-2 font-medium text-amber-900">
                        위협 (Threats)
                      </h4>
                      <ul className="space-y-1 text-sm text-amber-700">
                        <li>• 신규 경쟁업체 진입</li>
                        <li>• 원자재 가격 상승</li>
                        <li>• 계절적 수요 변동</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* 최근 변화 */}
              <Card>
                <CardHeader>
                  <CardTitle>최근 변화 사항</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {selectedData.recentChanges.map((change, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-3 rounded-lg bg-neutral-50 p-3"
                      >
                        <div
                          className={`mt-1.5 h-2 w-2 rounded-full ${
                            change.type === "promotion"
                              ? "bg-primary-500"
                              : change.type === "price"
                                ? "bg-amber-500"
                                : change.type === "menu"
                                  ? "bg-emerald-500"
                                  : "bg-blue-500"
                          }`}
                        />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-neutral-900">
                            {change.description}
                          </p>
                          <p className="mt-1 text-xs text-neutral-500">
                            {change.date.toLocaleDateString("ko-KR")}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* 차별화 전략 */}
              <Card>
                <CardHeader>
                  <CardTitle>차별화 전략 제안</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="rounded-lg border border-primary-200 bg-primary-50 p-4">
                      <h4 className="mb-2 font-medium text-primary-900">
                        우리의 경쟁 우위
                      </h4>
                      <ul className="space-y-2 text-sm text-primary-700">
                        <li className="flex items-start gap-2">
                          <svg
                            className="mt-0.5 h-4 w-4 flex-shrink-0"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                          <span>
                            늦은 영업시간 (새벽 2시) - 유일한 심야 영업점
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <svg
                            className="mt-0.5 h-4 w-4 flex-shrink-0"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                          <span>활어회 전문 - 신선도 최고 수준</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <svg
                            className="mt-0.5 h-4 w-4 flex-shrink-0"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                          <span>대형 단체석 보유 - 최대 50명 수용 가능</span>
                        </li>
                      </ul>
                    </div>

                    <div>
                      <h4 className="mb-3 font-medium text-neutral-900">
                        추천 액션
                      </h4>
                      <div className="space-y-2">
                        <Button
                          variant="outline"
                          className="w-full justify-between"
                        >
                          <span>영화제 특별 프로모션 강화</span>
                          <svg
                            className="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 5l7 7-7 7"
                            />
                          </svg>
                        </Button>
                        <Button
                          variant="outline"
                          className="w-full justify-between"
                        >
                          <span>심야 시간대 마케팅 집중</span>
                          <svg
                            className="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 5l7 7-7 7"
                            />
                          </svg>
                        </Button>
                        <Button
                          variant="outline"
                          className="w-full justify-between"
                        >
                          <span>단체 예약 특별 혜택 도입</span>
                          <svg
                            className="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 5l7 7-7 7"
                            />
                          </svg>
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card className="flex h-full items-center justify-center">
              <CardContent className="py-12 text-center">
                <svg
                  className="mx-auto mb-4 h-16 w-16 text-neutral-300"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
                <p className="text-neutral-500">
                  경쟁사를 선택하여 상세 분석을 확인하세요
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* 경쟁사 추가 모달 */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>경쟁사 추가</CardTitle>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="rounded-lg p-2 hover:bg-neutral-100"
                >
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <Input
                  label="업체명"
                  placeholder="경쟁업체 이름을 입력하세요"
                />
                <Input label="주소" placeholder="주소를 입력하세요" />
                <div>
                  <label className="label mb-2 block">업종</label>
                  <select className="input">
                    <option>음식점</option>
                    <option>카페</option>
                    <option>숙박업</option>
                    <option>기타</option>
                  </select>
                </div>
                <div className="flex gap-2 pt-4">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => setShowAddModal(false)}
                  >
                    취소
                  </Button>
                  <Button className="flex-1">추가하기</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </PageLayout>
  );
}

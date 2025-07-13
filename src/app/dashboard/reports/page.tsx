"use client";

import { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Button,
  Badge,
} from "@/components/ui";
import { PageLayout } from "@/components/dashboard/PageLayout";

interface Report {
  id: string;
  title: string;
  type: "daily" | "weekly" | "monthly" | "custom";
  createdAt: Date;
  status: "completed" | "generating" | "scheduled";
  size: string;
}

export default function ReportsPage() {
  const [selectedType, setSelectedType] = useState<
    "all" | "daily" | "weekly" | "monthly" | "custom"
  >("all");
  const [isCreating, setIsCreating] = useState(false);

  const reports: Report[] = [
    {
      id: "1",
      title: "2024년 10월 월간 경영 리포트",
      type: "monthly",
      createdAt: new Date("2024-10-01"),
      status: "completed",
      size: "2.4MB",
    },
    {
      id: "2",
      title: "주간 성과 분석 (10월 1주차)",
      type: "weekly",
      createdAt: new Date("2024-10-07"),
      status: "completed",
      size: "1.2MB",
    },
    {
      id: "3",
      title: "일일 운영 리포트",
      type: "daily",
      createdAt: new Date("2024-10-10"),
      status: "completed",
      size: "0.8MB",
    },
    {
      id: "4",
      title: "부산국제영화제 기간 특별 분석",
      type: "custom",
      createdAt: new Date("2024-10-09"),
      status: "completed",
      size: "3.1MB",
    },
    {
      id: "5",
      title: "경쟁사 비교 분석 리포트",
      type: "custom",
      createdAt: new Date("2024-10-08"),
      status: "generating",
      size: "-",
    },
  ];

  const reportTypes = [
    { value: "all", label: "전체" },
    { value: "daily", label: "일일" },
    { value: "weekly", label: "주간" },
    { value: "monthly", label: "월간" },
    { value: "custom", label: "맞춤형" },
  ];

  const filteredReports =
    selectedType === "all"
      ? reports
      : reports.filter((report) => report.type === selectedType);

  const getStatusBadge = (status: Report["status"]) => {
    switch (status) {
      case "completed":
        return <Badge variant="secondary">완료</Badge>;
      case "generating":
        return <Badge variant="primary">생성 중</Badge>;
      case "scheduled":
        return <Badge variant="outline">예약됨</Badge>;
    }
  };

  const getTypeLabel = (type: Report["type"]) => {
    switch (type) {
      case "daily":
        return "일일";
      case "weekly":
        return "주간";
      case "monthly":
        return "월간";
      case "custom":
        return "맞춤형";
    }
  };

  return (
    <PageLayout
      title="보고서"
      description="맞춤형 리포트를 생성하고 관리하세요"
      actions={
        <Button onClick={() => setIsCreating(true)}>
          <svg
            className="mr-2 h-4 w-4"
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
          새 리포트 생성
        </Button>
      }
    >
      {/* 필터 탭 */}
      <div className="mb-6 flex gap-1">
        {reportTypes.map((type) => (
          <button
            key={type.value}
            onClick={() =>
              setSelectedType(
                type.value as "all" | "daily" | "weekly" | "monthly" | "custom",
              )
            }
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              selectedType === type.value
                ? "bg-primary-600 text-white"
                : "text-neutral-600 hover:bg-neutral-100"
            }`}
          >
            {type.label}
          </button>
        ))}
      </div>

      {/* 리포트 목록 */}
      <div className="mb-8 space-y-4">
        {filteredReports.map((report) => (
          <Card key={report.id} hover>
            <CardContent>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="mb-2 flex items-center gap-3">
                    <h4 className="font-semibold text-neutral-900">
                      {report.title}
                    </h4>
                    {getStatusBadge(report.status)}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-neutral-600">
                    <span>{getTypeLabel(report.type)} 리포트</span>
                    <span>•</span>
                    <span>
                      {report.createdAt.toLocaleDateString("ko-KR", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                    <span>•</span>
                    <span>{report.size}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {report.status === "completed" ? (
                    <>
                      <Button variant="ghost" size="sm">
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
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </svg>
                      </Button>
                      <Button variant="ghost" size="sm">
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
                            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                          />
                        </svg>
                      </Button>
                      <Button variant="ghost" size="sm">
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
                            d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m9.032 4.026a9 9 0 10-13.432 0m13.432 0A9 9 0 0112 21a9 9 0 01-6.716-3.316m13.432 0c.94-.283 1.765-.816 2.398-1.526a9 9 0 00-17.13 0c.633.71 1.458 1.243 2.398 1.526"
                          />
                        </svg>
                      </Button>
                    </>
                  ) : (
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-32 overflow-hidden rounded-full bg-neutral-200">
                        <div
                          className="h-full animate-pulse bg-primary-600"
                          style={{ width: "60%" }}
                        />
                      </div>
                      <span className="text-sm text-neutral-500">60%</span>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 자동 생성 설정 */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>자동 리포트 생성 설정</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between rounded-lg border p-4">
              <div>
                <h5 className="font-medium text-neutral-900">
                  일일 운영 리포트
                </h5>
                <p className="mt-1 text-sm text-neutral-600">
                  매일 오전 9시 자동 생성
                </p>
              </div>
              <label className="relative inline-flex cursor-pointer items-center">
                <input
                  type="checkbox"
                  className="peer sr-only"
                  defaultChecked
                />
                <div className="peer h-6 w-11 rounded-full bg-neutral-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all after:content-[''] peer-checked:bg-primary-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none"></div>
              </label>
            </div>

            <div className="flex items-center justify-between rounded-lg border p-4">
              <div>
                <h5 className="font-medium text-neutral-900">주간 성과 분석</h5>
                <p className="mt-1 text-sm text-neutral-600">
                  매주 월요일 오전 10시 자동 생성
                </p>
              </div>
              <label className="relative inline-flex cursor-pointer items-center">
                <input
                  type="checkbox"
                  className="peer sr-only"
                  defaultChecked
                />
                <div className="peer h-6 w-11 rounded-full bg-neutral-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all after:content-[''] peer-checked:bg-primary-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none"></div>
              </label>
            </div>

            <div className="flex items-center justify-between rounded-lg border p-4">
              <div>
                <h5 className="font-medium text-neutral-900">
                  월간 경영 리포트
                </h5>
                <p className="mt-1 text-sm text-neutral-600">
                  매월 1일 오전 10시 자동 생성
                </p>
              </div>
              <label className="relative inline-flex cursor-pointer items-center">
                <input type="checkbox" className="peer sr-only" />
                <div className="peer h-6 w-11 rounded-full bg-neutral-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all after:content-[''] peer-checked:bg-primary-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none"></div>
              </label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 리포트 생성 모달 (간단한 구현) */}
      {isCreating && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <Card className="w-full max-w-lg">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>새 리포트 생성</CardTitle>
                <button
                  onClick={() => setIsCreating(false)}
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
                <div>
                  <label className="label mb-2 block">리포트 유형</label>
                  <select className="input">
                    <option>일일 운영 리포트</option>
                    <option>주간 성과 분석</option>
                    <option>월간 경영 리포트</option>
                    <option>맞춤형 리포트</option>
                  </select>
                </div>

                <div>
                  <label className="label mb-2 block">기간 설정</label>
                  <div className="grid grid-cols-2 gap-2">
                    <input type="date" className="input" />
                    <input type="date" className="input" />
                  </div>
                </div>

                <div>
                  <label className="label mb-2 block">포함할 데이터</label>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2">
                      <input type="checkbox" defaultChecked />
                      <span className="text-sm">매출 분석</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="checkbox" defaultChecked />
                      <span className="text-sm">방문객 분석</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="checkbox" defaultChecked />
                      <span className="text-sm">리뷰 분석</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="checkbox" />
                      <span className="text-sm">경쟁사 비교</span>
                    </label>
                  </div>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => setIsCreating(false)}
                  >
                    취소
                  </Button>
                  <Button className="flex-1">생성하기</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </PageLayout>
  );
}

"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import type { SigunguEventWithDates } from "@/types/dashboard/sigunguEventWithDates";

type Props = {
  data: SigunguEventWithDates | null;
  isLoading: boolean;
  error: string | null;
  className?: string;
};

export default function MainEventCard2({
  data,
  isLoading,
  error,
  className,
}: Props) {
  const [aspectRatio, setAspectRatio] = useState<number>(3 / 2);

  const eventStatus: "upcoming" | "ongoing" | "ended" | null = useMemo(() => {
    if (!data) return null;
    const now = new Date();
    const start = new Date(`${data.startDate}T00:00:00`);
    const end = new Date(`${data.endDate}T23:59:59`);
    if (now < start) return "upcoming";
    if (now > end) return "ended";
    return "ongoing";
  }, [data]);

  const eventStatusLabel = useMemo(() => {
    switch (eventStatus) {
      case "upcoming":
        return "개막 예정";
      case "ongoing":
        return "진행 중";
      case "ended":
        return "종료";
      default:
        return "";
    }
  }, [eventStatus]);

  const eventDateText = useMemo(() => {
    if (!data) return "";
    const f = (s: string) => s.replaceAll("-", ".");
    return `${f(data.startDate)} ~ ${f(data.endDate)}`;
  }, [data]);

  const ddayText = useMemo(() => {
    if (!data) return "";
    const today = new Date();
    const start = new Date(`${data.startDate}T00:00:00`);
    const end = new Date(`${data.endDate}T23:59:59`);
    if (today < start) {
      const diff = Math.ceil((start.getTime() - today.getTime()) / 86_400_000);
      return `D-${diff}`;
    }
    if (today <= end) {
      const diff = Math.floor((today.getTime() - start.getTime()) / 86_400_000);
      return `D+${diff}`;
    }
    return "종료됨";
  }, [data]);

  const statusChipClass = useMemo(() => {
    switch (eventStatus) {
      case "upcoming":
        return "border-amber-200 bg-amber-50 text-amber-800";
      case "ongoing":
        return "border-emerald-200 bg-emerald-50 text-emerald-800";
      case "ended":
        return "border-gray-200 bg-gray-50 text-gray-700";
      default:
        return "border-primary-200 bg-primary-50 text-primary-700";
    }
  }, [eventStatus]);

  // 로딩
  if (isLoading) {
    return (
      <div
        className={[
          "mb-6 overflow-hidden rounded-lg border border-primary-200 bg-white",
          className ?? "",
        ].join(" ")}
        role="status"
        aria-label="메인 이벤트 로딩 중"
      >
        <div className="flex flex-col gap-4 md:flex-row">
          <div
            className="relative w-full bg-primary-50 md:w-[500px]"
            style={{ aspectRatio }}
          >
            <div className="absolute inset-0 animate-pulse rounded bg-primary-100" />
          </div>
          <div className="flex-1 p-4">
            <div className="mb-3 h-5 w-1/2 animate-pulse rounded bg-primary-100" />
            <div className="mb-2 h-4 w-2/3 animate-pulse rounded bg-primary-100" />
            <div className="h-4 w-1/3 animate-pulse rounded bg-primary-100" />
          </div>
        </div>
      </div>
    );
  }

  // 에러
  if (error) {
    return (
      <div
        className={[
          "mb-6 rounded-lg border border-red-200 bg-red-50 p-4",
          className ?? "",
        ].join(" ")}
        role="alert"
        aria-live="polite"
      >
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0">
            <svg
              className="h-5 w-5 text-red-600"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M18 10A8 8 0 11.001 10 8 8 0 0118 10zM9 5h2v6H9V5zm0 8h2v2H9v-2z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-red-900">
              알림을 가져오지 못했습니다
            </h3>
            <p className="mt-1 text-sm text-red-800">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!data) return null;

  const imageSrc = data.originalImageUrl || data.thumbnailImageUrl || "";

  return (
    <section
      className={[
        "mb-6 overflow-hidden rounded-xl border border-primary-200 bg-white shadow-sm",
        className ?? "",
      ].join(" ")}
      aria-label="메인 이벤트 배너"
    >
      <div className="h-1 w-full bg-gradient-to-r from-primary-400 via-primary-500 to-primary-300" />

      <div className="flex flex-col md:flex-row">
        {/* 원본 비율을 동적으로 반영하는 래퍼
            - 모바일: 가로 100% + aspect-ratio로 높이 자동
            - 데스크톱: 가로 500px로 고정, 높이는 비율에 따라 자동(최대 333px 상한) */}
        <div
          className="relative w-full bg-gray-50 md:w-[500px] md:shrink-0"
          style={{
            aspectRatio, // 원본 비율 유지
            maxHeight: 333, // 데스크톱 높이 상한
          }}
        >
          {imageSrc ? (
            <Image
              src={imageSrc}
              alt={`${data.title} 이미지`}
              fill
              sizes="(max-width: 768px) 100vw, 500px"
              className="object-contain" // 확대/크롭 없이 맞춰 넣기
              priority
              // 필요 시 임시 우회:
              // unoptimized
              onLoadingComplete={(img) => {
                // naturalWidth / naturalHeight로 실제 비율 반영
                const ratio =
                  img.naturalWidth && img.naturalHeight
                    ? img.naturalWidth / img.naturalHeight
                    : 3 / 2;
                // 극단값 보호 (너무 세로/가로 긴 이미지 대비)
                const clamped = Math.min(Math.max(ratio, 0.6), 2.0);
                // 동일 값이면 state 갱신 불필요
                if (Math.abs(clamped - aspectRatio) > 0.001) {
                  setAspectRatio(clamped);
                }
              }}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <svg
                className="h-8 w-8 text-primary-300"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M4 5a2 2 0 012-2h12a2 2 0 012 2v11a1 1 0 11-2 0V5H6v14h8a1 1 0 110 2H6a2 2 0 01-2-2V5z" />
                <path d="M8 13l2.5-3 2 2.5 1.5-2L18 14v3H8v-4z" />
              </svg>
            </div>
          )}
        </div>

        {/* 본문 */}
        <div className="flex-1 p-4">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-base font-semibold text-gray-900 md:text-lg">
              {data.title}
            </h3>
            {eventStatusLabel && (
              <span
                className={[
                  "inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-xs font-medium",
                  statusChipClass,
                ].join(" ")}
              >
                <span
                  className={[
                    "inline-block h-1.5 w-1.5 rounded-full",
                    eventStatus === "ongoing"
                      ? "bg-emerald-500"
                      : eventStatus === "upcoming"
                        ? "bg-amber-500"
                        : "bg-gray-400",
                  ].join(" ")}
                />
                {eventStatusLabel}
              </span>
            )}
            {ddayText && (
              <span className="inline-flex items-center rounded-md bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-700">
                {ddayText}
              </span>
            )}
          </div>

          {/* 날짜 · 장소 · 연락처 */}
          <div className="mt-2 space-y-1 text-sm text-gray-700">
            <div className="flex items-center gap-2">
              <svg
                className="h-4 w-4 text-gray-500"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M7 2a1 1 0 011 1v1h8V3a1 1 0 112 0v1h1a2 2 0 012 2v2H4V6a2 2 0 012-2h1V3a1 1 0 011-1zM4 11h16v8a2 2 0 01-2 2H6a2 2 0 01-2-2v-8z" />
              </svg>
              <span className="font-medium">{eventDateText}</span>
            </div>

            {data.address && (
              <div className="flex items-start gap-2">
                <svg
                  className="mt-0.5 h-4 w-4 text-gray-500"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 2a7 7 0 017 7c0 5.25-7 13-7 13S5 14.25 5 9a7 7 0 017-7zm0 9.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z" />
                </svg>
                <span>{data.address}</span>
              </div>
            )}

            {data.telephone && (
              <div className="flex items-center gap-2">
                <svg
                  className="h-4 w-4 text-gray-500"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M6.62 10.79a15.05 15.05 0 006.59 6.59l2.2-2.2a1 1 0 011.01-.24 11.36 11.36 0 003.56.57 1 1 0 011 1V20a1 1 0 01-1 1A17 17 0 013 4a1 1 0 011-1h2.5a1 1 0 011 1 11.36 11.36 0 00.57 3.56 1 1 0 01-.24 1.01l-2.2 2.2z" />
                </svg>
                <a
                  href={`tel:${data.telephone}`}
                  className="underline decoration-dotted underline-offset-2 hover:decoration-solid"
                >
                  {data.telephone}
                </a>
              </div>
            )}
          </div>

          {/* 액션 */}
          <div className="mt-3 flex flex-wrap gap-2">
            {data.address && (
              <a
                href={`https://maps.google.com/?q=${encodeURIComponent(data.address)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-md border border-primary-300 bg-white px-3 py-1.5 text-sm font-medium text-primary-700 hover:bg-primary-50"
              >
                지도 보기
                <svg
                  className="h-4 w-4"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden
                >
                  <path d="M12.293 2.293a1 1 0 011.414 0L19 7.586a2 2 0 01.586 1.414V17a3 3 0 01-3 3H6a2 2 0 01-2-2v-3a1 1 0 112 0v3h10a1 1 0 001-1v-7h-3a2 2 0 01-2-2V3l-1.293 1.293a1 1 0 01-1.414-1.414l3-3z" />
                </svg>
              </a>
            )}
            {data.telephone && (
              <a
                href={`tel:${data.telephone}`}
                className="inline-flex items-center gap-2 rounded-md bg-primary-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-primary-700"
              >
                전화하기
                <svg
                  className="h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden
                >
                  <path d="M6.62 10.79a15.05 15.05 0 006.59 6.59l2.2-2.2a1 1 0 011.01-.24 11.36 11.36 0 003.56.57 1 1 0 011 1V20a1 1 0 01-1 1A17 17 0 013 4a1 1 0 011-1h2.5a1 1 0 011 1 11.36 11.36 0 00.57 3.56 1 1 0 01-.24 1.01l-2.2 2.2z" />
                </svg>
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

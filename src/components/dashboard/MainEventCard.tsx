"use client";

import { useMemo } from "react";
import type { SigunguEventWithDates } from "@/types/dashboard/sigunguEventWithDates";

type Props = {
  data: SigunguEventWithDates | null;
  loading: boolean;
  error: string | null;
  className?: string;
};

export default function MainEventCard({
  data,
  loading,
  error,
  className,
}: Props) {
  const eventStatus: "upcoming" | "ongoing" | "ended" | null = useMemo(() => {
    if (!data) return null;

    const currentDate = new Date();
    const startDateTime = new Date(`${data.startDate}T00:00:00`);
    const endDateTime = new Date(`${data.endDate}T23:59:59`);

    if (currentDate < startDateTime) return "upcoming";
    if (currentDate > endDateTime) return "ended";
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

    const formatDateString = (isoDate: string) => isoDate.replaceAll("-", ".");
    return `${formatDateString(data.startDate)} ~ ${formatDateString(data.endDate)}`;
  }, [data]);

  return (
    <div
      className={[
        "mb-6 rounded-lg border border-primary-200 bg-primary-50 p-4",
        className ?? "",
      ].join(" ")}
      role="region"
      aria-label="메인 이벤트 배너"
    >
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
          {loading && (
            <>
              <h3 className="font-semibold text-primary-900">
                알림 불러오는 중…
              </h3>
              <p className="mt-1 text-sm text-primary-700">
                잠시만 기다려 주세요.
              </p>
            </>
          )}

          {!loading && error && (
            <>
              <h3 className="font-semibold text-primary-900">
                알림을 가져오지 못했습니다
              </h3>
              <p className="mt-1 text-sm text-primary-700">{error}</p>
            </>
          )}

          {!loading && !error && data && (
            <>
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-semibold text-primary-900">{data.title}</h3>
                {eventStatusLabel && (
                  <span
                    className="rounded-md border px-2 py-0.5 text-xs"
                    aria-label={`이벤트 상태: ${eventStatusLabel}`}
                  >
                    {eventStatusLabel}
                  </span>
                )}
              </div>
              <p className="mt-1 text-sm text-primary-700">
                {eventDateText}
                {data.address ? `, ${data.address}` : ""}
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

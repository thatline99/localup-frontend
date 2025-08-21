"use client";

import { useMemo } from "react";
import type { SigunguEventWithDates } from "@/types/dashboard/sigunguEventWithDates";

type Props = {
  event: SigunguEventWithDates | null;
  loading: boolean;
  err: string | null;
  className?: string;
};

export default function MainEventCard({
  event,
  loading,
  err,
  className,
}: Props) {
  const status: "upcoming" | "ongoing" | "ended" | null = useMemo(() => {
    if (!event) return null;
    const now = new Date();
    const start = new Date(`${event.startDate}T00:00:00`);
    const end = new Date(`${event.endDate}T23:59:59`);
    if (now < start) return "upcoming";
    if (now > end) return "ended";
    return "ongoing";
  }, [event]);

  const statusLabel = useMemo(() => {
    switch (status) {
      case "upcoming":
        return "개막 예정";
      case "ongoing":
        return "진행 중";
      case "ended":
        return "종료";
      default:
        return "";
    }
  }, [status]);

  const dateText = useMemo(() => {
    if (!event) return "";
    const f = (s: string) => s.replaceAll("-", ".");
    return `${f(event.startDate)} ~ ${f(event.endDate)}`;
  }, [event]);

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

          {!loading && err && (
            <>
              <h3 className="font-semibold text-primary-900">
                알림을 가져오지 못했습니다
              </h3>
              <p className="mt-1 text-sm text-primary-700">{err}</p>
            </>
          )}

          {!loading && !err && event && (
            <>
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-semibold text-primary-900">
                  {event.title}
                </h3>
                {statusLabel && (
                  <span
                    className="rounded-md border px-2 py-0.5 text-xs"
                    aria-label={`이벤트 상태: ${statusLabel}`}
                  >
                    {statusLabel}
                  </span>
                )}
              </div>
              <p className="mt-1 text-sm text-primary-700">
                {dateText}
                {event.address ? `, ${event.address}` : ""}
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

import { BaseResponse } from "@/types/common/baseResponse";
import { GetDashboardInformationResponse } from "@/types/dashboard/getDashboardInformationResponse";
import { GetShortTermForecastResponse } from "@/types/dashboard/getShortTermForecastResponse";
import { VisitorStatisticsInformation } from "@/types/dashboard/getVisitorStatisticsResponse";

export async function getDashboard(): Promise<
  BaseResponse<GetDashboardInformationResponse>
> {
  const response = await fetch("/api/dashboard", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error();
  }

  return response.json();
}

export async function getShortTermForecast(): Promise<GetShortTermForecastResponse> {
  const response = await fetch("/api/dashboard/short-term-forecast", {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error();
  }

  return response.json();
}

export async function getVisitorStatistics(
  startDate: string,
  endDate: string,
): Promise<BaseResponse<VisitorStatisticsInformation>> {
  const params = new URLSearchParams({
    startDate,
    endDate,
  });

  const response = await fetch(`/api/dashboard/visitor-statistics?${params}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch visitor statistics");
  }

  return response.json();
}

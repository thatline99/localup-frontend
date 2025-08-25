import { BaseResponse } from "@/types/common/baseResponse";
import { GetDashboardInformationResponse } from "@/types/dashboard/getDashboardInformationResponse";
import { GetShortTermForecastResponse } from "@/types/dashboard/getShortTermForecastResponse";

export async function getDashboard(): Promise<
  BaseResponse<GetDashboardInformationResponse>
> {
  const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/dashboard`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error();
  }

  return response.json();
}

// TODO-noah: 삭제, 아직 인증이 완료되지 않아 사용하는 코드입니다.
export async function getDashboardTest(): Promise<
  BaseResponse<GetDashboardInformationResponse>
> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/dashboard/test`,
    {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    },
  );

  if (!response.ok) {
    throw new Error();
  }

  return response.json();
}

export async function getShortTermForecast(): Promise<GetShortTermForecastResponse> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/dashboard/test/short-term-forecast`,
    {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    },
  );

  if (!response.ok) {
    throw new Error();
  }

  return response.json();
}

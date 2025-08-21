import { BaseResponse } from "@/types/common/baseResponse";
import { GetDashboardInformationResponse } from "@/types/dashboard/getDashboardInformationResponse";

export async function getDashboard(): Promise<
  BaseResponse<GetDashboardInformationResponse>
> {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/dashboard`, {
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
    `${process.env.NEXT_PUBLIC_API_URL}/dashboard/test`,
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

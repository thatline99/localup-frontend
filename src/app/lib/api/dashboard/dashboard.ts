import { BaseResponse } from "@/types/common/baseResponse";
import { SigunguEventWithDates } from "@/types/dashboard/sigunguEventWithDates";

// TODO: 수정
const BASE_URL = "http://localhost:8080/api";

// TODO-noah: 대시보드 테스트 코드입니다. 삭제 예정
export async function getDashboardTest(
  legalDongSigunguCode: string,
): Promise<BaseResponse<SigunguEventWithDates>> {
  const response = await fetch(
    `${BASE_URL}/dashboard/test/events/main?legalDongSigunguCode=${encodeURIComponent(legalDongSigunguCode)}`,
    {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    },
  );

  if (!response.ok) {
    throw new Error();
  }

  return await response.json();
}

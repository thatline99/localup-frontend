import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

async function getVisitorStatistics(
  accessToken: string,
  startDate: string,
  endDate: string,
) {
  try {
    const params = new URLSearchParams({
      startDate,
      endDate,
    });

    const response = await fetch(
      `${process.env.BACKEND_API_URL}/dashboard/visitor-statistics?${params}`,
      {
        method: "GET",
        headers: {
          Cookie: `accessToken=${accessToken}`,
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

    if (!response.ok) {
      const responseText = await response.text();

      if (responseText) {
        try {
          const error = JSON.parse(responseText);
          throw new Error(error.message || "방문객 통계 조회에 실패했습니다.");
        } catch (parseError) {
          throw new Error(responseText || "방문객 통계 조회에 실패했습니다.");
        }
      } else {
        throw new Error("방문객 통계 조회에 실패했습니다.");
      }
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("getVisitorStatistics 에러:", error);
    throw error;
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    if (!startDate || !endDate) {
      return NextResponse.json(
        { error: "시작일과 종료일을 입력해주세요." },
        { status: 400 },
      );
    }

    // 세션에서 백엔드 토큰 가져오기
    const sessionResponse = await fetch(
      new URL("/api/auth/session", request.url),
      {
        headers: request.headers,
      },
    );

    if (!sessionResponse.ok) {
      return NextResponse.json(
        { error: "세션 조회 중 오류가 발생했습니다." },
        { status: 500 },
      );
    }

    const sessionData = await sessionResponse.json();

    // 비로그인 상태 처리
    if (!sessionData.authenticated) {
      return NextResponse.json(
        { error: "인증되지 않은 사용자입니다." },
        { status: 401 },
      );
    }

    const backendAccessToken = sessionData.user?.backendAccessToken;

    if (!backendAccessToken) {
      return NextResponse.json(
        { error: "백엔드 인증 토큰이 없습니다." },
        { status: 401 },
      );
    }

    const statisticsData = await getVisitorStatistics(
      backendAccessToken,
      startDate,
      endDate,
    );

    return NextResponse.json(statisticsData);
  } catch (err: unknown) {
    console.error("방문객 통계 조회 오류:", err);

    return NextResponse.json(
      { error: "방문객 통계 조회 중 오류가 발생했습니다." },
      { status: 500 },
    );
  }
}

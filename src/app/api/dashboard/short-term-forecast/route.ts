import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

async function getShortTermForecast(accessToken: string) {
  try {
    const response = await fetch(
      `${process.env.BACKEND_API_URL}/dashboard/short-term-forecast`,
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
          throw new Error(error.message || "날씨 정보 조회에 실패했습니다.");
        } catch {
          throw new Error(responseText || "날씨 정보 조회에 실패했습니다.");
        }
      } else {
        throw new Error("날씨 정보 조회에 실패했습니다.");
      }
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("getShortTermForecast 에러:", error);
    throw error;
  }
}

export async function GET(request: NextRequest) {
  try {
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

    const forecastData = await getShortTermForecast(backendAccessToken);

    return NextResponse.json(forecastData);
  } catch (err: unknown) {
    console.error("날씨 정보 조회 오류:", err);

    return NextResponse.json(
      { error: "날씨 정보 조회 중 오류가 발생했습니다." },
      { status: 500 },
    );
  }
}

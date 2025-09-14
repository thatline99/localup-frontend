import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

export async function GET(request: NextRequest) {
  try {
    // 세션에서 백엔드 토큰 가져오기
    const sessionResponse = await fetch(
      new URL("/api/auth/session", request.url),
      {
        headers: request.headers,
      }
    );

    if (!sessionResponse.ok) {
      return NextResponse.json(
        { error: "세션 조회 중 오류가 발생했습니다." },
        { status: 500 }
      );
    }

    const sessionData = await sessionResponse.json();

    if (!sessionData.authenticated) {
      return NextResponse.json(
        { error: "인증되지 않은 사용자입니다." },
        { status: 401 }
      );
    }

    const backendAccessToken = sessionData.user?.backendAccessToken;

    if (!backendAccessToken) {
      return NextResponse.json(
        { error: "백엔드 인증 토큰이 없습니다." },
        { status: 401 }
      );
    }

    // 백엔드 채팅 세션 목록 API 호출
    const response = await fetch(
      `${process.env.BACKEND_API_URL}/chatgpt/sessions`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Cookie: `accessToken=${backendAccessToken}`,
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        { error: errorText || "채팅 세션 목록 조회에 실패했습니다." },
        { status: response.status }
      );
    }

    const result = await response.json();
    return NextResponse.json(result);
  } catch (error) {
    console.error("채팅 세션 목록 조회 오류:", error);
    return NextResponse.json(
      { error: "채팅 세션 목록 조회 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, sessionId } = body;

    // 필수 파라미터 검증
    if (!message) {
      return NextResponse.json(
        { error: "메시지가 필요합니다." },
        { status: 400 }
      );
    }

    // 세션에서 백엔드 토큰 가져오기
    const sessionResponse = await fetch(
      new URL("/api/auth/session", request.url),
      {
        headers: request.headers,
      }
    );

    if (!sessionResponse.ok) {
      return NextResponse.json(
        { error: "세션 조회 중 오류가 발생했습니다." },
        { status: 500 }
      );
    }

    const sessionData = await sessionResponse.json();

    if (!sessionData.authenticated) {
      return NextResponse.json(
        { error: "인증되지 않은 사용자입니다." },
        { status: 401 }
      );
    }

    const backendAccessToken = sessionData.user?.backendAccessToken;

    if (!backendAccessToken) {
      return NextResponse.json(
        { error: "백엔드 인증 토큰이 없습니다." },
        { status: 401 }
      );
    }

    const response = await fetch(
      `${process.env.BACKEND_API_URL}/chatgpt/chat`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Cookie: `accessToken=${backendAccessToken}`,
        },
        body: JSON.stringify({
          message,
          sessionId,
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        { error: errorText || "AI 솔루션 요청에 실패했습니다." },
        { status: response.status }
      );
    }

    const result = await response.json();
    return NextResponse.json(result);
  } catch (error) {
    console.error("AI 솔루션 API 오류:", error);
    return NextResponse.json(
      { error: "AI 솔루션 처리 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

export async function GET(
  request: NextRequest,
  { params }: { params: { sessionId: string } }
) {
  try {
    const { sessionId } = params;

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

    // 백엔드 세션 상세 API 호출
    const response = await fetch(
      `${process.env.BACKEND_API_URL}/chatgpt/sessions/${sessionId}`,
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
        { error: errorText || "세션 상세 정보 조회에 실패했습니다." },
        { status: response.status }
      );
    }

    const result = await response.json();
    return NextResponse.json(result);
  } catch (error) {
    console.error("세션 상세 정보 조회 오류:", error);
    return NextResponse.json(
      { error: "세션 상세 정보 조회 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { sessionId: string } }
) {
  try {
    const { sessionId } = params;

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

    // 백엔드 세션 삭제 API 호출
    const response = await fetch(
      `${process.env.BACKEND_API_URL}/chatgpt/sessions/${sessionId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Cookie: `accessToken=${backendAccessToken}`,
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        { error: errorText || "세션 삭제에 실패했습니다." },
        { status: response.status }
      );
    }

    return NextResponse.json({ success: true, message: "세션이 성공적으로 삭제되었습니다." });
  } catch (error) {
    console.error("세션 삭제 오류:", error);
    return NextResponse.json(
      { error: "세션 삭제 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

async function getDashboardOverview(accessToken: string) {
  try {
    const response = await fetch(`${process.env.BACKEND_API_URL}/dashboard`, {
      method: "GET",
      headers: {
        Cookie: `accessToken=${accessToken}`,
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      const responseText = await response.text();

      if (responseText) {
        try {
          const error = JSON.parse(responseText);
          throw new Error(
            error.message || "대시보드 정보 조회에 실패했습니다.",
          );
        } catch {
          throw new Error(responseText || "대시보드 정보 조회에 실패했습니다.");
        }
      } else {
        throw new Error("대시보드 정보 조회에 실패했습니다.");
      }
    }

    return await response.json();
  } catch (error) {
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
      return NextResponse.json({
        code: "SUCCESS",
        data: {
          lastMonthlyTouristAttractionRankingInformation: {
            updatedDate: new Date().toISOString(),
            lastMonthlyTouristAttractionRankingList: []
          },
          sigunguMainEventInformation: {
            updatedDate: new Date().toISOString(),
            sigunguMainEvent: null
          },
          ongoingOrUpComingSigunguEventsFromTodayToMonthEndInformation: {
            updatedDate: new Date().toISOString(),
            sigunguEvents: []
          }
        }
      });
    }

    const sessionData = await sessionResponse.json();
    
    // 비로그인 상태에서도 기본 데이터 제공
    if (!sessionData.authenticated) {
      return NextResponse.json({
        code: "SUCCESS",
        data: {
          lastMonthlyTouristAttractionRankingInformation: {
            updatedDate: new Date().toISOString(),
            lastMonthlyTouristAttractionRankingList: []
          },
          sigunguMainEventInformation: {
            updatedDate: new Date().toISOString(),
            sigunguMainEvent: null
          },
          ongoingOrUpComingSigunguEventsFromTodayToMonthEndInformation: {
            updatedDate: new Date().toISOString(),
            sigunguEvents: []
          }
        }
      });
    }
    const backendAccessToken = sessionData.user?.backendAccessToken;

    if (!backendAccessToken) {
      // 토큰이 없어도 기본 데이터 제공
      return NextResponse.json({
        code: "SUCCESS",
        data: {
          lastMonthlyTouristAttractionRankingInformation: {
            updatedDate: new Date().toISOString(),
            lastMonthlyTouristAttractionRankingList: []
          },
          sigunguMainEventInformation: {
            updatedDate: new Date().toISOString(),
            sigunguMainEvent: null
          },
          ongoingOrUpComingSigunguEventsFromTodayToMonthEndInformation: {
            updatedDate: new Date().toISOString(),
            sigunguEvents: []
          }
        }
      });
    }

    const dashboardData = await getDashboardOverview(backendAccessToken);
    return NextResponse.json(dashboardData);
  } catch (err: unknown) {
    // 오류 발생 시에도 기본 데이터 제공
    return NextResponse.json({
      code: "SUCCESS",
      data: {
        lastMonthlyTouristAttractionRankingInformation: {
          updatedDate: new Date().toISOString(),
          lastMonthlyTouristAttractionRankingList: []
        },
        sigunguMainEventInformation: {
          updatedDate: new Date().toISOString(),
          sigunguMainEvent: null
        },
        ongoingOrUpComingSigunguEventsFromTodayToMonthEndInformation: {
          updatedDate: new Date().toISOString(),
          sigunguEvents: []
        }
      }
    });
  }
}

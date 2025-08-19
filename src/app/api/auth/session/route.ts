import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";

export async function GET(request: NextRequest) {
    try {
        const session = await auth();
        
        if (!session?.user) {
            // 비로그인 상태는 정상적인 상태로 처리 (에러가 아님)
            return NextResponse.json(
                { 
                    authenticated: false,
                    user: null 
                },
                { status: 200 }
            );
        }

        return NextResponse.json({
            authenticated: true,
            user: session.user
        });
    } catch (error) {
        console.error('세션 조회 오류:', error);
        return NextResponse.json(
            { error: '세션 조회 중 오류가 발생했습니다.' },
            { status: 500 }
        );
    }
}
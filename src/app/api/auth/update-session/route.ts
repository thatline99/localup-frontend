import { NextResponse } from "next/server";
import { auth } from "@/auth";

export async function POST() {
    try {
        const session = await auth();
        
        if (!session?.user) {
            return NextResponse.json(
                { error: '인증되지 않은 사용자입니다.' },
                { status: 401 }
            );
        }

        // 세션 업데이트를 위한 응답
        // 실제로는 JWT 토큰을 다시 생성하거나 업데이트해야 하지만
        // 현재는 클라이언트에서 새로운 세션을 가져오도록 안내
        return NextResponse.json({
            success: true,
            message: '세션 업데이트 완료'
        });
    } catch (error) {
        console.error('세션 업데이트 오류:', error);
        return NextResponse.json(
            { error: '세션 업데이트 중 오류가 발생했습니다.' },
            { status: 500 }
        );
    }
}
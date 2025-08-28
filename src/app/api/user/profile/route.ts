import { NextRequest, NextResponse } from "next/server";

export const runtime = 'edge';

// 사용자 프로필 조회
export async function GET(request: NextRequest) {
    try {
        // 세션에서 백엔드 토큰 가져오기
        const sessionResponse = await fetch(new URL('/api/auth/session', request.url), {
            headers: request.headers
        });
        
        if (!sessionResponse.ok) {
            return NextResponse.json(
                { error: '세션 조회 중 오류가 발생했습니다.' },
                { status: 500 }
            );
        }
        
        const sessionData = await sessionResponse.json();
        
        if (!sessionData.authenticated) {
            return NextResponse.json(
                { error: '인증되지 않은 사용자입니다.' },
                { status: 401 }
            );
        }
        
        const backendAccessToken = sessionData.user?.backendAccessToken;
        
        if (!backendAccessToken) {
            return NextResponse.json(
                { error: '백엔드 인증 토큰이 없습니다.' },
                { status: 401 }
            );
        }
        
        // 백엔드 프로필 API 호출
        const response = await fetch(`${process.env.BACKEND_API_URL}/users/profile`, {
            method: 'GET',
            headers: {
                'Cookie': `accessToken=${backendAccessToken}`,
                'Authorization': `Bearer ${backendAccessToken}`
            }
        });

        if (!response.ok) {
            const errorText = await response.text();
            return NextResponse.json(
                { error: errorText || '프로필 조회에 실패했습니다.' },
                { status: response.status }
            );
        }

        const result = await response.json();
        return NextResponse.json(result);
        
    } catch (error) {
        console.error('프로필 조회 오류:', error);
        return NextResponse.json(
            { error: '프로필 조회 중 오류가 발생했습니다.' },
            { status: 500 }
        );
    }
}

// 사용자 프로필 업데이트
export async function PATCH(request: NextRequest) {
    try {
        // 세션에서 백엔드 토큰 가져오기
        const sessionResponse = await fetch(new URL('/api/auth/session', request.url), {
            headers: request.headers
        });
        
        if (!sessionResponse.ok) {
            return NextResponse.json(
                { error: '세션 조회 중 오류가 발생했습니다.' },
                { status: 500 }
            );
        }
        
        const sessionData = await sessionResponse.json();
        
        if (!sessionData.authenticated) {
            return NextResponse.json(
                { error: '인증되지 않은 사용자입니다.' },
                { status: 401 }
            );
        }
        
        const backendAccessToken = sessionData.user?.backendAccessToken;
        
        if (!backendAccessToken) {
            return NextResponse.json(
                { error: '백엔드 인증 토큰이 없습니다.' },
                { status: 401 }
            );
        }
        
        const body = await request.json();
        
        // 백엔드 프로필 업데이트 API 호출
        const response = await fetch(`${process.env.BACKEND_API_URL}/users/profile`, {
            method: 'PATCH',
            headers: {
                'Cookie': `accessToken=${backendAccessToken}`,
                'Authorization': `Bearer ${backendAccessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });

        if (!response.ok) {
            const errorText = await response.text();
            return NextResponse.json(
                { error: errorText || '프로필 업데이트에 실패했습니다.' },
                { status: response.status }
            );
        }

        const result = await response.json();
        return NextResponse.json(result);
        
    } catch (error) {
        console.error('프로필 업데이트 오류:', error);
        return NextResponse.json(
            { error: '프로필 업데이트 중 오류가 발생했습니다.' },
            { status: 500 }
        );
    }
}
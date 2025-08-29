import { NextRequest, NextResponse } from "next/server";

export const runtime = 'edge';

// 기존 사업정보 조회
async function getBusinessInfo(accessToken: string) {
    
    try {
        // 쿠키와 Authorization 헤더 둘 다 시도
        const response = await fetch(`${process.env.BACKEND_API_URL}/users/business`, {
            method: 'GET',
            headers: {
                'Cookie': `accessToken=${accessToken}`,
                'Authorization': `Bearer ${accessToken}`
            }
        });

        if (response.status === 404) {
            return null; // 사업정보가 없음
        }

        if (!response.ok) {
            
            // 특별한 상태코드들에 대한 처리
            if (response.status === 403) {
                // 403은 권한 문제로, 클라이언트에서도 403으로 처리
                const error = new Error('접근 권한이 없습니다.');
                error.name = 'FORBIDDEN';
                throw error;
            }
            
            // 응답 본문이 비어있는지 확인
            const responseText = await response.text();
            
            if (responseText) {
                try {
                    const error = JSON.parse(responseText);
                    throw new Error(error.message || '사업정보 조회에 실패했습니다.');
                } catch (parseError) {
                    throw new Error(responseText || '사업정보 조회에 실패했습니다.');
                }
            } else {
                // 빈 응답인 경우
                const statusMessages: { [key: number]: string } = {
                    404: '사업정보를 찾을 수 없습니다.',
                    500: '서버 오류가 발생했습니다.'
                };
                throw new Error(statusMessages[response.status] || '사업정보 조회에 실패했습니다.');
            }
        }

        const result = await response.json();
        
        // BaseResponse 구조인 경우
        if (result.code && result.data) {
            return result.data;
        }
        // 직접 DTO인 경우
        return result;
    } catch (error) {
        console.error('getBusinessInfo 에러:', error);
        throw error;
    }
}

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
        
        // 비로그인 상태 처리 (새로운 응답 구조 대응)
        if (!sessionData.authenticated) {
            return NextResponse.json(
                { error: '인증되지 않은 사용자입니다.' },
                { status: 401 }
            );
        }
        
        const backendAccessToken = sessionData.user?.backendAccessToken;
        
        console.log('[Business API] Session user:', sessionData.user?.email);
        console.log('[Business API] Backend token exists:', !!backendAccessToken);
        
        if (!backendAccessToken) {
            return NextResponse.json(
                { error: '백엔드 인증 토큰이 없습니다.' },
                { status: 401 }
            );
        }
        
        const businessInfo = await getBusinessInfo(backendAccessToken);

        // 404도 정상 응답으로 처리 (사업정보가 없는 경우)
        return NextResponse.json({
            success: true,
            data: businessInfo // null이거나 실제 데이터
        });
    } catch (err: unknown) {
        console.error('사업정보 조회 오류:', err);
        
        // 403 권한 에러는 적절한 상태코드로 응답
        if (err instanceof Error && err.name === 'FORBIDDEN') {
            return NextResponse.json(
                { error: err.message },
                { status: 403 }
            );
        }
        
        return NextResponse.json(
            { error: '사업정보 조회 중 오류가 발생했습니다.' },
            { status: 500 }
        );
    }
}
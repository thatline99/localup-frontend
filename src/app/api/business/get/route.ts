import { NextRequest, NextResponse } from "next/server";

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
                    console.log('파싱된 오류 내용:', error);
                    throw new Error(error.message || '사업정보 조회에 실패했습니다.');
                } catch (parseError) {
                    console.log('JSON 파싱 실패, 원본 텍스트 사용:', parseError);
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
        
        if (!backendAccessToken) {
            return NextResponse.json(
                { error: '백엔드 인증 토큰이 없습니다.' },
                { status: 401 }
            );
        }
        
        const businessInfo = await getBusinessInfo(backendAccessToken);

        if (!businessInfo) {
            return NextResponse.json(
                { error: '등록된 사업정보가 없습니다.' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            data: businessInfo
        });
    } catch (err: any) {
        console.error('사업정보 조회 오류:', err);
        
        // 403 권한 에러는 적절한 상태코드로 응답
        if (err.name === 'FORBIDDEN') {
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
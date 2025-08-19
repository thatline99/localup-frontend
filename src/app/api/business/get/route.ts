import { NextRequest, NextResponse } from "next/server";

// 기존 사업정보 조회
async function getBusinessInfo(accessToken: string) {
    console.log('=== getBusinessInfo 함수 시작 ===');
    console.log('전달받은 토큰:', accessToken);
    console.log('백엔드 URL:', `${process.env.BACKEND_API_URL}/users/business`);
    
    try {
        // 쿠키와 Authorization 헤더 둘 다 시도
        console.log('백엔드 요청 헤더 준비:');
        console.log('- Cookie:', `accessToken=${accessToken}`);
        console.log('- Authorization:', `Bearer ${accessToken}`);
        console.log('- 백엔드 URL:', `${process.env.BACKEND_API_URL}/users/business`);
        
        const response = await fetch(`${process.env.BACKEND_API_URL}/users/business`, {
            method: 'GET',
            headers: {
                'Cookie': `accessToken=${accessToken}`,
                'Authorization': `Bearer ${accessToken}`
            }
        });

        console.log('백엔드 응답 상태:', response.status);
        console.log('백엔드 응답 헤더:', Object.fromEntries(response.headers.entries()));

        if (response.status === 404) {
            console.log('사업정보 없음 (404)');
            return null; // 사업정보가 없음
        }

        if (!response.ok) {
            console.log('백엔드 오류 응답:', response.status);
            
            // 특별한 상태코드들에 대한 처리
            if (response.status === 403) {
                console.log('백엔드 접근 권한 없음 (403)');
                // 403은 권한 문제로, 클라이언트에서도 403으로 처리
                const error = new Error('접근 권한이 없습니다.');
                error.name = 'FORBIDDEN';
                throw error;
            }
            
            // 응답 본문이 비어있는지 확인
            const responseText = await response.text();
            console.log('응답 본문:', responseText);
            
            if (responseText) {
                try {
                    const error = JSON.parse(responseText);
                    console.log('파싱된 오류 내용:', error);
                    throw new Error(error.message || '사업정보 조회에 실패했습니다.');
                } catch (parseError) {
                    console.log('JSON 파싱 실패, 원본 텍스트 사용:', responseText);
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
        console.log('사업정보 조회 성공:', result);
        return result;
    } catch (error) {
        console.error('getBusinessInfo 에러:', error);
        throw error;
    }
}

export async function GET(request: NextRequest) {
    console.log('=== /api/business/get 호출됨 ===');
    console.log('요청 헤더들:', Object.fromEntries(request.headers.entries()));
    
    try {
        console.log('1. 세션 정보 요청 시작');
        // 세션에서 백엔드 토큰 가져오기
        const sessionResponse = await fetch(new URL('/api/auth/session', request.url), {
            headers: request.headers
        });
        
        console.log('2. 세션 응답 상태:', sessionResponse.status);
        
        if (!sessionResponse.ok) {
            console.log('세션 API 호출 실패');
            return NextResponse.json(
                { error: '세션 조회 중 오류가 발생했습니다.' },
                { status: 500 }
            );
        }
        
        const sessionData = await sessionResponse.json();
        console.log('3. 세션 데이터:', sessionData);
        
        // 비로그인 상태 처리 (새로운 응답 구조 대응)
        if (!sessionData.authenticated) {
            console.log('비로그인 상태');
            return NextResponse.json(
                { error: '인증되지 않은 사용자입니다.' },
                { status: 401 }
            );
        }
        
        const backendAccessToken = sessionData.user?.backendAccessToken;
        console.log('4. 백엔드 토큰:', backendAccessToken ? '존재함' : '없음');
        console.log('4-1. 백엔드 토큰 전체 값:', backendAccessToken);
        
        if (!backendAccessToken) {
            console.log('백엔드 토큰이 없음');
            return NextResponse.json(
                { error: '백엔드 인증 토큰이 없습니다.' },
                { status: 401 }
            );
        }

        console.log('5. getBusinessInfo 호출 시작');
        console.log('백엔드 토큰으로 API 호출:', backendAccessToken);
        
        const businessInfo = await getBusinessInfo(backendAccessToken);

        if (!businessInfo) {
            console.log('6. 사업정보 없음');
            return NextResponse.json(
                { error: '등록된 사업정보가 없습니다.' },
                { status: 404 }
            );
        }

        console.log('7. 사업정보 조회 성공');
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
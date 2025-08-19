import { NextRequest, NextResponse } from "next/server";

// 사업정보 업데이트
async function updateBusinessInfo(businessData: any, accessToken: string) {
    console.log('=== updateBusinessInfo 함수 시작 ===');
    console.log('업데이트할 데이터:', businessData);
    
    try {
        const response = await fetch(`${process.env.BACKEND_API_URL}/users/business`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Cookie': `accessToken=${accessToken}`,
                'Authorization': `Bearer ${accessToken}`
            },
            body: JSON.stringify(businessData)
        });

        console.log('백엔드 응답 상태:', response.status);

        if (!response.ok) {
            const responseText = await response.text();
            console.log('백엔드 오류 응답:', responseText);
            
            if (responseText) {
                try {
                    const error = JSON.parse(responseText);
                    throw new Error(error.message || '사업정보 수정에 실패했습니다.');
                } catch (parseError) {
                    throw new Error(responseText || '사업정보 수정에 실패했습니다.');
                }
            } else {
                const statusMessages: { [key: number]: string } = {
                    403: '접근 권한이 없습니다.',
                    404: '사업정보를 찾을 수 없습니다.',
                    500: '서버 오류가 발생했습니다.'
                };
                throw new Error(statusMessages[response.status] || '사업정보 수정에 실패했습니다.');
            }
        }

        const result = await response.json();
        console.log('사업정보 수정 성공:', result);
        return result;
    } catch (error) {
        console.error('updateBusinessInfo 에러:', error);
        throw error;
    }
}

export async function PATCH(request: NextRequest) {
    console.log('=== /api/business/update PATCH 호출됨 ===');
    
    try {
        const {
            businessName,
            businessSigunguCode,
            businessZipCode,
            businessAddress,
            businessAddressDetail,
            businessLatitude,
            businessLongitude,
            businessType,
            businessItem,
            businessAverageOrderAmount,
            businessSeatCount,
            businessCustomerSegments
        } = await request.json();

        // 필수 필드 검증
        if (!businessName || !businessSigunguCode || !businessZipCode || 
           !businessAddress || !businessType || !businessItem) {
            return NextResponse.json(
                { error: '필수 사업정보를 모두 입력해주세요' },
                { status: 400 }
            );
        }

        const businessData = {
            businessName,
            businessSigunguCode,
            businessZipCode,
            businessAddress,
            businessAddressDetail,
            businessLatitude,
            businessLongitude,
            businessType,
            businessItem,
            businessAverageOrderAmount,
            businessSeatCount,
            businessCustomerSegments
        };

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
        
        // 비로그인 상태 처리
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
        
        const business = await updateBusinessInfo(businessData, backendAccessToken);

        return NextResponse.json({
            success: true,
            message: '사업정보 수정 완료',
            business
        });
    } catch (err: any) {
        console.error('사업정보 수정 오류:', err);
        
        // 403 권한 에러는 적절한 상태코드로 응답
        if (err.name === 'FORBIDDEN') {
            return NextResponse.json(
                { error: err.message },
                { status: 403 }
            );
        }
        
        return NextResponse.json(
            { error: '사업정보 수정 중 오류가 발생했습니다.' },
            { status: 500 }
        );
    }
}
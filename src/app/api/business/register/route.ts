import { NextRequest, NextResponse } from "next/server";

// 사업정보 등록 또는 업데이트
async function registerOrUpdateBusiness(businessData: any, cookies: string) {
    // 먼저 기존 사업정보가 있는지 확인
    const checkResponse = await fetch(`${process.env.BACKEND_API_URL}/users/business`, {
        method: 'GET',
        headers: {
            'Cookie': cookies
        }
    });

    const method = checkResponse.status === 200 ? 'PATCH' : 'POST'; // 기존 정보가 있으면 PATCH, 없으면 POST

    const response = await fetch(`${process.env.BACKEND_API_URL}/users/business`, {
        method: method,
        headers: {
            'Content-Type': 'application/json',
            'Cookie': cookies // 사용자 인증 쿠키 전달
        },
        body: JSON.stringify(businessData)  
    })

    if(!response.ok){
        const error = await response.json()
        throw new Error(error.message || `사업정보 ${method === 'PATCH' ? '업데이트' : '등록'}에 실패했습니다.`)
    }

    return await response.json()
}

export async function POST(request: NextRequest){
    try{
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
            businessCustomerSegments,
            businessDescription
        } = await request.json()

        // 필수 필드 검증
        if(!businessName || !businessSigunguCode || !businessZipCode || 
           !businessAddress || !businessType || !businessItem) {
            return NextResponse.json(
                {error: '필수 사업정보를 모두 입력해주세요'},
                {status: 400}
            )
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
            businessCustomerSegments,
            businessDescription
        }

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
        
        const business = await registerOrUpdateBusiness(businessData, `accessToken=${backendAccessToken}`)

        return NextResponse.json({
            success: true,
            message: '사업정보 처리 완료',
            business
        })
    }
    catch(err){
        
        return NextResponse.json(
            {error: '사업정보 등록 중 오류가 발생했습니다'},
            {status: 500}
        )
    }
}
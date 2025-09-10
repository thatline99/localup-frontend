import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";

export const runtime = 'edge';

export async function GET(request: NextRequest) {
    try {
        // 세션 확인
        const session = await auth();
        
        if (!session?.user) {
            // 세션이 없으면 로그인 페이지로
            return NextResponse.redirect(new URL('/sign-in', request.url));
        }
        
        // 세션에서 백엔드 토큰 가져오기
        const backendAccessToken = (session.user as any).backendAccessToken;
        
        if (!backendAccessToken) {
            // 토큰이 없으면 로그인 페이지로
            return NextResponse.redirect(new URL('/sign-in', request.url));
        }
        
        // 1. 프로필 정보 확인
        let hasProfile = false;
        try {
            const profileUrl = new URL('/api/user/profile', request.url);
            const profileResponse = await fetch(profileUrl, {
                method: 'GET',
                headers: request.headers
            });
            
            if (profileResponse.ok) {
                const profileData = await profileResponse.json();
                // 프로필이 존재하고 필수 정보가 있는지 확인
                hasProfile = !!(profileData.data?.name && profileData.data?.phoneNumber);
            }
        } catch (error) {
            console.error('프로필 확인 오류:', error);
        }
        
        // 2. 사업정보 확인
        let hasBusinessInfo = false;
        try {
            const businessUrl = new URL('/api/business/get', request.url);
            const businessResponse = await fetch(businessUrl, {
                method: 'GET',
                headers: request.headers
            });
            
            if (businessResponse.ok) {
                const businessData = await businessResponse.json();
                // data.success가 있는 경우와 직접 data.data가 있는 경우 모두 처리
                const actualBusinessData = businessData.success ? businessData.data : businessData.data;
                // 사업정보가 존재하는지 확인
                hasBusinessInfo = !!(actualBusinessData && (actualBusinessData.name || actualBusinessData.businessName));
            }
        } catch (error) {
            console.error('사업정보 확인 오류:', error);
        }
        
        // 3. 상태에 따라 리다이렉트
        if (hasProfile && hasBusinessInfo) {
            // 프로필과 사업정보 모두 완료 - 대시보드로
            return NextResponse.redirect(new URL('/dashboard', request.url));
        } else if (hasProfile && !hasBusinessInfo) {
            // 프로필은 있지만 사업정보 없음 - 사업정보 설정 페이지로
            return NextResponse.redirect(new URL('/business', request.url));
        } else {
            // 프로필 정보가 없음 - 프로필 설정 페이지로
            return NextResponse.redirect(new URL('/profile', request.url));
        }
        
    } catch (error) {
        console.error('콜백 리다이렉트 오류:', error);
        // 오류 발생시 대시보드로
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }
}
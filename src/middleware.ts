import { auth } from "@/auth"

export default auth((req) => {
  const isLoggedIn = !!req.auth?.user
  const user = req.auth?.user
  const { pathname } = req.nextUrl


  // 카카오 로그인 콜백 후 에러 처리
  if (pathname.startsWith('/api/auth/callback/kakao')) {
    return; // API 경로는 처리하지 않음
  }

  // JWT 토큰에서 에러 정보 확인 (req.auth가 있지만 세션이 null인 경우)
  if (req.auth && !isLoggedIn) {
    const token = req.auth as { authError?: string };
    if (token.authError) {
      const redirectUrl = new URL('/sign-in', req.nextUrl);
      redirectUrl.searchParams.set('error', token.authError);
      return Response.redirect(redirectUrl);
    }
  }

  // 사업정보 필요 여부 확인: API로 실제 데이터 존재 여부 체크
  if (isLoggedIn && user?.needsBusinessInfo && !pathname.startsWith('/business-setup') && !pathname.startsWith('/dashboard') && !pathname.startsWith('/api')) {
    // 실제 사업정보가 있는지 확인하기 위해 대시보드 접근을 허용하고, 
    // 페이지 레벨에서 리다이렉트 처리하도록 함
  }

  // 인증 페이지: 로그인된 사용자는 대시보드로 (사업정보는 페이지에서 확인)
  if (pathname.startsWith('/auth/') && isLoggedIn) {
    return Response.redirect(new URL('/dashboard', req.nextUrl))
  }

  // 로그인/회원가입 페이지: 로그인된 사용자는 대시보드로 (사업정보는 페이지에서 확인)
  if ((pathname === '/sign-in' || pathname === '/sign-up') && isLoggedIn) {
    return Response.redirect(new URL('/dashboard', req.nextUrl))
  }

  // 사업정보 입력 페이지: 이미 설정 완료된 사용자는 대시보드로
  if (pathname.startsWith('/business-setup') && isLoggedIn && !user?.needsBusinessInfo) {
    return Response.redirect(new URL('/dashboard', req.nextUrl))
  }

  // 보호된 페이지: 비로그인 사용자는 로그인 페이지로
  const protectedPaths = ['/home', '/dashboard', '/business-setup']
  const isProtectedPage = protectedPaths.some(path => pathname.startsWith(path))
  
  if (isProtectedPage && !isLoggedIn) {
    return Response.redirect(new URL('/sign-in', req.nextUrl))
  }
})

// 더 구체적인 matcher (권장)
export const config = {
  matcher: [
    '/home/:path*',
    '/auth/:path*',
    '/dashboard/:path*',
    '/business-setup/:path*',
    '/sign-in',
    '/sign-up'
  ]
}
export const config = {
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
  
  // API URL 설정
  apiUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
  
  // 사이트 URL 설정
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || (
    process.env.NODE_ENV === 'production' 
      ? 'https://localup.store' 
      : 'https://dev.localup.store'
  ),
  
  // 앱 정보
  appName: '로컬업(LocalUp)',
  appDescription: 'AI가 분석하는 실시간 관광 트렌드로 매출을 높이세요',
};
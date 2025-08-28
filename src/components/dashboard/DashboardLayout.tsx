'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui';
import { signOut, useSession } from 'next-auth/react';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

interface UserProfileData {
  name: string;
  phoneNumber?: string;
  position?: string;
  email: string;
}

interface BusinessData {
  name: string;
}

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { data: session } = useSession();
  const [userProfile, setUserProfile] = useState<UserProfileData | null>(null);
  const [businessInfo, setBusinessInfo] = useState<BusinessData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // 사용자 프로필 및 사업정보 로드
  useEffect(() => {
    const fetchUserData = async () => {
      if (!session?.user) {
        setIsLoading(false);
        return;
      }

      try {
        // 프로필 정보 가져오기
        const profileResponse = await fetch('/api/user/profile', {
          credentials: 'include'
        });
        
        if (profileResponse.ok) {
          const profileData = await profileResponse.json();
          if (profileData.data) {
            setUserProfile({
              name: profileData.data.name || session.user.name || '사용자',
              phoneNumber: profileData.data.phoneNumber,
              position: profileData.data.position,
              email: profileData.data.email || session.user.email || ''
            });
          }
        }

        // 사업정보 가져오기
        const businessResponse = await fetch('/api/business/get', {
          credentials: 'include'
        });
        
        if (businessResponse.ok) {
          const businessData = await businessResponse.json();
          
          if (businessData.success && businessData.data && businessData.data.name) {
            // 데이터가 정상적으로 있는 경우
            setBusinessInfo({
              name: businessData.data.name
            });
          } else {
            // 데이터가 없거나 name 필드가 없는 경우
            setBusinessInfo({
              name: '사업정보 미등록'
            });
          }
        }
      } catch (error) {
        console.error('사용자 정보 로드 오류:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [session]);

  // 사용자 이름의 첫 글자 추출
  const getInitial = (name: string) => {
    if (!name) return '?';
    // 한글인 경우 성씨 추출, 영문인 경우 첫 글자
    const koreanMatch = name.match(/^[가-힣]/);
    if (koreanMatch) {
      return name.charAt(0); // 한글 성씨
    }
    return name.charAt(0).toUpperCase(); // 영문 첫 글자
  };

  const handleLogout = async () => {
    try {
      
      // 카카오 로그인인 경우 카카오 로그아웃도 함께 처리
      if (session?.user?.provider === 'kakao') {
        
        // NextAuth 로그아웃 먼저 실행
        await signOut({ 
          callbackUrl: '/sign-in',
          redirect: false  // 자동 리다이렉트 비활성화
        });
        
        // 카카오 로그아웃 처리
        try {
          // 카카오 SDK가 로드되어 있는 경우 카카오 로그아웃 실행
          if (typeof window !== 'undefined' && (window as { Kakao?: { Auth?: { logout: (callback: () => void) => void } } }).Kakao) {
            (window as { Kakao?: { Auth?: { logout: (callback: () => void) => void } } }).Kakao?.Auth?.logout(() => {
              router.push('/sign-in');
            });
          } else {
            router.push('/sign-in');
          }
        } catch (error) {
          console.error("카카오 로그아웃 처리 중 오류:", error);
          router.push('/sign-in');
        }
      } else {
        // 일반 로그인인 경우
        await signOut({ 
          callbackUrl: '/sign-in',
          redirect: true 
        });
      }
    } catch (error) {
      console.error("로그아웃 오류:", error);
      // 오류 발생 시에도 로그인 페이지로 이동
      router.push('/sign-in');
    }
  };

  const navigation = [
    {
      name: '대시보드',
      href: '/dashboard',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
    },
    {
      name: 'AI 솔루션',
      href: '/dashboard/ai',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      name: '트렌드 분석',
      href: '/dashboard/trends',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
    },
    {
      name: '보고서',
      href: '/dashboard/reports',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
    },
    {
      name: '경쟁사 분석',
      href: '/dashboard/competitors',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
    },
  ];

  const bottomNavigation = [
    {
      name: '프로필',
      href: '/dashboard/profile',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
    },
    {
      name: '설정',
      href: '/dashboard/settings',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="h-screen bg-neutral-50 flex overflow-hidden">
      {/* 모바일 헤더 */}
      <div className="lg:hidden">
        <div className="fixed top-0 left-0 right-0 z-40 bg-white border-b border-neutral-200">
          <div className="flex items-center justify-between px-4 h-16">
            <Link href="/dashboard" className="font-bold text-xl text-primary-600">
              LocalUp
            </Link>
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 rounded-lg hover:bg-neutral-100"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* 사이드바 */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-neutral-200 transform transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:transform-none
      `}>
        <div className="flex flex-col h-full">
          {/* 헤더 */}
          <div className="flex items-center justify-between p-4 border-b border-neutral-200 flex-shrink-0">
            <Link href="/dashboard" className="font-bold text-xl text-primary-600">
              LocalUp
            </Link>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="lg:hidden p-2 rounded-lg hover:bg-neutral-100"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* 메인 네비게이션 - 가능한 공간만큼 차지 */}
          <div className="flex-1 py-4 min-h-0">
            <nav className="px-3 space-y-1">
              {navigation.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`
                      flex items-center gap-3 px-3 py-2 rounded-lg transition-colors
                      ${isActive 
                        ? 'bg-primary-50 text-primary-700' 
                        : 'text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900'
                      }
                    `}
                  >
                    {item.icon}
                    <span className="font-medium">{item.name}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* 하단 고정 영역 */}
          <div className="border-t border-neutral-200 p-4 flex-shrink-0">
            <nav className="space-y-1">
              {bottomNavigation.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`
                      flex items-center gap-3 px-3 py-2 rounded-lg transition-colors
                      ${isActive 
                        ? 'bg-primary-50 text-primary-700' 
                        : 'text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900'
                      }
                    `}
                  >
                    {item.icon}
                    <span className="font-medium">{item.name}</span>
                  </Link>
                );
              })}
            </nav>

            <div className="mt-4 pt-4 border-t border-neutral-200">
              <div className="flex items-center gap-3 px-3">
                {isLoading ? (
                  // 로딩 상태
                  <>
                    <div className="w-10 h-10 bg-neutral-200 rounded-full animate-pulse" />
                    <div className="flex-1">
                      <div className="h-4 bg-neutral-200 rounded w-20 mb-1 animate-pulse" />
                      <div className="h-3 bg-neutral-200 rounded w-24 animate-pulse" />
                    </div>
                  </>
                ) : (
                  // 실제 데이터 표시
                  <>
                    <div className="w-10 h-10 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center font-semibold">
                      {getInitial(userProfile?.name || session?.user?.name || '?')}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-neutral-900">
                        {userProfile?.name || session?.user?.name || '사용자'}
                      </div>
                      <div className="text-sm text-neutral-500">
                        {businessInfo?.name || '사업정보 미등록'}
                      </div>
                    </div>
                  </>
                )}
              </div>
              <Button 
                variant="ghost" 
                className="w-full mt-3 justify-start" 
                size="sm"
                onClick={handleLogout}
              >
                <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013 3v1" />
                </svg>
                로그아웃
              </Button>
            </div>
          </div>
        </div>
      </aside>

      {/* 모바일 오버레이 */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* 메인 콘텐츠 */}
      <main className="flex-1 overflow-y-auto">
        <div className="pt-16 lg:pt-0">
          {children}
        </div>
      </main>
    </div>
  );
};
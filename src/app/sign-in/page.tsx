"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { signIn, getSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import useUserStore from "@/store/userStore";
import {
  Button,
  Input,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  useToast,
} from "@/components/ui";

function SignInContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { showToast, ToastContainer } = useToast();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [showPassword, setShowPassword] = useState(false);
  const [lastLoginInfo, setLastLoginInfo] = useState<any>(null);
  const [isFirstTimeUser, setIsFirstTimeUser] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    remember: false,
  });

  // localStorage에서 최근 로그인 정보 로드
  useEffect(() => {
    const storedLoginInfo = localStorage.getItem('lastLoginInfo');
    if (storedLoginInfo) {
      try {
        const info = JSON.parse(storedLoginInfo);
        setLastLoginInfo(info);
        setIsFirstTimeUser(info.isFirstTime || false);
      } catch (e) {
        console.error('Failed to parse lastLoginInfo:', e);
      }
    } else {
      setIsFirstTimeUser(true);
    }
  }, []);
  
  // 이메일 입력 시 최근 로그인 정보 조회
  const checkLastLoginInfo = async (email: string) => {
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return;
    
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL || "http://localhost:8080/api"}/auth/last-login?email=${email}`
      );
      
      if (response.ok) {
        const data = await response.json();
        if (data.data) {
          setLastLoginInfo(data.data);
          setIsFirstTimeUser(data.data.isFirstTime);
          // localStorage에 저장
          localStorage.setItem('lastLoginInfo', JSON.stringify(data.data));
        }
      }
    } catch (error) {
      console.error('Failed to fetch last login info:', error);
    }
  };

  // URL 파라미터에서 에러 메시지 확인
  useEffect(() => {
    const errorParam = searchParams.get("error");
    if (errorParam) {
      const errorMessage = parseUrlError(errorParam);

      // Toast로 에러 메시지 표시
      showToast(errorMessage, "error", 7000);

      // URL에서 에러 파라미터 제거 (히스토리 정리)
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.delete("error");
      window.history.replaceState({}, "", newUrl.toString());
    }
  }, [searchParams, showToast]);

  // URL 에러 파라미터 파싱
  const parseUrlError = (errorParam: string): string => {
    switch (errorParam) {
      case "OAuthAccountNotLinked":
        return "이미 다른 방법으로 가입된 이메일입니다.";
      case "OAuthCallback":
        return "소셜 로그인 중 오류가 발생했습니다.";
      case "KakaoAuthFailed":
      case "kakao_auth_failed":
        return "카카오 로그인에 실패했습니다. 잠시 후 다시 시도해주세요.";
      case "KakaoAccountDisabled":
      case "kakao_account_disabled":
        return "카카오 계정이 비활성화되었습니다. 고객센터에 문의해주세요.";
      case "kakao_network_error":
        return "네트워크 오류가 발생했습니다. 인터넷 연결을 확인하고 다시 시도해주세요.";
      default:
        return "로그인 중 오류가 발생했습니다. 다시 시도해주세요.";
    }
  };

  // fix(paz): 현재 로그인시 next-auth에서 throw한 예외를 제대로 잡지 못하는 문제가 있음. 수정 필요
  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(""); // 에러 초기화

    try {
      // 직접 백엔드에 로그인 요청을 보내서 정확한 에러 정보를 받음
      const directResponse = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL || "http://localhost:8080/api"}/auth/sign-in`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include", // 쿠키를 받기 위해 추가
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
          }),
        },
      );

      if (directResponse.status === 403) {
        // 403 에러 - 이메일 인증 필요
        const errorData = await directResponse.json();
        console.log('403 Error Response:', errorData); // 디버깅용
        if (errorData.code === "EMAIL_NOT_VERIFIED") {
          setError("이메일 인증을 완료해주세요.");
        } else {
          setError("계정이 비활성화되었습니다.");
        }
        return;
      } else if (directResponse.status === 401) {
        // 401 에러 - 잘못된 자격증명
        console.log('401 Error - Invalid credentials'); // 디버깅용
        setError("이메일 또는 비밀번호가 일치하지 않습니다.");
        return;
      } else if (!directResponse.ok) {
        // 기타 서버 에러
        setError("서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
        return;
      }

      // 백엔드 로그인이 성공했다면 NextAuth로 로그인 처리
      const result = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (result?.ok) {
        // 로그인 성공 - localStorage 업데이트
        const loginInfo = {
          email: formData.email,
          lastLoginMethod: 'EMAIL',
          lastLoginTime: new Date().toISOString(),
          deviceType: 'desktop',
          isFirstTime: false
        };
        localStorage.setItem('lastLoginInfo', JSON.stringify(loginInfo));
        
        // 세션 새로고침
        const session = await getSession();
        
        // Zustand store에서 사용자 데이터 로드
        const { fetchUserData } = useUserStore.getState();
        
        // 프로필과 사업정보 확인 후 적절한 페이지로 리다이렉트
        if (session?.user) {
          try {
            // store에 사용자 데이터 로드
            await fetchUserData();
            
            // 1. 프로필 정보 확인
            const profileResponse = await fetch('/api/user/profile', {
              credentials: 'include'
            });
            
            let hasProfile = false;
            let profileData = null;
            
            if (profileResponse.ok) {
              profileData = await profileResponse.json();
              // 프로필이 존재하고 필수 정보가 있는지 확인
              hasProfile = !!(profileData.data?.name && profileData.data?.phoneNumber);
            }
            
            // 2. 사업정보 확인
            const businessResponse = await fetch('/api/business/get', {
              credentials: 'include'
            });
            
            let hasBusinessInfo = false;
            
            if (businessResponse.ok) {
              const businessData = await businessResponse.json();
              // 사업정보가 존재하는지 확인
              hasBusinessInfo = !!(businessData.data && (businessData.data.name || businessData.data.businessName));
            }
            
            // 3. 상태에 따라 리다이렉트
            if (!hasProfile) {
              // 프로필 정보가 없음 - 프로필 설정 페이지로
              router.push("/profile");
            } else if (!hasBusinessInfo) {
              // 프로필은 있지만 사업정보 없음 - 사업정보 설정 페이지로
              router.push("/business");
            } else {
              // 모두 완료 - 대시보드로
              router.push("/dashboard");
            }
          } catch (error) {
            console.error('프로필/사업정보 확인 오류:', error);
            // 에러 발생시 일단 대시보드로 이동 (대시보드에서 다시 체크)
            router.push("/dashboard");
          }
        } else {
          router.push("/dashboard");
        }
        
        router.refresh();
      } else {
        // NextAuth 로그인 실패
        setError("로그인 처리 중 오류가 발생했습니다.");
      }
    } catch {
      setError("네트워크 오류가 발생했습니다. 인터넷 연결을 확인해주세요.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-neutral-50 to-neutral-100 px-4 py-12">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <Link href="/" className="inline-block">
              <h1 className="text-3xl font-bold text-primary-600">LocalUp</h1>
            </Link>
            <p className="mt-2 text-neutral-600">
              {isFirstTimeUser ? "만나서 반가워요!" : "다시 만나서 반가워요!"}
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-center">로그인</CardTitle>
            </CardHeader>

            <CardContent>
              {error && (
                <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              <form onSubmit={handleEmailLogin} noValidate className="space-y-4">
                <Input
                  label="이메일"
                  type="text"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  onBlur={(e) => checkLastLoginInfo(e.target.value)}
                  placeholder="example@email.com"
                />

                <div className="relative">
                  <Input
                    label="비밀번호"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    placeholder="비밀번호를 입력하세요"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-[34px] text-neutral-500 hover:text-neutral-700"
                  >
                    {showPassword ? (
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.remember}
                      onChange={(e) =>
                        setFormData({ ...formData, remember: e.target.checked })
                      }
                      className="rounded"
                    />
                    <span className="text-sm text-neutral-600">
                      자동 로그인
                    </span>
                  </label>

                  <Link
                    href="/forgot-password"
                    className="text-sm text-primary-600 hover:underline"
                  >
                    비밀번호 찾기
                  </Link>
                </div>

                <Button type="submit" loading={loading} className="w-full">
                  로그인
                </Button>

                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-neutral-300"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="bg-white px-4 text-neutral-500">또는</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={async () => {
                    setLoading(true);
                    try {
                      // 카카오 로그인 후 자동으로 프로필/사업정보 체크하도록 콜백 URL 설정
                      await signIn("kakao", {
                        callbackUrl: "/api/auth/callback-redirect",
                        redirect: true,
                      });
                    } catch (error) {
                      console.error('카카오 로그인 오류:', error);
                      setError('카카오 로그인 중 오류가 발생했습니다.');
                    } finally {
                      setLoading(false);
                    }
                  }}
                  className="relative h-11 w-full overflow-hidden rounded-lg transition-opacity hover:opacity-90"
                  style={{ backgroundColor: "#FEE500" }}
                  disabled={loading}
                >
                  <img
                    src="/images/auth/kakao-login-button.png"
                    alt="카카오 로그인"
                    className="absolute inset-0 h-full w-full object-contain"
                  />
                </button>
              </form>

              <div className="mt-6 text-center text-sm text-neutral-600">
                아직 계정이 없으신가요?{" "}
                <Link
                  href="/sign-up"
                  className="text-primary-600 hover:underline"
                >
                  회원가입
                </Link>
              </div>
            </CardContent>
          </Card>

          <div className="mt-8 text-center text-sm text-neutral-500">
            <div className="mb-2 flex items-center justify-center gap-2">
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                  clipRule="evenodd"
                />
              </svg>
              <span>안전한 로그인</span>
            </div>
            <p>
              {lastLoginInfo && !lastLoginInfo.isFirstTime ? (
                <>
                  최근 로그인: {lastLoginInfo.lastLoginMethod === 'EMAIL' ? '이메일' : '카카오'} 
                  {lastLoginInfo.deviceType && ` (${
                    lastLoginInfo.deviceType === 'mobile' ? '모바일' : 
                    lastLoginInfo.deviceType === 'tablet' ? '태블릿' : 
                    '데스크톱'
                  })`}
                </>
              ) : (
                '최근 로그인: 새 기기에서 로그인'
              )}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default function SignInPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SignInContent />
    </Suspense>
  );
}

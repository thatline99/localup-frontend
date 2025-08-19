'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { signIn, getSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button, Input, Card, CardHeader, CardTitle, CardContent, useToast } from '@/components/ui';

export default function SignInPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { showToast, ToastContainer } = useToast();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    remember: false,
  });

  // URL 파라미터에서 에러 메시지 확인
  useEffect(() => {
    const errorParam = searchParams.get('error');
    if (errorParam) {
      const errorMessage = parseUrlError(errorParam);
      
      // Toast로 에러 메시지 표시
      showToast(errorMessage, 'error', 7000);
      
      // URL에서 에러 파라미터 제거 (히스토리 정리)
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.delete('error');
      window.history.replaceState({}, '', newUrl.toString());
    }
  }, [searchParams, showToast]);

  // URL 에러 파라미터 파싱
  const parseUrlError = (errorParam: string): string => {
    switch (errorParam) {
      case 'OAuthAccountNotLinked':
        return '이미 다른 방법으로 가입된 이메일입니다.';
      case 'OAuthCallback':
        return '소셜 로그인 중 오류가 발생했습니다.';
      case 'KakaoAuthFailed':
      case 'kakao_auth_failed':
        return '카카오 로그인에 실패했습니다. 잠시 후 다시 시도해주세요.';
      case 'KakaoAccountDisabled':
      case 'kakao_account_disabled':
        return '카카오 계정이 비활성화되었습니다. 고객센터에 문의해주세요.';
      case 'kakao_network_error':
        return '네트워크 오류가 발생했습니다. 인터넷 연결을 확인하고 다시 시도해주세요.';
      default:
        return '로그인 중 오류가 발생했습니다. 다시 시도해주세요.';
    }
  };

  // fix(paz): 현재 로그인시 next-auth에서 throw한 예외를 제대로 잡지 못하는 문제가 있음. 수정 필요
  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(''); // 에러 초기화

    try {
      const result = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      console.log(result)

      if (result?.error) {
        // next-auth에서 받은 에러 처리
        console.log('원본 에러:', result.error);
        console.log('에러 전체 객체:', JSON.stringify(result, null, 2));
        
        const errorMessage = parseAuthError(result.error);
        setError(errorMessage);
      } else if (result?.ok) {
        // 로그인 성공 - 세션 새로고침 후 리다이렉트
        await getSession();
        router.push('/dashboard');
        router.refresh();
      } else {
        // 예상치 못한 상황
        setError('로그인 중 오류가 발생했습니다.');
      }
    } catch (error) {
      console.error('로그인 처리 중 오류:', error);
      setError('로그인 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 에러 메시지 파싱 함수
  const parseAuthError = (error: string): string => {
    console.log('파싱할 에러:', error);
    
    // 에러 타입별 처리
    if (error.includes('INVALID_CREDENTIALS') || error === 'INVALID_CREDENTIALS') {
      return '이메일 또는 비밀번호가 일치하지 않습니다.';
    } else if (error.includes('ACCOUNT_DISABLED') || error === 'ACCOUNT_DISABLED') {
      return '가입하신 이메일의 메일함에서 인증을 완료해주세요.';
    } else if (error.includes('SERVER_ERROR') || error === 'SERVER_ERROR') {
      return '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.';
    } else if (error.includes('NETWORK_ERROR') || error === 'NETWORK_ERROR') {
      return '네트워크 오류가 발생했습니다. 인터넷 연결을 확인해주세요.';
    } else if (error.includes('MISSING_CREDENTIALS') || error === 'MISSING_CREDENTIALS') {
      return '이메일과 비밀번호를 입력해주세요.';
    } else if (error.includes('INVALID_EMAIL') || error === 'INVALID_EMAIL') {
      return '올바른 이메일 형식이 아닙니다.';
    } else if (error.includes('PASSWORD_TOO_SHORT') || error === 'PASSWORD_TOO_SHORT') {
      return '비밀번호는 6자 이상이어야 합니다.';
    }
    
    // 메시지 자체가 이미 사용자 친화적인 경우 그대로 사용
    if (error.includes('이메일') || error.includes('비밀번호') || error.includes('계정') || error.includes('서버') || error.includes('네트워크')) {
      return error;
    }
    
    // 기본 에러 처리
    return '로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요.';
  };

  return (
    <>
      <ToastContainer />
      <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100 flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <h1 className="text-3xl font-bold text-primary-600">LocalUp</h1>
          </Link>
          <p className="mt-2 text-neutral-600">
            다시 만나서 반가워요!
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-center">로그인</CardTitle>
          </CardHeader>
          
          <CardContent>
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}
            
            <form onSubmit={handleEmailLogin} className="space-y-4">
              <Input
                label="이메일"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="example@email.com"
                required
              />
              
              <Input
                label="비밀번호"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="비밀번호를 입력하세요"
                required
              />

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.remember}
                    onChange={(e) => setFormData({ ...formData, remember: e.target.checked })}
                    className="rounded"
                  />
                  <span className="text-sm text-neutral-600">자동 로그인</span>
                </label>
                
                <Link href="/forgot-password" className="text-sm text-primary-600 hover:underline">
                  비밀번호 찾기
                </Link>
              </div>

              <Button
                type="submit"
                loading={loading}
                className="w-full"
              >
                로그인
              </Button>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-neutral-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-neutral-500">또는</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  console.log("카카오 로그인 버튼 클릭");
                  signIn('kakao', { 
                    callbackUrl: '/dashboard',
                    redirect: true
                  })
                }}
                className="relative w-full h-11 rounded-lg overflow-hidden hover:opacity-90 transition-opacity"
                style={{ backgroundColor: '#FEE500' }}
              >
                <img
                  src="/images/auth/kakao-login-button.png"
                  alt="카카오 로그인"
                  className="absolute inset-0 w-full h-full object-contain"
                />
              </button>
            </form>
            
            <div className="text-center mt-6 text-sm text-neutral-600">
              아직 계정이 없으신가요?{' '}
              <Link href="/sign-up" className="text-primary-600 hover:underline">
                회원가입
              </Link>
            </div>
          </CardContent>
        </Card>

        <div className="mt-8 text-center text-sm text-neutral-500">
          <div className="flex items-center justify-center gap-2 mb-2">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
            </svg>
            <span>안전한 로그인</span>
          </div>
          <p>
            최근 로그인: 새 기기에서 로그인
          </p>
        </div>
      </div>
      </div>
    </>
  );
}

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button, Input, Card, CardHeader, CardTitle, CardContent } from '@/components/ui';

export default function SignInPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    remember: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    setTimeout(() => {
      setLoading(false);
      router.push('/dashboard');
    }, 1500);
  };

  return (
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
            <form onSubmit={handleSubmit} className="space-y-4">
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

              <Button 
                variant="outline" 
                className="w-full" 
                type="button"
                onClick={() => {
                  console.log('카카오 로그인');
                }}
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path fill="#FEE500" d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0z"/>
                  <path fill="#000000" d="M12 4.146c4.373 0 7.854 3.48 7.854 7.854 0 4.373-3.481 7.854-7.854 7.854-1.827 0-3.544-.609-4.908-1.66l-3.125 1.035a.481.481 0 01-.611-.607l1.046-3.146a7.818 7.818 0 01-1.656-4.83c0-4.374 3.481-7.854 7.854-7.854z"/>
                </svg>
                카카오톡으로 로그인
              </Button>
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
  );
}

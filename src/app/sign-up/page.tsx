'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button, Input, Card, CardHeader, CardContent } from '@/components/ui';
import { BusinessType } from '@/types';

export default function SignUpPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    passwordConfirm: '',
    businessName: '',
    businessType: '',
    businessSubType: '',
    registrationNumber: '',
    address: '',
    operatingHours: {
      monday: { open: '09:00', close: '22:00', isOpen: true },
      tuesday: { open: '09:00', close: '22:00', isOpen: true },
      wednesday: { open: '09:00', close: '22:00', isOpen: true },
      thursday: { open: '09:00', close: '22:00', isOpen: true },
      friday: { open: '09:00', close: '22:00', isOpen: true },
      saturday: { open: '09:00', close: '22:00', isOpen: true },
      sunday: { open: '09:00', close: '22:00', isOpen: true },
    },
    averagePrice: '',
    capacity: '',
    targetCustomers: [] as string[],
    marketingConsent: false,
  });

  const businessTypes = [
    { value: BusinessType.RESTAURANT, label: '음식점' },
    { value: BusinessType.ACCOMMODATION, label: '숙박업' },
    { value: BusinessType.RETAIL, label: '소매업' },
    { value: BusinessType.EXPERIENCE, label: '체험·레저' },
  ];

  const businessSubTypes: Record<string, string[]> = {
    [BusinessType.RESTAURANT]: ['한식', '중식', '일식', '양식', '카페', '기타'],
    [BusinessType.ACCOMMODATION]: ['호텔', '모텔', '펜션', '게스트하우스', '민박', '기타'],
    [BusinessType.RETAIL]: ['기념품', '특산품', '편의점', '의류', '액세서리', '기타'],
    [BusinessType.EXPERIENCE]: ['액티비티', '문화체험', '투어', '워크샵', '기타'],
  };

  const targetCustomerOptions = [
    '가족 단위',
    '커플/연인',
    '비즈니스',
    '단체/모임',
    '1인 여행객',
    '외국인 관광객',
  ];


  const handleNext = () => {
    if (step < 4) setStep(step + 1);
  };

  const handlePrev = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    setTimeout(() => {
      setLoading(false);
      router.push('/dashboard');
    }, 2000);
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold mb-6">계정 생성</h2>
            
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
              placeholder="8자 이상 입력하세요"
              required
            />
            
            <Input
              label="비밀번호 확인"
              type="password"
              value={formData.passwordConfirm}
              onChange={(e) => setFormData({ ...formData, passwordConfirm: e.target.value })}
              placeholder="비밀번호를 다시 입력하세요"
              required
            />

            <div className="space-y-2">
              <label className="flex items-start gap-2">
                <input
                  type="checkbox"
                  className="mt-1"
                  required
                />
                <span className="text-sm text-neutral-600">
                  [필수] 서비스 이용약관에 동의합니다
                </span>
              </label>
              
              <label className="flex items-start gap-2">
                <input
                  type="checkbox"
                  className="mt-1"
                  required
                />
                <span className="text-sm text-neutral-600">
                  [필수] 개인정보 처리방침에 동의합니다
                </span>
              </label>
              
              <label className="flex items-start gap-2">
                <input
                  type="checkbox"
                  className="mt-1"
                  checked={formData.marketingConsent}
                  onChange={(e) => setFormData({ ...formData, marketingConsent: e.target.checked })}
                />
                <span className="text-sm text-neutral-600">
                  [선택] 마케팅 정보 수신에 동의합니다
                </span>
              </label>
            </div>

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
                console.log('카카오 회원가입');
              }}
              className="w-full h-11 flex items-center justify-center rounded-lg overflow-hidden hover:opacity-90 transition-opacity"
            >
              <img
                src="/images/auth/kakao-login-button.png"
                alt="카카오 로그인"
                className="h-full w-auto"
              />
            </button>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold mb-6">업체 정보 입력</h2>
            
            <Input
              label="업체명"
              value={formData.businessName}
              onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
              placeholder="로컬업 레스토랑"
              required
            />
            
            <div>
              <label className="label mb-2 block">업종 선택</label>
              <select
                className="input"
                value={formData.businessType}
                onChange={(e) => setFormData({ ...formData, businessType: e.target.value, businessSubType: '' })}
                required
              >
                <option value="">업종을 선택하세요</option>
                {businessTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            {formData.businessType && (
              <div>
                <label className="label mb-2 block">세부 업종</label>
                <select
                  className="input"
                  value={formData.businessSubType}
                  onChange={(e) => setFormData({ ...formData, businessSubType: e.target.value })}
                  required
                >
                  <option value="">세부 업종을 선택하세요</option>
                  {businessSubTypes[formData.businessType]?.map((subType) => (
                    <option key={subType} value={subType}>
                      {subType}
                    </option>
                  ))}
                </select>
              </div>
            )}
            
            <Input
              label="사업자등록번호"
              value={formData.registrationNumber}
              onChange={(e) => setFormData({ ...formData, registrationNumber: e.target.value })}
              placeholder="000-00-00000"
              required
            />
            
            <Input
              label="업체 주소"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="주소를 입력하세요"
              required
            />
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold mb-6">운영 정보</h2>
            
            <Input
              label="평균 객단가"
              type="number"
              value={formData.averagePrice}
              onChange={(e) => setFormData({ ...formData, averagePrice: e.target.value })}
              placeholder="15000"
              helperText="원 단위로 입력하세요"
              required
            />
            
            <Input
              label={formData.businessType === BusinessType.ACCOMMODATION ? '객실 수' : '좌석 수'}
              type="number"
              value={formData.capacity}
              onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
              placeholder="50"
              required
            />

            <div>
              <label className="label mb-2 block">주요 고객층 (복수 선택)</label>
              <div className="space-y-2">
                {targetCustomerOptions.map((option) => (
                  <label key={option} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.targetCustomers.includes(option)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setFormData({
                            ...formData,
                            targetCustomers: [...formData.targetCustomers, option],
                          });
                        } else {
                          setFormData({
                            ...formData,
                            targetCustomers: formData.targetCustomers.filter((c) => c !== option),
                          });
                        }
                      }}
                    />
                    <span className="text-sm">{option}</span>
                  </label>
                ))}
              </div>
            </div>

          </div>
        );

      case 4:
        return (
          <div className="space-y-4 text-center">
            <div className="w-20 h-20 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            
            <h2 className="text-2xl font-bold mb-2">이메일 인증</h2>
            <p className="text-neutral-600 mb-6">
              {formData.email}로 인증 메일을 발송했습니다.
              <br />
              메일함을 확인해주세요.
            </p>
            
            <Input
              label="인증 코드"
              placeholder="6자리 인증 코드를 입력하세요"
              className="max-w-xs mx-auto"
            />
            
            <Button variant="ghost" type="button" className="text-sm">
              인증 메일 재발송
            </Button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center py-12 px-4">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <div className="text-center mb-4">
            <Link href="/" className="text-2xl font-bold text-primary-600">
              LocalUp
            </Link>
          </div>
          <div className="flex items-center justify-between mb-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex-1 relative">
                <div
                  className={`h-2 ${
                    i <= step ? 'bg-primary-600' : 'bg-neutral-200'
                  } ${i < 4 ? 'mr-2' : ''}`}
                />
                {i < 4 && (
                  <div
                    className={`absolute right-0 top-0 h-2 w-2 ${
                      i < step ? 'bg-primary-600' : 'bg-neutral-200'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit}>
            {renderStep()}
            
            <div className="flex gap-4 mt-8">
              {step > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handlePrev}
                  className="flex-1"
                >
                  이전
                </Button>
              )}
              
              {step < 4 ? (
                <Button
                  type="button"
                  onClick={handleNext}
                  className="flex-1"
                >
                  다음
                </Button>
              ) : (
                <Button
                  type="submit"
                  loading={loading}
                  className="flex-1"
                >
                  가입 완료
                </Button>
              )}
            </div>
          </form>
          
          <div className="text-center mt-6 text-sm text-neutral-600">
            이미 계정이 있으신가요?{' '}
            <Link href="/sign-in" className="text-primary-600 hover:underline">
              로그인
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
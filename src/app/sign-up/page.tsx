'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button, Input, Card, CardHeader, CardContent } from '@/components/ui';
import { BusinessType, CustomerSegment, CustomerSegmentLabels } from '../../types';

export default function SignUpPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    passwordConfirm: '',
    businessName: '',
    businessType: '',
    businessSubType: '', // businessItem으로 매핑될 예정
    registrationNumber: '',
    address: '',
    addressDetail: '',
    sigunguCode: '',
    zipCode: '',
    latitude: 0,
    longitude: 0,
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
    targetCustomers: [] as CustomerSegment[],
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

  const targetCustomerOptions = Object.values(CustomerSegment);

  const validateStep = (stepNumber: number): boolean => {
    const newErrors: Record<string, string> = {};

    switch (stepNumber) {
      case 1:
        if (!formData.email) {
          newErrors.email = '이메일을 입력해주세요.';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
          newErrors.email = '올바른 이메일 형식이 아닙니다.';
        }

        if (!formData.password) {
          newErrors.password = '비밀번호를 입력해주세요.';
        } else if (formData.password.length < 8) {
          newErrors.password = '비밀번호는 8자 이상이어야 합니다.';
        }

        if (!formData.passwordConfirm) {
          newErrors.passwordConfirm = '비밀번호 확인을 입력해주세요.';
        } else if (formData.password !== formData.passwordConfirm) {
          newErrors.passwordConfirm = '비밀번호가 일치하지 않습니다.';
        }

        if (!termsAccepted) {
          newErrors.terms = '서비스 이용약관에 동의해주세요.';
        }

        if (!privacyAccepted) {
          newErrors.privacy = '개인정보 처리방침에 동의해주세요.';
        }
        break;

      case 2:
        if (!formData.businessName) {
          newErrors.businessName = '업체명을 입력해주세요.';
        }
        if (!formData.businessType) {
          newErrors.businessType = '업종을 선택해주세요.';
        }
        if (!formData.businessSubType) {
          newErrors.businessSubType = '세부 업종을 선택해주세요.';
        }
        if (!formData.registrationNumber) {
          newErrors.registrationNumber = '사업자등록번호를 입력해주세요.';
        }
        if (!formData.address) {
          newErrors.address = '업체 주소를 입력해주세요.';
        }
        if (!formData.zipCode) {
          newErrors.zipCode = '우편번호를 입력해주세요.';
        }
        if (!formData.sigunguCode) {
          newErrors.sigunguCode = '시군구 코드를 입력해주세요.';
        }
        break;

      case 3:
        if (!formData.averagePrice) {
          newErrors.averagePrice = '평균 객단가를 입력해주세요.';
        }
        if (!formData.capacity) {
          newErrors.capacity = '좌석 수를 입력해주세요.';
        }
        if (formData.targetCustomers.length === 0) {
          newErrors.targetCustomers = '주요 고객층을 최소 하나 선택해주세요.';
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(step) && step < 4) {
      setStep(step + 1);
    }
  };

  const handlePrev = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 모든 단계 validation 체크
    const allStepsValid = [1, 2, 3].every(stepNum => validateStep(stepNum));
    
    if (!allStepsValid) {
      return;
    }
    
    setLoading(true);
    
    try {
      // 1. 회원가입 API 호출
      const signupResponse = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        }),
      });

      const signupData = await signupResponse.json();

      if (!signupResponse.ok) {
        throw new Error(signupData.error || '회원가입에 실패했습니다.');
      }

      // 2. 사업정보 등록 API 호출
      const businessResponse = await fetch('/api/business/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          businessName: formData.businessName,
          businessSigunguCode: formData.sigunguCode,
          businessZipCode: formData.zipCode,
          businessAddress: formData.address,
          businessAddressDetail: formData.addressDetail || null,
          businessLatitude: formData.latitude,
          businessLongitude: formData.longitude,
          businessType: formData.businessType,
          businessItem: formData.businessSubType,
          businessAverageOrderAmount: parseFloat(formData.averagePrice),
          businessSeatCount: parseInt(formData.capacity),
          businessCustomerSegments: formData.targetCustomers
        }),
      });

      const businessData = await businessResponse.json();

      if (!businessResponse.ok) {
        throw new Error(businessData.error || '사업정보 등록에 실패했습니다.');
      }

      router.push('/dashboard');
    } catch (error) {
      console.error('등록 오류:', error);
      alert(error instanceof Error ? error.message : '등록에 실패했습니다.');
    } finally {
      setLoading(false);
    }
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
              error={errors.email}
              required
            />
            
            <Input
              label="비밀번호"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="8자 이상 입력하세요"
              error={errors.password}
              required
            />
            
            <Input
              label="비밀번호 확인"
              type="password"
              value={formData.passwordConfirm}
              onChange={(e) => setFormData({ ...formData, passwordConfirm: e.target.value })}
              placeholder="비밀번호를 다시 입력하세요"
              error={errors.passwordConfirm}
              required
            />

            <div className="space-y-2">
              <label className="flex items-start gap-2">
                <input
                  type="checkbox"
                  className="mt-1"
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  required
                />
                <span className="text-sm text-neutral-600">
                  [필수] 서비스 이용약관에 동의합니다
                </span>
              </label>
              {errors.terms && <p className="text-red-500 text-sm">{errors.terms}</p>}
              
              <label className="flex items-start gap-2">
                <input
                  type="checkbox"
                  className="mt-1"
                  checked={privacyAccepted}
                  onChange={(e) => setPrivacyAccepted(e.target.checked)}
                  required
                />
                <span className="text-sm text-neutral-600">
                  [필수] 개인정보 처리방침에 동의합니다
                </span>
              </label>
              {errors.privacy && <p className="text-red-500 text-sm">{errors.privacy}</p>}
              
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
              className="relative w-full h-11 rounded-lg overflow-hidden hover:opacity-90 transition-opacity"
              style={{ backgroundColor: '#FEE500' }}
            >
              <img
                src="/images/auth/kakao-login-button.png"
                alt="카카오 로그인"
                className="absolute inset-0 w-full h-full object-contain"
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
              error={errors.businessName}
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
              {errors.businessType && <p className="text-red-500 text-sm mt-1">{errors.businessType}</p>}
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
                {errors.businessSubType && <p className="text-red-500 text-sm mt-1">{errors.businessSubType}</p>}
              </div>
            )}
            
            <Input
              label="사업자등록번호"
              value={formData.registrationNumber}
              onChange={(e) => setFormData({ ...formData, registrationNumber: e.target.value })}
              placeholder="000-00-00000"
              error={errors.registrationNumber}
              required
            />
            
            <Input
              label="우편번호"
              value={formData.zipCode}
              onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
              placeholder="12345"
              error={errors.zipCode}
              required
            />

            <Input
              label="업체 주소"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="기본 주소를 입력하세요"
              error={errors.address}
              required
            />

            <Input
              label="상세 주소"
              value={formData.addressDetail}
              onChange={(e) => setFormData({ ...formData, addressDetail: e.target.value })}
              placeholder="상세 주소를 입력하세요 (선택)"
            />

            <Input
              label="시군구 코드"
              value={formData.sigunguCode}
              onChange={(e) => setFormData({ ...formData, sigunguCode: e.target.value })}
              placeholder="시군구 코드를 입력하세요"
              error={errors.sigunguCode}
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
              error={errors.averagePrice}
              required
            />
            
            <Input
              label={formData.businessType === BusinessType.ACCOMMODATION ? '객실 수' : '좌석 수'}
              type="number"
              value={formData.capacity}
              onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
              placeholder="50"
              error={errors.capacity}
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
                    <span className="text-sm">{CustomerSegmentLabels[option]}</span>
                  </label>
                ))}
              </div>
              {errors.targetCustomers && <p className="text-red-500 text-sm mt-1">{errors.targetCustomers}</p>}
            </div>

          </div>
        );

      case 4:
        return (
          <div className="space-y-4 text-center">
            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            
            <h2 className="text-2xl font-bold mb-2">회원가입 완료!</h2>
            <p className="text-neutral-600 mb-6">
              <span className="font-semibold text-primary-600">{formData.email}</span>로 
              <br />
              인증 이메일이 자동으로 발송되었습니다.
              <br />
              <br />
              이메일함을 확인하여 계정을 활성화해 주세요.
            </p>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <p className="text-blue-800 text-sm">
                💡 스팸함도 함께 확인해 주세요!
              </p>
            </div>
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
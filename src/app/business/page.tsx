'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { getSession } from 'next-auth/react';
import { Button, Input, Card, CardHeader, CardTitle, CardContent } from '@/components/ui';
import { BusinessType, CustomerSegment, CustomerSegmentLabels } from '../../types';
import AddressSearch from '@/components/AddressSearch';

const businessTypeMap: Record<string, string> = {
  'RESTAURANT': '음식점',
  'ACCOMMODATION': '숙박업',
  'RETAIL': '소매업',
  'EXPERIENCE': '체험·레저'
};

function BusinessContent() {
  const { data: session } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [isUpdateMode, setIsUpdateMode] = useState(false);
  const [error, setError] = useState<string>('');
  const [userName, setUserName] = useState<string>('');
  
  const [formData, setFormData] = useState({
    businessName: '',
    businessType: '',
    businessSubType: '',
    registrationNumber: '',
    address: '',
    addressDetail: '',
    sigunguCode: '',
    zipCode: '',
    latitude: 0,
    longitude: 0,
    averagePrice: '',
    capacity: '',
    targetCustomers: [] as CustomerSegment[],
    businessDescription: '',
  });

  const businessTypes = [
    { value: '음식점', label: '음식점' },
    { value: '숙박업', label: '숙박업' },
    { value: '소매업', label: '소매업' },
    { value: '체험·레저', label: '체험·레저' },
  ];

  const businessSubTypes: Record<string, string[]> = {
    '음식점': ['한식', '중식', '일식', '양식', '카페', '기타'],
    '숙박업': ['호텔', '모텔', '펜션', '게스트하우스', '민박', '기타'],
    '소매업': ['기념품', '특산품', '편의점', '의류', '액세서리', '기타'],
    '체험·레저': ['액티비티', '문화체험', '투어', '워크샵', '기타'],
  };

  const targetCustomerOptions = Object.values(CustomerSegment);

  // 세션 체크 및 기존 사업정보 확인
  useEffect(() => {
    const checkBusinessInfo = async () => {
      if (!session?.user) {
        router.push("/sign-in");
        return;
      }

      // 쿼리 파라미터로 mode=update가 있으면 수정 모드 설정
      const mode = searchParams.get('mode');
      if (mode === 'update') {
        setIsUpdateMode(true);
      }

      // 프로필 정보 확인
      try {
        const profileResponse = await fetch('/api/user/profile', {
          credentials: 'include'
        });

        if (!profileResponse.ok) {
          router.push('/profile');
          return;
        }
        
        const profileData = await profileResponse.json();
        if (!profileData.data?.name) {
          // 프로필이 없으면 프로필 페이지로
          router.push('/profile');
          return;
        }
        
        // 사용자 이름 저장
        setUserName(profileData.data.name);
      } catch (error) {
        router.push('/profile');
        return;
      }

      // 기존 사업정보 확인
      try {
        const response = await fetch('/api/business/get', {
          credentials: 'include'
        });

        if (response.ok) {
          const data = await response.json();
          // data.success가 있는 경우와 직접 data.data가 있는 경우 모두 처리
          const businessData = data.success ? data.data : data.data;
          
          if (businessData && (businessData.businessName || businessData.name)) {
            // 기존 사업정보가 있음 - 수정 모드
            setIsUpdateMode(true);
            const businessInfo = businessData;
            
            // API 응답이 business prefix가 있는 경우와 없는 경우 모두 처리
            const hasPrefix = 'businessName' in businessInfo;
            
            // 업종이 영어로 저장된 경우 한글로 변환
            let businessType = hasPrefix ? businessInfo.businessType : businessInfo.type || '';
            if (businessTypeMap[businessType]) {
              businessType = businessTypeMap[businessType];
            }
            
            setFormData(prevData => ({
              ...prevData,
              businessName: hasPrefix ? businessInfo.businessName : businessInfo.name || '',
              businessType: businessType,
              businessSubType: hasPrefix ? businessInfo.businessItem : businessInfo.item || '',
              registrationNumber: businessInfo.businessRegistrationNumber || '',
              address: hasPrefix ? businessInfo.businessAddress : businessInfo.address || '',
              addressDetail: hasPrefix ? businessInfo.businessAddressDetail : businessInfo.addressDetail || '',
              sigunguCode: hasPrefix ? businessInfo.businessSigunguCode : businessInfo.sigunguCode || '',
              zipCode: hasPrefix ? businessInfo.businessZipCode : businessInfo.zipCode || '',
              latitude: hasPrefix ? businessInfo.businessLatitude : businessInfo.latitude || 0,
              longitude: hasPrefix ? businessInfo.businessLongitude : businessInfo.longitude || 0,
              averagePrice: hasPrefix 
                ? businessInfo.businessAverageOrderAmount?.toString() 
                : businessInfo.averageOrderAmount?.toString() || '',
              capacity: hasPrefix 
                ? businessInfo.businessSeatCount?.toString() 
                : businessInfo.seatCount?.toString() || '',
              targetCustomers: hasPrefix 
                ? businessInfo.businessCustomerSegments 
                : businessInfo.customerSegments || [],
              businessDescription: hasPrefix 
                ? businessInfo.businessDescription 
                : businessInfo.description || '',
            }));
          }
        }
      } catch (error) {
        // 에러 무시
      }
    };

    checkBusinessInfo();
  }, [session?.user, router, searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const businessData = {
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
        businessCustomerSegments: formData.targetCustomers,
        businessDescription: formData.businessDescription?.trim() || null
      };

      const endpoint = isUpdateMode ? '/api/business/update' : '/api/business/register';
      const method = isUpdateMode ? 'PATCH' : 'POST';

      const response = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(businessData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || '사업정보 저장에 실패했습니다.');
      }

      // 성공 시 세션 새로고침 후 적절한 페이지로 이동
      await getSession();
      
      // 수정 모드인 경우 프로필 페이지로, 신규 등록인 경우 대시보드로 이동
      if (isUpdateMode) {
        router.push('/dashboard/profile');
      } else {
        router.push('/dashboard');
      }
      router.refresh();
    } catch (error) {
      setError(error instanceof Error ? error.message : '사업정보 저장에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-neutral-50 to-neutral-100 px-4 py-12">
      <div className="w-full max-w-2xl">
        {!isUpdateMode && (
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-primary-600">LocalUp</h1>
            <div className="mt-4 flex items-center justify-center space-x-2">
              <div className="flex items-center">
                <div className="h-8 w-8 rounded-full bg-green-500 text-white flex items-center justify-center text-sm font-semibold">
                  ✓
                </div>
                <span className="ml-2 text-sm font-medium">프로필 정보</span>
              </div>
              <div className="w-16 h-0.5 bg-primary-600"></div>
              <div className="flex items-center">
                <div className="h-8 w-8 rounded-full bg-primary-600 text-white flex items-center justify-center text-sm font-semibold">
                  2
                </div>
                <span className="ml-2 text-sm font-medium">사업 정보</span>
              </div>
            </div>
          </div>
        )}

        <Card>
          <CardHeader>
            {!isUpdateMode && userName && (
              <div className="text-center mb-4">
                <p className="text-lg text-primary-600 font-medium">
                  안녕하세요, {userName}님! 👋
                </p>
              </div>
            )}
            <CardTitle className="text-center">
              {isUpdateMode ? '사업정보 수정' : '사업정보 입력'}
            </CardTitle>
            <p className="text-center text-gray-600 mt-2">
              {isUpdateMode 
                ? '수정하실 사업정보를 수정해주세요'
                : '서비스 이용을 위해 사업정보를 입력해주세요'}
            </p>
          </CardHeader>
          
          <CardContent>
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">기본 정보</h3>
                
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
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">위치 정보</h3>
                
                <div>
                  <label className="label mb-2 block">주소 검색</label>
                  <AddressSearch
                    onAddressSelect={(addressData) => {
                      setFormData({
                        ...formData,
                        zipCode: addressData.zipCode,
                        address: addressData.address,
                        sigunguCode: addressData.sigunguCode,
                        latitude: addressData.latitude,
                        longitude: addressData.longitude
                      });
                    }}
                    disabled={loading}
                  />
                </div>

                <Input
                  label="우편번호"
                  value={formData.zipCode}
                  onChange={() => {}}
                  placeholder="주소 검색으로 자동 입력됩니다"
                  readOnly
                  className="bg-gray-50"
                  required
                />

                <Input
                  label="업체 주소"
                  value={formData.address}
                  onChange={() => {}}
                  placeholder="주소 검색으로 자동 입력됩니다"
                  readOnly
                  className="bg-gray-50"
                  required
                />

                <Input
                  label="상세 주소"
                  value={formData.addressDetail}
                  onChange={(e) => setFormData({ ...formData, addressDetail: e.target.value })}
                  placeholder="상세 주소를 직접 입력하세요 (선택)"
                />

                <Input
                  label="시군구 코드"
                  value={formData.sigunguCode}
                  onChange={() => {}}
                  placeholder="주소 검색으로 자동 입력됩니다"
                  readOnly
                  className="bg-gray-50"
                  required
                />
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">운영 정보</h3>
                
                <div>
                  <label className="label mb-2 block">사업체 소개</label>
                  <textarea
                    className="input min-h-[80px] resize-none"
                    value={formData.businessDescription}
                    onChange={(e) => setFormData({ ...formData, businessDescription: e.target.value })}
                    placeholder="사업체에 대한 간략한 소개를 입력해주세요 (선택사항)"
                    rows={3}
                  />
                  <p className="text-xs text-neutral-500 mt-1">
                    고객에게 표시될 사업체 소개글입니다
                  </p>
                </div>
                
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
                  label={formData.businessType === '숙박업' ? '객실 수' : '좌석 수'}
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
                        <span className="text-sm">{CustomerSegmentLabels[option]}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                loading={loading}
                className="w-full"
              >
                {isUpdateMode ? '사업정보 수정 완료' : '사업정보 등록 완료'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function BusinessPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
    </div>}>
      <BusinessContent />
    </Suspense>
  );
}
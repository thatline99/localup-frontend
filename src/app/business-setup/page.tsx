'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { getSession } from 'next-auth/react';
import { Button, Input, Card, CardHeader, CardTitle, CardContent } from '@/components/ui';
import { BusinessType, CustomerSegment, CustomerSegmentLabels } from '../../types';
import AddressSearch from '@/components/AddressSearch';


//fix(paz) - 사업자 등록번호 및 위경도(daum api) 사용해서 제대로 된 정보를 등록하도록 수정 필요.
export default function BusinessSetupPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState(false);
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

  // 기존 사업정보 로드
  useEffect(() => {
    const loadExistingBusinessInfo = async () => {
      if (!session?.user) {
        setInitialLoading(false);
        return;
      }

      try {
        const response = await fetch('/api/business/get', {
          credentials: 'include'
        });

        if (response.status === 404) {
          // 사업정보가 없음 - 신규 등록 모드로 계속 진행
          // 아무것도 하지 않음
        } else if (response.ok) {
          // 기존 사업정보가 있음 - 대시보드 business-setup으로 리다이렉트
          router.replace('/dashboard/business-setup');
          return;
        }
      } catch {
      } finally {
        setInitialLoading(false);
      }
    };

    loadExistingBusinessInfo();
  }, [session?.user, router]);

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

      // 이 페이지는 신규 등록 전용
      const apiUrl = '/api/business/register';
      const method = 'POST';

      const response = await fetch(apiUrl, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(businessData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || '사업정보 등록에 실패했습니다.');
      }

      // 성공 상태 표시
      setSuccess(true);

      // 잠시 후 대시보드로 이동
      setTimeout(async () => {
        // 세션 새로고침
        await getSession();
        
        // 브라우저 전체 새로고침으로 세션과 캐시를 완전히 업데이트
        window.location.href = '/dashboard';
      }, 2000);
    } catch (error) {
      setError(error instanceof Error ? error.message : '사업정보 등록에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    const loadingContent = (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
          <p className="mt-4 text-neutral-600">사업정보를 불러오는 중...</p>
        </div>
      </div>
    );
    
    // 수정 모드일 수 있으니 DashboardLayout으로 감쌀 수도 있지만, 로딩 중에는 단순하게 처리
    return loadingContent;
  }

  const formContent = (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center py-12 px-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <div className="text-center mb-4">
            <h1 className="text-2xl font-bold text-primary-600">LocalUp</h1>
            <p className="text-neutral-600 mt-2">
              안녕하세요, {session?.user?.name}님! 사업정보를 입력해주세요.
            </p>
          </div>
          <CardTitle className="text-center">사업정보 입력</CardTitle>
        </CardHeader>
        
        <CardContent>
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          {success && (
            <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <div>
                  <p className="text-green-800 font-medium">사업정보가 성공적으로 등록되었습니다!</p>
                  <p className="text-green-600 text-sm mt-1">잠시 후 대시보드로 이동합니다...</p>
                </div>
              </div>
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
              
              {/* 주소 검색 버튼 */}
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
                onChange={() => {}} // readonly
                placeholder="주소 검색으로 자동 입력됩니다"
                readOnly
                className="bg-gray-50"
                required
              />

              <Input
                label="업체 주소"
                value={formData.address}
                onChange={() => {}} // readonly
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
                onChange={() => {}} // readonly
                placeholder="주소 검색으로 자동 입력됩니다"
                readOnly
                className="bg-gray-50"
                required
              />
              
              {/* 좌표 정보 표시 (숨김 필드) */}
              {(formData.latitude !== 0 || formData.longitude !== 0) && (
                <div className={`p-3 rounded-lg ${
                  formData.latitude === 37.5665 && formData.longitude === 126.9780 
                    ? 'bg-yellow-50 border border-yellow-200' 
                    : 'bg-green-50 border border-green-200'
                }`}>
                  <p className={`text-sm ${
                    formData.latitude === 37.5665 && formData.longitude === 126.9780
                      ? 'text-yellow-800' 
                      : 'text-green-800'
                  }`}>
                    🗺️ 좌표 정보: 위도 {formData.latitude.toFixed(6)}, 경도 {formData.longitude.toFixed(6)}
                    {formData.latitude === 37.5665 && formData.longitude === 126.9780 && (
                      <span className="block text-yellow-700 mt-1">
                        ⚠️ 기본 좌표가 사용되었습니다. 카카오 개발자 콘솔에서 &apos;로컬(지도/로컬)&apos; 서비스를 활성화하면 정확한 좌표를 받을 수 있습니다.
                      </span>
                    )}
                  </p>
                </div>
              )}
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
                      <span className="text-sm">{CustomerSegmentLabels[option]}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <Button
              type="submit"
              loading={loading}
              disabled={success}
              className="w-full"
            >
              {success ? '등록 완료!' : loading ? '등록 중...' : '사업정보 등록 완료'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );

  // 이 페이지는 신규 등록 전용
  return formContent;
}
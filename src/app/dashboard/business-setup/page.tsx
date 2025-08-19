'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { getSession } from 'next-auth/react';
import { Button, Input, Card, CardHeader, CardTitle, CardContent } from '@/components/ui';
import { BusinessType, CustomerSegment, CustomerSegmentLabels } from '../../../types';

export default function BusinessSetupPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState<string>('');
  
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
          // 사업정보가 없음 - 메인 business-setup으로 리다이렉트
          router.replace('/business-setup');
          return;
        } else if (response.ok) {
          // 기존 사업정보가 있음 - 수정 모드로 폼 데이터 채우기
          const data = await response.json();
          const businessInfo = data.data.data;
          
          setFormData(prevData => ({
            ...prevData,
            businessName: businessInfo.name || '',
            businessType: businessInfo.type || '',
            businessSubType: businessInfo.item || '',
            registrationNumber: businessInfo.registrationNumber || '',
            address: businessInfo.address || '',
            addressDetail: businessInfo.addressDetail || '',
            sigunguCode: businessInfo.sigunguCode || '',
            zipCode: businessInfo.zipCode || '',
            latitude: businessInfo.latitude || 0,
            longitude: businessInfo.longitude || 0,
            averagePrice: businessInfo.averageOrderAmount?.toString() || '',
            capacity: businessInfo.seatCount?.toString() || '',
            targetCustomers: businessInfo.customerSegments || [],
          }));
        }
      } catch (error) {
        console.error('사업정보 로드 오류:', error);
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
        businessCustomerSegments: formData.targetCustomers
      };

      // 수정 모드이므로 PATCH 요청
      const response = await fetch('/api/business/update', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(businessData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || '사업정보 수정에 실패했습니다.');
      }

      // 성공 시 세션 새로고침 후 대시보드로 이동
      await getSession();
      router.push('/dashboard');
      router.refresh();
    } catch (error) {
      console.error('사업정보 수정 오류:', error);
      setError(error instanceof Error ? error.message : '사업정보 수정에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
          <p className="mt-4 text-neutral-600">사업정보를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <div className="text-center mb-4">
            <p className="text-neutral-600">
              안녕하세요, {session?.user?.name}님! 사업정보를 수정해주세요.
            </p>
          </div>
          <CardTitle className="text-center">사업정보 수정</CardTitle>
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
              
              <Input
                label="우편번호"
                value={formData.zipCode}
                onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                placeholder="12345"
                required
              />

              <Input
                label="업체 주소"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="기본 주소를 입력하세요"
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
                required
              />
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">운영 정보</h3>
              
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
              className="w-full"
            >
              사업정보 수정 완료
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent, Badge, Button, Input, useToast } from '@/components/ui';
import { PageLayout } from '@/components/dashboard/PageLayout';
import { CustomerSegmentLabels } from '@/types';

const businessTypeMap: Record<string, string> = {
  'RESTAURANT': '음식점',
  'ACCOMMODATION': '숙박업',
  'RETAIL': '소매업',
  'EXPERIENCE': '체험·레저',
  '음식점': '음식점',
  '숙박업': '숙박업',
  '소매업': '소매업',
  '체험·레저': '체험·레저'
};

export default function ProfilePage() {
  const { data: session } = useSession();
  const router = useRouter();
  const { showToast, ToastContainer } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isEditingBusiness, setIsEditingBusiness] = useState(false);
  
  // 원본 데이터 (취소 시 복구용)
  const [originalProfileData, setOriginalProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    position: '',
  });
  
  const [originalBusinessData, setOriginalBusinessData] = useState<any>(null);
  
  // 편집 중인 데이터
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    position: '',
  });
  
  const [businessData, setBusinessData] = useState<any>(null);

  useEffect(() => {
    const loadProfileData = async () => {
      if (!session?.user) {
        setLoading(false);
        return;
      }

      try {
        // 프로필 정보 가져오기
        const profileResponse = await fetch('/api/user/profile', {
          credentials: 'include'
        });

        if (profileResponse.ok) {
          const data = await profileResponse.json();
          if (data.data) {
            const profile = {
              name: data.data.name || '',
              email: session.user.email || '',
              phone: data.data.phoneNumber || '',
              position: data.data.position || '',
            };
            setProfileData(profile);
            setOriginalProfileData(profile);
          }
        }

        // 사업정보 가져오기
        const businessResponse = await fetch('/api/business/get', {
          credentials: 'include'
        });

        if (businessResponse.ok) {
          const data = await businessResponse.json();
          if (data.success && data.data) {
            setBusinessData(data.data);
            setOriginalBusinessData(data.data);
          } else if (data.data) {
            setBusinessData(data.data);
            setOriginalBusinessData(data.data);
          }
        }
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };

    loadProfileData();
  }, [session]);

  // 프로필 수정 저장
  const handleProfileSave = async () => {
    setSaving(true);
    try {
      const response = await fetch('/api/user/profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          name: profileData.name,
          phoneNumber: profileData.phone,
          position: profileData.position,
        }),
      });

      if (response.ok) {
        setOriginalProfileData(profileData);
        setIsEditingProfile(false);
        showToast('프로필이 성공적으로 수정되었습니다.', 'success');
      } else {
        const error = await response.json();
        showToast(error.error || '프로필 수정에 실패했습니다.', 'error');
      }
    } catch (error) {
      showToast('프로필 수정 중 오류가 발생했습니다.', 'error');
    } finally {
      setSaving(false);
    }
  };

  // 프로필 수정 취소
  const handleProfileCancel = () => {
    setProfileData(originalProfileData);
    setIsEditingProfile(false);
  };

  // 사업정보 수정 페이지로 이동 (수정 모드)
  const handleBusinessEdit = () => {
    router.push('/business?mode=update');
  };

  // 전화번호 포맷팅
  const formatPhoneNumber = (value: string) => {
    const numbers = value.replace(/[^\d]/g, '');
    if (numbers.length <= 3) return numbers;
    if (numbers.length <= 6) return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
    if (numbers.length <= 10) return `${numbers.slice(0, 3)}-${numbers.slice(3, 6)}-${numbers.slice(6)}`;
    return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7, 11)}`;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    setProfileData({ ...profileData, phone: formatted });
  };

  return (
    <PageLayout
      title="프로필"
      description="계정 정보와 업체 정보를 관리하세요"
    >
      <ToastContainer />
      
      {/* 프로필 정보 섹션 */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>프로필 정보</CardTitle>
            {!loading && (
              <div className="flex gap-2">
                {isEditingProfile ? (
                  <>
                    <Button
                      variant="outline"
                      onClick={handleProfileCancel}
                      disabled={saving}
                    >
                      취소
                    </Button>
                    <Button
                      variant="primary"
                      onClick={handleProfileSave}
                      disabled={saving}
                    >
                      {saving ? '저장 중...' : '저장'}
                    </Button>
                  </>
                ) : (
                  <Button
                    variant="outline"
                    onClick={() => setIsEditingProfile(true)}
                  >
                    수정
                  </Button>
                )}
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
              <p className="ml-3 text-neutral-600">프로필 정보 로딩 중...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">이름</label>
                {isEditingProfile ? (
                  <Input
                    value={profileData.name}
                    onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                    placeholder="이름을 입력하세요"
                  />
                ) : (
                  <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-200">
                    {profileData.name || '-'}
                  </div>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">이메일</label>
                <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-200">
                  {profileData.email || '-'}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">전화번호</label>
                {isEditingProfile ? (
                  <Input
                    value={profileData.phone}
                    onChange={handlePhoneChange}
                    placeholder="010-1234-5678"
                    maxLength={13}
                  />
                ) : (
                  <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-200">
                    {profileData.phone || '-'}
                  </div>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">직책</label>
                {isEditingProfile ? (
                  <Input
                    value={profileData.position}
                    onChange={(e) => setProfileData({ ...profileData, position: e.target.value })}
                    placeholder="대표, 매니저, 직원 등"
                  />
                ) : (
                  <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-200">
                    {profileData.position || '-'}
                  </div>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 사업정보 섹션 */}
      <Card className="mt-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>사업정보</CardTitle>
            {!loading && businessData && (
              <Button
                variant="outline"
                onClick={handleBusinessEdit}
              >
                수정
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
              <p className="ml-3 text-neutral-600">사업정보 로딩 중...</p>
            </div>
          ) : businessData ? (
            <div className="space-y-6">
              {/* 기본 정보 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">업체명</label>
                  <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-200">
                    {businessData.name || '-'}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">업종</label>
                  <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-200">
                    {businessTypeMap[businessData.type] || businessData.type || '-'}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">세부 업종</label>
                  <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-200">
                    {businessData.item || '-'}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">평균 객단가</label>
                  <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-200">
                    {businessData.averageOrderAmount 
                      ? `${businessData.averageOrderAmount.toLocaleString()}원` 
                      : '-'}
                  </div>
                </div>
              </div>

              {/* 주소 정보 */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">주소</label>
                <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-200">
                  {businessData.address || '-'}
                  {businessData.addressDetail && (
                    <span className="ml-2 text-neutral-600">
                      {businessData.addressDetail}
                    </span>
                  )}
                </div>
              </div>

              {/* 사업체 소개 */}
              {businessData.description && (
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">사업체 소개</label>
                  <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-200">
                    {businessData.description}
                  </div>
                </div>
              )}

              {/* 고객층 */}
              {businessData.customerSegments && businessData.customerSegments.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">주요 고객층</label>
                  <div className="flex flex-wrap gap-2">
                    {businessData.customerSegments.map((segment: string, index: number) => (
                      <Badge key={index} variant="outline">
                        {CustomerSegmentLabels[segment as keyof typeof CustomerSegmentLabels] || segment}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* 운영 정보 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    {businessData.type === 'ACCOMMODATION' || businessData.type === '숙박업' ? '객실 수' : '좌석 수'}
                  </label>
                  <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-200">
                    {businessData.seatCount 
                      ? `${businessData.seatCount}${businessData.type === 'ACCOMMODATION' || businessData.type === '숙박업' ? '실' : '석'}` 
                      : '-'}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">우편번호</label>
                  <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-200">
                    {businessData.zipCode || '-'}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-neutral-500 mb-4">등록된 사업정보가 없습니다.</p>
              <Button onClick={() => router.push('/business')}>
                사업정보 등록하기
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </PageLayout>
  );
}
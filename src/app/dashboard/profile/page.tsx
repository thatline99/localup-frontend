'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent, Button, Input, Badge } from '@/components/ui';
import { PageLayout } from '@/components/dashboard/PageLayout';

export default function ProfilePage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [businessInfo, setBusinessInfo] = useState<Record<string, unknown> | null>(null);
  
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    position: '대표',
    businessName: '',
    businessType: '',
    businessItem: '',
    registrationNumber: '',
    address: '',
    addressDetail: '',
    sigunguCode: '',
    zipCode: '',
    averageOrderAmount: '',
    seatCount: '',
    customerSegments: [] as string[],
    businessDescription: '',
  });

  // 프로필 및 사업정보 로드
  useEffect(() => {
    const loadUserData = async () => {
      if (!session?.user) {
        setLoading(false);
        return;
      }

      try {
        // 사용자 프로필 정보 가져오기
        const profileResponse = await fetch('/api/user/profile', {
          credentials: 'include'
        });
        
        let userName = session.user.name || '';
        let userPhone = '';
        let userPosition = '대표';
        
        if (profileResponse.ok) {
          const profileData = await profileResponse.json();
          if (profileData.data) {
            userName = profileData.data.name || session.user.name || '';
            userPhone = profileData.data.phoneNumber || '';
            userPosition = profileData.data.position || '대표';
          }
        }
        
        // 사업정보 가져오기
        const response = await fetch('/api/business/get', {
          credentials: 'include'
        });

        if (response.ok) {
          const data = await response.json();
          // data.success와 data.data 구조 확인
          const business = data.success ? data.data : null;
          setBusinessInfo(business);
          
          // 프로필 데이터에 사업정보 반영 (business가 있을 때만)
          if (business) {
            setProfileData({
              name: userName,
              email: session.user.email || '',
              phone: userPhone,
              position: userPosition,
              businessName: business.name || '',
              businessType: business.type || '',
              businessItem: business.item || '',
              registrationNumber: '',
              address: business.address || '',
              addressDetail: business.addressDetail || '',
              sigunguCode: business.sigunguCode || '',
              zipCode: business.zipCode || '',
              averageOrderAmount: business.averageOrderAmount?.toString() || '',
              seatCount: business.seatCount?.toString() || '',
              customerSegments: business.customerSegments || [],
              businessDescription: business.description || '',
            });
          } else {
            // 사업정보가 없어도 프로필 정보는 설정
            setProfileData(prev => ({
              ...prev,
              name: userName,
              email: session.user.email || '',
              phone: userPhone,
              position: userPosition,
            }));
          }
        } else {
          // API 호출 실패해도 기본 프로필 정보는 설정
          setProfileData(prev => ({
            ...prev,
            name: userName,
            email: session.user.email || '',
            phone: userPhone,
            position: userPosition,
          }));
        }
      } catch (error) {
        console.error('사용자 데이터 로드 오류:', error);
        // 오류 발생해도 기본 정보는 설정
        setProfileData(prev => ({
          ...prev,
          name: session.user.name || '',
          email: session.user.email || '',
        }));
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, [session]);

  const stats = [
    { label: '가입일', value: '2024년 1월 15일' },
    { label: '총 리포트 생성', value: '156개' },
    { label: 'AI 상담 횟수', value: '1,234회' },
    { label: '월간 분석 횟수', value: '89회' },
  ];


  return (
    <PageLayout
      title="프로필"
      description="계정 정보와 업체 정보를 관리하세요"
    >

      {/* 프로필 카드 */}
      <Card className="mb-8">
        <CardContent>
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-3xl font-bold">
                {profileData.name ? (
                  profileData.name.match(/^[가-힣]/) ? 
                    profileData.name.charAt(0) : 
                    profileData.name.charAt(0).toUpperCase()
                ) : '?'}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-neutral-900">{profileData.name}</h2>
                <p className="text-neutral-600">{profileData.position} · {profileData.businessName}</p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="outline">인증됨</Badge>
                </div>
              </div>
            </div>
            <Button
              variant={isEditing ? 'primary' : 'outline'}
              onClick={() => setIsEditing(!isEditing)}
            >
              {isEditing ? '저장하기' : '프로필 수정'}
            </Button>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat, index) => (
              <div key={index} className="p-4 bg-neutral-50 rounded-lg">
                <p className="text-sm text-neutral-600">{stat.label}</p>
                <p className="text-lg font-semibold text-neutral-900 mt-1">{stat.value}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* 개인 정보 */}
        <Card>
          <CardHeader>
            <CardTitle>개인 정보</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-4">
              <Input
                label="이름"
                value={profileData.name}
                onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                disabled={!isEditing}
              />
              <Input
                label="이메일"
                type="email"
                value={profileData.email}
                onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                disabled={!isEditing}
              />
              <Input
                label="전화번호"
                value={profileData.phone}
                onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                disabled={!isEditing}
              />
              <Input
                label="직책"
                value={profileData.position}
                onChange={(e) => setProfileData({ ...profileData, position: e.target.value })}
                disabled={!isEditing}
              />
            </form>
          </CardContent>
        </Card>

        {/* 업체 정보 */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>업체 정보</CardTitle>
              <Button
                variant="outline"
                onClick={() => router.push('/dashboard/business-setup')}
                disabled={loading}
              >
                정보 수정
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                <p className="ml-3 text-neutral-600">업체 정보 로딩 중...</p>
              </div>
            ) : businessInfo ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">업체명</label>
                  <div className="p-3 bg-neutral-50 rounded-lg border">
                    {profileData.businessName || '-'}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">업종</label>
                  <div className="p-3 bg-neutral-50 rounded-lg border">
                    {profileData.businessType || '-'}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">종목</label>
                  <div className="p-3 bg-neutral-50 rounded-lg border">
                    {profileData.businessItem || '-'}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">사업체 소개</label>
                  <div className="p-3 bg-neutral-50 rounded-lg border">
                    {profileData.businessDescription || '-'}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">주소</label>
                  <div className="p-3 bg-neutral-50 rounded-lg border">
                    {profileData.address || '-'}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">상세주소</label>
                  <div className="p-3 bg-neutral-50 rounded-lg border">
                    {profileData.addressDetail || '-'}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">평균 주문금액</label>
                    <div className="p-3 bg-neutral-50 rounded-lg border">
                      {profileData.averageOrderAmount ? `${Number(profileData.averageOrderAmount).toLocaleString()}원` : '-'}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">좌석 수</label>
                    <div className="p-3 bg-neutral-50 rounded-lg border">
                      {profileData.seatCount ? `${profileData.seatCount}석` : '-'}
                    </div>
                  </div>
                </div>
                {profileData.customerSegments && profileData.customerSegments.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">고객층</label>
                    <div className="p-3 bg-neutral-50 rounded-lg border">
                      <div className="flex flex-wrap gap-2">
                        {profileData.customerSegments.map((segment, index) => (
                          <Badge key={index} variant="outline">
                            {segment}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-neutral-500">업체 정보가 등록되지 않았습니다.</p>
                <Button
                  className="mt-4"
                  onClick={() => router.push('/business-setup')}
                >
                  업체 정보 등록
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>


      {/* 활동 로그 */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>최근 활동</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center gap-4 p-3 hover:bg-neutral-50 rounded-lg">
              <div className="w-10 h-10 bg-primary-100 text-primary-600 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="font-medium text-neutral-900">월간 리포트 생성</p>
                <p className="text-sm text-neutral-600">2024년 10월 월간 경영 리포트</p>
              </div>
              <p className="text-sm text-neutral-500">2시간 전</p>
            </div>
            
            <div className="flex items-center gap-4 p-3 hover:bg-neutral-50 rounded-lg">
              <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-4l-4 4z" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="font-medium text-neutral-900">AI 상담 완료</p>
                <p className="text-sm text-neutral-600">주말 재고 추천 문의</p>
              </div>
              <p className="text-sm text-neutral-500">5시간 전</p>
            </div>
            
            <div className="flex items-center gap-4 p-3 hover:bg-neutral-50 rounded-lg">
              <div className="w-10 h-10 bg-amber-100 text-amber-600 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="font-medium text-neutral-900">데이터 동기화</p>
                <p className="text-sm text-neutral-600">POS 시스템 데이터 업데이트</p>
              </div>
              <p className="text-sm text-neutral-500">어제</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </PageLayout>
  );
}
'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, Button, Input, Badge } from '@/components/ui';
import { PageLayout } from '@/components/dashboard/PageLayout';

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: '김민수',
    email: 'minsu.kim@example.com',
    phone: '010-1234-5678',
    position: '대표',
    businessName: '해운대 씨푸드',
    businessType: '해산물 전문점',
    registrationNumber: '123-45-67890',
    address: '부산광역시 해운대구 해운대해변로 123',
    operatingHours: {
      weekday: '11:00 - 02:00',
      weekend: '11:00 - 03:00',
    },
  });

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
                김
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
            <CardTitle>업체 정보</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-4">
              <Input
                label="업체명"
                value={profileData.businessName}
                onChange={(e) => setProfileData({ ...profileData, businessName: e.target.value })}
                disabled={!isEditing}
              />
              <Input
                label="업종"
                value={profileData.businessType}
                onChange={(e) => setProfileData({ ...profileData, businessType: e.target.value })}
                disabled={!isEditing}
              />
              <Input
                label="사업자등록번호"
                value={profileData.registrationNumber}
                onChange={(e) => setProfileData({ ...profileData, registrationNumber: e.target.value })}
                disabled={!isEditing}
              />
              <Input
                label="주소"
                value={profileData.address}
                onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
                disabled={!isEditing}
              />
            </form>
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
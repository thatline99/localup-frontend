'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, Button } from '@/components/ui';
import { PageLayout } from '@/components/dashboard/PageLayout';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<'general' | 'notifications'>('general');

  const tabs = [
    { id: 'general', label: '일반', icon: '⚙️' },
    { id: 'notifications', label: '알림', icon: '🔔' },
  ];

  return (
    <PageLayout
      title="설정"
      description="서비스 환경설정을 관리하세요"
    >

      {/* 탭 네비게이션 */}
      <div className="flex gap-1 mb-8 p-1 bg-neutral-100 rounded-lg">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as 'general' | 'notifications')}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md font-medium transition-all ${
              activeTab === tab.id
                ? 'bg-white text-neutral-900 shadow-sm'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* 일반 설정 */}
      {activeTab === 'general' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>기본 설정</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="label block mb-2">언어</label>
                  <select className="input">
                    <option>한국어</option>
                    <option>English</option>
                  </select>
                </div>
                
                <div>
                  <label className="label block mb-2">시간대</label>
                  <select className="input">
                    <option>서울 (GMT+9)</option>
                    <option>도쿄 (GMT+9)</option>
                    <option>뉴욕 (GMT-5)</option>
                  </select>
                </div>
                
                <div>
                  <label className="label block mb-2">날짜 형식</label>
                  <select className="input">
                    <option>YYYY-MM-DD</option>
                    <option>DD/MM/YYYY</option>
                    <option>MM/DD/YYYY</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>보안</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-neutral-900">2단계 인증</p>
                    <p className="text-sm text-neutral-600">계정 보안을 강화합니다</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" />
                    <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                  </label>
                </div>
                
                <div className="pt-4">
                  <Button variant="outline">비밀번호 변경</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* 알림 설정 */}
      {activeTab === 'notifications' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>이메일 알림</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { label: '일일 리포트', description: '매일 오전 9시에 전일 실적 요약을 받습니다' },
                  { label: '주간 인사이트', description: '매주 월요일 주요 트렌드와 분석을 받습니다' },
                  { label: 'AI 추천 액션', description: 'AI가 제안하는 즉각 대응이 필요한 액션을 받습니다' },
                  { label: '경쟁사 변화', description: '경쟁사의 주요 변화사항을 실시간으로 받습니다' },
                ].map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-neutral-900">{item.label}</p>
                      <p className="text-sm text-neutral-600">{item.description}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked={index < 2} />
                      <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                    </label>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>푸시 알림</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { label: '긴급 알림', description: '즉각적인 대응이 필요한 상황' },
                  { label: '실시간 인사이트', description: '중요한 변화가 감지되었을 때' },
                  { label: '리포트 완성', description: '요청한 리포트가 준비되었을 때' },
                ].map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-neutral-900">{item.label}</p>
                      <p className="text-sm text-neutral-600">{item.description}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                    </label>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </PageLayout>
  );
}
import { Card, CardHeader, CardTitle, CardContent, Button } from '@/components/ui';

export const AIRecommendations = () => {
  const recommendations = [
    {
      priority: 'high' as const,
      title: '영화제 특별 메뉴 출시',
      description: '부산국제영화제 기간 한정 메뉴로 매출 15% 상승 예상',
      action: '메뉴 기획하기',
    },
    {
      priority: 'medium' as const,
      title: '피크타임 직원 추가 배치',
      description: '오후 6-8시 대기시간 단축으로 고객 만족도 향상',
      action: '스케줄 조정',
    },
    {
      priority: 'medium' as const,
      title: 'SNS 이벤트 진행',
      description: '#부산맛집 해시태그 활용한 할인 이벤트',
      action: '이벤트 설정',
    },
  ];

  const priorityStyles = {
    high: 'bg-rose-100 text-rose-700 border-rose-200',
    medium: 'bg-amber-100 text-amber-700 border-amber-200',
    low: 'bg-blue-100 text-blue-700 border-blue-200',
  };

  const priorityLabels = {
    high: '긴급',
    medium: '권장',
    low: '제안',
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>AI 추천 액션</CardTitle>
          <span className="text-sm text-neutral-500">오늘의 할 일</span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {recommendations.map((item, index) => (
            <div
              key={index}
              className="p-4 border rounded-lg hover:shadow-sm transition-shadow"
            >
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-medium text-neutral-900">{item.title}</h4>
                <span className={`text-xs px-2 py-1 rounded-full border ${
                  priorityStyles[item.priority]
                }`}>
                  {priorityLabels[item.priority]}
                </span>
              </div>
              <p className="text-sm text-neutral-600 mb-3">{item.description}</p>
              <Button size="sm" variant="outline" className="w-full">
                {item.action}
              </Button>
            </div>
          ))}
        </div>

        <div className="mt-4 p-4 bg-primary-50 rounded-lg">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-sm text-primary-900">AI 인사이트</h4>
              <p className="text-xs text-primary-700 mt-1">
                현재 상황에서 영화제 마케팅이 가장 효과적입니다
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
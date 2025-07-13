import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui';

export const TrendsWidget = () => {
  const trends = [
    { tag: '#부산맛집', count: 2341, change: 45 },
    { tag: '#해운대카페', count: 1823, change: 23 },
    { tag: '#부산국제영화제', count: 5672, change: 320 },
    { tag: '#해운대맛집투어', count: 892, change: -12 },
    { tag: '#부산여행', count: 3421, change: 67 },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>SNS 트렌드</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {trends.map((trend, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-neutral-500 w-4">
                  {index + 1}
                </span>
                <span className="font-medium text-neutral-900">{trend.tag}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm text-neutral-600">
                  {trend.count.toLocaleString()}
                </span>
                <span className={`text-xs font-medium ${
                  trend.change > 0 ? 'text-emerald-600' : 'text-rose-600'
                }`}>
                  {trend.change > 0 ? '+' : ''}{trend.change}%
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 bg-neutral-50 rounded-lg">
          <h4 className="font-medium text-sm text-neutral-700 mb-2">트렌드 인사이트</h4>
          <p className="text-sm text-neutral-600">
            영화제 관련 해시태그가 급상승 중입니다. 
            영화 관련 프로모션이나 콜라보 메뉴를 고려해보세요.
          </p>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-4 pt-4 border-t">
          <div className="text-center">
            <p className="text-2xl font-bold text-neutral-900">89%</p>
            <p className="text-xs text-neutral-500 mt-1">긍정 멘션</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-neutral-900">3.2K</p>
            <p className="text-xs text-neutral-500 mt-1">오늘 언급수</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
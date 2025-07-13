import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui';

export const CompetitorsWidget = () => {
  const competitors = [
    {
      name: '바다향기 횟집',
      type: '해산물',
      rating: 4.7,
      price: '₩₩₩',
      distance: '200m',
      change: 'up',
    },
    {
      name: '해운대 갈비집',
      type: '한식',
      rating: 4.5,
      price: '₩₩',
      distance: '350m',
      change: 'same',
    },
    {
      name: '오션뷰 카페',
      type: '카페',
      rating: 4.8,
      price: '₩₩',
      distance: '150m',
      change: 'down',
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>경쟁사 현황</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {competitors.map((competitor, index) => (
            <div key={index} className="p-3 border rounded-lg">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h4 className="font-medium text-neutral-900">{competitor.name}</h4>
                  <p className="text-xs text-neutral-500">{competitor.type} · {competitor.distance}</p>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1">
                    <svg className="w-4 h-4 text-amber-400 fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="text-sm font-medium">{competitor.rating}</span>
                  </div>
                  <p className="text-xs text-neutral-500 mt-1">{competitor.price}</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between text-xs">
                <span className="text-neutral-600">순위 변동</span>
                {competitor.change === 'up' && (
                  <span className="text-emerald-600 font-medium">▲ 상승</span>
                )}
                {competitor.change === 'down' && (
                  <span className="text-rose-600 font-medium">▼ 하락</span>
                )}
                {competitor.change === 'same' && (
                  <span className="text-neutral-500 font-medium">- 유지</span>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 p-4 bg-neutral-50 rounded-lg">
          <h4 className="font-medium text-sm text-neutral-700 mb-2">차별화 포인트</h4>
          <ul className="space-y-1 text-sm text-neutral-600">
            <li className="flex items-start gap-2">
              <span className="text-primary-600 mt-0.5">✓</span>
              <span>유일한 활어회 전문점</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary-600 mt-0.5">✓</span>
              <span>가장 늦은 영업시간 (새벽 2시)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary-600 mt-0.5">✓</span>
              <span>단체 예약 가능</span>
            </li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};
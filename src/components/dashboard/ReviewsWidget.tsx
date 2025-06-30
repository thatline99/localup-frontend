import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui';

export const ReviewsWidget = () => {
  const keywords = [
    { word: '신선한', count: 45, sentiment: 'positive' as const },
    { word: '친절한', count: 38, sentiment: 'positive' as const },
    { word: '맛있는', count: 52, sentiment: 'positive' as const },
    { word: '대기시간', count: 23, sentiment: 'negative' as const },
    { word: '가격', count: 15, sentiment: 'neutral' as const },
  ];

  const sentimentColors = {
    positive: 'text-emerald-600 bg-emerald-50',
    negative: 'text-rose-600 bg-rose-50',
    neutral: 'text-neutral-600 bg-neutral-100',
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>리뷰 감성 분석</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="text-center">
              <p className="text-3xl font-bold text-emerald-600">87%</p>
              <p className="text-xs text-neutral-500 mt-1">긍정적</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-rose-600">13%</p>
              <p className="text-xs text-neutral-500 mt-1">부정적</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-neutral-500">이번 주</p>
            <p className="text-2xl font-bold text-neutral-900">142</p>
            <p className="text-xs text-neutral-500">리뷰</p>
          </div>
        </div>

        <div className="space-y-2 mb-4">
          <h4 className="text-sm font-medium text-neutral-700">주요 키워드</h4>
          <div className="flex flex-wrap gap-2">
            {keywords.map((keyword) => (
              <span
                key={keyword.word}
                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                  sentimentColors[keyword.sentiment]
                }`}
              >
                {keyword.word}
                <span className="ml-1 opacity-70">({keyword.count})</span>
              </span>
            ))}
          </div>
        </div>

        <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <h4 className="font-medium text-sm text-amber-800 mb-2">개선 제안</h4>
          <ul className="space-y-1 text-sm text-amber-700">
            <li className="flex items-start gap-2">
              <span className="mt-0.5">•</span>
              <span>피크타임 대기시간 관리 필요</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5">•</span>
              <span>가격 대비 양 개선 검토</span>
            </li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};
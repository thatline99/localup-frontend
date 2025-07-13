import { Card, CardHeader, CardTitle, CardContent, Badge } from '@/components/ui';

interface BuzzAnalysisProps {
  category: string;
}

export const BuzzAnalysis = ({ category }: BuzzAnalysisProps) => {
  const buzzData = [
    {
      platform: '인스타그램',
      mentions: 3421,
      growth: 45,
      topHashtags: ['#부산맛집', '#해운대', '#부산여행'],
      sentiment: { positive: 82, neutral: 15, negative: 3 },
    },
    {
      platform: '네이버 블로그',
      mentions: 1823,
      growth: 23,
      topHashtags: ['부산 맛집', '해운대 맛집', '부산 여행 코스'],
      sentiment: { positive: 78, neutral: 18, negative: 4 },
    },
    {
      platform: '유튜브',
      mentions: 892,
      growth: 67,
      topHashtags: ['부산 브이로그', '부산 먹방', '해운대 투어'],
      sentiment: { positive: 85, neutral: 12, negative: 3 },
    },
  ];

  const viralContent = [
    {
      title: '부산 영화제 기간 필수 방문 맛집 TOP 10',
      platform: '인스타그램',
      views: '15.2K',
      engagement: '8.5%',
    },
    {
      title: '해운대 숨은 맛집 발견! 현지인도 모르는 곳',
      platform: '유튜브',
      views: '23.4K',
      engagement: '12.3%',
    },
    {
      title: '부산 3박4일 여행 코스 완벽 정리',
      platform: '네이버',
      views: '8.7K',
      engagement: '6.2%',
    },
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>SNS 버즈 분석</CardTitle>
          <Badge variant="outline">{category === 'all' ? '전체' : category}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        {/* 플랫폼별 분석 */}
        <div className="space-y-4">
          {buzzData.map((platform) => (
            <div key={platform.platform} className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-neutral-900">{platform.platform}</h4>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-neutral-600">
                    {platform.mentions.toLocaleString()} 언급
                  </span>
                  <span className={`text-sm font-medium ${
                    platform.growth > 0 ? 'text-emerald-600' : 'text-rose-600'
                  }`}>
                    {platform.growth > 0 ? '+' : ''}{platform.growth}%
                  </span>
                </div>
              </div>
              
              {/* 감성 분석 바 */}
              <div className="mb-3">
                <div className="flex h-2 rounded-full overflow-hidden bg-neutral-200">
                  <div
                    className="bg-emerald-500"
                    style={{ width: `${platform.sentiment.positive}%` }}
                  />
                  <div
                    className="bg-neutral-400"
                    style={{ width: `${platform.sentiment.neutral}%` }}
                  />
                  <div
                    className="bg-rose-500"
                    style={{ width: `${platform.sentiment.negative}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs text-neutral-500 mt-1">
                  <span>긍정 {platform.sentiment.positive}%</span>
                  <span>중립 {platform.sentiment.neutral}%</span>
                  <span>부정 {platform.sentiment.negative}%</span>
                </div>
              </div>

              {/* 인기 해시태그 */}
              <div className="flex flex-wrap gap-2">
                {platform.topHashtags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-1 bg-neutral-100 text-neutral-700 rounded text-xs"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* 바이럴 콘텐츠 */}
        <div className="mt-6 pt-6 border-t">
          <h4 className="font-medium text-neutral-900 mb-3">화제의 콘텐츠</h4>
          <div className="space-y-2">
            {viralContent.map((content, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
                <div className="flex-1">
                  <p className="text-sm font-medium text-neutral-900 mb-1">{content.title}</p>
                  <div className="flex items-center gap-3 text-xs text-neutral-500">
                    <span>{content.platform}</span>
                    <span>조회수 {content.views}</span>
                    <span>참여율 {content.engagement}</span>
                  </div>
                </div>
                <svg className="w-4 h-4 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
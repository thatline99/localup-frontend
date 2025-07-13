import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui';

export const WeatherWidget = () => {
  const forecast = [
    { day: '오늘', icon: '☀️', high: 24, low: 18, rain: 0 },
    { day: '내일', icon: '🌤️', high: 22, low: 17, rain: 20 },
    { day: '모레', icon: '🌧️', high: 20, low: 16, rain: 80 },
    { day: '글피', icon: '⛅', high: 23, low: 17, rain: 30 },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>날씨 영향 분석</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <span className="font-medium text-amber-800">날씨 영향 주의</span>
            </div>
            <p className="mt-2 text-sm text-amber-700">
              모레 비 예보로 방문객 30% 감소 예상
            </p>
          </div>

          <div className="grid grid-cols-4 gap-3">
            {forecast.map((day) => (
              <div key={day.day} className="text-center">
                <p className="text-xs text-neutral-500 mb-1">{day.day}</p>
                <div className="text-2xl mb-2">{day.icon}</div>
                <p className="text-sm font-medium">{day.high}°</p>
                <p className="text-xs text-neutral-500">{day.low}°</p>
                {day.rain > 0 && (
                  <p className="text-xs text-blue-600 mt-1">{day.rain}%</p>
                )}
              </div>
            ))}
          </div>

          <div className="pt-4 border-t">
            <h4 className="font-medium text-sm text-neutral-700 mb-2">추천 대응</h4>
            <ul className="space-y-1 text-sm text-neutral-600">
              <li className="flex items-start gap-2">
                <span className="text-primary-600 mt-0.5">•</span>
                <span>우천 대비 실내 프로모션 준비</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary-600 mt-0.5">•</span>
                <span>따뜻한 메뉴 재고 확대</span>
              </li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
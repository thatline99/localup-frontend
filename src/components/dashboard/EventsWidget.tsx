import { Card, CardHeader, CardTitle, CardContent, Badge } from '@/components/ui';

export const EventsWidget = () => {
  const events = [
    {
      name: '부산국제영화제',
      date: '오늘',
      distance: '2km',
      impact: 'high' as const,
      type: '문화축제',
    },
    {
      name: '해운대 모래축제',
      date: '10/15',
      distance: '0.5km',
      impact: 'high' as const,
      type: '지역축제',
    },
    {
      name: '부산 원아시아 페스티벌',
      date: '10/20',
      distance: '5km',
      impact: 'medium' as const,
      type: '음악축제',
    },
    {
      name: '광안리 불꽃축제',
      date: '11/2',
      distance: '3km',
      impact: 'high' as const,
      type: '지역축제',
    },
  ];

  const impactColors = {
    high: 'destructive',
    medium: 'secondary',
    low: 'outline',
  } as const;

  const impactLabels = {
    high: '높음',
    medium: '보통',
    low: '낮음',
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>주변 이벤트 캘린더</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {events.map((event, index) => (
            <div key={index} className="flex items-start gap-3 p-3 rounded-lg hover:bg-neutral-50 transition-colors">
              <div className="flex-shrink-0 w-12 h-12 bg-primary-100 text-primary-700 rounded-lg flex items-center justify-center font-semibold text-sm">
                {event.date.includes('/') ? event.date.split('/')[1] : '오늘'}
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-neutral-900">{event.name}</h4>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-neutral-500">{event.type}</span>
                  <span className="text-xs text-neutral-400">•</span>
                  <span className="text-xs text-neutral-500">{event.distance}</span>
                </div>
              </div>
              <Badge variant={impactColors[event.impact]}>
                영향 {impactLabels[event.impact]}
              </Badge>
            </div>
          ))}
        </div>

        <div className="mt-4 pt-4 border-t">
          <button className="text-sm text-primary-600 hover:text-primary-700 font-medium">
            전체 이벤트 보기 →
          </button>
        </div>
      </CardContent>
    </Card>
  );
};
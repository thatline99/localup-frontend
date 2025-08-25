import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui';

export const TrendChart = () => {
  // period prop을 사용하여 데이터 필터링 (실제로는 API 호출 시 사용)
  
  // 모의 데이터
  const data = [
    { label: '월', visitors: 2800, revenue: 4200000 },
    { label: '화', visitors: 3200, revenue: 4800000 },
    { label: '수', visitors: 2900, revenue: 4350000 },
    { label: '목', visitors: 3500, revenue: 5250000 },
    { label: '금', visitors: 4200, revenue: 6300000 },
    { label: '토', visitors: 5100, revenue: 7650000 },
    { label: '일', visitors: 4800, revenue: 7200000 },
  ];

  const maxVisitors = Math.max(...data.map(d => d.visitors));
  const maxRevenue = Math.max(...data.map(d => d.revenue));

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>방문객 및 매출 추이</CardTitle>
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-primary-600 rounded-full"></div>
              <span className="text-neutral-600">방문객</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-emerald-600 rounded-full"></div>
              <span className="text-neutral-600">매출</span>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="relative h-64">
          {/* Y축 레이블 */}
          <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between text-xs text-neutral-500 pr-2">
            <span>{(maxVisitors / 1000).toFixed(1)}K</span>
            <span>{(maxVisitors / 2000).toFixed(1)}K</span>
            <span>0</span>
          </div>

          {/* 차트 영역 */}
          <div className="ml-10 h-full flex items-end gap-2">
            {data.map((item, index) => (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div className="w-full flex items-end gap-1 h-48">
                  {/* 방문객 막대 */}
                  <div className="flex-1 flex flex-col items-center justify-end">
                    <div
                      className="w-full bg-primary-600 rounded-t transition-all hover:bg-primary-700"
                      style={{ height: `${(item.visitors / maxVisitors) * 100}%` }}
                    />
                  </div>
                  {/* 매출 막대 */}
                  <div className="flex-1 flex flex-col items-center justify-end">
                    <div
                      className="w-full bg-emerald-600 rounded-t transition-all hover:bg-emerald-700"
                      style={{ height: `${(item.revenue / maxRevenue) * 100}%` }}
                    />
                  </div>
                </div>
                <span className="text-xs text-neutral-600 mt-2">{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 통계 요약 */}
        <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t">
          <div>
            <p className="text-sm text-neutral-600">평균 일일 방문객</p>
            <p className="text-xl font-bold text-neutral-900 mt-1">3,785명</p>
            <p className="text-xs text-emerald-600 mt-1">전주 대비 +12.3%</p>
          </div>
          <div>
            <p className="text-sm text-neutral-600">평균 일일 매출</p>
            <p className="text-xl font-bold text-neutral-900 mt-1">567만원</p>
            <p className="text-xs text-emerald-600 mt-1">전주 대비 +15.7%</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
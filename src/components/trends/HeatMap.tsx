import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui';

interface HeatMapProps {
  region: string;
}

export const HeatMap = ({ region }: HeatMapProps) => {
  // 시간대별 요일별 히트맵 데이터
  const hours = ['06', '09', '12', '15', '18', '21', '24'];
  const days = ['월', '화', '수', '목', '금', '토', '일'];
  
  // 모의 데이터 (0-100 강도)
  const heatmapData = [
    [20, 25, 30, 35, 40, 60, 55], // 06시
    [40, 45, 50, 55, 60, 70, 65], // 09시
    [70, 75, 80, 85, 90, 95, 90], // 12시
    [60, 65, 70, 75, 80, 85, 80], // 15시
    [80, 85, 90, 95, 100, 95, 90], // 18시
    [90, 85, 80, 85, 95, 100, 95], // 21시
    [40, 35, 30, 35, 50, 70, 60], // 24시
  ];

  const getColor = (value: number) => {
    if (value >= 90) return 'bg-rose-600';
    if (value >= 70) return 'bg-orange-500';
    if (value >= 50) return 'bg-amber-400';
    if (value >= 30) return 'bg-yellow-300';
    return 'bg-emerald-200';
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>시간대별 유동인구 히트맵</CardTitle>
          <span className="text-sm text-neutral-500">{region}</span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <div className="min-w-[400px]">
            {/* 요일 헤더 */}
            <div className="grid grid-cols-8 gap-1 mb-1">
              <div className="h-8"></div>
              {days.map((day) => (
                <div key={day} className="h-8 flex items-center justify-center text-xs text-neutral-600 font-medium">
                  {day}
                </div>
              ))}
            </div>

            {/* 히트맵 그리드 */}
            {hours.map((hour, hourIndex) => (
              <div key={hour} className="grid grid-cols-8 gap-1 mb-1">
                <div className="h-8 flex items-center justify-end pr-2 text-xs text-neutral-600">
                  {hour}시
                </div>
                {days.map((_, dayIndex) => (
                  <div
                    key={dayIndex}
                    className={`h-8 rounded flex items-center justify-center text-xs font-medium ${getColor(
                      heatmapData[hourIndex][dayIndex]
                    )} text-white transition-all hover:scale-110 cursor-pointer`}
                    title={`${heatmapData[hourIndex][dayIndex]}%`}
                  >
                    {heatmapData[hourIndex][dayIndex]}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* 범례 */}
        <div className="flex items-center justify-center gap-4 mt-6 pt-6 border-t">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-emerald-200 rounded"></div>
            <span className="text-xs text-neutral-600">낮음</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-yellow-300 rounded"></div>
            <span className="text-xs text-neutral-600">보통</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-amber-400 rounded"></div>
            <span className="text-xs text-neutral-600">높음</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-orange-500 rounded"></div>
            <span className="text-xs text-neutral-600">매우 높음</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-rose-600 rounded"></div>
            <span className="text-xs text-neutral-600">포화</span>
          </div>
        </div>

        {/* 인사이트 */}
        <div className="mt-4 p-4 bg-primary-50 rounded-lg">
          <h4 className="text-sm font-medium text-primary-900 mb-1">피크타임 분석</h4>
          <p className="text-xs text-primary-700">
            금요일, 토요일 저녁 6-9시가 가장 혼잡합니다. 이 시간대 추가 인력 배치를 권장합니다.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
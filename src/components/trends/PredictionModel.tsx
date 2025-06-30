import { Card, CardHeader, CardTitle, CardContent, Button } from '@/components/ui';

interface PredictionModelProps {
  period: string;
}

export const PredictionModel = ({ period }: PredictionModelProps) => {
  const predictions = [
    { date: '10/11', predicted: 342, confidence: 92 },
    { date: '10/12', predicted: 358, confidence: 89 },
    { date: '10/13', predicted: 415, confidence: 87 },
    { date: '10/14', predicted: 523, confidence: 85 },
    { date: '10/15', predicted: 612, confidence: 82 },
    { date: '10/16', predicted: 587, confidence: 80 },
    { date: '10/17', predicted: 432, confidence: 78 },
  ];

  const riskFactors = [
    { factor: '날씨 (비 예보)', impact: 'high', date: '10/13', description: '30% 방문객 감소 예상' },
    { factor: '지역 축제', impact: 'positive', date: '10/15-16', description: '45% 방문객 증가 예상' },
    { factor: '경쟁사 이벤트', impact: 'medium', date: '10/14', description: '10% 영향 예상' },
  ];

  const maxValue = Math.max(...predictions.map(p => p.predicted));

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>예측 모델</CardTitle>
          <div className="text-sm text-neutral-500">
            다음 {period === 'week' ? '7일' : '30일'} 예측
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* 예측 차트 */}
        <div className="mb-6">
          <div className="flex items-end gap-2 h-40">
            {predictions.map((pred, index) => (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div className="w-full flex flex-col items-center justify-end h-32">
                  <span className="text-xs text-neutral-500 mb-1">{pred.confidence}%</span>
                  <div
                    className="w-full bg-gradient-to-t from-primary-600 to-primary-400 rounded-t transition-all hover:from-primary-700 hover:to-primary-500"
                    style={{ 
                      height: `${(pred.predicted / maxValue) * 100}%`,
                      opacity: pred.confidence / 100
                    }}
                  />
                </div>
                <span className="text-xs text-neutral-600 mt-2">{pred.date}</span>
                <span className="text-xs font-medium text-neutral-900">{pred.predicted}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 리스크 요인 */}
        <div className="space-y-3">
          <h4 className="font-medium text-neutral-900">주요 영향 요인</h4>
          {riskFactors.map((risk, index) => (
            <div key={index} className="flex items-start gap-3 p-3 border rounded-lg">
              <div className={`w-2 h-2 rounded-full mt-1.5 ${
                risk.impact === 'high' ? 'bg-rose-500' :
                risk.impact === 'positive' ? 'bg-emerald-500' :
                'bg-amber-500'
              }`} />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-sm text-neutral-900">{risk.factor}</span>
                  <span className="text-xs text-neutral-500">{risk.date}</span>
                </div>
                <p className="text-xs text-neutral-600">{risk.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* 액션 버튼 */}
        <div className="mt-6 pt-6 border-t">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm font-medium text-neutral-900">예측 정확도</p>
              <p className="text-2xl font-bold text-primary-600">89%</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-neutral-900">예상 매출 증가</p>
              <p className="text-2xl font-bold text-emerald-600">+15%</p>
            </div>
          </div>
          <Button className="w-full">
            상세 분석 리포트 생성
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
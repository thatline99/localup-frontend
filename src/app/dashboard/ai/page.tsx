'use client';

import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, Button, Input } from '@/components/ui';

interface Message {
  id: number;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  data?: {
    type: string;
    data: {
      labels: string[];
      values: number[];
    };
  };
}

export default function AISolutionPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      role: 'assistant',
      content: '안녕하세요! 로컬업 AI 비즈니스 어시스턴트입니다. 무엇을 도와드릴까요?',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickQuestions = [
    '오늘의 매출 예측은?',
    '이번 주 트렌드 분석해줘',
    '경쟁사 대비 우리 가게 강점은?',
    '주말 대비 재고 추천해줘',
    '최근 부정적 리뷰 분석해줘',
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // AI 응답 시뮬레이션
    setTimeout(() => {
      const assistantMessage: Message = {
        id: Date.now() + 1,
        role: 'assistant',
        content: generateMockResponse(input),
        timestamp: new Date(),
        data: generateMockData(input),
      };
      setMessages((prev) => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 1500);
  };

  const generateMockResponse = (query: string): string => {
    if (query.includes('매출')) {
      return '오늘의 예상 매출은 약 350만원으로, 평소 대비 15% 증가할 것으로 예측됩니다. 부산국제영화제의 영향으로 저녁 시간대 방문객이 증가할 것으로 보입니다.';
    } else if (query.includes('트렌드')) {
      return '이번 주 주요 트렌드는 "영화제 관람객"과 "해산물 요리"입니다. 특히 #부산국제영화제 해시태그가 320% 증가했으며, 영화 관련 프로모션이 효과적일 것으로 분석됩니다.';
    } else if (query.includes('경쟁사')) {
      return '주변 경쟁사 대비 우리 가게의 강점은 1) 가장 늦은 영업시간(새벽 2시), 2) 활어회 전문점, 3) 단체 예약 가능입니다. 특히 영화제 기간 늦은 시간 영업이 큰 경쟁력이 될 것입니다.';
    } else if (query.includes('재고')) {
      return '주말 예상 방문객 증가를 고려하여 평소보다 30% 추가 재고를 준비하시길 권장합니다. 특히 인기 메뉴인 모듬회와 매운탕 재료를 충분히 확보하세요.';
    } else if (query.includes('리뷰')) {
      return '최근 부정적 리뷰의 주요 내용은 "대기 시간"(43%)과 "가격"(28%)입니다. 피크타임 대기 관리와 세트 메뉴 도입을 통한 가격 부담 완화를 제안드립니다.';
    }
    return '네, 분석해드리겠습니다. 구체적으로 어떤 부분이 궁금하신가요?';
  };

  const generateMockData = (query: string): Message['data'] => {
    if (query.includes('매출')) {
      return {
        type: 'chart',
        data: {
          labels: ['오전', '점심', '저녁', '심야'],
          values: [50, 120, 150, 30],
        },
      };
    }
    return undefined;
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      <div className="p-6 border-b">
        <h1 className="text-2xl font-bold text-neutral-900">AI 솔루션</h1>
        <p className="mt-1 text-sm text-neutral-600">
          AI와 대화하며 비즈니스 인사이트를 얻어보세요
        </p>
      </div>

      <div className="flex-1 flex gap-6 overflow-hidden">
        {/* 채팅 영역 */}
        <div className="flex-1 flex flex-col">
          {/* 메시지 목록 */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-xl ${
                    message.role === 'user'
                      ? 'bg-primary-600 text-white'
                      : 'bg-neutral-100 text-neutral-900'
                  } rounded-2xl px-4 py-3`}
                >
                  <p className="text-sm">{message.content}</p>
                  
                  {message.data && message.data.type === 'chart' && (
                    <div className="mt-3 bg-white/10 rounded-lg p-3">
                      <div className="flex items-end gap-2 h-32">
                        {message.data.data.values.map((value: number, index: number) => (
                          <div key={index} className="flex-1 flex flex-col items-center">
                            <div
                              className="w-full bg-white/30 rounded-t"
                              style={{ height: `${(value / 150) * 100}px` }}
                            />
                            <span className="text-xs mt-1 opacity-80">
                              {message.data?.data.labels[index]}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <p className="text-xs opacity-70 mt-2">
                    {message.timestamp.toLocaleTimeString('ko-KR', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-neutral-100 rounded-2xl px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                    <div className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* 입력 영역 */}
          <div className="border-t p-4">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex gap-3"
            >
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="질문을 입력하세요..."
                className="flex-1"
                disabled={isLoading}
              />
              <Button type="submit" disabled={isLoading || !input.trim()}>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </Button>
            </form>
          </div>
        </div>

        {/* 사이드바 */}
        <div className="w-80 border-l p-6 space-y-6 overflow-y-auto">
          {/* 추천 질문 */}
          <div>
            <h3 className="font-semibold text-neutral-900 mb-3">추천 질문</h3>
            <div className="space-y-2">
              {quickQuestions.map((question, index) => (
                <button
                  key={index}
                  onClick={() => setInput(question)}
                  className="w-full text-left p-3 rounded-lg border border-neutral-200 hover:border-primary-300 hover:bg-primary-50 transition-colors text-sm"
                >
                  {question}
                </button>
              ))}
            </div>
          </div>

          {/* 첨부 파일 */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-neutral-900">첨부 파일</h3>
              <button className="p-1 hover:bg-neutral-100 rounded-lg">
                <svg className="w-4 h-4 text-neutral-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </button>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-3 p-3 bg-neutral-50 rounded-lg hover:bg-neutral-100 transition-colors">
                <svg className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span className="text-sm text-neutral-900">매출_분석_10월.xlsx</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-neutral-50 rounded-lg hover:bg-neutral-100 transition-colors">
                <svg className="w-4 h-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-sm text-neutral-900">매장_내부_사진.jpg</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-neutral-50 rounded-lg hover:bg-neutral-100 transition-colors">
                <svg className="w-4 h-4 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span className="text-sm text-neutral-900">메뉴판_사진.pdf</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-neutral-50 rounded-lg hover:bg-neutral-100 transition-colors">
                <svg className="w-4 h-4 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span className="text-sm text-neutral-900">리뷰_키워드_분석.docx</span>
              </div>
            </div>
          </div>

          {/* 최근 인사이트 */}
          <Card>
            <CardContent>
              <h4 className="font-medium text-sm text-neutral-900 mb-2">
                최근 인사이트
              </h4>
              <p className="text-xs text-neutral-600">
                영화제 기간 동안 저녁 시간대 매출이 평균 23% 증가하는 패턴을 보입니다.
              </p>
              <Button variant="ghost" size="sm" className="w-full mt-3">
                자세히 보기
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
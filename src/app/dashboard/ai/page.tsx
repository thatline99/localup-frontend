'use client';

import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, Button, Input } from '@/components/ui';
import useAIStore from '@/store/aiStore';

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
  const { selectedSessionId, setSelectedSessionId } = useAIStore();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionTitle, setSessionTitle] = useState('AI 솔루션');
  const [sessionLoading, setSessionLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
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

  const handleDeleteSession = async () => {
    if (!selectedSessionId || isDeleting) return;

    const confirmDelete = window.confirm('이 채팅 세션을 삭제하시겠습니까?');
    if (!confirmDelete) return;

    setIsDeleting(true);
    try {
      const response = await fetch(`/api/ai/session/${selectedSessionId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        // 세션 ID 상태 초기화
        setSelectedSessionId(null);
        // 페이지 새로고침
        window.location.reload();
      } else {
        const errorData = await response.json();
        alert(errorData.error || '세션 삭제에 실패했습니다.');
      }
    } catch (error) {
      console.error('세션 삭제 오류:', error);
      alert('세션 삭제 중 오류가 발생했습니다.');
    } finally {
      setIsDeleting(false);
    }
  };

  const loadSessionDetail = async (sessionId: string) => {
    setSessionLoading(true);
    try {
      const response = await fetch(`/api/ai/session/${sessionId}`);
      
      if (response.ok) {
        const sessionData = await response.json();
        const sessionDetail = sessionData.data || sessionData;
        
        // 세션 제목 설정
        setSessionTitle(sessionDetail.title || 'AI 솔루션');
        
        // 메시지 목록 설정
        if (sessionDetail.messages && sessionDetail.messages.length > 0) {
          const formattedMessages = sessionDetail.messages.map((msg: any, index: number) => {
            const normalizedRole = msg.role?.toUpperCase();
            return {
              id: index + 1,
              role: (normalizedRole === 'USER' || normalizedRole === 'HUMAN') ? 'user' : 'assistant',
              content: msg.content,
              timestamp: new Date(msg.timestamp),
            };
          });
          setMessages(formattedMessages);
        } else {
          // 메시지가 없는 경우 기본 인사말
          setMessages([{
            id: 1,
            role: 'assistant',
            content: '안녕하세요! 로컬업 AI 비즈니스 어시스턴트입니다. 무엇을 도와드릴까요?',
            timestamp: new Date(),
          }]);
        }
      }
    } catch (error) {
      console.error('세션 정보 로드 오류:', error);
      // 오류 시 기본 상태로 초기화
      setSessionTitle('AI 솔루션');
      setMessages([{
        id: 1,
        role: 'assistant',
        content: '안녕하세요! 로컬업 AI 비즈니스 어시스턴트입니다. 무엇을 도와드릴까요?',
        timestamp: new Date(),
      }]);
    } finally {
      setSessionLoading(false);
    }
  };

  useEffect(() => {
    if (selectedSessionId) {
      loadSessionDetail(selectedSessionId);
    } else {
      // 새 채팅인 경우 기본 상태로 초기화
      setSessionTitle('AI 솔루션');
      setMessages([{
        id: 1,
        role: 'assistant',
        content: '안녕하세요! 로컬업 AI 비즈니스 어시스턴트입니다. 무엇을 도와드릴까요?',
        timestamp: new Date(),
      }]);
    }
  }, [selectedSessionId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (messageToSend?: string) => {
    const messageContent = messageToSend || input.trim();
    if (!messageContent || isLoading) return;

    const userMessage: Message = {
      id: Date.now(),
      role: 'user',
      content: messageContent,
      timestamp: new Date(),
    };

    const currentInput = messageContent;
    setMessages((prev) => [...prev, userMessage]);
    if (!messageToSend) {
      setInput('');
    }
    setIsLoading(true);

    try {
      // AI 솔루션 API 호출
      const response = await fetch('/api/ai/solution', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: currentInput,
          sessionId: selectedSessionId,
        }),
      });

      if (!response.ok) {
        throw new Error('AI 솔루션 요청에 실패했습니다.');
      }

      const result = await response.json();
      
      
      const assistantMessage: Message = {
        id: Date.now() + 1,
        role: 'assistant',
        content: result.data?.reply || result.reply || '응답을 받을 수 없습니다.',
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error('AI 솔루션 오류:', error);
      
      // 오류 발생 시 폴백 응답
      const errorMessage: Message = {
        id: Date.now() + 1,
        role: 'assistant',
        content: '죄송합니다. 일시적인 오류가 발생했습니다. 다시 시도해 주세요.',
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] lg:h-screen">
      <div className="p-6 border-b">
        {sessionLoading ? (
          <div className="animate-pulse">
            <div className="h-8 bg-neutral-200 rounded w-48 mb-2"></div>
            <div className="h-4 bg-neutral-200 rounded w-64"></div>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-neutral-900">{sessionTitle}</h1>
              <p className="mt-1 text-sm text-neutral-600">
                {selectedSessionId ? '기존 채팅을 이어가세요' : 'AI와 대화하며 비즈니스 인사이트를 얻어보세요'}
              </p>
            </div>
            {selectedSessionId && (
              <button
                onClick={handleDeleteSession}
                disabled={isDeleting}
                className="flex items-center gap-2 px-3 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                title="채팅 세션 삭제"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                {isDeleting ? '삭제 중...' : '삭제'}
              </button>
            )}
          </div>
        )}
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* 채팅 영역 */}
        <div className="flex-1 flex flex-col">
          {/* 메시지 목록 */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4 flex flex-col items-center">
            <div className="w-full max-w-4xl space-y-4">
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
          </div>

          {/* 입력 영역 */}
          <div className="border-t p-4 flex justify-center">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex gap-3 items-center w-full max-w-4xl"
            >
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="질문을 입력하세요..."
                className="flex-1 h-12"
                disabled={isLoading}
              />
              <Button 
                type="submit" 
                disabled={isLoading || !input.trim()}
                className="h-12 w-16 p-0 flex items-center justify-center"
              >
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
                  onClick={() => handleSend(question)}
                  disabled={isLoading}
                  className="w-full text-left p-3 rounded-lg border border-neutral-200 hover:border-primary-300 hover:bg-primary-50 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
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
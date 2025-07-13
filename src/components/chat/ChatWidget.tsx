'use client';

import { useState, useEffect, useRef } from 'react';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

export const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: '안녕하세요! LocalUp 고객센터입니다. 무엇을 도와드릴까요?',
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // 전역 이벤트 리스너로 문의하기 링크 클릭 감지
  useEffect(() => {
    const handleContactClick = (e: Event) => {
      const target = e.target as HTMLElement;
      if (target.getAttribute('href') === '#contact' || 
          target.closest('a')?.getAttribute('href') === '#contact') {
        e.preventDefault();
        setIsOpen(true);
      }
    };

    document.addEventListener('click', handleContactClick);
    return () => document.removeEventListener('click', handleContactClick);
  }, []);

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, newMessage]);
    setInputValue('');
    setIsTyping(true);

    // 봇 응답 시뮬레이션
    setTimeout(() => {
      const botResponses = [
        '문의 주셔서 감사합니다. 어떤 부분에 대해 더 자세히 알고 싶으신가요?',
        'LocalUp의 주요 기능에 대해 설명드릴까요?',
        '데모 예약을 원하시면 연락처를 남겨주세요.',
        '추가 문의사항이 있으시면 언제든 말씀해주세요.',
      ];

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: botResponses[Math.floor(Math.random() * botResponses.length)],
        sender: 'bot',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1000);
  };

  return (
    <>
      {/* 플로팅 버튼 */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-primary-600 text-white shadow-lg hover:bg-primary-700 transition-all duration-300 transform ${
          isOpen ? 'scale-0 opacity-0' : 'scale-100 opacity-100'
        }`}
        aria-label="채팅 열기"
      >
        <svg className="w-6 h-6 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-4l-4 4z" />
        </svg>
      </button>

      {/* 채팅 창 */}
      <div
        className={`fixed z-50 bg-white shadow-2xl flex flex-col transition-all duration-300
        bottom-0 left-0 right-0 top-0 w-full h-full rounded-none
        lg:bottom-20 lg:left-auto lg:right-6 lg:top-auto lg:w-96 lg:h-[600px] lg:rounded-2xl
        ${isOpen ? 'translate-y-0 opacity-100' : 'translate-y-full lg:translate-y-10 opacity-0 pointer-events-none'}`}
      >
        {/* 헤더 */}
        <div className="flex items-center justify-between p-4 border-b bg-primary-600 text-white lg:rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-4l-4 4z" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold">LocalUp 고객센터</h3>
              <p className="text-xs opacity-90">보통 몇 분 내에 응답합니다</p>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            aria-label="채팅 닫기"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* 메시지 영역 */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[70%] p-3 rounded-lg ${
                  message.sender === 'user'
                    ? 'bg-primary-600 text-white'
                    : 'bg-neutral-100 text-neutral-900'
                }`}
              >
                <p className="text-sm">{message.text}</p>
                <p className={`text-xs mt-1 ${
                  message.sender === 'user' ? 'text-white/70' : 'text-neutral-500'
                }`}>
                  {message.timestamp.toLocaleTimeString('ko-KR', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-neutral-100 text-neutral-900 p-3 rounded-lg">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* 빠른 응답 */}
        <div className="p-3 border-t">
          <div className="flex gap-2 mb-3 overflow-x-auto">
            <button
              onClick={() => setInputValue('서비스 소개가 궁금해요')}
              className="px-3 py-1.5 text-xs bg-neutral-100 hover:bg-neutral-200 rounded-full whitespace-nowrap"
            >
              서비스 소개
            </button>
            <button
              onClick={() => setInputValue('데모 예약하고 싶어요')}
              className="px-3 py-1.5 text-xs bg-neutral-100 hover:bg-neutral-200 rounded-full whitespace-nowrap"
            >
              데모 예약
            </button>
            <button
              onClick={() => setInputValue('기능에 대해 알고 싶어요')}
              className="px-3 py-1.5 text-xs bg-neutral-100 hover:bg-neutral-200 rounded-full whitespace-nowrap"
            >
              기능 문의
            </button>
          </div>
        </div>

        {/* 입력 영역 */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="p-4 border-t"
        >
          <div className="flex gap-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="메시지를 입력하세요..."
              className="flex-1 px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-transparent"
            />
            <button
              type="submit"
              className="p-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              aria-label="메시지 전송"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
        </form>
      </div>
    </>
  );
};
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui';

export const Hero = () => {
  return (
    <section className="relative pt-20 pb-20 sm:pb-32 overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      <div className="container">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-8 inline-flex items-center gap-2 bg-primary-50 text-primary-700 px-4 py-2 rounded-full text-sm font-medium">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-500"></span>
            </span>
            AI 기반 실시간 분석 서비스
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-4 sm:mb-6 text-neutral-900 px-4">
            관광 데이터로 만드는
            <br />
            <span className="text-primary-600 inline-block mt-1">우리 가게 성공 스토리</span>
          </h1>

          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-neutral-600 mb-8 sm:mb-10 leading-relaxed px-4">
            AI가 분석하는 실시간 관광 트렌드로 매출을 높이세요.
            <br className="hidden sm:block" />
            <span className="block sm:inline">전국 관광지 자영업자를 위한 데이터 기반 경영 지원 플랫폼</span>
          </p>

          <div className="flex justify-center">
            <Link href="/sign-up">
              <Button size="lg" className="touch-target px-8">
                무료로 시작하기
                <svg
                  className="ml-2 w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </Button>
            </Link>
          </div>

          <div className="mt-12 sm:mt-16 grid grid-cols-3 gap-4 sm:gap-8 text-center px-4">
            <div className="animate-in" style={{ animationDelay: '200ms' }}>
              <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-neutral-900 mb-1 sm:mb-2">
                95%
              </div>
              <div className="text-xs sm:text-sm md:text-base text-neutral-600">
                예측 정확도
              </div>
            </div>
            <div className="animate-in" style={{ animationDelay: '400ms' }}>
              <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-neutral-900 mb-1 sm:mb-2">
                24/7
              </div>
              <div className="text-xs sm:text-sm md:text-base text-neutral-600">
                실시간 모니터링
              </div>
            </div>
            <div className="animate-in" style={{ animationDelay: '600ms' }}>
              <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-neutral-900 mb-1 sm:mb-2">
                +32%
              </div>
              <div className="text-xs sm:text-sm md:text-base text-neutral-600">
                평균 매출 증가
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </section>
  );
};
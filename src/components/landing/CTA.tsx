import Link from 'next/link';
import { Button } from '@/components/ui';

export const CTA = () => {
  return (
    <section className="py-20">
      <div className="container">
        <div className="bg-gradient-to-br from-primary-600 to-primary-700 rounded-3xl p-12 md:p-16 text-center text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]"></div>
          
          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
              지금 바로 시작하세요
            </h2>
            
            <p className="text-lg md:text-xl mb-8 opacity-90 max-w-2xl mx-auto">
              모든 기능을 무료로 사용하실 수 있습니다.
              <br />
              전담 컨설턴트가 초기 설정을 도와드립니다.
            </p>

            <div className="flex justify-center">
              <Link href="/sign-up">
                <Button 
                  size="lg" 
                  variant="secondary"
                  className="bg-white text-primary-600 hover:bg-neutral-100 px-8"
                >
                  무료로 시작하기
                </Button>
              </Link>
            </div>

            <div className="mt-8 flex items-center justify-center gap-8 text-sm">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>무료 이용</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>모든 기능 제공</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>전담 컨설턴트 지원</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
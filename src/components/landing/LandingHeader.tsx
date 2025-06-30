'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Button } from '@/components/ui';

export const LandingHeader = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 backdrop-blur-lg bg-white/80 border-b border-neutral-200">
      <div className="container">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl font-bold text-primary-600">LocalUp</span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            <Link href="#features" className="text-neutral-600 hover:text-primary-600 transition-colors">
              주요 기능
            </Link>
            <Link href="#testimonials" className="text-neutral-600 hover:text-primary-600 transition-colors">
              성공 사례
            </Link>
            <Link href="#contact" className="text-neutral-600 hover:text-primary-600 transition-colors">
              문의하기
            </Link>
          </nav>

          <div className="hidden md:flex items-center gap-4">
            <Link href="/sign-in">
              <Button variant="ghost" size="sm">
                로그인
              </Button>
            </Link>
            <Link href="/sign-up">
              <Button size="sm">
                무료로 시작하기
              </Button>
            </Link>
          </div>

          <button
            className="md:hidden p-2 touch-target rounded-lg hover:bg-neutral-100 transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="메뉴 토글"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {isMenuOpen && (
          <div className="md:hidden py-6 border-t border-neutral-200 animate-in">
            <nav className="flex flex-col gap-2">
              <Link
                href="#features"
                className="text-neutral-600 hover:text-primary-600 hover:bg-neutral-50 px-4 py-3 rounded-lg transition-colors text-base font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                주요 기능
              </Link>
              <Link
                href="#testimonials"
                className="text-neutral-600 hover:text-primary-600 hover:bg-neutral-50 px-4 py-3 rounded-lg transition-colors text-base font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                성공 사례
              </Link>
              <Link
                href="#contact"
                className="text-neutral-600 hover:text-primary-600 hover:bg-neutral-50 px-4 py-3 rounded-lg transition-colors text-base font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                문의하기
              </Link>
              <div className="flex flex-col gap-3 pt-4 mt-4 border-t border-neutral-200">
                <Link href="/sign-in">
                  <Button variant="outline" size="md" className="w-full">
                    로그인
                  </Button>
                </Link>
                <Link href="/sign-up">
                  <Button size="md" className="w-full">
                    무료로 시작하기
                  </Button>
                </Link>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};
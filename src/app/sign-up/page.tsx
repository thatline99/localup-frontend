"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button, Input, Card, CardHeader, CardContent } from "@/components/ui";

export default function SignUpPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    passwordConfirm: "",
    marketingConsent: false,
  });

  const validatePassword = (password: string): string | null => {
    if (!password) {
      return "비밀번호를 입력해주세요.";
    }
    if (password.length < 8) {
      return "비밀번호는 8자 이상이어야 합니다.";
    }
    const hasLetter = /[a-zA-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    
    if (!hasLetter || !hasNumber) {
      return "비밀번호는 영문과 숫자를 모두 포함해야 합니다.";
    }
    return null;
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.email) {
      newErrors.email = "이메일을 입력해주세요.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "올바른 이메일 형식이 아닙니다.";
    }

    const passwordError = validatePassword(formData.password);
    if (passwordError) {
      newErrors.password = passwordError;
    }

    if (!formData.passwordConfirm) {
      newErrors.passwordConfirm = "비밀번호 확인을 입력해주세요.";
    } else if (formData.password !== formData.passwordConfirm) {
      newErrors.passwordConfirm = "비밀번호가 일치하지 않습니다.";
    }

    if (!termsAccepted) {
      newErrors.terms = "서비스 이용약관에 동의해주세요.";
    }

    if (!privacyAccepted) {
      newErrors.privacy = "개인정보 처리방침에 동의해주세요.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/auth/sign-up`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
            marketingConsent: formData.marketingConsent,
          }),
        },
      );

      if (response.ok) {
        const data = await response.json();
        // 회원가입 성공 메시지
        alert("회원가입이 완료되었습니다!\n\n이메일 인증 후 로그인해주세요.\n입력하신 이메일로 인증 메일이 발송되었습니다.");
        router.push("/sign-in");
      } else {
        const data = await response.json();
        
        // 이메일 중복 체크
        if (data.code === "DUPLICATE_EMAIL") {
          setErrors({ email: data.message || "이미 사용 중인 이메일입니다." });
        } else {
          throw new Error(data.message || "회원가입에 실패했습니다.");
        }
      }
    } catch (error) {
      if (error instanceof Error && !error.message.includes("DUPLICATE_EMAIL")) {
        alert(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-50 px-4 py-12">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <div className="mb-4 text-center">
            <Link href="/" className="text-2xl font-bold text-primary-600">
              LocalUp
            </Link>
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} noValidate>
            <div className="space-y-4">
              <h2 className="mb-6 text-2xl font-bold">계정 생성</h2>

              <Input
                label="이메일"
                type="text"
                value={formData.email}
                onChange={(e) => {
                  setFormData({ ...formData, email: e.target.value });
                  // Clear error when user starts typing
                  if (errors.email) {
                    setErrors({ ...errors, email: "" });
                  }
                }}
                onBlur={(e) => {
                  // Validate email format on blur
                  const email = e.target.value;
                  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                    setErrors({ ...errors, email: "올바른 이메일 형식이 아닙니다." });
                  }
                }}
                placeholder="example@email.com"
                error={errors.email}
              />

              <div className="relative">
                <Input
                  label="비밀번호"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => {
                    setFormData({ ...formData, password: e.target.value });
                    // Clear error when user starts typing
                    if (errors.password) {
                      setErrors({ ...errors, password: "" });
                    }
                  }}
                  onBlur={(e) => {
                    // Validate password on blur
                    const passwordError = validatePassword(e.target.value);
                    if (passwordError) {
                      setErrors({ ...errors, password: passwordError });
                    }
                  }}
                  placeholder="영문, 숫자 포함 8자 이상"
                  error={errors.password}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-[34px] text-neutral-500 hover:text-neutral-700"
                >
                  {showPassword ? (
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>

              <div className="relative">
                <Input
                  label="비밀번호 확인"
                  type={showPasswordConfirm ? "text" : "password"}
                  value={formData.passwordConfirm}
                  onChange={(e) => {
                    setFormData({ ...formData, passwordConfirm: e.target.value });
                    // Clear error when user starts typing
                    if (errors.passwordConfirm) {
                      setErrors({ ...errors, passwordConfirm: "" });
                    }
                  }}
                  onBlur={(e) => {
                    // Check password match on blur
                    if (formData.password && e.target.value && formData.password !== e.target.value) {
                      setErrors({ ...errors, passwordConfirm: "비밀번호가 일치하지 않습니다." });
                    }
                  }}
                  placeholder="비밀번호를 다시 입력하세요"
                  error={errors.passwordConfirm}
                />
                <button
                  type="button"
                  onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
                  className="absolute right-3 top-[34px] text-neutral-500 hover:text-neutral-700"
                >
                  {showPasswordConfirm ? (
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>

              <div className="space-y-2">
                <label className="flex items-start gap-2">
                  <input
                    type="checkbox"
                    className="mt-1"
                    checked={termsAccepted}
                    onChange={(e) => {
                      setTermsAccepted(e.target.checked);
                      if (errors.terms) {
                        setErrors({ ...errors, terms: "" });
                      }
                    }}
                  />
                  <span className="text-sm text-neutral-600">
                    [필수] 서비스 이용약관에 동의합니다
                  </span>
                </label>
                {errors.terms && (
                  <p className="ml-6 text-sm text-destructive">{errors.terms}</p>
                )}

                <label className="flex items-start gap-2">
                  <input
                    type="checkbox"
                    className="mt-1"
                    checked={privacyAccepted}
                    onChange={(e) => {
                      setPrivacyAccepted(e.target.checked);
                      if (errors.privacy) {
                        setErrors({ ...errors, privacy: "" });
                      }
                    }}
                  />
                  <span className="text-sm text-neutral-600">
                    [필수] 개인정보 처리방침에 동의합니다
                  </span>
                </label>
                {errors.privacy && (
                  <p className="ml-6 text-sm text-destructive">{errors.privacy}</p>
                )}

                <label className="flex items-start gap-2">
                  <input
                    type="checkbox"
                    className="mt-1"
                    checked={formData.marketingConsent}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        marketingConsent: e.target.checked,
                      })
                    }
                  />
                  <span className="text-sm text-neutral-600">
                    [선택] 마케팅 정보 수신에 동의합니다
                  </span>
                </label>
              </div>

              <Button 
                type="submit" 
                loading={loading} 
                disabled={!termsAccepted || !privacyAccepted || loading}
                className="mt-6 w-full"
              >
                회원가입
              </Button>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-neutral-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="bg-white px-4 text-neutral-500">또는</span>
                </div>
              </div>

              <button
                type="button"
                className="relative h-11 w-full overflow-hidden rounded-lg transition-opacity hover:opacity-90"
                style={{ backgroundColor: "#FEE500" }}
              >
                <img
                  src="/images/auth/kakao-login-button.png"
                  alt="카카오 회원가입"
                  className="absolute inset-0 h-full w-full object-contain"
                />
              </button>
            </div>
          </form>

          <div className="mt-6 text-center text-sm text-neutral-600">
            이미 계정이 있으신가요?{" "}
            <Link href="/sign-in" className="text-primary-600 hover:underline">
              로그인
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

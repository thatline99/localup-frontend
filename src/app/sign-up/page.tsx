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

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    passwordConfirm: "",
    marketingConsent: false,
  });

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.email) {
      newErrors.email = "이메일을 입력해주세요.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "올바른 이메일 형식이 아닙니다.";
    }

    if (!formData.password) {
      newErrors.password = "비밀번호를 입력해주세요.";
    } else if (formData.password.length < 8) {
      newErrors.password = "비밀번호는 8자 이상이어야 합니다.";
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
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "회원가입에 실패했습니다.");
      }

      // 회원가입 성공 메시지
      alert("회원가입이 완료되었습니다!");
      router.push("/sign-in");
    } catch (error) {
      alert(
        error instanceof Error ? error.message : "회원가입에 실패했습니다.",
      );
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
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <h2 className="mb-6 text-2xl font-bold">계정 생성</h2>

              <Input
                label="이메일"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                placeholder="example@email.com"
                error={errors.email}
                required
              />

              <Input
                label="비밀번호"
                type="password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                placeholder="8자 이상 입력하세요"
                error={errors.password}
                required
              />

              <Input
                label="비밀번호 확인"
                type="password"
                value={formData.passwordConfirm}
                onChange={(e) =>
                  setFormData({ ...formData, passwordConfirm: e.target.value })
                }
                placeholder="비밀번호를 다시 입력하세요"
                error={errors.passwordConfirm}
                required
              />

              <div className="space-y-2">
                <label className="flex items-start gap-2">
                  <input
                    type="checkbox"
                    className="mt-1"
                    checked={termsAccepted}
                    onChange={(e) => setTermsAccepted(e.target.checked)}
                    required
                  />
                  <span className="text-sm text-neutral-600">
                    [필수] 서비스 이용약관에 동의합니다
                  </span>
                </label>
                {errors.terms && (
                  <p className="text-sm text-red-500">{errors.terms}</p>
                )}

                <label className="flex items-start gap-2">
                  <input
                    type="checkbox"
                    className="mt-1"
                    checked={privacyAccepted}
                    onChange={(e) => setPrivacyAccepted(e.target.checked)}
                    required
                  />
                  <span className="text-sm text-neutral-600">
                    [필수] 개인정보 처리방침에 동의합니다
                  </span>
                </label>
                {errors.privacy && (
                  <p className="text-sm text-red-500">{errors.privacy}</p>
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

              <Button type="submit" loading={loading} className="mt-6 w-full">
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

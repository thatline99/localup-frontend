"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Button,
  Input,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui";

export default function ProfileSetupPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [formData, setFormData] = useState({
    name: "",
    phoneNumber: "",
    position: "",
  });

  // 세션 체크 및 기존 프로필 확인
  useEffect(() => {
    const checkProfile = async () => {
      if (!session?.user) {
        router.push("/sign-in");
        return;
      }

      try {
        const response = await fetch("/api/user/profile", {
          credentials: "include",
        });

        if (response.ok) {
          const data = await response.json();
          if (data.data?.isProfileCompleted) {
            // 이미 프로필이 완성된 경우
            if (data.data?.hasBusinessInfo) {
              router.push("/dashboard");
            } else {
              router.push("/business-setup");
            }
          }
        }
      } catch (error) {
        console.error("프로필 확인 오류:", error);
      }
    };

    checkProfile();
  }, [session, router]);

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError("이름을 입력해주세요");
      return false;
    }
    if (!formData.phoneNumber.trim()) {
      setError("전화번호를 입력해주세요");
      return false;
    }
    // 전화번호 형식 검증
    const phoneRegex = /^0\d{1,2}-\d{3,4}-\d{4}$/;
    if (!phoneRegex.test(formData.phoneNumber)) {
      setError("올바른 전화번호 형식이 아닙니다 (예: 010-1234-5678)");
      return false;
    }
    if (!formData.position.trim()) {
      setError("직책을 입력해주세요");
      return false;
    }
    return true;
  };

  const formatPhoneNumber = (value: string) => {
    const numbers = value.replace(/[^\d]/g, "");
    if (numbers.length <= 3) return numbers;
    if (numbers.length <= 6) return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
    if (numbers.length <= 10) return `${numbers.slice(0, 3)}-${numbers.slice(3, 6)}-${numbers.slice(6)}`;
    return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7, 11)}`;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    setFormData({ ...formData, phoneNumber: formatted });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
        credentials: "include",
      });

      if (response.ok) {
        // 프로필 업데이트 성공 - 사업정보 페이지로 이동
        router.push("/business-setup");
      } else {
        const data = await response.json();
        setError(data.message || "프로필 업데이트에 실패했습니다");
      }
    } catch (error) {
      console.error("프로필 업데이트 오류:", error);
      setError("프로필 업데이트 중 오류가 발생했습니다");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-50 px-4 py-12">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            프로필 정보 입력
          </CardTitle>
          <p className="text-center text-gray-600 mt-2">
            서비스 이용을 위해 기본 정보를 입력해주세요
          </p>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="rounded-md bg-red-50 p-4">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <Input
              label="이름"
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="홍길동"
              required
            />

            <Input
              label="전화번호"
              type="tel"
              value={formData.phoneNumber}
              onChange={handlePhoneChange}
              placeholder="010-1234-5678"
              maxLength={13}
              required
            />

            <Input
              label="직책"
              type="text"
              value={formData.position}
              onChange={(e) => setFormData({ ...formData, position: e.target.value })}
              placeholder="대표, 매니저, 직원 등"
              required
            />

            <Button
              type="submit"
              className="w-full"
              disabled={loading}
            >
              {loading ? "처리 중..." : "다음"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
import { Card, CardContent, Badge } from "@/components/ui";

const testimonials = [
  {
    name: "김민수",
    business: "해운대 씨푸드",
    location: "부산",
    content:
      "날씨와 축제 정보를 미리 알 수 있어 재고 관리가 훨씬 쉬워졌어요. 덕분에 폐기율이 30% 줄었습니다.",
    metric: "폐기율 30% 감소",
    rating: 5,
  },
  {
    name: "이정희",
    business: "제주 올레 게스트하우스",
    location: "제주",
    content:
      "여행 트렌드를 실시간으로 파악해서 마케팅 전략을 바꿨더니 예약률이 45% 늘었어요.",
    metric: "예약률 45% 증가",
    rating: 5,
  },
  {
    name: "박성진",
    business: "속초 대게마을",
    location: "강원",
    content:
      "AI가 추천한 가격 전략으로 비수기에도 안정적인 매출을 유지하고 있습니다.",
    metric: "비수기 매출 25% 상승",
    rating: 5,
  },
];

export const Testimonials = () => {
  return (
    <section id="testimonials" className="bg-neutral-50 py-20">
      <div className="container">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-4xl font-bold md:text-5xl">
            사장님들의 <span className="text-primary-600">성공 이야기</span>
          </h2>
          <p className="mx-auto max-w-3xl text-xl text-neutral-600">
            로컬업과 함께 성장한 전국 자영업자들의 생생한 후기였으면 좋겠는 후기
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <Card key={index} hover>
              <CardContent className="px-6 py-8 pt-6">
                <div className="mb-4 flex items-center gap-1">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <svg
                      key={i}
                      className="h-5 w-5 fill-current text-amber-400"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>

                <p className="mb-6 italic leading-relaxed text-neutral-700">
                  &ldquo;{testimonial.content}&rdquo;
                </p>

                <Badge variant="secondary" className="mb-4">
                  {testimonial.metric}
                </Badge>

                <div className="border-t pt-4">
                  <div className="font-semibold text-neutral-900">
                    {testimonial.name}
                  </div>
                  <div className="text-sm text-neutral-600">
                    {testimonial.business} · {testimonial.location}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-16 text-center">
          <div className="inline-flex flex-col items-center">
            <div className="inline-flex items-center gap-8 rounded-2xl bg-white p-8 shadow-sm">
              <div>
                <div className="text-3xl font-bold text-neutral-900">2,500+</div>
                <div className="text-neutral-600">활성 사용자</div>
              </div>
              <div className="h-12 w-px bg-neutral-200"></div>
              <div>
                <div className="text-3xl font-bold text-neutral-900">4.8</div>
                <div className="text-neutral-600">평균 평점</div>
              </div>
              <div className="h-12 w-px bg-neutral-200"></div>
              <div>
                <div className="text-3xl font-bold text-neutral-900">98%</div>
                <div className="text-neutral-600">만족도</div>
              </div>
            </div>
            <p className="mt-3 text-sm text-neutral-400">를 목표로 하는 로컬업</p>
          </div>
        </div>
      </div>
    </section>
  );
};

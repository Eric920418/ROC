"use client";

import Image from "next/image";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function Section4() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const testimonials = [
    {
      name: "陳以森",
      nameEn: "Chen Yi-Sen",
      description:
        "1984 年生於高雄，畢業於東海大學建築系。\n大學時期深受日本建築師安藤忠雄與北歐設計理念影響，\n相信建築應該「簡潔，但充滿情感。」",
      image: "/testimonial-1.jpg",
    },
    {
      name: "王美玲",
      nameEn: "Wang Mei-Ling",
      description:
        "室內設計師，專注於當代極簡風格。\n在這裡找到了設計靈感與生活平衡，\n每個空間都充滿了光與自然的對話。",
      image: "/testimonial-2.jpg",
    },
    {
      name: "李俊賢",
      nameEn: "Li Jun-Xian",
      description:
        "科技創業家，熱愛簡約生活。\n這個空間讓我能專注思考，\n在寧靜中找到創新的能量。",
      image: "/testimonial-3.jpg",
    },
  ];

  const handlePrev = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
    setTimeout(() => setIsTransitioning(false), 500);
  };

  const handleNext = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
    setTimeout(() => setIsTransitioning(false), 500);
  };

  const currentTestimonial = testimonials[currentIndex];

  return (
    <section className="w-full bg-white px-8 py-12 md:px-16 lg:px-24">
      <div className="mx-auto max-w-[1680px]">
        {/* 標題 */}
        <h2 className="mb-6 text-center text-3xl font-normal text-neutral-900 md:text-4xl lg:text-5xl">
          See Other people Who Have
          <br />
          Lived In Our Residence
        </h2>

        {/* 內容區域 */}
        <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-12">
          {/* 左側：文字內容 */}
          <div className="space-y-6">
            {/* 姓名 */}
            <div className="space-y-2">
              <h3 className="text-2xl font-medium text-brand-primary md:text-3xl">
                {currentTestimonial.name}
                <span className="ml-3 text-neutral-900">
                  ({currentTestimonial.nameEn})
                </span>
              </h3>
            </div>

            {/* 描述 */}
            <p className="whitespace-pre-line text-base leading-relaxed text-neutral-300 md:text-lg">
              {currentTestimonial.description}
            </p>

            {/* 導航按鈕 */}
            <div className="flex items-center gap-4">
              <button
                onClick={handlePrev}
                disabled={isTransitioning}
                className="rounded-full border-2 border-neutral-300 p-3 text-neutral-300 transition-all hover:border-brand-primary hover:text-brand-primary disabled:opacity-30"
                aria-label="上一位"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={handleNext}
                disabled={isTransitioning}
                className="rounded-full border-2 border-neutral-300 p-3 text-neutral-300 transition-all hover:border-brand-primary hover:text-brand-primary disabled:opacity-30"
                aria-label="下一位"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* 右側：照片 */}
          <div className="relative">
            <div className="relative aspect-[1/1] w-full overflow-hidden rounded-3xl bg-neutral-100 shadow-lg">
              <Image
                src={currentTestimonial.image}
                alt={currentTestimonial.name}
                fill
                className="object-cover transition-opacity duration-500"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

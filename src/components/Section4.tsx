"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { ArrowRight } from "lucide-react";

interface Testimonial {
  title: string;
  description: string;
  image: string;
}

interface Section4Data {
  label: string;
  ctaText: string;
  ctaLink: string;
  testimonials: Testimonial[];
}

const defaultTestimonials: Testimonial[] = [
  {
    title: "我的咖啡廳，風格由我來定義！",
    description:
      "咖啡不止要好喝，更要脫穎而出。我們與專業團隊合作，打造獨一無二的咖啡廳體驗。",
    image: "/Mask group4.png",
  },
];

export function Section4() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [sectionData, setSectionData] = useState<Section4Data>({
    label: "CLIENT TESTIMONIALS",
    ctaText: "查看更多客戶回饋",
    ctaLink: "#",
    testimonials: defaultTestimonials,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/graphql", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            query: `query { section4 { label ctaText ctaLink testimonials } }`,
          }),
        });
        const { data } = await res.json();
        if (data?.section4) {
          setSectionData({
            label: data.section4.label || "CLIENT TESTIMONIALS",
            ctaText: data.section4.ctaText || "查看更多客戶回饋",
            ctaLink: data.section4.ctaLink || "#",
            testimonials: data.section4.testimonials?.length > 0 ? data.section4.testimonials : defaultTestimonials,
          });
        }
      } catch (error) {
        console.error("Failed to fetch section4 data:", error);
      }
    };
    fetchData();
  }, []);

  const testimonials = sectionData.testimonials;

  // 確保 currentIndex 在有效範圍內
  useEffect(() => {
    if (currentIndex >= testimonials.length) {
      setCurrentIndex(0);
    }
  }, [testimonials.length, currentIndex]);

  const handleDotClick = (index: number) => {
    if (isTransitioning || index === currentIndex) return;
    setIsTransitioning(true);
    setCurrentIndex(index);
    setTimeout(() => setIsTransitioning(false), 500);
  };

  const currentTestimonial = testimonials[currentIndex] || testimonials[0];

  // 防止 currentTestimonial 為 undefined
  if (!currentTestimonial) {
    return null;
  }

  return (
    <section className="relative flex min-h-screen w-full items-center justify-center bg-white px-4 py-8 sm:px-6 md:px-8">
      <div className="w-full max-w-7xl">
        <div className="relative mx-auto flex min-h-[720px] w-full flex-col overflow-hidden rounded-xl bg-white shadow-xl lg:flex-row">
          {/* 左側：背景圖片 */}
          <div className="relative h-[400px] w-full lg:h-auto lg:w-3/5">
            <div className="absolute inset-0">
              <Image
                src={currentTestimonial.image}
                alt="客戶回饋背景"
                fill
                className="object-cover transition-opacity duration-700"
                sizes="(max-width: 1024px) 100vw, 60vw"
                priority
              />
              {/* 輕微遮罩 */}
              <div className="absolute inset-0 bg-black/10"></div>
            </div>
          </div>

          {/* 右側：見證卡片 */}
          <div className="relative flex w-full flex-col justify-center p-8 sm:p-12 md:p-16 lg:w-2/5">
            <div className="flex flex-col gap-6">
              {/* 標籤 */}
              <p className="text-sm font-semibold uppercase tracking-widest text-neutral-300">
                {sectionData.label}
              </p>

              {/* 標題 */}
              <h2 className="text-xl font-bold leading-tight text-neutral-900 md:text-2xl">
                {currentTestimonial.title}
              </h2>

              {/* 描述 */}
              <p className="text-sm leading-relaxed text-neutral-300 text-justify text-balance text-wrap">
                {currentTestimonial.description.length > 150
                  ? currentTestimonial.description.slice(0, 150) + "..."
                  : currentTestimonial.description}
              </p>

              {/* CTA 連結 */}
              <div className="pt-6">
                <a
                  href={sectionData.ctaLink}
                  className="group inline-flex items-center gap-2 text-neutral-900 transition-colors hover:text-brand-primary"
                >
                  <span className="text-sm font-medium">{sectionData.ctaText}</span>

                  {/* 動態底線 */}
                  <div className="relative h-px w-10 overflow-hidden bg-neutral-300/50">
                    <div className="absolute inset-y-0 left-0 h-full w-0 bg-brand-primary transition-all duration-300 group-hover:w-full"></div>
                  </div>

                  {/* 箭頭圖標 */}
                  <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                </a>
              </div>
            </div>

            {/* 導航點 */}
            <div className="absolute bottom-8 right-8 flex items-center gap-3">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => handleDotClick(index)}
                  disabled={isTransitioning}
                  className={`h-2 w-2 rounded-full transition-all duration-300 ${
                    index === currentIndex
                      ? "bg-brand-primary"
                      : "bg-neutral-300/50 hover:bg-neutral-300"
                  }`}
                  aria-label={`切換到第 ${index + 1} 則回饋`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

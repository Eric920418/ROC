"use client";

import { useEffect, useRef, useState } from "react";

export function Section7() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen w-full overflow-hidden bg-white px-4 py-16 sm:px-8 md:px-12 lg:px-16 xl:px-24"
    >
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 gap-16 md:grid-cols-12">
          {/* 左側：文字和區域選擇器 */}
          <div
            className={`flex flex-col justify-between md:col-span-5 lg:col-span-4 transition-all duration-1000 ${
              isVisible
                ? "opacity-100 translate-x-0"
                : "opacity-0 -translate-x-12"
            }`}
          >
            <div className="space-y-8">
              <h1 className="text-4xl font-bold leading-tight tracking-tight text-neutral-900 ">
                立足台灣
                <br />
                放眼全球
              </h1>
              <p className="text-sm font-normal leading-relaxed text-neutral-300">
                從台北到台中，我們在台灣深耕多年，為在地客戶打造獨一無二的當代設計空間。
                <br />
                <br />
                同時，我們的服務觸角延伸至海外，將台灣的設計美學帶向國際舞台，讓世界看見東方當代設計的獨特魅力。
              </p>
            </div>

            {/* 藝術化的區域選擇器 */}
            <div className="relative mt-12 h-40">
              {/* 台北 - 圓角矩形 */}
              <div className="absolute bottom-0 left-0">
                <label className="group relative cursor-pointer">
                  <div className="h-24 w-40 rounded-lg bg-brand-primary/10 backdrop-blur-sm transition-all duration-300 group-hover:scale-105 group-hover:bg-brand-primary/20 has-[:checked]:bg-brand-primary/30"></div>
                  <span className="absolute left-6 top-1/2 -translate-y-1/2 text-lg font-medium text-neutral-900 transition-all duration-300 group-hover:font-bold">
                    台北
                  </span>
                  <input
                    defaultChecked
                    className="invisible w-0"
                    name="region-selector"
                    type="radio"
                    value="台北"
                  />
                </label>
              </div>

              {/* 台中 - 圓形 */}
              <div className="absolute bottom-8 right-12 z-10">
                <label className="group relative cursor-pointer">
                  <div className="h-28 w-28 rounded-full bg-brand-primary/15 backdrop-blur-sm transition-all duration-300 group-hover:scale-105 group-hover:bg-brand-primary/25 has-[:checked]:bg-brand-primary/35"></div>
                  <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-lg font-medium text-neutral-900 transition-all duration-300 group-hover:font-bold">
                    台中
                  </span>
                  <input
                    className="invisible w-0"
                    name="region-selector"
                    type="radio"
                    value="台中"
                  />
                </label>
              </div>

              {/* 海外 - 圓角矩形 */}
              <div className="absolute right-0 top-0">
                <label className="group relative cursor-pointer">
                  <div className="h-20 w-36 rounded-xl bg-neutral-200/30 backdrop-blur-sm transition-all duration-300 group-hover:scale-105 group-hover:bg-neutral-200/40 has-[:checked]:bg-neutral-200/50"></div>
                  <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-lg font-medium text-neutral-900 transition-all duration-300 group-hover:font-bold">
                    海外
                  </span>
                  <input
                    className="invisible w-0"
                    name="region-selector"
                    type="radio"
                    value="海外"
                  />
                </label>
              </div>
            </div>
          </div>

          {/* 右側：圖片組合 */}
          <div
            className={`relative flex min-h-[400px] items-center justify-center md:col-span-7 md:min-h-full lg:col-span-8 transition-all duration-1000 delay-300 ${
              isVisible
                ? "opacity-100 translate-x-0"
                : "opacity-0 translate-x-12"
            }`}
          >
            {/* 裝飾性 SVG 路徑 */}
            <svg
              className="pointer-events-none absolute left-0 top-0 z-10 h-full w-full"
              preserveAspectRatio="xMidYMid meet"
              viewBox="0 0 500 500"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                className="animate-draw-path stroke-neutral-200"
                d="M 100,450 C 150,250 450,300 400,50"
                fill="none"
                strokeWidth="2"
              />
            </svg>

            {/* 圖片網格 */}
            <div className="relative h-full w-full">
              {/* 左側方形圖片 */}
              <div className="absolute left-[0%] top-[50%] z-20 -translate-y-1/2">
                <div className="group h-40 w-40 overflow-hidden rounded-xl shadow-lg transition-all duration-500 hover:scale-110 hover:shadow-2xl lg:h-[200px] lg:w-[330px]">
                  <div
                    className="h-full w-full bg-contain bg-no-repeat bg-center transition-transform duration-700 group-hover:scale-110"
                    style={{
                      backgroundImage: "url('/Mask group4.png')",
                    }}
                  />
                </div>
              </div>

              {/* 右上小方形圖片 */}
              <div className="absolute right-[10%] top-[15%] z-20">
                <div className="group h-32 w-32 overflow-hidden rounded-lg shadow-lg transition-all duration-500 hover:scale-110 hover:shadow-2xl lg:h-[180px] lg:w-[320px]">
                  <div
                    className="h-full w-full bg-contain bg-no-repeat bg-center transition-transform duration-700 group-hover:scale-110"
                    style={{
                      backgroundImage:
                        'url("/Mask group.png")',
                    }}
                  />
                </div>
              </div>

              {/* 右下大矩形圖片 */}
              <div className="absolute bottom-[5%] right-[20%] z-20">
                <div className="group h-32 w-64 overflow-hidden rounded-2xl shadow-lg transition-all duration-500 hover:scale-110 hover:shadow-2xl lg:h-[230px] lg:w-[520px]">
                  <div
                    className="h-full w-full bg-contain bg-no-repeat bg-center transition-transform duration-700 group-hover:scale-110"
                    style={{
                      backgroundImage:
                        'url("/Mask group2.png")',
                    }}
                  />
                </div>
              </div>

              {/* 裝飾性背景方塊 */}
              <div className="absolute left-[15%] top-[15%] z-0 h-24 w-24 animate-float rounded-2xl bg-brand-primary/10 backdrop-blur-sm"></div>
              <div className="absolute bottom-[20%] right-[10%] z-0 h-32 w-32 animate-float-delayed rounded-xl bg-neutral-200/20 backdrop-blur-sm"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

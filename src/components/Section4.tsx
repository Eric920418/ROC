"use client";

import Image from "next/image";
import { useState } from "react";
import { ArrowRight } from "lucide-react";

export function Section4() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const testimonials = [
    {
      title: "我的咖啡廳，風格由我來定義！",
      description:
        "咖啡不止要好喝，更要脫穎而出2025年我們與Bean In Motion合作咖啡廳加速器計劃BIM今年11月剛從宏都拉進口4噸評分90分以上的藝妓咖啡豆手工挑選最優質的咖啡豆，到小批量慢火烘焙提倡咖啡不只是「一克多少錢」的交易，而是一場文化交流剛進台灣市場馬上銷售一空我們能拿出54 種咖啡風味的香氣樣本，逐一介紹讓你挑選一同體驗風味差異。更完整的為創業家設計咖啡廳創業課程為您打造一間能獲利、承載生活價值的咖啡廳A 入門組合適合小型外帶咖啡店（5-10坪）給剛嘗試投入咖啡產業內容包含：品牌命名與標誌設計、基礎室內設計、咖啡豆供應、咖啡機設備",
      image: "/Mask group4.png",
    },
    {
      title: "空間設計超越期待，每個細節都讓人驚艷",
      description:
        "從第一次諮詢到最後完工，整個過程都非常順利。設計師不僅理解我們的需求，還提出了許多創新的想法。完成後的空間完全符合我們的生活方式。",
      image: "/Mask group.png",
    },
    {
      title: "專業、用心、值得信賴的設計團隊",
      description:
        "選擇他們是我做過最正確的決定。從材質挑選到施工細節，每個環節都處理得非常到位。完工後的品質遠超預期，真心推薦給所有追求品質的朋友。",
      image: "/Mask group2.png",
    },
  ];

  const handleDotClick = (index: number) => {
    if (isTransitioning || index === currentIndex) return;
    setIsTransitioning(true);
    setCurrentIndex(index);
    setTimeout(() => setIsTransitioning(false), 500);
  };

  const currentTestimonial = testimonials[currentIndex];

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
                CLIENT TESTIMONIALS
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
                  href="#"
                  className="group inline-flex items-center gap-2 text-neutral-900 transition-colors hover:text-brand-primary"
                >
                  <span className="text-sm font-medium">查看更多客戶回饋</span>

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

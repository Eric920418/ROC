"use client";

import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function Section3() {
  const [currentIndex, setCurrentIndex] = useState(1); // 從 1 開始，顯示中間
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isInCenter, setIsInCenter] = useState(false); // 是否在視窗中央
  const sectionRef = useRef<HTMLElement>(null);
  const marqueeRef = useRef<HTMLDivElement>(null);

  const projects = [
    {
      id: "01",
      title: "設計客廳",
      description:
        "當代客廳的骨架。\n制，\n設計師的重點。\n是一種日常的構築藝術。",
      image: "/section3-1.jpg",
    },
    {
      id: "02",
      title: "當代設計書房",
      description:
        "極簡的線條，柔和的光，重拾不必多，只要剛好。\n在留白中思考，在寧靜裡前進。\n一張桌，一把椅，一盞光，足以築起整個世界的地基。",
      image: "/section3-2.jpg",
    },
    {
      id: "03",
      title: "當代廚房",
      description:
        "極簡的線條，柔和的光，\n在留白中思考，在寧靜裡前進。\n一張桌，一把椅，一盞光",
      image: "/section3-3.jpg",
    },
    {
      id: "04",
      title: "當代臥室",
      description:
        "極簡的線條，柔和的光，\n在留白中思考，在寧靜裡前進。\n一張桌，一把椅，一盞光",
      image: "/section3-4.jpg",
    },
    {
      id: "05",
      title: "當代浴室",
      description:
        "極簡的線條，柔和的光，\n在留白中思考，在寧靜裡前進。\n一張桌，一把椅，一盞光",
      image: "/section3-5.jpg",
    },
  ];

  // 創建擴展陣列（前後各補一個）以實現無縫循環
  const extendedProjects = [
    projects[projects.length - 1], // 最後一個
    ...projects,
    projects[0], // 第一個
  ];

  const handlePrev = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => prev - 1);
  };

  const handleNext = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => prev + 1);
  };

  const handleTransitionEnd = () => {
    setIsTransitioning(false);
    // 如果到達邊界，瞬間跳轉到對應位置
    if (currentIndex === 0) {
      setCurrentIndex(projects.length);
    } else if (currentIndex === extendedProjects.length - 1) {
      setCurrentIndex(1);
    }
  };

  // 計算真實的索引（用於指示點）
  const getRealIndex = () => {
    if (currentIndex === 0) return projects.length - 1;
    if (currentIndex === extendedProjects.length - 1) return 0;
    return currentIndex - 1;
  };

  const goToSlide = (index: number) => {
    if (!isTransitioning) {
      setIsTransitioning(true);
      setCurrentIndex(index + 1); // +1 因為 extendedProjects 有偏移
    }
  };

  // 檢測區塊是否在視窗垂直居中
  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;

      const rect = sectionRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // 計算區塊中心點與視窗中心點的距離
      const sectionCenter = rect.top + rect.height / 2;
      const windowCenter = windowHeight / 2;
      const distance = Math.abs(sectionCenter - windowCenter);

      // 如果距離小於 300px，認為是在中央（更早觸發）
      const inCenter = distance < 300;

      if (inCenter !== isInCenter) {
        setIsInCenter(inCenter);
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // 初始檢查

    return () => window.removeEventListener("scroll", handleScroll);
  }, [isInCenter]);

  return (
    <section ref={sectionRef} className="w-full bg-white px-[96px] py-16">
      <div className="mx-auto max-w-[1680px]">
        {/* 文字圖片跑馬燈 / Slogan 區域 */}
        <div className="relative mb-12 overflow-hidden">
          {/* 跑馬燈 */}
          <div
            ref={marqueeRef}
            className={`flex transition-opacity duration-700 ${
              isInCenter
                ? "animate-marquee-paused opacity-0"
                : "animate-marquee opacity-100"
            }`}
          >
            {/* 第一組圖片 */}
            <div className="flex flex-shrink-0 gap-12 px-6">
              <Image
                src="/connect-blue.png"
                alt="connect"
                width={200}
                height={60}
                className="h-12 w-auto object-contain md:h-16 lg:h-20"
              />
              <Image
                src="/compose-blue.png"
                alt="compose"
                width={200}
                height={60}
                className="h-12 w-auto object-contain md:h-16 lg:h-20"
              />
              <Image
                src="/coedge-blue.png"
                alt="coEdge"
                width={200}
                height={60}
                className="h-12 w-auto object-contain md:h-16 lg:h-20"
              />
              <Image
                src="/cohort-blue.png"
                alt="cohort"
                width={200}
                height={60}
                className="h-12 w-auto object-contain md:h-16 lg:h-20"
              />
              <Image
                src="/collective-blue.png"
                alt="collective"
                width={200}
                height={60}
                className="h-12 w-auto object-contain md:h-16 lg:h-20"
              />
            </div>
            {/* 第二組圖片（複製以實現無縫循環） */}
            <div className="flex flex-shrink-0 gap-12 px-6">
              <Image
                src="/connect-blue.png"
                alt="connect"
                width={200}
                height={60}
                className="h-12 w-auto object-contain md:h-16 lg:h-20"
              />
              <Image
                src="/compose-blue.png"
                alt="compose"
                width={200}
                height={60}
                className="h-12 w-auto object-contain md:h-16 lg:h-20"
              />
              <Image
                src="/coedge-blue.png"
                alt="coEdge"
                width={200}
                height={60}
                className="h-12 w-auto object-contain md:h-16 lg:h-20"
              />
              <Image
                src="/cohort-blue.png"
                alt="cohort"
                width={200}
                height={60}
                className="h-12 w-auto object-contain md:h-16 lg:h-20"
              />
              <Image
                src="/collective-blue.png"
                alt="collective"
                width={200}
                height={60}
                className="h-12 w-auto object-contain md:h-16 lg:h-20"
              />
            </div>
          </div>

          {/* Slogan - 當區塊居中時顯示 */}
          <div
            className={`absolute inset-0 flex items-center justify-center transition-all duration-700 ${
              isInCenter
                ? "opacity-100 scale-100"
                : "pointer-events-none opacity-0 scale-95"
            }`}
          >
            <h2 className="text-4xl font-light tracking-wide text-brand-primary md:text-5xl lg:text-6xl">
              this is my motto
            </h2>
          </div>
        </div>

        {/* 輪播容器 */}
        <div className="relative overflow-hidden">
          {/* 滑動軌道 */}
          <div
            className="flex transition-transform duration-500 ease-in-out"
            style={{
              transform: `translateX(calc(-${
                currentIndex * 33.333
              }% + 16.667%))`,
              transition: isTransitioning
                ? "transform 0.5s ease-in-out"
                : "none",
            }}
            onTransitionEnd={handleTransitionEnd}
          >
            {extendedProjects.map((project, index) => {
              // 判斷是否為中央卡片
              const isCurrent = index === currentIndex;
              const isPrev = index === currentIndex - 1;
              const isNext = index === currentIndex + 1;
              const isVisible = isCurrent || isPrev || isNext;

              return (
                <div
                  key={`${project.id}-${index}`}
                  className="w-1/3 flex-shrink-0 px-4"
                >
                  <div
                    className={`transition-all duration-500 ${
                      isCurrent
                        ? "scale-100 opacity-100"
                        : isVisible
                        ? "scale-90 opacity-60"
                        : "scale-85 opacity-30"
                    }`}
                  >
                    {/* 圖片 */}
                    <div
                      className={`relative mb-6 overflow-hidden rounded-3xl bg-neutral-100 transition-all duration-500 ${
                        isCurrent
                          ? "aspect-[4/3] shadow-2xl"
                          : "aspect-[4/3] shadow-md"
                      }`}
                    >
                      <Image
                        src={project.image}
                        alt={project.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 1024px) 100vw, 33vw"
                      />
                    </div>

                    {/* 內容 - 只有中央卡片顯示完整內容 */}
                    <div
                      className={`space-y-3 transition-all duration-500 ${
                        isCurrent ? "opacity-100" : "opacity-60"
                      }`}
                    >
                      <h3
                        className={`font-medium ${
                          isCurrent
                            ? "text-2xl md:text-3xl"
                            : "text-lg md:text-xl"
                        }`}
                      >
                        <span className="text-brand-primary">{project.id}</span>{" "}
                        <span className="text-neutral-900">
                          {project.title}
                        </span>
                      </h3>
                      {isCurrent && (
                        <p className="whitespace-pre-line text-base leading-relaxed text-neutral-300 lg:text-lg">
                          {project.description}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 按鈕 + 指示點 */}
        <div className="mt-8 flex items-center justify-center gap-6">
          {/* 左按鈕 */}
          <button
            onClick={handlePrev}
            disabled={isTransitioning}
            className="rounded-full bg-white/80 p-2.5 text-brand-primary shadow-md backdrop-blur-sm transition-all hover:bg-white hover:scale-105 disabled:opacity-30"
            aria-label="上一張"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          {/* 指示點 */}
          <div className="flex gap-2">
            {projects.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                disabled={isTransitioning}
                className={`h-2 rounded-full transition-all ${
                  index === getRealIndex()
                    ? "w-8 bg-brand-primary"
                    : "w-2 bg-neutral-200 hover:bg-neutral-300"
                }`}
                aria-label={`跳到第 ${index + 1} 張`}
              />
            ))}
          </div>

          {/* 右按鈕 */}
          <button
            onClick={handleNext}
            disabled={isTransitioning}
            className="rounded-full bg-white/80 p-2.5 text-brand-primary shadow-md backdrop-blur-sm transition-all hover:bg-white hover:scale-105 disabled:opacity-30"
            aria-label="下一張"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </section>
  );
}
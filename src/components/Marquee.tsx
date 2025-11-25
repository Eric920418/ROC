"use client";

import Image from "next/image";
import { useState, useEffect, useRef } from "react";

export function Marquee() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isInCenter, setIsInCenter] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  // 後綴圖片列表（可個別調整 offsetX 來控制與 Logo 的距離，負數代表向左移動）
  const suffixImages = [
    { src: "/coEdge-blue.png", alt: "Edge", offsetX: -120, offsetY: 2 },      // 調整這個數值
    { src: "/connect-blue.png", alt: "nnect", offsetX: -108, offsetY: 2 },    // 調整這個數值
    { src: "/compose-blue.png", alt: "mpose", offsetX: -100, offsetY: 0 },    // 調整這個數值
    { src: "/cohort-blue.png", alt: "hort", offsetX: -124, offsetY: 0 },      // 調整這個數值
    { src: "/collective-blue.png", alt: "llective", offsetX: -100, offsetY: 0 }, // 調整這個數值
  ];

  // 檢測區塊是否在視窗垂直居中
  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;

      const rect = sectionRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // 當 section 橫跨視窗中心線時顯示 slogan
      const windowCenter = windowHeight / 2;
      const sectionTop = rect.top;
      const sectionBottom = rect.bottom;

      // section 橫跨視窗中心線即可（簡化條件）
      const inCenter = sectionTop < windowCenter && sectionBottom > windowCenter;

      if (inCenter !== isInCenter) {
        setIsInCenter(inCenter);
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // 初始檢查

    return () => window.removeEventListener("scroll", handleScroll);
  }, [isInCenter]);

  // 定時切換後綴圖片
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % suffixImages.length);
    }, 2000); // 每2秒切換一次

    return () => clearInterval(interval);
  }, [suffixImages.length]);

  return (
    <section ref={sectionRef} className="w-full bg-white px-[96px]">
      <div className="mx-auto max-w-[1680px]">
        <div className="relative">
          {/* R.co + 後綴輪播區域 */}
          <div
            className={`flex items-center justify-center gap-0 ms-30 transition-opacity duration-700 ${
              isInCenter ? "opacity-0" : "opacity-100"
            }`}
          >
            {/* 固定的 R.co Logo */}
            <div className="flex-shrink-0">
              <Image
                src="/R.coLogo.png"
                alt="R.co"
                width={200}
                height={80}
                className="h-20 w-auto object-contain lg:h-[60px]"
                priority
              />
            </div>

            {/* 輪播的後綴圖片 */}
            <div className="relative flex items-center justify-start overflow-hidden" style={{ width: "300px", height: "180px" }}>
              {suffixImages.map((image, index) => (
                <div
                  key={image.src}
                  className={`absolute left-0 top-0 flex h-full w-full items-center justify-start transition-all duration-1000 ease-in-out ${
                    index === currentIndex
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 -translate-y-4"
                  }`}
                  style={{ marginLeft: `${image.offsetX}px` , marginTop: `${image.offsetY}px` }}
                >
                  <Image
                    src={image.src}
                    alt={image.alt}
                    width={300}
                    height={80}
                    className="h-full w-[300px] object-contain object-left"
                    priority={index === 0}
                  />
                </div>
              ))}
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
              THIS IS MY MOTTO
            </h2>
          </div>
        </div>
      </div>
    </section>
  );
}

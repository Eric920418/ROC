"use client";

import Image from "next/image";
import { ArrowDown } from "lucide-react";
import { useState, useEffect } from "react";

interface Section1Data {
  titleLeft: string;
  titleRight: string;
  tagline: string;
  leftImage: string;
  rightTopText: string;
  rightTopTagline: string;
  rightImage: string;
  bottomTitle: string;
  bottomDescription: string;
}

export function Section1() {
  const [data, setData] = useState<Section1Data | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/graphql", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            query: `query { section1 { titleLeft titleRight tagline leftImage rightTopText rightTopTagline rightImage bottomTitle bottomDescription } }`,
          }),
        });
        const { data: resData } = await res.json();
        if (resData?.section1) {
          setData(resData.section1);
        }
      } catch (error) {
        console.error("Failed to fetch section1 data:", error);
      }
    };
    fetchData();
  }, []);

  // 資料未載入時不渲染，避免閃爍
  if (!data) {
    return null;
  }

  return (
    <section className="w-full bg-white px-4 py-8 md:px-[96px]">
      <div className="mx-auto w-full">
        <div className="flex flex-col space-y-8 md:flex-row md:justify-between md:space-x-4 md:space-y-0">
          {/* 左側內容 */}
          <div className="flex flex-col justify-start w-full md:w-[60%]">
            {/* 大標題 */}
            <h1 className="flex flex-col mb-[24px] text-2xl font-light leading-tight text-neutral-200 sm:text-4xl md:text-6xl xl:text-[96px]" style={{ fontFamily: 'var(--font-caslon)' }}>
              <span className="text-neutral-200 leading-none tracking-wide">
                {data.titleLeft}
              </span>
              <span className="text-neutral-300 leading-none tracking-wide">
                {data.titleRight}
              </span>
            </h1>

            {/* 當代設計按鈕 */}
            <div className="mb-8 flex items-center gap-4 md:mb-[64px] md:gap-[24px]">
              <span className="text-2xl font-medium text-brand-primary md:text-3xl lg:text-4xl">
                {data.tagline}
              </span>
              <button className="flex h-10 w-10 lg:h-14 lg:w-14  items-center justify-center rounded-full bg-brand-primary text-white shadow-lg transition-transform hover:scale-105">
                <ArrowDown className="h-4 w-4 lg:h-6 lg:w-6" />
              </button>
            </div>

            {/* 左側大圖 */}
            <div className="relative w-full aspect-[1420/800] overflow-hidden rounded-3xl shadow-xl">
              <Image
                src={data.leftImage}
                alt="Contemporary Interior Design"
                fill
                className="object-contain"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </div>

          {/* 右側內容 */}
          <div className="flex flex-col justify-start flex-1">
            <div className="flex flex-col gap-2 items-start md:items-end mb-[12px] mt-4 md:mt-[176px]">
              <p className="text-sm font-medium md:text-[18px]">
                {data.rightTopText}
              </p>
              <div className="text-brand-primary text-xl font-medium md:text-[32px]">{data.rightTopTagline}</div>
            </div>
            {/* 右側圖片 */}
            <div className="relative aspect-[932/400] w-full overflow-hidden rounded-3xl shadow-xl mb-8 md:mb-[64px]">
              <Image
                src={data.rightImage}
                alt="Minimalist Desk Setup"
                fill
                className="object-contain"
              />
            </div>

            {/* 極簡現代風 */}
            <div className="space-y-4">
              <h3 className="text-2xl font-medium text-brand-primary lg:text-3xl" style={{ fontFamily: 'var(--font-caslon)' }}>
                {data.bottomTitle}
              </h3>
              <p className="text-sm leading-relaxed lg:text-base whitespace-pre-line">
                {data.bottomDescription}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

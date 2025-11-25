"use client";

import Image from "next/image";
import { ArrowDown, Crown } from "lucide-react";

export function Section1() {
  return (
    <section className="w-full bg-white px-[96px] py-8">
      <div className="mx-auto w-full">
        <div className="flex justify-between  space-x-4">
          {/* 左側內容 */}
          <div className="flex flex-col justify-start w-[60%]">
            {/* 大標題 */}
            <h1 className="flex flex-col mb-[24px] text-6xl font-light leading-tight text-neutral-200 lg:text-[96px]">
              <span className="text-neutral-200 leading-none tracking-wide">
                Contemporary
              </span>
              <span className="text-neutral-300 leading-none tracking-wide">
                Design
              </span>
            </h1>

            {/* 當代設計按鈕 */}
            <div className="mb-[64px] flex items-center gap-[24px]">
              <span className="text-3xl font-medium text-brand-primary lg:text-4xl">
                當代設計
              </span>
              <button className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-primary text-white shadow-lg transition-transform hover:scale-105">
                <ArrowDown className="h-6 w-6" />
              </button>
            </div>

            {/* 左側大圖 */}
            <div className="relative w-full aspect-[1420/800] overflow-hidden rounded-3xl shadow-xl">
              <Image
                src="/Mask group.png"
                alt="Contemporary Interior Design"
                fill
                className="object-contain"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </div>

          {/* 右側內容 */}
          <div className="flex flex-col justify-start flex-1 ">
            <div className="flex flex-col gap-2 items-end mb-[12px] mt-[176px]">
              <p className="text-[18px] font-medium ">
                we create the onysica presence your identity deserves.
              </p>
              <div className="text-brand-primary text-[32px] font-medium">我的風格，由我來定義</div>
            </div>
            {/* 右側圖片 */}
            <div className="relative aspect-[932/400] w-full overflow-hidden rounded-3xl shadow-xl mb-[64px]">
              <Image
                src="/Mask group2.png"
                alt="Minimalist Desk Setup"
                fill
                className="object-contain"
              />
            </div>

            {/* 極簡現代風 */}
            <div className="space-y-4">
              <h3 className="text-2xl font-medium text-brand-primary lg:text-3xl">
                做出120%的作品非常不容易
              </h3>
              <p className="text-sm leading-relaxed  lg:text-base">
                剝除多餘的裝飾
                <br />
                創造永不退流行的設計空間
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

"use client";

import Image from "next/image";
import { ArrowDown, Crown } from "lucide-react";

export function Section1() {
  return (
    <section className="w-full bg-white px-[96px] py-16">
      <div className="mx-auto w-full">
        <div className="flex justify-between  space-x-4">
          {/* 左側內容 */}
          <div className="flex flex-col justify-start w-[60%]">
            {/* 大標題 */}
            <h1 className="flex flex-col mb-[24px] text-6xl font-light leading-tight text-neutral-200 lg:text-[96px]">
              <span className="text-neutral-200 font-bold leading-none tracking-wide">
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
            {/* 頂部卡片 */}
            <div className="inline-flex items-center gap-2 self-end rounded-full bg-neutral-100  px-6 py-3 shadow-md mb-[12px]">
              <Crown className="h-5 w-5 text-brand-primary " />
              <span className="text-sm font-medium text-neutral-900">
                NO.1 的當代設計精神
              </span>
            </div>

            <div className="flex flex-col gap-6 items-end mb-[36px]">
              {/* 標語 */}
              <div className="space-y-2 text-right">
                <p className="text-base font-light text-neutral-200 lg:text-xl leading-none">
                  Less, but better.
                </p>
                <p className="text-base text-neutral-200 lg:text-xl leading-none">
                  簡約、創新、永續、以人為本
                </p>
              </div>
              {/* Dieter Rams 介紹 */}
              <div className=" text-neutral-200 text-right">
                <p className="text-sm leading-relaxed lg:text-xl">
                  德國傳奇設計師
                </p>
                <p className="text-sm leading-relaxed lg:text-xl">
                  Dieter Rams（迪特・拉姆斯）的名言
                </p>
                <p className="text-sm leading-relaxed lg:text-xl">
                  他是 Braun 與 Vitsoe 的設計總監
                </p>
                <p className="text-sm leading-relaxed lg:text-xl">
                  奠定了「當代設計」的核心哲學
                </p>
              </div>
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
                極簡現代風
              </h3>
              <p className="text-sm leading-relaxed text-neutral-200 lg:text-base">
                線條簡潔、比例純粹，當代住宅不囉嗦於形
                <br />
                而讓空間自己說話
              </p>
              <p className="text-sm font-light text-neutral-200 lg:text-base">
                少一分裝飾，多一分真實
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

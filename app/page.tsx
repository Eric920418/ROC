"use client";

import { Section1 } from "@/components/Section1";
import { Section3 } from "@/components/Section3";
import { Section4 } from "@/components/Section4";
import { Section5 } from "@/components/Section5";
import { Marquee } from "@/components/Marquee";
import { ScaleWrapper } from "@/components/ScaleWrapper";
import { AnimatedSection, HeroAnimation } from "@/components/AnimatedSection";
import { VideoHero } from "@/components/VideoHero";
import { MasonryGallery } from "@/components/MasonryGallery";

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      {/* 全屏影片 Hero — ScaleWrapper 外 */}
      <VideoHero />

      <ScaleWrapper baseWidth={1920} minWidth={1280}>
        {/* 首屏 Hero 區塊 - 頁面載入時立即動畫 */}
        {/* <HeroAnimation delay={0.1} duration={0.8}>
          <Section1 />
        </HeroAnimation> */}

        {/* Marquee 跑馬燈 - 稍微延遲出現 */}
        {/* <HeroAnimation delay={0.3} duration={0.6}>
          <Marquee />
        </HeroAnimation> */}

        <AnimatedSection animation="fadeUp" delay={0.1}>
          <Section3 />
        </AnimatedSection>

        {/* <AnimatedSection animation="slideLeft" delay={0.1}>
          <Section4 />
        </AnimatedSection> */}

        {/* <Section5 /> */}
      </ScaleWrapper>

      {/* 瀑布流圖片牆 — ScaleWrapper 外 */}
      <MasonryGallery />
    </main>
  );
}

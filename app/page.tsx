"use client";

import { Section1 } from "@/components/Section1";
import { Section2 } from "@/components/Section2";
import { Section3 } from "@/components/Section3";
import { Section4 } from "@/components/Section4";
import { Section5 } from "@/components/Section5";
import { Section6 } from "@/components/Section6";
import { Section7 } from "@/components/Section7";
import { Marquee } from "@/components/Marquee";
import { ScaleWrapper } from "@/components/ScaleWrapper";
import { AnimatedSection, HeroAnimation } from "@/components/AnimatedSection";

export default function Home() {
  return (
    <ScaleWrapper baseWidth={1920} minWidth={1280}>
      <main className="min-h-screen bg-white">
        {/* 首屏 Hero 區塊 - 頁面載入時立即動畫 */}
        <HeroAnimation delay={0.1} duration={0.8}>
          <Section1 />
        </HeroAnimation>

        {/* Marquee 跑馬燈 - 稍微延遲出現 */}
        <HeroAnimation delay={0.3} duration={0.6}>
          <Marquee />
        </HeroAnimation>

        {/* Section7 已有內建動畫（左右滑入），不需要外層包裹 */}
        <Section7 />

        <AnimatedSection animation="fadeUp" delay={0.1}>
          <Section2 />
        </AnimatedSection>

        <AnimatedSection animation="fadeUp" delay={0.1}>
          <Section3 />
        </AnimatedSection>

        <AnimatedSection animation="slideLeft" delay={0.1}>
          <Section4 />
        </AnimatedSection>

        {/* <Section5 /> */}

        <AnimatedSection animation="scale" delay={0.1}>
          <Section6 />
        </AnimatedSection>
      </main>
    </ScaleWrapper>
  );
}

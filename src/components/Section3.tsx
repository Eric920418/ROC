"use client";

import Image from "next/image";
import { useState } from "react";
import { ArrowRight } from "lucide-react";

export function Section3() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const projects = [
    {
      id: "01",
      title: "設計客廳",
      subtitle: "當代生活的核心空間",
      description:
        "當代客廳的骨架。設計師的重點。是一種日常的構築藝術。每一個角落都是精心規劃，每一道光線都經過計算。",
      image: "/Mask group.png",
    },
    {
      id: "02",
      title: "當代設計書房",
      subtitle: "思考與創作的聖地",
      description:
        "極簡的線條，柔和的光，重拾不必多，只要剛好。在留白中思考，在寧靜裡前進。一張桌，一把椅，一盞光，足以築起整個世界的地基。",
      image: "/Mask group2.png",
    },
    {
      id: "03",
      title: "當代廚房",
      subtitle: "料理與生活的交會",
      description:
        "極簡的線條，柔和的光，在留白中思考，在寧靜裡前進。一張桌，一把椅，一盞光。功能與美學的完美平衡。",
      image: "/Mask group4.png",
    },
    {
      id: "04",
      title: "當代臥室",
      subtitle: "寧靜休憩的避風港",
      description:
        "極簡的線條，柔和的光，在留白中思考，在寧靜裡前進。一張桌，一把椅，一盞光。回歸最純粹的休息本質。",
      image: "/Mask group.png",
    },
    {
      id: "05",
      title: "當代浴室",
      subtitle: "私密的療癒空間",
      description:
        "極簡的線條，柔和的光，在留白中思考，在寧靜裡前進。一張桌，一把椅，一盞光。水與石的詩意對話。",
      image: "/Mask group2.png",
    },
  ];

  const currentProject = projects[currentIndex];

  return (
    <section className="relative h-screen w-full bg-white overflow-hidden my-16">
      {/* 全屏背景圖片 */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 transition-all duration-700">
          <Image
            src={currentProject.image}
            alt={currentProject.title}
            fill
            className="object-fill"
            priority
            sizes="100vw"
          />
        </div>
        {/* 深色遮罩層 */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/5 via-black/10 to-black/5" />
      </div>

      {/* 主要內容區 */}
      <main className="relative z-10 flex h-screen items-center justify-center p-4 sm:p-8">
        <div className="w-full  mx-auto  flex items-center justify-between">
          {/* 左側：項目導航 */}
          <div className="">
            <div className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl border border-white/20 shadow-2xl">
              <div className="flex flex-col gap-4">
                <div className="mb-4 pb-4 border-b border-white/20">
                  <h2 className="text-white text-xl font-bold tracking-tight">
                    空間探索
                  </h2>
                  <p className="text-white/70 text-sm mt-1">
                    SPACE EXPLORATION
                  </p>
                </div>

                <nav className="flex flex-col gap-2">
                  {projects.map((project, index) => (
                    <button
                      key={project.id}
                      onClick={() => setCurrentIndex(index)}
                      className={`group flex items-center justify-between gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                        index === currentIndex
                          ? "bg-gradient-to-r from-amber-400/90 to-amber-500/90 shadow-lg scale-105"
                          : "bg-white/5 hover:bg-white/15"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className={`text-xs font-bold ${
                            index === currentIndex
                              ? "text-black"
                              : "text-white/50"
                          }`}
                        >
                          {project.id}
                        </span>
                        <span
                          className={`text-sm font-medium tracking-wide ${
                            index === currentIndex
                              ? "text-black"
                              : "text-white/80"
                          }`}
                        >
                          {project.title}
                        </span>
                      </div>
                      <ArrowRight
                        className={`h-4 w-4 transition-transform duration-300 ${
                          index === currentIndex
                            ? "text-black translate-x-1"
                            : "text-white/40 group-hover:translate-x-1"
                        }`}
                      />
                    </button>
                  ))}
                </nav>
              </div>
            </div>
          </div>

          {/* 右側：內容區 */}
          <div className="">
            <div className="w-[300px] flex flex-col gap-6 bg-white/10 backdrop-blur-lg p-6 rounded-2xl border border-white/20 shadow-2xl">
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <div className="h-1 w-12 bg-gradient-to-r from-amber-400 to-amber-500 rounded-full" />
                  <span className="text-white/60 text-xs font-medium tracking-widest uppercase">
                    {currentProject.id} / 05
                  </span>
                </div>

                <h1 className="text-xl lg:text-2xl font-black leading-tight tracking-tight text-white">
                  {currentProject.title}
                </h1>

                <h2 className="text-sm font-medium text-amber-400/90">
                  {currentProject.subtitle}
                </h2>

                <p className="text-base leading-relaxed text-white/80">
                  {currentProject.description}
                </p>
              </div>

              <button className="group flex items-center justify-center gap-2 w-full px-2 py-1 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-black text-base font-bold rounded-xl shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl">
                <span>探索更多</span>
                <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
              </button>
           
            </div>
          </div>
        </div>
      </main>
    </section>
  );
}
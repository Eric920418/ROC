"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Mail, Phone, Linkedin } from "lucide-react";
import Image from "next/image";

interface TeamMember {
  id: number;
  name: string;
  role: string;
  yearsExperience: string;
  avatar: string;
  description: string;
  experience: string[];
  contact: {
    email: string;
    phone: string;
    linkedin: string;
  };
}

interface Section2Data {
  title: string;
  subtitle: string;
  members: TeamMember[];
}

const defaultMembers: TeamMember[] = [
  {
    id: 1,
    name: "李珈儀 Vivian",
    role: "合夥人 / 行銷總監",
    yearsExperience: "18+",
    avatar: "/IMG_9001.jpg",
    description: "執行專案：HBO Max、MEDIX ProClot、INSPO、AZUCAR、瀚寓酒店、娘家益生菌等",
    experience: [
      "塑造全球品牌形象，讓創意與客戶需求緊密結合",
      "透過市場洞察與批判思考，驅動品牌系統化成長",
      "跨領域合作",
      "管理數位內容策略與績效追蹤，優化行銷成效",
    ],
    contact: { email: "chen@archspace.tw", phone: "+886 2 2345 6789", linkedin: "chen-yisen" },
  },
];

export function Section2() {
  const [sectionData, setSectionData] = useState<Section2Data>({
    title: "團隊成員",
    subtitle: "Team Members",
    members: defaultMembers,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/graphql", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            query: `query { section2 { title subtitle members } }`,
          }),
        });
        const { data } = await res.json();
        if (data?.section2) {
          setSectionData({
            title: data.section2.title || "團隊成員",
            subtitle: data.section2.subtitle || "Team Members",
            members: data.section2.members?.length > 0 ? data.section2.members : defaultMembers,
          });
        }
      } catch (error) {
        console.error("Failed to fetch section2 data:", error);
      }
    };
    fetchData();
  }, []);

  const teamMembers = sectionData.members;
  const memberCount = teamMembers.length;

  // 創建多組重複陣列實現真正的無限循環（重複5次）
  const extendedMembers = [
    ...teamMembers,
    ...teamMembers,
    ...teamMembers,
    ...teamMembers,
    ...teamMembers,
  ];

  // 從中間組開始（第3組）
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  // 當成員數據變化時，重置 currentIndex 到中間位置
  useEffect(() => {
    setCurrentIndex(memberCount * 2);
  }, [memberCount]);

  // 自動輪播
  useEffect(() => {
    // 只有當有多於1個成員時才自動輪播
    if (memberCount <= 1) return;

    const timer = setInterval(() => {
      setIsAnimating(true);
      setCurrentIndex((prev) => prev + 1);
    }, 5000);
    return () => clearInterval(timer);
  }, [memberCount]);

  const handlePrev = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex((prev) => prev - 1);
  };

  const handleNext = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex((prev) => prev + 1);
  };

  const handleTransitionEnd = (e: React.TransitionEvent) => {
    // 只在 transform 屬性結束時處理，避免重複觸發
    if (e.propertyName !== "transform") return;

    setIsAnimating(false);

    // 當接近邊界時，重置到中間對應的位置（無動畫，用戶看不出來）
    // extendedMembers 總長度 = memberCount * 5
    // 安全範圍：索引 memberCount 到 memberCount * 4 - 1
    const minSafeIndex = memberCount;
    const maxSafeIndex = memberCount * 4 - 1;

    if (currentIndex < minSafeIndex) {
      // 太靠左，跳到中間對應位置
      setCurrentIndex(currentIndex + memberCount * 2);
    } else if (currentIndex > maxSafeIndex) {
      // 太靠右，跳到中間對應位置
      setCurrentIndex(currentIndex - memberCount * 2);
    }
  };

  // 計算真實的索引（用於指示點）
  const getRealIndex = () => {
    if (memberCount === 0) return 0;
    // 處理負數情況
    return ((currentIndex % memberCount) + memberCount) % memberCount;
  };

  const goToSlide = (index: number) => {
    if (!isAnimating && memberCount > 0) {
      setIsAnimating(true);
      // 計算最近的對應索引（在當前所在組）
      const currentGroup = Math.floor(currentIndex / memberCount);
      setCurrentIndex(currentGroup * memberCount + index);
    }
  };

  // 計算卡片位置和樣式 - 單向循環版本
  const getCardStyle = (index: number) => {
    const diff = index - currentIndex;

    // 判斷是否為當前卡片
    const isCurrent = diff === 0;
    const isPrev = diff === -1;
    const isNext = diff === 1;
    const isPrev2 = diff === -2;
    const isNext2 = diff === 2;
    const isVisible = Math.abs(diff) <= 2;

    if (isCurrent) {
      // === 當前卡片 - 正中央 ===
      return {
        transform: `
          translateX(0)
          translateY(${hoveredCard === index ? -20 : 0}px)
          translateZ(0)
          rotateY(0deg)
          rotateZ(0deg)
          scale(${hoveredCard === index ? 1.05 : 1})
        `,
        zIndex: 50,
        opacity: 1,
        filter: "brightness(1) blur(0px)",
        pointerEvents: "auto" as const,
      };
    } else if (isPrev) {
      // === 左側第一層 ===
      return {
        transform: `
          translateX(-480px)
          translateY(40px)
          translateZ(-80px)
          rotateY(25deg)
          rotateZ(-3deg)
          scale(0.75)
        `,
        zIndex: 40,
        opacity: 0.6,
        filter: "brightness(0.85) blur(1px)",
        pointerEvents: "auto" as const,
      };
    } else if (isNext) {
      // === 右側第一層 ===
      return {
        transform: `
          translateX(480px)
          translateY(40px)
          translateZ(-80px)
          rotateY(-25deg)
          rotateZ(3deg)
          scale(0.75)
        `,
        zIndex: 40,
        opacity: 0.6,
        filter: "brightness(0.85) blur(1px)",
        pointerEvents: "auto" as const,
      };
    } else if (isPrev2) {
      // === 左側第二層 ===
      return {
        transform: `
          translateX(-800px)
          translateY(60px)
          translateZ(-150px)
          rotateY(35deg)
          rotateZ(-5deg)
          scale(0.55)
        `,
        zIndex: 30,
        opacity: 0.35,
        filter: "brightness(0.7) blur(2px)",
        pointerEvents: "auto" as const,
      };
    } else if (isNext2) {
      // === 右側第二層 ===
      return {
        transform: `
          translateX(800px)
          translateY(60px)
          translateZ(-150px)
          rotateY(-35deg)
          rotateZ(5deg)
          scale(0.55)
        `,
        zIndex: 30,
        opacity: 0.35,
        filter: "brightness(0.7) blur(2px)",
        pointerEvents: "auto" as const,
      };
    } else {
      // === 完全隱藏（在可見範圍外） ===
      return {
        transform: `
          translateX(${diff > 0 ? 1200 : -1200}px)
          translateY(200px)
          translateZ(-300px)
          scale(0.3)
        `,
        zIndex: 0,
        opacity: 0,
        filter: "brightness(0.5) blur(3px)",
        pointerEvents: "none" as const,
      };
    }
  };

  return (
    <section className="w-full bg-white px-4 pt-8 pb-8 overflow-hidden md:px-[96px]">
      <div className="mx-auto max-w-[1680px]">
        {/* 標題區域 */}
        <div className="text-center mb-6">
          <h2 className="mb-4 text-3xl  text-brand-primary md:text-5xl font-bold">
            {sectionData.title}
          </h2>
          <p className="text-lg text-neutral-300">{sectionData.subtitle}</p>
        </div>

        {/* 卡片容器 - 3D 堆疊效果 */}
        <div className="relative mx-auto h-auto min-h-[400px] w-full max-w-[1600px] md:h-[550px] md:perspective-2000">
          {/* 左側切換按鈕 - 只在桌面版顯示 */}
          <button
            onClick={handlePrev}
            disabled={isAnimating || memberCount <= 1}
            className="hidden md:block absolute left-0 top-1/2 z-[60] -translate-y-1/2 rounded-full bg-white p-4 text-brand-primary shadow-2xl transition-all hover:scale-110 hover:shadow-xl disabled:opacity-30 disabled:cursor-not-allowed"
            aria-label="上一位成員"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>

          {/* 右側切換按鈕 - 只在桌面版顯示 */}
          <button
            onClick={handleNext}
            disabled={isAnimating || memberCount <= 1}
            className="hidden md:block absolute right-0 top-1/2 z-[60] -translate-y-1/2 rounded-full bg-white p-4 text-brand-primary shadow-2xl transition-all hover:scale-110 hover:shadow-xl disabled:opacity-30 disabled:cursor-not-allowed"
            aria-label="下一位成員"
          >
            <ChevronRight className="h-6 w-6" />
          </button>

          <div
            className="relative flex h-full items-center justify-center px-4 md:px-0"
            style={{ transformStyle: "preserve-3d" }}
          >
            {extendedMembers.map((member, index) => {
              const cardStyle = getCardStyle(index);
              const isCurrent = index === currentIndex;

              return (
                <div
                  key={`${member.id}-${index}`}
                  className={`cursor-pointer ${
                    isCurrent ? "relative" : "absolute hidden md:block"
                  } ${
                    isAnimating
                      ? "transition-all duration-500 ease-out"
                      : "transition-none"
                  } md:absolute`}
                  style={{
                    ...cardStyle,
                    transformStyle: "preserve-3d",
                    willChange: "transform, opacity",
                    transition: isAnimating ? "all 0.5s ease-out" : "none",
                  }}
                  onTransitionEnd={handleTransitionEnd}
                  onClick={() => {
                    // 只允許點擊可見卡片切換
                    if (!isAnimating && index !== currentIndex) {
                      setIsAnimating(true);
                      setCurrentIndex(index);
                    }
                  }}
                  onMouseEnter={() => !isAnimating && setHoveredCard(index)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  {/* 卡片主體 - 橫向佈局 */}
                  <div
                    className={`
                    relative h-auto w-full max-w-[calc(100vw-3rem)] rounded-3xl p-4
                    transition-all duration-500 flex flex-col gap-4
                    md:h-[540px] md:w-[680px] md:max-w-none md:p-8 md:flex-row md:gap-6
                    ${
                      isCurrent
                        ? "bg-white shadow-2xl ring-2 ring-brand-primary ring-offset-4"
                        : "bg-white/95 shadow-xl"
                    }
                  `}
                  >
                    {/* 卡片背景裝飾 */}
                    <div className="absolute -right-4 -top-4 h-32 w-32 rounded-full bg-brand-primary/5 blur-3xl" />

                    {/* 左側：頭像區域 */}
                    <div className="relative flex flex-shrink-0 flex-col items-center justify-center pt-4 gap-5">
                      <div
                        className={`
                        relative h-32 w-32 overflow-hidden rounded-full border-4
                        ${
                          isCurrent
                            ? "border-brand-primary"
                            : "border-neutral-200"
                        }
                        transition-all duration-300
                      `}
                      >
                        <Image src={member.avatar} alt={member.name} fill className="object-cover" />
                      </div>

                      {/* 基本資訊 */}
                      <div className="mb-3 text-center">
                        <h3 className="mb-4 text-2xl font-medium text-neutral-900">
                          {member.name}
                        </h3>
                        <p className="mb-4 text-sm text-brand-primary">
                          {member.role}
                        </p>
                        <div className="inline-flex items-center gap-2 rounded-full bg-neutral-100 px-4 py-1">
                          <span className="text-xl font-bold text-brand-primary">
                            {member.yearsExperience}
                          </span>
                          <span className="text-xs text-neutral-300">
                            年經驗
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* 右側：文字資訊 */}
                    <div className="flex flex-col items-center justify-center">
                      {/* 簡介 */}
                      <p className="mb-3 text-sm leading-relaxed text-neutral-300">
                        {member.description}
                      </p>

                      {/* 經歷列表 - 只在當前卡片顯示 */}
                      {isCurrent && (
                        <div className=" space-y-2 opacity-0 animate-fadeIn w-full">
                          {member.experience.map((exp, i) => (
                            <div key={i} className="flex items-start justify-start gap-2">
                              <div className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-brand-primary" />
                              <p className="text-xs leading-relaxed text-neutral-300">
                                {exp}
                              </p>
                            </div>
                          ))}

                          {/* 聯絡資訊 */}
                          <div className="mt-4 flex gap-2">
                            <button className="rounded-full bg-neutral-100 p-2 transition-all hover:bg-brand-primary hover:text-white">
                              <Mail className="h-4 w-4" />
                            </button>
                            <button className="rounded-full bg-neutral-100 p-2 transition-all hover:bg-brand-primary hover:text-white">
                              <Phone className="h-4 w-4" />
                            </button>
                            <button className="rounded-full bg-neutral-100 p-2 transition-all hover:bg-brand-primary hover:text-white">
                              <Linkedin className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 手機版底部箭頭 */}
        <div className="flex md:hidden justify-center gap-6 mt-4">
          <button
            onClick={handlePrev}
            disabled={isAnimating || memberCount <= 1}
            className="rounded-full bg-white p-3 text-brand-primary shadow-lg transition-all active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed"
            aria-label="上一位成員"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={handleNext}
            disabled={isAnimating || memberCount <= 1}
            className="rounded-full bg-white p-3 text-brand-primary shadow-lg transition-all active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed"
            aria-label="下一位成員"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

        {/* 指示點 */}
        <div className="mt-4 md:mt-8 flex justify-center gap-2">
          {teamMembers.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              disabled={isAnimating || memberCount <= 1}
              className={`h-2.5 rounded-full transition-all duration-300 ${
                index === getRealIndex()
                  ? "w-10 bg-brand-primary"
                  : "w-2.5 bg-neutral-200 hover:bg-neutral-300"
              } disabled:cursor-not-allowed`}
              aria-label={`查看 ${teamMembers[index].name}`}
            />
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
        }
        .perspective-2000 {
          perspective: 2000px;
          perspective-origin: center center;
        }
      `}</style>
    </section>
  );
}
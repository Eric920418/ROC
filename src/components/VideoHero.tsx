"use client";

import { useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";

interface VideoHeroData {
  videoUrl: string;
  posterImage: string;
}

export function VideoHero() {
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [data, setData] = useState<VideoHeroData>({
    videoUrl: "/videos/hero.mp4",
    posterImage: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/graphql", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            query: `query { videoHero { videoUrl posterImage } }`,
          }),
        });
        const { data: resData } = await res.json();
        if (resData?.videoHero) {
          setData({
            videoUrl: resData.videoHero.videoUrl || "/videos/hero.mp4",
            posterImage: resData.videoHero.posterImage || "",
          });
        }
      } catch (error) {
        console.error("Failed to fetch videoHero data:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <section className="relative h-screen w-full overflow-hidden">
      {/* 背景影片 */}
      <video
        autoPlay
        muted
        loop
        playsInline
        poster={data.posterImage || undefined}
        onLoadedData={() => setVideoLoaded(true)}
        className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${
          videoLoaded ? "opacity-100" : "opacity-0"
        }`}
      >
        <source src={data.videoUrl} type="video/mp4" />
      </video>

      {/* 影片未載入時的 fallback 背景 */}
      {!videoLoaded && (
        <div className="absolute inset-0 bg-neutral-900" />
      )}

      {/* 輕微遮罩 */}
      <div className="absolute inset-0 bg-black/10" />

      {/* 底部滾動提示 */}
      <div className="absolute bottom-[32px] left-1/2 -translate-x-1/2 z-10 animate-bounce">
        <ChevronDown className="h-[24px] w-[24px] text-white/60" strokeWidth={1.5} />
      </div>

      {/* 底部漸層過渡到白色 */}
      <div className="absolute bottom-0 left-0 right-0 h-[80px] bg-gradient-to-t from-white/20 to-transparent" />
    </section>
  );
}

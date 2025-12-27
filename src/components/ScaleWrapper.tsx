"use client";

import { useEffect, useState, useRef } from "react";

interface ScaleWrapperProps {
  children: React.ReactNode;
  baseWidth?: number;
  minWidth?: number;
}

export function ScaleWrapper({
  children,
  baseWidth = 1920,
  minWidth = 1280,
}: ScaleWrapperProps) {
  const [scale, setScale] = useState(1);
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [contentHeight, setContentHeight] = useState<number | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);

    const updateScale = () => {
      const viewportWidth = window.innerWidth;

      // 手機版不縮放，保持原本的響應式設計
      if (viewportWidth < minWidth) {
        setIsMobile(true);
        setScale(1);
      } else if (viewportWidth >= baseWidth) {
        setIsMobile(false);
        setScale(1);
      } else {
        setIsMobile(false);
        setScale(viewportWidth / baseWidth);
      }
    };

    updateScale();
    window.addEventListener("resize", updateScale);

    return () => window.removeEventListener("resize", updateScale);
  }, [baseWidth, minWidth]);

  // 監測內容高度變化，動態調整容器高度
  useEffect(() => {
    if (!contentRef.current || isMobile) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setContentHeight(entry.contentRect.height);
      }
    });

    resizeObserver.observe(contentRef.current);

    return () => resizeObserver.disconnect();
  }, [isMobile, mounted]);

  // SSR 時先不縮放，避免 hydration mismatch
  if (!mounted) {
    return <>{children}</>;
  }

  // 手機版直接渲染，不套用縮放
  if (isMobile) {
    return <>{children}</>;
  }

  // 計算縮放後的實際高度
  const scaledHeight = contentHeight ? contentHeight * scale : undefined;

  return (
    <div
      style={{
        width: "100%",
        height: scaledHeight ? `${scaledHeight}px` : "auto",
        overflow: "hidden",
      }}
    >
      <div
        ref={contentRef}
        style={{
          width: `${baseWidth}px`,
          transform: `scale(${scale})`,
          transformOrigin: "top left",
        }}
      >
        {children}
      </div>
    </div>
  );
}

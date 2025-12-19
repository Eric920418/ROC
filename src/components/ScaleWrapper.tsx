"use client";

import { useEffect, useState } from "react";

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

  useEffect(() => {
    setMounted(true);

    const updateScale = () => {
      const viewportWidth = window.innerWidth;

      if (viewportWidth >= baseWidth) {
        setScale(1);
      } else if (viewportWidth >= minWidth) {
        setScale(viewportWidth / baseWidth);
      } else {
        setScale(minWidth / baseWidth);
      }
    };

    updateScale();
    window.addEventListener("resize", updateScale);

    return () => window.removeEventListener("resize", updateScale);
  }, [baseWidth, minWidth]);

  // SSR 時先不縮放，避免 hydration mismatch
  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <div
      style={{
        width: "100%",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          width: `${baseWidth}px`,
          transform: `scale(${scale})`,
          transformOrigin: "top left",
          minHeight: scale < 1 ? `calc(100vh / ${scale})` : "100vh",
        }}
      >
        {children}
      </div>
    </div>
  );
}

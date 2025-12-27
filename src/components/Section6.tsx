"use client";

import { useState, useEffect } from "react";
import { Plus, Minus } from "lucide-react";

interface FAQ {
  question: string;
  answer: string;
}

interface Section6Data {
  title: string;
  leftDescription: string;
  faqs: FAQ[];
}

export function Section6() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [sectionData, setSectionData] = useState<Section6Data | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/graphql", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            query: `query { section6 { title leftDescription faqs } }`,
          }),
        });
        const { data } = await res.json();
        if (data?.section6) {
          setSectionData({
            title: data.section6.title,
            leftDescription: data.section6.leftDescription,
            faqs: data.section6.faqs || [],
          });
        }
      } catch (error) {
        console.error("Failed to fetch section6 data:", error);
      }
    };
    fetchData();
  }, []);

  // 資料未載入時不渲染，避免閃爍
  if (!sectionData || sectionData.faqs.length === 0) {
    return null;
  }

  const faqs = sectionData.faqs;

  const handleToggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="w-full bg-white px-4 py-10 md:px-[96px] md:py-12">
      <div className="mx-auto max-w-[1680px]">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_2fr] lg:gap-12">
          {/* 左側：標題與描述 */}
          <div className="space-y-4">
            <h2 className="text-3xl font-light text-neutral-900 md:text-5xl lg:text-6xl">
              {sectionData.title}
            </h2>
            <div className="space-y-4 text-sm leading-relaxed text-neutral-300 md:text-base whitespace-pre-line">
              {sectionData.leftDescription}
            </div>
          </div>

          {/* 右側：FAQ 列表 */}
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="overflow-hidden rounded-2xl bg-white shadow-sm transition-shadow hover:shadow-md"
              >
                {/* 問題標題 */}
                <button
                  onClick={() => handleToggle(index)}
                  className="flex w-full items-center justify-between px-5 py-4 text-left transition-colors hover:bg-neutral-50 md:px-6 md:py-5"
                >
                  <h3 className="pr-4 text-lg font-medium text-neutral-900 md:text-xl">
                    {faq.question}
                  </h3>
                  <div className="flex-shrink-0">
                    {openIndex === index ? (
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-primary text-white transition-transform duration-300">
                        <Minus className="h-5 w-5" />
                      </div>
                    ) : (
                      <div className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-neutral-300 text-neutral-300 transition-all duration-300 hover:border-brand-primary hover:text-brand-primary">
                        <Plus className="h-5 w-5" />
                      </div>
                    )}
                  </div>
                </button>

                {/* 答案內容 */}
                <div
                  className={`overflow-hidden transition-all duration-500 ease-in-out ${
                    openIndex === index
                      ? "max-h-96 opacity-100"
                      : "max-h-0 opacity-0"
                  }`}
                >
                  <div className="border-t border-neutral-100 px-5 pb-4 pt-3 md:px-6 md:pb-5">
                    <p className="whitespace-pre-line text-sm leading-relaxed text-neutral-300 md:text-base">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

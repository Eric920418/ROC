"use client";

import { useState } from "react";
import { Plus, Minus } from "lucide-react";

export function Section6() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: "你怎麼定義「當代設計」？",
      answer:
        "對我來說，當代設計不是一種風格，而是一種態度。\n它關注當下的生活方式、材質的真實性與環境的回應。",
    },
    {
      question: "你的靈感通常來自哪裡？",
      answer:
        "靈感來自日常生活的觀察，旅行中的建築體驗，\n以及與業主深度對話後理解的需求。\n每個空間都有它獨特的故事。",
    },
    {
      question: "你認為好的空間設計，應該具備什麼？",
      answer:
        "好的空間設計應該是功能與美學的平衡，\n能夠回應使用者的需求，同時帶來情感上的共鳴。\n簡潔但不簡單，實用且充滿溫度。",
    },
    {
      question: "你的工作室有什麼理念？",
      answer:
        "我們相信「少即是多」，但這個「少」不是匱乏，\n而是經過深思熟慮後的精煉。\n每個設計決策都應該有其存在的理由。",
    },
    {
      question: "你最想透過設計傳達什麼？",
      answer:
        "我希望透過設計傳達一種生活態度：\n在快速變化的世界中，找到屬於自己的節奏與平靜。\n讓空間成為生活的支持，而非負擔。",
    },
  ];

  const handleToggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="w-full bg-white px-[96px] py-16">
      <div className="mx-auto max-w-[1680px]">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-[1fr_2fr]">
          {/* 左側：標題與描述 */}
          <div className="space-y-8">
            <h2 className="text-6xl font-light text-neutral-900 md:text-7xl lg:text-8xl">
              QA
            </h2>
            <div className="space-y-4 text-sm leading-relaxed text-neutral-300 md:text-base">
              <p>線條簡潔、比例純粹</p>
              <p>當代住宅不唯噩於形</p>
              <p>而讓空間自己說話</p>
              <p className="pt-6">少一分裝飾，多一分真實</p>
            </div>
          </div>

          {/* 右側：FAQ 列表 */}
          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="overflow-hidden rounded-2xl bg-white shadow-sm transition-shadow hover:shadow-md"
              >
                {/* 問題標題 */}
                <button
                  onClick={() => handleToggle(index)}
                  className="flex w-full items-center justify-between p-6 text-left transition-colors hover:bg-neutral-50"
                >
                  <h3 className="pr-4 text-lg font-medium text-neutral-900 md:text-xl">
                    {faq.question}
                  </h3>
                  <div className="flex-shrink-0">
                    {openIndex === index ? (
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-primary text-white transition-transform duration-300">
                        <Minus className="h-5 w-5" />
                      </div>
                    ) : (
                      <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-neutral-300 text-neutral-300 transition-all duration-300 hover:border-brand-primary hover:text-brand-primary">
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
                  <div className="border-t border-neutral-100 px-6 pb-6 pt-4 md:px-8 md:pb-8">
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

"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";

interface GalleryImage {
  src: string;
  alt: string;
}

interface AboutData {
  whoIsTitle: string;
  whoIsDescription: string;
  featuredImage: string;
  headOffice: string;
  foundedYear: string;
  instagramLink: string;
  facebookLink: string;
  founderImage: string;
  foundedDate: string;
  visionTitle: string;
  visionDescription1: string;
  visionDescription2: string;
  quote: string;
  quoteAuthor: string;
  galleryImages: GalleryImage[];
}

const defaultData: AboutData = {
  whoIsTitle: "Who is \n R.collective?",
  whoIsDescription: "R.collective 是一個專注於創新與品質的專業團隊。我們相信透過獨特的設計理念與專業技術，能夠為客戶創造出超越期待的價值。我們的使命是將藝術與功能完美結合，打造出既美觀又實用的解決方案。",
  featuredImage: "",
  headOffice: "Taiwan/Taipei",
  foundedYear: "2024",
  instagramLink: "#",
  facebookLink: "#",
  founderImage: "",
  foundedDate: "2024/01",
  visionTitle: "Our Vision",
  visionDescription1: "我們致力於打造一個開放、創新的平台，讓每一位使用者都能在這裡找到屬於自己的價值。透過專業的技術團隊和對品質的堅持，我們持續為客戶提供最優質的服務。",
  visionDescription2: "R.collective 不僅是一個品牌，更是一種理念的體現。我們相信，真正的成功來自於對細節的關注和對卓越的追求。每一個專案，都是我們展現專業實力的機會。",
  quote: "我們相信，每一個細節都值得被重視。品質不是偶然，而是對卓越的持續追求。這就是 R.collective 的核心價值。",
  quoteAuthor: "R.COLLECTIVE",
  galleryImages: [
    { src: "", alt: "Gallery Image 1" },
    { src: "", alt: "Gallery Image 2" },
    { src: "", alt: "Gallery Image 3" },
  ],
};

export default function AboutPage() {
  const [data, setData] = useState<AboutData>(defaultData);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/graphql", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            query: `query { about { whoIsTitle whoIsDescription featuredImage headOffice foundedYear instagramLink facebookLink founderImage foundedDate visionTitle visionDescription1 visionDescription2 quote quoteAuthor galleryImages } }`,
          }),
        });
        const { data: resData } = await res.json();
        if (resData?.about) {
          setData({ ...defaultData, ...resData.about });
        }
      } catch (error) {
        console.error("Failed to fetch about data:", error);
      }
    };
    fetchData();
  }, []);

  const titleParts = data.whoIsTitle.split('\n');
  const [year, month] = data.foundedDate.split('/');

  return (
    <div className="min-h-screen bg-neutral-100">
      <div className="container mx-auto px-6 pb-12 md:px-12">
        <main className=" space-y-16">
          {/* Section 1: Who is R.collective? */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
            <div className="relative pt-8 md:pt-16">
              <div className="relative inline-block">
                <div className="circle-outline"></div>
                <h2 className="font-montserrat text-5xl md:text-6xl font-bold uppercase tracking-tighter relative z-10">
                  {titleParts.map((part, index) => (
                    <span key={index}>
                      {part}
                      {index < titleParts.length - 1 && <br />}
                    </span>
                  ))}
                </h2>
              </div>
            </div>
            <div className="pt-8 md:pt-16">
              <p className="text-neutral-300 leading-relaxed text-lg">
                {data.whoIsDescription}
              </p>
            </div>
          </section>

          {/* Section 2: Main Image + About Us */}
          <section>
            <div className="mb-6">
              <div className="w-full h-[300px] md:h-[500px] bg-neutral-200 rounded-lg flex items-center justify-center overflow-hidden">
                {data.featuredImage ? (
                  <Image
                    src={data.featuredImage}
                    alt="Featured Image"
                    fill
                    className="object-cover"
                  />
                ) : (
                  <span className="text-neutral-300 text-lg">Featured Image</span>
                )}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 items-end gap-8">
              <div className="space-y-4 md:col-span-1">
                <div>
                  <p className="text-xs uppercase text-neutral-300 tracking-widest">
                    Head Office
                  </p>
                  <p className="font-montserrat text-lg">{data.headOffice}</p>
                </div>
                <div>
                  <p className="text-xs uppercase text-neutral-300 tracking-widest">
                    Founded
                  </p>
                  <p className="font-montserrat text-lg">{data.foundedYear}</p>
                </div>
              </div>
              <div className="md:col-span-2 md:text-center">
                <h3 className="text-brand-primary font-montserrat text-7xl md:text-9xl font-bold lowercase">
                  about us
                </h3>
              </div>
              <div className="flex justify-end items-center gap-4 md:col-span-1">
                <Link
                  href={data.instagramLink}
                  className="w-10 h-10 rounded-full border border-neutral-200 flex items-center justify-center text-neutral-300 hover:bg-neutral-200 hover:text-brand-primary transition-colors"
                >
                  <span className="font-montserrat text-sm">Ig</span>
                </Link>
                <Link
                  href={data.facebookLink}
                  className="w-10 h-10 rounded-full border border-neutral-200 flex items-center justify-center text-neutral-300 hover:bg-neutral-200 hover:text-brand-primary transition-colors"
                >
                  <span className="font-montserrat text-sm">Fb</span>
                </Link>
              </div>
            </div>
          </section>

          <hr className="border-neutral-200" />

          {/* Section 3: The Visionary */}
          <section className="flex gap-12 items-center">
            <div className="space-y-6 text-center md:text-left flex flex-col items-center w-1/2">
              <div className="w-full max-w-sm mx-auto md:mx-0 h-96 bg-neutral-200 rounded-lg flex items-center justify-center overflow-hidden relative">
                {data.founderImage ? (
                  <Image
                    src={data.founderImage}
                    alt="Portrait Image"
                    fill
                    className="object-cover"
                  />
                ) : (
                  <span className="text-neutral-300 text-lg">Portrait Image</span>
                )}
              </div>
              <div className="flex items-baseline justify-center md:justify-start gap-8">
                <p className="text-sm text-neutral-300">Founded in Taiwan</p>
                <p className="font-montserrat text-4xl font-bold">
                  {year}<span className="text-neutral-300">/{month}</span>
                </p>
              </div>
            </div>
            <div className="space-y-8">
              <h4 className="font-montserrat text-3xl font-bold tracking-widest uppercase">
                {data.visionTitle}
              </h4>
              <div className="space-y-6 text-neutral-300 leading-relaxed">
                <p>{data.visionDescription1}</p>
                <p>{data.visionDescription2}</p>
              </div>
            </div>
          </section>

          {/* Section 4: Quote */}
          <section className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
            <div className="md:col-span-1">
              <svg
                className="w-16 h-16 text-brand-primary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.783-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1"
                />
              </svg>
            </div>
            <div className="md:col-span-2">

              <blockquote className="text-lg italic text-neutral-900 mb-4">
                {data.quote}
              </blockquote>
              <cite className="font-montserrat font-bold text-2xl not-italic tracking-widest text-brand-primary">
                {data.quoteAuthor}
              </cite>
            </div>
          </section>

          {/* Section 5: Gallery */}
          <section className="space-y-12">
            <hr className="border-neutral-200" />
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div className="md:col-span-3">
                <div className="w-full h-96 bg-neutral-200 rounded-lg flex items-center justify-center overflow-hidden relative">
                  {data.galleryImages[0]?.src ? (
                    <Image
                      src={data.galleryImages[0].src}
                      alt={data.galleryImages[0].alt || "Gallery Image 1"}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <span className="text-neutral-300 text-lg">Gallery Image 1</span>
                  )}
                </div>
              </div>
              <div className="md:col-span-2 flex flex-col gap-4">
                <div className="w-full h-48 bg-neutral-200 rounded-lg flex items-center justify-center overflow-hidden relative">
                  {data.galleryImages[1]?.src ? (
                    <Image
                      src={data.galleryImages[1].src}
                      alt={data.galleryImages[1].alt || "Gallery Image 2"}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <span className="text-neutral-300 text-lg">Gallery Image 2</span>
                  )}
                </div>
                <div className="w-full h-48 bg-neutral-200 rounded-lg flex items-center justify-center overflow-hidden relative">
                  {data.galleryImages[2]?.src ? (
                    <Image
                      src={data.galleryImages[2].src}
                      alt={data.galleryImages[2].alt || "Gallery Image 3"}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <span className="text-neutral-300 text-lg">Gallery Image 3</span>
                  )}
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>

      {/* Custom styles */}
      <style jsx>{`
        .circle-outline {
          border: 2px solid #1d2088;
          border-radius: 9999px;
          transform: rotate(-15deg);
          position: absolute;
          top: -1rem;
          left: -1rem;
          width: 10rem;
          height: 4.5rem;
        }
      `}</style>
    </div>
  );
}

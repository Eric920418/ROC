"use client";

import Image from "next/image";

export function Section5() {
  const services = [
    {
      id: 1,
      title: "室內設計規劃",
      description: "從概念到實現，打造理想居住空間",
      image: "/service-1.jpg",
    },
    {
      id: 2,
      title: "空間改造服務",
      description: "賦予舊空間新生命，重新定義生活方式",
      image: "/service-2.jpg",
    },
    {
      id: 3,
      title: "家具配置諮詢",
      description: "精選家具，創造和諧的空間美學",
      image: "/service-3.jpg",
    },
    {
      id: 4,
      title: "材質選配建議",
      description: "探索質感與耐用性的完美平衡",
      image: "/service-4.jpg",
    },
    {
      id: 5,
      title: "燈光設計規劃",
      description: "用光影塑造空間氛圍與層次",
      image: "/service-5.jpg",
    },
    {
      id: 6,
      title: "專案全程管理",
      description: "從設計到完工，全方位專業服務",
      image: "/service-6.jpg",
    },
  ];

  return (
    <section className="w-full bg-white px-[96px] py-8">
      <div className="mx-auto max-w-[1680px]">
        {/* 標題 */}
        <h2 className="mb-12 text-5xl  text-brand-primary font-bold md:text-6xl ">
          服務
        </h2>

        {/* 網格布局 */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <div key={service.id} className="group cursor-pointer">
              {/* 圖片容器 */}
              <div className="relative mb-4 aspect-[4/3] overflow-hidden rounded-3xl bg-neutral-100 shadow-md transition-all duration-300 group-hover:-translate-y-2 group-hover:shadow-2xl">
                <Image
                  src={service.image}
                  alt={service.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                {/* 漸層遮罩 - hover 時顯示 */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                {/* hover 時顯示的描述 */}
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <p className="text-sm leading-relaxed">
                    {service.description}
                  </p>
                </div>
              </div>

              {/* 標題 */}
              <div className="space-y-1">
                <h3 className="text-lg font-medium text-neutral-900 transition-colors duration-300 group-hover:text-brand-primary md:text-xl">
                  {service.title}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

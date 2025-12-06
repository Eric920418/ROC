"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { ImageUploader } from "@/components/Admin/ImageUploader";
import { graphqlRequest } from "@/utils/graphqlClient";

interface GalleryImage {
  src: string;
  alt: string;
}

interface AboutData {
  id: string;
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

const QUERY = `
  query {
    about {
      id
      whoIsTitle
      whoIsDescription
      featuredImage
      headOffice
      foundedYear
      instagramLink
      facebookLink
      founderImage
      foundedDate
      visionTitle
      visionDescription1
      visionDescription2
      quote
      quoteAuthor
      galleryImages
    }
  }
`;

const MUTATION = `
  mutation UpdateAbout($input: UpdateAboutInput!) {
    updateAbout(input: $input) {
      id
      whoIsTitle
      whoIsDescription
      featuredImage
      headOffice
      foundedYear
      instagramLink
      facebookLink
      founderImage
      foundedDate
      visionTitle
      visionDescription1
      visionDescription2
      quote
      quoteAuthor
      galleryImages
    }
  }
`;

export function AboutEdit() {
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<AboutData>({
    id: "",
    whoIsTitle: "",
    whoIsDescription: "",
    featuredImage: "",
    headOffice: "",
    foundedYear: "",
    instagramLink: "",
    facebookLink: "",
    founderImage: "",
    foundedDate: "",
    visionTitle: "",
    visionDescription1: "",
    visionDescription2: "",
    quote: "",
    quoteAuthor: "",
    galleryImages: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/graphql", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query: QUERY }),
        });
        const { data: resData, errors } = await res.json();
        if (errors) {
          console.error("GraphQL errors:", errors);
          return;
        }
        if (resData?.about) {
          setData(resData.about);
        }
      } catch (error) {
        console.error("Fetch error:", error);
      }
    };
    fetchData();
  }, []);

  const handleChange = (field: keyof AboutData, value: string) => {
    setData((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = (field: keyof AboutData, imageUrl: string) => {
    setData((prev) => ({ ...prev, [field]: imageUrl }));
  };

  const handleGalleryImageUpload = (index: number, imageUrl: string) => {
    setData((prev) => {
      const newGalleryImages = [...prev.galleryImages];
      if (newGalleryImages[index]) {
        newGalleryImages[index] = { ...newGalleryImages[index], src: imageUrl };
      } else {
        newGalleryImages[index] = { src: imageUrl, alt: `Gallery Image ${index + 1}` };
      }
      return { ...prev, galleryImages: newGalleryImages };
    });
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const { id, ...input } = data;
      const response = await graphqlRequest<{ updateAbout: AboutData }>(
        MUTATION,
        { input },
        session
      );
      if (response.errors) {
        alert("更新失敗：" + JSON.stringify(response.errors));
      } else {
        alert("更新成功！");
      }
    } catch (error) {
      console.error("Update error:", error);
      alert("更新失敗");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-5 rounded-lg flex flex-col items-center">
            <div className="w-12 h-12 border-4 border-t-blue-500 border-gray-200 rounded-full animate-spin mb-3"></div>
            <p className="text-gray-700">資料處理中...</p>
          </div>
        </div>
      )}

      <h1 className="text-2xl font-bold">關於我們頁面編輯</h1>

      {/* Section 1 - Who is R.collective? */}
      <div className="bg-gray-100 p-4 rounded-lg space-y-4">
        <h2 className="font-semibold text-lg">Section 1 - Who is R.collective?</h2>
        <div>
          <label className="block text-sm font-medium mb-1">標題（可用 \n 換行）</label>
          <input
            type="text"
            value={data.whoIsTitle}
            onChange={(e) => handleChange("whoIsTitle", e.target.value)}
            className="w-full px-3 py-2 border rounded-md"
            placeholder="Who is R.collective?"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">描述</label>
          <textarea
            value={data.whoIsDescription}
            onChange={(e) => handleChange("whoIsDescription", e.target.value)}
            className="w-full px-3 py-2 border rounded-md h-24"
          />
        </div>
      </div>

      {/* Section 2 - Featured Image & Info */}
      <div className="bg-gray-100 p-4 rounded-lg space-y-4">
        <h2 className="font-semibold text-lg">Section 2 - 特色圖片與基本資訊</h2>
        <div>
          <label className="block text-sm font-medium mb-1">特色圖片</label>
          {data.featuredImage && (
            <div className="relative w-full h-48 mb-2">
              <Image src={data.featuredImage} alt="特色圖片" fill className="object-cover rounded" />
            </div>
          )}
          <ImageUploader onImageUpload={(res) => handleImageUpload("featuredImage", res.imageUrl)} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">總部位置</label>
            <input
              type="text"
              value={data.headOffice}
              onChange={(e) => handleChange("headOffice", e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
              placeholder="Taiwan/Taipei"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">成立年份</label>
            <input
              type="text"
              value={data.foundedYear}
              onChange={(e) => handleChange("foundedYear", e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
              placeholder="2024"
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Instagram 連結</label>
            <input
              type="text"
              value={data.instagramLink}
              onChange={(e) => handleChange("instagramLink", e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
              placeholder="https://instagram.com/..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Facebook 連結</label>
            <input
              type="text"
              value={data.facebookLink}
              onChange={(e) => handleChange("facebookLink", e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
              placeholder="https://facebook.com/..."
            />
          </div>
        </div>
      </div>

      {/* Section 3 - The Visionary */}
      <div className="bg-gray-100 p-4 rounded-lg space-y-4">
        <h2 className="font-semibold text-lg">Section 3 - 願景與創辦人</h2>
        <div>
          <label className="block text-sm font-medium mb-1">創辦人頭像</label>
          {data.founderImage && (
            <div className="relative w-48 h-64 mb-2">
              <Image src={data.founderImage} alt="創辦人頭像" fill className="object-cover rounded" />
            </div>
          )}
          <ImageUploader onImageUpload={(res) => handleImageUpload("founderImage", res.imageUrl)} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">創立日期</label>
          <input
            type="text"
            value={data.foundedDate}
            onChange={(e) => handleChange("foundedDate", e.target.value)}
            className="w-full px-3 py-2 border rounded-md"
            placeholder="2024/01"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">願景標題</label>
          <input
            type="text"
            value={data.visionTitle}
            onChange={(e) => handleChange("visionTitle", e.target.value)}
            className="w-full px-3 py-2 border rounded-md"
            placeholder="Our Vision"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">願景描述 1</label>
          <textarea
            value={data.visionDescription1}
            onChange={(e) => handleChange("visionDescription1", e.target.value)}
            className="w-full px-3 py-2 border rounded-md h-24"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">願景描述 2</label>
          <textarea
            value={data.visionDescription2}
            onChange={(e) => handleChange("visionDescription2", e.target.value)}
            className="w-full px-3 py-2 border rounded-md h-24"
          />
        </div>
      </div>

      {/* Section 4 - Quote */}
      <div className="bg-gray-100 p-4 rounded-lg space-y-4">
        <h2 className="font-semibold text-lg">Section 4 - 引言</h2>
        <div>
          <label className="block text-sm font-medium mb-1">引言內容</label>
          <textarea
            value={data.quote}
            onChange={(e) => handleChange("quote", e.target.value)}
            className="w-full px-3 py-2 border rounded-md h-24"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">引言作者</label>
          <input
            type="text"
            value={data.quoteAuthor}
            onChange={(e) => handleChange("quoteAuthor", e.target.value)}
            className="w-full px-3 py-2 border rounded-md"
            placeholder="R.COLLECTIVE"
          />
        </div>
      </div>

      {/* Section 5 - Gallery */}
      <div className="bg-gray-100 p-4 rounded-lg space-y-4">
        <h2 className="font-semibold text-lg">Section 5 - 相簿</h2>
        <div className="grid grid-cols-3 gap-4">
          {[0, 1, 2].map((index) => (
            <div key={index}>
              <label className="block text-sm font-medium mb-1">相簿圖片 {index + 1}</label>
              {data.galleryImages[index]?.src && (
                <div className="relative w-full h-32 mb-2">
                  <Image
                    src={data.galleryImages[index].src}
                    alt={data.galleryImages[index].alt || `Gallery Image ${index + 1}`}
                    fill
                    className="object-cover rounded"
                  />
                </div>
              )}
              <ImageUploader
                onImageUpload={(res) => handleGalleryImageUpload(index, res.imageUrl)}
              />
            </div>
          ))}
        </div>
      </div>

      {/* 儲存按鈕 */}
      <button
        onClick={handleSave}
        disabled={isLoading}
        className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:bg-gray-400"
      >
        儲存變更
      </button>
    </div>
  );
}

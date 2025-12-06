"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { ImageUploader } from "@/components/Admin/ImageUploader";
import { graphqlRequest } from "@/utils/graphqlClient";
import { Trash2, Plus } from "lucide-react";

interface SuffixImage {
  src: string;
  alt: string;
  offsetX: number;
  offsetY: number;
}

interface MarqueeData {
  id: string;
  logoImage: string;
  slogan: string;
  suffixImages: SuffixImage[];
}

const QUERY = `
  query {
    marquee {
      id
      logoImage
      slogan
      suffixImages
    }
  }
`;

const MUTATION = `
  mutation UpdateMarquee($input: UpdateMarqueeInput!) {
    updateMarquee(input: $input) {
      id
      logoImage
      slogan
      suffixImages
    }
  }
`;

export function MarqueeEdit() {
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<MarqueeData>({
    id: "",
    logoImage: "",
    slogan: "",
    suffixImages: [],
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
        if (resData?.marquee) {
          setData(resData.marquee);
        }
      } catch (error) {
        console.error("Fetch error:", error);
      }
    };
    fetchData();
  }, []);

  const handleChange = (field: keyof MarqueeData, value: string) => {
    setData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSuffixChange = (index: number, field: keyof SuffixImage, value: string | number) => {
    setData((prev) => {
      const newSuffixImages = [...prev.suffixImages];
      newSuffixImages[index] = { ...newSuffixImages[index], [field]: value };
      return { ...prev, suffixImages: newSuffixImages };
    });
  };

  const addSuffixImage = () => {
    setData((prev) => ({
      ...prev,
      suffixImages: [...prev.suffixImages, { src: "", alt: "", offsetX: 0, offsetY: 0 }],
    }));
  };

  const removeSuffixImage = (index: number) => {
    setData((prev) => ({
      ...prev,
      suffixImages: prev.suffixImages.filter((_, i) => i !== index),
    }));
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const { id, ...input } = data;
      const response = await graphqlRequest<{ updateMarquee: MarqueeData }>(
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

      <h1 className="text-2xl font-bold">品牌輪播編輯</h1>

      {/* Logo 設定 */}
      <div className="bg-gray-100 p-4 rounded-lg space-y-4">
        <h2 className="font-semibold text-lg">Logo 圖片</h2>
        {data.logoImage && (
          <div className="relative w-48 h-16">
            <Image src={data.logoImage} alt="Logo" fill className="object-contain" />
          </div>
        )}
        <ImageUploader onImageUpload={(res) => handleChange("logoImage", res.imageUrl)} />
      </div>

      {/* Slogan */}
      <div className="bg-gray-100 p-4 rounded-lg space-y-4">
        <h2 className="font-semibold text-lg">Slogan</h2>
        <input
          type="text"
          value={data.slogan}
          onChange={(e) => handleChange("slogan", e.target.value)}
          className="w-full px-3 py-2 border rounded-md"
          placeholder="THIS IS MY MOTTO"
        />
      </div>

      {/* 後綴圖片列表 */}
      <div className="bg-gray-100 p-4 rounded-lg space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="font-semibold text-lg">後綴圖片輪播</h2>
          <button
            onClick={addSuffixImage}
            className="flex items-center gap-1 bg-green-600 text-white px-3 py-1 rounded-md hover:bg-green-700"
          >
            <Plus size={16} /> 新增
          </button>
        </div>

        {data.suffixImages.map((img, index) => (
          <div key={index} className="bg-white p-4 rounded-md space-y-3 border">
            <div className="flex justify-between items-center">
              <span className="font-medium">圖片 {index + 1}</span>
              <button
                onClick={() => removeSuffixImage(index)}
                className="text-red-500 hover:text-red-700"
              >
                <Trash2 size={18} />
              </button>
            </div>
            {img.src && (
              <div className="relative w-32 h-16">
                <Image src={img.src} alt={img.alt} fill className="object-contain" />
              </div>
            )}
            <ImageUploader
              onImageUpload={(res) => handleSuffixChange(index, "src", res.imageUrl)}
            />
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block text-xs mb-1">Alt 文字</label>
                <input
                  type="text"
                  value={img.alt}
                  onChange={(e) => handleSuffixChange(index, "alt", e.target.value)}
                  className="w-full px-2 py-1 border rounded text-sm"
                />
              </div>
              <div>
                <label className="block text-xs mb-1">X 偏移</label>
                <input
                  type="number"
                  value={img.offsetX}
                  onChange={(e) => handleSuffixChange(index, "offsetX", parseInt(e.target.value) || 0)}
                  className="w-full px-2 py-1 border rounded text-sm"
                />
              </div>
              <div>
                <label className="block text-xs mb-1">Y 偏移</label>
                <input
                  type="number"
                  value={img.offsetY}
                  onChange={(e) => handleSuffixChange(index, "offsetY", parseInt(e.target.value) || 0)}
                  className="w-full px-2 py-1 border rounded text-sm"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

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

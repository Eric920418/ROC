"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { ImageUploader } from "@/components/Admin/ImageUploader";
import { graphqlRequest } from "@/utils/graphqlClient";

interface Section1Data {
  id: string;
  titleLeft: string;
  titleRight: string;
  tagline: string;
  leftImage: string;
  rightTopText: string;
  rightTopTagline: string;
  rightImage: string;
  bottomTitle: string;
  bottomDescription: string;
}

const QUERY = `
  query {
    section1 {
      id
      titleLeft
      titleRight
      tagline
      leftImage
      rightTopText
      rightTopTagline
      rightImage
      bottomTitle
      bottomDescription
    }
  }
`;

const MUTATION = `
  mutation UpdateSection1($input: UpdateSection1Input!) {
    updateSection1(input: $input) {
      id
      titleLeft
      titleRight
      tagline
      leftImage
      rightTopText
      rightTopTagline
      rightImage
      bottomTitle
      bottomDescription
    }
  }
`;

export function Section1Edit() {
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<Section1Data>({
    id: "",
    titleLeft: "",
    titleRight: "",
    tagline: "",
    leftImage: "",
    rightTopText: "",
    rightTopTagline: "",
    rightImage: "",
    bottomTitle: "",
    bottomDescription: "",
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
        if (resData?.section1) {
          setData(resData.section1);
        }
      } catch (error) {
        console.error("Fetch error:", error);
      }
    };
    fetchData();
  }, []);

  const handleChange = (field: keyof Section1Data, value: string) => {
    setData((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = (field: keyof Section1Data, imageUrl: string) => {
    setData((prev) => ({ ...prev, [field]: imageUrl }));
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const { id, ...input } = data;
      const response = await graphqlRequest<{ updateSection1: Section1Data }>(
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

      <h1 className="text-2xl font-bold">主視覺區編輯</h1>

      {/* 標題區 */}
      <div className="bg-gray-100 p-4 rounded-lg space-y-4">
        <h2 className="font-semibold text-lg">標題設定</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">左側標題</label>
            <input
              type="text"
              value={data.titleLeft}
              onChange={(e) => handleChange("titleLeft", e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
              placeholder="Contemporary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">右側標題</label>
            <input
              type="text"
              value={data.titleRight}
              onChange={(e) => handleChange("titleRight", e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
              placeholder="Design"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">標語</label>
          <input
            type="text"
            value={data.tagline}
            onChange={(e) => handleChange("tagline", e.target.value)}
            className="w-full px-3 py-2 border rounded-md"
            placeholder="當代設計"
          />
        </div>
      </div>

      {/* 左側圖片 */}
      <div className="bg-gray-100 p-4 rounded-lg space-y-4">
        <h2 className="font-semibold text-lg">左側大圖</h2>
        {data.leftImage && (
          <div className="relative w-48 h-32">
            <Image src={data.leftImage} alt="左側圖片" fill className="object-cover rounded" />
          </div>
        )}
        <ImageUploader onImageUpload={(res) => handleImageUpload("leftImage", res.imageUrl)} />
      </div>

      {/* 右側區塊 */}
      <div className="bg-gray-100 p-4 rounded-lg space-y-4">
        <h2 className="font-semibold text-lg">右側區塊</h2>
        <div>
          <label className="block text-sm font-medium mb-1">右上方英文文字</label>
          <input
            type="text"
            value={data.rightTopText}
            onChange={(e) => handleChange("rightTopText", e.target.value)}
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">右上方中文標語</label>
          <input
            type="text"
            value={data.rightTopTagline}
            onChange={(e) => handleChange("rightTopTagline", e.target.value)}
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">右側圖片</label>
          {data.rightImage && (
            <div className="relative w-48 h-32 mb-2">
              <Image src={data.rightImage} alt="右側圖片" fill className="object-cover rounded" />
            </div>
          )}
          <ImageUploader onImageUpload={(res) => handleImageUpload("rightImage", res.imageUrl)} />
        </div>
      </div>

      {/* 底部區塊 */}
      <div className="bg-gray-100 p-4 rounded-lg space-y-4">
        <h2 className="font-semibold text-lg">底部區塊</h2>
        <div>
          <label className="block text-sm font-medium mb-1">底部標題</label>
          <input
            type="text"
            value={data.bottomTitle}
            onChange={(e) => handleChange("bottomTitle", e.target.value)}
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">底部描述（可用 \n 換行）</label>
          <textarea
            value={data.bottomDescription}
            onChange={(e) => handleChange("bottomDescription", e.target.value)}
            className="w-full px-3 py-2 border rounded-md h-24"
          />
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

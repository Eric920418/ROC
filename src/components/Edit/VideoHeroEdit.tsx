"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { ImageUploader } from "@/components/Admin/ImageUploader";
import { graphqlRequest } from "@/utils/graphqlClient";

interface VideoHeroData {
  id: string;
  videoUrl: string;
  posterImage: string;
}

const QUERY = `
  query {
    videoHero {
      id
      videoUrl
      posterImage
    }
  }
`;

const MUTATION = `
  mutation UpdateVideoHero($input: UpdateVideoHeroInput!) {
    updateVideoHero(input: $input) {
      id
      videoUrl
      posterImage
    }
  }
`;

export function VideoHeroEdit() {
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<VideoHeroData>({
    id: "",
    videoUrl: "",
    posterImage: "",
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
        if (resData?.videoHero) {
          setData(resData.videoHero);
        }
      } catch (error) {
        console.error("Fetch error:", error);
      }
    };
    fetchData();
  }, []);

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const { id, ...input } = data;
      await graphqlRequest<{ updateVideoHero: VideoHeroData }>(
        MUTATION,
        { input },
        session
      );
      alert("更新成功！");
    } catch (error) {
      console.error("Update error:", error);
      alert("更新失敗：" + (error instanceof Error ? error.message : "未知錯誤"));
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

      <h1 className="text-2xl font-bold">影片主視覺編輯</h1>

      {/* 影片 URL */}
      <div className="bg-gray-100 p-4 rounded-lg space-y-4">
        <h2 className="font-semibold text-lg">背景影片</h2>
        <div>
          <label className="block text-sm font-medium mb-1">
            影片路徑 / URL
          </label>
          <input
            type="text"
            value={data.videoUrl}
            onChange={(e) => setData((prev) => ({ ...prev, videoUrl: e.target.value }))}
            className="w-full px-3 py-2 border rounded-md"
            placeholder="/videos/hero.mp4 或 https://..."
          />
          <p className="text-xs text-gray-500 mt-1">
            將 MP4 檔案放入 public/videos/ 目錄，填入相對路徑如 /videos/hero.mp4；或填入外部影片 URL
          </p>
        </div>
        {data.videoUrl && (
          <div className="mt-2">
            <p className="text-sm text-gray-600 mb-1">影片預覽：</p>
            <video
              src={data.videoUrl}
              controls
              muted
              className="w-full max-w-lg rounded-md border"
              style={{ maxHeight: "300px" }}
            >
              <source src={data.videoUrl} type="video/mp4" />
            </video>
          </div>
        )}
      </div>

      {/* Poster 圖片 */}
      <div className="bg-gray-100 p-4 rounded-lg space-y-4">
        <h2 className="font-semibold text-lg">Poster 靜態圖（影片載入前顯示）</h2>
        {data.posterImage && (
          <div className="relative w-64 h-40 mb-2">
            <Image
              src={data.posterImage}
              alt="Poster"
              fill
              className="object-cover rounded"
            />
          </div>
        )}
        <ImageUploader
          onImageUpload={(res) => setData((prev) => ({ ...prev, posterImage: res.imageUrl }))}
        />
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

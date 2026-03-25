"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { ImageUploader } from "@/components/Admin/ImageUploader";
import { graphqlRequest } from "@/utils/graphqlClient";
import { Trash2, Plus, GripVertical, ChevronUp, ChevronDown } from "lucide-react";

interface MasonryItem {
  id: string;
  img: string;
  url: string;
  title: string;
  height: number;
  order: number;
}

interface MasonryData {
  id: string;
  sectionTitle: string;
  sectionSubtitle: string;
  items: MasonryItem[];
}

const QUERY = `
  query {
    masonry {
      id
      sectionTitle
      sectionSubtitle
      items
    }
  }
`;

const MUTATION = `
  mutation UpdateMasonry($input: UpdateMasonryGalleryInput!) {
    updateMasonry(input: $input) {
      id
      sectionTitle
      sectionSubtitle
      items
    }
  }
`;

export function MasonryEdit() {
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<MasonryData>({
    id: "",
    sectionTitle: "",
    sectionSubtitle: "",
    items: [],
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
        if (resData?.masonry) {
          const masonry = resData.masonry;
          setData({
            ...masonry,
            items: Array.isArray(masonry.items)
              ? masonry.items.sort((a: MasonryItem, b: MasonryItem) => a.order - b.order)
              : [],
          });
        }
      } catch (error) {
        console.error("Fetch error:", error);
      }
    };
    fetchData();
  }, []);

  const handleItemChange = (index: number, field: keyof MasonryItem, value: string | number) => {
    setData((prev) => {
      const newItems = [...prev.items];
      newItems[index] = { ...newItems[index], [field]: value };
      return { ...prev, items: newItems };
    });
  };

  const addItem = () => {
    const maxOrder = data.items.length > 0 ? Math.max(...data.items.map((i) => i.order)) : 0;
    const newId = String(Date.now());
    setData((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        { id: newId, img: "", url: "#", title: "", height: 500, order: maxOrder + 1 },
      ],
    }));
  };

  const removeItem = (index: number) => {
    setData((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
  };

  const moveItem = (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= data.items.length) return;

    setData((prev) => {
      const newItems = [...prev.items];
      const temp = newItems[index].order;
      newItems[index] = { ...newItems[index], order: newItems[targetIndex].order };
      newItems[targetIndex] = { ...newItems[targetIndex], order: temp };
      // 重新排序
      newItems.sort((a, b) => a.order - b.order);
      return { ...prev, items: newItems };
    });
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const { id, ...input } = data;
      await graphqlRequest<{ updateMasonry: MasonryData }>(
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

      <h1 className="text-2xl font-bold">瀑布流圖片牆編輯</h1>

      {/* 區塊標題設定 */}
      <div className="bg-gray-100 p-4 rounded-lg space-y-4">
        <h2 className="font-semibold text-lg">區塊標題</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">主標題</label>
            <input
              type="text"
              value={data.sectionTitle}
              onChange={(e) => setData((prev) => ({ ...prev, sectionTitle: e.target.value }))}
              className="w-full px-3 py-2 border rounded-md"
              placeholder="Selected Projects"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">副標題</label>
            <input
              type="text"
              value={data.sectionSubtitle}
              onChange={(e) => setData((prev) => ({ ...prev, sectionSubtitle: e.target.value }))}
              className="w-full px-3 py-2 border rounded-md"
              placeholder="Our Works"
            />
          </div>
        </div>
      </div>

      {/* 圖片項目列表 */}
      <div className="bg-gray-100 p-4 rounded-lg space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="font-semibold text-lg">圖片列表（{data.items.length} 張）</h2>
          <button
            onClick={addItem}
            className="flex items-center gap-1 bg-green-600 text-white px-3 py-1 rounded-md hover:bg-green-700"
          >
            <Plus size={16} /> 新增圖片
          </button>
        </div>

        {data.items.map((item, index) => (
          <div key={item.id} className="bg-white p-4 rounded-md border space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <GripVertical size={18} className="text-gray-400" />
                <span className="font-medium text-blue-600">#{index + 1}</span>
                <span className="text-gray-600 text-sm">{item.title || "未命名圖片"}</span>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => moveItem(index, "up")}
                  disabled={index === 0}
                  className="p-1 text-gray-500 hover:text-gray-700 disabled:text-gray-300"
                  title="上移"
                >
                  <ChevronUp size={18} />
                </button>
                <button
                  onClick={() => moveItem(index, "down")}
                  disabled={index === data.items.length - 1}
                  className="p-1 text-gray-500 hover:text-gray-700 disabled:text-gray-300"
                  title="下移"
                >
                  <ChevronDown size={18} />
                </button>
                <button
                  onClick={() => removeItem(index)}
                  className="text-red-500 hover:text-red-700 ml-2"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">標題文字</label>
                <input
                  type="text"
                  value={item.title}
                  onChange={(e) => handleItemChange(index, "title", e.target.value)}
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="項目標題"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">點擊跳轉 URL</label>
                <input
                  type="text"
                  value={item.url}
                  onChange={(e) => handleItemChange(index, "url", e.target.value)}
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="https://... 或 #"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">卡片高度（px）</label>
                <input
                  type="number"
                  value={item.height}
                  onChange={(e) => handleItemChange(index, "height", parseInt(e.target.value) || 400)}
                  className="w-full px-3 py-2 border rounded-md"
                  min={200}
                  max={1000}
                />
                <p className="text-xs text-gray-500 mt-1">建議 300~700，數值越大卡片越高</p>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">排序</label>
                <input
                  type="number"
                  value={item.order}
                  onChange={(e) => handleItemChange(index, "order", parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 border rounded-md"
                  min={0}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">圖片</label>
              {item.img && (
                <div className="relative w-48 h-32 mb-2">
                  <Image src={item.img} alt={item.title || "圖片"} fill className="object-cover rounded" />
                </div>
              )}
              <ImageUploader
                onImageUpload={(res) => handleItemChange(index, "img", res.imageUrl)}
              />
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

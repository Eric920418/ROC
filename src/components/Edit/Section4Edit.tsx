"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { ImageUploader } from "@/components/Admin/ImageUploader";
import { graphqlRequest } from "@/utils/graphqlClient";
import { Trash2, Plus } from "lucide-react";

interface Testimonial {
  title: string;
  description: string;
  image: string;
}

interface Section4Data {
  id: string;
  label: string;
  ctaText: string;
  ctaLink: string;
  testimonials: Testimonial[];
}

const QUERY = `
  query {
    section4 {
      id
      label
      ctaText
      ctaLink
      testimonials
    }
  }
`;

const MUTATION = `
  mutation UpdateSection4($input: UpdateSection4Input!) {
    updateSection4(input: $input) {
      id
      label
      ctaText
      ctaLink
      testimonials
    }
  }
`;

export function Section4Edit() {
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<Section4Data>({
    id: "",
    label: "",
    ctaText: "",
    ctaLink: "",
    testimonials: [],
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
        if (resData?.section4) {
          setData(resData.section4);
        }
      } catch (error) {
        console.error("Fetch error:", error);
      }
    };
    fetchData();
  }, []);

  const handleChange = (field: keyof Section4Data, value: string) => {
    setData((prev) => ({ ...prev, [field]: value }));
  };

  const handleTestimonialChange = (index: number, field: keyof Testimonial, value: string) => {
    setData((prev) => {
      const newTestimonials = [...prev.testimonials];
      newTestimonials[index] = { ...newTestimonials[index], [field]: value };
      return { ...prev, testimonials: newTestimonials };
    });
  };

  const addTestimonial = () => {
    setData((prev) => ({
      ...prev,
      testimonials: [...prev.testimonials, { title: "", description: "", image: "" }],
    }));
  };

  const removeTestimonial = (index: number) => {
    setData((prev) => ({
      ...prev,
      testimonials: prev.testimonials.filter((_, i) => i !== index),
    }));
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const { id, ...input } = data;
      const response = await graphqlRequest<{ updateSection4: Section4Data }>(
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

      <h1 className="text-2xl font-bold">客戶見證編輯</h1>

      {/* 區塊設定 */}
      <div className="bg-gray-100 p-4 rounded-lg space-y-4">
        <h2 className="font-semibold text-lg">區塊設定</h2>
        <div>
          <label className="block text-sm font-medium mb-1">標籤文字</label>
          <input
            type="text"
            value={data.label}
            onChange={(e) => handleChange("label", e.target.value)}
            className="w-full px-3 py-2 border rounded-md"
            placeholder="CLIENT TESTIMONIALS"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">CTA 按鈕文字</label>
            <input
              type="text"
              value={data.ctaText}
              onChange={(e) => handleChange("ctaText", e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
              placeholder="查看更多客戶回饋"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">CTA 連結</label>
            <input
              type="text"
              value={data.ctaLink}
              onChange={(e) => handleChange("ctaLink", e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
              placeholder="#"
            />
          </div>
        </div>
      </div>

      {/* 見證列表 */}
      <div className="bg-gray-100 p-4 rounded-lg space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="font-semibold text-lg">客戶見證列表</h2>
          <button
            onClick={addTestimonial}
            className="flex items-center gap-1 bg-green-600 text-white px-3 py-1 rounded-md hover:bg-green-700"
          >
            <Plus size={16} /> 新增見證
          </button>
        </div>

        {data.testimonials.map((testimonial, index) => (
          <div key={index} className="bg-white p-4 rounded-md border space-y-4">
            <div className="flex justify-between items-center">
              <span className="font-medium">見證 {index + 1}</span>
              <button
                onClick={() => removeTestimonial(index)}
                className="text-red-500 hover:text-red-700"
              >
                <Trash2 size={18} />
              </button>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">標題</label>
              <input
                type="text"
                value={testimonial.title}
                onChange={(e) => handleTestimonialChange(index, "title", e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">描述內容</label>
              <textarea
                value={testimonial.description}
                onChange={(e) => handleTestimonialChange(index, "description", e.target.value)}
                className="w-full px-3 py-2 border rounded-md h-32"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">背景圖片</label>
              {testimonial.image && (
                <div className="relative w-48 h-32 mb-2">
                  <Image src={testimonial.image} alt={testimonial.title} fill className="object-cover rounded" />
                </div>
              )}
              <ImageUploader
                onImageUpload={(res) => handleTestimonialChange(index, "image", res.imageUrl)}
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

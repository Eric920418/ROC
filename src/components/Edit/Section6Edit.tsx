"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { graphqlRequest } from "@/utils/graphqlClient";
import { Trash2, Plus } from "lucide-react";

interface FAQ {
  question: string;
  answer: string;
}

interface Section6Data {
  id: string;
  title: string;
  leftDescription: string;
  faqs: FAQ[];
}

const QUERY = `
  query {
    section6 {
      id
      title
      leftDescription
      faqs
    }
  }
`;

const MUTATION = `
  mutation UpdateSection6($input: UpdateSection6Input!) {
    updateSection6(input: $input) {
      id
      title
      leftDescription
      faqs
    }
  }
`;

export function Section6Edit() {
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<Section6Data>({
    id: "",
    title: "",
    leftDescription: "",
    faqs: [],
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
        if (resData?.section6) {
          setData(resData.section6);
        }
      } catch (error) {
        console.error("Fetch error:", error);
      }
    };
    fetchData();
  }, []);

  const handleChange = (field: keyof Section6Data, value: string) => {
    setData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFAQChange = (index: number, field: keyof FAQ, value: string) => {
    setData((prev) => {
      const newFAQs = [...prev.faqs];
      newFAQs[index] = { ...newFAQs[index], [field]: value };
      return { ...prev, faqs: newFAQs };
    });
  };

  const addFAQ = () => {
    setData((prev) => ({
      ...prev,
      faqs: [...prev.faqs, { question: "", answer: "" }],
    }));
  };

  const removeFAQ = (index: number) => {
    setData((prev) => ({
      ...prev,
      faqs: prev.faqs.filter((_, i) => i !== index),
    }));
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const { id, ...input } = data;
      const response = await graphqlRequest<{ updateSection6: Section6Data }>(
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

      <h1 className="text-2xl font-bold">FAQ 問答編輯</h1>

      {/* 左側設定 */}
      <div className="bg-gray-100 p-4 rounded-lg space-y-4">
        <h2 className="font-semibold text-lg">左側區塊</h2>
        <div>
          <label className="block text-sm font-medium mb-1">標題</label>
          <input
            type="text"
            value={data.title}
            onChange={(e) => handleChange("title", e.target.value)}
            className="w-full px-3 py-2 border rounded-md"
            placeholder="QA"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">描述文字（用 \n 換行）</label>
          <textarea
            value={data.leftDescription}
            onChange={(e) => handleChange("leftDescription", e.target.value)}
            className="w-full px-3 py-2 border rounded-md h-32"
            placeholder="線條簡潔、比例純粹&#10;當代住宅不唯噩於形&#10;而讓空間自己說話"
          />
        </div>
      </div>

      {/* FAQ 列表 */}
      <div className="bg-gray-100 p-4 rounded-lg space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="font-semibold text-lg">FAQ 列表</h2>
          <button
            onClick={addFAQ}
            className="flex items-center gap-1 bg-green-600 text-white px-3 py-1 rounded-md hover:bg-green-700"
          >
            <Plus size={16} /> 新增問答
          </button>
        </div>

        {data.faqs.map((faq, index) => (
          <div key={index} className="bg-white p-4 rounded-md border space-y-4">
            <div className="flex justify-between items-center">
              <span className="font-medium">問答 {index + 1}</span>
              <button
                onClick={() => removeFAQ(index)}
                className="text-red-500 hover:text-red-700"
              >
                <Trash2 size={18} />
              </button>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">問題</label>
              <input
                type="text"
                value={faq.question}
                onChange={(e) => handleFAQChange(index, "question", e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
                placeholder="你怎麼定義「當代設計」？"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">答案（用 \n 換行）</label>
              <textarea
                value={faq.answer}
                onChange={(e) => handleFAQChange(index, "answer", e.target.value)}
                className="w-full px-3 py-2 border rounded-md h-24"
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

"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { graphqlRequest } from "@/utils/graphqlClient";

interface ContactData {
  id: string;
  mainTitle: string;
  backgroundTitle: string;
  description: string;
  email: string;
  phone: string;
  studioName: string;
  studioAddress: string;
  submitButtonText: string;
  successMessage: string;
  errorMessage: string;
}

const QUERY = `
  query {
    contact {
      id
      mainTitle
      backgroundTitle
      description
      email
      phone
      studioName
      studioAddress
      submitButtonText
      successMessage
      errorMessage
    }
  }
`;

const MUTATION = `
  mutation UpdateContact($input: UpdateContactInput!) {
    updateContact(input: $input) {
      id
      mainTitle
      backgroundTitle
      description
      email
      phone
      studioName
      studioAddress
      submitButtonText
      successMessage
      errorMessage
    }
  }
`;

export function ContactEdit() {
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<ContactData>({
    id: "",
    mainTitle: "",
    backgroundTitle: "",
    description: "",
    email: "",
    phone: "",
    studioName: "",
    studioAddress: "",
    submitButtonText: "",
    successMessage: "",
    errorMessage: "",
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
        if (resData?.contact) {
          setData(resData.contact);
        }
      } catch (error) {
        console.error("Fetch error:", error);
      }
    };
    fetchData();
  }, []);

  const handleChange = (field: keyof ContactData, value: string) => {
    setData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const { id, ...input } = data;
      const response = await graphqlRequest<{ updateContact: ContactData }>(
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

      <h1 className="text-2xl font-bold">聯絡我們頁面編輯</h1>

      {/* 標題區 */}
      <div className="bg-gray-100 p-4 rounded-lg space-y-4">
        <h2 className="font-semibold text-lg">標題設定</h2>
        <div>
          <label className="block text-sm font-medium mb-1">主標題（可用 \n 換行）</label>
          <input
            type="text"
            value={data.mainTitle}
            onChange={(e) => handleChange("mainTitle", e.target.value)}
            className="w-full px-3 py-2 border rounded-md"
            placeholder="Contact\nUs"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">背景標題</label>
          <input
            type="text"
            value={data.backgroundTitle}
            onChange={(e) => handleChange("backgroundTitle", e.target.value)}
            className="w-full px-3 py-2 border rounded-md"
            placeholder="Connect"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">描述文字</label>
          <textarea
            value={data.description}
            onChange={(e) => handleChange("description", e.target.value)}
            className="w-full px-3 py-2 border rounded-md h-24"
          />
        </div>
      </div>

      {/* 聯絡資訊 */}
      <div className="bg-gray-100 p-4 rounded-lg space-y-4">
        <h2 className="font-semibold text-lg">聯絡資訊</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              value={data.email}
              onChange={(e) => handleChange("email", e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
              placeholder="contact@rcollective.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">電話</label>
            <input
              type="text"
              value={data.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
              placeholder="+886 2 1234 5678"
            />
          </div>
        </div>
      </div>

      {/* 工作室資訊 */}
      <div className="bg-gray-100 p-4 rounded-lg space-y-4">
        <h2 className="font-semibold text-lg">工作室資訊</h2>
        <div>
          <label className="block text-sm font-medium mb-1">工作室名稱</label>
          <input
            type="text"
            value={data.studioName}
            onChange={(e) => handleChange("studioName", e.target.value)}
            className="w-full px-3 py-2 border rounded-md"
            placeholder="Our Studio"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">工作室地址（可用 \n 換行）</label>
          <textarea
            value={data.studioAddress}
            onChange={(e) => handleChange("studioAddress", e.target.value)}
            className="w-full px-3 py-2 border rounded-md h-24"
          />
        </div>
      </div>

      {/* 表單設定 */}
      <div className="bg-gray-100 p-4 rounded-lg space-y-4">
        <h2 className="font-semibold text-lg">表單設定</h2>
        <div>
          <label className="block text-sm font-medium mb-1">送出按鈕文字</label>
          <input
            type="text"
            value={data.submitButtonText}
            onChange={(e) => handleChange("submitButtonText", e.target.value)}
            className="w-full px-3 py-2 border rounded-md"
            placeholder="Send Message"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">成功訊息</label>
            <input
              type="text"
              value={data.successMessage}
              onChange={(e) => handleChange("successMessage", e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
              placeholder="訊息已成功送出！"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">錯誤訊息</label>
            <input
              type="text"
              value={data.errorMessage}
              onChange={(e) => handleChange("errorMessage", e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
              placeholder="發送失敗，請稍後再試。"
            />
          </div>
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

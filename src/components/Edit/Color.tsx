"use client";
import { useState, useEffect } from "react";
import { gql } from "graphql-tag";
import { useSession } from "next-auth/react";
import { graphqlRequest } from "@/utils/graphqlClient";

// GraphQL 查詢類型定義
interface ColorData {
  color: Array<{
    id: string;
    section1: {
      primary: string;
      secondary: string;
      third: string;
      black: string;
      white: string;
    };
  }>;
}

interface UpdateColorResult {
  updateColor: {
    id: string;
  };
}

const UPDATE_PAGE = gql`
  mutation updateColor($input: UpdateColorInput!) {
    updateColor(input: $input) {
      id
    }
  }
`;

const GET_PAGE = gql`
  query getColor {
    color {
      id
      section1
    }
  }
`;

export const Color = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [editorColor, setEditorColor] = useState({
    editor1: "",
    editor2: "",
    editor3: "",
    editor4: "",
    editor5: "",
  });

  const { data: session } = useSession();

  useEffect(() => {
    fetchData();
  }, []);

  // 使用通用 GraphQL 客戶端獲取數據
  const fetchData = async () => {
    try {
      const data = await graphqlRequest<ColorData>(
        GET_PAGE.loc?.source.body || ""
      );
      if (data?.color && data.color.length > 0) {
        const colorData = data.color[0];
        setEditorColor({
          editor1: colorData.section1?.primary || "",
          editor2: colorData.section1?.secondary || "",
          editor3: colorData.section1?.third || "",
          editor4: colorData.section1?.black || "",
          editor5: colorData.section1?.white || "",
        });
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // 使用通用 GraphQL 客戶端更新數據
  const updateData = async (input: any) => {
    try {
      setIsLoading(true);
      const result = await graphqlRequest<UpdateColorResult>(
        UPDATE_PAGE.loc?.source.body || "",
        { input },
        session
      );
      return result;
    } catch (error) {
      console.error("Error updating data:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditorChange1 = (value: string) => {
    setEditorColor((prev) => ({ ...prev, editor1: value }));
  };

  const handleEditorChange2 = (value: string) => {
    setEditorColor((prev) => ({ ...prev, editor2: value }));
  };

  const handleEditorChange3 = (value: string) => {
    setEditorColor((prev) => ({ ...prev, editor3: value }));
  };

  const handleEditorChange4 = (value: string) => {
    setEditorColor((prev) => ({ ...prev, editor4: value }));
  };

  const handleEditorChange5 = (value: string) => {
    setEditorColor((prev) => ({ ...prev, editor5: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateData({
        section1: {
          primary: editorColor.editor1,
          secondary: editorColor.editor2,
          third: editorColor.editor3,
          black: editorColor.editor4,
          white: editorColor.editor5,
        },
      });
      alert("更新成功！");
    } catch (error) {
      alert(`更新失敗: ${error instanceof Error ? error.message : "未知錯誤"}`);
    }
  };

  return (
    <div className="grid grid-cols-1 gap-6">
      <div className="bg-white p-4 rounded shadow">
        <div className="flex items-center">
          <div
            className={`w-[48px] h-[48px] m-2 rounded-full`}
            style={{ backgroundColor: editorColor.editor1 }}
          ></div>
          <label className="block font-medium mb-2">主色：</label>
        </div>
        <input
          type="text"
          value={editorColor.editor1}
          onChange={(e) => handleEditorChange1(e.target.value)}
          className="w-full p-2 border rounded"
        />
      </div>
      <div className="bg-white p-4 rounded shadow">
        <div className="flex items-center">
          <div
            className={`w-[48px] h-[48px] m-2 rounded-full`}
            style={{ backgroundColor: editorColor.editor2 }}
          ></div>
          <label className="block font-medium mb-2">次色：</label>
        </div>
        <input
          type="text"
          value={editorColor.editor2}
          onChange={(e) => handleEditorChange2(e.target.value)}
          className="w-full p-2 border rounded"
        />
      </div>
      <div className="bg-white p-4 rounded shadow">
        <div className="flex items-center">
          <div
            className={`w-[48px] h-[48px] m-2 rounded-full`}
            style={{ backgroundColor: editorColor.editor3 }}
          ></div>
          <label className="block font-medium mb-2">輔色：</label>
        </div>
        <input
          type="text"
          value={editorColor.editor3}
          onChange={(e) => handleEditorChange3(e.target.value)}
          className="w-full p-2 border rounded"
        />
      </div>
      <div className="bg-white p-4 rounded shadow">
        <div className="flex items-center">
          <div
            className={`w-[48px] h-[48px] m-2 rounded-full`}
            style={{ backgroundColor: editorColor.editor4 }}
          ></div>
          <label className="block font-medium mb-2">黑色：</label>
        </div>
        <input
          type="text"
          value={editorColor.editor4}
          onChange={(e) => handleEditorChange4(e.target.value)}
          className="w-full p-2 border rounded"
        />
      </div>
      <div className="bg-white p-4 rounded shadow">
        <div className="flex items-center">
          <div
            className={`w-[48px] h-[48px] m-2 rounded-full`}
            style={{ backgroundColor: editorColor.editor5 }}
          ></div>
          <label className="block font-medium mb-2">白色：</label>
        </div>
        <input
          type="text"
          value={editorColor.editor5}
          onChange={(e) => handleEditorChange5(e.target.value)}
          className="w-full p-2 border rounded"
        />
      </div>
      <div className="mt-6">
        <button
          onClick={handleSubmit}
          disabled={isLoading}
          className={`bg-green-500 text-white px-4 py-2 rounded ${
            isLoading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {isLoading ? "更新中..." : "更新"}
        </button>
      </div>
    </div>
  );
};

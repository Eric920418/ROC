"use client";
import { gql } from "graphql-tag";
import { useState, useEffect } from "react";
import Image from "next/image";
import { ImageUploader } from "@/components/Admin/ImageUploader";
import { useSession } from "next-auth/react";
import { graphqlRequest } from "@/utils/graphqlClient";
import { updateFavicon } from "@/utils/faviconUpdater";

// 統一 UploadResponse 接口定義，與 ImageUploader 組件一致
interface UploadResponse {
  imageUrl: string;
}

interface UpdateLogoResult {
  updateLogo: {
    section1: {
      image: string;
      favicon: string;
      footer: {
        editor1: string;
        editor2: string;
        editor3: string;
        editor4: string;
      };
    };
  };
  errors: {
    message: string;
  }[];
}

const UPDATE_PAGE = gql`
  mutation UpdateLogo($input: UpdateLogoInput!) {
    updateLogo(input: $input) {
      section1
    }
  }
`;

const query = `
  query logo {
    logo {
      section1
    }
  }
`;

export const Logo = () => {
  const [editorMapImage, setEditorMapImage] = useState("");
  const [editorFavicon, setEditorFavicon] = useState("");
  const [editorFooter, setEditorFooter] = useState({
    editor1: "",
    editor2: "",
    editor3: "",
    editor4: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const { data: session } = useSession();

  // 使用統一的favicon更新函數
  const setFaviconToHead = (faviconUrl: string) => {
    updateFavicon(faviconUrl);
  };

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch("/api/graphql", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });
      const { data } = await res.json();

      setEditorFooter({
        editor1: data.logo[0].section1.footer.editor1,
        editor2: data.logo[0].section1.footer.editor2,
        editor3: data.logo[0].section1.footer.editor3,
        editor4: data.logo[0].section1.footer?.editor4,
      });
      setEditorMapImage(data.logo[0].section1.image);
      
      const faviconUrl = data.logo[0].section1.favicon;
      setEditorFavicon(faviconUrl);
      
      // 頁面載入時立即設置favicon
      if (faviconUrl && faviconUrl.trim() !== "") {
        setFaviconToHead(faviconUrl);
      }
    };

    fetchData();
  }, []);

  const handleEditorChange2 = (id: string, content: string) => {
    setEditorFooter((prev) => ({ ...prev, [id]: content }));
  };

  const handleImageUpload3 = (data: UploadResponse) => {
    setEditorMapImage(data.imageUrl);
  };

  const handleFaviconUpload = (data: UploadResponse) => {
    setEditorFavicon(data.imageUrl);
  };

  const handleUpdate = async () => {
    setIsLoading(true);
    const input = {
      section1: {
        image: editorMapImage,
        favicon: editorFavicon,
        footer: editorFooter,
      },
    };

    try {
      const response = await graphqlRequest<UpdateLogoResult>(
        UPDATE_PAGE.loc?.source.body || "",
        { input },
        session
      );
      if (response.errors) {
        console.error("更新失敗:", JSON.stringify(response.errors, null, 2));
      } else {
        // 更新成功後立即設置新的favicon
        if (editorFavicon && editorFavicon.trim() !== "") {
          setFaviconToHead(editorFavicon);
        }
      }
    } catch (err) {
      console.error("更新失敗:", err);
    } finally {
      alert("更新成功");
      setIsLoading(false);
    }
  };

  return (
    <div>
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-5 rounded-lg flex flex-col items-center">
            <div className="w-12 h-12 border-4 border-t-4 border-t-blue-500 border-gray-200 rounded-full animate-spin mb-3"></div>
            <p className="text-gray-700">資料處理中，請稍候...</p>
          </div>
        </div>
      )}

      <div className="text-32M mb-6">Logo/Footer</div>
      <div className="flex flex-col gap-[16px]">
        <div className="relative bg-gray-200 w-full p-3">
          <div className="text-16M font-bold mb-2">網站Logo</div>
          <div className="overflow-hidden transition-all duration-500 ease-in-out">
            <div className="flex flex-col gap-3 mt-5">
              {editorMapImage && typeof editorMapImage === 'string' && editorMapImage.trim() !== "" && (
                <Image
                  src={editorMapImage}
                  width={200}
                  height={100}
                  alt="現有Logo"
                />
              )}
              <ImageUploader onImageUpload={handleImageUpload3} />
            </div>
          </div>
        </div>

        <div className="relative bg-gray-200 w-full p-3">
          <div className="text-16M font-bold mb-2">
            網站Favicon (建議使用正方形圖片，尺寸32x32或64x64像素)
          </div>
          <div className="overflow-hidden transition-all duration-500 ease-in-out">
            <div className="flex flex-col gap-3 mt-5">
              {editorFavicon && typeof editorFavicon === 'string' && editorFavicon.trim() !== "" && (
                <div className="flex items-center gap-4">
                  <Image
                    src={editorFavicon}
                    width={32}
                    height={32}
                    alt="現有Favicon"
                  />
                  <span className="text-14R">目前Favicon預覽</span>
                </div>
              )}
              <ImageUploader onImageUpload={handleFaviconUpload} />
            </div>
          </div>
        </div>

        <div className="relative bg-gray-200 w-full p-3">
          <div className="text-16M font-bold mb-2">頁尾設定</div>
          <div className="overflow-hidden transition-all duration-500 ease-in-out">
            <div className="flex flex-col gap-3">
              <input
                type="text"
                value={editorFooter.editor1}
                placeholder="Footer"
                onChange={(e) => handleEditorChange2("editor1", e.target.value)}
                className="block w-full rounded-md bg-white px-3.5 py-2 text-base text-gray-900 outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2"
              />
              <input
                type="text"
                value={editorFooter.editor2}
                placeholder="FB"
                onChange={(e) => handleEditorChange2("editor2", e.target.value)}
                className="block w-full rounded-md bg-white px-3.5 py-2 text-base text-gray-900 outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2"
              />
              <input
                type="text"
                value={editorFooter.editor3}
                placeholder="IG"
                onChange={(e) => handleEditorChange2("editor3", e.target.value)}
                className="block w-full rounded-md bg-white px-3.5 py-2 text-base text-gray-900 outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2"
              />
              <input
                type="text"
                value={editorFooter.editor4}
                placeholder="YT"
                onChange={(e) => handleEditorChange2("editor4", e.target.value)}
                className="block w-full rounded-md bg-white px-3.5 py-2 text-base text-gray-900 outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <button
          onClick={handleUpdate}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          更新資料
        </button>
      </div>
    </div>
  );
};

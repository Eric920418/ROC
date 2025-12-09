"use client";

import { gql, useQuery, useMutation } from "@apollo/client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";

const CustomEditor = dynamic(() => import("@/components/CustomEditor"), {
  ssr: false,
  loading: () => <p>編輯器載入中...</p>,
});

const GET_CATEGORIES = gql`
  query GetCategories {
    categories {
      id
      name
      slug
      color
    }
  }
`;

const CREATE_POST = gql`
  mutation CreatePost($input: CreatePostInput!) {
    createPost(input: $input) {
      id
      slug
    }
  }
`;

interface Category {
  id: number;
  name: string;
  slug: string;
  color: string;
}

export function ForumNewPost() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [content, setContent] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [categoryId, setCategoryId] = useState<number>(0);

  const { data, loading: categoriesLoading } = useQuery(GET_CATEGORIES, {
    onCompleted: (data) => {
      if (data.categories?.length > 0 && categoryId === 0) {
        setCategoryId(data.categories[0].id);
      }
    },
  });

  const [createPost, { loading, error }] = useMutation(CREATE_POST, {
    onCompleted: (data) => {
      alert("文章發佈成功！");
      router.push(`/admin/forum-posts`);
    },
    onError: (error) => {
      alert("發佈失敗：" + error.message);
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !slug.trim() || !content.trim()) {
      alert("請填寫所有必填欄位");
      return;
    }

    try {
      await createPost({
        variables: {
          input: {
            title: title.trim(),
            slug: slug.trim(),
            content,
            excerpt: excerpt.trim() || undefined,
            coverImage: coverImage.trim() || undefined,
            categoryId,
          },
        },
      });
    } catch (err) {
      console.error("Failed to create post:", err);
    }
  };

  const generateSlug = () => {
    const baseSlug = title
      .toLowerCase()
      .replace(/[^a-z0-9\u4e00-\u9fa5]+/g, "-")
      .replace(/^-+|-+$/g, "");
    const timestamp = Date.now().toString(36);
    setSlug(`${baseSlug}-${timestamp}`);
  };

  if (categoriesLoading) {
    return <div className="p-4">載入中...</div>;
  }

  const categories: Category[] = data?.categories || [];

  return (
    <div className="max-w-4xl">
      <h1 className="text-3xl font-bold mb-8 text-neutral-900">發佈新文章</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-300 text-red-800 px-6 py-4 rounded-lg">
            <p className="font-semibold">發佈失敗</p>
            <p className="text-sm">{error.message}</p>
          </div>
        )}

        <div>
          <label className="block text-neutral-900 font-semibold mb-2">
            標題 <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="輸入文章標題"
            className="w-full px-4 py-3 rounded-lg border border-neutral-300 bg-white text-neutral-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-neutral-900 font-semibold mb-2">
            URL 別名 <span className="text-red-500">*</span>
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="url-slug-example"
              className="flex-1 px-4 py-3 rounded-lg border border-neutral-300 bg-white text-neutral-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <button
              type="button"
              onClick={generateSlug}
              className="px-6 py-3 bg-neutral-200 text-neutral-900 rounded-lg hover:bg-neutral-300 transition-colors font-semibold"
            >
              自動產生
            </button>
          </div>
          <p className="text-sm text-neutral-500 mt-1">
            用於 URL 網址，建議使用英文小寫字母和連字符
          </p>
        </div>

        <div>
          <label className="block text-neutral-900 font-semibold mb-2">
            分類 <span className="text-red-500">*</span>
          </label>
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(parseInt(e.target.value))}
            className="w-full px-4 py-3 rounded-lg border border-neutral-300 bg-white text-neutral-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-neutral-900 font-semibold mb-2">
            封面圖片 URL
          </label>
          <input
            type="url"
            value={coverImage}
            onChange={(e) => setCoverImage(e.target.value)}
            placeholder="https://example.com/image.jpg"
            className="w-full px-4 py-3 rounded-lg border border-neutral-300 bg-white text-neutral-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {coverImage && (
            <div className="mt-3">
              <img
                src={coverImage}
                alt="封面預覽"
                className="w-full max-w-md h-48 object-cover rounded-lg"
                onError={(e) => {
                  e.currentTarget.src = "";
                  e.currentTarget.alt = "圖片載入失敗";
                }}
              />
            </div>
          )}
        </div>

        <div>
          <label className="block text-neutral-900 font-semibold mb-2">
            摘要
          </label>
          <textarea
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            placeholder="簡短的摘要，用於列表頁展示"
            rows={3}
            className="w-full px-4 py-3 rounded-lg border border-neutral-300 bg-white text-neutral-900 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />
        </div>

        <div>
          <label className="block text-neutral-900 font-semibold mb-2">
            內容 <span className="text-red-500">*</span>
          </label>
          <div className="border border-neutral-300 rounded-lg overflow-hidden">
            <CustomEditor onContentChange={setContent} placeholder="輸入文章內容..." height="400px" />
          </div>
        </div>

        <div className="flex gap-4 pt-6">
          <button
            type="submit"
            disabled={loading}
            className="px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold disabled:opacity-50 text-lg"
          >
            {loading ? "發佈中..." : "發佈文章"}
          </button>
          <button
            type="button"
            onClick={() => router.push("/admin/forum-posts")}
            className="px-8 py-4 bg-neutral-200 text-neutral-900 rounded-lg hover:bg-neutral-300 transition-colors font-semibold text-lg"
          >
            取消
          </button>
        </div>
      </form>
    </div>
  );
}

"use client";

import { gql, useMutation } from "@apollo/client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";

// 动态导入 CKEditor（仅客户端）
const CKEditor = dynamic(() => import("@/components/CKEditor"), {
  ssr: false,
  loading: () => <p>编辑器加载中...</p>,
});

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

export default function NewPostForm({ categories }: { categories: Category[] }) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [content, setContent] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [author, setAuthor] = useState("");
  const [authorEmail, setAuthorEmail] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [categoryId, setCategoryId] = useState<number>(categories[0]?.id || 0);

  const [createPost, { loading, error }] = useMutation(CREATE_POST, {
    onCompleted: (data) => {
      alert("帖子发布成功！");
      router.push(`/forum/${data.createPost.slug}`);
    },
    onError: (error) => {
      alert("发布失败：" + error.message);
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !slug.trim() || !content.trim() || !author.trim()) {
      alert("请填写所有必填字段");
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
            author: author.trim(),
            authorEmail: authorEmail.trim() || undefined,
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

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Error Display */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-300 dark:border-red-700 text-red-800 dark:text-red-300 px-6 py-4 rounded-lg">
          <p className="font-semibold">发布失败</p>
          <p className="text-sm">{error.message}</p>
        </div>
      )}

      {/* Title */}
      <div>
        <label className="block text-neutral-900 dark:text-white font-semibold mb-2">
          标题 <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="输入帖子标题"
          className="w-full px-4 py-3 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-primary"
          required
        />
      </div>

      {/* Slug */}
      <div>
        <label className="block text-neutral-900 dark:text-white font-semibold mb-2">
          URL 别名 <span className="text-red-500">*</span>
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="url-slug-example"
            className="flex-1 px-4 py-3 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-primary"
            required
          />
          <button
            type="button"
            onClick={generateSlug}
            className="px-6 py-3 bg-neutral-200 dark:bg-neutral-700 text-neutral-900 dark:text-white rounded-lg hover:bg-neutral-300 dark:hover:bg-neutral-600 transition-colors font-semibold"
          >
            自动生成
          </button>
        </div>
        <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
          用于 URL 地址，建议使用英文小写字母和连字符
        </p>
      </div>

      {/* Category */}
      <div>
        <label className="block text-neutral-900 dark:text-white font-semibold mb-2">
          分类 <span className="text-red-500">*</span>
        </label>
        <select
          value={categoryId}
          onChange={(e) => setCategoryId(parseInt(e.target.value))}
          className="w-full px-4 py-3 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-primary"
          required
        >
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {/* Cover Image */}
      <div>
        <label className="block text-neutral-900 dark:text-white font-semibold mb-2">
          封面图片 URL
        </label>
        <input
          type="url"
          value={coverImage}
          onChange={(e) => setCoverImage(e.target.value)}
          placeholder="https://example.com/image.jpg"
          className="w-full px-4 py-3 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-primary"
        />
        {coverImage && (
          <div className="mt-3">
            <img
              src={coverImage}
              alt="封面预览"
              className="w-full max-w-md h-48 object-cover rounded-lg"
              onError={(e) => {
                e.currentTarget.src = "";
                e.currentTarget.alt = "图片加载失败";
              }}
            />
          </div>
        )}
      </div>

      {/* Excerpt */}
      <div>
        <label className="block text-neutral-900 dark:text-white font-semibold mb-2">
          摘要
        </label>
        <textarea
          value={excerpt}
          onChange={(e) => setExcerpt(e.target.value)}
          placeholder="简短的摘要，用于列表页展示"
          rows={3}
          className="w-full px-4 py-3 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-primary resize-none"
        />
      </div>

      {/* Content */}
      <div>
        <label className="block text-neutral-900 dark:text-white font-semibold mb-2">
          内容 <span className="text-red-500">*</span>
        </label>
        <div className="border border-neutral-300 dark:border-neutral-600 rounded-lg overflow-hidden">
          <CKEditor value={content} onChange={setContent} />
        </div>
      </div>

      {/* Author Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-neutral-900 dark:text-white font-semibold mb-2">
            作者名称 <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            placeholder="你的名字"
            className="w-full px-4 py-3 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-primary"
            required
          />
        </div>
        <div>
          <label className="block text-neutral-900 dark:text-white font-semibold mb-2">
            作者邮箱（可选）
          </label>
          <input
            type="email"
            value={authorEmail}
            onChange={(e) => setAuthorEmail(e.target.value)}
            placeholder="your@email.com"
            className="w-full px-4 py-3 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-primary"
          />
        </div>
      </div>

      {/* Submit Buttons */}
      <div className="flex gap-4 pt-6">
        <button
          type="submit"
          disabled={loading}
          className="px-8 py-4 bg-brand-primary text-white rounded-lg hover:opacity-90 transition-opacity font-semibold disabled:opacity-50 text-lg"
        >
          {loading ? "发布中..." : "发布帖子"}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="px-8 py-4 bg-neutral-200 dark:bg-neutral-700 text-neutral-900 dark:text-white rounded-lg hover:bg-neutral-300 dark:hover:bg-neutral-600 transition-colors font-semibold text-lg"
        >
          取消
        </button>
      </div>
    </form>
  );
}

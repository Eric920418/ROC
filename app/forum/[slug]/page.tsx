import { gql } from "@apollo/client";
import { getClient } from "@/lib/apolloClient";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Clock, Eye, MessageCircle, Share2 } from "lucide-react";
import CommentSection from "@/components/Forum/CommentSection";

const GET_POST = gql`
  query GetPost($slug: String!) {
    post(slug: $slug) {
      id
      title
      slug
      content
      author
      authorEmail
      coverImage
      views
      isPinned
      isLocked
      createdAt
      updatedAt
      category {
        id
        name
        slug
        color
      }
      commentCount
    }
  }
`;

const INCREMENT_VIEWS = gql`
  mutation IncrementPostViews($id: Int!) {
    incrementPostViews(id: $id) {
      id
      views
    }
  }
`;

export default async function PostPage({
  params,
}: {
  params: { slug: string };
}) {
  const client = getClient();

  // 解碼 URL 編碼的 slug（處理中文標題）
  const decodedSlug = decodeURIComponent(params.slug);

  const { data } = await client.query({
    query: GET_POST,
    variables: { slug: decodedSlug },
  });

  if (!data.post) {
    notFound();
  }

  const post = data.post;

  // 增加瀏覽次數
  try {
    await client.mutate({
      mutation: INCREMENT_VIEWS,
      variables: { id: post.id },
    });
  } catch (error) {
    console.error("Failed to increment views:", error);
  }

  return (
    <div className="min-h-screen bg-white text-sm">
      <div className="container mx-auto px-4 md:px-8 py-6 max-w-4xl">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs text-neutral-500 mb-6">
          <Link href="/" className="hover:text-brand-primary transition-colors">
            首頁
          </Link>
          <span>/</span>
          <Link href="/forum" className="hover:text-brand-primary transition-colors">
            論壇
          </Link>
          <span>/</span>
          <Link
            href={`/forum?category=${post.category.slug}`}
            className="hover:text-brand-primary transition-colors"
          >
            {post.category.name}
          </Link>
          <span>/</span>
          <span className="text-neutral-700 font-medium truncate max-w-[200px]">{post.title}</span>
        </nav>

        {/* Cover Image */}
        {post.coverImage && (
          <div className="relative w-full h-48 md:h-64 rounded-xl overflow-hidden mb-6">
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        {/* Post Header */}
        <header className="mb-6">
          {/* Category & Pinned Badge */}
          <div className="flex items-center gap-2 mb-3">
            <span
              className="text-xs px-2.5 py-1 rounded-full text-white font-medium"
              style={{ backgroundColor: post.category.color }}
            >
              {post.category.name}
            </span>
            {post.isPinned && (
              <span className="text-xs px-2.5 py-1 rounded-full bg-amber-500 text-white font-medium">
                📌 置頂
              </span>
            )}
            {post.isLocked && (
              <span className="text-xs px-2.5 py-1 rounded-full bg-neutral-500 text-white font-medium">
                🔒 已鎖定
              </span>
            )}
          </div>

          {/* Title */}
          <h1 className="text-2xl md:text-3xl font-bold mb-4 text-neutral-900 leading-tight">
            {post.title}
          </h1>

          {/* Meta Info */}
          <div className="flex flex-wrap items-center gap-4 text-neutral-500 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="font-medium text-neutral-700">
                {post.author}
              </span>
            </div>
            {post.createdAt && !isNaN(new Date(post.createdAt).getTime()) && (
              <div className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                <span>{new Date(post.createdAt).toLocaleDateString("zh-TW")}</span>
              </div>
            )}
            <div className="flex items-center gap-1">
              <Eye className="w-3.5 h-3.5" />
              <span>{post.views} 瀏覽</span>
            </div>
            <div className="flex items-center gap-1">
              <MessageCircle className="w-3.5 h-3.5" />
              <span>{post.commentCount} 評論</span>
            </div>
            <button className="flex items-center gap-1 hover:text-brand-primary transition-colors">
              <Share2 className="w-3.5 h-3.5" />
              <span>分享</span>
            </button>
          </div>
        </header>

        {/* Post Content */}
        <article className="prose prose-sm prose-neutral max-w-none mb-10">
          <div
            className="text-neutral-700 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </article>

        {/* Divider */}
        <div className="border-t border-neutral-200 mb-8"></div>

        {/* Comment Section */}
        <CommentSection postId={post.id} isLocked={post.isLocked} />

        {/* Back Button */}
        <div className="mt-10 flex justify-center">
          <Link
            href="/forum"
            className="px-5 py-2 bg-neutral-100 text-neutral-700 rounded-full hover:bg-neutral-200 transition-colors font-medium text-xs"
          >
            ← 返回論壇
          </Link>
        </div>
      </div>
    </div>
  );
}

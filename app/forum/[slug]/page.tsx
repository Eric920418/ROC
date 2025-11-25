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

  const { data } = await client.query({
    query: GET_POST,
    variables: { slug: params.slug },
  });

  if (!data.post) {
    notFound();
  }

  const post = data.post;

  // 增加浏览次数（服务器端）
  try {
    await client.mutate({
      mutation: INCREMENT_VIEWS,
      variables: { id: post.id },
    });
  } catch (error) {
    console.error("Failed to increment views:", error);
  }

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-900">
      <div className="container mx-auto px-6 md:px-12 py-8 max-w-5xl">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400 mb-8">
          <Link href="/" className="hover:text-brand-primary transition-colors">
            首页
          </Link>
          <span>/</span>
          <Link href="/forum" className="hover:text-brand-primary transition-colors">
            论坛
          </Link>
          <span>/</span>
          <Link
            href={`/forum?category=${post.category.slug}`}
            className="hover:text-brand-primary transition-colors"
          >
            {post.category.name}
          </Link>
          <span>/</span>
          <span className="text-neutral-900 dark:text-white">{post.title}</span>
        </nav>

        {/* Cover Image */}
        {post.coverImage && (
          <div className="relative w-full h-96 rounded-2xl overflow-hidden mb-8">
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
        <header className="mb-8">
          {/* Category & Pinned Badge */}
          <div className="flex items-center gap-3 mb-4">
            <span
              className="text-sm px-4 py-1.5 rounded-full text-white font-semibold"
              style={{ backgroundColor: post.category.color }}
            >
              {post.category.name}
            </span>
            {post.isPinned && (
              <span className="text-sm px-4 py-1.5 rounded-full bg-amber-500 text-white font-semibold">
                📌 置顶
              </span>
            )}
            {post.isLocked && (
              <span className="text-sm px-4 py-1.5 rounded-full bg-neutral-500 text-white font-semibold">
                🔒 已锁定
              </span>
            )}
          </div>

          {/* Title */}
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-6 text-neutral-900 dark:text-white">
            {post.title}
          </h1>

          {/* Meta Info */}
          <div className="flex flex-wrap items-center gap-6 text-neutral-600 dark:text-neutral-400">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-neutral-900 dark:text-white">
                {post.author}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>{new Date(post.createdAt).toLocaleDateString("zh-CN")}</span>
            </div>
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4" />
              <span>{post.views} 浏览</span>
            </div>
            <div className="flex items-center gap-2">
              <MessageCircle className="w-4 h-4" />
              <span>{post.commentCount} 评论</span>
            </div>
            <button className="flex items-center gap-2 hover:text-brand-primary transition-colors">
              <Share2 className="w-4 h-4" />
              <span>分享</span>
            </button>
          </div>
        </header>

        {/* Post Content */}
        <article className="prose prose-lg dark:prose-invert max-w-none mb-16">
          <div
            className="text-neutral-700 dark:text-neutral-300 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </article>

        {/* Divider */}
        <div className="border-t border-neutral-200 dark:border-neutral-800 mb-12"></div>

        {/* Comment Section */}
        <CommentSection postId={post.id} isLocked={post.isLocked} />

        {/* Back Button */}
        <div className="mt-16 flex justify-center">
          <Link
            href="/forum"
            className="px-8 py-3 bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors font-semibold"
          >
            ← 返回论坛
          </Link>
        </div>
      </div>
    </div>
  );
}

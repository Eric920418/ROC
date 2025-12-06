import { gql } from "@apollo/client";
import { getClient } from "@/lib/apolloClient";
import Link from "next/link";
import Image from "next/image";

const GET_FORUM_DATA = gql`
  query GetForumData($page: Int, $pageSize: Int, $categoryId: Int) {
    categories {
      id
      name
      slug
      color
      postCount
    }
    posts(page: $page, pageSize: $pageSize, categoryId: $categoryId) {
      posts {
        id
        title
        slug
        excerpt
        coverImage
        author
        views
        commentCount
        createdAt
        category {
          id
          name
          color
        }
      }
      total
      page
      pageSize
      hasMore
    }
  }
`;

interface Post {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  coverImage: string;
  author: string;
  views: number;
  commentCount: number;
  createdAt: string;
  category: { id: number; name: string; color: string };
}

interface Category {
  id: number;
  name: string;
  slug: string;
  color: string;
  postCount: number;
}

export default async function ForumPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; page?: string }>;
}) {
  const client = getClient();
  const params = await searchParams;
  const page = parseInt(params.page || "1");
  const categorySlug = params.category;

  const { data } = await client.query({
    query: GET_FORUM_DATA,
    variables: {
      page,
      pageSize: 10,
    },
  });

  const { categories, posts } = data;
  const currentCategory = categorySlug
    ? categories.find((c: { slug: string }) => c.slug === categorySlug)
    : null;

  const featuredPost: Post | null = posts.posts.length > 0 ? posts.posts[0] : null;
  const remainingPosts: Post[] = posts.posts.slice(1);

  const formatDate = (dateString: string) => {
    if (!dateString) return null;
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return null;
      return date.toLocaleDateString("zh-TW", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-neutral-50 to-white font-sans text-neutral-800 antialiased text-sm">
      <div className="container mx-auto px-4 md:px-8 py-6">
        <main>
          {/* Category Navigation */}
          <section className="mb-6">
            <div className="flex flex-wrap items-center gap-2">
              <Link
                href="/forum"
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-300 ${
                  !currentCategory
                    ? "bg-neutral-900 text-white shadow"
                    : "bg-white/80 backdrop-blur-sm text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 shadow-sm"
                }`}
              >
                全部
              </Link>

              {categories.map((category: Category) => {
                const isActive = currentCategory?.id === category.id;

                return (
                  <Link
                    key={category.id}
                    href={`/forum?category=${category.slug}`}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-300 ${
                      isActive
                        ? "text-white shadow"
                        : "bg-white/80 backdrop-blur-sm text-neutral-600 hover:text-neutral-900 shadow-sm"
                    }`}
                    style={isActive ? { backgroundColor: category.color } : {}}
                  >
                    {category.name}
                    <span className="ml-1 opacity-60">({category.postCount})</span>
                  </Link>
                );
              })}
            </div>
          </section>

          {/* Featured Post */}
          {featuredPost && (
            <section className="mb-8 animate-fadeInUp">
              <div className="relative overflow-hidden rounded-2xl shadow-xl group">
                <div className="relative h-[240px] md:h-[320px]">
                  {featuredPost.coverImage ? (
                    <Image
                      src={featuredPost.coverImage}
                      alt={featuredPost.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      priority
                    />
                  ) : (
                    <div
                      className="w-full h-full"
                      style={{
                        background: `linear-gradient(135deg, ${featuredPost.category.color}40, ${featuredPost.category.color}80)`
                      }}
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-5 md:p-8">
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    <span className="px-2.5 py-1 bg-brand-primary text-white rounded-full text-xs font-medium shadow">
                      精選
                    </span>
                    <span
                      className="px-2.5 py-1 backdrop-blur-md text-white rounded-full text-xs font-medium"
                      style={{ backgroundColor: `${featuredPost.category.color}90` }}
                    >
                      {featuredPost.category.name}
                    </span>
                    {featuredPost.createdAt && formatDate(featuredPost.createdAt) && (
                      <span className="text-white/70 text-xs flex items-center gap-1">
                        <span className="material-icons-outlined text-xs">calendar_today</span>
                        {formatDate(featuredPost.createdAt)}
                      </span>
                    )}
                  </div>

                  <h2 className="text-xl md:text-2xl font-bold text-white mb-2 leading-tight line-clamp-2">
                    {featuredPost.title}
                  </h2>
                  <p className="text-sm text-white/80 mb-4 max-w-2xl line-clamp-2">
                    {featuredPost.excerpt || "探索更多精彩內容..."}
                  </p>

                  <div className="flex items-center gap-4">
                    <Link
                      href={`/forum/${featuredPost.slug}`}
                      className="inline-flex items-center gap-1.5 bg-white text-neutral-900 px-4 py-2 rounded-full text-xs font-semibold hover:bg-neutral-100 transition-all duration-300 shadow-lg hover:scale-105"
                    >
                      <span>閱讀更多</span>
                      <span className="material-icons-outlined text-xs">arrow_forward</span>
                    </Link>
                    <div className="flex items-center gap-3 text-white/60 text-xs">
                      <span className="flex items-center gap-1">
                        <span className="material-icons-outlined text-xs">visibility</span>
                        {featuredPost.views}
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="material-icons-outlined text-xs">chat_bubble</span>
                        {featuredPost.commentCount}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* Posts Grid */}
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
            {remainingPosts.map((post: Post, index: number) => (
              <article
                key={post.id}
                className={`group animate-fadeInUp-delayed ${
                  index % 3 === 1 ? "md:mt-8" : ""
                }`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Cover Image */}
                <Link href={`/forum/${post.slug}`} className="block relative mb-3">
                  <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden shadow group-hover:shadow-lg transition-shadow duration-500">
                    {post.coverImage ? (
                      <Image
                        src={post.coverImage}
                        alt={post.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div
                        className="w-full h-full"
                        style={{
                          background: `linear-gradient(135deg, ${post.category.color}30, ${post.category.color}60)`
                        }}
                      />
                    )}
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    {/* Category Badge */}
                    <div className="absolute top-2.5 left-2.5">
                      <span
                        className="px-2 py-1 backdrop-blur-md text-white text-[10px] font-medium rounded-full shadow"
                        style={{ backgroundColor: `${post.category.color}90` }}
                      >
                        {post.category.name}
                      </span>
                    </div>

                    {/* Hover Actions */}
                    <div className="absolute bottom-2.5 right-2.5 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-1 group-hover:translate-y-0">
                      <span className="w-7 h-7 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-neutral-700 hover:bg-white transition-colors shadow">
                        <span className="material-icons-outlined text-sm">bookmark</span>
                      </span>
                      <span className="w-7 h-7 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-neutral-700 hover:bg-white transition-colors shadow">
                        <span className="material-icons-outlined text-sm">share</span>
                      </span>
                    </div>
                  </div>
                </Link>

                {/* Content */}
                <div>
                  {post.createdAt && formatDate(post.createdAt) && (
                    <p className="text-neutral-400 text-xs mb-1 flex items-center gap-1">
                      <span className="material-icons-outlined text-xs">schedule</span>
                      {formatDate(post.createdAt)}
                    </p>
                  )}
                  <h3 className="text-base font-semibold mb-1.5 text-neutral-900 group-hover:text-brand-primary transition-colors duration-300 line-clamp-2">
                    <Link href={`/forum/${post.slug}`}>
                      {post.title}
                    </Link>
                  </h3>
                  <p className="text-neutral-500 mb-3 leading-relaxed line-clamp-2 text-xs">
                    {post.excerpt || "探索更多精彩內容..."}
                  </p>

                  <div className="flex justify-between items-center pt-2.5 border-t border-neutral-100">
                    <div className="flex items-center gap-3 text-neutral-400 text-xs">
                      <span className="flex items-center gap-0.5">
                        <span className="material-icons-outlined text-xs">visibility</span>
                        {post.views}
                      </span>
                      <span className="flex items-center gap-0.5">
                        <span className="material-icons-outlined text-xs">chat_bubble</span>
                        {post.commentCount}
                      </span>
                    </div>
                    <Link
                      href={`/forum/${post.slug}`}
                      className="text-xs font-medium text-brand-primary hover:opacity-70 transition-opacity flex items-center gap-0.5"
                    >
                      閱讀
                      <span className="material-icons-outlined text-xs">arrow_forward</span>
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </section>

          {/* Empty State */}
          {posts.posts.length === 0 && (
            <div className="text-center py-16">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-neutral-100 flex items-center justify-center">
                <span className="material-icons-outlined text-2xl text-neutral-400">article</span>
              </div>
              <p className="text-neutral-500 text-base mb-1">尚無文章</p>
              <p className="text-neutral-400 text-xs">敬請期待更多精彩內容</p>
            </div>
          )}
        </main>

        {/* Pagination */}
        <footer className="mt-12 md:mt-16">
          <div className="flex justify-between items-center">
            <Link
              href="/"
              className="flex items-center gap-1.5 text-neutral-500 hover:text-neutral-900 transition-colors group text-xs"
            >
              <span className="material-icons-outlined text-sm group-hover:-translate-x-0.5 transition-transform">arrow_back</span>
              <span>首頁</span>
            </Link>

            <div className="flex items-center gap-2 font-mono text-sm">
              <span className="text-neutral-900 font-bold">
                {String(posts.page).padStart(2, "0")}
              </span>
              <span className="text-neutral-300">/</span>
              <span className="text-neutral-400">
                {String(Math.ceil(posts.total / posts.pageSize) || 1).padStart(2, "0")}
              </span>
            </div>

            <div className="flex items-center gap-2">
              {posts.page > 1 ? (
                <Link
                  href={`/forum?page=${posts.page - 1}${categorySlug ? `&category=${categorySlug}` : ""}`}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-neutral-100 text-neutral-700 hover:bg-neutral-200 transition-all text-xs"
                >
                  <span className="material-icons-outlined text-xs">arrow_back</span>
                  <span>上一頁</span>
                </Link>
              ) : (
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-neutral-50 text-neutral-300 cursor-not-allowed text-xs">
                  <span className="material-icons-outlined text-xs">arrow_back</span>
                  <span>上一頁</span>
                </div>
              )}

              {posts.hasMore ? (
                <Link
                  href={`/forum?page=${posts.page + 1}${categorySlug ? `&category=${categorySlug}` : ""}`}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-brand-primary text-white hover:opacity-90 transition-all shadow text-xs"
                >
                  <span>下一頁</span>
                  <span className="material-icons-outlined text-xs">arrow_forward</span>
                </Link>
              ) : (
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-neutral-50 text-neutral-300 cursor-not-allowed text-xs">
                  <span>下一頁</span>
                  <span className="material-icons-outlined text-xs">arrow_forward</span>
                </div>
              )}
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

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
      pageSize: 9,
    },
  });

  const { categories, posts } = data;
  const currentCategory = categorySlug
    ? categories.find((c: { slug: string }) => c.slug === categorySlug)
    : null;

  return (
    <div className="bg-white font-sans text-neutral-800 antialiased">
      <div className="container mx-auto px-6 md:px-12 py-8">
    
        <main>
          {/* Title Section */}
          <section className="mb-6  relative">
            {/* Category Navigation - 参考 Culture 页面的分类样式 */}
            <div className="flex flex-wrap items-center gap-x-6 gap-y-4 md:gap-x-10 relative">
              <Link
                href="/forum"
                className={`font-sans text-lg  transition-transform duration-300 hover:scale-110 ${
                  !currentCategory
                    ? "text-neutral-900 font-semibold"
                    : "text-neutral-600 hover:text-neutral-900"
                }`}
              >
                全部
              </Link>

              {categories.map((category: { id: number; name: string; slug: string }, index: number) => {
                const isActive = currentCategory?.id === category.id;

                // 为不同的分类使用不同的样式（模仿参考设计）
                const styles = [
                  "font-display text-2xl md:text-3xl italic", // Creativity 样式
                  "font-sans text-lg md:text-xl", // Technology 样式
                  "font-sans text-base md:text-lg font-light", // Politics 样式
                  "font-display text-xl md:text-2xl", // Media 样式
                ];
                const styleClass = styles[index % styles.length];

                return (
                  <Link
                    key={category.id}
                    href={`/forum?category=${category.slug}`}
                    className={`${styleClass} transition-transform duration-300 hover:scale-110 ${
                      isActive
                        ? "text-neutral-900 hover:text-brand-primary"
                        : "text-neutral-600 hover:text-neutral-900"
                    }`}
                  >
                    {category.name}
                  </Link>
                );
              })}
            </div>
          </section>

          {/* Posts Grid */}
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16 md:gap-12">
            {posts.posts.map((post: {
              id: number;
              title: string;
              slug: string;
              excerpt: string;
              coverImage: string;
              author: string;
              views: number;
              commentCount: number;
              category: { name: string; color: string };
            }, index: number) => (
              <div
                key={post.id}
                className={`group ${index % 3 === 1 ? 'md:mt-16' : ''}`}
              >
                {/* Cover Image */}
                <div className="relative mb-6">
                  <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden">
                    {post.coverImage ? (
                      <Image
                        src={post.coverImage}
                        alt={post.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-neutral-200 to-neutral-300 dark:from-neutral-800 dark:to-neutral-700" />
                    )}
                  </div>
                  {/* Hover Overlay */}
                  <div
                    className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{ backgroundColor: `${post.category.color}20` }}
                  ></div>
                </div>

                {/* Content */}
                <div className="relative px-2">
                  <h3 className="font-display text-2xl font-bold mb-3 text-neutral-900">
                    {post.title}
                  </h3>
                  <p className="text-neutral-600 mb-6 leading-relaxed">
                    {post.excerpt || "She wants me to download the Musical.ly app on my phone so she can make funny lip-sync videos."}
                  </p>
                  <div className="flex justify-between items-center text-sm font-semibold">
                    <Link
                      href={`/forum/${post.slug}`}
                      className="text-neutral-800 hover:text-brand-primary transition-colors"
                    >
                      Read more
                    </Link>
                    <button className="text-neutral-600 hover:text-brand-primary transition-colors">
                      <span className="material-icons-outlined text-xl">share</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </section>

          {/* Empty State */}
          {posts.posts.length === 0 && (
            <div className="text-center py-24">
              <p className="text-neutral-500 text-xl">
                暂无帖子
              </p>
            </div>
          )}
        </main>

        {/* Footer / Pagination */}
        <footer className="mt-24 md:mt-32">
          <div className="flex justify-between items-center">
            <Link
              href="/"
              className="flex items-center space-x-2 text-neutral-600 hover:text-neutral-900 transition-colors"
            >
              <span className="material-icons-outlined">arrow_back</span>
              <span>Home</span>
            </Link>

            <div className="flex items-center space-x-4 font-mono text-lg">
              <span className="text-neutral-900 font-bold">
                {String(posts.page).padStart(2, "0")}
              </span>
              <div className="w-1.5 h-1.5 bg-neutral-300 rounded-full"></div>
              <span className="text-neutral-400">
                {String(Math.ceil(posts.total / posts.pageSize)).padStart(2, "0")}
              </span>
            </div>

            <div className="flex items-center space-x-6 text-neutral-600">
              {posts.page > 1 ? (
                <Link
                  href={`/forum?page=${posts.page - 1}${categorySlug ? `&category=${categorySlug}` : ""}`}
                  className="flex items-center space-x-2 hover:text-neutral-900 transition-colors"
                >
                  <span className="material-icons-outlined">arrow_back</span>
                  <span>Prev</span>
                </Link>
              ) : (
                <div className="opacity-30 flex items-center space-x-2">
                  <span className="material-icons-outlined">arrow_back</span>
                  <span>Prev</span>
                </div>
              )}

              {posts.hasMore ? (
                <Link
                  href={`/forum?page=${posts.page + 1}${categorySlug ? `&category=${categorySlug}` : ""}`}
                  className="flex items-center space-x-2 text-brand-primary hover:opacity-80 transition-opacity font-bold"
                >
                  <span>Next</span>
                  <span className="material-icons-outlined">arrow_forward</span>
                </Link>
              ) : (
                <div className="opacity-30 flex items-center space-x-2">
                  <span>Next</span>
                  <span className="material-icons-outlined">arrow_forward</span>
                </div>
              )}
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

"use client";

import { gql, useMutation, useQuery } from "@apollo/client";
import { useState } from "react";
import { Trash2, Eye, Lock, Star, Unlock } from "lucide-react";
import Link from "next/link";

const GET_POSTS = gql`
  query GetPosts($page: Int, $pageSize: Int) {
    posts(page: $page, pageSize: $pageSize) {
      posts {
        id
        title
        slug
        author
        views
        isPinned
        isLocked
        createdAt
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

const UPDATE_POST = gql`
  mutation UpdatePost($id: Int!, $input: UpdatePostInput!) {
    updatePost(id: $id, input: $input) {
      id
      isPinned
      isLocked
    }
  }
`;

const DELETE_POST = gql`
  mutation DeletePost($id: Int!) {
    deletePost(id: $id)
  }
`;

interface Post {
  id: number;
  title: string;
  slug: string;
  author: string;
  views: number;
  isPinned: boolean;
  isLocked: boolean;
  createdAt: string;
  commentCount: number;
  category: {
    id: number;
    name: string;
    color: string;
  };
}

export function ForumPosts() {
  const [currentPage, setCurrentPage] = useState(1);

  const { data, loading, refetch } = useQuery(GET_POSTS, {
    variables: { page: currentPage, pageSize: 20 },
  });

  const [updatePost] = useMutation(UPDATE_POST, {
    onCompleted: () => refetch(),
    onError: (error) => alert("操作失敗：" + error.message),
  });

  const [deletePost] = useMutation(DELETE_POST, {
    onCompleted: () => refetch(),
    onError: (error) => alert("刪除失敗：" + error.message),
  });

  const handleTogglePin = (id: number, isPinned: boolean) => {
    updatePost({ variables: { id, input: { isPinned: !isPinned } } });
  };

  const handleToggleLock = (id: number, isLocked: boolean) => {
    updatePost({ variables: { id, input: { isLocked: !isLocked } } });
  };

  const handleDelete = (id: number) => {
    if (confirm("確定要刪除此文章嗎？相關留言也會被刪除！")) {
      deletePost({ variables: { id } });
    }
  };

  const posts: Post[] = data?.posts.posts || [];
  const total = data?.posts.total || 0;
  const hasMore = data?.posts.hasMore || false;

  if (loading) {
    return <div className="text-center py-12">載入中...</div>;
  }

  return (
    <div className="max-w-7xl">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">論壇文章管理</h1>
          <p className="text-neutral-600 dark:text-neutral-400 mt-2">
            共 {total} 篇文章
          </p>
        </div>
        <Link
          href="/forum/new"
          className="px-4 py-2 bg-brand-primary text-white rounded-lg hover:opacity-90"
        >
          新增文章
        </Link>
      </div>

      {/* Posts Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-neutral-100">
            <tr>
              <th className="px-3 py-2 text-left whitespace-nowrap">標題</th>
              <th className="px-3 py-2 text-left whitespace-nowrap">分類</th>
              <th className="px-3 py-2 text-left whitespace-nowrap">作者</th>
              <th className="px-3 py-2 text-left whitespace-nowrap">瀏覽/留言</th>
              <th className="px-3 py-2 text-left whitespace-nowrap">發佈時間</th>
              <th className="px-3 py-2 text-left whitespace-nowrap">狀態</th>
              <th className="px-3 py-2 text-left whitespace-nowrap">操作</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((post) => (
              <tr key={post.id} className="border-t dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-700/50">
                <td className="px-3 py-2 max-w-[200px]">
                  <div className="flex items-center gap-1">
                    {post.isPinned && (
                      <Star className="w-3 h-3 text-amber-500 fill-amber-500 flex-shrink-0" />
                    )}
                    {post.isLocked && (
                      <Lock className="w-3 h-3 text-neutral-500 flex-shrink-0" />
                    )}
                    <Link
                      href={`/forum/${post.slug}`}
                      className="font-medium hover:text-brand-primary truncate"
                      target="_blank"
                      title={post.title}
                    >
                      {post.title}
                    </Link>
                  </div>
                </td>
                <td className="px-3 py-2 whitespace-nowrap">
                  <span
                    className="px-2 py-0.5 rounded-full text-white text-xs"
                    style={{ backgroundColor: post.category.color }}
                  >
                    {post.category.name}
                  </span>
                </td>
                <td className="px-3 py-2 text-neutral-600 dark:text-neutral-400 whitespace-nowrap">
                  {post.author}
                </td>
                <td className="px-3 py-2 text-neutral-600 dark:text-neutral-400 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <span className="flex items-center gap-1">
                      <Eye className="w-3 h-3" />
                      {post.views}
                    </span>
                    <span>{post.commentCount}</span>
                  </div>
                </td>
                <td className="px-3 py-2 text-neutral-600 dark:text-neutral-400 whitespace-nowrap">
                  {new Date(Number(post.createdAt)).toLocaleDateString("zh-TW")}
                </td>
                <td className="px-3 py-2">
                  <div className="flex gap-1">
                    <button
                      onClick={() => handleTogglePin(post.id, post.isPinned)}
                      className={`p-1.5 rounded hover:bg-neutral-100 dark:hover:bg-neutral-600 ${
                        post.isPinned ? "text-amber-500" : "text-neutral-400"
                      }`}
                      title={post.isPinned ? "取消精選" : "設為精選"}
                    >
                      <Star className={`w-3.5 h-3.5 ${post.isPinned ? "fill-amber-500" : ""}`} />
                    </button>
                    <button
                      onClick={() => handleToggleLock(post.id, post.isLocked)}
                      className={`p-1.5 rounded hover:bg-neutral-100 dark:hover:bg-neutral-600 ${
                        post.isLocked ? "text-red-500" : "text-neutral-400"
                      }`}
                      title={post.isLocked ? "解鎖" : "鎖定"}
                    >
                      {post.isLocked ? (
                        <Lock className="w-3.5 h-3.5" />
                      ) : (
                        <Unlock className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </td>
                <td className="px-3 py-2">
                  <button
                    onClick={() => handleDelete(post.id)}
                    className="p-1.5 hover:bg-red-100 dark:hover:bg-red-900/20 text-red-600 rounded"
                    title="刪除"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {posts.length === 0 && (
          <div className="text-center py-12 text-neutral-500">
            尚無文章
          </div>
        )}
      </div>

      {/* Pagination */}
      {total > 0 && (
        <div className="flex justify-center items-center gap-4 mt-8">
          <button
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-neutral-200  rounded-lg disabled:opacity-50"
          >
            上一頁
          </button>
          <span className="text-neutral-600 dark:text-neutral-400">
            第 {currentPage} 頁
          </span>
          <button
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={!hasMore}
            className="px-4 py-2 bg-neutral-200  rounded-lg disabled:opacity-50"
          >
            下一頁
          </button>
        </div>
      )}
    </div>
  );
}

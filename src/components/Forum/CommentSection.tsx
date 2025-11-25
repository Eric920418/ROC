"use client";

import { gql, useMutation, useQuery } from "@apollo/client";
import { useState } from "react";
import { MessageCircle, Send } from "lucide-react";

const GET_COMMENTS = gql`
  query GetComments($postId: Int!) {
    comments(postId: $postId) {
      id
      content
      author
      createdAt
      replies {
        id
        content
        author
        createdAt
      }
    }
  }
`;

const CREATE_COMMENT = gql`
  mutation CreateComment($input: CreateCommentInput!) {
    createComment(input: $input) {
      id
      content
      author
      createdAt
    }
  }
`;

interface Comment {
  id: number;
  content: string;
  author: string;
  createdAt: string;
  replies?: Comment[];
}

export default function CommentSection({
  postId,
  isLocked,
}: {
  postId: number;
  isLocked: boolean;
}) {
  const [author, setAuthor] = useState("");
  const [content, setContent] = useState("");
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [replyContent, setReplyContent] = useState("");

  const { data, loading, refetch } = useQuery(GET_COMMENTS, {
    variables: { postId },
  });

  const [createComment, { loading: creating }] = useMutation(CREATE_COMMENT, {
    onCompleted: () => {
      setAuthor("");
      setContent("");
      setReplyContent("");
      setReplyingTo(null);
      refetch();
    },
    onError: (error) => {
      alert("评论发布失败：" + error.message);
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!author.trim() || !content.trim()) {
      alert("请填写姓名和评论内容");
      return;
    }

    try {
      await createComment({
        variables: {
          input: {
            postId,
            author: author.trim(),
            content: content.trim(),
          },
        },
      });
    } catch (error) {
      console.error("Failed to create comment:", error);
    }
  };

  const handleReply = async (parentId: number) => {
    if (!author.trim() || !replyContent.trim()) {
      alert("请填写姓名和回复内容");
      return;
    }

    try {
      await createComment({
        variables: {
          input: {
            postId,
            parentId,
            author: author.trim(),
            content: replyContent.trim(),
          },
        },
      });
    } catch (error) {
      console.error("Failed to create reply:", error);
    }
  };

  const comments: Comment[] = data?.comments || [];

  return (
    <section className="mb-16">
      <h2 className="text-3xl font-bold mb-8 text-neutral-900 dark:text-white flex items-center gap-3">
        <MessageCircle className="w-8 h-8" />
        评论区 ({comments.length})
      </h2>

      {/* Comment Form */}
      {!isLocked && (
        <form onSubmit={handleSubmit} className="mb-12">
          <div className="bg-neutral-50 dark:bg-neutral-800 rounded-xl p-6">
            <div className="mb-4">
              <input
                type="text"
                placeholder="你的名字"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-primary"
                required
              />
            </div>
            <div className="mb-4">
              <textarea
                placeholder="写下你的评论..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={4}
                className="w-full px-4 py-3 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-primary resize-none"
                required
              />
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={creating}
                className="px-6 py-3 bg-brand-primary text-white rounded-lg hover:opacity-90 transition-opacity font-semibold flex items-center gap-2 disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                {creating ? "发布中..." : "发布评论"}
              </button>
            </div>
          </div>
        </form>
      )}

      {isLocked && (
        <div className="mb-12 bg-neutral-100 dark:bg-neutral-800 rounded-xl p-6 text-center text-neutral-600 dark:text-neutral-400">
          🔒 此帖已锁定，无法发表新评论
        </div>
      )}

      {/* Comments List */}
      <div className="space-y-6">
        {loading && (
          <div className="text-center py-12 text-neutral-500 dark:text-neutral-400">
            加载评论中...
          </div>
        )}

        {!loading && comments.length === 0 && (
          <div className="text-center py-12 text-neutral-500 dark:text-neutral-400">
            暂无评论，来发布第一条评论吧！
          </div>
        )}

        {comments.map((comment) => (
          <div key={comment.id} className="bg-neutral-50 dark:bg-neutral-800 rounded-xl p-6">
            {/* Comment Header */}
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-brand-primary text-white flex items-center justify-center font-bold">
                {comment.author[0].toUpperCase()}
              </div>
              <div>
                <p className="font-semibold text-neutral-900 dark:text-white">
                  {comment.author}
                </p>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">
                  {new Date(comment.createdAt).toLocaleString("zh-CN")}
                </p>
              </div>
            </div>

            {/* Comment Content */}
            <p className="text-neutral-700 dark:text-neutral-300 mb-3 pl-13">
              {comment.content}
            </p>

            {/* Reply Button */}
            {!isLocked && (
              <button
                onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                className="text-sm text-brand-primary hover:underline pl-13"
              >
                {replyingTo === comment.id ? "取消回复" : "回复"}
              </button>
            )}

            {/* Reply Form */}
            {replyingTo === comment.id && (
              <div className="mt-4 pl-13">
                <div className="bg-white dark:bg-neutral-900 rounded-lg p-4">
                  <textarea
                    placeholder="写下你的回复..."
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 mb-3 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-primary resize-none"
                  />
                  <div className="flex gap-2 justify-end">
                    <button
                      onClick={() => setReplyingTo(null)}
                      className="px-4 py-2 bg-neutral-200 dark:bg-neutral-700 text-neutral-900 dark:text-white rounded-lg hover:bg-neutral-300 dark:hover:bg-neutral-600 transition-colors"
                    >
                      取消
                    </button>
                    <button
                      onClick={() => handleReply(comment.id)}
                      disabled={creating}
                      className="px-4 py-2 bg-brand-primary text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
                    >
                      {creating ? "发送中..." : "发送回复"}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Replies */}
            {comment.replies && comment.replies.length > 0 && (
              <div className="mt-4 pl-13 space-y-4">
                {comment.replies.map((reply) => (
                  <div key={reply.id} className="bg-white dark:bg-neutral-900 rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 rounded-full bg-neutral-300 dark:bg-neutral-700 text-neutral-900 dark:text-white flex items-center justify-center font-bold text-sm">
                        {reply.author[0].toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold text-neutral-900 dark:text-white text-sm">
                          {reply.author}
                        </p>
                        <p className="text-xs text-neutral-500 dark:text-neutral-400">
                          {new Date(reply.createdAt).toLocaleString("zh-CN")}
                        </p>
                      </div>
                    </div>
                    <p className="text-neutral-700 dark:text-neutral-300 text-sm pl-11">
                      {reply.content}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

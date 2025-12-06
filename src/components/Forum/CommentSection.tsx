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
      alert("評論發布失敗：" + error.message);
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!author.trim() || !content.trim()) {
      alert("請填寫姓名和評論內容");
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
      alert("請填寫姓名和回覆內容");
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
    <section className="mb-10">
      <h2 className="text-lg font-bold mb-5 text-neutral-900 flex items-center gap-2">
        <MessageCircle className="w-5 h-5" />
        評論區 ({comments.length})
      </h2>

      {/* Comment Form */}
      {!isLocked && (
        <form onSubmit={handleSubmit} className="mb-8">
          <div className="bg-neutral-50 rounded-lg p-4">
            <div className="mb-3">
              <input
                type="text"
                placeholder="你的名字"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-neutral-200 bg-white text-neutral-900 text-xs focus:outline-none focus:ring-2 focus:ring-brand-primary"
                required
              />
            </div>
            <div className="mb-3">
              <textarea
                placeholder="寫下你的評論..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 rounded-lg border border-neutral-200 bg-white text-neutral-900 text-xs focus:outline-none focus:ring-2 focus:ring-brand-primary resize-none"
                required
              />
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={creating}
                className="px-4 py-2 bg-brand-primary text-white rounded-lg hover:opacity-90 transition-opacity font-medium flex items-center gap-1.5 disabled:opacity-50 text-xs"
              >
                <Send className="w-3.5 h-3.5" />
                {creating ? "發布中..." : "發布評論"}
              </button>
            </div>
          </div>
        </form>
      )}

      {isLocked && (
        <div className="mb-8 bg-neutral-100 rounded-lg p-4 text-center text-neutral-600 text-xs">
          🔒 此文章已鎖定，無法發表新評論
        </div>
      )}

      {/* Comments List */}
      <div className="space-y-4">
        {loading && (
          <div className="text-center py-8 text-neutral-500 text-xs">
            載入評論中...
          </div>
        )}

        {!loading && comments.length === 0 && (
          <div className="text-center py-8 text-neutral-500 text-xs">
            尚無評論，來發布第一條評論吧！
          </div>
        )}

        {comments.map((comment) => (
          <div key={comment.id} className="bg-neutral-50 rounded-lg p-4">
            {/* Comment Header */}
            <div className="flex items-center gap-2 mb-2">
              <div className="w-7 h-7 rounded-full bg-brand-primary text-white flex items-center justify-center font-bold text-xs">
                {comment.author[0].toUpperCase()}
              </div>
              <div>
                <p className="font-medium text-neutral-900 text-xs">
                  {comment.author}
                </p>
                <p className="text-[10px] text-neutral-400">
                  {new Date(comment.createdAt).toLocaleString("zh-TW")}
                </p>
              </div>
            </div>

            {/* Comment Content */}
            <p className="text-neutral-700 mb-2 pl-9 text-xs">
              {comment.content}
            </p>

            {/* Reply Button */}
            {!isLocked && (
              <button
                onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                className="text-xs text-brand-primary hover:underline pl-9"
              >
                {replyingTo === comment.id ? "取消回覆" : "回覆"}
              </button>
            )}

            {/* Reply Form */}
            {replyingTo === comment.id && (
              <div className="mt-3 pl-9">
                <div className="bg-white rounded-lg p-3">
                  <textarea
                    placeholder="寫下你的回覆..."
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                    rows={2}
                    className="w-full px-3 py-2 mb-2 rounded-lg border border-neutral-200 bg-neutral-50 text-neutral-900 text-xs focus:outline-none focus:ring-2 focus:ring-brand-primary resize-none"
                  />
                  <div className="flex gap-2 justify-end">
                    <button
                      onClick={() => setReplyingTo(null)}
                      className="px-3 py-1.5 bg-neutral-200 text-neutral-700 rounded-lg hover:bg-neutral-300 transition-colors text-xs"
                    >
                      取消
                    </button>
                    <button
                      onClick={() => handleReply(comment.id)}
                      disabled={creating}
                      className="px-3 py-1.5 bg-brand-primary text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 text-xs"
                    >
                      {creating ? "發送中..." : "發送回覆"}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Replies */}
            {comment.replies && comment.replies.length > 0 && (
              <div className="mt-3 pl-9 space-y-3">
                {comment.replies.map((reply) => (
                  <div key={reply.id} className="bg-white rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-1.5">
                      <div className="w-6 h-6 rounded-full bg-neutral-300 text-neutral-700 flex items-center justify-center font-bold text-[10px]">
                        {reply.author[0].toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium text-neutral-900 text-xs">
                          {reply.author}
                        </p>
                        <p className="text-[10px] text-neutral-400">
                          {new Date(reply.createdAt).toLocaleString("zh-TW")}
                        </p>
                      </div>
                    </div>
                    <p className="text-neutral-700 text-xs pl-8">
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

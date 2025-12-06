"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { graphqlRequest } from "@/utils/graphqlClient";

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

const QUERY = `
  query {
    contactMessages {
      id
      name
      email
      message
      isRead
      createdAt
    }
  }
`;

const MARK_READ_MUTATION = `
  mutation MarkContactMessageRead($id: ID!) {
    markContactMessageRead(id: $id) {
      id
      isRead
    }
  }
`;

const DELETE_MUTATION = `
  mutation DeleteContactMessage($id: ID!) {
    deleteContactMessage(id: $id)
  }
`;

export function ContactMessages() {
  const { data: session } = useSession();
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);

  const fetchMessages = async () => {
    try {
      const res = await fetch("/api/graphql", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: QUERY }),
      });
      const { data, errors } = await res.json();
      if (errors) {
        console.error("GraphQL errors:", errors);
        return;
      }
      if (data?.contactMessages) {
        setMessages(data.contactMessages);
      }
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleMarkRead = async (id: string) => {
    try {
      await graphqlRequest(MARK_READ_MUTATION, { id }, session);
      setMessages((prev) =>
        prev.map((msg) => (msg.id === id ? { ...msg, isRead: true } : msg))
      );
      if (selectedMessage?.id === id) {
        setSelectedMessage((prev) => (prev ? { ...prev, isRead: true } : null));
      }
    } catch (error) {
      console.error("Mark read error:", error);
      alert("操作失敗");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("確定要刪除這則訊息嗎？")) return;

    try {
      await graphqlRequest(DELETE_MUTATION, { id }, session);
      setMessages((prev) => prev.filter((msg) => msg.id !== id));
      if (selectedMessage?.id === id) {
        setSelectedMessage(null);
      }
    } catch (error) {
      console.error("Delete error:", error);
      alert("刪除失敗");
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("zh-TW", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const unreadCount = messages.filter((msg) => !msg.isRead).length;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-12 h-12 border-4 border-t-blue-500 border-gray-200 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">客戶訊息管理</h1>
        <div className="flex items-center gap-4">
          <span className="text-gray-600">
            共 {messages.length} 則訊息
            {unreadCount > 0 && (
              <span className="ml-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs">
                {unreadCount} 則未讀
              </span>
            )}
          </span>
          <button
            onClick={fetchMessages}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-md text-sm"
          >
            重新整理
          </button>
        </div>
      </div>

      {messages.length === 0 ? (
        <div className="bg-gray-50 p-8 rounded-lg text-center text-gray-500">
          目前沒有任何客戶訊息
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 訊息列表 */}
          <div className="space-y-3 max-h-[600px] overflow-y-auto">
            {messages.map((msg) => (
              <div
                key={msg.id}
                onClick={() => {
                  setSelectedMessage(msg);
                  if (!msg.isRead) {
                    handleMarkRead(msg.id);
                  }
                }}
                className={`p-4 rounded-lg border cursor-pointer transition-all ${
                  selectedMessage?.id === msg.id
                    ? "border-blue-500 bg-blue-50"
                    : msg.isRead
                    ? "border-gray-200 bg-white hover:bg-gray-50"
                    : "border-blue-300 bg-blue-50 hover:bg-blue-100"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      {!msg.isRead && (
                        <span className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></span>
                      )}
                      <span className="font-semibold text-gray-900 truncate">
                        {msg.name}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 truncate">{msg.email}</p>
                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                      {msg.message}
                    </p>
                  </div>
                  <span className="text-xs text-gray-400 flex-shrink-0 ml-2">
                    {formatDate(msg.createdAt)}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* 訊息詳情 */}
          <div className="bg-gray-50 rounded-lg p-6">
            {selectedMessage ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold">訊息詳情</h2>
                  <div className="flex gap-2">
                    {!selectedMessage.isRead && (
                      <button
                        onClick={() => handleMarkRead(selectedMessage.id)}
                        className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                      >
                        標記已讀
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(selectedMessage.id)}
                      className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200"
                    >
                      刪除
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="text-sm text-gray-500">寄件人</label>
                    <p className="font-medium">{selectedMessage.name}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Email</label>
                    <p className="font-medium">
                      <a
                        href={`mailto:${selectedMessage.email}`}
                        className="text-blue-600 hover:underline"
                      >
                        {selectedMessage.email}
                      </a>
                    </p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">時間</label>
                    <p className="font-medium">{formatDate(selectedMessage.createdAt)}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">訊息內容</label>
                    <div className="mt-1 p-4 bg-white rounded border whitespace-pre-wrap">
                      {selectedMessage.message}
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <a
                    href={`mailto:${selectedMessage.email}?subject=Re: 來自網站的聯絡訊息`}
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                    回覆此訊息
                  </a>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-64 text-gray-400">
                選擇一則訊息查看詳情
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

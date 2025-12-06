"use client";

import { gql, useMutation, useQuery } from "@apollo/client";
import { useState } from "react";
import { Trash2, Edit2, Plus, Save, X } from "lucide-react";

const GET_CATEGORIES = gql`
  query GetCategories {
    categories {
      id
      name
      slug
      description
      icon
      color
      order
      postCount
    }
  }
`;

const CREATE_CATEGORY = gql`
  mutation CreateCategory($input: CreateCategoryInput!) {
    createCategory(input: $input) {
      id
      name
    }
  }
`;

const UPDATE_CATEGORY = gql`
  mutation UpdateCategory($id: Int!, $input: UpdateCategoryInput!) {
    updateCategory(id: $id, input: $input) {
      id
      name
    }
  }
`;

const DELETE_CATEGORY = gql`
  mutation DeleteCategory($id: Int!) {
    deleteCategory(id: $id)
  }
`;

interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  color: string;
  order: number;
  postCount: number;
}

export function ForumCategories() {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    icon: "",
    color: "#1d2088",
    order: 0,
  });

  const { data, loading, refetch } = useQuery(GET_CATEGORIES);
  const [createCategory] = useMutation(CREATE_CATEGORY, {
    onCompleted: () => {
      refetch();
      setIsCreating(false);
      resetForm();
    },
    onError: (error) => alert("建立失敗：" + error.message),
  });

  const [updateCategory] = useMutation(UPDATE_CATEGORY, {
    onCompleted: () => {
      refetch();
      setEditingId(null);
      resetForm();
    },
    onError: (error) => alert("更新失敗：" + error.message),
  });

  const [deleteCategory] = useMutation(DELETE_CATEGORY, {
    onCompleted: () => refetch(),
    onError: (error) => alert("刪除失敗：" + error.message),
  });

  const resetForm = () => {
    setFormData({
      name: "",
      slug: "",
      description: "",
      icon: "",
      color: "#1d2088",
      order: 0,
    });
  };

  const handleEdit = (category: Category) => {
    setEditingId(category.id);
    setFormData({
      name: category.name,
      slug: category.slug,
      description: category.description || "",
      icon: category.icon || "",
      color: category.color,
      order: category.order,
    });
  };

  const handleSave = () => {
    if (isCreating) {
      createCategory({ variables: { input: formData } });
    } else if (editingId) {
      updateCategory({ variables: { id: editingId, input: formData } });
    }
  };

  const handleDelete = (id: number) => {
    if (confirm("確定要刪除此分類嗎？相關文章也會被刪除！")) {
      deleteCategory({ variables: { id } });
    }
  };

  const categories: Category[] = data?.categories || [];

  if (loading) {
    return <div className="text-center py-12">載入中...</div>;
  }

  return (
    <div className="max-w-6xl">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">論壇分類管理</h1>
        <button
          onClick={() => {
            setIsCreating(true);
            setEditingId(null);
            resetForm();
          }}
          className="px-4 py-2 bg-brand-primary text-white rounded-lg hover:opacity-90 flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          新增分類
        </button>
      </div>

      {/* Create/Edit Form */}
      {(isCreating || editingId) && (
        <div className="bg-neutral-100 dark:bg-neutral-800 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">
            {isCreating ? "新增分類" : "編輯分類"}
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-2 font-semibold">分類名稱 *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg"
                placeholder="例如：技術討論"
              />
            </div>
            <div>
              <label className="block mb-2 font-semibold">URL 別名 *</label>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg"
                placeholder="例如：technology"
              />
            </div>
            <div className="col-span-2">
              <label className="block mb-2 font-semibold">描述</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg"
                rows={3}
                placeholder="分類描述（選填）"
              />
            </div>
            <div>
              <label className="block mb-2 font-semibold">圖示 Emoji</label>
              <input
                type="text"
                value={formData.icon}
                onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg"
                placeholder="例如：💻"
              />
            </div>
            <div>
              <label className="block mb-2 font-semibold">顏色</label>
              <input
                type="color"
                value={formData.color}
                onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                className="w-full h-10 border rounded-lg"
              />
            </div>
            <div>
              <label className="block mb-2 font-semibold">排序</label>
              <input
                type="number"
                value={formData.order}
                onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>
          </div>
          <div className="flex gap-3 mt-6">
            <button
              onClick={handleSave}
              className="px-6 py-2 bg-brand-primary text-white rounded-lg hover:opacity-90 flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              儲存
            </button>
            <button
              onClick={() => {
                setIsCreating(false);
                setEditingId(null);
                resetForm();
              }}
              className="px-6 py-2 bg-neutral-300 text-neutral-900 rounded-lg hover:bg-neutral-400 flex items-center gap-2"
            >
              <X className="w-4 h-4" />
              取消
            </button>
          </div>
        </div>
      )}

      {/* Categories Table */}
      <div className="bg-white dark:bg-neutral-800 rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-neutral-100 dark:bg-neutral-700">
            <tr>
              <th className="px-6 py-3 text-left">圖示</th>
              <th className="px-6 py-3 text-left">名稱</th>
              <th className="px-6 py-3 text-left">URL 別名</th>
              <th className="px-6 py-3 text-left">描述</th>
              <th className="px-6 py-3 text-left">文章數</th>
              <th className="px-6 py-3 text-left">排序</th>
              <th className="px-6 py-3 text-left">操作</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category) => (
              <tr key={category.id} className="border-t dark:border-neutral-700">
                <td className="px-6 py-4">
                  <span className="text-2xl">{category.icon}</span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: category.color }}
                    />
                    <span className="font-semibold">{category.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-neutral-600 dark:text-neutral-400">
                  {category.slug}
                </td>
                <td className="px-6 py-4 text-neutral-600 dark:text-neutral-400 max-w-xs truncate">
                  {category.description || "-"}
                </td>
                <td className="px-6 py-4">{category.postCount}</td>
                <td className="px-6 py-4">{category.order}</td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(category)}
                      className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(category.id)}
                      className="p-2 hover:bg-red-100 dark:hover:bg-red-900/20 text-red-600 rounded"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {categories.length === 0 && (
          <div className="text-center py-12 text-neutral-500">
            尚無分類，點擊上方按鈕建立第一個分類
          </div>
        )}
      </div>
    </div>
  );
}

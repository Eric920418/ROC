"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { ImageUploader } from "@/components/Admin/ImageUploader";
import { graphqlRequest } from "@/utils/graphqlClient";
import { Trash2, Plus, GripVertical } from "lucide-react";

interface Project {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
}

interface Section3Data {
  id: string;
  navTitle: string;
  navSubtitle: string;
  projects: Project[];
}

const QUERY = `
  query {
    section3 {
      id
      navTitle
      navSubtitle
      projects
    }
  }
`;

const MUTATION = `
  mutation UpdateSection3($input: UpdateSection3Input!) {
    updateSection3(input: $input) {
      id
      navTitle
      navSubtitle
      projects
    }
  }
`;

export function Section3Edit() {
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<Section3Data>({
    id: "",
    navTitle: "",
    navSubtitle: "",
    projects: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/graphql", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query: QUERY }),
        });
        const { data: resData, errors } = await res.json();
        if (errors) {
          console.error("GraphQL errors:", errors);
          return;
        }
        if (resData?.section3) {
          setData(resData.section3);
        }
      } catch (error) {
        console.error("Fetch error:", error);
      }
    };
    fetchData();
  }, []);

  const handleChange = (field: keyof Section3Data, value: string) => {
    setData((prev) => ({ ...prev, [field]: value }));
  };

  const handleProjectChange = (index: number, field: keyof Project, value: string) => {
    setData((prev) => {
      const newProjects = [...prev.projects];
      newProjects[index] = { ...newProjects[index], [field]: value };
      return { ...prev, projects: newProjects };
    });
  };

  const addProject = () => {
    const newId = String(data.projects.length + 1).padStart(2, "0");
    setData((prev) => ({
      ...prev,
      projects: [
        ...prev.projects,
        { id: newId, title: "", subtitle: "", description: "", image: "" },
      ],
    }));
  };

  const removeProject = (index: number) => {
    setData((prev) => ({
      ...prev,
      projects: prev.projects.filter((_, i) => i !== index),
    }));
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const { id, ...input } = data;
      const response = await graphqlRequest<{ updateSection3: Section3Data }>(
        MUTATION,
        { input },
        session
      );
      if (response.errors) {
        alert("更新失敗：" + JSON.stringify(response.errors));
      } else {
        alert("更新成功！");
      }
    } catch (error) {
      console.error("Update error:", error);
      alert("更新失敗");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-5 rounded-lg flex flex-col items-center">
            <div className="w-12 h-12 border-4 border-t-blue-500 border-gray-200 rounded-full animate-spin mb-3"></div>
            <p className="text-gray-700">資料處理中...</p>
          </div>
        </div>
      )}

      <h1 className="text-2xl font-bold">空間探索編輯</h1>

      {/* 導航標題 */}
      <div className="bg-gray-100 p-4 rounded-lg space-y-4">
        <h2 className="font-semibold text-lg">導航標題</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">主標題</label>
            <input
              type="text"
              value={data.navTitle}
              onChange={(e) => handleChange("navTitle", e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
              placeholder="空間探索"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">副標題</label>
            <input
              type="text"
              value={data.navSubtitle}
              onChange={(e) => handleChange("navSubtitle", e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
              placeholder="SPACE EXPLORATION"
            />
          </div>
        </div>
      </div>

      {/* 項目列表 */}
      <div className="bg-gray-100 p-4 rounded-lg space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="font-semibold text-lg">項目列表</h2>
          <button
            onClick={addProject}
            className="flex items-center gap-1 bg-green-600 text-white px-3 py-1 rounded-md hover:bg-green-700"
          >
            <Plus size={16} /> 新增項目
          </button>
        </div>

        {data.projects.map((project, index) => (
          <div key={index} className="bg-white p-4 rounded-md border space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <GripVertical size={18} className="text-gray-400" />
                <span className="font-medium text-blue-600">{project.id}</span>
                <span className="text-gray-600">{project.title || "未命名項目"}</span>
              </div>
              <button
                onClick={() => removeProject(index)}
                className="text-red-500 hover:text-red-700"
              >
                <Trash2 size={18} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">編號</label>
                <input
                  type="text"
                  value={project.id}
                  onChange={(e) => handleProjectChange(index, "id", e.target.value)}
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="01"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">標題</label>
                <input
                  type="text"
                  value={project.title}
                  onChange={(e) => handleProjectChange(index, "title", e.target.value)}
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">副標題</label>
              <input
                type="text"
                value={project.subtitle}
                onChange={(e) => handleProjectChange(index, "subtitle", e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">描述</label>
              <textarea
                value={project.description}
                onChange={(e) => handleProjectChange(index, "description", e.target.value)}
                className="w-full px-3 py-2 border rounded-md h-24"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">背景圖片</label>
              {project.image && (
                <div className="relative w-48 h-32 mb-2">
                  <Image src={project.image} alt={project.title} fill className="object-cover rounded" />
                </div>
              )}
              <ImageUploader
                onImageUpload={(res) => handleProjectChange(index, "image", res.imageUrl)}
              />
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={handleSave}
        disabled={isLoading}
        className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:bg-gray-400"
      >
        儲存變更
      </button>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { ImageUploader } from "@/components/Admin/ImageUploader";
import { graphqlRequest } from "@/utils/graphqlClient";
import { Trash2, Plus, ChevronDown, ChevronUp } from "lucide-react";

interface Contact {
  email: string;
  phone: string;
  linkedin: string;
}

interface TeamMember {
  id: number;
  name: string;
  role: string;
  yearsExperience: string;
  avatar: string;
  description: string;
  experience: string[];
  contact: Contact;
}

interface Section2Data {
  id: string;
  title: string;
  subtitle: string;
  members: TeamMember[];
}

const QUERY = `
  query {
    section2 {
      id
      title
      subtitle
      members
    }
  }
`;

const MUTATION = `
  mutation UpdateSection2($input: UpdateSection2Input!) {
    updateSection2(input: $input) {
      id
      title
      subtitle
      members
    }
  }
`;

export function Section2Edit() {
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [expandedMember, setExpandedMember] = useState<number | null>(0);
  const [data, setData] = useState<Section2Data>({
    id: "",
    title: "",
    subtitle: "",
    members: [],
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
        if (resData?.section2) {
          setData(resData.section2);
        }
      } catch (error) {
        console.error("Fetch error:", error);
      }
    };
    fetchData();
  }, []);

  const handleChange = (field: keyof Section2Data, value: string) => {
    setData((prev) => ({ ...prev, [field]: value }));
  };

  const handleMemberChange = (index: number, field: keyof TeamMember, value: unknown) => {
    setData((prev) => {
      const newMembers = [...prev.members];
      newMembers[index] = { ...newMembers[index], [field]: value };
      return { ...prev, members: newMembers };
    });
  };

  const handleContactChange = (memberIndex: number, field: keyof Contact, value: string) => {
    setData((prev) => {
      const newMembers = [...prev.members];
      newMembers[memberIndex] = {
        ...newMembers[memberIndex],
        contact: { ...newMembers[memberIndex].contact, [field]: value },
      };
      return { ...prev, members: newMembers };
    });
  };

  const handleExperienceChange = (memberIndex: number, expIndex: number, value: string) => {
    setData((prev) => {
      const newMembers = [...prev.members];
      const newExperience = [...newMembers[memberIndex].experience];
      newExperience[expIndex] = value;
      newMembers[memberIndex] = { ...newMembers[memberIndex], experience: newExperience };
      return { ...prev, members: newMembers };
    });
  };

  const addExperience = (memberIndex: number) => {
    setData((prev) => {
      const newMembers = [...prev.members];
      newMembers[memberIndex] = {
        ...newMembers[memberIndex],
        experience: [...newMembers[memberIndex].experience, ""],
      };
      return { ...prev, members: newMembers };
    });
  };

  const removeExperience = (memberIndex: number, expIndex: number) => {
    setData((prev) => {
      const newMembers = [...prev.members];
      newMembers[memberIndex] = {
        ...newMembers[memberIndex],
        experience: newMembers[memberIndex].experience.filter((_, i) => i !== expIndex),
      };
      return { ...prev, members: newMembers };
    });
  };

  const addMember = () => {
    setData((prev) => ({
      ...prev,
      members: [
        ...prev.members,
        {
          id: Date.now(),
          name: "",
          role: "",
          yearsExperience: "",
          avatar: "",
          description: "",
          experience: [],
          contact: { email: "", phone: "", linkedin: "" },
        },
      ],
    }));
    setExpandedMember(data.members.length);
  };

  const removeMember = (index: number) => {
    setData((prev) => ({
      ...prev,
      members: prev.members.filter((_, i) => i !== index),
    }));
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const { id, ...input } = data;
      const response = await graphqlRequest<{ updateSection2: Section2Data }>(
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

      <h1 className="text-2xl font-bold">團隊成員編輯</h1>

      {/* 區塊標題 */}
      <div className="bg-gray-100 p-4 rounded-lg space-y-4">
        <h2 className="font-semibold text-lg">區塊標題</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">主標題</label>
            <input
              type="text"
              value={data.title}
              onChange={(e) => handleChange("title", e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">副標題</label>
            <input
              type="text"
              value={data.subtitle}
              onChange={(e) => handleChange("subtitle", e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>
        </div>
      </div>

      {/* 團隊成員列表 */}
      <div className="bg-gray-100 p-4 rounded-lg space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="font-semibold text-lg">團隊成員</h2>
          <button
            onClick={addMember}
            className="flex items-center gap-1 bg-green-600 text-white px-3 py-1 rounded-md hover:bg-green-700"
          >
            <Plus size={16} /> 新增成員
          </button>
        </div>

        {data.members.map((member, memberIndex) => (
          <div key={member.id} className="bg-white rounded-md border overflow-hidden">
            <div
              className="flex justify-between items-center p-4 cursor-pointer hover:bg-gray-50"
              onClick={() => setExpandedMember(expandedMember === memberIndex ? null : memberIndex)}
            >
              <div className="flex items-center gap-3">
                {member.avatar && (
                  <div className="relative w-10 h-10 rounded-full overflow-hidden">
                    <Image src={member.avatar} alt={member.name} fill className="object-cover" />
                  </div>
                )}
                <div>
                  <span className="font-medium">{member.name || "未命名成員"}</span>
                  <span className="text-gray-500 text-sm ml-2">{member.role}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeMember(memberIndex);
                  }}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 size={18} />
                </button>
                {expandedMember === memberIndex ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </div>
            </div>

            {expandedMember === memberIndex && (
              <div className="p-4 border-t space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">姓名</label>
                    <input
                      type="text"
                      value={member.name}
                      onChange={(e) => handleMemberChange(memberIndex, "name", e.target.value)}
                      className="w-full px-3 py-2 border rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">職位</label>
                    <input
                      type="text"
                      value={member.role}
                      onChange={(e) => handleMemberChange(memberIndex, "role", e.target.value)}
                      className="w-full px-3 py-2 border rounded-md"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">年資</label>
                  <input
                    type="text"
                    value={member.yearsExperience}
                    onChange={(e) => handleMemberChange(memberIndex, "yearsExperience", e.target.value)}
                    className="w-full px-3 py-2 border rounded-md"
                    placeholder="例如：18+"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">頭像</label>
                  {member.avatar && (
                    <div className="relative w-24 h-24 rounded-full overflow-hidden mb-2">
                      <Image src={member.avatar} alt={member.name} fill className="object-cover" />
                    </div>
                  )}
                  <ImageUploader
                    onImageUpload={(res) => handleMemberChange(memberIndex, "avatar", res.imageUrl)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">簡介</label>
                  <textarea
                    value={member.description}
                    onChange={(e) => handleMemberChange(memberIndex, "description", e.target.value)}
                    className="w-full px-3 py-2 border rounded-md h-24"
                  />
                </div>

                {/* 經歷列表 */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-medium">經歷列表</label>
                    <button
                      onClick={() => addExperience(memberIndex)}
                      className="text-blue-600 hover:text-blue-800 text-sm"
                    >
                      + 新增經歷
                    </button>
                  </div>
                  {member.experience.map((exp, expIndex) => (
                    <div key={expIndex} className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={exp}
                        onChange={(e) => handleExperienceChange(memberIndex, expIndex, e.target.value)}
                        className="flex-1 px-3 py-2 border rounded-md text-sm"
                      />
                      <button
                        onClick={() => removeExperience(memberIndex, expIndex)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>

                {/* 聯絡資訊 */}
                <div>
                  <label className="block text-sm font-medium mb-2">聯絡資訊</label>
                  <div className="grid grid-cols-3 gap-2">
                    <input
                      type="email"
                      value={member.contact?.email || ""}
                      onChange={(e) => handleContactChange(memberIndex, "email", e.target.value)}
                      className="px-3 py-2 border rounded-md text-sm"
                      placeholder="Email"
                    />
                    <input
                      type="text"
                      value={member.contact?.phone || ""}
                      onChange={(e) => handleContactChange(memberIndex, "phone", e.target.value)}
                      className="px-3 py-2 border rounded-md text-sm"
                      placeholder="電話"
                    />
                    <input
                      type="text"
                      value={member.contact?.linkedin || ""}
                      onChange={(e) => handleContactChange(memberIndex, "linkedin", e.target.value)}
                      className="px-3 py-2 border rounded-md text-sm"
                      placeholder="LinkedIn"
                    />
                  </div>
                </div>
              </div>
            )}
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

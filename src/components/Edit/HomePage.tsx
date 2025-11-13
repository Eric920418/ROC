"use client";
import { gql } from "graphql-tag";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { ImageUploader } from "@/components/Admin/ImageUploader";
import dynamic from "next/dynamic";
import { useSession } from "next-auth/react";
import { graphqlRequest } from "@/utils/graphqlClient";

const CustomEditor = dynamic(() => import("@/components/CustomEditor"), {
  ssr: false,
});

// 修改後的 GraphQL Mutation，符合後端 schema 定義
const UPDATE_PAGE = gql`
  mutation UpdateHomePage($input: UpdateHomePageInput!) {
    updateHomePage(input: $input) {
      section1
      section2
      section3
      section4
      section5
      section6
    }
  }
`;

const query = `
  query homePage {
    homePage {
      section1
      section2
      section3
      section4
      section5
      section6 
    }
  }
`;

// 統一 UploadResponse 接口定義，與 ImageUploader 組件一致
interface UploadResponse {
  imageUrl: string;
}

// 新增卡片類型定義
interface HomePageCardType {
  year: string;
  date: string;
  content: string;
}

interface UpdateHomePageResult {
  updateHomePage: {
    section1: {
      title: {
        left: string;
        right: string;
      };
      content: string;

      subTitle: string[];
      location: string;
      image: string;
      toggle: boolean;
    };
    section2: {
      cards: {
        year: string;
        date: string;
        content: string;
      }[];
    };
    section3: {
      times: {
        time1: string;
        time6: string;
        time7: string;
        time8: string;
        meeting: string;
        dinner: string;
      };
    };
    section4: {
      manualDownloadUrl: string;
      images: string;
    };
    section5: {
      videoUrl: string;
    };
    section6: {
      organizers: {
        name: string;
      }[];
    };
  };
  errors: {
    message: string;
  }[];
}

export const HomePage = () => {
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [toggle, setToggle] = useState(false);
  // 各區塊狀態定義
  const [isOpen1, setIsOpen1] = useState(false);
  const [height1, setHeight1] = useState(0);
  const contentRef1 = useRef<HTMLDivElement>(null);

  const [isOpen2, setIsOpen2] = useState(false);
  const [height2, setHeight2] = useState(0);
  const contentRef2 = useRef<HTMLDivElement>(null);

  const [isOpen3, setIsOpen3] = useState(false);
  const [height3, setHeight3] = useState(0);
  const contentRef3 = useRef<HTMLDivElement>(null);

  const [isOpen4, setIsOpen4] = useState(false);
  const [height4, setHeight4] = useState(0);
  const contentRef4 = useRef<HTMLDivElement>(null);

  const [isOpen5, setIsOpen5] = useState(false);
  const [height5, setHeight5] = useState(0);
  const contentRef5 = useRef<HTMLDivElement>(null);

  const [isOpen6, setIsOpen6] = useState(false);
  const [height6, setHeight6] = useState(0);
  const contentRef6 = useRef<HTMLDivElement>(null);

  //資料
  const [editorContents, setEditorContents] = useState({
    editor1: "",
    editor2: "",
    editor3: "",
    editor4: "",
    editor5: "",
    editor6: "",
    editor7: "",
    editor8: "",
    editor9: "",
    editor10: "",
  });
  // 為狀態數組添加正確的類型定義
  const [editorCards, setEditorCards] = useState<HomePageCardType[]>([]);
  // const [uploadImage, setUploadImage] = useState();
  const [uploadImage2, setUploadImage2] = useState<string | null>(null);
  const [editorTimes, setEditorTimes] = useState({
    editor1: "",

    editor6: "",
    editor7: "",
    editor8: "",
    editor9: "",
    editor10: "",
  });
  const [editorURL, serEditorURL] = useState<string>("");
  const [editorVideoURL, serEditorVideoURL] = useState({
    video1: "",
    year: "",
  });
  const [editorOrganizers, serEditorOrganizers] = useState({
    editor1: "",
    editor2: "",
    editor3: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch("/api/graphql", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });
      const { data } = await res.json();

      if (data?.homePage[0]) {
        setEditorContents({
          editor1: data.homePage[0].section1.title.left || "",
          editor2: data.homePage[0].section1.title.right || "",
          editor3: data.homePage[0].section1.content || "",
          editor4: data.homePage[0].section1?.subTitle?.[0] || "",
          editor5: data.homePage[0].section1?.subTitle?.[1] || "",
          editor6: data.homePage[0].section1?.subTitle?.[2],
          editor7: data.homePage[0].section1?.subTitle?.[3],
          editor8: data.homePage[0].section1.location || "",
          editor9: data.homePage[0].section1.image,
          editor10: data.homePage[0].section1.toggle,
        });

        setToggle(data.homePage[0].section1.toggle)

        setEditorCards(data.homePage[0].section2?.cards || []);

        setEditorTimes({
          editor1: data.homePage[0].section3?.times?.time1 || "",

          editor6: data.homePage[0].section3?.times?.time6 || "",
          editor7: data.homePage[0].section3?.times?.time7 || "",
          editor8: data.homePage[0].section3?.times?.time8 || "",
          editor9: data.homePage[0].section3?.times?.meeting || "",
          editor10: data.homePage[0].section3?.times?.dinner || "",
        });

        // setUploadImage(data.homePage[0].section3.times.image || null);
        setUploadImage2(data.homePage[0].section4?.images || null);
        serEditorURL(data.homePage[0].section4?.manualDownloadUrl || "");

        serEditorVideoURL(data.homePage[0].section5?.videoUrl || null);

        serEditorOrganizers({
          editor1: data.homePage[0].section6[0].主辦單位 || "",
          editor2: data.homePage[0].section6[1].承辦單位 || "",
          editor3: data.homePage[0].section6[2].協辦單位 || "",
        });
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (contentRef1.current) {
      setHeight1(isOpen1 ? contentRef1.current.scrollHeight : 0);
    }
  }, [
    isOpen1,
    editorContents.editor1,
    editorContents.editor2,
    editorContents.editor3,
    editorContents.editor4,
    editorContents.editor5,
    editorContents.editor6,
    editorContents.editor7,
    editorContents.editor8,
    editorContents.editor9,
    editorContents.editor10,
  ]);

  useEffect(() => {
    if (contentRef2.current) {
      setHeight2(isOpen2 ? contentRef2.current.scrollHeight : 0);
    }
  }, [isOpen2, editorCards]);

  useEffect(() => {
    if (contentRef3.current) {
      setHeight3(isOpen3 ? contentRef3.current.scrollHeight : 0);
    }
  }, [
    isOpen3,
    editorTimes.editor1,

    editorTimes.editor6,
    editorTimes.editor7,
    editorTimes.editor8,
    editorTimes.editor9,
    editorTimes.editor10,
  ]);

  useEffect(() => {
    if (contentRef4.current) {
      setHeight4(isOpen4 ? contentRef4.current.scrollHeight : 0);
    }
  }, [isOpen4, editorURL]);

  useEffect(() => {
    if (contentRef5.current) {
      setHeight5(isOpen5 ? contentRef5.current.scrollHeight : 0);
    }
  }, [isOpen5, editorVideoURL]);

  useEffect(() => {
    if (contentRef6.current) {
      setHeight6(isOpen6 ? contentRef6.current.scrollHeight : 0);
    }
  }, [
    isOpen6,
    editorOrganizers.editor1,
    editorOrganizers.editor2,
    editorOrganizers.editor3,
  ]);

  const handleEditorChange = (id: string, content: string) => {
    setEditorContents((prev) => ({
      ...prev,
      [id]: content,
    }));
  };
  const handleImageUploadBanner = (id: string, data: UploadResponse) => {
    setEditorContents((prev) => ({
      ...prev,
      [id]: data.imageUrl,
    }));
  };
  const handleCardChange = (index: number, field: string, value: string) => {
    const newCards = [...editorCards];
    newCards[index] = { ...newCards[index], [field]: value };
    setEditorCards(newCards);
  };

  const addCard = () => {
    if (!isOpen2) {
      setIsOpen2(true);
    }
    setEditorCards([...editorCards, { year: "", date: "", content: "" }]);
  };

  const DeleteCard = (index: number) => {
    const newCards = editorCards.filter((_, idx) => idx !== index);
    setEditorCards(newCards);
  };

  const handleEditorChange2 = (id: string, content: string) => {
    setEditorTimes((prev) => ({
      ...prev,
      [id]: content,
    }));
  };

  const handleEditorChange3 = (event: React.ChangeEvent<HTMLInputElement>) => {
    serEditorURL(event.target.value);
  };

  const handleEditorChange4 = (id: string, content: string) => {
    serEditorVideoURL((prev) => ({
      ...prev,
      [id]: content,
    }));
  };

  const handleEditorChange5 = (id: string, content: string) => {
    serEditorOrganizers((prev) => ({
      ...prev,
      [id]: content,
    }));
  };

  // const handleImageUpload = (data) => {
  //   setUploadImage(data.fileUrl.fileUrl);
  // };
  const handleImageUpload2 = (data: UploadResponse) => {
    setUploadImage2(data.imageUrl);
  };

  const deleteImage = () => {
    setUploadImage2(null);
  };

  // 使用 fetch 發送 GraphQL mutation 更新資料
  const handleUpdate = async () => {
    setIsLoading(true);
    const input = {
      section1: {
        title: {
          left: editorContents.editor1,
          right: editorContents.editor2,
        },
        content: editorContents.editor3,
        subTitle: [
          editorContents.editor4,
          editorContents.editor5,
          editorContents.editor6,
          editorContents.editor7,
        ],
        location: editorContents.editor8,
        image: editorContents.editor9,
        toggle: toggle,
      },
      section2: {
        cards: editorCards,
      },
      section3: {
        times: {
          time1: editorTimes.editor1,

          time6: editorTimes.editor6,
          time7: editorTimes.editor7,
          time8: editorTimes.editor8,
          meeting: editorTimes.editor9,
          dinner: editorTimes.editor10,
          // image: uploadImage,
        },
      },
      section4: {
        manualDownloadUrl: editorURL,
        images: uploadImage2,
      },
      section5: {
        videoUrl: editorVideoURL,
      },
      section6: [
        { 主辦單位: editorOrganizers.editor1 },
        { 承辦單位: editorOrganizers.editor2 },
        { 協辦單位: editorOrganizers.editor3 },
      ],
    };

    try {
      const response = await graphqlRequest<UpdateHomePageResult>(
        UPDATE_PAGE.loc?.source.body || "",
        { input },
        session
      );
      if (response.errors) {
        console.error("更新失敗:", JSON.stringify(response.errors, null, 2));
      }
    } catch (err) {
      console.error("更新失敗:", err);
    } finally {
      alert("更新成功");
      setIsLoading(false);
    }
  };
  
  console.log(toggle)

  return (
    <div>
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-5 rounded-lg flex flex-col items-center">
            <div className="w-12 h-12 border-4 border-t-4 border-t-blue-500 border-gray-200 rounded-full animate-spin mb-3"></div>
            <p className="text-gray-700">資料處理中，請稍候...</p>
          </div>
        </div>
      )}
      <div className="text-32M mb-6">首頁</div>
      <div className="flex flex-col gap-[16px]">
        {/* 區塊一 */}
        <div className="relative bg-gray-200 w-full p-3">
          <div className="flex justify-between">
            <div>主視覺資訊</div>
            <Image
              src="/icons/24icon/arrow_right.svg"
              className={`cursor-pointer transition-transform duration-300 ${
                isOpen1 ? "rotate-90" : ""
              }`}
              width={24}
              height={24}
              alt="arrow"
              onClick={() => setIsOpen1(!isOpen1)}
            />
          </div>
          <div
            ref={contentRef1}
            className="overflow-hidden transition-all duration-500 ease-in-out"
            style={{ maxHeight: `${height1}px` }}
          >
            <div className="w-full my-6 relative">
              <div className="flex">
                <div className="text-[#009982] text-[80px] font-[700] leading-[142%] tracking-[4%] font-title">
                  {editorContents.editor1}
                </div>
                <div className="text-[#FFFFFF] text-[80px] font-[700] leading-[142%] tracking-[4%] font-title">
                  {editorContents.editor2}
                </div>
              </div>
              <div className="flex w-full mb-[24px] space-x-3">
                <div className="w-1/2">
                  <input
                    type="text"
                    value={editorContents.editor1}
                    placeholder="標題左"
                    onChange={(e) =>
                      handleEditorChange("editor1", e.target.value)
                    }
                    className={`block w-full rounded-md bg-white px-3.5 py-2 text-base text-gray-900 outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 ${
                      toggle ? "opacity-100" : "opacity-50"
                    }`}
                    disabled={!toggle}
                  />
                </div>
                <div className="w-1/2">
                  <input
                    type="text"
                    value={editorContents.editor2}
                    placeholder="標題右"
                    onChange={(e) =>
                      handleEditorChange("editor2", e.target.value)
                    }
                    className={`block w-full rounded-md bg-white px-3.5 py-2 text-base text-gray-900 outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 ${
                      toggle ? "opacity-100" : "opacity-50"
                    }`}
                    disabled={!toggle}
                  />
                </div>
              </div>
              <div
                className="text-black text-[16px] laptop:text-[36px] desktop:text-[36px] leading-[144%] mt-[-14px] whitespace-pre-wrap"
                dangerouslySetInnerHTML={{
                  __html: editorContents.editor3.replace(/\n/g, "<br>"),
                }}
              ></div>
              <textarea
                placeholder="內文"
                value={editorContents.editor3}
                onChange={(e) => handleEditorChange("editor3", e.target.value)}
                className={`block w-full rounded-md bg-white px-3.5 py-2 text-base text-gray-900 outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 ${
                  toggle ? "opacity-100" : "opacity-50"
                }`}
                disabled={!toggle}
              />
              <div className="desktop:mt-[18px] mt-[12px] flex items-center">
                <div
                  className="text-black text-[36px] laptop:text-[48px] desktop:text-[64px] font-[700] leading-[142%] font-title"
                  dangerouslySetInnerHTML={{ __html: editorContents.editor4 }}
                ></div>
                <div
                  className="text-black text-[10px] laptop:text-[16px] desktop:text-[24px] leading-[142%] font-title mt-[31px] ms-[3px]"
                  dangerouslySetInnerHTML={{ __html: editorContents.editor5 }}
                ></div>
                <div className="border-1 w-[96px] flex items-center justify-center mx-[12px]"></div>
                <div
                  className="text-black text-[36px] laptop:text-[48px] desktop:text-[64px] font-[700] leading-[142%] font-title"
                  dangerouslySetInnerHTML={{ __html: editorContents.editor6 }}
                ></div>
                <div
                  className="text-black text-[10px] laptop:text-[16px] desktop:text-[24px] leading-[142%] font-title mt-[31px] ms-[6px]"
                  dangerouslySetInnerHTML={{ __html: editorContents.editor7 }}
                ></div>
              </div>
              <div className="flex w-full mb-[24px] space-x-3">
                <div className="w-1/4">
                  <input
                    type="text"
                    value={editorContents.editor4}
                    placeholder="日期"
                    onChange={(e) =>
                      handleEditorChange("editor4", e.target.value)
                    }
                    className={`block w-full rounded-md bg-white px-3.5 py-2 text-base text-gray-900 outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 ${
                      toggle ? "opacity-100" : "opacity-50"
                    }`}
                    disabled={!toggle}
                  />
                </div>
                <div className="w-1/4">
                  <input
                    type="text"
                    value={editorContents.editor5}
                    placeholder="月份"
                    onChange={(e) =>
                      handleEditorChange("editor5", e.target.value)
                    }
                    className={`block w-full rounded-md bg-white px-3.5 py-2 text-base text-gray-900 outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 ${
                      toggle ? "opacity-100" : "opacity-50"
                    }`}
                    disabled={!toggle}
                  />
                </div>
                <div className="w-1/4">
                  <input
                    type="text"
                    value={editorContents.editor6}
                    placeholder="日期"
                    onChange={(e) =>
                      handleEditorChange("editor6", e.target.value)
                    }
                    className={`block w-full rounded-md bg-white px-3.5 py-2 text-base text-gray-900 outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 ${
                      toggle ? "opacity-100" : "opacity-50"
                    }`}
                    disabled={!toggle}
                  />
                </div>
                <div className="w-1/4">
                  <input
                    type="text"
                    value={editorContents.editor7}
                    placeholder="月份"
                    onChange={(e) =>
                      handleEditorChange("editor7", e.target.value)
                    }
                    className={`block w-full rounded-md bg-white px-3.5 py-2 text-base text-gray-900 outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 ${
                      toggle ? "opacity-100" : "opacity-50"
                    }`}
                    disabled={!toggle}
                  />
                </div>
              </div>
              <div
                className="text-black text-[12px] laptop:text-[18px] desktop:text-[24px] font-[500] leading-none"
                dangerouslySetInnerHTML={{ __html: editorContents.editor8 }}
              ></div>
              <div className="mt-[12px]">
                <input
                  type="text"
                  value={editorContents.editor8}
                  placeholder="地點"
                  onChange={(e) =>
                    handleEditorChange("editor8", e.target.value)
                  }
                    className={`block w-full rounded-md bg-white px-3.5 py-2 text-base text-gray-900 outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 ${
                    toggle ? "opacity-100" : "opacity-50"   
                  }`}
                  disabled={!toggle}
                />
              </div>
              <div className="mt-[12px]">
                {editorContents.editor9 && (
                  <Image
                    src={editorContents.editor9}
                    alt="some image"
                    width={240}
                    height={240}
                  ></Image>
                )}
                <ImageUploader
                  onImageUpload={(data) =>
                    handleImageUploadBanner("editor9", data)
                  }
                />
              </div>
              <div className="mt-[12px]">
                <div className="flex items-center gap-2">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={toggle === true}
                      onChange={() => setToggle(true)}
                      className="w-4 h-4"
                    />
                    <span className="text-black text-16M">顯示主視覺資訊</span>
                  </label>

                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={toggle === false}
                      onChange={() => setToggle(false)}
                      className="w-4 h-4"
                    />
                    <span className="text-black text-16M">隱藏主視覺資訊</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* 區塊二 - 卡片列表 */}
        <div className="relative bg-gray-200 w-full p-3">
          <div className="flex justify-between items-center">
            <div>最新消息</div>
            <div className="flex items-center gap-2">
              <Image
                src="/icons/24icon/arrow_right.svg"
                className={`cursor-pointer transition-transform duration-300 ${
                  isOpen2 ? "rotate-90" : ""
                }`}
                width={24}
                height={24}
                alt="arrow"
                onClick={() => setIsOpen2(!isOpen2)}
              />
              <button
                className="bg-blue-500 text-white px-3 py-1 rounded"
                onClick={addCard}
              >
                新增卡片
              </button>
            </div>
          </div>
          <div
            ref={contentRef2}
            className="overflow-hidden transition-all duration-500 ease-in-out"
            style={{ maxHeight: `${height2}px` }}
          >
            <div className="w-full my-6 relative space-y-6">
              {editorCards.map((card, index) => (
                <div
                  key={index}
                  className="p-[32px] border border-gray-300 rounded"
                >
                  <div className="p-[32px] flex items-center">
                    <div>
                      <div className="text-[#252F3880] text-14R">
                        {card.year}
                      </div>
                      <div className="text-primary text-[20px] font-[700]">
                        {card.date}
                      </div>
                    </div>
                    <div className="ms-[64px] text-black text-20R">
                      <span
                        dangerouslySetInnerHTML={{ __html: card.content }}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <input
                      type="text"
                      placeholder="年份"
                      value={card.year}
                      onChange={(e) =>
                        handleCardChange(index, "year", e.target.value)
                      }
                      className="block w-full rounded-md bg-white px-3.5 py-2 text-base text-gray-900 outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2"
                    />
                    <input
                      type="text"
                      placeholder="日期"
                      value={card.date}
                      onChange={(e) =>
                        handleCardChange(index, "date", e.target.value)
                      }
                      className="block w-full rounded-md bg-white px-3.5 py-2 text-base text-gray-900 outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2"
                    />
                    <CustomEditor
                      placeholder="最新消息"
                      onContentChange={(content) =>
                        handleCardChange(index, "content", content)
                      }
                    />
                  </div>
                  <button
                    className="bg-red-500 text-white px-3 py-1 rounded mt-2"
                    onClick={() => DeleteCard(index)}
                  >
                    刪除卡片
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* 區塊三 */}
        <div className="relative bg-gray-200 w-full p-3">
          <div className="flex justify-between items-center">
            <div>徵稿資訊</div>
            <div className="flex items-center gap-2">
              <Image
                src="/icons/24icon/arrow_right.svg"
                className={`cursor-pointer transition-transform duration-300 ${
                  isOpen3 ? "rotate-90" : ""
                }`}
                width={24}
                height={24}
                alt="arrow"
                onClick={() => setIsOpen3(!isOpen3)}
              />
            </div>
          </div>
          <div
            ref={contentRef3}
            className="  overflow-hidden transition-all duration-500 ease-in-out"
            style={{ maxHeight: `${height3}px` }}
          >
            <div className="mt-[32px] w-[240px] my-12">
              <div className="flex">
                <div className="text-primary text-20M me-1">
                  <span
                    dangerouslySetInnerHTML={{
                      __html: editorTimes.editor1,
                    }}
                  />
                </div>
              </div>
              <div className="flex space-x-1">
                <CustomEditor
                  placeholder="徵稿日期"
                  onContentChange={(content) =>
                    handleEditorChange2("editor1", content)
                  }
                />
              </div>
            </div>
            <div className="flex gap-[32px]  w-full  my-6">
              <div className="text-primary text-20M">
                {editorTimes.editor6}
                <input
                  type="text"
                  value={editorTimes.editor6}
                  placeholder=""
                  onChange={(e) =>
                    handleEditorChange2("editor6", e.target.value)
                  }
                  className="block w-full rounded-md bg-white px-3.5 py-2 text-base text-gray-900 outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2"
                />
              </div>
              <div className="text-primary text-20M">
                {editorTimes.editor7}
                <input
                  type="text"
                  value={editorTimes.editor7}
                  placeholder=""
                  onChange={(e) =>
                    handleEditorChange2("editor7", e.target.value)
                  }
                  className="block w-full rounded-md bg-white px-3.5 py-2 text-base text-gray-900 outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2"
                />
              </div>
              <div className="text-primary text-20M">
                {editorTimes.editor8}
                <input
                  type="text"
                  value={editorTimes.editor8}
                  placeholder=""
                  onChange={(e) =>
                    handleEditorChange2("editor8", e.target.value)
                  }
                  className="block w-full rounded-md bg-white px-3.5 py-2 text-base text-gray-900 outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2"
                />
              </div>
            </div>

            <div className=" gap-[16px]">
              <div>
                <div className="w-[240px] bg-[#FFEFB0] p-[16px] flex flex-col gap-[4px] rounded-[20px]">
                  <div className="text-black text-20M">會議</div>
                  <div className="text-black text-16M">
                    {editorTimes.editor9}
                    <input
                      type="text"
                      value={editorTimes.editor9}
                      placeholder=""
                      onChange={(e) =>
                        handleEditorChange2("editor9", e.target.value)
                      }
                      className="block w-full rounded-md bg-white px-3.5 py-2 text-base text-gray-900 outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2"
                    />
                  </div>
                </div>
                <div className="w-[240px] bg-[#FFEFB0] p-[16px] flex flex-col gap-[4px] rounded-[20px]">
                  <div className="text-black text-20M">會議主會場</div>
                  <div className="text-black text-16M">
                    {editorTimes.editor10}
                    <input
                      type="text"
                      value={editorTimes.editor10}
                      placeholder=""
                      onChange={(e) =>
                        handleEditorChange2("editor10", e.target.value)
                      }
                      className="block w-full rounded-md bg-white px-3.5 py-2 text-base text-gray-900 outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* 區塊四 */}
        <div className="relative bg-gray-200 w-full p-3">
          <div className="flex justify-between items-center">
            <div>會議手冊</div>
            <div className="flex items-center gap-2">
              <Image
                src="/icons/24icon/arrow_right.svg"
                className={`cursor-pointer transition-transform duration-300 ${
                  isOpen4 ? "rotate-90" : ""
                }`}
                width={24}
                height={24}
                alt="arrow"
                onClick={() => setIsOpen4(!isOpen4)}
              />
            </div>
          </div>
          <div
            ref={contentRef4}
            className="  overflow-hidden transition-all duration-500 ease-in-out"
            style={{ maxHeight: `${height4}px` }}
          >
            <div>
              <div className="my-3">{editorURL}</div>
              <input
                type="text"
                value={editorURL}
                placeholder="手冊下載網址"
                onChange={handleEditorChange3}
                className="block w-full rounded-md bg-white px-3.5 py-2 text-base text-gray-900 outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 "
              />
            </div>
            <div className="my-3">
              <ImageUploader
                onImageUpload={handleImageUpload2}
              />
              <button
                className="bg-red-500 text-white px-3 py-1 rounded mt-2"
                onClick={deleteImage}
              >
                刪除圖片
              </button>
            </div>
          </div>
        </div>
        {/* 區塊五 */}
        <div className="relative bg-gray-200 w-full p-3">
          <div className="flex justify-between items-center">
            <div>會議影片</div>
            <div className="flex items-center gap-2">
              <Image
                src="/icons/24icon/arrow_right.svg"
                className={`cursor-pointer transition-transform duration-300 ${
                  isOpen5 ? "rotate-90" : ""
                }`}
                width={24}
                height={24}
                alt="arrow"
                onClick={() => setIsOpen5(!isOpen5)}
              />
            </div>
          </div>
          <div
            ref={contentRef5}
            className=" overflow-hidden transition-all duration-500 ease-in-out"
            style={{ maxHeight: `${height5}px` }}
          >
            <div>{editorVideoURL.video1}</div>
            <div className="my-3">
              <input
                type="text"
                placeholder="ytube影片網址 ?v={這段}"
                onChange={(e) => handleEditorChange4("video1", e.target.value)}
                className="block w-full rounded-md bg-white px-3.5 py-2 text-base text-gray-900 outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2"
              />
            </div>
          </div>
        </div>
        {/* 區塊六 */}
        <div className="relative bg-gray-200 w-full p-3">
          <div className="flex justify-between items-center">
            <div>主辦單位</div>
            <div className="flex items-center gap-2">
              <Image
                src="/icons/24icon/arrow_right.svg"
                className={`cursor-pointer transition-transform duration-300 ${
                  isOpen6 ? "rotate-90" : ""
                }`}
                width={24}
                height={24}
                alt="arrow"
                onClick={() => setIsOpen6(!isOpen6)}
              />
            </div>
          </div>
          <div
            ref={contentRef6}
            className="grid grid-cols-4 overflow-hidden transition-all duration-500 ease-in-out"
            style={{ maxHeight: `${height6}px` }}
          >
            <div className="flex flex-col">
              <div className="bg-[#0DC7AB0D] desktop:w-[576px] p-[16px] rounded-[20px]">
                <div className="text-secondary text-16M">主辦單位</div>
                <div className="text-black text-16R mt-[8px]">
                  {editorOrganizers.editor1}
                </div>
                <div className="mt-3">
                  <input
                    type="text"
                    value={editorOrganizers.editor1}
                    placeholder=""
                    onChange={(e) =>
                      handleEditorChange5("editor1", e.target.value)
                    }
                    className="block w-full rounded-md bg-white px-3.5 py-2 text-base text-gray-900 outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2"
                  />
                </div>
              </div>
              <div className="bg-[#0DC7AB0D] desktop:w-[576px] p-[16px] rounded-[20px]">
                <div className="text-secondary text-16M">承辦單位</div>
                <div className="text-black text-16R mt-[8px]">
                  {editorOrganizers.editor2}
                </div>
                <div className="mt-3">
                  <input
                    type="text"
                    value={editorOrganizers.editor2}
                    placeholder=""
                    onChange={(e) =>
                      handleEditorChange5("editor2", e.target.value)
                    }
                    className="block w-full rounded-md bg-white px-3.5 py-2 text-base text-gray-900 outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2"
                  />
                </div>
              </div>
              <div className="bg-[#0DC7AB0D] desktop:w-[576px] p-[16px] rounded-[20px]">
                <div className="text-secondary text-16M">協辦單位</div>
                <div className="text-black text-16R mt-[8px]">
                  {editorOrganizers.editor3}
                </div>
                <div className="mt-3">
                  <input
                    type="text"
                    value={editorOrganizers.editor3}
                    placeholder=""
                    onChange={(e) =>
                      handleEditorChange5("editor3", e.target.value)
                    }
                    className="block w-full rounded-md bg-white px-3.5 py-2 text-base text-gray-900 outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* 更新按鈕 */}
      <div className="mt-6">
        <button
          onClick={handleUpdate}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          更新資料
        </button>
      </div>
    </div>
  );
};

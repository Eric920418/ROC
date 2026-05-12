"use client";

import React, { useState } from "react";

interface UploadResponse {
  videoUrl: string;
}

interface VideoUploaderProps {
  onVideoUpload: (data: UploadResponse) => void;
}

export const VideoUploader: React.FC<VideoUploaderProps> = ({
  onVideoUpload,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];

    setErrorMsg(null);
    setIsLoading(true);
    setProgress(0);

    const formData = new FormData();
    formData.append("video", file);

    // 用 XMLHttpRequest 以便顯示上傳進度
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/api/uploadVideo");

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        setProgress(Math.round((event.loaded / event.total) * 100));
      }
    };

    xhr.onload = () => {
      setIsLoading(false);
      try {
        const res = JSON.parse(xhr.responseText);
        if (xhr.status >= 200 && xhr.status < 300) {
          onVideoUpload({ videoUrl: res.fileUrl });
        } else {
          setErrorMsg(res.error || "上傳失敗");
        }
      } catch {
        setErrorMsg("伺服器回應錯誤");
      }
    };

    xhr.onerror = () => {
      setIsLoading(false);
      setErrorMsg("網路錯誤，請稍後再試");
    };

    xhr.send(formData);
  };

  return (
    <div>
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-5 rounded-lg flex flex-col items-center min-w-[260px]">
            <div className="w-12 h-12 border-4 border-t-blue-500 border-gray-200 rounded-full animate-spin mb-3"></div>
            <p className="text-gray-700 mb-2">影片上傳中，請稍候...</p>
            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
              <div
                className="bg-blue-500 h-2 transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">{progress}%</p>
          </div>
        </div>
      )}
      <div className="mt-2">
        <label className="block text-sm font-medium text-gray-700">
          支援 MP4、WebM、Ogg、MOV 格式，檔案大小請勿超過 100MB
        </label>
        <input
          className="block w-full rounded-md bg-white px-3.5 py-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 mt-[1rem]"
          type="file"
          accept="video/mp4,video/webm,video/ogg,video/quicktime"
          onChange={handleFileChange}
        />
        {errorMsg && (
          <p className="text-sm text-red-600 mt-2">{errorMsg}</p>
        )}
      </div>
    </div>
  );
};

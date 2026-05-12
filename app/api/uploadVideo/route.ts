import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

// Next.js App Router 設定
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
// 影片檔案可能較大，加長 API 執行時間
export const maxDuration = 300;

// 從環境變數取得上傳目錄，如果沒有設定則使用預設值
const UPLOAD_DIR =
  process.env.UPLOAD_DIR || path.join(process.cwd(), "uploads");

export async function POST(request: Request) {
  try {
    // 確保上傳目錄存在
    const uploadDir = path.join(UPLOAD_DIR, "videos");
    await fs.mkdir(uploadDir, { recursive: true });

    // 使用內建的 formData() 方法取得表單資料
    const formData = await request.formData();
    const fileField = formData.get("video");

    // 檢查是否有上傳檔案，且是否為 File 物件
    if (!fileField || !(fileField instanceof File)) {
      return NextResponse.json({ error: "找不到影片檔案" }, { status: 400 });
    }

    // 檢查檔案類型（接受常見影片格式）
    const allowedTypes = [
      "video/mp4",
      "video/webm",
      "video/ogg",
      "video/quicktime",
    ];
    if (!allowedTypes.includes(fileField.type)) {
      return NextResponse.json(
        {
          error: "不支援的檔案類型。請上傳 MP4、WebM、Ogg 或 MOV 格式的影片",
        },
        { status: 400 }
      );
    }

    // 檢查檔案大小（限制 100MB）
    const maxSize = 100 * 1024 * 1024; // 100MB
    if (fileField.size > maxSize) {
      return NextResponse.json(
        {
          error: `檔案大小不能超過 ${Math.round(
            maxSize / (1024 * 1024)
          )}MB，目前檔案大小為 ${
            Math.round((fileField.size / (1024 * 1024)) * 100) / 100
          }MB`,
        },
        { status: 400 }
      );
    }

    // 將上傳的檔案轉成 Buffer
    const fileBuffer = Buffer.from(await fileField.arrayBuffer());

    // 自訂檔名：在原始檔名前加上 timestamp，並將空白轉換成 -
    const timestamp = Date.now();
    const originalName = fileField.name;
    const safeName = originalName.replace(/\s+/g, "-");
    const fileName = `${timestamp}-${safeName}`;
    const filePath = path.join(uploadDir, fileName);

    // 寫入檔案到指定目錄
    await fs.writeFile(filePath, fileBuffer);

    // 回傳成功訊息以及檔案的完整路徑
    return NextResponse.json({
      message: "上傳成功",
      fileUrl: `/api/videos/${fileName}`,
      fileSize: fileField.size,
    });
  } catch (error) {
    console.error("上傳錯誤：", error);
    return NextResponse.json({ error: "檔案上傳失敗" }, { status: 500 });
  }
}

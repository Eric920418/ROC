import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

// Next.js App Router 設定
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// 從環境變數取得上傳目錄，如果沒有設定則使用預設值
const UPLOAD_DIR =
  process.env.UPLOAD_DIR || path.join(process.cwd(), "uploads");

export async function POST(request: Request) {
  try {
    // 確保上傳目錄存在
    const uploadDir = path.join(UPLOAD_DIR, "images");
    await fs.mkdir(uploadDir, { recursive: true });

    // 使用內建的 formData() 方法取得表單資料
    const formData = await request.formData();
    const fileField = formData.get("image");

    // 檢查是否有上傳檔案，且是否為 File 物件
    if (!fileField || !(fileField instanceof File)) {
      return NextResponse.json({ error: "找不到圖片檔案" }, { status: 400 });
    }

    // 檢查檔案類型（只接受圖片檔案）
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(fileField.type)) {
      return NextResponse.json({ 
        error: "不支援的檔案類型。請上傳 JPG、PNG、GIF 或 WebP 格式的圖片" 
      }, { status: 400 });
    }

    // 檢查檔案大小（限制 5MB，與前端提示保持一致）
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (fileField.size > maxSize) {
      return NextResponse.json({
        error: `檔案大小不能超過 ${Math.round(maxSize / (1024 * 1024))}MB，目前檔案大小為 ${Math.round(fileField.size / (1024 * 1024) * 100) / 100}MB`
      }, { status: 400 });
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
      fileUrl: `/api/images/${fileName}`,
      fileSize: fileField.size, // 回傳檔案大小資訊
    });
  } catch (error) {
    console.error("上傳錯誤：", error);
    return NextResponse.json({ error: "檔案上傳失敗" }, { status: 500 });
  }
}

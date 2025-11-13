import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

// Next.js App Router 設定
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// 從環境變數取得上傳目錄
const UPLOAD_DIR =
  process.env.UPLOAD_DIR || path.join(process.cwd(), "uploads");

export async function GET(
  request: Request,
  { params }: { params: { filename: string } }
) {
  try {
    const { filename } = params;

    // 檢查檔名是否合法（安全性檢查）
    if (!filename || filename.includes("..")) {
      return NextResponse.json({ error: "無效的檔名" }, { status: 400 });
    }

    const filePath = path.join(UPLOAD_DIR, "images", filename);

    // 檢查檔案是否存在
    try {
      await fs.access(filePath);
    } catch {
      return NextResponse.json({ error: "找不到圖片" }, { status: 404 });
    }

    // 讀取檔案
    const file = await fs.readFile(filePath);

    // 根據副檔名決定 Content-Type
    const ext = path.extname(filename).toLowerCase();
    const contentType =
      {
        ".jpg": "image/jpeg",
        ".jpeg": "image/jpeg",
        ".png": "image/png",
        ".gif": "image/gif",
        ".webp": "image/webp",
      }[ext] || "application/octet-stream";

    // 回傳圖片檔案
    return new NextResponse(file, {
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `inline; filename="${filename}"`,
        "Cache-Control": "public, max-age=31536000",
      },
    });
  } catch (error) {
    console.error("讀取圖片錯誤：", error);
    return new NextResponse(null, { status: 500 }); // 回傳 500 錯誤而不是 JSON
  }
}

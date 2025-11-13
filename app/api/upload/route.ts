import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

// Next.js App Router 設定
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// 從環境變數取得上傳目錄
const UPLOAD_DIR =
  process.env.UPLOAD_DIR || path.join(process.cwd(), "uploads");

export async function POST(request: Request) {
  try {
    // 設定 PDF 上傳目錄
    const uploadDir = path.join(UPLOAD_DIR, "pdfs");
    await fs.mkdir(uploadDir, { recursive: true });

    // 使用內建的 formData() 方法取得表單資料
    const formData = await request.formData();
    const fileField = formData.get("pdf");

    // 檢查是否有上傳檔案，且是否為 File 物件
    if (!fileField || !(fileField instanceof File)) {
      return NextResponse.json({ error: "找不到 PDF 檔案" }, { status: 400 });
    }

    // 檢查檔案類型
    if (fileField.type !== "application/pdf") {
      return NextResponse.json({ error: "只接受 PDF 檔案" }, { status: 400 });
    }

    // 檢查檔案大小（例如限制 10MB）
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (fileField.size > maxSize) {
      return NextResponse.json(
        { error: "檔案大小不能超過 10MB" },
        { status: 400 }
      );
    }

    // 將上傳的檔案轉成 Buffer
    const fileBuffer = Buffer.from(await fileField.arrayBuffer());

    // 自訂檔名：timestamp + 原始檔名（移除空白）
    const timestamp = Date.now();
    const originalName = fileField.name;
    const safeName = originalName.replace(/\s+/g, "-");
    const fileName = `${timestamp}-${safeName}`;
    const filePath = path.join(uploadDir, fileName);

    // 寫入檔案到指定目錄
    await fs.writeFile(filePath, fileBuffer);

    // 回傳成功訊息以及檔案存取路徑
    return NextResponse.json({
      message: "上傳成功",
      fileUrl: `/api/pdfs/${fileName}`, // 使用 API 路由來存取 PDF
    });
  } catch (error) {
    console.error("上傳錯誤：", error);
    return NextResponse.json({ error: "檔案上傳失敗" }, { status: 500 });
  }
}

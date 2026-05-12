import { NextResponse } from "next/server";
import fs from "fs";
import fsp from "fs/promises";
import path from "path";

// Next.js App Router 設定
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// 從環境變數取得上傳目錄
const UPLOAD_DIR =
  process.env.UPLOAD_DIR || path.join(process.cwd(), "uploads");

const CONTENT_TYPES: Record<string, string> = {
  ".mp4": "video/mp4",
  ".webm": "video/webm",
  ".ogg": "video/ogg",
  ".ogv": "video/ogg",
  ".mov": "video/quicktime",
};

export async function GET(
  request: Request,
  { params }: { params: Promise<{ filename: string }> }
) {
  try {
    const { filename } = await params;

    // 檢查檔名是否合法（安全性檢查）
    if (!filename || filename.includes("..")) {
      return NextResponse.json({ error: "無效的檔名" }, { status: 400 });
    }

    const filePath = path.join(UPLOAD_DIR, "videos", filename);

    // 取得檔案資訊
    let stat;
    try {
      stat = await fsp.stat(filePath);
    } catch {
      return NextResponse.json({ error: "找不到影片" }, { status: 404 });
    }

    const fileSize = stat.size;
    const ext = path.extname(filename).toLowerCase();
    const contentType = CONTENT_TYPES[ext] || "application/octet-stream";

    const range = request.headers.get("range");

    // 支援 Range 請求（影片串流必須）
    if (range) {
      const match = /bytes=(\d+)-(\d*)/.exec(range);
      if (!match) {
        return new NextResponse(null, { status: 416 });
      }
      const start = parseInt(match[1], 10);
      const end = match[2] ? parseInt(match[2], 10) : fileSize - 1;

      if (start >= fileSize || end >= fileSize) {
        return new NextResponse(null, {
          status: 416,
          headers: { "Content-Range": `bytes */${fileSize}` },
        });
      }

      const chunkSize = end - start + 1;
      const nodeStream = fs.createReadStream(filePath, { start, end });
      // 將 Node Readable 轉成 Web ReadableStream
      const webStream = new ReadableStream({
        start(controller) {
          nodeStream.on("data", (chunk) => {
            controller.enqueue(
              chunk instanceof Buffer ? new Uint8Array(chunk) : chunk
            );
          });
          nodeStream.on("end", () => controller.close());
          nodeStream.on("error", (err) => controller.error(err));
        },
        cancel() {
          nodeStream.destroy();
        },
      });

      return new NextResponse(webStream, {
        status: 206,
        headers: {
          "Content-Range": `bytes ${start}-${end}/${fileSize}`,
          "Accept-Ranges": "bytes",
          "Content-Length": String(chunkSize),
          "Content-Type": contentType,
          "Cache-Control": "public, max-age=31536000",
        },
      });
    }

    // 無 Range：整檔回傳
    const file = await fsp.readFile(filePath);
    return new NextResponse(file, {
      headers: {
        "Content-Type": contentType,
        "Content-Length": String(fileSize),
        "Accept-Ranges": "bytes",
        "Cache-Control": "public, max-age=31536000",
      },
    });
  } catch (error) {
    console.error("讀取影片錯誤：", error);
    return new NextResponse(null, { status: 500 });
  }
}

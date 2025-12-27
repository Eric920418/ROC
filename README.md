# R.co 設計公司形象網站

使用技術：TypeScript、Next.js 15、React 19、GraphQL、Prisma、PostgreSQL

特殊工具整合：CKEditor 5 富文本編輯器、NextAuth 認證、Apollo Client、Tailwind CSS 4、Framer Motion

## 專案簡介

本專案是一個現代化的設計公司形象網站，結合企業展示與社群互動功能。前端以 Next.js 15 + React 19 打造，採用 App Router 架構與響應式設計；後端使用 GraphQL Yoga + Prisma ORM 建構穩定的 API 與資料儲存機制。網站設計風格強調「當代設計」理念，以簡潔的線條與純粹的比例呈現品牌形象。

## 核心功能

- **動態內容管理系統**（首頁七大區塊、品牌展示、團隊成員、設計案例等頁面編輯）
- **論壇社群系統**（分類管理、帖子發布、嵌套評論、瀏覽統計）
- **後台管理系統**（基於 NextAuth 認證、區塊化內容編輯）
- **RWD 響應式設計**，支援手機與桌機瀏覽
- **豐富的動畫效果**（3D 卡片層疊、全屏沉浸式展示、手風琴展開等）
- **滾動出場動畫**（首頁各區塊在滾動進入視口時動態出現）

## 開發亮點

- 採用 GraphQL + Prisma 建構彈性的 ContentBlock 架構，易於擴展新內容類型
- 前後端完全類型安全（TypeScript + GraphQL Schema）
- Tailwind CSS v4 主題系統，統一品牌色系管理
- 使用 Next.js Image 優化圖片載入效能
- 支援假數據模式，無需資料庫即可預覽前台頁面

## 技術棧

| 類別 | 技術 |
|------|------|
| 框架 | Next.js 15 (App Router) |
| 前端 | React 19、TypeScript |
| 樣式 | Tailwind CSS v4 |
| API | GraphQL Yoga |
| ORM | Prisma |
| 資料庫 | PostgreSQL |
| 認證 | NextAuth.js |
| 編輯器 | CKEditor 5 |
| 動畫 | Framer Motion、CSS Animations |
| 套件管理 | pnpm |

## 快速開始

### 1. 安裝依賴
```bash
pnpm install
```

### 2. 環境變數設定
```bash
cp .env.example .env
```

編輯 `.env` 檔案：
```env
DATABASE_URL="postgresql://user:password@localhost:5432/dbname"
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"
```

### 3. 初始化資料庫
```bash
pnpm prisma migrate dev
```

### 4. 啟動開發伺服器
```bash
pnpm dev
```

### 5. 訪問頁面
- 前台首頁：`http://localhost:3000`
- 關於我們：`http://localhost:3000/about`
- 聯繫我們：`http://localhost:3000/contact`
- 論壇系統：`http://localhost:3000/forum`
- 後台登入：`http://localhost:3000/admin/login`

## 專案結構

```
├── app/
│   ├── page.tsx              # 前台首頁
│   ├── about/                # 關於我們頁面
│   ├── contact/              # 聯繫我們頁面
│   ├── forum/                # 論壇系統
│   ├── admin/                # 後台管理
│   └── api/                  # API 路由（GraphQL）
├── graphql/
│   ├── schemas/              # GraphQL Schema 定義
│   ├── resolvers.ts          # GraphQL Resolvers
│   └── utils/defaults.ts     # 內容類型預設值
├── prisma/
│   └── schema.prisma         # 資料庫模型
├── src/components/
│   ├── Section1-7.tsx        # 首頁各區塊組件
│   ├── AnimatedSection.tsx   # 滾動出場動畫組件
│   ├── Header.tsx            # 全局導航欄
│   ├── Footer.tsx            # 頁尾組件
│   ├── Edit/                 # 後台編輯組件
│   └── Admin/                # 後台共用組件
└── public/                   # 靜態資源
```

## 首頁區塊說明

| 區塊 | 功能 | 特色 |
|------|------|------|
| Section1 | 當代設計展示 | 品牌理念、設計哲學介紹 |
| Marquee | 品牌輪播 | Logo + 後綴圖片組合輪播 |
| Section7 | 服務地點 | 台北/台中/海外據點展示 |
| Section2 | 團隊成員 | 3D 層疊卡片、自動輪播 |
| Section3 | 設計案例 | 全屏沉浸式、毛玻璃 UI |
| Section4 | 客戶見證 | 左圖右文、導航點切換 |
| Section5 | 服務項目 | 網格布局、hover 動畫 |
| Section6 | FAQ 問答 | 手風琴式展開 |

## 論壇頁面設計

論壇頁面採用現代藝術風格設計，特色包含：

| 區塊 | 功能 | 設計特色 |
|------|------|---------|
| 分類導覽 | 文章篩選 | 圓角膠囊標籤、backdrop-blur 效果、動態顏色 |
| 精選文章 | 焦點展示 | 大型 Hero 卡片、漸層遮罩、hover 縮放動畫 |
| 文章網格 | 列表瀏覽 | 交錯布局、陰影層次、懸停動作按鈕 |
| 分頁導航 | 翻頁操作 | 現代膠囊按鈕、禁用狀態處理 |

### 視覺效果
- **fadeInUp 動畫**：頁面載入時由下往上淡入
- **交錯延遲**：文章卡片依序出現，創造流暢視覺節奏
- **漸層背景**：從 neutral-50 到 white 的細膩過渡
- **毛玻璃標籤**：backdrop-blur + 半透明背景
- **hover 互動**：圖片縮放、陰影增強、動作按鈕浮現

## 滾動出場動畫系統

首頁採用 Framer Motion 實現滾動觸發的出場動畫效果：

### 動畫組件
- `AnimatedSection` - 滾動進入視口時觸發動畫
- `HeroAnimation` - 頁面載入時立即播放（用於首屏）

### 支援的動畫類型
| 類型 | 效果 |
|------|------|
| fadeUp | 從下往上淡入（預設） |
| fadeDown | 從上往下淡入 |
| fadeIn | 原地淡入 |
| slideLeft | 從左側滑入 |
| slideRight | 從右側滑入 |
| scale | 縮放淡入 |

### 使用方式
```tsx
import { AnimatedSection, HeroAnimation } from "@/components/AnimatedSection";

// 首屏立即動畫
<HeroAnimation delay={0.1} duration={0.8}>
  <Section1 />
</HeroAnimation>

// 滾動觸發動畫
<AnimatedSection animation="fadeUp" delay={0.1}>
  <Section2 />
</AnimatedSection>
```

### 參數說明
| 參數 | 類型 | 預設值 | 說明 |
|------|------|--------|------|
| animation | string | fadeUp | 動畫類型 |
| delay | number | 0 | 延遲時間（秒） |
| duration | number | 0.6 | 動畫時長（秒） |
| once | boolean | true | 是否只播放一次 |

## 後台管理功能

### 首頁區塊管理
- `/admin/section1` - 主視覺區編輯
- `/admin/marquee` - 品牌輪播編輯
- `/admin/section7` - 服務地點編輯
- `/admin/section2` - 團隊成員編輯
- `/admin/section3` - 設計案例編輯
- `/admin/section4` - 客戶見證編輯
- `/admin/section6` - FAQ 問答編輯

### 其他頁面管理
- `/admin/about` - 關於我們頁面編輯（標題、描述、圖片、願景、引言、相簿）
- `/admin/contact` - 聯絡我們頁面編輯（聯絡資訊、工作室地址、表單設定）

### 論壇管理
- `/admin/forum-categories` - 分類管理（CRUD）
- `/admin/forum-posts` - 帖子管理（置頂、鎖定、刪除）

## 資料庫模型

```prisma
model ContentBlock {
  id        Int      @id @default(autoincrement())
  key       String   @unique
  payload   Json     @default("{}")
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Category {
  id    Int    @id @default(autoincrement())
  name  String @unique
  slug  String @unique
  color String @default("#1d2088")
  posts Post[]
}

model Post {
  id         Int       @id @default(autoincrement())
  title      String
  slug       String    @unique
  content    String
  views      Int       @default(0)
  isPinned   Boolean   @default(false)
  isLocked   Boolean   @default(false)
  categoryId Int
  comments   Comment[]
}

model Comment {
  id       Int       @id @default(autoincrement())
  content  String
  author   String
  postId   Int
  parentId Int?
  replies  Comment[]
}
```

## 字體配置

| 字體 | CSS 變數 | 用途 |
|------|----------|------|
| Montserrat | `--font-montserrat` | 英文主字體 |
| Noto Sans TC | `--font-noto-sans-tc` | 中文主字體 |
| Adobe Caslon Pro Semibold | `--font-caslon` | 標題裝飾字體（Section1 大標題、極簡現代風標題） |

## 品牌色系

| 名稱 | 色碼 | 用途 |
|------|------|------|
| 品牌主色 | `#1d2088` | 強調色、hover 效果 |
| 白色 | `#ffffff` | 背景、文字 |
| 淺灰 | `#f2f2f2` | 區塊背景 |
| 灰色 | `#afb3b2` | 輔助元素 |
| 深灰 | `#57524c` | 次要文字 |
| 黑色 | `#000000` | 主要文字 |

## GraphQL API 權限設計

### 公開 Mutations（不需驗證）
以下 mutations 設計為匿名可執行，定義於 `app/api/graphql/route.ts` 的 `PUBLIC_MUTATIONS`：
- `submitContactMessage` - 前台聯絡表單提交
- `incrementPostViews` - 瀏覽次數統計（匿名操作）

### 受保護 Mutations
其他所有 mutations 需要有效的 Authorization Bearer Token。

## 注意事項

- 永遠使用 `pnpm` 安裝套件
- 禁止使用 `--accept-data-loss` 執行 Prisma 遷移
- 所有錯誤完整顯示於前端便於調試
- Port 3000 為預設開發端口
- 登入頁面（`/admin/login`）會自動檢測用戶 session，已登入用戶將自動重定向至管理後台

## 響應式設計說明

所有組件已支援手機版（< 768px）與桌機版佈局：

| 組件 | 手機版調整 |
|------|-----------|
| Section1 | 縱向堆疊、縮小標題、減少 padding |
| Section2 | 單卡片顯示、隱藏 3D 效果 |
| Marquee | Logo/後綴圖片縮小、動態偏移調整 |
| Section3 | 縱向佈局 |
| Section6 | 減少 padding、縮小標題 |
| Header | Logo 改為相對定位、縮小尺寸 |

響應式斷點：`md:768px`、`lg:1024px`

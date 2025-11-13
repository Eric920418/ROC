# Next.js Base Template

一個乾淨的 Next.js + GraphQL + Prisma 基底專案模板，保留可自定義後台管理功能，讓你快速開始新專案開發。

## 核心功能

### 前台
- Next.js 15 App Router 架構
- 首頁 (`/`) 包含多個設計區塊
  - Section1：當代設計展示區
  - Section2：Team Members 團隊成員展示區（3D層疊卡片）
  - Section3：Connect 設計案例展示區（輪播）
  - Section4：住客推薦展示區（輪播）
  - Section5：Our Service 服務展示區（輪播）
  - Section6：QA 問答區（手風琴式展開）
- Tailwind CSS v4 樣式系統
- 響應式設計基礎
- 全局 Header 導航欄（包含品牌 Logo、導航鏈接、搜索功能）

### 後台管理 (`/admin`)
- 基於 NextAuth 的登入認證
- 動態內容管理系統
- 預設內容類型：
  - **首頁內容** (`/admin/home-page`) - 管理首頁區塊
  - **Logo 設定** (`/admin/logo`) - 品牌 logo 和圖示
  - **顏色配置** (`/admin/color`) - 保留但前台使用固定品牌色

### 技術架構
- **GraphQL Yoga** - API 層
- **Prisma ORM** - 資料庫管理
- **ContentBlock 模型** - 彈性的 JSON 存儲，支援任意內容結構
- **檔案上傳** - 本地 `uploads/` 目錄存儲

## 快速開始

### 1. 安裝依賴
```bash
pnpm install
```

### 2. 環境變數設定
複製 `.env.example` 並重新命名為 `.env`，然後修改內容：
```bash
cp .env.example .env
```

編輯 `.env` 檔案並填入實際的資料庫連接資訊和密鑰：
```env
DATABASE_URL="postgresql://user:password@localhost:5432/dbname"
NEXTAUTH_SECRET="your-secret-key-change-this-in-production"
NEXTAUTH_URL="http://localhost:3000"
```

### 3. 初始化資料庫
```bash
pnpm prisma migrate deploy
```

### 4. 啟動開發伺服器
```bash
pnpm dev
```

訪問 `http://localhost:3000` 查看前台，訪問 `/admin/login` 進入後台。

## 如何擴展新的內容類型

這個模板設計為可擴展架構。以下是新增自定義內容類型（例如 `aboutPage`）的完整流程：

### 步驟 1：定義默認數據結構
編輯 `graphql/utils/defaults.ts`：

```typescript
const aboutPageDefaults = {
  title: "",
  description: "",
  team: [] as Array<{ name: string; role: string; image: string }>,
};

export const blockDefaults = {
  homePage: () => clone(homePageDefaults),
  logo: () => clone(logoDefaults),
  color: () => clone(colorDefaults),
  aboutPage: () => clone(aboutPageDefaults), // 新增
} as const;
```

### 步驟 2：創建 GraphQL Schema
新建 `graphql/schemas/AboutPage.graphql`：

```graphql
type AboutPage {
  id: Int!
  title: String!
  description: String!
  team: JSON!
}

input AboutPageInput {
  title: String
  description: String
  team: JSON
}

type Query {
  aboutPage: [AboutPage!]!
}

type Mutation {
  updateAboutPage(input: AboutPageInput!): AboutPage!
}
```

### 步驟 3：註冊 Resolvers
編輯 `graphql/resolvers.ts`：

```typescript
const Query = {
  homePage: createQueryResolver("homePage"),
  logo: createQueryResolver("logo"),
  color: createQueryResolver("color"),
  aboutPage: createQueryResolver("aboutPage"), // 新增
};

const Mutation = {
  updateHomePage: createMutationResolver("homePage"),
  updateLogo: createMutationResolver("logo"),
  updateColor: createMutationResolver("color"),
  updateAboutPage: createMutationResolver("aboutPage"), // 新增
};
```

### 步驟 4：創建後台編輯組件
新建 `src/components/Edit/AboutPage.tsx`：

```tsx
"use client";
import { useQuery, useMutation } from "@apollo/client";
import { gql } from "@apollo/client";

const GET_ABOUT = gql`
  query GetAboutPage {
    aboutPage {
      id
      title
      description
      team
    }
  }
`;

const UPDATE_ABOUT = gql`
  mutation UpdateAboutPage($input: AboutPageInput!) {
    updateAboutPage(input: $input) {
      id
      title
    }
  }
`;

export const AboutPage = () => {
  const { data } = useQuery(GET_ABOUT);
  const [update] = useMutation(UPDATE_ABOUT);

  // 實作你的編輯表單...
  return <div>About Page Editor</div>;
};
```

### 步驟 5：註冊到後台路由
編輯 `app/admin/[slug]/page.tsx`：

```typescript
import { AboutPage } from "@/components/Edit/AboutPage";

const EditPages = [
  { slug: "home-page", component: <HomePage /> },
  { slug: "about", component: <AboutPage /> }, // 新增
  { slug: "logo", component: <Logo /> },
  { slug: "color", component: <Color /> },
];
```

### 步驟 6：添加側邊欄連結
編輯 `src/components/Admin/Sidebar.tsx`：

```tsx
<Link href="/admin/about" className="...">
  關於我們
</Link>
```

### 步驟 7：創建前台頁面
新建 `app/about/page.tsx`：

```tsx
import { gql } from "@apollo/client";
import { getClient } from "@/lib/apolloClient";

export default async function AboutPage() {
  const client = getClient();
  const { data } = await client.query({
    query: gql`
      query GetAboutPage {
        aboutPage {
          title
          description
          team
        }
      }
    `,
  });

  return <div>{/* 渲染你的關於頁面 */}</div>;
}
```

## 專案結構

```
├── app/
│   ├── admin/          # 後台管理頁面
│   ├── api/            # API 路由（GraphQL, 檔案上傳）
│   ├── layout.tsx      # 根布局（包含 Header）
│   └── page.tsx        # 前台首頁
├── graphql/
│   ├── schemas/        # GraphQL schema 定義
│   ├── resolvers.ts    # GraphQL resolvers
│   └── utils/
│       └── defaults.ts # 內容類型預設值
├── prisma/
│   └── schema.prisma   # 資料庫模型
├── public/
│   ├── R.coLogo.png    # 品牌 Logo
│   └── icons/          # 其他圖標資源
├── src/components/
│   ├── Header.tsx              # 全局導航欄
│   ├── Footer.tsx              # 頁尾組件
│   ├── MoveToTop.tsx           # 返回頂部按鈕
│   ├── ModalContext.tsx        # Modal 狀態管理
│   ├── ClientLayoutWrapper.tsx # 客戶端布局包裝器（條件渲染 Header/Footer）
│   ├── Section1.tsx            # 首頁 Section1 當代設計區塊
│   ├── Section2.tsx            # 首頁 Section2 團隊成員區塊（3D層疊卡片）
│   ├── Section3.tsx            # 首頁 Section3 Connect 設計案例區塊（輪播）
│   ├── Section4.tsx            # 首頁 Section4 住客推薦展示區塊（輪播）
│   ├── Section5.tsx            # 首頁 Section5 Our Service 服務展示區塊（輪播）
│   ├── Section6.tsx            # 首頁 Section6 QA 問答區塊（手風琴）
│   ├── Admin/                  # 後台共用組件
│   └── Edit/                   # 內容編輯器組件
└── uploads/            # 上傳檔案存儲
```

## Header 導航欄

全局 Header 位於 `src/components/Header.tsx`，包含以下功能：

- **品牌 Logo**: 左側顯示 R.co logo，點擊返回首頁
- **導航鏈接**: About Us、Forum、Contact Us（**絕對居中顯示**）
- **搜索功能**: 右側搜索圖標，點擊展開搜索框
- **響應式設計**: 移動端自動折疊為垂直菜單
- **品牌色系**: 使用 `#1d2088` 作為 hover 效果顏色
- **布局設計**: 採用三欄等寬布局（左側 Logo + 中間導航按鈕 + 右側搜索），確保導航按鈕絕對居中於 Header
- **固定定位**: 使用 `sticky top-0` 實現滾動時固定在頂部，並添加陰影效果提升視覺層次

### 自定義導航鏈接

編輯 `src/components/Header.tsx` 中的 `navLinks` 陣列：

```tsx
const navLinks = [
  { href: "/about", label: "About Us" },
  { href: "/forum", label: "Forum" },
  { href: "/contact", label: "Contact Us" },
  // 新增更多連結...
];
```

## Footer 頁尾

全局 Footer 位於 `src/components/Footer.tsx`，包含以下功能：

### 設計元素
- **黑色背景**: 主要內容區域採用黑色背景
- **左側**: R.co Logo（白色反色）
- **右側**:
  - 導航鏈接：About Us | Forum | Contact Us（白色文字，hover 變品牌色）
  - 社交媒體圖標：Email、Instagram、Facebook（白色圖標，hover 變品牌色）
- **底部版權區**: 灰色背景 + 白色文字
  - 「版權所有 Copyright © 2020 All Right Reserved by R.co」

### 特點
- **響應式設計**: 桌面端左右布局，移動端垂直堆疊居中
- **Logo 反色處理**: 使用 `brightness-0 invert` 將黑色 Logo 轉為白色
- **社交媒體鏈接**:
  - Email: `mailto:contact@rco.com`
  - Instagram: 外部連結
  - Facebook: 外部連結
- **導航分隔符**: 使用 `|` 分隔導航鏈接
- **hover 效果**: 所有連結 hover 時變品牌藍色

### 自定義社交媒體連結

編輯 `src/components/Footer.tsx` 中的 `socialLinks` 陣列：

```tsx
const socialLinks = [
  { href: "mailto:contact@rco.com", icon: Mail, label: "Email" },
  { href: "https://instagram.com", icon: Instagram, label: "Instagram" },
  { href: "https://facebook.com", icon: Facebook, label: "Facebook" },
  // 新增更多社交媒體...
];
```

## Section1 當代設計區塊

首頁的主要內容區塊，完整還原設計稿：

### 設計元素
- **左側**:
  - "Contemporary Design" 大標題（灰色）
  - "当代设计" 標題 + 向下箭頭按鈕（品牌藍圓形按鈕）
  - 室內設計大圖
- **右側**:
  - NO.1 當代設計精神標籤（帶皇冠圖標）
  - "Less, but better" 標語
  - Dieter Rams 設計哲學介紹
  - 極簡書桌場景圖
  - 極簡現代風說明

### 所需圖片資源

請將以下圖片放到 `public/` 目錄：
- `section1-main.jpg` - 左側大圖（室內設計，蓝色沙发场景）
- `section1-desk.jpg` - 右側圖片（書桌和檯燈場景）

### 響應式設計
- 桌面端：左右雙欄布局
- 移動端：垂直堆疊布局

## Section2 Team Members 團隊成員

創新的團隊成員展示區塊，採用獨特的「3D 層疊卡片」設計，與 Section3 的水平輪播形成鮮明對比。

### 設計元素
- **標題區域**:
  - "Team Members" 大標題（品牌藍色）
  - "團隊成員" 中文副標題

- **3D 層疊卡片效果**:
  - 卡片以扇形堆疊方式呈現，具有 3D 深度視覺效果
  - 當前成員卡片突出顯示，帶品牌色邊框
  - 背景卡片以不同角度、縮放和透明度層疊
  - 滑鼠懸停時卡片微微浮起

- **卡片內容**（橫向佈局 - 560×420px）:
  - **左側**：圓形頭像框（當前卡片為品牌色邊框）
  - **右側文字區**：
    - 姓名、職稱、年資標籤
    - 個人簡介：教育背景和專長描述
    - 經歷列表：詳細工作經歷（僅當前卡片顯示）
    - 聯絡按鈕：Email、電話、LinkedIn 圖標（僅當前卡片顯示）

### 團隊成員範例
預設包含四位成員：
1. **陳以森** - 創辦人 / 主設計師 (18+ 年經驗)
2. **林雅琪** - 資深設計師 (12+ 年經驗)
3. **王明哲** - 建築師 (10+ 年經驗)
4. **張詩涵** - 空間設計師 (8+ 年經驗)

### 互動特性
- **自動輪播**: 每 5 秒自動切換
- **手動控制**:
  - 左右箭頭按鈕切換成員（位於卡片容器兩側，垂直居中）
  - 底部指示點快速跳轉
  - 點擊背景卡片直接切換
- **動畫效果**:
  - 600ms 流暢切換動畫
  - 卡片位置、旋轉、縮放同步變化
  - 當前卡片內容淡入效果
- **控制按鈕佈局**:
  - 左右切換按鈕固定在卡片區域兩側（z-index: 60）
  - 指示點居中顯示在卡片下方

### 視覺特點
- **3D 透視效果**: 使用 CSS perspective 創造深度感
- **層次分明**: 通過 z-index、透明度、亮度營造空間層次
- **品牌色強調**: 當前成員使用品牌色突出重點
- **漸層背景**: 淺色漸層背景增加質感
- **陰影效果**: 豐富的陰影層次提升立體感

### 與 Section3 的差異
- **展示方式**: Section3 為水平輪播，Section2 為 3D 扇形層疊
- **視覺焦點**: Section3 中央放大，Section2 前後層疊+透視旋轉
- **卡片佈局**: Section3 垂直佈局（圖上文下），Section2 橫向佈局（左圖右文）
- **卡片尺寸**: Section3 較窄（適合圖片），Section2 較寬（560px，適合文字內容）
- **互動方式**: Section3 側邊預覽，Section2 扇形展開+點擊切換
- **動畫效果**: Section3 水平滑動，Section2 3D 旋轉+模糊漸變
- **設計風格**: Section3 簡潔平面，Section2 立體創意+強烈透視感

## Section3 Connect 設計案例展示

設計案例輪播展示區塊，展示 5 個設計項目。

### 設計元素
- **標題區域**: 水平跑馬燈展示品牌文字圖片
  - 5 張品牌文字圖片循環滾動
  - connect、compose、coedge、cohort、collective
  - 30秒完成一次循環，無限滾動
- **輪播功能**:
  - 同時顯示 3 張卡片（前一張、當前、下一張）
  - 中央卡片為焦點，兩側卡片半透明（60% 不透明度）
  - 左右箭頭按鈕切換
  - 底部指示點顯示當前位置
- **卡片設計**:
  - 圖片固定高度 300px，確保所有卡片高度統一
  - 內容區域最小高度 160px，防止文字長度影響布局
  - 編號 + 標題（編號為品牌藍）
  - 描述文字支援換行

### 五個項目
1. **01 設計客廳** - 當代客廳的骨架設計
2. **02 當代設計書房** - 極簡線條與光線
3. **03 當代廚房** - 簡約廚房設計
4. **04 當代臥室** - 極簡臥室設計
5. **05 當代浴室** - 極簡浴室設計

### 所需圖片資源

請將以下圖片放到 `public/` 目錄：

**品牌文字圖片（跑馬燈）**：
- `connect-blue.png` - connect 品牌文字
- `compose-blue.png` - compose 品牌文字
- `coedge-blue.png` - coedge 品牌文字
- `cohort-blue.png` - cohort 品牌文字
- `collective-blue.png` - collective 品牌文字

**設計案例圖片（輪播）**：
- `section3-1.jpg` - 設計客廳圖片
- `section3-2.jpg` - 當代設計書房圖片
- `section3-3.jpg` - 當代廚房圖片
- `section3-4.jpg` - 當代臥室圖片
- `section3-5.jpg` - 當代浴室圖片

### 特點
- **智能跑馬燈 + Slogan 切換**：
  - 頂部展示 5 個品牌文字圖片無限循環滾動
  - 當區塊滾動到視窗垂直居中時，跑馬燈自動暫停並淡出
  - 同時顯示 "this is my motto" 標語，帶淡入+縮放動畫
  - 離開中央時恢復跑馬燈滾動，標語淡出
  - 700ms 流暢過渡動畫
- **三張並排展示**：1:2:1 比例（左小-中大-右小），視覺層次清晰
- **中央大卡片**：完整展示當前項目，包含大圖 + 完整標題描述
- **側邊小預覽**：
  - 左側顯示上一張，右側顯示下一張
  - 60% 不透明度，hover 時提升到 80%
  - 可點擊切換到該卡片
- **漸變淡入淡出**：切換時平滑過渡，無水平滑動效果
- **邊界處理**：第一張時左側空白，最後一張時右側空白
- **整合式控制列**：底部按鈕 + 指示點居中顯示
- **低調按鈕設計**：半透明白色背景 + 品牌色圖標
- **響應式布局**：桌面三欄，移動端垂直堆疊
- **互動反饋**：側邊卡片 hover 時陰影加深，提示可點擊

## Section4 住客推薦展示

展示曾經居住在此的住客推薦與評價。

### 設計元素
- **標題**: "See Other people Who Have Lived In Our Residence" - 居中顯示
- **內容布局**:
  - 左側：住客資訊與導航
    - 姓名（中英文，中文為品牌藍色）
    - 個人描述（支援多行文字）
    - 左右導航按鈕（圓形邊框按鈕）
  - 右側：住客照片（圓角矩形，4:5 比例）
- **背景色**: 淺灰色 `bg-neutral-100`

### 住客資料範例
預設包含三位住客：
1. **陳以森 (Chen Yi-Sen)** - 建築師背景介紹
2. **王美玲 (Wang Mei-Ling)** - 室內設計師
3. **李俊賢 (Li Jun-Xian)** - 科技創業家

### 所需圖片資源
請將以下圖片放到 `public/` 目錄：
- `testimonial-1.jpg` - 陳以森照片
- `testimonial-2.jpg` - 王美玲照片
- `testimonial-3.jpg` - 李俊賢照片

### 特點
- **左右切換**：點擊按鈕輪播不同住客
- **流暢過渡**：500ms 照片淡入淡出動畫
- **響應式布局**：桌面雙欄，移動端垂直堆疊
- **無限循環**：最後一位後回到第一位
- **優雅按鈕**：圓形邊框按鈕，hover 時變品牌色
- **統一高度**：照片使用 4:5 比例確保視覺平衡

## Section5 Our Service 服務展示

服務項目網格展示區塊，使用互動卡片設計。

### 設計元素
- **標題**: "Our Service" - 左側對齊，大字體
- **網格布局**:
  - 3x2 網格（桌面）/ 2x3（平板）/ 1x6（移動端）
  - 所有服務一次性展示，無輪播
  - 圓角矩形圖片（4:3 比例）
- **互動效果**: 豐富的 hover 動畫
- **背景色**: 白色 `bg-white`

### 服務項目範例
預設包含六個服務：
1. **室內設計規劃** - 從概念到實現，打造理想居住空間
2. **空間改造服務** - 賦予舊空間新生命，重新定義生活方式
3. **家具配置諮詢** - 精選家具，創造和諧的空間美學
4. **材質選配建議** - 探索質感與耐用性的完美平衡
5. **燈光設計規劃** - 用光影塑造空間氛圍與層次
6. **專案全程管理** - 從設計到完工，全方位專業服務

### 所需圖片資源
請將以下圖片放到 `public/` 目錄：
- `service-1.jpg` 到 `service-6.jpg`

### 特點
- **網格布局**：所有服務同時展示，一目了然
- **豐富互動效果**：
  - **hover 浮起**：卡片向上移動 8px（-translate-y-2）
  - **陰影加深**：從 shadow-md 變為 shadow-2xl
  - **圖片放大**：圖片 scale 到 110%
  - **漸層遮罩**：底部黑色漸層淡入
  - **描述顯示**：hover 時底部顯示服務描述文字
  - **標題變色**：hover 時標題變品牌藍色
- **流暢動畫**：300-500ms 過渡效果
- **響應式網格**：自動適應不同螢幕尺寸
- **視覺層次**：使用陰影、縮放、顏色變化創造深度感
- **無按鈕設計**：簡潔乾淨，專注於內容展示

## Section6 QA 問答區

常見問題手風琴式展開區塊。

### 設計元素
- **左側**:
  - 大標題 "QA"（超大字體）
  - 設計理念描述文字（灰色小字）
    - 線條簡潔、比例純粹
    - 當代住宅不唯噩於形
    - 而讓空間自己說話
    - 少一分裝飾，多一分真實
- **右側**:
  - FAQ 列表（手風琴式展開）
  - 每個問題卡片包含：
    - 問題標題
    - 展開/收合按鈕（+ / - 圓形圖標）
    - 答案內容（展開時顯示）
- **背景色**: 淺灰色 `bg-neutral-100`

### 問答內容範例
預設包含五個常見問題：
1. **你怎麼定義「當代設計」？**
   - 對我來說，當代設計不是一種風格，而是一種態度...
2. **你的靈感通常來自哪裡？**
3. **你認為好的空間設計，應該具備什麼？**
4. **你的工作室有什麼理念？**
5. **你最想透過設計傳達什麼？**

### 特點
- **手風琴展開**：點擊問題展開/收合答案，一次只能展開一個
- **流暢動畫**：500ms 展開/收合過渡效果
- **視覺回饋**：
  - 展開狀態：- 按鈕（品牌藍背景 + 白色圖標）
  - 收合狀態：+ 按鈕（邊框 + 灰色圖標，hover 變品牌色）
- **卡片設計**：白色圓角卡片，帶陰影效果
- **響應式布局**：桌面左右雙欄（1:2 比例），移動端垂直堆疊
- **預設展開第一個**：頁面載入時第一個問題預設展開
- **滑動 hover 效果**：卡片 hover 時陰影加深

## 核心數據模型

### ContentBlock (Prisma)
```prisma
model ContentBlock {
  id        Int      @id @default(autoincrement())
  key       String   @unique
  payload   Json     @default("{}")
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

每個內容類型（`homePage`, `logo`, `color` 等）都存儲為一個 `ContentBlock` 記錄，`key` 是唯一識別符，`payload` 是 JSON 格式的彈性數據。

## 技術棧

- **Framework**: Next.js 15
- **GraphQL**: GraphQL Yoga
- **ORM**: Prisma
- **Auth**: NextAuth.js
- **Styling**: Tailwind CSS v4
- **Language**: TypeScript
- **Package Manager**: pnpm

## 品牌色系

專案使用固定的品牌色系（已配置於 `tailwind.config.ts` 和 `globals.css`，不從資料庫動態讀取）：

### 主色
- **品牌主色**: `#1d2088` (RGB: 29, 32, 136) - 深藍紫色
  - Tailwind 類別: `bg-brand-primary`, `text-brand-primary`
  - CSS 變量: `var(--color-brand-primary)`

### 輔助色
- **白色**: `#ffffff` - `neutral-50`
- **淺灰**: `#f2f2f2` - `neutral-100`
- **灰色**: `#afb3b2` - `neutral-200`
- **深灰**: `#57524c` - `neutral-300`
- **黑色**: `#000000` - `neutral-900`

### 使用範例
```tsx
// Tailwind 類別
<div className="bg-brand-primary text-white">品牌主色背景</div>
<p className="text-neutral-300">深灰色文字</p>

// CSS 變量
<div style={{ backgroundColor: 'var(--color-brand-primary)' }}>
  使用 CSS 變量
</div>
```

## 注意事項

- 永遠使用 `pnpm` 來安裝套件
- Port 3000 為預設開發端口，如被佔用會自動終止並重啟
- 禁止使用 `--accept-data-loss` 標記執行 Prisma 遷移
- 所有錯誤會完整顯示在前端便於調試

## 授權

此為基底模板專案，可自由用於任何專案開發。

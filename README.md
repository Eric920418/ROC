# Next.js Base Template

一個乾淨的 Next.js + GraphQL + Prisma 基底專案模板，保留可自定義後台管理功能，讓你快速開始新專案開發。

## 核心功能

### 前台
- Next.js 15 App Router 架構
- 首頁 (`/`) 包含多個設計區塊
  - Section1：當代設計展示區
  - Marquee：品牌跑馬燈 + 動態標語區（獨立組件）
  - Section7：服務地點展示區（台北/台中/海外 + 圓形圖片組合）
  - Section2：Team Members 團隊成員展示區（3D層疊卡片）
  - Section3：Connect 設計案例展示區（全屏沉浸式展示）
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
  - **论坛分类** (`/admin/forum-categories`) - 管理论坛分类/板块
  - **论坛帖子** (`/admin/forum-posts`) - 管理帖子（置顶、锁定、删除）

### 技術架構
- **GraphQL Yoga** - API 層
- **Prisma ORM** - 資料庫管理
- **ContentBlock 模型** - 彈性的 JSON 存儲，支援任意內容結構
- **論壇數據模型** - Category、Post、Comment（支援嵌套回復）
- **CKEditor** - 富文本編輯器
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

**⚠️ 重要：首先确保你的 PostgreSQL 数据库已启动并可访问**

运行数据库迁移，创建所有表（包括论坛系统）：

```bash
pnpm prisma migrate dev
```

如果这是首次运行，系统会提示你创建迁移名称，输入如 `init` 即可。

**验证数据库表是否创建成功：**

```bash
pnpm prisma studio
```

这会打开 Prisma Studio 可视化界面，你应该能看到以下表：
- `ContentBlock` - 内容管理
- `IpBlocklist` - IP 黑名单
- `Category` - 论坛分类
- `Post` - 论坛帖子
- `Comment` - 论坛评论

### 4. 启动开发服务器
```bash
pnpm dev
```

访问以下页面：
- `http://localhost:3000` - 前台首页
- `http://localhost:3000/forum` - 论坛首页
- `http://localhost:3000/admin/login` - 后台登录

### 5. 初始化论坛数据（可选）

首次使用论坛系统时，建议先创建一些分类：

1. 访问 `http://localhost:3000/admin/forum-categories`
2. 点击"新建分类"按钮
3. 创建几个分类，例如：
   - 名称：`技术讨论`，URL 别名：`technology`，图标：`💻`
   - 名称：`设计分享`，URL 别名：`design`，图标：`🎨`
   - 名称：`生活随笔`，URL 别名：`life`，图标：`📝`

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

## 论坛系统完整功能

### 前台功能

#### 论坛首页 (`/forum`)
**设计风格**：参考 "Culture - Destination" 杂志风格设计

- **顶部导航**：
  - 左侧：Destination. 品牌标识
  - 右侧：发帖按钮（Material Icons + 文字）

- **大标题区域**：
  - "Forum" 超大标题（Playfair Display，text-5xl md:text-7xl）
  - 分类导航：不同大小和字体的混合排版
    - 第1个分类：Playfair Display 斜体 + 大字（text-2xl md:text-3xl）
    - 第2个分类：Montserrat 普通（text-lg md:text-xl）
    - 第3个分类：Montserrat 细体（text-base font-light）
    - 第4个分类：Playfair Display 中等（text-xl md:text-2xl）
    - hover 时缩放 110%

- **帖子卡片网格**：
  - 3列网格布局（grid-cols-1 md:grid-cols-2 lg:grid-cols-3）
  - 每列间距：gap-16 md:gap-12
  - 第2列卡片垂直偏移 md:mt-16（创造视觉层次）
  - **卡片设计**：
    - 4:3 比例圆角图片（rounded-xl）
    - hover 时图片放大 105%（duration-500）
    - hover 时显示分类色覆盖层（透明度 20%）
    - 标题使用 Playfair Display（font-display text-2xl）
    - "Read more" 链接 + 分享图标（Material Icons）

- **底部分页器**（杂志风格）：
  - 左侧：← Home 返回首页
  - 中间：01 • 09 页码指示器（font-mono）
  - 右侧：← Prev | Next → （Next 使用品牌色）
  - 禁用状态：opacity-30

- **图标系统**：
  - 使用 Material Icons Outlined
  - 继承父元素字体大小

#### 帖子详情页 (`/forum/[slug]`)
- **面包屑导航**：首页 > 论坛 > 分类 > 标题
- **帖子内容**：
  - 封面大图
  - 富文本内容（支持格式化）
  - 作者信息、发布时间
  - 浏览数、评论数
  - 置顶/锁定状态标识
- **评论系统**：
  - 发表评论（需填写昵称）
  - 回复评论（嵌套显示）
  - 评论按时间排序
  - 锁定帖子禁止评论
- **自动增加浏览数**

#### 发帖页面 (`/forum/new`)
- **富文本编辑器**：基于 CKEditor，支持：
  - 标题、粗体、斜体
  - 列表（有序/无序）
  - 链接、引用
  - 表格
- **字段填写**：
  - 标题（必填）
  - URL 别名（必填，可自动生成）
  - 分类选择
  - 封面图片 URL（可选，实时预览）
  - 摘要（可选）
  - 作者信息（昵称 + 邮箱）
- **实时验证**：提交前检查必填字段
- **错误提示**：完整显示前端错误信息

### 后台功能

#### 分类管理 (`/admin/forum-categories`)
- **CRUD 操作**：
  - 创建分类（名称、URL 别名、描述、图标、颜色、排序）
  - 编辑分类（实时更新）
  - 删除分类（级联删除相关帖子，需确认）
- **可视化表格**：
  - 显示分类图标、名称、帖子数
  - 颜色圆点标识
  - 排序字段控制顺序
- **表单验证**：必填字段检查

#### 帖子管理 (`/admin/forum-posts`)
- **帖子列表**：
  - 表格展示所有帖子
  - 分类标签（带颜色）
  - 浏览数、评论数统计
  - 置顶/锁定状态图标
- **快捷操作**：
  - 一键置顶/取消置顶
  - 一键锁定/解锁（锁定后禁止评论）
  - 删除帖子（级联删除评论，需确认）
- **分页导航**：每页 20 条
- **新建帖子**：跳转到前台发帖页面

### GraphQL API

#### Category API
```graphql
# 查询所有分类
query {
  categories {
    id
    name
    slug
    color
    postCount
  }
}

# 创建分类
mutation {
  createCategory(input: {
    name: "技术讨论"
    slug: "technology"
    description: "讨论技术话题"
    icon: "💻"
    color: "#1d2088"
  }) {
    id
    name
  }
}
```

#### Post API
```graphql
# 查询帖子列表（分页、筛选）
query {
  posts(page: 1, pageSize: 20, categoryId: 1) {
    posts {
      id
      title
      slug
      excerpt
      coverImage
      author
      views
      commentCount
      category {
        name
        color
      }
    }
    total
    hasMore
  }
}

# 创建帖子
mutation {
  createPost(input: {
    title: "帖子标题"
    slug: "post-slug"
    content: "<p>富文本内容</p>"
    excerpt: "摘要"
    author: "作者"
    categoryId: 1
  }) {
    id
    slug
  }
}

# 增加浏览数
mutation {
  incrementPostViews(id: 1) {
    views
  }
}
```

#### Comment API
```graphql
# 查询帖子评论
query {
  comments(postId: 1) {
    id
    content
    author
    createdAt
    replies {
      id
      content
      author
    }
  }
}

# 发表评论
mutation {
  createComment(input: {
    postId: 1
    author: "用户"
    content: "评论内容"
  }) {
    id
  }
}

# 回复评论
mutation {
  createComment(input: {
    postId: 1
    parentId: 2
    author: "用户"
    content: "回复内容"
  }) {
    id
  }
}
```

## 專案結構

```
├── app/
│   ├── admin/          # 後台管理頁面
│   ├── api/            # API 路由（GraphQL, 檔案上傳）
│   ├── forum/          # 论坛前台页面
│   │   ├── page.tsx         # 论坛首页
│   │   ├── [slug]/page.tsx  # 帖子详情页
│   │   └── new/page.tsx     # 发帖页面
│   ├── layout.tsx      # 根布局（包含 Header）
│   └── page.tsx        # 前台首頁
├── graphql/
│   ├── schemas/        # GraphQL schema 定義
│   │   ├── Category.graphql  # 论坛分类 schema
│   │   ├── Post.graphql      # 论坛帖子 schema
│   │   ├── Comment.graphql   # 论坛评论 schema
│   │   └── ...
│   ├── resolvers.ts    # GraphQL resolvers（包含论坛 API）
│   └── utils/
│       └── defaults.ts # 內容類型預設值
├── prisma/
│   └── schema.prisma   # 資料庫模型（包含 Category, Post, Comment）
├── public/
│   ├── R.coLogo.png    # 品牌 Logo
│   └── icons/          # 其他圖標資源
├── src/components/
│   ├── Header.tsx              # 全局導航欄
│   ├── Footer.tsx              # 頁尾組件
│   ├── CKEditor.tsx            # 富文本編輯器組件
│   ├── MoveToTop.tsx           # 返回頂部按鈕
│   ├── ModalContext.tsx        # Modal 狀態管理
│   ├── ClientLayoutWrapper.tsx # 客戶端布局包裝器（條件渲染 Header/Footer）
│   ├── Section1.tsx            # 首頁 Section1 當代設計區塊
│   ├── Marquee.tsx             # 品牌跑馬燈 + 動態標語區（獨立組件）
│   ├── Section7.tsx            # 首頁 Section7 服務地點展示區（台北/台中/海外）
│   ├── Section2.tsx            # 首頁 Section2 團隊成員區塊（3D層疊卡片）
│   ├── Section3.tsx            # 首頁 Section3 Connect 設計案例區塊（輪播）
│   ├── Section4.tsx            # 首頁 Section4 住客推薦展示區塊（輪播）
│   ├── Section5.tsx            # 首頁 Section5 Our Service 服務展示區塊（輪播）
│   ├── Section6.tsx            # 首頁 Section6 QA 問答區塊（手風琴）
│   ├── Forum/                  # 论坛组件
│   │   ├── CommentSection.tsx  # 评论区组件
│   │   └── NewPostForm.tsx     # 发帖表单组件
│   ├── Admin/                  # 後台共用組件
│   │   └── Sidebar.tsx         # 侧边栏（已添加论坛管理链接）
│   └── Edit/                   # 內容編輯器組件
│       ├── ForumCategories.tsx # 论坛分类管理
│       └── ForumPosts.tsx      # 论坛帖子管理
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

## Marquee 品牌組合展示區

位於 Section1 和 Section7 之間的獨立品牌展示區塊，採用「固定 Logo + 後綴輪播」的創新設計。

### 設計元素
- **組合展示**:
  - 左側：R.co Logo 固定顯示（`R.coLogo.png`）
  - 右側：後綴圖片定時輪播
  - 組合效果：視覺上呈現 "R.coEdge"、"R.connect"、"R.compose" 等完整品牌詞

### 輪播效果
- **自動切換**：每 2 秒切換一次後綴圖片
- **輪播順序**：Edge → nnect → mpose → hort → llective → 循環
- **過渡動畫**：700ms 淡入淡出 + 輕微縮放效果（scale 95% → 100%）
- **無限循環**：自動循環播放，無需手動操作

### 所需圖片資源
請將以下圖片放到 `public/` 目錄：
- `R.coLogo.png` - R.co 品牌 Logo（固定顯示）
- `coEdge-blue.png` - "Edge" 後綴圖片（已修圖，僅包含後綴部分）
- `connect-blue.png` - "nnect" 後綴圖片（已修圖，僅包含後綴部分）
- `compose-blue.png` - "mpose" 後綴圖片（已修圖，僅包含後綴部分）
- `cohort-blue.png` - "hort" 後綴圖片（已修圖，僅包含後綴部分）
- `collective-blue.png` - "llective" 後綴圖片（已修圖，僅包含後綴部分）

**注意**：後綴圖片必須是已裁切過的版本，不包含 "R.co" 前綴，才能與 Logo 組合呈現完整品牌詞。

### 特點
- **獨立組件**：從 Section3 分離出來，成為獨立區塊
- **創新佈局**：突破傳統跑馬燈，採用固定 + 輪播的組合方式
- **流暢動畫**：700ms CSS 過渡效果，視覺流暢自然
- **精準定時**：2 秒間隔，節奏適中
- **響應式尺寸**：根據螢幕尺寸自動調整 Logo 和後綴圖片大小
- **品牌色系**：圖片使用品牌藍色 `#1d2088`
- **絕對定位輪播**：使用絕對定位實現後綴圖片的疊加輪播效果

## Section7 服務地點展示區

位於 Marquee 和 Section2 之間的服務據點展示區塊，採用獨特的圓形圖片組合設計，強調服務地點與範圍。

### 設計元素
- **左側文字區域**:
  - "立足台灣 / 放眼全球" 大標題（深色粗體，雙行顯示）
  - 服務地點描述：
    - 「從台北到台中，我們在台灣深耕多年...」
    - 「同時，我們的服務觸角延伸至海外...」
  - 互動式區域選擇器（台北、台中、海外）
    - 台北：圓角矩形，品牌藍色
    - 台中：圓形，品牌藍色
    - 海外：橢圓形，中性灰色
    - 懸停縮放效果（scale 1.05）+ 字體加粗

- **右側圖片組合**:
  - 三個不同尺寸的圓形圖片藝術化排列
  - 左側圓形（中等）- 垂直居中
  - 右上圓形（小）- 縮放 1.5x 顯示特寫
  - 右下圓形（大）- 主視覺焦點
  - 裝飾性 SVG 曲線路徑連接圖片
  - 浮動裝飾方塊（背景）

### 動畫效果
- **進入動畫**（Intersection Observer）:
  - 左側內容：從左側滑入 + 淡入（1000ms）
  - 右側圖片：從右側滑入 + 淡入（1000ms，延遲 300ms）
- **SVG 路徑繪製**:
  - stroke-dasharray 繪製動畫（2000ms）
  - 路徑從不可見到可見的平滑過渡
- **圖片懸停效果**:
  - 圖片縮放 110%（500ms）
  - 內部圖片二次縮放（背景圖放大）
  - 白色邊框加粗（4px → 8px）
  - 陰影效果增強
- **裝飾方塊浮動**:
  - 持續上下浮動動畫（6-8 秒循環）
  - 輕微旋轉效果（±5 度）
  - 不同延遲創造錯落感

### 配色方案
- **品牌主色**: `#1d2088` (bg-brand-primary) - 台北、台中選擇器
- **中性色**: `#afb3b2` (bg-neutral-200) - 海外選擇器、裝飾方塊
- **背景**: 白色 (bg-white)
- **文字**: 深灰色 (text-neutral-900)、灰色 (text-neutral-300)

### 技術特性
- **Intersection Observer**: 滾動到視窗時觸發進場動畫（threshold: 0.2）
- **CSS 動畫**:
  - `@keyframes float` - 浮動動畫
  - `@keyframes draw-path` - SVG 路徑繪製動畫
- **響應式設計**:
  - 桌面：左右雙欄（5:7 比例）
  - 移動：垂直堆疊
- **Radio 按鈕組**: 使用原生 radio 實現單選功能
- **背景裝飾**: 使用 backdrop-blur 和半透明色創造層次感

### 使用圖片
組件使用 Unsplash 佔位圖片，實際項目中應替換為品牌相關圖片：
- 左側圖片建議：抽象藝術、色彩漸變
- 右上圖片建議：細節特寫、質感紋理
- 右下圖片建議：主視覺、品牌形象

### 特點
- **藝術化佈局**: 打破傳統網格，採用自由浮動的圓形圖片排列
- **視覺層次**: 通過尺寸對比、z-index、裝飾元素創造空間深度
- **互動性強**: 多重懸停效果、縮放動畫、區域選擇器
- **品牌色貫穿**: 與整體設計系統一致的配色方案
- **流暢動畫**: 長時間過渡（1000ms+）創造優雅感
- **SVG 裝飾**: 使用 SVG 路徑增加藝術感和設計感

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
- **展示方式**: Section3 為全屏沉浸式背景，Section2 為 3D 扇形層疊卡片
- **視覺焦點**: Section3 全屏背景 + 懸浮 UI，Section2 前後層疊+透視旋轉
- **卡片佈局**: Section3 三欄式（左導航-中圖-右內容），Section2 橫向卡片（左圖右文）
- **卡片尺寸**: Section3 全屏背景圖，Section2 固定 560px 寬卡片
- **互動方式**: Section3 左側導航點擊切換，Section2 扇形展開+點擊切換
- **動畫效果**: Section3 背景淡入淡出，Section2 3D 旋轉+模糊漸變
- **設計風格**: Section3 沉浸式+毛玻璃懸浮，Section2 立體創意+強烈透視感
- **配色方案**: Section3 深色背景+琥珀色強調，Section2 淺色背景+品牌藍強調

## Section3 Connect 設計案例展示

**全屏沉浸式設計案例展示**，採用背景全屏圖片 + 懸浮 UI 的創新設計，展示 5 個室內設計項目。

### 設計理念
- **全屏背景圖片**：當前項目的圖片佔滿整個視窗，營造沉浸式體驗
- **懸浮 UI 設計**：所有交互元素採用毛玻璃效果懸浮在背景之上
- **三欄式佈局**：左側項目導航 + 中間主視覺區 + 右側內容介紹

### 設計元素

#### 左側：項目導航區
- **背景**: 白色半透明 (bg-white/10) + 毛玻璃效果 (backdrop-blur-lg)
- **邊框**: 白色半透明邊框 (border-white/20)
- **標題**: "空間探索 / SPACE EXPLORATION"
- **導航按鈕**:
  - 當前項目：琥珀色漸層背景 (amber-400 → amber-500) + 黑色文字 + 微縮放
  - 其他項目：半透明白色背景 + 白色文字 + hover 效果
  - 每個按鈕包含：編號 + 項目名稱 + 箭頭圖標
  - 點擊切換項目，帶 300ms 流暢過渡

#### 中間：主視覺區域
- **尺寸**: 響應式比例（手機 9:14，桌面 16:9）
- **邊框**: 圓角矩形 (rounded-2xl) + 白色半透明邊框
- **內容**: 當前項目的高品質大圖
- **底部標籤**: 黑色漸層遮罩 + 項目編號 (琥珀色) + 項目名稱

#### 右側：內容資訊區
- **背景**: 白色半透明 (bg-white/10) + 毛玻璃效果
- **內容結構**:
  - 進度條：琥珀色漸層條 + 頁碼 (01/05)
  - 項目標題：大字體粗體 (3xl-4xl)
  - 副標題：琥珀色中等字體 (新增欄位)
  - 項目描述：白色文字，支援多行
  - CTA 按鈕：琥珀色漸層 "探索更多" + 箭頭圖標 + hover 縮放效果
  - 指示器：底部小圓點顯示當前項目位置

### 五個項目（已更新）
1. **01 設計客廳** - 當代生活的核心空間
2. **02 當代設計書房** - 思考與創作的聖地
3. **03 當代廚房** - 料理與生活的交會
4. **04 當代臥室** - 寧靜休憩的避風港
5. **05 當代浴室** - 私密的療癒空間

### 所需圖片資源

請將以下圖片放到 `public/` 目錄：
- `section3-1.jpg` - 設計客廳圖片（建議：溫暖的客廳空間）
- `section3-2.jpg` - 當代設計書房圖片（建議：極簡書桌場景）
- `section3-3.jpg` - 當代廚房圖片（建議：現代開放式廚房）
- `section3-4.jpg` - 當代臥室圖片（建議：寧靜臥室氛圍）
- `section3-5.jpg` - 當代浴室圖片（建議：現代浴室設計）

### 視覺特點
- **全屏背景**：項目圖片填滿整個區塊 (min-h-screen)，配合深色漸層遮罩 (bg-gradient-to-b from-black/40 via-black/30 to-black/50)
- **毛玻璃效果**：所有 UI 卡片使用 backdrop-blur-lg 創造景深感
- **琥珀色系**：使用琥珀色 (amber-400/500) 作為強調色，與深色背景形成高對比
- **流暢動畫**：
  - 背景圖切換：700ms 過渡效果
  - 導航按鈕：300ms 過渡 + 縮放效果
  - CTA 按鈕：hover 時 1.05 倍縮放
- **陰影層次**：所有卡片使用 shadow-2xl 創造立體感
- **響應式佈局**：
  - 桌面 (lg+)：三欄式 grid (3-6-3 比例)
  - 移動端：垂直堆疊，導航在上，主圖居中，內容在下

### 互動特性
- **點擊導航切換**：點擊左側任一項目立即切換背景和內容
- **視覺反饋**：當前項目高亮顯示（琥珀色背景 + 縮放）
- **指示器**：底部小圓點實時顯示當前項目位置，可點擊跳轉
- **CTA 按鈕**：探索更多按鈕提供進一步操作入口

### 與參考設計的對齊
- ✅ **背景圖佔據整個區塊**：使用 absolute inset-0 實現全屏覆蓋
- ✅ **UI 懸浮在上面**：使用 relative z-10 確保內容層在背景之上
- ✅ **毛玻璃效果**：backdrop-blur-lg + 半透明背景
- ✅ **三欄式佈局**：grid grid-cols-12 實現左中右結構
- ✅ **配色協調**：琥珀色 (amber) 作為強調色，白色/黑色作為輔助色

### 技術實現
- **圖片優化**：使用 Next.js Image 組件，設置 priority 和 sizes 屬性
- **狀態管理**：useState 追蹤當前項目索引 (currentIndex)
- **響應式圖片**：sizes="100vw" 確保背景圖使用全屏尺寸
- **無障礙設計**：所有按鈕包含 aria-label 標籤

## Section4 客戶回饋展示

**全屏沉浸式客戶見證區塊**，採用左側大圖 + 右側見證卡片的設計，展示客戶對服務的真實評價。

### 設計理念
- **左側全屏背景圖**：客戶空間的實景照片佔據 3/5 寬度，營造沉浸式體驗
- **右側見證卡片**：2/5 寬度的白色卡片，包含完整的客戶回饋內容
- **極簡導航**：右下角圓點指示器，點擊切換不同客戶回饋

### 設計元素

#### 左側：背景圖片區（3/5 寬度）
- **尺寸**: 桌面端 60% 寬度，移動端 100% 寬度（高度 400px）
- **圖片**: 客戶空間的高品質實景照片
- **遮罩**: 10% 黑色半透明遮罩增加層次感
- **過渡**: 700ms 淡入淡出切換動畫

#### 右側：見證卡片區（2/5 寬度）
- **標籤**: "CLIENT TESTIMONIALS" 大寫字母，灰色小字
- **回饋標題**: 粗體大字（3xl-4xl），黑色
- **回饋內容**: 灰色正文，行距舒適
- **CTA 連結**:
  - 「查看更多客戶回饋」+ 動態底線 + 箭頭圖標
  - hover 時文字變品牌藍色
  - 底線從左到右延伸（300ms 過渡）
  - 箭頭向右移動

#### 導航點（右下角）
- **位置**: 絕對定位於卡片區右下角
- **樣式**: 小圓點（2x2px）
- **當前項**: 品牌藍色填滿
- **其他項**: 灰色半透明，hover 時加深
- **互動**: 點擊切換，500ms 過渡

### 客戶回饋範例
預設包含三則回饋：
1. **"這是我人生中最放鬆、最無可挑剔的旅程體驗！"**
   - 強調服務團隊的專業與溝通
2. **"空間設計超越期待，每個細節都讓人驚艷"**
   - 強調設計創新與生活方式契合
3. **"專業、用心、值得信賴的設計團隊"**
   - 強調施工品質與細節處理

### 所需圖片資源
請將以下圖片放到 `public/` 目錄：
- `testimonial-1.jpg` - 第一則回饋的空間實景
- `testimonial-2.jpg` - 第二則回饋的空間實景
- `testimonial-3.jpg` - 第三則回饋的空間實景

**建議圖片風格**：高品質的室內空間照片，展示設計成果

### 視覺特點
- **全屏背景**：左側圖片填滿容器高度（min-h-720px），配合淺色遮罩
- **卡片設計**：白色背景 + 圓角（rounded-xl）+ 深度陰影（shadow-xl）
- **品牌色系**：
  - 主要強調：品牌藍 `#1d2088`（導航點、hover 效果）
  - 中性色：灰色系（標籤、描述文字）
- **流暢動畫**：
  - 背景圖切換：700ms 過渡
  - 導航點切換：300ms 過渡
  - CTA hover：300ms 底線延伸 + 箭頭位移
- **響應式佈局**：
  - 桌面 (lg+)：左右並排（3:2 比例）
  - 移動端：垂直堆疊，圖片在上

### 互動特性
- **點擊導航點切換**：點擊底部圓點立即切換回饋內容和背景圖
- **視覺反饋**：當前圓點高亮顯示（品牌藍色）
- **防抖動機制**：切換時禁用按鈕，避免快速連點
- **CTA 互動**：hover 時多重動畫效果（文字變色 + 底線延伸 + 箭頭移動）

### 與參考設計的對齊
- ✅ **左側全屏背景圖**：使用 absolute inset-0 + Next.js Image
- ✅ **右側卡片浮於表面**：白色背景 + 深度陰影
- ✅ **圓角設計**：rounded-xl 匹配參考設計
- ✅ **導航點**：右下角絕對定位
- ✅ **動態底線**：使用 CSS transition 實現寬度變化
- ✅ **配色統一**：使用品牌藍 `#1d2088` 替代參考的琥珀色

### 技術實現
- **圖片優化**：使用 Next.js Image 組件，設置 priority 和 sizes 屬性
- **狀態管理**：useState 追蹤當前索引 (currentIndex)
- **防抖動**：isTransitioning 狀態防止快速切換
- **響應式圖片**：sizes="(max-width: 1024px) 100vw, 60vw"
- **無障礙設計**：導航點包含 aria-label 標籤
- **圖標系統**：使用 lucide-react 的 ArrowRight 替代 Material Icons

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

## 字體配置

專案使用本地字體文件，通過 Next.js 的 `next/font/local` 進行優化加載：

### 字體文件
- **英文字體**: Montserrat（變量字體，支援所有字重）
  - 位置: `/public/Montserrat,Noto_Sans_TC/Montserrat/`
  - 包含正常和斜體兩種樣式
- **中文字體**: Noto Sans TC（變量字體，支援所有字重）
  - 位置: `/public/Noto_Sans_TC 2/`
  - 繁體中文專用字體

### 字體堆疊策略
```css
font-family: var(--font-montserrat), var(--font-noto-sans-tc), sans-serif;
```

瀏覽器會自動根據字符類型選擇合適的字體：
- **拉丁字母、數字、符號** → Montserrat
- **中文字符** → Noto Sans TC（Montserrat 不包含中文字形時自動回退）
- **系統默認** → sans-serif（備用方案）

### 技術特性
- **變量字體**: 支援 100-900 所有字重，無需多個字體文件
- **字體優化**: 使用 `display: swap` 避免字體加載時的閃爍
- **CSS 變量**: 通過 `--font-montserrat` 和 `--font-noto-sans-tc` 全局可用
- **性能優化**: Next.js 自動進行字體子集化和預加載

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

## 常見問題

### 论坛系统支持假数据模式（无需数据库）

**✨ 新功能**：论坛系统现在支持无数据库模式，使用假数据即可正常浏览页面！

如果你还没有配置数据库，论坛页面会自动使用假数据运行：
- ✅ 显示 3 个示例分类（技术讨论、设计分享、生活随笔）
- ✅ 显示 2 个示例帖子
- ✅ 页面完全可浏览，无任何错误
- ⚠️ 后台管理功能（创建、编辑、删除）需要真实数据库才能使用

**假数据模式的限制**：
- 无法创建新帖子
- 无法发表评论
- 后台管理功能不可用
- 数据不会持久化

**如何切换到真实数据库**：
配置完成后，系统会自动使用真实数据库，无需任何代码修改。

### 数据库未配置

如果想使用真实数据库（支持创建、编辑功能），请按以下步骤操作：

1. **确保 PostgreSQL 已安装并运行**

2. **创建数据库**：
   ```sql
   CREATE DATABASE your_database_name;
   ```

3. **更新 `.env` 文件**：
   ```env
   DATABASE_URL="postgresql://your_username:your_password@localhost:5432/your_database_name"
   ```

4. **运行数据库迁移**：
   ```bash
   pnpm prisma migrate dev
   ```

5. **验证数据库表**：
   ```bash
   pnpm prisma studio
   ```
   访问 http://localhost:5555 查看数据库表结构

### 论坛页面显示空白

如果论坛页面显示"暂无分类"或"暂无帖子"：

1. 先创建分类：访问 `/admin/forum-categories` 创建至少一个分类
2. 创建测试帖子：访问 `/forum/new` 发布第一个帖子
3. 检查数据库：使用 `pnpm prisma studio` 确认数据已保存

### GraphQL 错误

所有 GraphQL 错误会完整显示在前端，包括：
- 数据库连接错误
- 验证错误
- 权限错误
- 数据不存在错误

请查看浏览器控制台或页面错误提示获取详细信息。

## 授權

此為基底模板專案，可自由用於任何專案開發。

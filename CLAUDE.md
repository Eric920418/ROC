# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 開發指令

```bash
pnpm dev          # 啟動開發伺服器（含 Turbopack）
pnpm build        # 生產構建
pnpm lint         # ESLint 檢查
pnpm prisma migrate dev   # 執行資料庫遷移
pnpm prisma studio        # 開啟資料庫管理 UI
```

> 僅使用 `pnpm` 管理套件，禁止使用 `--accept-data-loss` 執行 Prisma 遷移。

## 架構概覽

### 資料流

```
前台/後台頁面 (app/)
  → Apollo Client (app/providers.tsx)
    → POST /api/graphql
      → IP 白名單 + JWT Bearer Token 驗證 (app/api/graphql/route.ts)
        → GraphQL Yoga + Resolvers (graphql/resolvers.ts)
          → Prisma ORM → PostgreSQL
```

### GraphQL 安全層

`app/api/graphql/route.ts` 同時做兩件事：
1. **IP 白名單檢查**：支援 CIDR 範圍與單一 IP，本地開發自動放行
2. **JWT Bearer Token 驗證**：透過 `PUBLIC_MUTATIONS` 陣列豁免不需認證的 mutation（`submitContactMessage`、`incrementPostViews`）

若需新增公開 API，將 mutation 名稱加入 `PUBLIC_MUTATIONS` 陣列。

### 內容管理架構

首頁所有區塊（Section1-7、Marquee 等）透過統一的 `ContentBlock` 模型儲存於資料庫：
- `key`：唯一識別字串（如 `"section1"`、`"marquee"`）
- `payload`：JSON 欄位，存放各區塊的任意結構內容

前台讀取時若資料庫無資料，從 `graphql/utils/defaults.ts` 取用假資料，達到無資料庫也能預覽前台的效果。

### 後台管理路由保護

`middleware.ts` 使用 NextAuth 保護所有 `/admin/*` 路由（`/admin/login` 除外）。後台頁面的所有 GraphQL mutation 呼叫需在 HTTP header 帶上 `Authorization: Bearer <token>`。

### 動畫系統

`src/components/AnimatedSection.tsx` 提供兩個 wrapper 組件：
- `HeroAnimation`：頁面載入立即播放（首屏用）
- `AnimatedSection`：Framer Motion 的 `whileInView` 滾動觸發，支援 `fadeUp`、`fadeDown`、`fadeIn`、`slideLeft`、`slideRight`、`scale`

## 關鍵設計決策

- **`next.config.ts`**：TypeScript 建構錯誤已設為忽略（`ignoreBuildErrors: true`），且 React Strict Mode 關閉
- **CKEditor 5**：需要 Premium Features license，設定位於 `src/components/CKEditor.tsx`
- **圖片服務**：上傳圖片存於 `/uploads/` 目錄，透過 `app/api/images/[filename]/route.ts` 提供靜態服務；外部圖片來源需在 `next.config.ts` 的 `remotePatterns` 中加入白名單
- **字體**：`app/layout.tsx` 載入 Montserrat（英文）、Noto Sans TC（中文）、Adobe Caslon Pro（裝飾標題），透過 CSS 變數 `--font-montserrat`、`--font-noto-sans-tc`、`--font-caslon` 使用

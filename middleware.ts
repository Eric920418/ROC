import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

// 中間件配置
export default withAuth(
  function middleware(req) {
    // 檢查是否訪問登入頁面
    if (req.nextUrl.pathname === "/admin/login") {
      return NextResponse.next();
    }

    // 檢查是否已認證
    const token = req.nextauth.token;
    if (!token) {
      // 如果未認證，重定向到登入頁面
      const loginUrl = new URL("/admin/login", req.url);
      return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ req, token }) => {
        // 允許訪問登入頁面
        if (req.nextUrl.pathname === "/admin/login") {
          return true;
        }
        // 其他頁面需要 token
        return !!token;
      },
    },
  }
);

// 配置需要保護的路由
export const config = {
  matcher: [
    // 排除登入頁面，但保護其他 admin 路徑
    "/admin/((?!login).)*",
  ],
};

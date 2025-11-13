import { createSchema, createYoga } from "graphql-yoga";
import { readdirSync, readFileSync } from "fs";
import path from "path";
import resolvers from "../../../graphql/resolvers";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

// IP 白名單設定
const ALLOWED_IP_RANGES = [
  { network: "192.83.179.0", mask: 24 }, // 192.83.179.0/24
  { network: "120.127.1.0", mask: 26 }, // 120.127.1.0/26
  { ip: "140.138.82.103" }, // 單一 IP
  { network: "140.138.0.0", mask: 16 }, // 140.138.0.0/16 允許所有 140.138.x.x
  { ip: "120.127.47.50" },  
  // 本地開發環境常見的 IP 地址
  { ip: "127.0.0.1" },      // IPv4 localhost
  { ip: "::1" },            // IPv6 localhost
  { ip: "localhost" },      // hostname localhost
  { ip: "::ffff:127.0.0.1" }, // IPv4-mapped IPv6 localhost
  { ip: "0.0.0.0" },        // 某些環境下的本地地址
  { ip: "unknown" },        // 當 IP 無法檢測時的備用
];

// IP 地址轉換為數字的函數
function ipToNumber(ip: string): number {
  return ip.split('.').reduce((acc, octet) => (acc << 8) + parseInt(octet, 10), 0) >>> 0;
}

// 檢查 IP 是否在 CIDR 範圍內的函數
function isInCIDR(clientIP: string, network: string, maskBits: number): boolean {
  const clientNum = ipToNumber(clientIP);
  const networkNum = ipToNumber(network);
  const mask = (0xFFFFFFFF << (32 - maskBits)) >>> 0;
  
  return (clientNum & mask) === (networkNum & mask);
}

// 獲取客戶端真實 IP 地址的函數（增強版）
function getClientIP(request: any): string {
  // 收集所有可能的 IP 來源進行調試
  const ipSources = {
    'x-forwarded-for': request.headers.get('x-forwarded-for'),
    'x-real-ip': request.headers.get('x-real-ip'),
    'x-client-ip': request.headers.get('x-client-ip'),
    'cf-connecting-ip': request.headers.get('cf-connecting-ip'),
    'x-forwarded': request.headers.get('x-forwarded'),
    'forwarded-for': request.headers.get('forwarded-for'),
    'forwarded': request.headers.get('forwarded'),
    'request.ip': request.ip,
    'request.connection.remoteAddress': request.connection?.remoteAddress,
    'request.socket.remoteAddress': request.socket?.remoteAddress,
  };

  // 在開發環境下打印所有 IP 來源以便調試
  if (process.env.NODE_ENV === 'development') {
    console.log('🔍 IP 來源調試資訊:');
    Object.entries(ipSources).forEach(([source, value]) => {
      if (value) {
        console.log(`   ${source}: ${value}`);
      }
    });
  }

  // 按優先順序檢查各種可能的 header
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    // x-forwarded-for 可能包含多個 IP，取第一個
    const ip = forwarded.split(',')[0].trim();
    console.log(`📍 使用 x-forwarded-for IP: ${ip}`);
    return ip;
  }
  
  const realIP = request.headers.get('x-real-ip');
  if (realIP) {
    console.log(`📍 使用 x-real-ip IP: ${realIP.trim()}`);
    return realIP.trim();
  }
  
  const clientIP = request.headers.get('x-client-ip');
  if (clientIP) {
    console.log(`📍 使用 x-client-ip IP: ${clientIP.trim()}`);
    return clientIP.trim();
  }
  
  const cfConnectingIP = request.headers.get('cf-connecting-ip');
  if (cfConnectingIP) {
    console.log(`📍 使用 cf-connecting-ip IP: ${cfConnectingIP.trim()}`);
    return cfConnectingIP.trim();
  }
  
  // 檢查其他可能的來源
  if (request.ip) {
    console.log(`📍 使用 request.ip: ${request.ip}`);
    return request.ip;
  }
  
  if (request.connection?.remoteAddress) {
    console.log(`📍 使用 connection.remoteAddress: ${request.connection.remoteAddress}`);
    return request.connection.remoteAddress;
  }
  
  if (request.socket?.remoteAddress) {
    console.log(`📍 使用 socket.remoteAddress: ${request.socket.remoteAddress}`);
    return request.socket.remoteAddress;
  }
  
  // 作為最後備選
  console.log(`📍 使用預設 IP: 127.0.0.1 (無法檢測到真實 IP)`);
  return '127.0.0.1';
}

// IP 白名單驗證函數（增強版）
function isIPAllowed(clientIP: string): boolean {
  // 在開發環境下，提供更寬鬆的檢查
  if (process.env.NODE_ENV === 'development') {
    console.log(`🔧 開發環境模式：檢查 IP ${clientIP}`);
  }

  for (const range of ALLOWED_IP_RANGES) {
    if ('ip' in range) {
      // 單一 IP 檢查（支援各種格式）
      if (clientIP === range.ip) {
        console.log(`✅ IP ${clientIP} 匹配單一 IP 白名單: ${range.ip}`);
        return true;
      }
      
      // 特殊處理：localhost hostname 可能對應到不同的 IP
      if (range.ip === 'localhost' && 
          (clientIP === '127.0.0.1' || clientIP === '::1' || clientIP === 'localhost')) {
        console.log(`✅ IP ${clientIP} 匹配 localhost 白名單`);
        return true;
      }
      
      // 特殊處理：IPv6 localhost 變化
      if ((range.ip === '::1' || range.ip === '127.0.0.1') && 
          (clientIP === '::1' || clientIP === '127.0.0.1' || 
           clientIP === '::ffff:127.0.0.1' || clientIP === 'localhost')) {
        console.log(`✅ IP ${clientIP} 匹配 localhost 變化形式`);
        return true;
      }
    } else {
      // CIDR 範圍檢查（僅適用於 IPv4）
      if (isValidIPv4(clientIP) && isInCIDR(clientIP, range.network, range.mask)) {
        console.log(`✅ IP ${clientIP} 匹配 CIDR 白名單: ${range.network}/${range.mask}`);
        return true;
      }
    }
  }
  
  console.log(`❌ IP ${clientIP} 不在白名單中`);
  
  // 在開發環境下，如果是本地相關的 IP，給出提示
  if (process.env.NODE_ENV === 'development') {
    if (clientIP.includes('127.0') || clientIP.includes('::1') || 
        clientIP === 'localhost' || clientIP === 'unknown') {
      console.log(`💡 提示：您的本地 IP (${clientIP}) 不在白名單中，但您可以將它添加到 ALLOWED_IP_RANGES`);
    }
  }
  
  return false;
}

// 檢查是否為有效的 IPv4 地址
function isValidIPv4(ip: string): boolean {
  const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}$/;
  return ipv4Regex.test(ip);
}

// 嚴格的 token 驗證函數
async function verifyToken(request: any) {
  // 1. 檢查 Authorization 頭部
  const authHeader = request.headers.get("Authorization");
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.substring(7);
    try {
      // 驗證 JWT token
      const decoded = jwt.verify(token, process.env.NEXTAUTH_SECRET || "");
      return !!decoded;
    } catch (error) {
      console.error("Token verification failed:", error);
      return false;
    }
  }

  // 2. 如果沒有 Authorization 頭部，嚴格拒絕（不再檢查 session）
  return false;
}

// 權限包裝器 - 結合 IP 白名單和 Token 驗證
const withAuth = (resolvers: any) => {
  const wrappedResolvers = { ...resolvers };

  // 遍歷所有 Mutation 解析器
  if (resolvers.Mutation) {
    wrappedResolvers.Mutation = Object.keys(resolvers.Mutation).reduce(
      (acc: any, key: string) => {
        // 為每個 Mutation 添加雙重驗證檢查（IP 白名單 + Token）
        acc[key] = async (parent: any, args: any, context: any, info: any) => {
          // 首先檢查 IP 白名單
          if (!context.isIPAllowed) {
            throw new Error(
              `❌ 拒絕存取：您的 IP 地址 (${context.clientIP}) 沒有執行修改操作的權限。只有白名單中的 IP 才能進行寫入操作。`
            );
          }
          
          // 然後檢查 Token 驗證
          if (!context.isAuthenticated) {
            throw new Error(
              "❌ 驗證失敗：需要有效的 Authorization Bearer Token 才能執行修改操作"
            );
          }
          
          console.log(`✅ IP ${context.clientIP} 通過白名單和 Token 驗證，執行 Mutation: ${key}`);
          return resolvers.Mutation[key](parent, args, context, info);
        };
        return acc;
      },
      {}
    );
  }

  return wrappedResolvers;
};

// 定义 schemas 目录路径
const schemasDir = path.join(process.cwd(), "graphql/schemas");

// 动态读取所有 .graphql 文件并合并内容
const typeDefs = readdirSync(schemasDir)
  .filter((file: string) => file.endsWith(".graphql"))
  .map((file: string) => readFileSync(path.join(schemasDir, file), "utf-8"))
  .join("\n");

// 創建 Yoga 實例
const yoga = createYoga({
  schema: createSchema({
    typeDefs,
    resolvers: withAuth(resolvers),
  }),
  // 添加 GraphQL 相關配置
  graphqlEndpoint: "/api/graphql",
  fetchAPI: { Response: NextResponse },
  async context({ request }) {
    let isAuthenticated = false;
    let isIPWhitelisted = false;
    let clientIP = "unknown";

    try {
      // 獲取客戶端 IP
      clientIP = getClientIP(request);
      
      // 檢查 IP 白名單
      isIPWhitelisted = isIPAllowed(clientIP);
      
      // 使用嚴格的 token 驗證函數
      isAuthenticated = await verifyToken(request);
      
      console.log(`📍 請求來源 IP: ${clientIP}`);
      console.log(`🔐 Token 驗證: ${isAuthenticated ? '✅ 通過' : '❌ 失敗'}`);
      console.log(`🌐 IP 白名單: ${isIPWhitelisted ? '✅ 允許' : '❌ 拒絕'}`);
      
    } catch (error) {
      console.error("驗證錯誤:", error);
    }

    return { 
      isAuthenticated, 
      isIPAllowed: isIPWhitelisted, 
      clientIP 
    };
  },
});

// 處理所有支持的 HTTP 方法
export const GET = yoga;
export const POST = yoga;
export const OPTIONS = yoga;
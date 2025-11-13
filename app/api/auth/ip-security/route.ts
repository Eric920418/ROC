import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// 最大失敗嘗試次數
const MAX_ATTEMPTS = 3;
// 封鎖時間（分鐘）
const BLOCK_DURATION_MINUTES = 30;

/**
 * 獲取客戶端真實 IP 地址
 */
function getClientIP(request: NextRequest): string {
  // 收集所有可能的 IP 來源進行診斷
  const ipSources = {
    'x-forwarded-for': request.headers.get('x-forwarded-for'),
    'x-real-ip': request.headers.get('x-real-ip'),
    'x-client-ip': request.headers.get('x-client-ip'),
    'cf-connecting-ip': request.headers.get('cf-connecting-ip'),
    'x-forwarded': request.headers.get('x-forwarded'),
    'forwarded-for': request.headers.get('forwarded-for'),
    'forwarded': request.headers.get('forwarded'),
  };

  // 記錄所有 header 以便診斷
  console.log('📍 IP 來源診斷:', {
    headers: Object.entries(ipSources).filter(([value]) => value),
    url: request.url,
    method: request.method
  });

  // 按優先順序檢查各種可能的 header
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    const ip = forwarded.split(',')[0].trim();
    // 檢查是否為 localhost 變體
    if (ip !== '::1' && ip !== '::ffff:127.0.0.1' && ip !== '127.0.0.1') {
      console.log(`使用 x-forwarded-for IP: ${ip}`);
      return ip;
    }
  }
  
  const realIP = request.headers.get('x-real-ip');
  if (realIP && realIP.trim() !== '::1' && realIP.trim() !== '::ffff:127.0.0.1') {
    console.log(`使用 x-real-ip IP: ${realIP.trim()}`);
    return realIP.trim();
  }
  
  const clientIP = request.headers.get('x-client-ip');
  if (clientIP && clientIP.trim() !== '::1' && clientIP.trim() !== '::ffff:127.0.0.1') {
    console.log(`使用 x-client-ip IP: ${clientIP.trim()}`);
    return clientIP.trim();
  }
  
  const cfConnectingIP = request.headers.get('cf-connecting-ip');
  if (cfConnectingIP && cfConnectingIP.trim() !== '::1' && cfConnectingIP.trim() !== '::ffff:127.0.0.1') {
    console.log(`使用 cf-connecting-ip IP: ${cfConnectingIP.trim()}`);
    return cfConnectingIP.trim();
  }
  
  // 從 forwarded header 中提取 IP（標準格式）
  const forwardedHeader = request.headers.get('forwarded');
  if (forwardedHeader) {
    const match = forwardedHeader.match(/for=([^;,\s]+)/);
    if (match) {
      const ip = match[1].replace(/[[\]"]/g, '');
      if (ip !== '::1' && ip !== '::ffff:127.0.0.1' && ip !== '127.0.0.1') {
        console.log(`使用 forwarded header IP: ${ip}`);
        return ip;
      }
    }
  }

  // 開發環境特殊處理：使用隨機 ID 來區分不同的瀏覽器會話
  if (process.env.NODE_ENV === 'development') {
    // 嘗試從 User-Agent 和其他信息創建唯一標識
    const userAgent = request.headers.get('user-agent') || '';
    const acceptLanguage = request.headers.get('accept-language') || '';
    const combined = `${userAgent}-${acceptLanguage}`;
    const sessionId = `dev-${hashString(combined)}-${Date.now() % 10000}`;
    console.log(`⚠️ 開發環境，使用會話標識: ${sessionId}`);
    return sessionId;
  }

  // 生產環境警告：無法獲取真實 IP
  console.warn('⚠️ 警告：無法獲取客戶端真實 IP，可能導致安全問題！');
  
  // 使用請求的唯一標識符作為最後手段
  const fallbackId = `unknown-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  return fallbackId;
}

/**
 * 簡單的字串 hash 函數（用於開發環境）
 */
function hashString(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash).toString(36);
}

/**
 * 檢查 IP 是否被封鎖
 */
export async function GET(request: NextRequest) {
  try {
    const clientIP = getClientIP(request);
    console.log(`[GET /api/auth/ip-security] 檢查 IP: ${clientIP}`);
    
    const ipRecord = await prisma.ipBlocklist.findUnique({
      where: { ipAddress: clientIP }
    });
    
    if (!ipRecord) {
      return NextResponse.json({ blocked: false, attempts: 0, clientIP });
    }
    
    // 檢查是否在封鎖期間
    if (ipRecord.blockedAt) {
      const blockEndTime = new Date(ipRecord.blockedAt.getTime() + BLOCK_DURATION_MINUTES * 60 * 1000);
      if (new Date() < blockEndTime) {
        const remainingMinutes = Math.ceil((blockEndTime.getTime() - Date.now()) / (1000 * 60));
        return NextResponse.json({ 
          blocked: true, 
          attempts: ipRecord.attempts,
          remainingMinutes,
          clientIP
        });
      } else {
        // 封鎖時間已過，重置記錄
        await prisma.ipBlocklist.update({
          where: { ipAddress: clientIP },
          data: { 
            attempts: 0, 
            blockedAt: null 
          }
        });
        return NextResponse.json({ blocked: false, attempts: 0, clientIP });
      }
    }
    
    return NextResponse.json({ blocked: false, attempts: ipRecord.attempts, clientIP });
  } catch (error) {
    console.error('IP 安全檢查錯誤:', error);
    return NextResponse.json({ error: '系統錯誤' }, { status: 500 });
  }
}

/**
 * 記錄失敗的登入嘗試
 */
export async function POST(request: NextRequest) {
  try {
    const clientIP = getClientIP(request);
    console.log(`[POST /api/auth/ip-security] 記錄失敗嘗試 IP: ${clientIP}`);
    
    // 查找或創建 IP 記錄
    const ipRecord = await prisma.ipBlocklist.upsert({
      where: { ipAddress: clientIP },
      update: {
        attempts: { increment: 1 }
      },
      create: {
        ipAddress: clientIP,
        attempts: 1
      }
    });
    
    // 檢查是否達到封鎖條件
    if (ipRecord.attempts >= MAX_ATTEMPTS) {
      await prisma.ipBlocklist.update({
        where: { ipAddress: clientIP },
        data: {
          blockedAt: new Date()
        }
      });
      
      console.log(`🚫 IP ${clientIP} 已被封鎖，失敗嘗試次數: ${ipRecord.attempts}`);
      
      return NextResponse.json({ 
        blocked: true, 
        attempts: ipRecord.attempts,
        message: `您的 IP 已被封鎖 ${BLOCK_DURATION_MINUTES} 分鐘，因為登入失敗次數過多`,
        clientIP
      });
    }
    
    const remainingAttempts = MAX_ATTEMPTS - ipRecord.attempts;
    console.log(`⚠️ IP ${clientIP} 登入失敗，剩餘嘗試次數: ${remainingAttempts}`);
    
    return NextResponse.json({ 
      blocked: false, 
      attempts: ipRecord.attempts,
      remainingAttempts,
      clientIP
    });
  } catch (error) {
    console.error('記錄登入失敗錯誤:', error);
    return NextResponse.json({ error: '系統錯誤' }, { status: 500 });
  }
}

/**
 * 重置 IP 記錄（成功登入後調用）
 */
export async function DELETE(request: NextRequest) {
  try {
    const clientIP = getClientIP(request);
    console.log(`[DELETE /api/auth/ip-security] 重置 IP 記錄: ${clientIP}`);
    
    await prisma.ipBlocklist.deleteMany({
      where: { ipAddress: clientIP }
    });
    
    console.log(`✅ IP ${clientIP} 的失敗記錄已重置`);
    
    return NextResponse.json({ success: true, clientIP });
  } catch (error) {
    console.error('重置 IP 記錄錯誤:', error);
    return NextResponse.json({ error: '系統錯誤' }, { status: 500 });
  }
}
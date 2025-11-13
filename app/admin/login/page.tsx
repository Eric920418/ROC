"use client";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

// IP 安全檢查結果介面
interface IpSecurityStatus {
  blocked: boolean;
  attempts: number;
  remainingAttempts?: number;
  remainingMinutes?: number;
  message?: string;
  clientIP?: string; // 添加客戶端 IP
}

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [ipStatus, setIpStatus] = useState<IpSecurityStatus | null>(null);
  const [isBlocked, setIsBlocked] = useState(false);

  // 檢查 IP 封鎖狀態
  const checkIpStatus = async () => {
    try {
      const response = await fetch('/api/auth/ip-security');
      const data: IpSecurityStatus = await response.json();
      console.log("data", data);
      setIpStatus(data);
      setIsBlocked(data.blocked);
      
      if (data.blocked) {
        setError(`您的 IP 已被暫時封鎖，剩餘時間：${data.remainingMinutes} 分鐘`);
      }
    } catch (error) {
      console.error('檢查 IP 狀態錯誤:', error);
    }
  };

  // 記錄登入失敗
  const recordLoginFailure = async () => {
    try {
      const response = await fetch('/api/auth/ip-security', {
        method: 'POST',
      });
      const data: IpSecurityStatus = await response.json();
      
      if (data.blocked) {
        setIsBlocked(true);
        setError(data.message || '您的 IP 已被封鎖');
      } else if (data.remainingAttempts !== undefined) {
        setError(`帳號或密碼錯誤，剩餘嘗試次數：${data.remainingAttempts}`);
      }
      
      return data;
    } catch (error) {
      console.error('記錄登入失敗錯誤:', error);
      return null;
    }
  };

  // 重置 IP 記錄（成功登入後）
  const resetIpRecord = async () => {
    try {
      await fetch('/api/auth/ip-security', {
        method: 'DELETE',
      });
    } catch (error) {
      console.error('重置 IP 記錄錯誤:', error);
    }
  };

  // 組件載入時檢查 IP 狀態
  useEffect(() => {
    checkIpStatus();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 如果 IP 被封鎖，阻止提交
    if (isBlocked) {
      setError('您的 IP 已被封鎖，請稍後再試');
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const result = await signIn("credentials", {
        username,
        password,
        redirect: false,
      });

      if (result?.error) {
        // 登入失敗，記錄失敗嘗試
        const ipData = await recordLoginFailure();
        if (ipData?.blocked) {
          // 如果被封鎖，禁用表單
          setIsBlocked(true);
        }
      } else {
        // 登入成功，重置 IP 記錄
        await resetIpRecord();
        router.push("/admin/meeting");
        router.refresh();
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h1 className="text-2xl font-bold mb-6 text-center">管理員登入</h1>
        
        {/* IP 狀態顯示 */}
        {ipStatus && ipStatus.attempts > 0 && !isBlocked && (
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4">
            <p className="text-sm">
              ⚠️ 警告：已有 {ipStatus.attempts} 次登入失敗記錄
              {ipStatus.remainingAttempts !== undefined && 
                `, 剩餘嘗試次數：${ipStatus.remainingAttempts}`
              }
            </p>
          </div>
        )}
        
        {/* 錯誤訊息顯示 */}
        {error && (
          <div className={`border px-4 py-3 rounded mb-4 ${
            isBlocked 
              ? 'bg-red-100 border-red-400 text-red-700' 
              : 'bg-red-100 border-red-400 text-red-700'
          }`}>
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              使用者名稱
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                isBlocked ? 'bg-gray-100 cursor-not-allowed' : ''
              }`}
              required
              disabled={isBlocked || isLoading}
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              密碼
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                isBlocked ? 'bg-gray-100 cursor-not-allowed' : ''
              }`}
              required
              disabled={isBlocked || isLoading}
            />
          </div>
          <button
            type="submit"
            disabled={isLoading || isBlocked}
            className={`w-full font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${
              isBlocked
                ? "bg-gray-400 text-gray-700 cursor-not-allowed"
                : isLoading
                ? "bg-blue-400 text-white cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-700 text-white"
            }`}
          >
            {isBlocked 
              ? "已被封鎖" 
              : isLoading 
              ? "登入中..." 
              : "登入"
            }
          </button>
        </form>
        
        {/* 封鎖說明 */}
        {isBlocked && (
          <div className="mt-4 p-4 bg-gray-100 rounded">
            <h3 className="font-bold text-sm mb-2">安全提示：</h3>
            <p className="text-xs text-gray-600">
              為了保護系統安全，連續 5 次登入失敗的 IP 地址將被暫時封鎖 30 分鐘。
              請確認您的帳號密碼正確，或聯繫系統管理員。
            </p>
          </div>
        )}
        
        {/* 診斷信息（開發環境） */}
        {process.env.NODE_ENV === 'development' && ipStatus?.clientIP && (
          <div className="mt-4 p-2 bg-gray-50 rounded text-xs text-gray-500 border border-gray-200">
            <p>🔍 診斷信息：</p>
            <p>檢測到的 IP/ID: <code className="bg-gray-200 px-1 rounded">{ipStatus.clientIP}</code></p>
            {ipStatus.clientIP.startsWith('dev-') && (
              <p className="mt-1 text-orange-600">⚠️ 開發環境：使用會話標識符而非真實 IP</p>
            )}
            {ipStatus.clientIP.startsWith('unknown-') && (
              <p className="mt-1 text-red-600">❌ 無法獲取真實 IP，使用臨時標識符</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

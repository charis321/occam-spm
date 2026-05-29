import { useState, useEffect } from 'react';
import { Button, Input } from 'antd';
import { resetPassword } from '../../Util/WebApi';
import './index.css';
// 假設你使用的是 Ant Design 或自訂組件，確保有引入對應元件
// import { Input, Button, message } from 'antd';

export default function OCResetPassword() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false); // 💡 新增：控制按鈕轉圈圈
  const [isSended, setIsSended] = useState(false); // 控制是否發送成功
  const [countdown, setCountdown] = useState(0); // 💡 新增：防刷倒數計時

  // 💡 倒數計時邏輯
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleValidation = async () => {
    // 1. 前端第一道防線：驗證基本格式
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      alert('請輸入正確的電子信箱格式！'); // 實際專案可用更美觀的 Toast 通知
      return;
    }

    setIsLoading(true); // 開啟轉圈圈，防止二次點擊
    try {
      // 呼叫你剛才寫好的 Axios API
      await resetPassword(email);
      setIsSended(true);
      setCountdown(60); // 發送成功，鎖定按鈕 60 秒
    } catch (error) {
      alert('發送失敗，請稍後再試：' + error.message);
    } finally {
      setIsLoading(false); // 關閉轉圈圈
    }
  };

  return (
    <div className="oc-reset-password-page">
      <div className="oc-reset-password-content">
        <h2>重設密碼</h2>

        {/* 💡 狀態分流：如果還沒發送成功，顯示輸入表單 */}
        {!isSended ? (
          <>
            <p className="oc-desc">
              請輸入您註冊時的電子信箱，系統將發送密碼重置連結給您。
            </p>
            <Input
              type="email"
              placeholder="example@school.edu.tw"
              value={email}
              disabled={isLoading} // 載入中時禁用輸入框
              onChange={(e) => setEmail(e.target.value)}
              style={{ marginBottom: '16px' }}
            />
            <Button
              type="primary"
              onClick={handleValidation}
              loading={isLoading} // 💡 讓按鈕自帶轉圈圈動畫 (如 AntD 支援)
              disabled={isLoading} // 載入中時無法重複點擊
              block
            >
              {isLoading ? '信件發送中...' : '發送驗證信'}
            </Button>
          </>
        ) : (
          /* 💡 狀態分流：發送成功後，隱藏表單，顯示乾淨的成功卡片（順便修正了拼錯字） */
          <div className="oc-reset-password-success-content">
            <div
              className="oc-success-icon"
              style={{ fontSize: '48px', color: '#52c41a' }}
            >
              ✓
            </div>
            <h3>驗證信件已發送！</h3>
            <p>
              我們已將密碼重置連結寄送至：
              <br />
              <strong>{email}</strong>
            </p>
            <p className="oc-hint-text">
              請於 15 分鐘內至信箱查收並點擊連結。未收到信件？請檢查垃圾信件匣。
            </p>

            {/* 💡 重新發送按鈕，自帶倒數計時防禦 */}
            <Button
              type="link"
              disabled={countdown > 0 || isLoading}
              onClick={handleValidation}
            >
              {countdown > 0
                ? `沒有收到信？重新發送 (${countdown}s)`
                : '重新發送驗證信'}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

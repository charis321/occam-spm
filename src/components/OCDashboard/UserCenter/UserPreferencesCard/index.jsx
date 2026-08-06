import React, { useState, useEffect } from 'react';
import { Switch, Select, Divider } from 'antd';
import { SettingOutlined, BulbOutlined, MailOutlined, NotificationOutlined, GlobalOutlined } from '@ant-design/icons';
import './index.css';

export default function UserPreferencesCard() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    setIsDark(currentTheme === 'dark');
  }, []);

  const handleThemeChange = (checked) => {
    setIsDark(checked);
    if (checked) {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  };

  return (
    <div className="oc-user-preferences-card">
      <div className="oc-pref-header">
        <h4><SettingOutlined /> &nbsp; 偏好與安全設置 <span style={{ color: '#8b5cf6' }}> (功能尚未實作) </span></h4>
      </div>

      <div className="pref-item">
        <div className="pref-item-desc">
          <span className="pref-title"><BulbOutlined /> &nbsp; 深色護眼模式</span>
          <span className="pref-sub">一鍵切換曜石暗黑/奶油金暖色主題</span>
        </div>
        <Switch
          checked={isDark}
          onChange={handleThemeChange}
          checkedChildren="暗"
          unCheckedChildren="亮"
        />
      </div>

      <Divider className="pref-divider" />

      <div className="pref-item">
        <div className="pref-item-desc">
          <span className="pref-title"><MailOutlined /> &nbsp; 電子郵件通知</span>
          <span className="pref-sub">接收點名異常與系統重大異動通知郵件</span>
        </div>
        <Switch defaultChecked />
      </div>

      <Divider className="pref-divider" />

      <div className="pref-item">
        <div className="pref-item-desc">
          <span className="pref-title"><NotificationOutlined /> &nbsp; 系統公告彈窗</span>
          <span className="pref-sub">登入後於首頁主動呈現最新公告訊息</span>
        </div>
        <Switch defaultChecked />
      </div>

      <Divider className="pref-divider" />

      <div className="pref-item language-item">
        <div className="pref-item-desc">
          <span className="pref-title"><GlobalOutlined /> &nbsp; 介面顯示語言</span>
          <span className="pref-sub">變更全站系統 UI 語系語言</span>
        </div>
        <Select
          defaultValue="zh-TW"
          style={{ width: 120 }}
          options={[
            { value: 'zh-TW', label: '繁體中文' },
            { value: 'en', label: 'English' },
          ]}
        />
      </div>
    </div>
  );
}

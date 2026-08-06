import React from 'react';
import { Progress } from 'antd';
import { BookOutlined, ClockCircleOutlined, CheckCircleOutlined, UserOutlined, DatabaseOutlined } from '@ant-design/icons';
import { useAuth } from '@utils/AuthContext';
import './index.css';

export default function UserStatsCard() {
  const { user } = useAuth();

  const renderContent = () => {
    if (user.role === 0) {
      // Student
      return (
        <div className="oc-stats-content">
          <div className="oc-stats-header">
            <h4>學習進度與統計</h4>
          </div>
          <div className="oc-stats-row">
            <div className="oc-stats-progress-block">
              <Progress
                type="circle"
                percent={96.5}
                strokeColor={{
                  '0%': '#f59e0b',
                  '100%': '#fbbf24',
                }}
                width={80}
                format={(percent) => (
                  <div className="oc-progress-text">
                    <span className="percent-num">{percent}%</span>
                    <span className="percent-label">出席率</span>
                  </div>
                )}
              />
            </div>
            <div className="oc-stats-metrics">
              <div className="metric-item">
                <BookOutlined className="metric-icon" />
                <div className="metric-info">
                  <span className="metric-label">修讀課程</span>
                  <span className="metric-val">6 門</span>
                </div>
              </div>
              <div className="metric-item">
                <CheckCircleOutlined className="metric-icon success" />
                <div className="metric-info">
                  <span className="metric-label">已簽到數</span>
                  <span className="metric-val">32 次</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    } else if (user.role === 1) {
      // Teacher
      return (
        <div className="oc-stats-content">
          <div className="oc-stats-header">
            <h4>教學數據與統計</h4>
          </div>
          <div className="oc-stats-row">
            <div className="oc-stats-progress-block">
              <Progress
                type="circle"
                percent={100}
                strokeColor={{
                  '0%': '#10b981',
                  '100%': '#34d399',
                }}
                width={80}
                format={() => (
                  <div className="oc-progress-text">
                    <span className="percent-num" style={{ color: '#10b981' }}>正常</span>
                    <span className="percent-label">點名率</span>
                  </div>
                )}
              />
            </div>
            <div className="oc-stats-metrics">
              <div className="metric-item">
                <BookOutlined className="metric-icon" />
                <div className="metric-info">
                  <span className="metric-label">授課班級</span>
                  <span className="metric-val">4 個</span>
                </div>
              </div>
              <div className="metric-item">
                <ClockCircleOutlined className="metric-icon info" />
                <div className="metric-info">
                  <span className="metric-label">本學期授課</span>
                  <span className="metric-val">128 小時</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    } else {
      // Admin (Role 2)
      return (
        <div className="oc-stats-content">
          <div className="oc-stats-header">
            <h4>系統運行統計</h4>
          </div>
          <div className="oc-stats-row">
            <div className="oc-stats-progress-block">
              <Progress
                type="circle"
                percent={99.9}
                strokeColor={{
                  '0%': '#3b82f6',
                  '100%': '#60a5fa',
                }}
                width={80}
                format={(percent) => (
                  <div className="oc-progress-text">
                    <span className="percent-num" style={{ color: '#3b82f6' }}>{percent}%</span>
                    <span className="percent-label">可用性</span>
                  </div>
                )}
              />
            </div>
            <div className="oc-stats-metrics">
              <div className="metric-item">
                <UserOutlined className="metric-icon" />
                <div className="metric-info">
                  <span className="metric-label">註冊帳戶</span>
                  <span className="metric-val">1,250 戶</span>
                </div>
              </div>
              <div className="metric-item">
                <DatabaseOutlined className="metric-icon success" />
                <div className="metric-info">
                  <span className="metric-label">資料庫狀態</span>
                  <span className="metric-val">Healthy</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }
  };

  return (
    <div className="oc-user-stats-card">
      {renderContent()}
    </div>
  );
}

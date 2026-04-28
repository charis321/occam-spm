import { useEffect } from 'react';
import { Tag } from 'antd';
import {
  USER_STATUS_INDEX,
  USER_ROLE_INDEX,
  USER_SEX_INDEX,
} from '@config/config';
import './index.css';

export default function OCUserInfoCard(props) {
  const { userInfo } = props;

  return (
    <div className="oc-user-info-card">
      <div className="oc-user-info-header">
        <div className="oc-user-avatar"></div>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
          }}
        >
          <div className="flex-row">
            <h2>{userInfo?.name}</h2>
            &nbsp;&nbsp;
            <Tag color={USER_ROLE_INDEX[userInfo?.role]?.color}>
              {USER_ROLE_INDEX[userInfo?.role]?.title}
            </Tag>
          </div>
        </div>
      </div>
      <div className="oc-user-info-list">
        <h3>基本資料: </h3>
        <ul>
          <li>
            <span>性別:</span>
            <span>{USER_SEX_INDEX[userInfo?.sex]}</span>
          </li>
          <li>
            <span>所屬學校:</span>
            <span>{userInfo?.school || '未設定'}</span>
          </li>
          <li>
            <span>所屬學系:</span>
            <span>{userInfo?.department || '未設定'}</span>
          </li>
          <li>
            <span>學號/辨識碼:</span>
            <span>{userInfo?.no || '未設定'}</span>
          </li>
          <li>
            <span>職位:</span>
            <span>{userInfo?.jobTitle || '未設定'}</span>
          </li>
        </ul>
      </div>
      <div className="oc-user-info-list">
        <h3>聯絡方式: </h3>
        <ul>
          <li>
            <span>電子信箱:</span>
            <span>{userInfo?.email || '未設定'}</span>
          </li>
        </ul>
      </div>
      <div className="oc-user-info-list">
        <h3>用戶資料: </h3>
        <ul>
          <li>
            <span>系統編號:</span>
            <span>{userInfo?.id}</span>
          </li>
          <li>
            <span>身分:</span>
            <span>{USER_ROLE_INDEX[userInfo?.role]?.title}</span>
          </li>
          <li>
            <span>用戶狀態:</span>
            <span>{USER_STATUS_INDEX[userInfo?.status]}</span>
          </li>
          <li>
            <span>創建時間:</span>
            <span>{new Date(userInfo?.createTime).toLocaleString()}</span>
          </li>
          <li>
            <span>更新時間:</span>
            <span>{new Date(userInfo?.updateTime).toLocaleString()}</span>
          </li>
        </ul>
      </div>
    </div>
  );
}

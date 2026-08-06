import { useEffect, useState } from 'react';
import { useActionData, useNavigate } from 'react-router-dom';
import { Tag, Avatar, Button, Input, Image, Upload, message } from 'antd';
import {
  UserOutlined,
  EditOutlined,
  PlusOutlined,
  UploadOutlined,
  MessageOutlined,
} from '@ant-design/icons';
import {
  USER_STATUS_INDEX,
  USER_ROLE_INDEX,
  USER_SEX_INDEX,
} from '@config/config';
import { USER_AVATAR_DEFAULT } from '../../../../config/user';
import { apiUtil } from '@utils/WebApi.js';
import { useAuth } from '@utils/AuthContext';

import OCOverlay from '@components/OCCommon/OCOverlay';

import './index.css';

export default function OCUserInfoCard(props) {
  const { user } = useAuth();
  const { userInfo, readOnly = true, resetUserInfo } = props;
  const [isEditing, setIsEditing] = useState(false);
  const [previewAvatar, setPreviewAvatar] = useState();
  const [isWaiting, setIsWaiting] = useState(false);
  const navigator = useNavigate();

  // useEffect(() => {
  //   console.log('avatar', previewAvatar);
  // }, [previewAvatar]);

  // const handlePreview = async (file) => {
  //   if (!file.url && !file.preview) {
  //     file.preview = await getBase64(file.originFileObj);
  //   }
  //   setPreviewAvatar(file.url || file.preview);
  // };
  const handleFileChange = ({ file }) => {
    console.log(file.originFileObj);
    if (file.status === 'removed') {
      setPreviewAvatar(null);
      console.log('檔案已移除');
      return;
    }
    if (file.originFileObj) {
      console.log('選擇檔案:', file.originFileObj);
      setPreviewAvatar(file.originFileObj);
    } else {
      setPreviewAvatar(file);
    }
  };
  const uploadButton = (
    <button style={{ border: 0, background: 'none' }} type="button">
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </button>
  );

  const updateUserAvatar = async (avatarFile) => {
    setIsWaiting(true);
    const data = new FormData();
    data.append('file', avatarFile);
    const path = `/user/${userInfo.id}/avatar`;
    const res = await apiUtil(path, 'PATCH', null, data, true);
    if (res?.code == 200) {
      message.success('頭像更新成功');
      resetUserInfo && resetUserInfo();
    } else {
      message.error('頭像更新失敗');
    }
    setIsWaiting(false);
  };
  const handleAvatarSubmit = () => {
    if (!previewAvatar) {
      message.warning('請選擇並上傳頭像');
      return;
    }
    updateUserAvatar(previewAvatar);
  };
  const handleBeforeUpload = (file) => {
    console.log('BeforeUpload');
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('只能上傳 JPG/PNG 格式的圖片！');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('圖片大小不能超過 2MB！');
    }
    // 只有同時滿足格式與大小，才允許上傳
    return isJpgOrPng && isLt2M ? false : Upload.LIST_IGNORE;
  };

  return (
    <div className="oc-user-info-card">
      <div className="oc-user-info-header">
        <div className="oc-user-info-avatar">
          <Avatar
            style={{
              marginRight: '0.5rem',
              boxShadow: '1px 1px 5px rgba(0, 0, 0, 0.3)',
              border: '3px solid #eee',
            }}
            size={{ xs: 80, sm: 80, md: 80, lg: 100, xl: 100, xxl: 100 }}
            src={userInfo?.avatar || USER_AVATAR_DEFAULT[userInfo?.sex]}
          />
          {!readOnly && (
            <Button
              className="oc-avatar-edit-btn"
              onClick={() => {
                setIsEditing(!isEditing);
              }}
              icon={<EditOutlined />}
            />
          )}
        </div>
        {isEditing && (
          <OCOverlay
            toggle={() => {
              setIsEditing(!isEditing);
            }}
          >
            <div className="oc-avatar-upload">
              <Upload
                listType="picture"
                maxCount={1}
                file={previewAvatar}
                beforeUpload={handleBeforeUpload}
                onChange={handleFileChange}
                disabled={isWaiting}
              >
                <Button icon={<UploadOutlined />}>Upload (Max: 1)</Button>
              </Upload>
              <Button
                type="primary"
                onClick={handleAvatarSubmit}
                loading={isWaiting}
                disabled={isWaiting}
              >
                上傳頭像
              </Button>
            </div>
          </OCOverlay>
        )}

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
          }}
        >
          <div className="flex-row" style={{ marginLeft: '1rem' }}>
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
          {userInfo?.id !== user?.id && (
            <li>
              <span>系統訊息:</span>
              <Button
                icon={<MessageOutlined />}
                onClick={() =>
                  navigator(`/dashboard/message/new?to=${userInfo.id}`)
                }
              >
                通知 TA
              </Button>
            </li>
          )}

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

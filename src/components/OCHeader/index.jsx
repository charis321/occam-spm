import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Tag, Button, Dropdown, Space, message, Avatar } from 'antd';
import {
  ArrowLeftOutlined,
  SettingOutlined,
  LogoutOutlined,
  DownOutlined,
  QuestionCircleOutlined,
  AlertOutlined,
} from '@ant-design/icons';

import { useAuth } from '../../Util/AuthContext';
import { apiUtil } from '../../Util/WebApi';
import OCBreadcrumb from '../OCCommon/OCBreadcrumb';
import { USER_AVATAR_DEFAULT } from '../../config/user';
import './index.css';
import { Spin } from 'antd';

export default function OCHeader(props) {
  const { user, logoutAuth } = useAuth();
  const [userInfo, setUserInfo] = useState({});
  const [isLoading, setIsLoading] = useState();
  const navigator = useNavigate();

  useEffect(() => {
    const controller = new AbortController();
    if (!user) {
      navigator('/login');
    } else {
      getUserInfoData(controller.signal);
    }
    return () => {
      controller.abort();
    };
  }, [user]);

  const roleMap = {
    0: {
      title: '學生',
      color: 'blue',
    },
    1: {
      title: '教師',
      color: 'green',
    },
    2: {
      title: '管理員',
      color: 'red',
    },
  };

  const menuItems = [
    {
      key: 'aboutSite',
      icon: <QuestionCircleOutlined />,
      label: <span>關於本站</span>,
    },
    {
      key: 'reportIssue',
      icon: <AlertOutlined />,
      label: <span>問題回報</span>,
    },
    {
      key: 'logout',
      danger: true,
      icon: <LogoutOutlined />,
      label: <span>登出系統</span>,
    },
  ];
  const menuItemActions = {
    aboutSite: () => {
      alert(
        'Occam SPS 是一個專為學校設計的課程管理系統，提供學生、教師和管理員使用。',
      );
    },
    reportIssue: () => {
      navigator('/dashboard/message/new?to=2044672486674931714');
    },
    logout: () => {
      logoutAuth();
      alert('登出成功，將導向登入頁面');
      navigator('/login');
    },
  };

  const getUserInfoData = async (signal = null) => {
    setIsLoading(true);
    const path = `/user/${user.id}`;
    const res = await apiUtil(path, 'GET', signal);
    if (res?.isSystemError) return;
    if (res?.code === 200) {
      setUserInfo(res.data);
    }
    setIsLoading(false);
  };

  const handleMenuClick = (item) => {
    const action = menuItemActions[item.key];
    if (action) {
      action();
    }
  };
  const handleLogout = () => {
    logoutAuth();
    alert('登出成功，將導向登入頁面');
    navigator('/login');
  };
  const handleReturnPreviousPage = () => {
    if (hasHistory()) {
      navigator(-1);
    } else {
      navigator('/');
    }
  };
  const hasHistory = () => {
    return window.history.state && window.history.state.idx > 0;
  };

  return (
    <div className="oc-header">
      <Button
        className="oc-previous-page-btn"
        variant="dashed"
        color="cyan"
        onClick={handleReturnPreviousPage}
      >
        <ArrowLeftOutlined />
        回上頁
      </Button>

      <OCBreadcrumb className="oc-breadcrumb" />

      {isLoading ? (
        <Spin style={{ marginRight: '1rem', marginLeft: 'auto' }} />
      ) : (
        <div className="oc-user-menu">
          <p>
            <Tag color={roleMap[userInfo?.role]?.color}>
              {roleMap[userInfo?.role]?.title}
            </Tag>
            歡迎，{userInfo?.name}&nbsp;
          </p>
          <Dropdown
            className="oc-user-menu-dropdown"
            menu={{ items: menuItems, onClick: handleMenuClick }}
            placement="bottomLeft"
            arrow
          >
            <Space>
              <Avatar
                className="oc-avatar"
                style={{
                  marginRight: '0.5rem',
                  boxShadow: '1px 1px 5px rgba(0, 0, 0, 0.3)',
                  border: '3px solid #eee',
                }}
                size={40}
                src={userInfo?.avatar || USER_AVATAR_DEFAULT[userInfo?.sex]}
              />
            </Space>
          </Dropdown>
        </div>
      )}
    </div>
  );
}

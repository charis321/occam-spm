import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Tag, Button, Dropdown, Space } from 'antd';
import {
  ArrowLeftOutlined,
  SettingOutlined,
  LogoutOutlined,
  DownOutlined,
  QuestionCircleOutlined,
} from '@ant-design/icons';

import { useAuth } from '../../Util/AuthContext';
import OCBreadcrumb from '../OCCommon/OCBreadcrumb';
import './index.css';
import { message } from 'antd';

export default function OCHeader(props) {
  const { user, logoutAuth } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
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
      key: '0',
      icon: <QuestionCircleOutlined />,
      label: <span>關於本站</span>,
    },
    {
      key: '1',
      danger: true,
      icon: <LogoutOutlined />,
      label: <span>登出系統</span>,
    },
  ];
  const handleMenuClick = ({ key }) => {
    if (key === '1') {
      handleLogout();
    } else if (key === '0') {
      alert(
        'Occam SPM 是一個專為學校設計的課程管理系統，提供學生、教師和管理員使用。',
      );
    }
  };
  const handleLogout = () => {
    logoutAuth();
    alert('登出成功，將導向登入頁面');
    navigate('/login');
  };
  const handleReturnPreviousPage = () => {
    if (hasHistory()) {
      navigate(-1);
    } else {
      navigate('/');
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
      {!user ? (
        <h2>未登入</h2>
      ) : (
        <div className="oc-user-menu">
          <p>
            歡迎，{user.name}&nbsp;
            <Tag color={roleMap[user.role].color}>
              {roleMap[user.role].title}
            </Tag>
          </p>
          {/* <button className="oc-user-menu-btn" onClick={handleToggleMenu}>
            <SettingOutlined />
          </button>
          <ul
            className="oc-user-menu-list"
            style={{ display: isOpen ? 'block' : 'none' }}
          >
            <li onClick={handleLogout}>
              <LogoutOutlined /> 登出
            </li>
          </ul> */}
          <Dropdown
            className="oc-user-menu-dropdown"
            menu={{ items: menuItems, onClick: handleMenuClick }}
            placement="bottomLeft"
            arrow={{ pointAtCenter: true }}
          >
            <Space>
              <SettingOutlined />
            </Space>
          </Dropdown>
        </div>
      )}
    </div>
  );
}

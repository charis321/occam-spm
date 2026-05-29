import { useState, useEffect } from 'react';
import { Button, Form } from 'antd';
import { UserOutlined } from '@ant-design/icons';

import { useAuth } from '@utils/AuthContext';
import { apiUtil } from '@utils/WebApi';

import OCUserInfoCard from '../User/UserInfoCard';
import OCLoading from '../../OCCommon/OCLoading';
import './index.css';
import OCUserPwdChange from './UserPwdChange';
export default function OCUserCenterDashboard(props) {
  const { user } = useAuth();
  const [userInfo, setUserInfo] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    if (user) {
      getUserInfoData(controller.signal);
    }
    return () => {
      controller.abort();
    };
  }, []);

  const getUserInfoData = async (signal = null) => {
    setIsLoading(true);
    const path = `/user/${user.id}`;
    const res = await apiUtil(path, 'GET', signal);
    if (res?.isSystemError) {
      // setIsLoading(false);
      return;
    }
    if (res?.code === 200) {
      setUserInfo(res.data);
    }
    setIsLoading(false);
  };
  return (
    <>
      {isLoading ? (
        <OCLoading />
      ) : (
        <div className="oc-user-center-dashboard">
          <h2>個人中心</h2>
          <section>
            <OCUserInfoCard
              userInfo={userInfo}
              readOnly={false}
              resetUserInfo={() => {
                getUserInfoData();
              }}
            />
          </section>
          <section>
            <OCUserPwdChange />
          </section>
        </div>
      )}
    </>
  );
}

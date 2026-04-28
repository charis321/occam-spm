import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Select } from 'antd';

import OCUserInfoCard from '../UserInfoCard';
import OCLoading from '../../../OCCommon/OCLoading';
import { apiUtil } from '@utils/WebApi';
import './index.css';

export default function OCUserPage(props) {
  const { userId } = useParams();
  const [userInfo, setUserInfo] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    getUserInfo();
  }, []);

  useEffect(() => {
    console.log(userInfo);
  }, [userInfo]);

  const getUserInfo = async () => {
    setIsLoading(true);
    const path = `/user/${userId}`;
    const res = await apiUtil(path, 'GET');
    if (res.code === 200) {
      setUserInfo(res.data);
    }
    setIsLoading(false);
  };

  return (
    <>
      {isLoading ? (
        <OCLoading />
      ) : (
        <div className="oc-user-page">
          <h2>用戶資訊</h2>
          <OCUserInfoCard userInfo={userInfo} />
        </div>
      )}
    </>
  );
}

import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Select } from 'antd';

import OCUserInfoCard from '../UserInfoCard';
import OCLoading from '../../../OCCommon/OCLoading';
import OCTitle from '@components/OCCommon/OCTitle';
import { apiUtil } from '@utils/WebApi';
import './index.css';
import { useAuth } from '../../../../Util/AuthContext';

export default function OCUserPage(props) {
  const { userId } = useParams();

  const { user } = useAuth();
  const [userInfo, setUserInfo] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    getUserInfoData(controller.signal);
  }, [user]);

  const getUserInfoData = async (signal = null) => {
    setIsLoading(true);
    const path = `/user/${userId}`;
    const res = await apiUtil(path, 'GET', signal);
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
        <div className="oc-user-page">
          <div className="oc-user-page-header">
            <OCTitle
              title="用戶資訊"
              description="檢視此用戶的基本資料、聯絡資訊與系統狀態"
            />
          </div>
          <div className="oc-user-page-body">
            <OCUserInfoCard
              userInfo={userInfo}
              readOnly={user.role !== 2}
              resetUserInfo={() => {
                getUserInfoData();
              }}
            />
          </div>
        </div>
      )}
    </>
  );
}

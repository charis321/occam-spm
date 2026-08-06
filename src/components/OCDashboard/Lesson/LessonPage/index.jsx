import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '@utils/AuthContext';
import { Button } from 'antd';
import { LeftOutlined } from '@ant-design/icons';
import OCTitle from '@components/OCCommon/OCTitle';

import TeacherView from './TeacherView';
import StudentView from './StudentView';
import './index.css';

export default function OCLessonPage(props) {
  const { user } = useAuth();
  const { courseId } = useParams();
  const navigate = useNavigate();

  const title = user.role === 0 ? '學生課堂點名' : '課堂點名控制台';
  const description =
    user.role === 0
      ? '請依照教師指示輸入安全點名碼進行課堂簽到'
      : '設定安全點名參數、即時發布動態點名二維碼並管理學生簽到記錄';

  return (
    <div className="oc-lesson-page-container">
      <div className="oc-lesson-page-header">
        <Button
          type="link"
          icon={<LeftOutlined />}
          onClick={() => navigate(`/dashboard/course/${courseId}`)}
          className="oc-back-btn"
        >
          返回課程詳情
        </Button>
        <OCTitle title={title} description={description} />
      </div>
      <div className="oc-lesson-page-body">
        {user.role === 0 ? <StudentView /> : <TeacherView />}
      </div>
    </div>
  );
}

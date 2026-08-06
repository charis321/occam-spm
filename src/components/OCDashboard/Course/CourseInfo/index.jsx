import { useNavigate } from 'react-router-dom';
import { Button } from 'antd';
import {
  BookOutlined,
  BarcodeOutlined,
  UserOutlined,
  BankOutlined,
  AppstoreOutlined,
  CalendarOutlined,
  EnvironmentOutlined,
  FileSearchOutlined,
  MessageOutlined,
  TeamOutlined,
  OrderedListOutlined,
} from '@ant-design/icons';
import { WEEKTIME } from '../../../../config/time';
import './index.css';

export default function OCCourseInfo(props) {
  const { courseData } = props;
  return (
    <div className="oc-course-info">
      {!!courseData && <OCCourseCardView courseData={courseData} />}
    </div>
  );
}

export function OCCourseCardView(props) {
  const { courseData } = props;
  const navigator = useNavigate();

  return (
    <div className="oc-course-card-content">
      <div className="oc-course-card-header">
        <div className="oc-course-avatar-badge">
          <BookOutlined />
        </div>
        <h2>{courseData.name}</h2>
      </div>
      <div className="oc-course-card-body">
        <ul>
          <li>
            <span className="oc-info-label">
              <BarcodeOutlined className="oc-info-icon code-icon" />
              課程代碼:
            </span>
            <span className="oc-info-val">{courseData.id}</span>
          </li>
          <li>
            <span className="oc-info-label">
              <UserOutlined className="oc-info-icon teacher-icon" />
              負責教師:
            </span>
            <span className="teacher-info-wrapper oc-info-val">
              <span className="teacher-name">{courseData.teacherName}</span>
              <span className="teacher-actions">
                <Button
                  icon={<FileSearchOutlined />}
                  shape="circle"
                  className="oc-teacher-btn oc-teacher-btn-view"
                  onClick={() => navigator(`/dashboard/user/${courseData.teacherId}`)}
                />
                <Button
                  icon={<MessageOutlined />}
                  shape="circle"
                  className="oc-teacher-btn oc-teacher-btn-msg"
                  onClick={() =>
                    navigator(`/dashboard/message/new?to=${courseData.teacherId}`)
                  }
                />
              </span>
            </span>
          </li>
          <li>
            <span className="oc-info-label">
              <BankOutlined className="oc-info-icon school-icon" />
              開課學校:
            </span>
            <span className="oc-info-val">{courseData.school}</span>
          </li>
          <li>
            <span className="oc-info-label">
              <AppstoreOutlined className="oc-info-icon dept-icon" />
              開課系所:
            </span>
            <span className="oc-info-val">{courseData.department}</span>
          </li>
          <li>
            <span className="oc-info-label">
              <CalendarOutlined className="oc-info-icon time-icon" />
              課程時間:
            </span>
            <span className="oc-info-val">
              {WEEKTIME(
                courseData.scheduleWeek,
                courseData.scheduleStartTime,
                courseData.scheduleEndTime,
              )}
            </span>
          </li>
          <li>
            <span className="oc-info-label">
              <EnvironmentOutlined className="oc-info-icon room-icon" />
              上課教室:
            </span>
            <span className="oc-info-val">{courseData.classroom || '未分配'}</span>
          </li>
        </ul>

        {/* 底部懸浮指標卡片列 */}
        <div className="oc-course-stats-row">
          <div className="oc-mini-stat-card credit">
            <div className="oc-stat-badge"><BookOutlined /></div>
            <div className="oc-stat-info">
              <span className="oc-stat-num">{courseData.credits || 0}</span>
              <span className="oc-stat-label">學分數</span>
            </div>
          </div>
          <div className="oc-mini-stat-card student">
            <div className="oc-stat-badge"><TeamOutlined /></div>
            <div className="oc-stat-info">
              <span className="oc-stat-num">{courseData.studentCount}</span>
              <span className="oc-stat-label">學生數</span>
            </div>
          </div>
          <div className="oc-mini-stat-card lesson">
            <div className="oc-stat-badge"><OrderedListOutlined /></div>
            <div className="oc-stat-info">
              <span className="oc-stat-num">{courseData.lessonCount}</span>
              <span className="oc-stat-label">課堂數</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import { useNavigate } from 'react-router-dom';
import { Card, Empty, Tag } from 'antd';
import {
  CalendarOutlined,
  EnvironmentOutlined,
  UserOutlined,
  TeamOutlined,
  ArrowRightOutlined,
  BookOutlined,
} from '@ant-design/icons';
import { WEEKDAY } from '@config/time';
import COURSE_BG from '@/assets/images/course_2.png';
import './index.css';

export default function OCCourseCardGroup(props) {
  const { courseData } = props;

  return (
    <div className="oc-course-card-group">
      <div className="oc-course-card-body">
        {courseData.length === 0 ? (
          <div className="oc-course-card-empty-container">
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description={
                <span className="oc-empty-text">尚無任何課程資料</span>
              }
            />
          </div>
        ) : (
          courseData.map((course, index) => {
            return <OCCourseCard key={course.id} data={course} index={index} />;
          })
        )}
      </div>
    </div>
  );
}

export const OCCourseCard = (props) => {
  const { data, index } = props;
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`./${data.id}`);
  };

  const scheduleWeekText =
    data?.scheduleWeek !== undefined && WEEKDAY[data.scheduleWeek]
      ? WEEKDAY[data.scheduleWeek].label
      : '未排課';

  const scheduleTimeText =
    data?.scheduleStartTime && data?.scheduleEndTime
      ? `${data.scheduleStartTime.slice(0, 5)} ~ ${data.scheduleEndTime.slice(0, 5)}`
      : '';

  return (
    <Card
      className="oc-course-card"
      hoverable
      style={{ '--data-index': index }}
      onClick={handleCardClick}
      cover={
        <div className="oc-card-cover-wrapper">
          <img
            draggable={false}
            alt={data?.name}
            src={COURSE_BG}
            className="oc-card-cover-img"
          />
          {data?.id && (
            <span className="oc-card-id-badge">ID: {data.id}</span>
          )}
          <div className="oc-card-tag-overlay">
            {data?.school && (
              <span className="oc-card-badge oc-badge-school">
                {data.school}
              </span>
            )}
            {data?.department && (
              <span className="oc-card-badge oc-badge-dept">
                {data.department}
              </span>
            )}
          </div>
        </div>
      }
    >
      <div className="oc-card-content">
        <h3 className="oc-card-title" title={data?.name}>
          <BookOutlined className="oc-title-icon" /> {data?.name}
        </h3>

        <div className="oc-card-details">
          <div className="oc-card-detail-item">
            <UserOutlined className="oc-detail-icon" />
            <span className="oc-detail-text">
              授課教師：<strong>{data?.teacherName || '未指派'}</strong>
            </span>
          </div>

          <div className="oc-card-detail-item">
            <CalendarOutlined className="oc-detail-icon" />
            <span className="oc-detail-label">時間：</span>
            <Tag color="warning" className="oc-time-tag">
              {scheduleWeekText} {scheduleTimeText}
            </Tag>
          </div>

          <div className="oc-card-detail-item">
            <EnvironmentOutlined className="oc-detail-icon" />
            <span className="oc-detail-text">
              教室：
              <span className="oc-classroom-text">
                {data?.classroom || '未定'}
              </span>
            </span>
          </div>

          <div className="oc-card-detail-item">
            <TeamOutlined className="oc-detail-icon" />
            <span className="oc-detail-text">
              學生人數：
              <span className="oc-count-text">
                {data?.studentCount !== undefined ? data.studentCount : 0} 人
              </span>
            </span>
          </div>
        </div>

        <div className="oc-card-footer">
          <span className="oc-card-action-link">
            進入課程 <ArrowRightOutlined />
          </span>
        </div>
      </div>
    </Card>
  );
};


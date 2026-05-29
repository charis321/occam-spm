import { useNavigate } from 'react-router-dom';
import { Button, Card, Popover } from 'antd';
import {
  HeartOutlined,
  ShareAltOutlined,
  EditOutlined,
  AlignLeftOutlined,
  InfoCircleOutlined,
  CloseSquareOutlined,
} from '@ant-design/icons';
// import COURSE_BG from '@/assets/images/course.png';
import COURSE_BG from '@/assets/images/course_2.png';
import './index.css';

export default function OCCourseCardGroup(props) {
  const { courseData } = props;

  return (
    <div className="oc-course-card-group">
      <div className="oc-course-card-body">
        {courseData.length === 0 ? (
          <div className="oc-course-card-empty">
            <h3>
              <CloseSquareOutlined />
              &nbsp; 這裡沒找到任何課程
            </h3>
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
  const navigator = useNavigate();

  const courseContent = (
    <div>
      <p>ID :{data?.id}</p>
      <p>
        上課時間: {data?.scheduleStartTime}~{data?.scheduleEndTime}
      </p>
    </div>
  );

  return (
    <Card
      className="oc-course-card"
      hoverable
      style={{ '--data-index': index }}
      size="small"
      cover={<img draggable={false} alt="example" src={COURSE_BG} />}
      actions={[
        <AlignLeftOutlined
          onClick={() => {
            navigator(`./${data.id}`);
          }}
        />,
        <Popover content={courseContent} title="詳情" trigger="click">
          <InfoCircleOutlined />
        </Popover>,
      ]}
    >
      <Card.Meta title={data?.name} description={data?.department} />
    </Card>
  );
};

import { Button, Card } from 'antd';
// import COURSE_BG from '@/assets/images/course.png';
import {
  HeartOutlined,
  ShareAltOutlined,
  EditOutlined,
  AlignLeftOutlined,
  InfoCircleOutlined,
} from '@ant-design/icons';
import COURSE_BG from '@/assets/images/course_2.png';
import './index.css';
import { useNavigate } from 'react-router-dom';
export default function OCCourseCardGroup(props) {
  const { courseData } = props;
  return (
    <div className="oc-course-card-group">
      {courseData.map((course) => {
        return <OCCourseCard key={course.id} data={course} />;
      })}
    </div>
  );
}

export const OCCourseCard = (props) => {
  const { data } = props;
  const navigator = useNavigate();

  return (
    <Card
      hoverable
      style={{
        width: 'calc((100% - 3rem)/4)',
        minWidth: 'calc((100% - 1rem)/2)',
      }}
      size="small"
      cover={<img draggable={false} alt="example" src={COURSE_BG} />}
      actions={[
        <AlignLeftOutlined
          onClick={() => {
            navigator(`./${data.id}`);
          }}
        />,
        <InfoCircleOutlined
          onClick={() => {
            navigator(`./${data.id}`);
          }}
        />,
      ]}
    >
      <Card.Meta title={data?.name} description={data?.department} />
    </Card>
  );
};

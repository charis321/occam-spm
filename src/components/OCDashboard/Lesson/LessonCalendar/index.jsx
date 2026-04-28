import { useNavigate } from 'react-router-dom';
import { Calendar, Button } from 'antd';
import { AuditOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

export default function OCLessonCalendar(props) {
  const { lessonData, lessonClick } = props;
  const navigator = useNavigate();

  const dateCellRender = (current) => {
    const date = current.format('YYYY-MM-DD');
    const cells = [];

    for (const lesson of lessonData) {
      const lessonDate = dayjs(lesson.startTime).format('YYYY-MM-DD');
      if (lessonDate === date) {
        cells.push(
          <Button
            size="small"
            color="primary"
            variant="solid"
            key={lesson.id}
            onClick={handleLessonClick(lesson)}
          >
            <span style={{ fontSize: '0.75rem' }}>
              <AuditOutlined />
              {lesson.courseName}
            </span>
          </Button>,
        );
      }
    }
    return <>{cells.map((cell) => cell)}</>;
  };

  const cellRender = (current, info) => {
    if (info.type === 'date') return dateCellRender(current);
    // if (info.type === 'month') return monthCellRender(current);
    return info.originNode;
  };
  const handleLessonClick = (lesson) => {
    return () => {
      navigator(`/dashboard/course/${lesson.courseId}/lesson/${lesson.id}`);
    };
  };
  return <Calendar fullscreen={true} cellRender={cellRender}></Calendar>;
}

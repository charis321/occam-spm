import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Button, Typography, Popover } from 'antd';
import { AuditOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { useDevice } from '@utils/hooks/useRWD.jsx';

import { ROLLCALL_MAP } from '@config/attendance';
import { PERIOD_TIME } from '@config/time';
export default function OCLessonCalendar(props) {
  const { lessonData } = props;
  const device = useDevice();
  const navigator = useNavigate();

  const stylesFunction = () => {
    return {
      root: {
        border: '2px solid #BDE3C3',
        borderRadius: 10,
        backgroundColor: 'rgba(189,227,195, 0.3)',
      },
    };
  };
  const dateCellRender = (current) => {
    const date = current.format('YYYY-MM-DD');
    const cells = [];
    const pcView = (lesson) => {
      return (
        <Button
          // className="oc-highlight"
          size="small"
          variant="outlined"
          key={lesson.id}
          // style={{ backgroundColor: ROLLCALL_MAP?.[lesson.rollcallStatus].bg }}
          color={ROLLCALL_MAP?.[lesson.rollcallStatus].color}
          block
          // style={{ width: 70 }}
          onClick={handleLessonClick(lesson)}
        >
          <Typography.Text
            ellipsis
            style={{ color: 'inherit', fontSize: '0.75rem' }}
          >
            <AuditOutlined />
            {lesson?.courseName}
          </Typography.Text>
        </Button>
      );
    };
    const mobileView = (lesson) => {
      const content = (
        <div>
          <p>{PERIOD_TIME(lesson?.startTime, lesson?.endTime)}</p>
          <Button
            size="small"
            variant="outlined"
            block
            onClick={handleLessonClick(lesson)}
          >
            前去
          </Button>
        </div>
      );
      return (
        <Popover
          key={lesson.id}
          content={content}
          title={lesson?.courseName}
          trigger="click"
        >
          <Button
            size="small"
            variant="outlined"
            color={ROLLCALL_MAP?.[lesson.rollcallStatus].color}
            block
          >
            <Typography.Text style={{ color: 'inherit', fontSize: '1rem' }}>
              {lesson?.courseName[0]}
            </Typography.Text>
          </Button>
        </Popover>
      );
    };

    for (const lesson of lessonData) {
      const lessonDate = dayjs(lesson.startTime).format('YYYY-MM-DD');
      if (lessonDate === date) {
        cells.push(device === 'PC' ? pcView(lesson) : mobileView(lesson));
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
  return (
    <Calendar
      fullscreen={true}
      cellRender={cellRender}
      classNames={{
        root: 'oc-calendar-root',
      }}
      style={{
        padding: 10,
        border: '2px solid #BDE3C3',
        borderRadius: 10,
        backgroundColor: 'rgba(189,227,195)',
      }}
    ></Calendar>
  );
}

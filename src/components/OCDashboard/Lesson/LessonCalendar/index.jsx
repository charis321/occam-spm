import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Button, Typography } from 'antd';
import { AuditOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { useDevice } from '@utils/hooks/useRWD.jsx';

import { ROLLCALL_MAP } from '@config/attendance';
import { PERIOD_TIME } from '@config/time';

export default function OCLessonCalendar(props) {
  const { lessonData } = props;
  const device = useDevice();
  const navigator = useNavigate();
  const [selectedValue, setSelectedValue] = useState(() => dayjs());

  const onSelect = (newValue) => {
    setSelectedValue(newValue);
  };

  const dateCellRender = (current) => {
    const date = current.format('YYYY-MM-DD');

    if (device === 'PC') {
      const cells = [];
      const pcView = (lesson) => {
        return (
          <Button
            size="small"
            variant="outlined"
            key={lesson.id}
            color={ROLLCALL_MAP?.[lesson.rollcallStatus].color}
            block
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

      for (const lesson of lessonData) {
        const lessonDate = dayjs(lesson.startTime).format('YYYY-MM-DD');
        if (lessonDate === date) {
          cells.push(pcView(lesson));
        }
      }
      return <>{cells.map((cell) => cell)}</>;
    } else {
      // 行動端模式：若當天有課，則在格子下方渲染一個精緻小圓點
      const hasLesson = lessonData.some(
        (lesson) => dayjs(lesson.startTime).format('YYYY-MM-DD') === date
      );
      return hasLesson ? <div className="oc-calendar-dot-marker" /> : null;
    }
  };

  const cellRender = (current, info) => {
    if (info.type === 'date') return dateCellRender(current);
    return info.originNode;
  };

  const handleLessonClick = (lesson) => {
    return () => {
      navigator(`/dashboard/course/${lesson.courseId}/lesson/${lesson.id}`);
    };
  };

  // 取得選取日期當天的課程行程
  const selectedDateString = selectedValue.format('YYYY-MM-DD');
  const dayLessons = lessonData.filter((lesson) => {
    return dayjs(lesson.startTime).format('YYYY-MM-DD') === selectedDateString;
  });

  return (
    <div className="oc-calendar-wrapper-layout">
      <Calendar
        fullscreen={device === 'PC'}
        cellRender={cellRender}
        value={selectedValue}
        onSelect={onSelect}
        classNames={{
          root: 'oc-calendar-root',
        }}
        style={{
          padding: 0,
          border: 'none',
          backgroundColor: 'transparent',
        }}
      />

      {device !== 'PC' && (
        <div className="oc-mobile-schedule-list">
          <h3>{selectedValue.format('MM月DD日')} 課程行程</h3>
          {dayLessons.length === 0 ? (
            <div className="oc-mobile-schedule-empty">今天沒有排課</div>
          ) : (
            dayLessons.map((lesson) => (
              <div
                key={lesson.id}
                className={`oc-mobile-schedule-card ${ROLLCALL_MAP?.[lesson.rollcallStatus].class}`}
              >
                <div className="oc-sched-card-header">
                  <h4>{lesson?.courseName}</h4>
                  <span className={`oc-sched-status-badge ${ROLLCALL_MAP?.[lesson.rollcallStatus].class}`}>
                    {ROLLCALL_MAP?.[lesson.rollcallStatus].title}
                  </span>
                </div>
                <div className="oc-sched-card-body">
                  <p className="oc-sched-time">🕒 {PERIOD_TIME(lesson?.startTime, lesson?.endTime)}</p>
                  {lesson?.classroom && (
                    <p className="oc-sched-room">📍 教室：{lesson.classroom}</p>
                  )}
                </div>
                <div className="oc-sched-card-footer">
                  <Button
                    type="primary"
                    block
                    onClick={handleLessonClick(lesson)}
                    className="oc-sched-btn"
                  >
                    進入課堂
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

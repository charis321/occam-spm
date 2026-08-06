import { useState, useEffect } from 'react';
import { useAuth } from '@utils/AuthContext';
import { apiUtil } from '@utils/WebApi';
import { CalendarOutlined } from '@ant-design/icons';
import OCLessonCalendar from '@components/OCDashboard/Lesson/LessonCalendar';
import OCLoading from '@components/OCCommon/OCLoading';
import OCTitle from '@components/OCCommon/OCTitle';
import './index.css';

export default function OCCalendar(props) {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [lessonData, setLessonData] = useState([]);

  useEffect(() => {
    const controller = new AbortController();
    getLessonData(controller.signal);
    return () => {
      controller.abort();
    };
  }, []);

  const getLessonData = async (signal) => {
    setIsLoading(true);
    const path = `/lesson/${user.role == 1 ? 'teacher' : 'student'}/${user.id}`;
    const res = await apiUtil(path, 'get', signal);
    if (res?.isSystemError) return;
    if (res?.code === 200) {
      res.data && setLessonData(res.data);
    }
    setIsLoading(false);
  };
  return (
    <>
      {isLoading ? (
        <OCLoading />
      ) : (
        <div className="oc-lesson-calendar-dashboard">
          <div className="oc-lesson-calendar-header">
            <OCTitle
              title="課程行事曆"
              description="查看所有課程的排課時間與地點"
            />
          </div>
          <div className="oc-lesson-calendar-body">
            <OCLessonCalendar lessonData={lessonData} />
          </div>
        </div>
      )}
    </>
  );
}

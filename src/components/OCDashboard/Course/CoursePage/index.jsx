import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { message } from 'antd';

import OCCourseInfo from '../CourseInfo';
import OCLoading from '@components/OCCommon/OCLoading';

import { apiUtil } from '../../../../Util/WebApi';
import { useAuth } from '../../../../Util/AuthContext';

import './index.css';
import OCCourseMenu from '../CourseMenu';

export default function OCCoursePage(props) {
  const { courseId } = useParams();
  const { user } = useAuth();
  const navigator = useNavigate();
  const [courseData, setCourseData] = useState();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    init(controller.signal);

    return () => {
      controller.abort();
    };
  }, [courseId]);

  const init = async (signal = null) => {
    try {
      setIsLoading(true);
      await getCourseData(signal);
    } catch (error) {
      console.error('Init error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getCourseData = async (signal) => {
    const path = `/course/${courseId}`;
    const res = await apiUtil(path, 'GET', signal);
    if (res?.isSystemError) return;
    if (res?.code === 200) {
      setCourseData(res.data);
    } else if (res?.code === 400) {
      message.error('找不到課程，即將返回課程管理頁面!');
      navigator('/dashboard/course');
    }
  };

  const deleteCourseData = async (signal) => {
    const path = `/course/${courseId}`;
    const res = await apiUtil(path, 'DELETE', signal);
    if (res?.isSystemError) return;
    if (res?.code === 200) {
      message.success('刪除課堂成功');
      navigator('/dashboard/course');
    } else {
      message.error('刪除失敗');
    }
  };
  const getLessonData = async (signal) => {
    const path = `/course/${courseId}/lesson`;
    const res = await apiUtil(path, 'GET', signal);
    if (res?.isSystemError) return;
    if (res?.code === 200) {
      setLessonData(res.data);
    } else {
      message.error('無法取得課堂資料');
    }
  };

  const handleLessonDisplayToggle = (e) => {
    setLessonDisplayMode(e.target.value);
  };
  const handleLessonAddDisplayToggle = (mode) => {
    return (e) => setLessonAddDisplay(mode);
  };

  const handleLessonClick = (lesson) => {
    setLessonFocus(lesson);
  };

  return (
    <>
      {isLoading ? (
        <OCLoading />
      ) : (
        <div className="oc-course-page">
          <section className="flex-row">
            <OCCourseInfo courseData={courseData} />
            <OCCourseMenu courseData={courseData} resetCourse={init} />
          </section>
        </div>
      )}
    </>
  );
}

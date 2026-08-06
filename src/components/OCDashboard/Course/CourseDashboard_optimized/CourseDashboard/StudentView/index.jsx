import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import OCLoading from '@components/OCCommon/OCLoading';
import { apiUtil } from '@utils/WebApi';
import { useAuth } from '@utils/AuthContext';
import './index.css';
import OCCourseCardGroup from '../../CourseCard';
import OCCourseSearch from '../../CourseSearch';

export default function OCCourseDashboardStudentView(props) {
  const { user } = useAuth();
  const [courseData, setCourseData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const controller = new AbortController();
    getCourseList(null, controller.signal);
    return () => {
      controller.abort();
    };
  }, []);

  const getCourseList = async (filter = null, signal = null) => {
    setIsLoading(true);
    // 💡 修正 BUG: 將 filter 作為第四個參數傳入，以啟用學生端搜尋過濾功能
    const res = await apiUtil(
      `/student/${user.id}/course`,
      'get',
      signal,
      filter,
    );

    if (res?.code === 200) {
      const courseData = res.data.map((item) => {
        return {
          ...item,
          scheduleTime: [item.scheduleStartTime, item.scheduleEndTime],
        };
      });
      setCourseData(courseData);
    }
    setIsLoading(false);
  };

  const changeUserFilter = (filter) => {
    getCourseList(filter, null);
  };

  return (
    <>
      {isLoading ? (
        <OCLoading />
      ) : (
        <div className="oc-course-dashboard">
          <div className="oc-course-header-section">
            <div className="oc-course-title-wrapper">
              <h2>課程管理</h2>
              <p>查看您選修的課程、上課時間及開課詳細資訊</p>
            </div>
          </div>
          <section>
            <OCCourseSearch changeCourseFilter={changeUserFilter} />
            <OCCourseCardGroup courseData={courseData} />
          </section>
        </div>
      )}
    </>
  );
}


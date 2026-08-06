import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'antd';
import { PlusCircleOutlined } from '@ant-design/icons';

import OCLoading from '@components/OCCommon/OCLoading';

import { apiUtil } from '@utils/WebApi';
import { useAuth } from '@utils/AuthContext';
import './index.css';
import OCCourseCardGroup from '../../CourseCard';
import OCCourseSearch from '../../CourseSearch';

export default function OCCourseDashboardTeacherView(props) {
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
    const res = await apiUtil(
      `/teacher/${user.id}/course`,
      'get',
      signal,
      filter,
    );
    if (res?.isSystemError) return;
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

  const handleAddCourse = () => {
    navigate(`/dashboard/course/new`);
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
              <h2>我的課程</h2>
              <p>管理您的課程、查詢學生成員與查看出勤率</p>
            </div>
            <div className="oc-course-controller">
              <Button
                type="primary"
                onClick={handleAddCourse}
                className="oc-add-course-btn"
                icon={<PlusCircleOutlined />}
              >
                新增課程
              </Button>
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


import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Table, Tag, Select, Input } from 'antd';
import { PlusCircleOutlined, SearchOutlined } from '@ant-design/icons';

import OCLoading from '@components/OCCommon/OCLoading';

import { apiUtil } from '@utils/WebApi';
import { useAuth } from '@utils/AuthContext';
import { WEEKDAY } from '@config/time';
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

  const columns = [
    {
      key: 'name',
      title: '課程標題',
      dataIndex: 'name',
    },
    {
      key: 'school',
      title: '開課學校',
      dataIndex: 'school',
    },
    {
      key: 'department',
      title: '開課系所',
      dataIndex: 'department',
    },
    {
      key: 'teacherName',
      title: '負責教師',
      dataIndex: 'teacherName',
    },
    {
      key: 'classroom',
      title: '教室',
      dataIndex: 'classroom',
    },
    {
      key: 'scheduleWeek',
      title: '上課日',
      dataIndex: 'scheduleWeek',
      render: (weekIdx) => {
        return <>{WEEKDAY[weekIdx].label}</>;
      },
    },
    {
      key: 'scheduleTime',
      title: '上課時間',
      dataIndex: 'scheduleTime',
      render: (timeObj) => {
        let time = '';
        if (Array.isArray(timeObj)) {
          time = `${timeObj[0].slice(0, -3)} ~ ${timeObj[1].slice(0, -3)}`;
        }
        return <>{time}</>;
      },
    },
    {
      key: 'student_court',
      title: '應到人數',
      dataIndex: 'studentCount',
    },
    {
      key: 'course_info',
      title: '詳細資訊',

      render: (item) => {
        return (
          <>
            <Button type="primary" onClick={handleEditCourse(item.id)}>
              查看課程
            </Button>
          </>
        );
      },
    },
  ];
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
  const handleEditCourse = (course_id) => {
    return () => {
      console.log(course_id);
      navigate(`/dashboard/course/${course_id}`);
    };
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
          <h2>我的課程</h2>
          <section>
            <div className="oc-course-controller">
              <Button type="primary" onClick={handleAddCourse}>
                <PlusCircleOutlined />
                新增課程
              </Button>
            </div>
          </section>
          <section>
            <OCCourseSearch changeCourseFilter={changeUserFilter} />
            <OCCourseCardGroup courseData={courseData} />
          </section>
        </div>
      )}
    </>
  );
}

import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { OCLessonAttendanceTable } from '../AttendanceTable';
import { apiUtil } from '@utils/WebApi';
import { PERIOD_TIME } from '@config/time';
import { ATTENDANCE_STATUS_MAP } from '@config/attendance';
import './index.css';

export default function OCLessonAttendance(props) {
  const { lessonId } = useParams();
  const [lessonData, setLessonData] = useState();
  const [attendanceData, setAttendanceData] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getLessonData();
    getLessonAttendanceData();
  }, []);

  const getLessonAttendanceData = async () => {
    const path = `/lesson/${lessonId}/attendance`;
    const res = await apiUtil(path, 'GET');
    if (res.code === 200) {
      setAttendanceData(res.data);
    } else {
      alert('資料取得失敗');
    }
  };
  const getLessonData = async () => {
    const path = `/lesson/${lessonId}`;
    const res = await apiUtil(path, 'GET');
    if (res.code === 200) {
      setLessonData(res.data);
    } else {
      alert('資料取得失敗');
    }
  };
  return (
    <div className="oc-lesson-attendance">
      <section>
        <div className="oc-lesson-info">
          <h3>上課時間:</h3>
          <p>{PERIOD_TIME(lessonData?.startTime, lessonData?.endTime)}</p>
          <p>{ATTENDANCE_STATUS_MAP[lessonData?.attendanceStatus]?.title}</p>
        </div>
      </section>
      <section>
        <OCLessonAttendanceTable
          className="oc-lesson-attendance-table"
          attendanceData={attendanceData}
          resetData={() => {
            getLessonAttendanceData();
          }}
        />
      </section>
    </div>
  );
}

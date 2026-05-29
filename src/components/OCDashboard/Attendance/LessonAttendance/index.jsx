import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from 'antd';
import { AuditOutlined } from '@ant-design/icons';
import { OCLessonAttendanceTable } from '../AttendanceTable';
import { apiUtil } from '@utils/WebApi';
import { PERIOD_TIME } from '@config/time';
import { ATTENDANCE_STATUS_MAP } from '@config/attendance';
import OCLoading from '@components/OCCommon/OCLoading';
import './index.css';
import { useAuth } from '../../../../Util/AuthContext';

export default function OCLessonAttendance(props) {
  const { lessonId } = useParams();
  const { user } = useAuth();
  const [lessonData, setLessonData] = useState();
  const [attendanceData, setAttendanceData] = useState([]);
  const [message, setMessage] = useState('');
  const navigator = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    init(controller.signal);
    return () => {
      controller.abort();
    };
  }, []);
  const init = async (signal) => {
    try {
      setIsLoading(true);
      await Promise.all([
        getLessonData(signal),
        getLessonAttendanceData(signal),
      ]);
    } catch (error) {
      console.error('Init error:', error);
    } finally {
      if (!signal.aborted) {
        setIsLoading(false);
      }
    }
  };
  const getLessonAttendanceData = async () => {
    const path = `/lesson/${lessonId}/attendance`;
    const res = await apiUtil(path, 'GET');
    if (res?.isSystemError) return;
    if (res?.code === 200) {
      setAttendanceData(res.data);
    } else {
      alert('資料取得失敗');
    }
  };
  const getLessonData = async () => {
    const path = `/lesson/${lessonId}`;
    const res = await apiUtil(path, 'GET');
    if (res?.isSystemError) return;
    if (res?.code === 200) {
      setLessonData(res.data);
    } else {
      alert('資料取得失敗');
    }
  };
  return (
    <>
      {isLoading ? (
        <OCLoading />
      ) : (
        <div className="oc-lesson-attendance">
          <section>
            <div className="oc-lesson-info">
              <h3>上課時間:</h3>
              <p>{PERIOD_TIME(lessonData?.startTime, lessonData?.endTime)}</p>
              <p>
                {ATTENDANCE_STATUS_MAP[lessonData?.attendanceStatus]?.title}
              </p>
              <Button
                onClick={() => {
                  navigator('../');
                }}
              >
                <AuditOutlined />
                返回課堂
              </Button>
            </div>
          </section>
          <section>
            <OCLessonAttendanceTable
              className="oc-lesson-attendance-table"
              attendanceData={attendanceData}
              resetData={() => {
                getLessonAttendanceData();
              }}
              readOnly={user?.role === 0}
            />
          </section>
        </div>
      )}
    </>
  );
}

import { useState, useEffect } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { Button, Input, Alert } from 'antd';
import { QRCodeSVG } from 'qrcode.react';
import { useAuth } from '@utils/AuthContext';
import { apiUtil } from '@utils/WebApi';
import { ATTENDANCE_STATUS_MAP } from '@config/attendance';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-tw';
import './index.css';

export default function OCLessonStudentPage(props) {
  const { user } = useAuth();
  const { lessonId, courseId } = useParams();
  const [searchParams] = useSearchParams();
  const attendingFromUrl = searchParams.get('attending') === 'true';
  const codeFromUrl = searchParams.get('code');

  const [lessonData, setLessonData] = useState();
  const [attendanceData, setAttendanceData] = useState();
  const [attendanceCode, setAttendanceCode] = useState(codeFromUrl || '');
  const [isAttending, setIsAttending] = useState(attendingFromUrl || false);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isWaiting, setIsWaiting] = useState(false);
  const navigator = useNavigate();

  useEffect(() => {
    getLessonWithAttendance();
    console.log('從URL進入點名頁面，帶入點名碼', codeFromUrl);
    // if (isAttending && codeFromUrl) {
    //   handleRollcall();
    // }
  }, []);

  const getLessonWithAttendance = async () => {
    setIsLoading(true);
    const path = `/lesson/${lessonId}/attendance/${user.id}`;
    const res = await apiUtil(path, 'GET');
    console.log('getLessonWithAttendance');
    if (res.code === 200) {
      console.log('getLessonWithAttendance', res.data);
      setLessonData(res.data.lesson);
      setAttendanceData(res.data.attendance);
    } else {
      alert('獲取課堂點名失敗');
    }
    setIsLoading(false);
  };
  const checkAttendanceTime = () => {
    if (lessonData) {
      const now = new Date();
      return lessonData.startTime <= now && lessonData.endTime >= now;
    }
    return false;
  };
  const handleRollcall = () => {
    setMessage('');
    if (!attendanceCode) {
      setMessage('請輸入點名碼');
      return;
    }
    if (attendanceCode !== lessonData.attendanceCode) {
      setMessage('點名碼錯誤');
      return;
    }
    addNewAttendance();
  };
  const addNewAttendance = async () => {
    setIsWaiting(true);
    const path = `/attendance`;
    const attendanceRequest = {
      studentId: user.id,
      lessonId: lessonId,
      status: 1,
    };
    const res = await apiUtil(path, 'POST', attendanceRequest);
    if (res.code === 200) {
      alert('點名成功');
      getLessonWithAttendance();
    } else {
      alert('新增點名紀錄失敗');
    }
    setIsWaiting(false);
  };
  // const vaildRollcall = async()=>{
  //     const path = `/lesson/${lessonId}/rollcall`
  //     const attendanceRequest = {
  //         "attendance_status": 1,
  //         "attendance_code": Math.random().toString(36).substring(2, 8).toUpperCase(),
  //     }
  //     const res = await apiUtil(path, "patch", attendanceRequest)
  //     if(res.code===200){
  //         console.log("openRollcall", res.data)
  //         setLessonData(res.data)
  //     } else {
  //         alert("開啟點名失敗")
  //     }
  // }
  return (
    <div className="oc-lesson-dashboard">
      <section>
        <div className="oc-lesson-info">
          <h3>{lessonData?.courseName || '未知課程'}</h3>
          <p>第{lessonData?.lessonIndex || '未知'}堂</p>
          <p>上課日期: {dayjs(lessonData?.startTime).format('YYYY-MM-DD')}</p>
          <p>
            課堂時間:
            {dayjs(lessonData?.startTime).format('A HH:mm')}~
            {dayjs(lessonData?.endTime).format('A HH:mm')}
          </p>
        </div>
        <div className="oc-lesson-attandance">
          {/* <h3>點名狀況</h3> */}
          {/* <div className='oc-lesson-check-attendance-time'>
                        <p>目前時間: {new Date().toLocaleString()} {checkAttendanceTime() ? "在點名時間內" : "不在點名時間內"}</p>
                    </div> */}
          <div id="rollcall-status">
            <h2>
              {ATTENDANCE_STATUS_MAP[lessonData?.attendanceStatus]?.title ||
                '未知狀態'}
            </h2>
          </div>
          {attendanceData ? (
            <div>
              <h3>已完成點名</h3>
              <p>
                點名時間: {new Date(attendanceData?.timestamp).toLocaleString()}
              </p>
            </div>
          ) : (
            <div>
              <Button
                type="primary"
                className="oc-start-attendance-btn"
                onClick={() => setIsAttending(true)}
                disabled={lessonData?.attendanceStatus !== 1}
              >
                開始點名
              </Button>
            </div>
          )}
        </div>
        {isAttending && (
          <div className="oc-lesson-attendance-block">
            {attendanceData ? (
              <div className="oc-lesson-attendance-block-body">
                <h2>您已完成點名</h2>
              </div>
            ) : (
              <div className="oc-lesson-attendance-block-body">
                <h2>請輸入點名碼</h2>
                {message && <Alert type="error" message={message} showIcon />}
                <div className="code-input">
                  <Input
                    placeholder="請輸入點名碼"
                    value={attendanceCode}
                    onChange={(e) => setAttendanceCode(e.target.value)}
                  />
                </div>

                <Button
                  type="primary"
                  onClick={handleRollcall}
                  disabled={isWaiting}
                  loading={isWaiting}
                >
                  送出點名碼
                </Button>
              </div>
            )}
            <Button className="close-btn" onClick={() => setIsAttending(false)}>
              X
            </Button>
          </div>
        )}
      </section>
    </div>
  );
}
// export default function OCAttendanceBlock(props){
//   const [isAttending, setIsAttending] = useState(false);
//   const [attendanceCode, setAttendanceCode] = useState('');
//   const [message, setMessage] = useState('');
//   const [isWaiting, setIsWaiting] = useState(false);

//   const NotattendanceView =
//     <>
//       <h2>請輸入點名碼</h2>
//         {message && <Alert type="error" message={message} showIcon />}
//         <div className="code-input">
//           <Input
//             placeholder="請輸入點名碼"
//             value={attendanceCode}
//             onChange={(e) => setAttendanceCode(e.target.value)}
//           />
//         </div>

//         <Button
//           type="primary"
//           onClick={handleRollcall}
//           disabled={isWaiting}
//           loading={isWaiting}
//         >
//           送出點名碼
//         </Button>
//         <Button className="close-btn" onClick={() => setIsAttending(false)}>
//         X
//       </Button>
//     </>

//     return(
//       <div>
//       </div>
//     )
// }

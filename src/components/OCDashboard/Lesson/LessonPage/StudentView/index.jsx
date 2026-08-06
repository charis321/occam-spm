import { useState, useEffect } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { Button, Input, Alert, Row, Col, Card, Empty, Space, Tag } from 'antd';
import {
  CheckCircleOutlined,
  SyncOutlined,
  BookOutlined,
  ControlOutlined,
  QrcodeOutlined,
  FileDoneOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons';
import { QRCodeSVG } from 'qrcode.react';
import OCCountDown from '@components/OCCommon/OCCountDown';

import { useAuth } from '@utils/AuthContext';
import { useSocket } from '@utils/hooks/useWebSocket';
import { apiUtil } from '@utils/WebApi';
import { ATTENDANCE_STATUS_MAP } from '@config/attendance';
import { PERIOD_TIME } from '@config/time';
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
  const [rollcallData, setRollcallData] = useState();
  const [attendanceData, setAttendanceData] = useState();
  const [attendanceResultDisplay, setAttendanceResultDisplay] = useState();

  const [rollcallCode, setRollcallCode] = useState(codeFromUrl || '');
  const [activateRollcallSocket, deactivateRollcallSocket] = useSocket(
    `/topic/rollcall/${lessonId}`,
    (event) => {
      console.log('ws-event', event);
      if (event.type === 'ROTATION') {
        setRollcallData((prev) => ({
          ...prev,
          code: event.code,
          nextRotationTime: event.nextRotationTime,
        }));
      } else if (event.type === 'SHUTDOWN') {
        setRollcallData((prev) => ({
          ...prev,
          status: event.status,
          code: event.code,
          nextRotationTime: event.nextRotationTime,
        }));
      }
    },
  );

  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isWaiting, setIsWaiting] = useState(false);
  const [isAttending, setIsAttending] = useState(attendingFromUrl || false);

  const navigator = useNavigate();

  useEffect(() => {
    const controller = new AbortController();
    init(controller.signal);
    return () => {
      controller.abort();
    };
  }, []);
  useEffect(() => {
    if (!rollcallData) return;
    if (rollcallData.status === 1) {
      activateRollcallSocket();
    } else {
      deactivateRollcallSocket();
    }
  }, [rollcallData]);

  const init = async (signal) => {
    try {
      setIsLoading(true);
      await Promise.all([
        getLessonWithAttendance(signal),
        getRollcallData(signal),
      ]);
    } catch (error) {
      alert('加載課堂頁面失敗', error);
    } finally {
      setIsLoading(false);
    }
  };
  const getRollcallData = async (signal) => {
    const path = `/rollcall/${lessonId}`;
    const res = await apiUtil(path, 'GET', signal);
    if (res?.isSystemError) return;
    if (res?.code === 200) {
      setRollcallData(res.data);
    } else {
      alert('獲取課堂點名狀態失敗');
    }
  };
  const getLessonWithAttendance = async (signal) => {
    setIsLoading(true);
    const path = `/lesson/${lessonId}/attendance/${user.id}`;
    const res = await apiUtil(path, 'GET', signal);
    if (res?.isSystemError) return;
    if (res?.code === 200) {
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

  const getCountDownTime = (time) => {
    console.log('getCountDown', rollcallData);
    if (!time) return 0;
    const countTime = dayjs(time).diff(dayjs(), 'second');
    return countTime > 0 ? countTime : 0;
  };

  const handleRollcall = () => {
    setMessage('');
    if (!rollcallCode) {
      setMessage('請輸入點名碼');
      return;
    }
    verifyAttendanceData();
  };
  const verifyAttendanceData = async () => {
    setIsWaiting(true);
    const path = `/attendance/verify`;
    const attendanceRequest = {
      studentId: user.id,
      lessonId: lessonId,
      status: 1,
      code: rollcallCode,
    };
    const res = await apiUtil(path, 'POST', null, attendanceRequest);
    if (res?.isSystemError) return;
    if (res?.code === 200) {
      getLessonWithAttendance();
    } else {
      alert('新增點名紀錄失敗');
    }
    setIsWaiting(false);
  };
  return (
    <article className="oc-lesson-page">
      <Row gutter={[24, 24]} style={{ width: '100%', margin: '1rem' }}>
        <Col xs={24} md={10}>
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <Card
              title={
                <span>
                  <BookOutlined /> 課堂資訊
                </span>
              }
              styles={{
                body: { paddingTop: '0' },
              }}
            >
              <h1 style={{ fontSize: '1.8rem', marginBottom: '12px' }}>
                {lessonData?.courseName}
              </h1>

              <p style={{ color: '#666' }}>
                <strong>課堂進度：</strong>第 {lessonData?.lessonIndex} 堂
              </p>
              <p style={{ color: '#666' }}>
                <strong>課堂代碼：</strong>
                {lessonData?.id}
              </p>
              <p style={{ color: '#666' }}>
                <strong>上課時間：</strong>
                {PERIOD_TIME(lessonData?.startTime, lessonData?.endTime)}
              </p>
              <Button
                color="primary"
                variant="outlined"
                icon={<BookOutlined />}
                onClick={() => {
                  navigator('../../');
                }}
              >
                回到課程
              </Button>
            </Card>
            <Card
              title={
                <span>
                  <ControlOutlined /> 點名操作面板
                </span>
              }
            >
              <div style={{ marginBottom: '20px', textAlign: 'center' }}>
                <p style={{ color: '#999', marginBottom: '4px' }}>
                  目前系統時間: {new Date().toLocaleString()}
                </p>
                <Tag color={checkAttendanceTime() ? 'success' : 'warning'}>
                  {checkAttendanceTime() ? '在上課時間內' : '不在上課時間內'}
                </Tag>

                <h2
                  style={{
                    marginTop: '16px',
                    color: rollcallData?.status === 1 ? '#52c41a' : '#ff4d4f',
                  }}
                >
                  {ATTENDANCE_STATUS_MAP[
                    rollcallData?.status ? rollcallData?.status : 0
                  ]?.title || '未知狀態'}
                </h2>
              </div>

              <Button
                type="primary"
                block
                size="large"
                className="oc-start-attendance-btn"
                onClick={() => setIsAttending(true)}
                danger={rollcallData?.status === 1}
                disabled={rollcallData?.status !== 1 || (attendanceData && attendanceData?.status !== 0)}
              >
                開始點名
              </Button>
            </Card>
          </Space>
        </Col>

        <Col xs={24} md={14}>
          <Card
            style={{
              // height: '90%',
              display: 'flex',
              flexDirection: 'column',
              // justifyContent: 'center',
              minWidth: 300,
            }}
            title={
              <span>
                <QrcodeOutlined /> 學生端簽到入口
              </span>
            }
            extra={
              <Button
                type="primary"
                ghost
                onClick={() => navigator(`attendance`)}
                icon={<FileDoneOutlined />}
                aria-label="查看詳細點名紀錄"
              >
                檢視點名紀錄
              </Button>
            }
          >
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
              {rollcallData?.status === 1 ? (
                <Space direction="vertical" size="large" align="center">
                  {attendanceData?.status === 1 ? (
                    <div className="oc-lesson-attendance-block-body success">
                      <CheckCircleOutlined
                        style={{ fontSize: '3rem', color: '#82be6c' }}
                      />
                      <h2>您已完成點名</h2>
                    </div>
                  ) : (
                    <div className="oc-lesson-attendance-block-body">
                      <Space direction="vertical" size="large" align="center">
                        {rollcallData?.rotationTime !== 0 && (
                          <Alert
                            message={
                              <span style={{ fontWeight: 600 }}>
                                安全點名碼定期輪換中（防截圖代簽）：
                                <OCCountDown
                                  key={rollcallData?.nextRotationTime}
                                  time={getCountDownTime(
                                    rollcallData?.nextRotationTime,
                                  )}
                                />
                              </span>
                            }
                            type="info"
                            showIcon
                            icon={<SyncOutlined spin />}
                            style={{
                              width: '100%',
                              borderRadius: '6px',
                              textAlign: 'left',
                            }}
                          />
                        )}
                        {rollcallData?.autoClose === 1 &&
                          rollcallData?.endTime && (
                            <Alert
                              message={
                                <span style={{ fontWeight: 'bold' }}>
                                  簽到通道截止倒數：
                                  <OCCountDown
                                    key={rollcallData?.endTime}
                                    time={getCountDownTime(
                                      rollcallData?.endTime,
                                    )}
                                  />
                                </span>
                              }
                              type="error"
                              showIcon
                              icon={<ClockCircleOutlined />}
                              style={{
                                width: '100%',
                                borderRadius: '6px',
                                textAlign: 'left',
                                border: '1px solid #ffccc7',
                              }}
                            />
                          )}
                        <h2>請輸入點名碼</h2>
                        {message && (
                          <Alert type="error" message={message} showIcon />
                        )}
                        <div className="code-input">
                          <Input.OTP
                            length={6}
                            placeholder="請輸入點名碼"
                            value={rollcallCode}
                            onChange={(value) => setRollcallCode(value)}
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
                      </Space>
                    </div>
                  )}
                </Space>
              ) : attendanceData?.status === 0 ? (
                <div>點名</div>
              ) : (
                <div>還沒有點名!!</div>
              )}
            </div>
          </Card>
        </Col>
      </Row>
    </article>
  );
}
// export const OCRollcallDisplay = (props) => {
//   const { status } = props;

//   const display_start = <></>;

//   const displayWaitng = (
//     <span>
//       <SyncOutlined />
//     </span>
//   );
//   return(
//     displayMap[status]
//   )
// };
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
//         {attendanceData?.status === 1 ? (
//               <div className="oc-lesson-attendance-block-body success">
//                 <CheckCircleOutlined
//                   style={{ fontSize: '3rem', color: '#97dc7e' }}
//                 />
//                 <h2>您已完成點名</h2>
//               </div>
//             ):

//             }

//       </div>
//     )
// }

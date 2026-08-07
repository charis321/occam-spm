import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { Button, Input, Alert, Row, Col, Card, Space, Tag, message } from 'antd';
import {
  CheckCircleOutlined,
  SyncOutlined,
  BookOutlined,
  ControlOutlined,
  QrcodeOutlined,
  FileDoneOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons';
import OCCountDown from '@components/OCCommon/OCCountDown';
import OCOverlay from '@components/OCCommon/OCOverlay';
import OCTitle from '@components/OCCommon/OCTitle';

import { useAuth } from '@utils/AuthContext';
import { useSocket } from '@utils/hooks/useWebSocket';
import { apiUtil } from '@utils/WebApi';
import { ATTENDANCE_STATUS_MAP } from '@config/attendance';
import { PERIOD_TIME } from '@config/time';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-tw';
import './index.css';

export default function OCLessonStudentPage() {
  const { user } = useAuth();
  const { lessonId, courseId } = useParams();
  const [searchParams] = useSearchParams();
  const attendingFromUrl = searchParams.get('attending') === 'true';
  const codeFromUrl = searchParams.get('code');

  const [lessonData, setLessonData] = useState();
  const [rollcallData, setRollcallData] = useState();
  const [attendanceData, setAttendanceData] = useState();

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

  const [localMsg, setLocalMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isWaiting, setIsWaiting] = useState(false);
  const [isAttending, setIsAttending] = useState(attendingFromUrl || false);

  // QR Code Scanner State & Refs
  const [isScanning, setIsScanning] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const animationFrameRef = useRef(null);
  const jsQRRef = useRef(null);

  const navigate = useNavigate();

  useEffect(() => {
    const controller = new AbortController();
    init(controller.signal);
    return () => {
      controller.abort();
      // Cleanup camera stream
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
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
      message.error('加載課堂頁面失敗：' + (error?.message || error));
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
      message.error('獲取課堂點名狀態失敗');
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
      message.error('獲取課堂點名失敗');
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
    if (!time) return 0;
    const countTime = dayjs(time).diff(dayjs(), 'second');
    return countTime > 0 ? countTime : 0;
  };

  const handleRollcall = () => {
    setLocalMsg('');
    if (!rollcallCode) {
      setLocalMsg('請輸入點名碼');
      return;
    }
    verifyAttendanceData(rollcallCode);
  };

  const verifyAttendanceData = async (codeToVerify) => {
    const code = codeToVerify || rollcallCode;
    if (!code) return;
    setIsWaiting(true);
    const path = `/attendance/verify`;
    const attendanceRequest = {
      studentId: user.id,
      lessonId: lessonId,
      status: 1,
      code: code,
    };
    const res = await apiUtil(path, 'POST', null, attendanceRequest);
    if (res?.isSystemError) return;
    if (res?.code === 200) {
      message.success('點名簽到成功！');
      getLessonWithAttendance();
    } else {
      message.error('點名碼驗證失敗或已過期');
    }
    setIsWaiting(false);
  };

  // QR Code scanning logic
  const handleOpenScanner = async () => {
    setIsScanning(true);
    setLocalMsg('');
    try {
      if (!jsQRRef.current) {
        const module = await import('jsqr');
        jsQRRef.current = module.default || module;
      }
      const constraints = {
        video: { facingMode: 'environment', width: { ideal: 640 }, height: { ideal: 480 } },
      };
      const stream = await window.navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.setAttribute('playsinline', 'true');
        videoRef.current.play();
        animationFrameRef.current = requestAnimationFrame(scanTick);
      }
    } catch (err) {
      console.error('Camera access error:', err);
      message.error('無法開啟相機，請確認已授予網頁相機使用權限');
      setIsScanning(false);
    }
  };

  const handleCloseScanner = () => {
    setIsScanning(false);
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
  };

  const scanTick = () => {
    if (!videoRef.current || !canvasRef.current) return;

    if (videoRef.current.readyState === videoRef.current.HAVE_ENOUGH_DATA) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

      const jsQR = jsQRRef.current;
      if (!jsQR) return;
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const code = jsQR(imageData.data, imageData.width, imageData.height, {
        inversionAttempts: 'dontInvert',
      });

      if (code) {
        const decodedText = code.data;
        let parsedCode = decodedText;

        // If decoded text is URL, extract the "code" query param
        if (decodedText.startsWith('http://') || decodedText.startsWith('https://')) {
          try {
            const urlObj = new URL(decodedText);
            const codeParam = urlObj.searchParams.get('code');
            if (codeParam) {
              parsedCode = codeParam;
            }
          } catch (e) {
            console.error('Failed to parse URL from QR Code', e);
          }
        }

        if (parsedCode && parsedCode.length === 6) {
          setRollcallCode(parsedCode);
          message.success('掃描成功，自動為您驗證點名碼！');
          handleCloseScanner();
          verifyAttendanceData(parsedCode);
          return;
        }
      }
    }
    animationFrameRef.current = requestAnimationFrame(scanTick);
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
                  navigate('../../');
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
              display: 'flex',
              flexDirection: 'column',
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
                onClick={() => navigate(`attendance`)}
                icon={<FileDoneOutlined />}
                aria-label="查看詳細點名紀錄"
              >
                檢視點名紀錄
              </Button>
            }
          >
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
              {rollcallData?.status === 1 ? (
                <Space direction="vertical" size="large" align="center" style={{ width: '100%' }}>
                  {attendanceData?.status === 1 ? (
                    <div className="oc-lesson-attendance-block-body success">
                      <CheckCircleOutlined
                        style={{ fontSize: '3rem', color: '#82be6c' }}
                      />
                      <h2>您已完成點名</h2>
                    </div>
                  ) : (
                    <div className="oc-lesson-attendance-block-body" style={{ width: '100%' }}>
                      <Space direction="vertical" size="large" align="center" style={{ width: '100%' }}>
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
                        {localMsg && (
                          <Alert type="error" message={localMsg} showIcon style={{ marginBottom: '1rem' }} />
                        )}
                        <div className="code-input" style={{ marginBottom: '1rem' }}>
                          <Input.OTP
                            length={6}
                            placeholder="請輸入點名碼"
                            value={rollcallCode}
                            onChange={(value) => setRollcallCode(value)}
                          />
                        </div>
                        <Space direction="vertical" size="middle" align="center" style={{ width: '100%' }}>
                          <Button
                            type="primary"
                            onClick={handleRollcall}
                            disabled={isWaiting}
                            loading={isWaiting}
                            className="oc-btn-amber-solid"
                            style={{ height: '40px', width: '220px' }}
                          >
                            送出點名碼
                          </Button>
                          <Button
                            icon={<QrcodeOutlined />}
                            onClick={handleOpenScanner}
                            className="oc-btn-amber-outline"
                            style={{ height: '40px', width: '220px' }}
                          >
                            掃描 QR Code
                          </Button>
                        </Space>
                      </Space>
                    </div>
                  )}
                </Space>
              ) : (
                <div className="oc-student-waiting-panel">
                  <div className="oc-panel-icon-wrapper">
                    <ClockCircleOutlined className="oc-pulsing-icon" />
                  </div>
                  <h3>點名尚未開始</h3>
                  <p>教師目前尚未發布本堂課的點名碼。請稍候，通道開啟時頁面將自動更新。</p>
                </div>
              )}
            </div>
          </Card>
        </Col>
      </Row>

      {/* QR Code Scanner Overlay */}
      {isScanning && (
        <OCOverlay toggle={handleCloseScanner}>
          <div className="oc-qr-scanner-modal">
            <OCTitle
              title="相機掃描簽到"
              description="請將手機鏡頭對焦在教師端發布的二維碼上"
            />
            <div className="oc-scanner-viewport-container">
              <video
                ref={videoRef}
                className="oc-scanner-video"
              />
              <div className="oc-scanner-overlay">
                <div className="oc-scanner-laser" />
                <div className="oc-scanner-corner top-left" />
                <div className="oc-scanner-corner top-right" />
                <div className="oc-scanner-corner bottom-left" />
                <div className="oc-scanner-corner bottom-right" />
              </div>
            </div>
            <canvas ref={canvasRef} style={{ display: 'none' }} />
            <div style={{ textAlign: 'center', marginTop: '1.25rem' }}>
              <Button onClick={handleCloseScanner} size="large" className="oc-btn-amber-outline" style={{ borderRadius: '8px' }}>
                取消掃描
              </Button>
            </div>
          </div>
        </OCOverlay>
      )}
    </article>
  );
}

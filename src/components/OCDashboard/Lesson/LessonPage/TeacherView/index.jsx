import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import { Button, Select, Form, Space, Row, Col, Card, Empty, Tag } from 'antd';
import {
  FileDoneOutlined,
  BookOutlined,
  EditOutlined,
  DeleteOutlined,
  ControlOutlined,
  QrcodeOutlined,
} from '@ant-design/icons';

import { apiUtil } from '@utils/WebApi';
import { useSocket } from '@utils/hooks/useWebSocket';
import { useConfirm } from '@utils/hooks/useConfirm';

import { ATTENDANCE_STATUS_MAP } from '@config/attendance';
import { PERIOD_TIME } from '@config/time';
import LOGO_ICON from '@/assets/images/logo_icon_gray.png';

import OCLoading from '@components/OCCommon/OCloading';
import OCCountDown from '@components/OCCommon/OCCountDown';
import axios from 'axios';
import dayjs from 'dayjs';

export default function OCLessonPageTeacherView(props) {
  const { lessonId, courseId } = useParams();
  const [lessonData, setLessonData] = useState();
  const [rollcallData, setRollcallData] = useState();
  const [rollcallForm] = Form.useForm();
  const [activateCodeSocket, deactivateCodeSocket] = useSocket(
    `/topic/rollcall/${lessonId}/code`,
    ({ code, nextRotationTime }) => {
      setRollcallData((prev) => ({
        ...prev,
        code: code,
        nextRotationTime: nextRotationTime,
      }));
    },
  );
  const navigator = useNavigate();
  const [showConfirm, confirmElement] = useConfirm();
  const abortControllerRef = useRef();

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    init();
    return () => {
      abortControllerRef.current.abort();
      deactivateCodeSocket();
    };
  }, []);

  useEffect(() => {
    if (!rollcallData) return;
    if (rollcallData.status === 1 && rollcallData.rotationTime > 0) {
      activateCodeSocket();
    } else {
      deactivateCodeSocket();
    }
  }, [rollcallData]);

  const init = async () => {
    const controller = new AbortController();
    abortControllerRef.current = controller;
    try {
      setIsLoading(true);
      await Promise.allSettled([
        getLessonDetailData(controller.signal),
        getRollcallData(controller.signal),
      ]);
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };
  const updateRollcallData = async (params) => {
    const path = `/rollcall/${lessonId}`;
    const res = await apiUtil(path, 'patch', null, params);
    if (res?.isSystemError) return;
    if (res?.code === 200) {
      getRollcallData();
    } else {
      alert('更新點名失敗');
    }
  };
  const getRollcallData = async (signal) => {
    const path = `/rollcall/${lessonId}`;
    const res = await apiUtil(path, 'GET', signal);
    if (res?.isSystemError) return;
    if (res?.code === 200) {
      if (res.data) {
        setRollcallData(res.data);
      } else {
        setRollcallData({
          status: 0,
          rotationTime: 300,
          nextRotationTime: 0,
        });
      }
    } else if (res?.code === 404) {
      alert(res?.msg);
      navigator('../');
    } else {
      alert('獲取課堂點名狀態失敗');
      navigator('../');
    }
  };
  const getLessonDetailData = async (signal) => {
    const path = `/lesson/${lessonId}`;
    const res = await apiUtil(path, 'GET', signal);
    if (res?.isSystemError) return;
    if (res?.code === 200) {
      setLessonData(res.data);
    } else if (res?.code === 404) {
      alert(res?.msg);
      navigator('../');
    } else {
      alert('獲取課堂紀錄失敗');
      navigator('../');
    }
  };
  const deleteLessonData = async (signal) => {
    setIsLoading(true);
    const path = `/lesson/${lessonId}`;
    const res = await apiUtil(path, 'DELETE', signal);
    if (res?.isSystemError) return;
    if (res?.code === 200) {
      alert('刪除課堂紀錄成功');
      navigator('../');
    } else {
      alert('刪除課堂紀錄失敗');
      navigator('../');
    }
    setIsLoading(false);
  };
  const getAttendanceQRCode = (attendanceCode) => {
    const baseUrl = `${window.location.origin + import.meta.env.BASE_URL}`;
    return `${baseUrl}#/dashboard/course/${courseId}/lesson/${lessonId}?attending=true&code=${attendanceCode}`;
  };
  const checkAttendanceTime = () => {
    if (lessonData) {
      const now = dayjs();
      return (
        dayjs(lessonData.startTime).isBefore(now) &&
        dayjs(lessonData.endTime).isAfter(now)
      );
    }
    return false;
  };
  const getCountDownTime = () => {
    console.log('getCountDown', rollcallData);
    if (!rollcallData || !rollcallData.nextRotationTime) return 0;
    const countTime = dayjs(rollcallData.nextRotationTime).diff(
      dayjs(),
      'second',
    );
    return countTime > 0 ? countTime : 0;
  };

  const handleRollcall = (values) => {
    let status = 0;
    if (!rollcallData || rollcallData.status === 0) {
      status = 1;
    } else if (rollcallData.status === 1) {
      status = 2;
    } else if (rollcallData.status === 2) {
      status = 1;
    }

    const params = {
      lessonId: lessonId,
      mode: 0,
      status: status,
      rotationTime: values.rotationTime,
      // endTime: values.endTime,
    };
    updateRollcallData(params);
  };

  const handleReset = () => {};
  const handleLessonAction = (action) => {
    return () => {
      if (action === 'delete') {
        showConfirm(
          <>
            <span style={{ color: 'red' }}>
              警告!!即將刪除這門課堂!
              <br />
              提示您:
              如果刪除課堂，此課堂的全部資料，包含學生出席紀錄等也會一併銷毀
            </span>
            請問確定要刪除課堂嗎?
          </>,
          () => {
            const controller = new AbortController();
            abortControllerRef.current = controller;
            deleteLessonData(controller.signal);
          },
          () => {},
        );
      }
    };
  };

  return (
    <>
      {isLoading ? (
        <OCLoading />
      ) : (
        <article className="oc-lesson-page">
          <Row gutter={[24, 24]} style={{ width: '100%', margin: '1rem' }}>
            <Col xs={24} md={10}>
              <Space
                direction="vertical"
                size="large"
                style={{ width: '100%' }}
              >
                <Card
                  title={
                    <span>
                      <BookOutlined /> 課堂資訊
                    </span>
                  }
                  extra={
                    <Space>
                      <Button
                        type="text"
                        icon={<EditOutlined />}
                        aria-label="編輯課堂資訊"
                      >
                        編輯
                      </Button>
                      <Button
                        type="text"
                        danger
                        icon={<DeleteOutlined />}
                        aria-label="刪除這堂課"
                        onClick={handleLessonAction('delete')}
                      >
                        刪除
                      </Button>
                    </Space>
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
                      {checkAttendanceTime()
                        ? '在上課時間內'
                        : '不在上課時間內'}
                    </Tag>

                    <h2
                      style={{
                        marginTop: '16px',
                        color:
                          rollcallData?.status === 1 ? '#52c41a' : '#ff4d4f',
                      }}
                    >
                      {ATTENDANCE_STATUS_MAP[
                        rollcallData?.status ? rollcallData?.status : 0
                      ]?.title || '未知狀態'}
                    </h2>
                  </div>

                  <Form
                    form={rollcallForm}
                    layout="vertical"
                    onFinish={handleRollcall}
                  >
                    <Form.Item
                      label="點名碼輪換時間"
                      name="rotationTime"
                      initialValue={
                        rollcallData ? rollcallData.rotationTime : 0
                      }
                    >
                      <Select
                        disabled={rollcallData?.status === 1}
                        options={[
                          { value: 0, label: '不輪換' },
                          { value: 3, label: '3秒' },
                          { value: 30, label: '30秒' },
                          { value: 300, label: '5分鐘' },
                          { value: 600, label: '10分鐘' },
                          { value: 1200, label: '20分鐘' },
                          { value: 1800, label: '30分鐘' },
                          { value: 3600, label: '1小時' },
                        ]}
                      />
                    </Form.Item>

                    <Form.Item
                      label="自動關閉點名"
                      name="endTime"
                      initialValue={0}
                    >
                      <Select
                        disabled={rollcallData?.status === 1}
                        options={[
                          { value: 0, label: '不啟用' },
                          { value: 1, label: '上課時間結束' },
                          { value: 2, label: '定時' },
                        ]}
                      />
                    </Form.Item>

                    <Button
                      type="primary"
                      block // 💡 改為滿版大按鈕，方便老師在講台上遠程一鍵點擊
                      size="large"
                      danger={rollcallData?.status === 1} // 正在點名時按鈕變紅（暗示按下會中止）
                      htmlType="submit"
                    >
                      {!rollcallData ||
                      rollcallData?.status === 0 ||
                      rollcallData?.status === 2
                        ? '開始點名'
                        : '結束點名'}
                    </Button>
                  </Form>
                </Card>
              </Space>
            </Col>

            {/* ================= 右側：大畫布點名碼展示欄 ================= */}
            <Col xs={24} md={14}>
              <Card
                style={{
                  height: '100%',
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
                      {rollcallData?.rotationTime !== 0 && (
                        <div
                          style={{
                            backgroundColor: '#fff2e8',
                            padding: '8px 16px',
                            borderRadius: '4px',
                          }}
                        >
                          <span
                            style={{ color: '#fa541c', fontWeight: 'bold' }}
                          >
                            ⚠️ 點名碼安全輪換中：
                            <OCCountDown
                              key={rollcallData?.code}
                              time={getCountDownTime()}
                            />
                          </span>
                        </div>
                      )}

                      {/* 點名碼字體放大，並加上顯眼的背景框 */}
                      <div
                        style={{
                          background: '#f5f5f5',
                          padding: '12px 12px',
                          borderRadius: '8px',
                          border: '1px dashed #ccc',
                        }}
                      >
                        <span
                          style={{
                            fontSize: '4rem',
                            fontWeight: 'bold',
                            letterSpacing: '4px',
                            fontFamily: 'monospace',
                          }}
                        >
                          {rollcallData.code}
                        </span>
                      </div>

                      {/* QR Code 加上淡淡的外陰影提升高級感 */}
                      <div
                        style={{
                          padding: '12px',
                          background: '#fff',
                          borderRadius: '12px',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                        }}
                      >
                        <QRCodeSVG
                          value={getAttendanceQRCode(rollcallData.code)}
                          size={220}
                          bgColor="#fff"
                          fgColor="#333"
                          imageSettings={{
                            src: LOGO_ICON,
                            height: 30,
                            width: 30,
                            excavate: true,
                          }}
                        />
                      </div>
                    </Space>
                  ) : (
                    // 💡 體驗細節：當沒點名時，右側大畫布給予一個漂亮的空白導引提示
                    <Empty
                      image={Empty.PRESENTED_IMAGE_SIMPLE}
                      description="目前未開啟點名功能，設定左側面板後點擊「開始點名」"
                    />
                  )}
                </div>
              </Card>
            </Col>
          </Row>
          {confirmElement}
        </article>
        //   <div className="oc-lesson-page">
        //     <section className="oc-lesson-attendance">
        //       <h3>課堂資訊</h3>
        //       <h2>{lessonData?.courseName}</h2>
        //       <h3>第{lessonData?.lessonIndex}堂</h3>
        //       <p>課堂ID: {lessonData?.id}</p>

        //       <p>
        //         課堂時間:
        //         {PERIOD_TIME(lessonData?.startTime, lessonData?.endTime)}
        //       </p>
        //     </section>
        //     <section className="oc-lesson-controller">
        //       <h3>操作</h3>
        //       <Button className="delete-lesson-btn">編輯</Button>
        //       <Button danger className="delete-lesson-btn">
        //         刪除
        //       </Button>
        //     </section>
        //     <section className="oc-lesson-attendance">
        //       <h3>點名狀況</h3>
        //       <Button
        //         onClick={() => {
        //           navigator(`attendance`);
        //         }}
        //         icon={<FileDoneOutlined />}
        //       >
        //         點名紀錄
        //       </Button>
        //       <div className="oc-lesson-check-attendance-time">
        //         <p>目前時間: {new Date().toLocaleString()}</p>
        //         <span>
        //           {checkAttendanceTime() ? '在上課時間內' : '不在上課時間內'}
        //         </span>
        //       </div>
        //       <h1>
        //         {ATTENDANCE_STATUS_MAP[
        //           rollcallData?.status ? rollcallData?.status : 0
        //         ]?.title || '未知狀態'}
        //       </h1>
        //     </section>
        //     <section className="oc-lesson-attendance-action">
        //       <h3>點名操作</h3>
        //       <Form form={rollcallForm} layout="inline" onFinish={handleRollcall}>
        //         <Space size="large" align="start">
        //           <Form.Item
        //             label="點名碼輪換時間"
        //             name="rotationTime"
        //             initialValue={rollcallData ? rollcallData.rotationTime : 0}
        //           >
        //             <Select
        //               disabled={rollcallData?.status == 1}
        //               style={{ width: 120 }}
        //               options={[
        //                 { value: 0, label: '不輪換' },
        //                 { value: 3, label: '3秒' },
        //                 { value: 30, label: '30秒' },
        //                 { value: 300, label: '5分鐘' },
        //                 { value: 600, label: '10分鐘' },
        //                 { value: 1200, label: '20分鐘' },
        //                 { value: 1800, label: '30分鐘' },
        //                 { value: 3600, label: '1小時' },
        //               ]}
        //             />
        //           </Form.Item>
        //           <Form.Item label="自動關閉點名" name="endTime" initialValue={0}>
        //             <Select
        //               disabled={rollcallData?.status == 1}
        //               style={{ width: 120 }}
        //               options={[
        //                 { value: 0, label: '不啟用' },
        //                 { value: 1, label: '上課時間結束' },
        //                 { value: 2, label: '定時' },
        //               ]}
        //             />
        //           </Form.Item>
        //           <Button
        //             type="primary"
        //             className="oc-start-attendance-btn"
        //             htmlType="submit"
        //           >
        //             {!rollcallData ||
        //             rollcallData?.status === 0 ||
        //             rollcallData?.status === 2
        //               ? '開始點名'
        //               : '結束點名'}
        //           </Button>
        //         </Space>
        //       </Form>
        //     </section>
        //     <section className="oc-lesson-rollcall">
        //       <h3>點名碼</h3>

        //       {rollcallData?.status === 1 && (
        //         <>
        //           <div className="oc-lesson-rollcall-code">
        //             {rollcallData?.rotationTime !== 0 && (
        //               <div>
        //                 <h4>
        //                   點名碼輪換:
        //                   <OCCountDown
        //                     key={rollcallData?.code}
        //                     time={getCountDownTime()}
        //                   />
        //                 </h4>
        //               </div>
        //             )}
        //             <div className="oc-lesson-rollcall-code-text">
        //               <span style={{ fontSize: '3rem' }}>
        //                 {rollcallData.code}
        //               </span>
        //             </div>
        //           </div>
        //           <QRCodeSVG
        //             value={getAttendanceQRCode(rollcallData.code)}
        //             size={256}
        //             bgColor="#fff"
        //             fgColor="#333"
        //             imageSettings={{
        //               src: LOGO_ICON, // 你的 Logo 網址
        //               height: 48,
        //               width: 48,

        //               excavate: true,
        //             }}
        //           />
        //         </>
        //       )}
        //     </section>
        //   </div>
      )}
    </>
  );
}

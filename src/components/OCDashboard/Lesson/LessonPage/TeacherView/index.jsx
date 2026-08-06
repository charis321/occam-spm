import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import {
  Button,
  Select,
  Form,
  Space,
  Row,
  Col,
  Card,
  Empty,
  Tag,
  Switch,
  DatePicker,
  Alert,
  Typography,
  message,
} from 'antd';
import {
  FileDoneOutlined,
  BookOutlined,
  EditOutlined,
  DeleteOutlined,
  ControlOutlined,
  QrcodeOutlined,
  SyncOutlined,
  ClockCircleOutlined,
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
  const isAutoCloseEnabled = Form.useWatch('isAutoCloseEnabled', rollcallForm);
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
  const navigator = useNavigate();
  const [showConfirm, confirmElement] = useConfirm();
  const abortControllerRef = useRef();

  const [isLoading, setIsLoading] = useState(false);
  const [isWaiting, setIsWaiting] = useState(false);

  useEffect(() => {
    init();
    return () => {
      abortControllerRef.current.abort();
      deactivateRollcallSocket();
    };
  }, []);
  useEffect(() => {
    if (!rollcallData) return;
    if (
      rollcallData.status === 1 &&
      (rollcallData.rotationTime > 0 || rollcallData.autoClose === 1)
    ) {
      activateRollcallSocket();
    } else {
      deactivateRollcallSocket();
    }
  }, [rollcallData]);
  useEffect(() => {
    if (lessonData?.endTime) {
      rollcallForm.setFieldsValue({
        autoCloseTime: rollcallData?.endTime
          ? dayjs(rollcallData.endTime)
          : dayjs(lessonData.endTime),
        isAutoCloseEnabled: rollcallData ? rollcallData.autoClose !== 0 : true,
      });
    }
  }, [lessonData, rollcallData, rollcallForm]);
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
    setIsWaiting(true);
    const path = `/rollcall/${lessonId}`;
    const res = await apiUtil(path, 'patch', null, params);
    if (res?.isSystemError) return;
    if (res?.code === 200) {
      getRollcallData();
    } else {
      message.error('更新點名失敗');
    }
    setIsWaiting(false);
  };
  const getRollcallData = async (signal) => {
    const path = `/rollcall/${lessonId}`;
    const res = await apiUtil(path, 'GET', signal);
    if (res?.isSystemError) return;
    if (res?.code === 200) {
      if (res.data) {
        setRollcallData(res.data);
        rollcallForm.setFieldValue('rotationTime', res.data?.rotationTime);
        rollcallForm.setFieldValue('endTime', res.data?.endTime);
      } else {
        setRollcallData({
          status: 0,
          rotationTime: 300,
          nextRotationTime: 0,
        });
      }
    } else if (res?.code === 404) {
      message.warning(res?.msg);
      navigator('../');
    } else {
      message.error('獲取課堂點名狀態失敗');
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
      message.warning(res?.msg);
      navigator('../');
    } else {
      message.error('獲取課堂紀錄失敗');
      navigator('../');
    }
  };
  const deleteLessonData = async (signal) => {
    setIsLoading(true);
    const path = `/lesson/${lessonId}`;
    const res = await apiUtil(path, 'DELETE', signal);
    if (res?.isSystemError) return;
    if (res?.code === 200) {
      message.success('刪除課堂紀錄成功');
      navigator('../');
    } else {
      message.error('刪除課堂紀錄失敗');
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
  // const getCountDownTime = () => {
  //   console.log('getCountDown', rollcallData);
  //   if (!rollcallData || !rollcallData.nextRotationTime) return 0;
  //   const countTime = dayjs(rollcallData.nextRotationTime).diff(
  //     dayjs(),
  //     'second',
  //   );
  //   return countTime > 0 ? countTime : 0;
  // };
  const getCountDownTime = (time) => {
    console.log('getCountDown', rollcallData);
    if (!time) return 0;
    const countTime = dayjs(time).diff(dayjs(), 'second');
    return countTime > 0 ? countTime : 0;
  };

  const disabledAutoCloseDate = (current) => {
    return current && current < dayjs().startOf('day');
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
    console.log('values', values);
    const params = {
      lessonId,
      mode: 0,
      status: status,
      rotationTime: values.rotationTime,
      autoClose: values.isAutoCloseEnabled ? 1 : 0,
      endTime: values.isAutoCloseEnabled
        ? values.autoCloseTime.toISOString()
        : null,
    };
    updateRollcallData(params);
  };

  const handleReset = () => { };
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
          () => { },
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
          <Row gutter={[24, 24]} style={{ width: '100%' }}>
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
                      {/* <Button
                        type="text"
                        icon={<EditOutlined />}
                        aria-label="編輯課堂資訊"
                      >
                        編輯
                      </Button> */}
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
                      label={
                        <span style={{ fontWeight: 500 }}>自動關閉點名</span>
                      }
                      style={{ marginBottom: '24px' }}
                    >
                      <Row gutter={16} align="middle">
                        <Col span={6}>
                          <Form.Item
                            name="isAutoCloseEnabled"
                            valuePropName="checked"
                            noStyle
                          >
                            <Switch
                              disabled={rollcallData?.status === 1}
                              checkedChildren="開啟"
                              unCheckedChildren="關閉"
                              style={{ width: '100%' }}
                            />
                          </Form.Item>
                        </Col>
                        <Col span={18}>
                          <Form.Item
                            name="autoCloseTime"
                            style={{ marginBottom: 0 }}
                            rules={[
                              {
                                required: isAutoCloseEnabled,
                                message: '請設定關閉時間！',
                              },
                              {
                                validator: (_, value) => {
                                  if (isAutoCloseEnabled && value) {
                                    if (value.isBefore(dayjs())) {
                                      return Promise.reject(
                                        new Error(
                                          '自動關閉時間不能早於當前時間！',
                                        ),
                                      );
                                    }
                                  }
                                  return Promise.resolve();
                                },
                              },
                            ]}
                            initialValue={
                              lessonData?.endTime
                                ? dayjs(lessonData.endTime)
                                : dayjs()
                            }
                          >
                            <DatePicker
                              showTime
                              format="YYYY-MM-DD HH:mm"
                              style={{ width: '100%' }}
                              placeholder="請選擇關閉時間"
                              disabledDate={disabledAutoCloseDate}
                              disabled={
                                !isAutoCloseEnabled ||
                                rollcallData?.status === 1
                              }
                            />
                          </Form.Item>
                        </Col>
                      </Row>
                    </Form.Item>
                    <Button
                      type="primary"
                      block
                      size="large"
                      danger={rollcallData?.status === 1}
                      htmlType="submit"
                      disabled={isWaiting}
                      loading={isWaiting}
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
                <div style={{ textAlign: 'center' }}>
                  {rollcallData?.status === 1 ? (
                    // <Space direction="vertical" size="large" align="center">
                    //   {rollcallData?.rotationTime !== 0 && (
                    //     <div
                    //       style={{
                    //         backgroundColor: '#fff2e8',
                    //         padding: '8px 16px',
                    //         borderRadius: '4px',
                    //       }}
                    //     >
                    //       <span
                    //         style={{ color: '#fa541c', fontWeight: 'bold' }}
                    //       >
                    //         ⚠️ 點名碼安全輪換中：
                    //         <OCCountDown
                    //           key={rollcallData?.code}
                    //           time={getCountDownTime(
                    //             rollcallData?.nextRotationTime,
                    //           )}
                    //         />
                    //       </span>
                    //     </div>
                    //   )}
                    //   {rollcallData?.autoClose === 1 && (
                    //     <div
                    //       style={{
                    //         backgroundColor: '#fff2e8',
                    //         padding: '8px 16px',
                    //         borderRadius: '4px',
                    //       }}
                    //     >
                    //       <span
                    //         style={{ color: '#fa1c1c', fontWeight: 'bold' }}
                    //       >
                    //         ⚠️ 點名關閉倒數：
                    //         <OCCountDown
                    //           key={rollcallData?.code}
                    //           time={getCountDownTime(rollcallData?.endTime)}
                    //         />
                    //       </span>
                    //     </div>
                    //   )}
                    //   <div
                    //     style={{
                    //       background: '#f5f5f5',
                    //       padding: '5px 10px',
                    //       borderRadius: '8px',
                    //       border: '1px dashed #ccc',
                    //     }}
                    //   >
                    //     <span
                    //       style={{
                    //         fontSize: '3rem',
                    //         fontWeight: 'bold',
                    //         letterSpacing: '4px',
                    //         fontFamily: 'monospace',
                    //       }}
                    //     >
                    //       {rollcallData.code}
                    //     </span>
                    //   </div>
                    //   <div
                    //     style={{
                    //       padding: '12px',
                    //       background: '#fff',
                    //       borderRadius: '12px',
                    //       boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                    //     }}
                    //   >
                    //     <QRCodeSVG
                    //       value={getAttendanceQRCode(rollcallData.code)}
                    //       size={220}
                    //       bgColor="#fff"
                    //       fgColor="#333"
                    //       imageSettings={{
                    //         src: LOGO_ICON,
                    //         height: 30,
                    //         width: 30,
                    //         excavate: true,
                    //       }}
                    //     />
                    //   </div>
                    // </Space>

                    <Space
                      direction="vertical"
                      size="middle"
                      align="center"
                      style={{ width: '100%', padding: '16px 0' }}
                    >
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
                                  time={getCountDownTime(rollcallData?.endTime)}
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

                      <div
                        style={{
                          background:
                            'linear-gradient(135deg, #fffbeb 0%, #fff7ed 100%)',
                          padding: '6px 24px',
                          borderRadius: '12px',
                          boxShadow: '0 8px 24px rgba(217, 119, 6, 0.1)',
                          textAlign: 'center',
                          marginTop: '8px',
                          border: '1px solid rgba(217, 119, 6, 0.15)',
                        }}
                      >
                        <Typography.Text
                          style={{
                            fontSize: '4rem',
                            fontWeight: 800,
                            letterSpacing: '6px',
                            fontFamily:
                              'SFMono-Regular, Consolas, "Liberation Mono", Menlo, monospace',
                            color: '#d97706',
                            textShadow: '0 2px 10px rgba(217, 119, 6, 0.2)',
                          }}
                        >
                          {rollcallData?.code || '------'}
                        </Typography.Text>
                      </div>

                      <div
                        style={{
                          padding: '16px',
                          background: '#fff',
                          borderRadius: '16px',
                          boxShadow: '0 10px 32px rgba(0,0,0,0.06)',
                          border: '1px solid #f0f0f0',
                          transition: 'all 0.3s ease',
                          marginTop: '12px',
                        }}
                      >
                        <QRCodeSVG
                          value={getAttendanceQRCode(rollcallData?.code)}
                          size={240}
                          bgColor="#ffffff"
                          fgColor="#1f1f1f"
                          level="H"
                          imageSettings={{
                            src: LOGO_ICON,
                            height: 36,
                            width: 36,
                            excavate: true,
                          }}
                        />
                      </div>
                    </Space>
                  ) : (
                    <div className="oc-rollcall-inactive-panel">
                      <div className="oc-panel-icon-wrapper">
                        <QrcodeOutlined className="oc-pulsing-icon" />
                      </div>
                      <h3>簽到通道未開啟</h3>
                      <p>請於左側控制面板設定輪換間隔與自動關閉時間，並點擊下方「開始點名」按鈕啟動簽到通道。</p>
                    </div>
                  )}
                </div>
              </Card>
            </Col>
          </Row>
          {confirmElement}
        </article>
      )}
    </>
  );
}

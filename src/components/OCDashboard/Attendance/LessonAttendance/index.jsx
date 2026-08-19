import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Space } from 'antd';
import { AuditOutlined, BookOutlined, BarcodeOutlined, ClockCircleOutlined, PieChartOutlined } from '@ant-design/icons';
import { OCLessonAttendanceTable } from '../AttendanceTable';
import { apiUtil } from '@utils/WebApi';
import { PERIOD_TIME } from '@config/time';
import { ATTENDANCE_STATUS_MAP } from '@config/attendance';
import OCLoading from '@components/OCCommon/OCLoading';
import OCTitle from '@components/OCCommon/OCTitle';
import './index.css';
import '../../Course/CourseInfo/index.css';
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
  const init = async (signal = null) => {
    try {
      setIsLoading(true);
      await Promise.allSettled([
        getLessonData(signal),
        getLessonAttendanceData(signal),
      ]);
    } catch (error) {
      console.error('Init error:', error);
    } finally {
      setIsLoading(false);
    }
  };
  const getLessonAttendanceData = async (signal) => {
    const path = `/lesson/${lessonId}/attendance`;
    const res = await apiUtil(path, 'GET', signal);
    if (res?.isSystemError) return;
    if (res?.code === 200) {
      setAttendanceData(res.data);
    } else {
      alert('資料取得失敗');
    }
  };
  const getLessonData = async (signal) => {
    const path = `/lesson/${lessonId}`;
    const res = await apiUtil(path, 'GET', signal);
    if (res?.isSystemError) return;
    if (res?.code === 200) {
      setLessonData(res.data);
    } else {
      alert('資料取得失敗');
    }
  };
  // Calculate attendance statistics
  const totalCount = attendanceData?.length || 0;
  const presentCount = attendanceData?.filter(item => item.status === 1).length || 0;
  const lateCount = attendanceData?.filter(item => item.status === 2).length || 0;
  const absentCount = attendanceData?.filter(item => item.status === 0 || item.status === null).length || 0;

  const presentPercent = totalCount > 0 ? (presentCount / totalCount) * 100 : 0;
  const latePercent = totalCount > 0 ? (lateCount / totalCount) * 100 : 0;
  const absentPercent = totalCount > 0 ? (absentCount / totalCount) * 100 : 0;

  return (
    <>
      {isLoading ? (
        <OCLoading />
      ) : (
        <div className="oc-lesson-attendance">
          <div className="oc-lesson-attendance-header" style={{ width: '100%' }}>
            <OCTitle
              title="課堂點名紀錄"
              description="檢視與管理本堂課學生的即時出席狀態與比例統計。"
            />
          </div>
          <div className="oc-lesson-attendance-content">
            <section className="oc-lesson-attendance-info-section">
              <Space direction="vertical" size="large" style={{ width: '100%' }}>
                <div className="oc-course-info" style={{ flex: 'none', width: '100%', boxSizing: 'border-box' }}>
                  <div className="oc-course-card-content">
                    <div className="oc-course-card-header">
                      <div className="oc-course-avatar-badge">
                        <BookOutlined />
                      </div>
                      <h2>{lessonData?.courseName}</h2>
                    </div>
                    <div className="oc-course-card-body">
                      <ul>
                        <li>
                          <span className="oc-info-label">
                            <BookOutlined className="oc-info-icon code-icon" />
                            課堂進度:
                          </span>
                          <span className="oc-info-val">第 {lessonData?.lessonIndex} 堂</span>
                        </li>
                        <li>
                          <span className="oc-info-label">
                            <BarcodeOutlined className="oc-info-icon teacher-icon" />
                            課堂代碼:
                          </span>
                          <span className="oc-info-val">{lessonData?.id}</span>
                        </li>
                        <li>
                          <span className="oc-info-label">
                            <ClockCircleOutlined className="oc-info-icon time-icon" />
                            上課時間:
                          </span>
                          <span className="oc-info-val" style={{ whiteSpace: 'normal', textAlign: 'right' }}>
                            {PERIOD_TIME(lessonData?.startTime, lessonData?.endTime)}
                          </span>
                        </li>
                      </ul>
                      <Button
                        color="primary"
                        variant="outlined"
                        icon={<AuditOutlined />}
                        onClick={() => {
                          navigator('../');
                        }}
                        style={{ width: 'fit-content', marginTop: '0.5rem' }}
                      >
                        返回課堂
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="oc-custom-card" style={{ width: '100%' }}>
                  <div className="oc-custom-card-header">
                    <div className="oc-custom-card-title">
                      <PieChartOutlined /> 簽到統計圓餅圖
                    </div>
                  </div>
                  <div className="oc-custom-card-body" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.25rem', paddingTop: '1.25rem' }}>
                    <div className="oc-attendance-donut" style={{
                      position: 'relative',
                      width: '130px',
                      height: '130px',
                      borderRadius: '50%',
                      background: `conic-gradient(
                        #10b981 0% ${presentPercent}%, 
                        #f59e0b ${presentPercent}% ${presentPercent + latePercent}%, 
                        #ef4444 ${presentPercent + latePercent}% 100%
                      )`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.08), 0 4px 12px rgba(0,0,0,0.04)'
                    }}>
                      <div style={{
                        width: '80px',
                        height: '80px',
                        borderRadius: '50%',
                        backgroundColor: 'var(--oc-card-bg, #ffffff)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
                      }}>
                        <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--oc-text-primary)' }}>
                          {totalCount}
                        </span>
                        <span style={{ fontSize: '0.7rem', color: 'var(--oc-text-secondary)' }}>
                          應到人數
                        </span>
                      </div>
                    </div>

                    {/* Legends with detail counts */}
                    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.85rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--oc-text-secondary)' }}>
                          <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#10b981', display: 'inline-block' }} />
                          已簽到 (已出席):
                        </span>
                        <span style={{ fontWeight: 600, color: '#10b981' }}>{presentCount} 人 ({presentPercent.toFixed(1)}%)</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--oc-text-secondary)' }}>
                          <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#f59e0b', display: 'inline-block' }} />
                          遲到:
                        </span>
                        <span style={{ fontWeight: 600, color: '#f59e0b' }}>{lateCount} 人 ({latePercent.toFixed(1)}%)</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--oc-text-secondary)' }}>
                          <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#ef4444', display: 'inline-block' }} />
                          未到 (缺席):
                        </span>
                        <span style={{ fontWeight: 600, color: '#ef4444' }}>{absentCount} 人 ({absentPercent.toFixed(1)}%)</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Space>
            </section>
            <section className="oc-lesson-attendance-table-section">
              <div className="oc-custom-card" style={{ width: '100%' }}>
                <div className="oc-custom-card-header">
                  <div className="oc-custom-card-title">
                    <AuditOutlined /> 課堂簽到名單
                  </div>
                </div>
                <div className="oc-custom-card-body">
                  <OCLessonAttendanceTable
                    className="oc-lesson-attendance-table"
                    attendanceData={attendanceData}
                    resetData={() => {
                      getLessonAttendanceData();
                    }}
                    readOnly={user?.role === 0}
                  />
                </div>
              </div>
            </section>
          </div>
        </div>
      )}
    </>
  );
}

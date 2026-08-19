import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Table, Radio, Tag, message } from 'antd';
import { EyeOutlined, CheckCircleOutlined, InfoCircleOutlined, CloseCircleOutlined, PercentageOutlined } from '@ant-design/icons';
import OCLoading from '@components/OCCommon/OCLoading';
import OCTitle from '@components/OCCommon/OCTitle';
import { apiUtil } from '@utils/WebApi';
import { PERIOD_TIME } from '@config/time.js';
import { ATTENDANCE_MAP } from '@config/attendance.js';
import './index.css';

export default function OCCourseAttendance() {
  const { courseId } = useParams();
  const [lessonStats, setLessonStats] = useState([]);
  const [studentStats, setStudentStats] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [displayMode, setDisplayMode] = useState('lesson');

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
      const lessonPath = `/course/${courseId}/attendance/stats/lesson`;
      const studentPath = `/course/${courseId}/attendance/stats/student`;

      const [lessonRes, studentRes] = await Promise.all([
        apiUtil(lessonPath, 'GET', signal),
        apiUtil(studentPath, 'GET', signal),
      ]);

      if (lessonRes?.isSystemError || studentRes?.isSystemError) return;
      if (lessonRes?.code === 200) {
        setLessonStats(lessonRes.data || []);
      }

      if (studentRes?.code === 200) {
        setStudentStats(studentRes.data || []);
      }

    } catch (error) {
      console.error('Failed to fetch attendance stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Filter out lessons where rollcallStatus === 0 (unstarted)
  const activeLessons = lessonStats?.filter((item) => item.rollcallStatus !== 0) || [];
  const unstartedCount = lessonStats?.filter((item) => item.rollcallStatus === 0).length || 0;

  // Calculate overall metrics from active lessons only
  const totalPresents = activeLessons.reduce((sum, item) => sum + (item.presentCount || 0), 0);
  const totalExcused = activeLessons.reduce((sum, item) => sum + (item.excusedCount || 0), 0);
  const totalAbsents = activeLessons.reduce((sum, item) => sum + (item.absentCount || 0), 0);
  const totalExpected = totalPresents + totalExcused + totalAbsents;
  const overallRate = totalExpected > 0 ? (totalPresents / totalExpected) * 100 : 0;

  // Adjust student statistics to subtract unstarted lessons
  const adjustedStudentStats = studentStats.map((student) => {
    const adjustedAbsent = Math.max(0, (student.absentCount || 0) - unstartedCount);
    const adjustedTotal = Math.max(0, (student.totalCount || 0) - unstartedCount);
    return {
      ...student,
      absentCount: adjustedAbsent,
      totalCount: adjustedTotal,
    };
  });

  return (
    <>
      {isLoading ? (
        <OCLoading />
      ) : (
        <div className="oc-course-attendance">
          <OCTitle
            title="點名紀錄統計"
            description="查看本課程各個課堂的點名狀態，或檢視個別學生的出席率匯總"
          />

          {/* Statistics Grid */}
          <section className="oc-attendance-stats-cards">
            {/* Card 1: Overall Attendance Rate */}
            <div className="oc-stat-card">
              <div className="oc-stat-card-header">
                <span className="oc-stat-card-title">總出席率</span>
                <PercentageOutlined className="oc-stat-card-icon" style={{ color: '#10b981' }} />
              </div>
              <div className="oc-stat-card-value" style={{ color: '#10b981' }}>
                {overallRate.toFixed(1)}%
              </div>
              <div style={{ width: '100%', height: '6px', backgroundColor: 'var(--oc-input-border, #e5e7eb)', borderRadius: '3px', marginTop: '8px', overflow: 'hidden' }}>
                <div style={{ width: `${overallRate}%`, height: '100%', backgroundColor: '#10b981', borderRadius: '3px', transition: 'width 0.3s ease' }} />
              </div>
              <span className="oc-stat-card-desc">應到 {totalExpected} 人次，實到 {totalPresents} 人次</span>
            </div>

            {/* Card 2: Total Present */}
            <div className="oc-stat-card">
              <div className="oc-stat-card-header">
                <span className="oc-stat-card-title">累計出席</span>
                <CheckCircleOutlined className="oc-stat-card-icon" style={{ color: '#16a34a' }} />
              </div>
              <div className="oc-stat-card-value" style={{ color: '#16a34a' }}>
                {totalPresents} <span style={{ fontSize: '1rem', fontWeight: 500, color: 'var(--oc-text-secondary)' }}>人次</span>
              </div>
              <span className="oc-stat-card-desc">學生已簽到出席之總人次</span>
            </div>

            {/* Card 3: Total Excused */}
            <div className="oc-stat-card">
              <div className="oc-stat-card-header">
                <span className="oc-stat-card-title">累計請假</span>
                <InfoCircleOutlined className="oc-stat-card-icon" style={{ color: '#d97706' }} />
              </div>
              <div className="oc-stat-card-value" style={{ color: '#d97706' }}>
                {totalExcused} <span style={{ fontSize: '1rem', fontWeight: 500, color: 'var(--oc-text-secondary)' }}>人次</span>
              </div>
              <span className="oc-stat-card-desc">經核准之假單請假人次</span>
            </div>

            {/* Card 4: Total Absent */}
            <div className="oc-stat-card">
              <div className="oc-stat-card-header">
                <span className="oc-stat-card-title">累計缺席</span>
                <CloseCircleOutlined className="oc-stat-card-icon" style={{ color: '#dc2626' }} />
              </div>
              <div className="oc-stat-card-value" style={{ color: '#dc2626' }}>
                {totalAbsents} <span style={{ fontSize: '1rem', fontWeight: 500, color: 'var(--oc-text-secondary)' }}>人次</span>
              </div>
              <span className="oc-stat-card-desc">未完成簽到且無假單人次</span>
            </div>
          </section>

          <section className="oc-attendance-toolbar">
            <Radio.Group
              value={displayMode}
              onChange={(e) => setDisplayMode(e.target.value)}
              optionType="button"
              buttonStyle="solid"
              className="oc-attendance-toggle"
            >
              <Radio.Button value="lesson">依課堂查看</Radio.Button>
              <Radio.Button value="student">依學生查看</Radio.Button>
            </Radio.Group>
          </section>

          <section className="oc-attendance-table-container">
            {displayMode === 'lesson' ? (
              <LessonAttendanceStatsTable attendanceData={activeLessons} />
            ) : (
              <StudentAttendanceStatsTable attendanceData={adjustedStudentStats} />
            )}
          </section>
        </div>
      )}
    </>
  );
}

export function LessonAttendanceStatsTable(props) {
  const { attendanceData } = props;
  const navigator = useNavigate();

  const columns = [
    {
      title: '上課時間',
      key: 'time',
      render: (record) => {
        return <span style={{ fontWeight: 500, color: '#374151' }}>{PERIOD_TIME(record.startTime, record.endTime)}</span>;
      },
    },
    {
      title: '點名狀態',
      dataIndex: 'rollcallStatus',
      key: 'rollcallStatus',
      render: (value) => {
        return (
          <Tag color={ATTENDANCE_MAP[value]?.color || 'default'}>
            {ATTENDANCE_MAP[value]?.title || '未知'}
          </Tag>
        );
      },
    },
    {
      title: '出席數',
      dataIndex: 'presentCount',
      key: 'presentCount',
      align: 'center',
      render: (value) => (
        <span style={{ fontWeight: 600, color: '#16a34a', fontSize: '1.05rem' }}>{value}</span>
      ),
    },
    {
      title: '請假數',
      dataIndex: 'excusedCount',
      key: 'excusedCount',
      align: 'center',
      render: (value) => (
        <span style={{ fontWeight: 600, color: '#d97706', fontSize: '1.05rem' }}>{value}</span>
      ),
    },
    {
      title: '缺席數',
      dataIndex: 'absentCount',
      key: 'absentCount',
      align: 'center',
      render: (value) => (
        <span style={{ fontWeight: 600, color: '#dc2626', fontSize: '1.05rem' }}>{value}</span>
      ),
    },
    {
      title: '操作',
      dataIndex: 'lessonId',
      key: 'action',
      align: 'center',
      render: (id) => {
        return (
          <Button
            className="oc-btn-amber-outline"
            icon={<EyeOutlined />}
            onClick={() => {
              navigator(`../lesson/${id}/attendance`);
            }}
          >
            查看點名
          </Button>
        );
      },
    },
  ];

  return (
    <Table
      className="attendance-stats-table"
      dataSource={attendanceData}
      pagination={{
        pageSize: 10,
        position: ['bottomCenter'],
        pageSizeOptions: ['10', '20', '50'],
        size: 'large',
        showTotal: (total) => `共 ${total} 筆資料`,
      }}
      columns={columns}
      rowKey={(record) => record.key || record.lessonId}
    />
  );
}

export function StudentAttendanceStatsTable(props) {
  const { attendanceData } = props;
  const navigator = useNavigate();

  const columns = [
    {
      title: '學號',
      dataIndex: 'studentNo',
      key: 'studentNo',
      render: (text) => <span style={{ color: '#4b5563' }}>{text}</span>,
    },
    {
      title: '學生姓名',
      dataIndex: 'studentName',
      key: 'studentName',
      render: (text) => <span style={{ fontWeight: 500, color: '#1f2937' }}>{text}</span>,
    },
    {
      title: '出席數',
      dataIndex: 'presentCount',
      key: 'presentCount',
      align: 'center',
      render: (value) => (
        <span style={{ fontWeight: 600, color: '#16a34a', fontSize: '1.05rem' }}>{value}</span>
      ),
    },
    {
      title: '請假數',
      dataIndex: 'excusedCount',
      key: 'excusedCount',
      align: 'center',
      render: (value) => (
        <span style={{ fontWeight: 600, color: '#d97706', fontSize: '1.05rem' }}>{value}</span>
      ),
    },
    {
      title: '缺席數',
      dataIndex: 'absentCount',
      key: 'absentCount',
      align: 'center',
      render: (value) => (
        <span style={{ fontWeight: 600, color: '#dc2626', fontSize: '1.05rem' }}>{value}</span>
      ),
    },
    {
      title: '總課堂數',
      dataIndex: 'totalCount',
      key: 'totalCount',
      align: 'center',
      render: (value) => (
        <span style={{ fontWeight: 600, color: '#4b5563', fontSize: '1.05rem' }}>{value}</span>
      ),
    },
    {
      title: '操作',
      dataIndex: 'studentId',
      key: 'action',
      align: 'center',
      render: (id) => {
        return (
          <Button
            className="oc-btn-amber-outline"
            icon={<EyeOutlined />}
            onClick={() => {
              navigator(`/dashboard/user/${id}`);
            }}
          >
            學生資料
          </Button>
        );
      },
    },
  ];

  return (
    <Table
      className="attendance-stats-table"
      dataSource={attendanceData}
      pagination={{
        pageSize: 10,
        position: ['bottomCenter'],
        pageSizeOptions: ['10', '20', '50'],
        size: 'large',
        showTotal: (total) => `共 ${total} 筆資料`,
      }}
      columns={columns}
      rowKey={(record) => record.key || record.studentId}
    />
  );
}

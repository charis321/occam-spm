import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Table, Radio, Tag, message } from 'antd';
import { EyeOutlined } from '@ant-design/icons';
import OCLoading from '@components/OCCommon/OCLoading';
import OCTitle from '@components/OCCommon/OCTitle';
import { apiUtil } from '@utils/WebApi';
import { PERIOD_TIME } from '@config/time.js';
import { ATTENDANCE_MAP } from '@config/attendance.js';
import './index.css';

export default function OCCourseAttendance() {
  const { courseId } = useParams();
  const [attendanceData, setAttendanceData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [displayMode, setDisplayMode] = useState('lesson');

  useEffect(() => {
    const controller = new AbortController();
    getAttendanceData(controller.signal);
    return () => {
      controller.abort();
    };
  }, [displayMode]);

  const getAttendanceData = async (signal) => {
    setIsLoading(true);
    const path = `/course/${courseId}/attendance/stats/${displayMode}`;
    const res = await apiUtil(path, 'GET', signal);
    if (res?.code === 200) {
      setAttendanceData(res.data);
    } else {
      message.error('無法取得課程點名資料');
    }
    setIsLoading(false);
  };

  return (
    <>
      {isLoading ? (
        <OCLoading />
      ) : (
        <div className="oc-course-attendance">
          <OCTitle
            title="點名統計紀錄"
            description="查看本課程各個課堂的點名狀態，或檢視個別學生的出席率匯總"
          />
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
              <LessonAttendanceStatsTable attendanceData={attendanceData} />
            ) : (
              <StudentAttendanceStatsTable attendanceData={attendanceData} />
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

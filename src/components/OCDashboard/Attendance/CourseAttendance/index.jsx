import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { OCCourseAttendanceTable } from '../AttendanceTable';
import { apiUtil } from '@utils/WebApi';
import { PERIOD_TIME } from '@config/time.js';
import { ATTENDANCE_MAP } from '@config/attendance.js';
import { Button, Flex, Table } from 'antd';

import './index.css';
export default function OCCourseAttendance(props) {
  const { courseId } = useParams();
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [displayMode, setDisplayMode] = useState('lesson');

  useEffect(() => {
    getAttendanceData();
  }, [displayMode]);
  const getAttendanceData = async () => {
    setLoading(true);
    const path = `/course/${courseId}/attendance/stats/${displayMode}`;
    const res = await apiUtil(path, 'GET');
    if (res.code === 200) {
      setAttendanceData(res.data);
    } else {
      alert('無法取得課程點名資料');
    }
    setLoading(false);
  };

  return (
    <div className="oc-course-attendance">
      <h2>出席表</h2>
      <section>
        <div className="flex-row">
          <Button
            onClick={() => {
              setDisplayMode('lesson');
            }}
          >
            依課堂查看
          </Button>
          <Button
            onClick={() => {
              setDisplayMode('student');
            }}
          >
            依學生查看
          </Button>
        </div>
      </section>
      {/* <OCCourseAttendanceTable attendanceData={attendanceData} /> */}
      <section>
        {displayMode === 'lesson' ? (
          <LessonAttendanceStatsTable attendanceData={attendanceData} />
        ) : (
          <StudentAttendanceStatsTable attendanceData={attendanceData} />
        )}
      </section>
    </div>
  );
}
export function LessonAttendanceStatsList(props) {
  const { attendanceData } = props;
  const navigator = useNavigate();

  return (
    <ul className="attendance-stats-list">
      {attendanceData.map((data) => {
        return (
          <li>
            <div>
              <p>上課時間: {PERIOD_TIME(data.startTime, data.endTime)}</p>
            </div>
            <div>
              <Button
                onClick={() => {
                  navigator(`../lesson/${data.lessonId}`);
                }}
              >
                查看
              </Button>
            </div>
            <div>
              <Flex gap="medium" horizontal>
                <span style={{ fontSize: '1.5rem', color: 'green' }}>
                  {data.presentCount}
                </span>
                <p>出席</p>
                <span style={{ fontSize: '1.5rem', color: 'orange' }}>
                  {data.excusedCount}
                </span>
                <p>請假</p>
                <span style={{ fontSize: '1.5rem', color: 'red' }}>
                  {data.absentCount}
                </span>
                <p>缺席</p>
              </Flex>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
export function LessonAttendanceStatsTable(props) {
  const { attendanceData } = props;
  const navigator = useNavigate();

  const coloumns = [
    {
      title: '操作',
      dataIndex: 'lessonId',
      responsive: ['xs'],
      render: (id) => {
        return (
          <Button
            onClick={() => {
              navigator(`../lesson/${id}/attendance`);
            }}
          ></Button>
        );
      },
    },
    {
      title: '操作',
      dataIndex: 'lessonId',
      responsive: ['md'],
      render: (id) => {
        return (
          <Button
            onClick={() => {
              navigator(`../lesson/${id}/attendance`);
            }}
          >
            查看
          </Button>
        );
      },
    },
    {
      title: '資訊',
      render: (record) => {
        return <p>{PERIOD_TIME(record.startTime, record.endTime)}</p>;
      },
    },
    {
      title: '已點名?',
      dataIndex: 'lessonAttendanceStatus',
      render: (value) => {
        return <p>{ATTENDANCE_MAP[value]?.title}</p>;
      },
    },
    {
      title: '出席數',
      dataIndex: 'presentCount',
      render: (value) => {
        return (
          <>
            <span style={{ fontSize: '1.5rem', color: '#73e677' }}>
              {value}
            </span>
            <br></br>
            <p>出席</p>
          </>
        );
      },
    },
    {
      title: '請假數',
      dataIndex: 'excusedCount',
      render: (value) => {
        return (
          <>
            <span style={{ fontSize: '1.5rem', color: 'orange' }}>{value}</span>
            <br></br>
            <p>請假</p>
          </>
        );
      },
    },
    {
      title: '缺席數',
      dataIndex: 'absentCount',
      render: (value) => {
        return (
          <>
            <span style={{ fontSize: '1.5rem', color: 'red' }}>{value}</span>
            <br></br>
            <p>缺席</p>
          </>
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
      columns={coloumns}
      rowKey={(record) => record.key}
      rowClassName={(record, index) => {
        return ATTENDANCE_MAP?.[record.lessonAttendanceStatus]?.class;
      }}
      // showHeader={false}
    ></Table>
  );
}

export function StudentAttendanceStatsList(props) {
  const { attendanceData } = props;

  return (
    <ul className="attendance-stats-list">
      {attendanceData.map((data) => {
        return (
          <li>
            <div>
              <p>{data.studentNo}</p>
              <p>{data.studentName}</p>
            </div>
            <div>
              <Flex gap="medium" horizontal>
                <span>{data.presentCount}</span>
                <p>出席</p>
                <span>{data.excusedCount}</span>
                <p>請假</p>

                <span>{data.absentCount}</span>
                <p>缺席</p>
              </Flex>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
export function StudentAttendanceStatsTable(props) {
  const { attendanceData } = props;
  const navigator = useNavigate();

  const coloumns = [
    {
      title: '操作',
      dataIndex: 'studentId',
      responsive: ['xs'],
      render: (id) => {
        return (
          <Button
            onClick={() => {
              navigator(`/dashboard/user/${id}`);
            }}
          ></Button>
        );
      },
    },
    {
      title: '操作',
      dataIndex: 'studentId',
      responsive: ['md'],
      render: (id) => {
        return (
          <Button
            onClick={() => {
              navigator(`/dashboard/user/${id}`);
            }}
          >
            查看
          </Button>
        );
      },
    },
    {
      title: '學生',
      render: (record) => {
        return (
          <>
            <h3>{record.studentName}</h3>
            <p>{record.studentNo}</p>
          </>
        );
      },
    },
    {
      title: '出席數',
      dataIndex: 'presentCount',
      render: (value) => {
        return (
          <>
            <span style={{ fontSize: '1.5rem', color: '#73e677' }}>
              {value}
            </span>
            <br></br>
            <p>出席</p>
          </>
        );
      },
    },
    {
      title: '請假數',
      dataIndex: 'excusedCount',
      render: (value) => {
        return (
          <>
            <span style={{ fontSize: '1.5rem', color: 'orange' }}>{value}</span>
            <br></br>
            <p>請假</p>
          </>
        );
      },
    },
    {
      title: '缺席數',
      dataIndex: 'absentCount',
      render: (value) => {
        return (
          <>
            <span style={{ fontSize: '1.5rem', color: 'red' }}>{value}</span>
            <br></br>
            <p>缺席</p>
          </>
        );
      },
    },
    {
      title: '總數',
      dataIndex: 'totalCount',
      render: (value) => {
        return (
          <>
            <span style={{ fontSize: '1.5rem' }}>{value}</span>
            <br></br>
            <p>總數</p>
          </>
        );
      },
    },
  ];

  return (
    <Table
      className="attendance-stats-table"
      dataSource={attendanceData}
      columns={coloumns}
      rowKey={(record) => record.key}
      showHeader={false}
      size="small"
    ></Table>
  );
}

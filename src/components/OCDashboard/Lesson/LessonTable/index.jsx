import { useNavigate } from 'react-router-dom';
import { Table, Tag, Button, message } from 'antd';
import { EyeOutlined, DeleteOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

import { useAuth } from '@utils/AuthContext';
import { apiUtil } from '@utils/WebApi';
import { useConfirm } from '../../../../Util/hooks/useConfirm';
import { ATTENDANCE_MAP } from '@config/attendance';

export default function OCLessonTable(props) {
  const { user } = useAuth();
  const { lessonData, pageSize = 5, resetLesson, readOnly = true } = props;
  const [showConfirm, confirmElement] = useConfirm();
  const navigator = useNavigate();

  const columns_lesson = [
    {
      key: 'index',
      title: '序',
      dataIndex: 'lessonIndex',
      responsive: ['sm'],
      render: (text) => (
        <span style={{ color: 'var(--oc-text-secondary)', fontWeight: 500 }}>
          {text}
        </span>
      ),
    },
    {
      key: 'time',
      title: '上課時間',
      render: (record) => {
        return (
          <div>
            <span style={{ fontWeight: 600, color: 'var(--oc-text-primary)' }}>
              {dayjs(record.startTime).format('YYYY-MM-DD')}
            </span>
            <div style={{ fontSize: '12px', color: 'var(--oc-text-secondary)', marginTop: '2px' }}>
              {dayjs(record.startTime).format('HH:mm')} ~ {dayjs(record.endTime).format('HH:mm')}
            </div>
          </div>
        );
      },
    },
    {
      key: 'attendanceStatus',
      title: '點名狀態',
      dataIndex: 'rollcallStatus',
      align: 'center',
      render: (item) => {
        return (
          <Tag color={ATTENDANCE_MAP[item]?.color || 'default'} style={{ fontWeight: 500 }}>
            {ATTENDANCE_MAP[item]?.title || '未知'}
          </Tag>
        );
      },
    },
    {
      key: 'action',
      title: '操作',
      dataIndex: 'lessonIndex',
      align: 'center',
      render: (key) => {
        return (
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
            <Button
              className="oc-btn-amber-outline"
              icon={<EyeOutlined />}
              onClick={handleCheckLesson(key)}
            >
              <span className="oc-desktop-only">查看課堂</span>
            </Button>

            {!readOnly && (
              <Button
                type="primary"
                danger
                icon={<DeleteOutlined />}
                onClick={handleDeleteLesson(key)}
                style={{ borderRadius: '8px' }}
              >
                <span className="oc-desktop-only">刪除</span>
              </Button>
            )}
          </div>
        );
      },
    },
  ];

  const deleteLessonData = async (lesson) => {
    const path = `/lesson/${lesson.id}`;
    const res = await apiUtil(path, 'DELETE');
    if (res?.isSystemError) return;
    if (res?.code === 200) {
      message.success('刪除成功');
      resetLesson();
    } else {
      message.error('刪除失敗');
    }
  };

  const handleDeleteLesson = (key) => {
    const lesson = lessonData[key - 1];
    return (e) => {
      e.preventDefault();
      const content = (
        <>
          <span style={{ color: 'red', fontWeight: 600 }}>
            警告! 刪除課堂後，所有相關紀錄將一併清空。
          </span>
          <br />
          請問要繼續嗎?
        </>
      );

      showConfirm(
        content,
        () => {
          deleteLessonData(lesson);
        },
        () => { },
      );
    };
  };

  const handleCheckLesson = (key) => {
    const lesson = lessonData[key - 1];
    return (e) => {
      e.preventDefault();
      navigator(`/dashboard/course/${lesson.courseId}/lesson/${lesson.id}`);
    };
  };

  return (
    <>
      <Table
        dataSource={lessonData}
        columns={columns_lesson}
        size="large"
        pagination={{
          pageSize,
          position: ['bottomCenter'],
          size: 'large',
          showTotal: (total) => `共 ${total} 筆課堂`,
        }}
        rowKey={(record) => record.key || record.id}
      />
      {confirmElement}
    </>
  );
}

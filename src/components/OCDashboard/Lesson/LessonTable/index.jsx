import { useNavigate } from 'react-router-dom';
import { Table, Tag, Button } from 'antd';
import dayjs from 'dayjs';

import { useAuth } from '@utils/AuthContext';
import { apiUtil } from '@utils/WebApi';
// import { useConfirm } from '@utils/hooks/useConfirm';
import { useConfirm } from '../../../../Util/hooks/useConfirm';

import { ATTENDANCE_MAP } from '@config/attendance';
import { USER_ROLE_INDEX } from '@config/config';

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
    },
    {
      key: 'date',
      title: '日期',
      dataIndex: 'startTime',
      render: (startTime) => {
        return dayjs(startTime).format('YYYY-MM-DD');
      },
    },
    {
      key: 'time',
      title: '課堂時間',
      render: (record) => {
        return (
          <p>
            {dayjs(record.startTime).format('HH:mm')}~
            {dayjs(record.endTime).format('HH:mm')}
          </p>
        );
      },
    },
    {
      key: 'attendanceStatus',
      title: '已點名?',
      dataIndex: 'attendanceStatus',
      render: (item) => {
        return (
          <Tag color={ATTENDANCE_MAP[item].color}>
            {ATTENDANCE_MAP[item].title}
          </Tag>
        );
      },
    },
    {
      key: 'action',
      title: '操作',
      dataIndex: 'lessonIndex',
      render: (key) => {
        return (
          <>
            <Button type="primary" onClick={handleCheckLesson(key)}>
              查看課堂
            </Button>

            {!readOnly && (
              <Button
                type="primary"
                variant="solid"
                danger
                onClick={handleDeleteLesson(key)}
              >
                刪除
              </Button>
            )}
          </>
        );
      },
    },
  ];
  const deleteLessonData = async (lesson) => {
    const path = `/lesson/${lesson.id}`;
    const res = await apiUtil(path, 'DELETE');
    if (res.code === 200) {
      alert('刪除成功');
      resetLesson();
    } else {
      alert('刪除失敗');
    }
    console.log(res);
  };
  const handleDeleteLesson = (key) => {
    const lesson = lessonData[key - 1];
    return (e) => {
      e.preventDefault();
      console.log('click');
      const content = (
        <>
          <span style={{ color: 'red' }}>
            警告! 刪除課堂後，所有相關紀錄將一併清空。
          </span>
          請問要繼續嗎?
        </>
      );

      showConfirm(
        content,
        () => {
          deleteLessonData(lesson);
        },
        () => {},
      );
    };
  };
  const handleCheckLesson = (key) => {
    const lesson = lessonData[key - 1];
    return (e) => {
      e.preventDefault();
      console.log(lesson, 'check lesson');
      navigator(`/dashboard/course/${lesson.courseId}/lesson/${lesson.id}`);
    };
  };
  return (
    <>
      <Table
        dataSource={lessonData}
        columns={columns_lesson}
        // scroll={{ x: "80%"}}
        size="small"
        pagination={{ pageSize }}
        rowKey={(record) => record.key}
      ></Table>
      {confirmElement}
    </>
  );
}

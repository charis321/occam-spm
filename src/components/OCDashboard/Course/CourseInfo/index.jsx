import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  FileSearchOutlined,
  MessageOutlined,
  BookOutlined,
  BarcodeOutlined,
  UserOutlined,
  BankOutlined,
  AppstoreOutlined,
  CalendarOutlined,
  EnvironmentOutlined,
  TeamOutlined,
  OrderedListOutlined,
} from '@ant-design/icons';
import { useAuth } from '../../../../Util/AuthContext';
import { apiUtil, handleErrer } from '../../../../Util/WebApi';
import { Button, Form, Input, Select, Space, Row, Col, message, Modal } from 'antd';
import { WEEKTIME } from '../../../../config/time';

import './index.css';

import OCOverlay from '../../../OCCommon/OCOverlay';

export default function OCCourseInfo(props) {
  const { courseData, readOnly, resetData } = props;
  const { user } = useAuth();
  const [updateCourseForm, setUpdateCourseForm] = useState();
  const [isEditing, setIsEditing] = useState(false);
  const navigator = useNavigate();

  const deleteCourse = async () => {
    const path = `/course/${courseData.id}`;
    const res = await apiUtil(path, 'DELETE');
    if (res.code === 200) {
      message.success('刪除成功，即將重回課程管理頁面');
      navigator('/dashboard/course');
    } else {
      message.error('刪除失敗');
      console.log(res);
    }
  };

  const handleStudentManager = () =>
    navigate(`/dashboard/course/${courseData.id}/student`);

  const handleDeleteCourse = () => {
    Modal.confirm({
      title: '確定要刪除這門課程嗎？',
      content: '警告！如果刪除課程，此課程的全部資料（包含學生選課、學生出席紀錄）將會一併銷毀，此操作無法復原！',
      okText: '確定刪除',
      okType: 'danger',
      cancelText: '取消',
      onOk() {
        deleteCourse();
      },
    });
  };
  const handleReset = () => {
    setIsEditing(false);
    resetData();
  };
  return (
    <div className="oc-course-info">
      {!!courseData && <OCCourseCardView courseData={courseData} />}
      {!readOnly && (
        <>
          <div className="oc-course-action">
            <Button onClick={handleStudentManager}>管理學生</Button>
            <Button
              onClick={() => {
                setIsEditing(!isEditing);
              }}
            >
              編輯基本資料
            </Button>
            <Button
              onClick={() => {
                navigate('./attendance');
              }}
            >
              點名紀錄
            </Button>
            <Button
              onClick={() => {
                navigate('./lesson');
              }}
            >
              課堂管理
            </Button>
            <Button type="primary" danger onClick={handleDeleteCourse}>
              刪除課程
            </Button>
          </div>
          {isEditing && (
            <OCOverlay
              className="oc-course-edit-block"
              toggle={() => {
                setIsEditing(!isEditing);
              }}
            >
              <OCCourseEditForm courseData={courseData} reset={handleReset} />
            </OCOverlay>
          )}
        </>
      )}
    </div>
  );
}

export function OCCourseCardView(props) {
  const { courseData } = props;
  const navigator = useNavigate();

  return (
    <div className="oc-course-card-content">
      <div className="oc-course-card-header">
        <div className="oc-course-avatar-badge">
          <BookOutlined />
        </div>
        <h2>{courseData.name}</h2>
      </div>
      <div className="oc-course-card-body">
        <ul>
          <li>
            <span className="oc-info-label">
              <BarcodeOutlined className="oc-info-icon code-icon" />
              課程代碼:
            </span>
            <span className="oc-info-val">{courseData.id}</span>
          </li>
          <li>
            <span className="oc-info-label">
              <UserOutlined className="oc-info-icon teacher-icon" />
              負責教師:
            </span>
            <span className="teacher-info-wrapper oc-info-val">
              <span className="teacher-name">{courseData.teacherName}</span>
              <span className="teacher-actions">
                <Button
                  icon={<FileSearchOutlined />}
                  shape="circle"
                  className="oc-teacher-btn oc-teacher-btn-view"
                  onClick={() => navigator(`/dashboard/user/${courseData.teacherId}`)}
                />
                <Button
                  icon={<MessageOutlined />}
                  shape="circle"
                  className="oc-teacher-btn oc-teacher-btn-msg"
                  onClick={() =>
                    navigator(`/dashboard/message/new?to=${courseData.teacherId}`)
                  }
                />
              </span>
            </span>
          </li>
          <li>
            <span className="oc-info-label">
              <BankOutlined className="oc-info-icon school-icon" />
              開課學校:
            </span>
            <span className="oc-info-val">{courseData.school}</span>
          </li>
          <li>
            <span className="oc-info-label">
              <AppstoreOutlined className="oc-info-icon dept-icon" />
              開課系所:
            </span>
            <span className="oc-info-val">{courseData.department}</span>
          </li>
          <li>
            <span className="oc-info-label">
              <CalendarOutlined className="oc-info-icon time-icon" />
              課程時間:
            </span>
            <span className="oc-info-val">
              {WEEKTIME(
                courseData.scheduleWeek,
                courseData.scheduleStartTime,
                courseData.scheduleEndTime,
              )}
            </span>
          </li>
          <li>
            <span className="oc-info-label">
              <EnvironmentOutlined className="oc-info-icon room-icon" />
              上課教室:
            </span>
            <span className="oc-info-val">{courseData.classroom || '未分配'}</span>
          </li>
        </ul>

        {/* 底部懸浮指標卡片列 */}
        <div className="oc-course-stats-row">
          <div className="oc-mini-stat-card credit">
            <div className="oc-stat-badge"><BookOutlined /></div>
            <div className="oc-stat-info">
              <span className="oc-stat-num">{courseData.credits || 3}</span>
              <span className="oc-stat-label">學分數</span>
            </div>
          </div>
          <div className="oc-mini-stat-card student">
            <div className="oc-stat-badge"><TeamOutlined /></div>
            <div className="oc-stat-info">
              <span className="oc-stat-num">{courseData.studentCount}</span>
              <span className="oc-stat-label">學生數</span>
            </div>
          </div>
          <div className="oc-mini-stat-card lesson">
            <div className="oc-stat-badge"><OrderedListOutlined /></div>
            <div className="oc-stat-info">
              <span className="oc-stat-num">{courseData.lessonCount}</span>
              <span className="oc-stat-label">課堂數</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export function OCCourseEditForm(props) {
  const { courseData, reset } = props;
  const [courseEditForm] = Form.useForm();
  const [isWaiting, setIsWaiting] = useState();

  const updateCourse = async (params) => {
    setIsWaiting(true);
    const path = `/course/${courseData.id}`;
    const res = await apiUtil(path, 'PATCH', params);
    if (res.code === 200) {
      message.success('編輯成功');
      reset && reset();
    } else {
      message.error('編輯失敗');
    }
    setIsWaiting(false);
  };
  const handleEditCourse = (params) => {
    console.log(params, courseData);
    updateCourse(params);
  };
  const handleReset = () => {
    courseEditForm.resetFields();
  };

  return (
    <Form
      className="oc-course-edit-form"
      form={courseEditForm}
      initialValues={courseData}
      onFinish={handleEditCourse}
    >
      <h2>編輯課程</h2>
      <Row gutter={8}>
        <Col span={24}>
          <Form.Item name="name" label="課程名稱" rules={[{ required: true }]}>
            <Input placeholder="請輸入課程名稱" size="large" />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={8}>
        <Col span={8}>
          <Form.Item name="scheduleWeek" label="上課時間">
            <Select
              options={[
                { value: 0, label: '星期日' },
                { value: 1, label: '星期一' },
                { value: 2, label: '星期二' },
                { value: 3, label: '星期三' },
                { value: 4, label: '星期四' },
                { value: 5, label: '星期五' },
                { value: 6, label: '星期六' },
              ]}
            />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item name="scheduleStartTime" label="開始">
            <Input type="time" />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item name="scheduleEndTime" label="結束">
            <Input type="time" />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item name="school" label="開課學校">
            <Input type="text" />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item name="department" label="開課學系/單位">
            <Input type="text" />
          </Form.Item>
        </Col>
      </Row>
      <Form.Item name="classroom" label="上課教室">
        <Input type="text" />
      </Form.Item>
      <Form.Item name="info" label="課程簡介">
        <Input.TextArea placeholder="請輸出課程簡介" />
      </Form.Item>
      <Button
        type="primary"
        htmlType="submit"
        disabled={isWaiting}
        loading={isWaiting}
      >
        更新
      </Button>
      <Button htmlType="button" disabled={isWaiting} onClick={handleReset}>
        重設
      </Button>
    </Form>
  );
}

import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FileSearchOutlined } from '@ant-design/icons';
import { useAuth } from '../../../../Util/AuthContext';
import { apiUtil, handleErrer } from '../../../../Util/WebApi';
import { Button, Form, Input, Select, Space, Row, Col } from 'antd';
import { WEEKTIME } from '../../../../config/time';

import './index.css';

import OCOverlay from '../../../OCCommon/OCOverlay';

export default function OCCourseCard(props) {
  const { courseData, readOnly, resetData } = props;
  const { user } = useAuth();
  const [updateCourseForm, setUpdateCourseForm] = useState();
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();

  const deleteCourse = async () => {
    const path = `/course/${courseData.id}`;
    const res = await apiUtil(path, 'DELETE');
    if (res.code === 200) {
      alert('刪除成功，即將重回課程管理頁面');
      navigate('/dashboard/course');
    } else {
      alert('刪除失敗');
      console.log(res);
    }
  };

  const handleStudentManager = () =>
    navigate(`/dashboard/course/${courseData.id}/student`);

  const handleDeleteCourse = async () => {
    var result = confirm(
      '警告!!即將刪除這門課程!\n提示您: 如果刪除課程，此課程的全部資料，包含學生選課，學生出席紀錄也會一併銷毀，是否確定?',
    );
    if (result) deleteCourse();
  };
  const handleReset = () => {
    setIsEditing(false);
    resetData();
  };
  return (
    <div className="oc-course-card">
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
  return (
    <div className="oc-course-card-content">
      <h2>課程名: {courseData.name}</h2>
      <ul>
        <li>課程編號:&emsp;{courseData.id}</li>
        <li>
          負責教師:&emsp;{courseData.teacherName}{' '}
          <Link to={`/dashboard/user/${courseData.teacherId}`}>
            <FileSearchOutlined />
          </Link>
        </li>
        <li>開課學校:&emsp;{courseData.school}</li>
        <li>開課系所:&emsp;{courseData.department}</li>
        <li>
          課程時間:&emsp;
          {WEEKTIME(
            courseData.scheduleWeek,
            courseData.scheduleStartTime,
            courseData.scheduleEndTime,
          )}
        </li>
        <li>授課教室:&emsp;{courseData.classroom}</li>
        <li>應到人數:&emsp;{courseData.studentCount}人</li>
        <li>課程簡介:&emsp;{courseData.info}</li>
      </ul>
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
      alert('編輯成功');
      reset && reset();
    } else {
      alert('編輯失敗');
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

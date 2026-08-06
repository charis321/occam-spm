import { Button, Form, Row, Col, Select, Input, message } from 'antd';
import {
  PicLeftOutlined,
  UserSwitchOutlined,
  OrderedListOutlined,
  EditOutlined,
  CheckCircleOutlined,
  FileExcelOutlined,
  TeamOutlined,
} from '@ant-design/icons';
import './index.css';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

import { apiUtil } from '@utils/WebApi';
import { useAuth } from '@utils/AuthContext';
import OCOverlay from '../../../OCCommon/OCOverlay';
import { useEffect } from 'react';
import { useConfirm } from '../../../../Util/hooks/useConfirm';

export default function OCCourseMenu(props) {
  const { courseData, resetCourse } = props;
  const { user } = useAuth();
  const [menu, setMenu] = useState([]);
  const [isEditing, setIsEditing] = useState();
  const [showConfirm, confirmElement] = useConfirm();
  const navigator = useNavigate();

  useEffect(() => {
    setMenu(user?.role === 0 ? menuStudent : menuTeacher);
  }, []);
  const menuStudent = [
    {
      title: '關於課程',
      icon: <PicLeftOutlined />,
      onClick: () => {
        navigator('./description');
      },
    },
    {
      title: '學生列表',
      icon: <TeamOutlined />,
      onClick: () => {
        navigator('./student');
      },
    },
    {
      title: '課堂安排',
      icon: <OrderedListOutlined />,
      onClick: () => {
        navigator('./lesson');
      },
    },
    {
      title: '點名紀錄',
      icon: <CheckCircleOutlined />,
      onClick: () => {
        navigator('./attendance');
      },
    },
  ];
  const menuTeacher = [
    {
      title: '關於課程',
      icon: <PicLeftOutlined />,
      onClick: () => {
        navigator('./description');
      },
    },
    {
      title: '學生管理',
      icon: <UserSwitchOutlined />,
      onClick: () => {
        navigator('./student');
      },
    },
    {
      title: '課堂安排',
      icon: <OrderedListOutlined />,
      onClick: () => {
        navigator('./lesson');
      },
    },
    {
      title: '點名紀錄',
      icon: <CheckCircleOutlined />,
      onClick: () => {
        navigator('./attendance');
      },
    },
    {
      title: '編輯課程',
      icon: <EditOutlined />,
      onClick: () => {
        setIsEditing(!isEditing);
      },
    },

    {
      title: '刪除課程',
      icon: <FileExcelOutlined />,
      danger: true,
      onClick: () => {
        console.log('click');
        showConfirm(
          <>
            <span style={{ color: 'red' }}>
              警告!!即將刪除這門課程!
              <br />
              提示您:
              如果刪除課程，此課程的全部資料，包含學生選課，學生出席紀錄也會一併銷毀
            </span>
            請問確定要刪除課堂嗎?
          </>,
          () => {
            deleteCourseData();
          },
          () => {},
        );
      },
    },
  ];
  const deleteCourseData = async () => {
    const path = `/course/${courseData.id}`;
    const res = await apiUtil(path, 'DELETE', null);
    if (res?.isSystemError) return;
    if (res?.code === 200) {
      message.success('刪除成功，即將重回課程管理頁面');
      navigator('/dashboard/course');
    } else {
      message.error('刪除失敗');
    }
  };

  const getCardClass = (title) => {
    switch (title) {
      case '關於課程':
        return 'oc-card-about';
      case '學生管理':
      case '學生列表':
        return 'oc-card-student';
      case '課堂安排':
        return 'oc-card-calendar';
      case '點名紀錄':
        return 'oc-card-attendance';
      case '編輯課程':
        return 'oc-card-edit';
      case '刪除課程':
        return 'oc-card-danger';
      default:
        return '';
    }
  };

  return (
    <div
      className={`oc-course-menu ${user?.role === 0 ? 'student' : 'teacher'}`}
    >
      <ul className="oc-course-menu-grid">
        {menu.map((item, index) => {
          return (
            <li
              className={`oc-course-menu-card ${getCardClass(item.title)} ${item?.danger ? 'danger' : ''}`}
              key={index}
              onClick={item.onClick}
            >
              <div className="oc-menu-card-icon">{item.icon}</div>
              <div className="oc-menu-card-title">{item.title}</div>
            </li>
          );
        })}
      </ul>
      {isEditing && (
        <OCOverlay
          className="oc-course-edit-block"
          toggle={() => {
            setIsEditing(!isEditing);
          }}
        >
          <OCCourseEditForm courseData={courseData} resetCourse={resetCourse} />
        </OCOverlay>
      )}
      {confirmElement}
    </div>
  );
}
export function OCCourseEditForm(props) {
  const { courseData, resetCourse } = props;
  const [courseEditForm] = Form.useForm();
  const [isWaiting, setIsWaiting] = useState();

  const updateCourse = async (params) => {
    setIsWaiting(true);
    const path = `/course/${courseData.id}`;
    const res = await apiUtil(path, 'PATCH', null, params);
    if (res?.isSystemError) return;
    if (res?.code === 200) {
      message.success('編輯成功');
      resetCourse && resetCourse();
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

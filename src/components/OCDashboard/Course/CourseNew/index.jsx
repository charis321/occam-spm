import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Button,
  Form,
  Row,
  Col,
  Input,
  Space,
  Select,
  TimePicker,
  Typography,
  message,
} from 'antd';
import { useAuth } from '../../../../Util/AuthContext';
import { apiUtil } from '../../../../Util/WebApi';
import { validateCourse } from '../../../../Util/validation/validateForm';
import './index.css';

export default function CourseNew() {
  // const [courseData, setCourseData] = useState({});
  const { user } = useAuth();
  const [newCourseForm] = Form.useForm();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(name, value);
    setCourseData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  // const checkCourseVaild = (courseData) =>{
  //   const keys = Object.keys(courseData)
  //   for(let i = 0 ; i < keys.length ; i++){
  //     if(courseData[keys[i]] === ""){
  //       alert("請填寫完整資料")
  //       return false
  //     }
  //   }
  // }
  const addCourseData = async (course) => {
    const res = await apiUtil('/course', 'POST', null, course);
    if (res?.code === 200) {
      message.success('新增課程成功');
      navigate('/dashboard/course');
    } else {
      message.error('新增課程失敗');
    }
  };
  const handleSubmit = async (params) => {
    const newCourse = {
      ...params,
      teacherId: user.id,
      scheduleStartTime: params.scheduleStartTime.format('HH:mm'),
      scheduleEndTime: params.scheduleEndTime.format('HH:mm'),
    };
    await addCourseData(newCourse);
  };
  return (
    <div className="oc-course-new">
      <h2>新增課程</h2>
      <section>
        <Form
          form={newCourseForm}
          layout="vertical"
          className="oc-course-new-form"
          onFinish={handleSubmit}
        >
          <Form.Item
            label="課程名稱"
            name="name"
            rules={[{ required: true, message: '請輸入課程名稱' }]}
          >
            <Input placeholder="請輸入課程名稱" />
          </Form.Item>

          <Row gutter={4}>
            <Col span={12}>
              <Form.Item
                label="開課學校"
                name="school"
                rules={[{ required: true, message: '請輸入開課學校' }]}
              >
                <Input placeholder="請輸入開課學校" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="開課系所"
                name="department"
                rules={[{ required: true, message: '請輸入開課系所' }]}
              >
                <Input placeholder="請輸入開課系所" />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item label="上課教室" name="classroom">
            <Input placeholder="請輸入教室" />
          </Form.Item>
          <Form.Item label="上課時間" required>
            <Space wrap>
              <Form.Item
                name="scheduleWeek"
                noStyle
                rules={[{ required: true, message: '請輸入星期' }]}
              >
                <Select
                  placeholder="選擇星期"
                  style={{ width: 100 }}
                  rules={[{ required: true }]}
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

              <Form.Item name="scheduleStartTime" noStyle>
                <TimePicker format="HH:mm" minuteStep={5} />
              </Form.Item>

              <Typography.Text>到</Typography.Text>

              <Form.Item
                name="scheduleEndTime"
                noStyle
                dependencies={['scheduleStartTime']}
                rules={[
                  { required: true, message: '請輸入結束時間' },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      const start = getFieldValue('scheduleStartTime');
                      if (!value || !start || start.isBefore(value)) {
                        return Promise.resolve();
                      }
                      return Promise.reject(
                        new Error('結束時間不能早於開始時間!'),
                      );
                    },
                  }),
                ]}
              >
                <TimePicker format="HH:mm" minuteStep={5} />
              </Form.Item>
            </Space>
          </Form.Item>

          <Form.Item label="課程簡介" name="info">
            <Input.TextArea rows={4} placeholder="請輸入課程簡介" />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              block
              className="oc-course-new-submit-btn"
            >
              確認新增
            </Button>
          </Form.Item>
        </Form>
      </section>
      {/* <Form className="oc-course-new-form">
        <Form.Item className="oc-course-new-form-item">
          <label htmlFor="name">課程名稱</label>
          <input
            type="text"
            id="name"
            name="name"
            placeholder="請輸入課程名稱"
            onChange={handleChange}
          />
        </Form.Item>
        <div className="oc-course-new-form-item">
          <label htmlFor="school">開課學校</label>
          <input
            type="text"
            id="school"
            name="school"
            placeholder="請輸入開課學校"
            onChange={handleChange}
          />
        </div>
        <div className="oc-course-new-form-item">
          <label htmlFor="department">開課系所</label>
          <input
            type="text"
            id="department"
            name="department"
            placeholder="請輸入開課系所"
            onChange={handleChange}
          />
        </div>
        <div className="oc-course-new-form-item">
          <label htmlFor="classroom">上課教室</label>
          <input
            type="text"
            id="classroom"
            name="classroom"
            placeholder="請輸入教室"
            onChange={handleChange}
          />
        </div>
        <div className="oc-course-new-form-item">
          <label>上課時間</label>
          <select id="scheduleWeek" name="scheduleWeek" onChange={handleChange}>
            <option value="">請選擇星期</option>
            <option value="1">星期一</option>
            <option value="2">星期二</option>
            <option value="3">星期三</option>
            <option value="4">星期四</option>
            <option value="5">星期五</option>
            <option value="6">星期六</option>
            <option value="0">星期日</option>
          </select>
          <input
            type="time"
            id="scheduleStartTime"
            name="scheduleStartTime"
            onChange={handleChange}
          />
          <span> 到 </span>
          <input
            type="time"
            id="scheduleEndTime"
            name="scheduleEndTime"
            onChange={handleChange}
          />
        </div>
        <div className="oc-course-new-form-item">
          <label htmlFor="info">課程介紹</label>
          <input
            type="textarea"
            id="info"
            name="info"
            placeholder="請輸入課程介紹"
            onChange={handleChange}
          />
        </div>
        <Button
          className="oc-course-new-submit-btn"
          type="primary"
          onClick={handleSubmit}
        >
          確認
        </Button>
      </Form> */}
    </div>
  );
}

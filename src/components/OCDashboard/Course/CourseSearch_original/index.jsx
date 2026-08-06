import { Form, Button, Input, Space } from 'antd';
import { SearchOutlined, ReloadOutlined } from '@ant-design/icons';
import './index.css';

export default function OCCourseSearch(props) {
  const [courseFilter] = Form.useForm();
  const { changeCourseFilter } = props;

  const handleSubmit = () => {
    console.log('submit', courseFilter.getFieldsValue());
    changeCourseFilter(courseFilter.getFieldsValue());
  };

  const handleReset = () => {
    courseFilter.resetFields();
    changeCourseFilter({});
  };

  return (
    <Form
      form={courseFilter}
      onFinish={handleSubmit}
      layout="inline"
      className="oc-course-search-form"
    >
      <Form.Item
        name="name"
        label={<span className="oc-form-label">課程名稱</span>}
      >
        <Input placeholder="輸入課程關鍵字" className="oc-search-input" />
      </Form.Item>
      <Form.Item
        name="school"
        label={<span className="oc-form-label">開課學校</span>}
      >
        <Input placeholder="輸入學校名稱" className="oc-search-input" />
      </Form.Item>

      <Form.Item
        name="department"
        label={<span className="oc-form-label">開課系所</span>}
      >
        <Input placeholder="輸入系所名稱" className="oc-search-input" />
      </Form.Item>

      <Form.Item className="oc-search-actions">
        <Space size="middle">
          <Button
            type="primary"
            htmlType="submit"
            icon={<SearchOutlined />}
            className="oc-search-submit-btn"
          >
            查詢
          </Button>
          <Button
            onClick={handleReset}
            icon={<ReloadOutlined />}
            className="oc-search-reset-btn"
          >
            重設
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
}


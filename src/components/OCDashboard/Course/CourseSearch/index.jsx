import { useState } from 'react';
import { Form, Button, Input, Select, Space, Col, Row } from 'antd';
import {
  PlusCircleOutlined,
  SearchOutlined,
  ReloadOutlined,
} from '@ant-design/icons';
import './index.css';
import { useEffect } from 'react';
import { Radius } from 'lucide-react';

export default function OCCourseSearch(props) {
  const [isPreciseSearch, setIsPreciseSearch] = useState(false);
  const [courseFilter, setCourseFilter] = Form.useForm();
  const { changeCourseFilter } = props;

  const handleSubmit = () => {
    console.log('submit', courseFilter.getFieldsValue());
    changeCourseFilter(courseFilter.getFieldsValue());
  };
  const handleReset = () => {
    courseFilter.resetFields();
  };

  return (
    <Form
      form={courseFilter}
      onFinish={handleSubmit}
      layout="inline"
      className="oc-course-search-form"
      style={{
        gap: '16px',
        flexDirection: 'row',
        justifyContent: 'center',
        padding: '20px',
        borderRadius: '0.5rem',
      }}
    >
      <Form.Item name="name" label="課程名">
        <Input placeholder="輸入課程名" style={{ width: 180 }} />
      </Form.Item>
      <Form.Item name="school" label="開課學校">
        <Input placeholder="輸入學校" style={{ width: 180 }} />
      </Form.Item>

      <Form.Item name="department" label="開課學系">
        <Input placeholder="輸入學系" style={{ width: 180 }} />
      </Form.Item>

      <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>
        查詢
      </Button>
    </Form>
  );
}

import { useState } from 'react';
import { Form, Button, Input, Select, Space } from 'antd';
import {
  PlusCircleOutlined,
  SearchOutlined,
  ReloadOutlined,
} from '@ant-design/icons';
import './index.css';
import { useEffect } from 'react';

export default function OCUserSearch(props) {
  const [isPreciseSearch, setIsPreciseSearch] = useState(false);
  const [userFilter, setUserFilter] = Form.useForm();
  const { changeUserFilter } = props;

  const handleSubmit = () => {
    console.log('submit', userFilter.getFieldsValue());
    changeUserFilter(userFilter.getFieldsValue());
  };
  const handleReset = () => {
    userFilter.resetFields();
  };

  return (
    <Form
      form={userFilter}
      onFinish={handleSubmit}
      layout="vertical"
      className="oc-user-search-form"
    >
      <Space wrap align="end" style={{ marginBottom: 16 }}>
        <Form.Item name="role" label="用戶身分">
          <Select
            style={{ width: 120 }}
            options={[
              { value: '', label: '無指定' },
              { value: '0', label: '學生' },
              { value: '1', label: '教師' },
              { value: '2', label: '管理員' },
            ]}
          />
        </Form.Item>

        <Form.Item name="status" label="用戶狀態">
          <Select
            allowClear
            style={{ width: 120 }}
            options={[
              { value: '', label: '無指定' },
              { value: 0, label: '正常' },
              { value: 1, label: '已停用' },
            ]}
          />
        </Form.Item>

        <Form.Item>
          <Space>
            <Button
              danger={isPreciseSearch}
              icon={<PlusCircleOutlined />}
              onClick={() => setIsPreciseSearch(!isPreciseSearch)}
            >
              {isPreciseSearch ? '關閉精確' : '精確查詢'}
            </Button>
            <Button type="primary" icon={<SearchOutlined />} htmlType="submit">
              查詢
            </Button>
            <Button icon={<ReloadOutlined />} onClick={handleReset}>
              重置
            </Button>
          </Space>
        </Form.Item>
      </Space>

      {isPreciseSearch && (
        <div
          style={{
            background: '#f5f5f5',
            padding: '16px',
            borderRadius: '8px',
          }}
        >
          <Space wrap>
            <Form.Item name="id" label="用戶 ID">
              <Input placeholder="輸入 ID" style={{ width: 120 }} />
            </Form.Item>
            <Form.Item name="name" label="姓名">
              <Input placeholder="輸入姓名" style={{ width: 120 }} />
            </Form.Item>
            <Form.Item name="email" label="電子信箱">
              <Input placeholder="輸入信箱" style={{ width: 180 }} />
            </Form.Item>
            <Form.Item name="school" label="學校">
              <Input placeholder="輸入學校" style={{ width: 150 }} />
            </Form.Item>
            <Form.Item name="department" label="學系">
              <Input placeholder="輸入學系" style={{ width: 150 }} />
            </Form.Item>
            <Form.Item name="no" label="學號">
              <Input placeholder="輸入學號" style={{ width: 120 }} />
            </Form.Item>
          </Space>
        </div>
      )}
    </Form>
  );
}

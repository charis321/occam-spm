import { Button, Table, Tag } from 'antd';
import { useNavigate } from 'react-router-dom';
import { EyeOutlined, MailOutlined } from '@ant-design/icons';

export default function OCStudentTable(props) {
  const { data, isNew, pageSize = 5 } = props;
  const navigator = useNavigate();

  const columns_student = [
    {
      key: 'no',
      title: '學號',
      dataIndex: 'no',
      responsive: ['sm'],
      render: (text) => (
        <span style={{ fontFamily: 'SFMono-Regular, Consolas, Monaco, monospace', color: 'var(--oc-text-secondary)', fontWeight: 500 }}>
          {text}
        </span>
      ),
    },
    {
      key: 'name',
      title: '姓名',
      dataIndex: 'name',
      render: (text, record) => (
        <div>
          <span style={{ fontWeight: 600, color: 'var(--oc-text-primary)', fontSize: '1.02rem' }}>{text}</span>
          <div style={{ fontFamily: 'SFMono-Regular, Consolas, Monaco, monospace', fontSize: '12px', color: 'var(--oc-text-secondary)', marginTop: '2px' }} className="oc-mobile-only">
            {record.no}
          </div>
        </div>
      ),
    },
    {
      key: 'sex',
      title: '性別',
      dataIndex: 'sex',
      render: (text) => {
        const genderMap = {
          0: {
            title: '未知',
            color: 'grey',
          },
          1: {
            title: '男',
            color: 'blue',
          },
          2: {
            title: '女',
            color: 'red',
          },
        };
        const { title, color } = genderMap[text];
        return <Tag color={color}>{title}</Tag>;
      },
    },
    {
      key: 'school',
      title: '學校',
      dataIndex: 'school',
      responsive: ['md'],
      render: (text) => <span style={{ color: 'var(--oc-text-secondary)' }}>{text}</span>,
    },
    {
      key: 'department',
      title: '學系',
      dataIndex: 'department',
      responsive: ['md'],
      render: (text) => (
        <Tag
          style={{
            backgroundColor: 'var(--oc-primary-bg-light)',
            color: 'var(--oc-primary-hover)',
            borderColor: 'var(--oc-card-border)',
            borderRadius: '4px',
            fontWeight: 500,
          }}
        >
          {text}
        </Tag>
      ),
    },
    {
      key: 'action',
      title: '操作',
      align: 'center',
      render: (record) => {
        return (
          <div className="oc-student-action-btns">
            <Button
              className="oc-btn-amber-outline"
              icon={<EyeOutlined />}
              onClick={() => {
                navigator(`/dashboard/user/${record.id}`);
              }}
            >
              <span className="oc-desktop-only">查看</span>
            </Button>
            <Button
              type="primary"
              className="oc-btn-amber-solid"
              icon={<MailOutlined />}
              onClick={() => {
                navigator(`/dashboard/message/new?to=${record.id}`);
              }}
            >
              <span className="oc-desktop-only">通知</span>
            </Button>
          </div>
        );
      },
    },
  ];

  const columns_new_student = [
    {
      key: 'school',
      title: '學校',
      dataIndex: 'school',
      responsive: ['md'],
      render: (text) => <span style={{ color: 'var(--oc-text-secondary)' }}>{text}</span>,
    },
    {
      key: 'department',
      title: '學系',
      dataIndex: 'department',
      responsive: ['md'],
      render: (text) => (
        <Tag
          style={{
            backgroundColor: 'var(--oc-primary-bg-light)',
            color: 'var(--oc-primary-hover)',
            borderColor: 'var(--oc-card-border)',
            borderRadius: '4px',
            fontWeight: 500,
          }}
        >
          {text}
        </Tag>
      ),
    },
    {
      key: 'no',
      title: '學號',
      dataIndex: 'no',
      responsive: ['sm'],
      render: (text) => (
        <span style={{ fontFamily: 'SFMono-Regular, Consolas, Monaco, monospace', color: 'var(--oc-text-secondary)', fontWeight: 500 }}>
          {text}
        </span>
      ),
    },
    {
      key: 'name',
      title: '姓名',
      dataIndex: 'name',
      render: (text, record) => (
        <div>
          <span style={{ fontWeight: 600, color: 'var(--oc-text-primary)', fontSize: '1.02rem' }}>{text}</span>
          <div style={{ fontFamily: 'SFMono-Regular, Consolas, Monaco, monospace', fontSize: '12px', color: 'var(--oc-text-secondary)', marginTop: '2px' }} className="oc-mobile-only">
            {record.no}
          </div>
        </div>
      ),
    },
    {
      key: 'email',
      title: 'Email',
      dataIndex: 'email',
      responsive: ['md'],
      render: (text) => (
        <span style={{ fontFamily: 'SFMono-Regular, Consolas, Monaco, monospace', color: 'var(--oc-text-secondary)', fontSize: '0.92rem' }}>
          {text}
        </span>
      ),
    },
  ];

  return (
    <Table
      dataSource={data}
      columns={isNew ? columns_new_student : columns_student}
      scroll={{ x: '100%' }}
      pagination={{ pageSize }}
      size={isNew ? 'small' : 'large'}
      rowKey={(record) => record.no}
    />
  );
}

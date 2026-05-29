import { Button, Table } from 'antd';
import { useNavigate } from 'react-router-dom';

export default function OCStudentTable(props) {
  const { data, isNew, pageSize = 5 } = props;

  const navigator = useNavigate();

  const columns_student = [
    {
      key: 'no',
      title: '學號',
      dataIndex: 'no',
    },
    {
      key: 'name',
      title: '姓名',
      dataIndex: 'name',
    },
    {
      key: 'school',
      title: '學校',
      dataIndex: 'school',
    },
    {
      key: 'department',
      title: '學系',
      dataIndex: 'department',
    },
    {
      key: 'action',
      title: '操作',
      render: (record) => {
        return (
          <div>
            <Button
              onClick={() => {
                navigator(`/dashboard/user/${record.id}`);
              }}
            >
              查看
            </Button>
            <Button
              onClick={() => {
                navigator(`/dashboard/message/new?to=${record.id}`);
              }}
            >
              通知
            </Button>
          </div>
        );
      },
    },
    // {
    //   key: "attendance_status",
    //   title: "出席狀況",
    //   dataIndex: "attendance_status",
    // },
    // {
    //   key: "attendance_rate",
    //   title: "出席率",
    //   dataIndex: "attendance_rate",
    // },
  ];
  const columns_new_student = [
    {
      key: 'school',
      title: '學校',
      dataIndex: 'school',
      responsive: ['lg'],
    },
    {
      key: 'department',
      title: '學系',
      dataIndex: 'department',
      responsive: ['lg'],
    },
    {
      key: 'no',
      title: '學號',
      dataIndex: 'no',
    },
    {
      key: 'name',
      title: '姓名',
      dataIndex: 'name',
    },
    {
      key: 'email',
      title: 'Email',
      dataIndex: 'email',
      responsive: ['lg'],
    },
  ];

  return (
    <Table
      dataSource={data}
      columns={isNew ? columns_new_student : columns_student}
      scroll={{ x: '80%' }}
      pagination={{ pageSize }}
      size={isNew ? 'small' : 'large'}
      rowKey={(record) => record.no}
    ></Table>
  );
}

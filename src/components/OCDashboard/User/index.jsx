import { useState, useEffect } from 'react';
import { data, useNavigate } from 'react-router-dom';

import {
  Table,
  Tag,
  Button,
  Tooltip,
  Input,
  Select,
  Form,
  Row,
  Col,
  Spin,
  message,
} from 'antd';
import {
  PlusCircleOutlined,
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  StopOutlined,
  CheckCircleOutlined,
  DownloadOutlined,
} from '@ant-design/icons';

import { apiUtil } from '../../../Util/WebApi';
import { useAuth } from '../../../Util/AuthContext';
import { useConfirm } from '../../../Util/hooks/useConfirm';

import OCLoading from '@components/OCCommon/OCLoading';
import { USER_STATUS } from '../../../config/user';
import { ROLE_INDEX } from '../../../config/role';
import * as XLSX from 'xlsx';
import './index.css';
import OCUserSearch from './UserSearch';
import OCOverlay from '../../OCCommon/OCOverlay';
import { Space } from 'antd';

export default function OCUserDashboard(props) {
  const { user } = useAuth();
  const navigator = useNavigate();
  const [showConfirm, confirmElement] = useConfirm();
  const [userData, setUserData] = useState([]);
  const [isUserAdding, setIsUserAdding] = useState(false);
  const [isUserBatchAdding, setIsUserBatchAdding] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isWaiting, setIsWaiting] = useState(false);

  useEffect(() => {
    if (user.role !== 2) {
      message.error('您沒有權限訪問此頁面，即將返回首頁');
      navigator('/dashboard');
    }
    const controller = new AbortController();
    getUserData(null, controller.signal);
    return () => {
      controller.abort();
    };
  }, []);

  const columns_user_action = [
    {
      key: 'name',
      title: '用戶名',
      dataIndex: 'name',
    },
    {
      key: 'role',
      title: '身分',
      dataIndex: 'role',
      render: (role) => {
        const roleMap = {
          0: {
            title: '學生',
            color: 'blue',
          },
          1: {
            title: '教師',
            color: 'green',
          },
          2: {
            title: '管理員',
            color: 'red',
          },
        };
        const { title, color } = roleMap[role];
        return <Tag color={color}>{title}</Tag>;
      },
    },
    // {
    //   key: "email",
    //   title: '電子郵件',
    //   dataIndex: 'email',
    // },
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
      key: 'createTime',
      title: '創建時間',
      dataIndex: 'createTime',
      render: (createTime) => {
        const date = new Date(createTime);
        return date.toLocaleString();
      },
      sorter: (a, b) => new Date(a.createTime) - new Date(b.createTime),
    },
    {
      key: 'status',
      title: '用戶狀態',
      dataIndex: 'status',
      render: (status) => {
        const { title, color } = USER_STATUS[status];
        return <Tag color={color}>{title}</Tag>;
      },
    },

    {
      key: 'action',
      title: '操作',
      render: (text, record) => {
        return (
          <div className="oc-flex" style={{ minWidth: '150px' }}>
            <Tooltip title="查看用戶">
              <Button
                type="primary"
                shape="circle"
                icon={<SearchOutlined />}
                onClick={handleUserAction('check', record)}
              />
            </Tooltip>
            <Tooltip title="編輯用戶">
              <Button
                type="primary"
                shape="circle"
                icon={<EditOutlined />}
                onClick={handleUserAction('edit', record)}
              />
            </Tooltip>
            <Tooltip title={record.status == 1 ? '啟用用戶' : '停用用戶'}>
              {record.status === 1 ? (
                <Button
                  variant="solid"
                  shape="circle"
                  color="cyan"
                  icon={<CheckCircleOutlined />}
                  onClick={handleUserAction('activate', record)}
                />
              ) : (
                <Button
                  type="primary"
                  shape="circle"
                  danger
                  icon={<StopOutlined />}
                  onClick={handleUserAction('activate', record)}
                />
              )}
            </Tooltip>
            <Tooltip title="刪除用戶">
              <Button
                type="primary"
                shape="circle"
                danger
                icon={<DeleteOutlined />}
                onClick={handleUserAction('delete', record)}
              />
            </Tooltip>
          </div>
        );
      },
    },
  ];

  const getUserData = async (filter, signal = null) => {
    setIsLoading(true);
    const path = '/user';
    const res = await apiUtil(path, 'GET', signal, filter);
    if (res?.isSystemError) return;
    if (res?.code === 200) {
      const userList = res.data;
      const curr_user_idx = userList.findIndex((u) => u.id == user.id);
      if (curr_user_idx != -1) {
        const curr_user = userList.splice(curr_user_idx, 1)[0];
        userList.unshift(curr_user);
      }
      setUserData(userList);
    }
    setIsLoading(false);
  };
  const changeUserData = async (userId, patch) => {
    const path = `/user/${userId}`;
    const res = await apiUtil(path, 'PATCH', null, patch);
    if (res?.code === 200) {
      message.success('用戶更新成功');
      getUserData();
    }
  };

  const deleteUserData = async (userId) => {
    const path = `/user/${userId}`;
    const res = await apiUtil(path, 'DELETE');

    if (res?.code === 200) {
      message.success('用戶刪除成功');
      getUserData();
    } else {
      message.error('用戶刪除失敗');
    }
  };
  const handleAddUser = () => {
    setIsUserAdding(true);
  };
  const handleAddUserBatch = () => {
    setIsUserBatchAdding(true);
  };
  const handleUserAction = (action, user) => {
    let content;
    return (e) => {
      switch (action) {
        case 'check':
          navigator('/dashboard/user/' + user.id);
          break;
        case 'edit':
          navigator('/dashboard/user/' + user.id + '/edit');
          break;
        case 'activate':
          if (user.status === 1) {
            const user_patch = {
              status: 0, // 啟用用戶
            };
            changeUserData(user.id, user_patch);
            break;
          } else {
            const content = (
              <>
                <span style={{ color: 'red' }}>警告!!即將刪除這門課程!</span>
                <p>
                  提示您:
                  如果刪除課程，此課程的全部資料，包含學生選課，學生出席紀錄也會一併銷毀
                </p>
                請問確定要停用用戶嗎?
              </>
            );

            showConfirm(
              content,
              () => {
                const user_patch = {
                  status: 1,
                };
                changeUserData(user.id, user_patch);
              },
              () => {},
            );
            break;
          }

        case 'delete':
          const content = (
            <>
              <span style={{ color: 'red' }}>
                警告! 用戶一旦刪除即無法回撤
                <br />
                如果只是暫時停止用戶活動，請使用停用功能。
              </span>
              請問確定要刪除用戶嗎?
            </>
          );
          showConfirm(
            content,
            () => {
              const userId = user.id;
              deleteUserData(userId);
            },
            () => {},
          );
          break;
      }
    };
  };

  const changeUserFilter = (filter) => {
    getUserData(filter);
  };
  return (
    <>
      {isLoading ? (
        <OCLoading />
      ) : (
        <div className="oc-user-dashboard">
          <div className="oc-page-title">
            <h2>用戶管理</h2>
            <hr />
          </div>
          <div className="oc-user-controller">
            <Button type="primary" onClick={handleAddUser}>
              <PlusCircleOutlined />
              新增用戶
            </Button>
            <Button
              type="primary"
              variant="solid"
              color="purple"
              onClick={handleAddUserBatch}
            >
              <PlusCircleOutlined />
              批量新增用戶
            </Button>
          </div>
          <OCUserSearch changeUserFilter={changeUserFilter} />
          <Table
            className="oc-user-table"
            dataSource={userData}
            columns={columns_user_action}
            scroll={{ x: '80%' }}
            expandable={{
              expandedRowRender: (record) => (
                <>
                  <p style={{ margin: 0 }}>用戶id: {record.id}</p>
                  <p style={{ margin: 0 }}>E mail: {record.email}</p>
                </>
              ),
            }}
            rowKey={(record) => record.id}
            rowHoverable={false}
            rowClassName={(record, index) =>
              record.id === user.id ? 'curr-user-row' : null
            }
          />

          {isUserAdding && (
            <OCOverlay
              toggle={() => {
                setIsUserAdding(!isUserAdding);
              }}
            >
              <OCUserNewBlock
                closeBlock={() => setIsUserAdding(false)}
                resetUserData={() => {
                  setIsUserAdding(false);
                  getUserData();
                }}
              />
            </OCOverlay>
          )}
          {isUserBatchAdding && (
            <OCOverlay
              toggle={() => {
                setIsUserBatchAdding(!isUserBatchAdding);
              }}
            >
              <OCUserNewBatchBlock
                closeBlock={() => setIsUserBatchAdding(false)}
                resetUserData={() => {
                  setIsUserBatchAdding(false);
                  getUserData();
                }}
              />
            </OCOverlay>
          )}
          {confirmElement}
        </div>
      )}
    </>
  );
}

export function OCUserNewBlock(props) {
  const { resetUserData } = props;
  const [newUserForm] = Form.useForm();
  const [isWaiting, setIsWaiting] = useState(false);

  const defaultPassword = Form.useWatch('default-password', newUserForm);

  const addNewUserData = async (data) => {
    setIsWaiting(true);
    const path = `/auth/register`;
    const res = await apiUtil(path, 'POST', null, data);
    if (res?.code === 200) {
      message.success('新增用戶成功');
      resetUserData();
    } else {
      message.error('新增用戶失敗');
    }
    setIsWaiting(false);
  };

  const handleSubmit = (data) => {
    addNewUserData(data);
  };
  return (
    <div className="oc-user-new-block">
      <Form
        className="oc-user-new-form"
        form={newUserForm}
        onFinish={handleSubmit}
        style={{ transition: 'all 0.5s ease-in-out' }}
      >
        <h2>新增用戶</h2>
        <Row>
          <Col span={24}>
            <Form.Item
              className="oc-user-new-form-item"
              name="name"
              label="用戶姓名"
              rules={[{ required: true }]}
            >
              <Input type="text" placeholder="請輸入用戶姓名" />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <Form.Item
              className="oc-user-new-form-item"
              name="email"
              label="電子郵件"
              rules={[{ required: true }]}
            >
              <Input type="email" placeholder="請輸入電子郵件" />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={1}>
          <Col span={12}>
            <Form.Item
              className="oc-user-new-form-item"
              name="sex"
              label="性別"
              initialValue={0}
            >
              <Select
                style={{ width: '120px' }}
                options={[
                  { value: 0, label: '未知/其他' },
                  { value: 1, label: '男性' },
                  { value: 2, label: '女性' },
                ]}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              className="oc-user-new-form-item"
              name="role"
              label="身分"
              initialValue={0}
            >
              <Select
                style={{ width: '120px' }}
                options={[
                  { value: 0, label: '學生' },
                  { value: 1, label: '教師' },
                  { value: 2, label: '管理員' },
                ]}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <Form.Item
              className="oc-user-new-form-item"
              name="default-password"
              label="默認密碼形式"
              initialValue={true}
            >
              <Select
                style={{ width: '120px' }}
                options={[
                  { value: true, label: '自動' },
                  { value: false, label: '手動' },
                ]}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              className="oc-user-new-form-item"
              name="password"
              label="密碼"
              rules={[{ required: !defaultPassword }]}
            >
              <Input
                type="password"
                placeholder="請輸入密碼"
                disabled={defaultPassword}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={4}>
          <Col span={12}>
            <Form.Item
              className="oc-user-new-form-item"
              name="school"
              label="所屬學校"
            >
              <Input type="text" placeholder="請輸入所屬學校" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              className="oc-user-new-form-item"
              name="department"
              label="所屬學系"
            >
              <Input type="text" placeholder="請輸入所屬學系" />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={4}>
          <Col span={12}>
            <Form.Item
              className="oc-user-new-form-item"
              name="no"
              label="學號/辨識碼"
            >
              <Input type="text" placeholder="請輸入學號/辨識碼" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              className="oc-user-new-form-item"
              name="placement"
              label="職位"
            >
              <Input type="text" placeholder="請輸入職位" />
            </Form.Item>
          </Col>
        </Row>
        <Button
          type="primary"
          htmlType="submit"
          disabled={isWaiting}
          loading={isWaiting}
        >
          確認新增
        </Button>
      </Form>
    </div>
  );
}

export function OCUserNewBatchBlock(props) {
  const { resetUserData } = props;
  const [newUserData, setNewUserData] = useState([]);
  const [newUserFile, setNewUserFile] = useState(null);
  const [isWaiting, setIsWaiting] = useState(false);

  const columns_user = [
    {
      key: 'name',
      title: '姓名',
      dataIndex: 'name',
    },
    {
      key: 'email',
      title: '電子信箱',
      dataIndex: 'email',
    },
    {
      key: 'role',
      title: '身分',
      dataIndex: 'role',
      render: (role) => {
        const { title, color } = ROLE_INDEX[role];
        return <Tag color={color}>{title}</Tag>;
      },
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
      key: 'no',
      title: '學號',
      dataIndex: 'no',
    },
    {
      key: 'sex',
      title: '性別',
      dataIndex: 'sex',
      render: (sex) => {
        const SEX_INDEX = [
          { title: '其他', color: 'gray' },
          { title: '男', color: 'blue' },
          { title: '女', color: 'pink' },
        ];
        const { title, color } = SEX_INDEX[sex];
        return <Tag color={color}>{title}</Tag>;
      },
    },
  ];

  const downloadNewUserTemplate = () => {
    const workbook = XLSX.utils.book_new();
    const headers = [
      [
        '姓名',
        '電子郵件',
        '身分',
        '性別',
        '學號/辨識碼',
        '所屬學校',
        '所屬學系',
      ],
      [
        '必填 例: 王曉明',
        '必填 例: youname@gmail.com',
        '| 學生: 0 | 教師: 1 | 管理員: 2 |，預設為0(學生)',
        '| 未知/其他: 0 | 男: 1 | 女: 2 |，預設為0(未知/其他)',
        '例: 1160123456',
        '例: 台灣大學',
        '例: 應用外語學系',
      ],
    ];
    const worksheet = XLSX.utils.aoa_to_sheet(headers);
    const fileName = '用戶批量註冊範本.xlsx';

    XLSX.utils.book_append_sheet(workbook, worksheet, '批次註冊填寫清單');
    XLSX.writeFile(workbook, fileName);
  };
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    let jsonData = [];
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });

      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];

      const rawData = XLSX.utils.sheet_to_json(worksheet, {
        header: ['name', 'email', 'role', 'sex', 'no', 'school', 'department'],
        range: 2,
      });
      console.log('Excel 內容：', rawData);

      // jsonData = XLSX.utils.sheet_to_json(worksheet);
      // jsonData = jsonData.map((item) => {
      //   return {
      //     key: item['__EMPTY'],
      //     name: String(item['姓名']).trim(),
      //     email: String(item['電子郵件']).trim(),
      //     role: item['身分'] ? Number(item['身分']) : 0,
      //     sex: item['性別'] ? String(item['性別']).trim() : 0,
      //     no: item['學號/辨識碼'] ? String(item['學號/辨識碼']).trim() : null,
      //     school: item['所屬學校'] ? String(item['所屬學校']).trim() : null,
      //     department: item['所屬學系'] ? String(item['所屬學系']).trim() : null,
      //   };
      // });
      // setNewUserData(jsonData);
      // };

      const cleanedData = rawData
        .filter((item) => item.name && item.email) // 關鍵防呆：過濾掉完全空白的橫列
        .map((item) => {
          // 處理身分：如果使用者沒填，或是填了非數字，給予預設值 0
          let parsedRole = parseInt(item.role, 10);
          if (isNaN(parsedRole)) parsedRole = 0;

          // 處理性別：如果使用者沒填，或是填了非數字，給予預設值 0
          let parsedSex = parseInt(item.sex, 10);
          if (isNaN(parsedSex)) parsedSex = 0;

          return {
            name: String(item.name).trim(),
            email: String(item.email).trim(),
            role: parsedRole,
            sex: parsedSex,
            no: item.no ? String(item.no).trim() : null,
            school: item.school ? String(item.school).trim() : null,
            department: item.department ? String(item.department).trim() : null,
          };
        });
      setNewUserData(cleanedData);
    };
    if (file) {
      reader.readAsArrayBuffer(file);
      setNewUserFile(file);
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newUserData.length === 0) {
      message.warning('請先選擇並解析上傳 Excel 檔案');
      return;
    }
    setIsWaiting(true);
    const path = `/auth/register/batch`;
    const res = await apiUtil(path, 'POST', null, newUserData);
    if (res?.isSystemError) return;
    if (res?.code === 200) {
      message.success('批量新增用戶成功');
      closeBlock();
      resetUserData();
    } else {
      message.error(res?.message || '批量新增用戶失敗');
    }
    setIsWaiting(false);
  };
  return (
    <div className="oc-user-new-batch-block">
      <Button icon={<DownloadOutlined />} onClick={downloadNewUserTemplate}>
        下載範本
      </Button>
      <Spin
        spinning={isWaiting}
        delay={500}
        description="批量註冊需花費較長時間，請耐心等待..."
      >
        <div className="oc-user-new-batch-form">
          <form>
            <input
              type="file"
              name="excelFile"
              accept=".xlsx,.xls"
              onChange={handleFileChange}
            ></input>
            <Button
              onClick={handleSubmit}
              disabled={isWaiting}
              loading={isWaiting}
            >
              上傳
            </Button>
          </form>
          <Table
            className="oc-user-new-table"
            dataSource={newUserData}
            columns={columns_user}
            scroll={{ x: '100%' }}
            rowSelection={{
              type: 'checkbox',
              onChange: (selectedRowKeys, selectedRows) => {
                console.log(
                  `selectedRowKeys: ${selectedRowKeys}`,
                  'selectedRows: ',
                  selectedRows,
                );
              },
              getCheckboxProps: (record) => ({
                name: record.name,
              }),
            }}
            pagination={{ pageSize: 5 }}
            rowKey={(record) => record.email}
          ></Table>
        </div>
      </Spin>
    </div>
  );
}

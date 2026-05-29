import { useState, useEffect } from 'react';
import { Table, Input, Button, Radio, Space } from 'antd';
import { ImportOutlined, ExportOutlined } from '@ant-design/icons';
import { apiUtil } from '@utils/WebApi';
import { useAuth } from '@utils/AuthContext';
import { RELATIVE_TIME } from '../../../../config/time';
import OCLoading from '@components/OCCommon/OCLoading';
import OCOverlay from '@components/OCCommon/OCOverlay';
import OCMessageView from '../MessageView';
import './index.css';

export default function OCMessageDashboard(props) {
  const { user } = useAuth();
  const [messageData, setMessageData] = useState([]);
  const [notedMessage, setNotedMessage] = useState(new Set());
  const [mode, setMode] = useState('inbox');
  const [pickMessage, setPickMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    const controller = new AbortController();
    getMessageData(mode, controller.signal);
    return () => {
      controller.abort();
    };
  }, [mode]);
  useEffect(() => {
    console.log('noted', notedMessage);
    return () => {
      if (notedMessage.size > 0) {
        noteMessagesData(Array.from(notedMessage));
      }
    };
  }, [notedMessage]);
  const columns_inbox = [
    {
      key: 'noted',
      width: 50,
      render: (record) => {
        return record.noted || notedMessage.has(record.id) ? null : (
          <span style={{ color: 'yellow' }}>✦</span>
        );
      },
    },
    {
      key: 'sender',
      title: '寄信人',
      width: 200,
      render: (record) => {
        return (
          <div>
            <h4 style={{ margin: 0 }}>
              {record.senderName} <span>{`(${record.senderNo})`}</span>
            </h4>
          </div>
        );
      },
    },
    {
      key: 'title',
      title: '標題',
      dataIndex: 'title',
      width: '10rem',
      ellipsis: true,
    },
    {
      key: 'body',
      title: '本文',
      dataIndex: 'body',
      ellipsis: true,
    },
    {
      key: 'createTime',
      title: '建立時間',
      dataIndex: 'createTime',
      width: '8rem',
      render: (time) => RELATIVE_TIME(time),
    },
  ];
  const columns_outbox = [
    {
      key: 'receiver',
      title: '收信人',
      dataIndex: 'receiverName',
      width: '10rem',
    },
    {
      key: 'title',
      title: '標題',
      dataIndex: 'title',
      width: '10rem',
      ellipsis: true,
    },
    {
      key: 'body',
      title: '本文',
      dataIndex: 'body',
      ellipsis: true,
    },
    {
      key: 'createTime',
      title: '建立時間',
      dataIndex: 'createTime',
      width: '8rem',
      render: (time) => RELATIVE_TIME(time),
    },
  ];
  const getMessageData = async (mode, signal = null) => {
    setIsLoading(true);
    const path = `/message/${mode == 'inbox' ? 'receiver' : 'sender'}/${user.id}`;
    const res = await apiUtil(path, 'GET', signal);
    if (res?.isSystemError) return;
    if (res?.code === 200) {
      setMessageData(res.data);
    } else {
      alert('獲取訊息資料失敗');
    }
    setIsLoading(false);
  };
  // const updateMessageData = async (signal, messages) => {
  //   setIsLoading(true);
  //   const path = `/message/batch`;
  //   const res = await apiUtil(path, 'patch', signal);
  //   if (res?.code === 200) {
  //     setMessageData(res.data);
  //   } else {
  //     console.warn('更改訊息失敗 ID:', id);
  //   }
  //   setIsLoading(false);
  // };
  const noteMessagesData = async (messageIds, signal = null) => {
    console.log('更改訊息');
    const path = `/message/noted`;
    const res = await apiUtil(path, 'patch', signal, messageIds);
    if (res?.code === 200) {
      console.log('更改訊息成功 IDs:', messageIds);
    } else {
      console.warn('更改訊息失敗 IDs:', messageIds);
    }
  };

  return (
    <>
      {isLoading ? (
        <OCLoading />
      ) : (
        <div className="oc-message-dashboard">
          <h2>訊息中心</h2>
          <section>
            <Space style={{ padding: '0.2rem' }}>
              <Radio.Group
                value={mode}
                onChange={(e) => setMode(e.target.value)}
                buttonStyle="solid"
              >
                <Radio.Button value="inbox">
                  <ImportOutlined />
                  &nbsp; 收信匣
                </Radio.Button>
                <Radio.Button value="outbox">
                  <ExportOutlined />
                  &nbsp; 寄信匣
                </Radio.Button>
              </Radio.Group>
            </Space>
            <Table
              className="oc-message-table"
              rowClassName="oc-message-row"
              columns={mode === 'inbox' ? columns_inbox : columns_outbox}
              dataSource={messageData}
              size="small"
              pagination={{
                pageSize: 10,
                pageSizeOptions: ['10', '20', '50'],
                size: 'large',
                showTotal: (total) => `共 ${total} 筆資料`,
              }}
              onRow={(record) => {
                return {
                  onClick: () => {
                    if (!(record.noted || notedMessage.has(record.id)))
                      setNotedMessage((prev) => {
                        const newSet = new Set(prev);
                        newSet.add(record.id);
                        return newSet;
                      });
                    setPickMessage(record);
                  },
                };
              }}
            />
          </section>
          {pickMessage && (
            <OCOverlay toggle={() => setPickMessage(null)}>
              <OCMessageView message={pickMessage} />
            </OCOverlay>
          )}
        </div>
      )}
    </>
  );
}

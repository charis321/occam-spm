import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Table, Space, Divider } from 'antd';
import {
  ArrowRightOutlined,
  MessageOutlined,
  MoreOutlined,
} from '@ant-design/icons';
import axios from 'axios';

import { useAuth } from '../../../Util/AuthContext';
import { apiUtil } from '@utils/WebApi';

import OCLoading from '@components/OCCommon/OCLoading';
import { RELATIVE_TIME, PERIOD_TIME } from '@config/time';

import REMIND_BG_1 from '@/assets/images/remind_bg_1.png';
import REMIND_BG_2 from '@/assets/images/remind_bg_2.png';
import REMIND_BG_3 from '@/assets/images/remind_bg_3.png';
import './index.css';
import { useRef } from 'react';

export default function OCHomeDashboard(props) {
  const { user } = useAuth();
  const [rollcallData, setRollcallData] = useState([]);
  const [lessonData, setLessonData] = useState([]);
  const [messageData, setMessageData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const abortControllerRef = useRef();
  useEffect(() => {
    init();
    return () => {
      abortControllerRef.current.abort();
    };
  }, []);

  const init = async () => {
    abortControllerRef.current = new AbortController();
    const signal = abortControllerRef.current.signal;

    try {
      setIsLoading(true);
      const tasks = [
        getHomeData(
          `/rollcall/${user.role === 0 ? 'student' : 'teacher'}/${user.id}`,
          setRollcallData,
          signal,
        ),
        getHomeData(
          `/lesson/${user.role === 0 ? 'student' : 'teacher'}/${user.id}/today`,
          setLessonData,
          signal,
        ),
        getHomeData(
          `/message/receiver/${user.id}?noted=false`,
          setMessageData,
          signal,
        ),
      ];
      await Promise.allSettled(tasks);
    } catch (error) {
      console.error('初始化 API 發生非預期錯誤：', error);
    } finally {
      if (signal.aborted) return;
      setIsLoading(false);
    }
  };
  const getHomeData = async (path, callback, signal = null) => {
    const res = await apiUtil(path, 'GET', signal);
    if (res?.isSystemError) return;
    if (res && res.code === 200) {
      callback(res.data);
    } else {
      console.warn('資料狀態異常:', path, res);
    }
  };

  // const getRollcallData = async (signal = null) => {
  //   const path = `/rollcall/${user.role === 0 ? 'student' : 'teacher'}/${user.id}`;

  //   try {
  //     const res = await apiUtil(path, 'GET', signal);
  //     if (res && res.code === 200) {
  //       setRollcallData(res.data);
  //     } else {
  //       console.warn('點名資料狀態異常:', res);
  //     }
  //   } catch (error) {
  //     if (axios.isCancel(error)) throw error;
  //     console.log('getRollcallData 捕捉到已處置的錯誤，阻斷後續資料設定');
  //   }
  // };
  // const getLessonData = async (signal = null) => {
  //   const path = `/lesson/${user.role == 0 ? 'student' : 'teacher'}/${user.id}/today`;
  //   const res = await apiUtil(path, 'GET', signal);
  //   try {
  //     const res = await apiUtil(path, 'GET', signal);
  //     if (res && res.code === 200) {
  //       setRollcallData(res.data);
  //     } else {
  //       console.warn('點名資料狀態異常:', res);
  //     }
  //   } catch (error) {
  //     if (axios.isCancel(error)) throw error;
  //     console.log('getRollcallData 捕捉到已處置的錯誤，阻斷後續資料設定');
  //   }
  // };
  // const getMessageData = async (signal = null) => {
  //   const path = `/message/receiver/${user.id}`;
  //   const res = await apiUtil(path, 'GET', signal);
  //   try {
  //     const res = await apiUtil(path, 'GET', signal);
  //     if (res && res.code === 200) {
  //       setRollcallData(res.data);
  //     } else {
  //       console.warn('點名資料狀態異常:', res);
  //     }
  //   } catch (error) {
  //     if (axios.isCancel(error)) throw error;
  //     console.log('getRollcallData 捕捉到已處置的錯誤，阻斷後續資料設定');
  //   }
  // };
  return (
    <>
      {isLoading ? (
        <OCLoading />
      ) : (
        <div className="oc-dashboard-container">
          <header className="oc-dashboard-header">
            <h1>
              歡迎回來，<span>{user.name}</span> 👋
            </h1>
            <p>以下是您今天的待辦摘要</p>
          </header>

          <section className="oc-remind-grid">
            <div className="oc-card-wrapper urgent">
              <OCRollcallRemind rollcallData={rollcallData} />
            </div>
            <div className="oc-card-wrapper info">
              <OCLessonRemind lessonData={lessonData} />
            </div>
            <div className="oc-card-wrapper success">
              <OCMessageRemind messageData={messageData} />
            </div>
          </section>
        </div>
      )}
    </>
  );
}
export const OCRollcallRemind = (props) => {
  const { rollcallData } = props;
  const navigator = useNavigate();

  const coloums = [
    {
      key: 'courseName',
      render: (record) => {
        return (
          <div>
            <h3>{record.courseName}</h3>
            <Button
              variant="solid"
              icon={<ArrowRightOutlined />}
              style={{ backgroundColor: '#ff7675' }}
              onClick={() =>
                navigator(
                  `/dashboard/course/${record.courseId}/lesson/${record.lessonId}`,
                )
              }
            >
              去點名!
            </Button>
          </div>
        );
      },
    },
    // {
    //   key: 'courseName',
    //   title: '課程名',
    //   dataIndex: 'courseName',
    //   render: (name) => {
    //     return <h3>{name}</h3>;
    //   },
    // },
    {
      key: 'time',
      title: '上課時間',
      render: (record) => {
        return (
          <div>
            <p>{PERIOD_TIME(record.startTime, record.endTime)}</p>
          </div>
        );
      },
    },
  ];

  return (
    <div className="oc-home-rollcall-remind oc-remind">
      <h3>注意! 進行中的點名</h3>
      <Divider />
      {rollcallData && rollcallData.length == 0 ? (
        <div>
          <h4>目前沒有進行中的點名</h4>
        </div>
      ) : (
        <Table
          rowKey={(record) => record.lessonId}
          columns={coloums}
          dataSource={rollcallData}
          size="small"
          showHeader={false}
          pagination={false}
        />
      )}
    </div>
  );
};
export const OCLessonRemind = (props) => {
  const { lessonData } = props;
  const navigator = useNavigate();

  const coloums = [
    {
      key: 'action',
      title: '查看',
      render: (record) => {
        return (
          <Button
            type="primary"
            icon={<ArrowRightOutlined />}
            onClick={() =>
              navigator(
                `/dashboard/course/${record.courseId}/lesson/${record.id}`,
              )
            }
          ></Button>
        );
      },
    },
    {
      key: 'courseName',
      title: '課程名',
      dataIndex: 'courseName',
      render: (name) => {
        return <h3>{name}</h3>;
      },
    },
    {
      key: 'time',
      title: '上課時間',
      render: (record) => {
        return (
          <div>
            <p>{PERIOD_TIME(record.startTime, record.endTime)}</p>
          </div>
        );
      },
    },
  ];

  return (
    <div className="oc-home-lesson-remind oc-remind">
      <h3>今日的課程</h3>
      <Divider />
      {!lessonData || lessonData.length == 0 ? (
        <div>
          <h4>今日沒有編排課程</h4>
        </div>
      ) : (
        <Table
          rowKey={(record) => record.lessonId}
          columns={coloums}
          dataSource={lessonData}
          size="small"
          showHeader={false}
          pagination={false}
        />
      )}
    </div>
  );
};
export const OCMessageRemind = (props) => {
  const { messageData } = props;
  const navigator = useNavigate();

  const coloums = [
    {
      key: 'noted',
      dataIndex: 'noted',
      width: 20,
      render: (noted) => {
        return noted ? null : <span style={{ color: 'yellow' }}>✦</span>;
      },
    },
    {
      key: 'sender',
      title: '寄信人',
      width: 80,
      render: (record) => {
        return (
          <div>
            <h4 style={{ padding: 0, margin: 0 }}>{record.senderName}</h4>
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
      render: (title) => {
        return <h4 style={{ padding: 0, margin: 0 }}>{title}</h4>;
      },
    },
    // {
    //   key: 'createTime',
    //   title: '建立時間',
    //   dataIndex: 'createTime',
    //   width: '8rem',
    //   render: (time) => RELATIVE_TIME(time),
    // },
  ];

  return (
    <div className="oc-home-lesson-remind oc-remind">
      <h3>新的訊息</h3>
      <Divider />
      {!messageData && messageData.length == 0 ? (
        <h4>沒有新的訊息</h4>
      ) : (
        <>
          <Table
            rowKey={(record) => record.lessonId}
            columns={coloums}
            dataSource={messageData.slice(0, 5)}
            showHeader={false}
            pagination={false}
            size="small"
          />
          {messageData.length > 5 && (
            <div>
              <MoreOutlined style={{ fontSize: '2rem', padding: '0.5rem' }} />
            </div>
          )}
          <Button
            style={{ backgroundColor: '#55efc4', color: '#000' }}
            type="primary"
            icon={<MessageOutlined />}
            onClick={() => {
              navigator('/dashboard/message');
            }}
          >
            查看詳情
          </Button>
        </>
      )}
    </div>
  );
};

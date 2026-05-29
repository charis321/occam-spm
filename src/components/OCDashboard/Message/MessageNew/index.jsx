import { Button, Row, Col, Form, Input, Space } from 'antd';
import { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { DoubleRightOutlined, MessageOutlined } from '@ant-design/icons';
import { useAuth } from '@utils/AuthContext';
import { apiUtil } from '../../../../Util/WebApi';
import './index.css';

export default function OCMessageNew(props) {
  const [searchParams] = useSearchParams();
  const receiverFromUrl = searchParams.get('to');
  const { user } = useAuth();
  const [messageForm] = Form.useForm();
  const navigator = useNavigate();
  const [isWaiting, setIsWaiting] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    if (receiverFromUrl) {
      getReceiverData(receiverFromUrl, controller.signal);
    }
    return () => {
      controller.abort();
    };
  }, []);

  const getReceiverData = async (receiverId, signal = null) => {
    const path = `/user/${receiverId}`;
    const res = await apiUtil(path, 'GET', signal);
    if (res?.isSystemError) return;
    if (res?.code === 200) {
      messageForm.setFieldValue('receiver', res.data);
    } else {
      alert('獲取收信人資料失敗');
    }
  };
  const addMessageData = async (data) => {
    setIsWaiting(true);
    const path = '/message';
    const res = await apiUtil(path, 'POST', null, data);
    if (res?.isSystemError) return;
    if (res?.code === 200) {
      alert('訊息發送成功');
      navigator('/dashboard/message');
      // messageForm.resetFields();
    } else {
      alert('訊息發送失敗');
    }
    setIsWaiting(false);
  };
  const handleSubmit = async (values) => {
    const body = {
      senderId: user.id,
      receiverId: receiverFromUrl,
      title: values.title,
      body: values.body,
    };
    console.log('提交的訊息資料', values);
    addMessageData(body);
  };
  return (
    <div className="oc-message-new">
      <section>
        <Form
          className="oc-message-new-main"
          form={messageForm}
          onFinish={handleSubmit}
        >
          <h2>
            <MessageOutlined />
            &nbsp; 發送新訊息
          </h2>
          <div className="oc-message-new-header">
            <Row gutter={8} align="top">
              <Col span={10}>
                <Form.Item
                  name="sender"
                  label="寄信人"
                  initialValue={`自己(${user?.name})` || ''}
                >
                  <Input type="text" disabled placeholder="請輸入寄信人姓名" />
                </Form.Item>
              </Col>
              <Col span={4}>
                <DoubleRightOutlined />
              </Col>
              <Col span={10}>
                <Form.Item name={['receiver', 'name']} label="收信人">
                  <Input type="text" placeholder="請輸入收信人姓名" />
                </Form.Item>
              </Col>
            </Row>
          </div>
          <Form.Item name="title" label="標題">
            <Input type="text" placeholder="請輸入標題" />
          </Form.Item>
          <Form.Item name="body" label="本文">
            <Input.TextArea
              autoSize={{ minRows: 4, maxRows: 6 }}
              placeholder="請輸入本文，字數請在500內"
            />
          </Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={isWaiting}
            disabled={isWaiting}
          >
            發送
          </Button>
        </Form>
      </section>
    </div>
  );
}

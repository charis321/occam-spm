import { Button, Divider } from 'antd';
import { useNavigate } from 'react-router-dom';
import { RollbackOutlined } from '@ant-design/icons';
import { useAuth } from '../../../../Util/AuthContext';

import './index.css';

export default function OCMessageView(props) {
  const { user } = useAuth();
  const { message } = props;
  const navigator = useNavigate();

  return (
    <div className="oc-message-view">
      <div className="oc-message-view-header">
        <div className="oc-message-view-header-block">
          <span className="oc-message-label">寄信人: </span>
          <h3>
            {message.senderName}
            {user?.id == message.senderId && '(自己)'}
          </h3>
        </div>
        <div className="oc-message-view-header-block">
          <span className="oc-message-label">收信人: </span>
          <h3>
            {message.receiverName}
            {user?.id == message.receiverId && '(自己)'}
          </h3>
        </div>
        <Button
          onClick={() => {
            const targetUserId =
              message.senderId == user.id
                ? message.receiverId
                : message.senderId;
            navigator(`/dashboard/message/new?to=${targetUserId}`);
          }}
          icon={<RollbackOutlined />}
        >
          回傳
        </Button>
      </div>
      <div className="oc-message-detail-container">
        <div className="oc-message-section">
          <span className="oc-message-label">標題：</span>
          <h2 className="oc-message-title-text">{message.title}</h2>
        </div>

        <Divider style={{ margin: '12px 0' }} />
        <div className="oc-message-section body-section">
          <div className="oc-message-label" style={{ marginBottom: '8px' }}>
            本文：
          </div>
          <div className="oc-message-body-content">
            <p style={{ whiteSpace: 'pre-wrap', lineHeight: '1.8' }}>
              {message.body}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Form, Alert } from 'antd';
import { apiUtil } from '@utils/WebApi';
export default function OCUserPwdChange(props) {
  const { user } = props;
  const navigator = useNavigate();
  const [newPasswordform, setNewPasswordform] = useState({
    oldPwd: '',
    newPwd: '',
    confirmNewPwd: '',
  });
  const [message, setMessage] = useState('');
  const [isWaiting, setIsWaiting] = useState(false);

  const handleNewPwdChange = (e) => {
    const { name, value } = e.target;
    setNewPasswordform((prev) => ({ ...prev, [name]: value }));
  };
  const handleNewPwdSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    if (!vaildNewPwdform(newPasswordform) || isWaiting) return;

    setIsWaiting(true);
    const path = '/auth/password';
    const body = {
      userId: user.id,
      oldPwd: newPasswordform.oldPwd,
      newPwd: newPasswordform.newPwd,
    };
    const res = await apiUtil(path, 'put', body);
    if (res.code === 200) {
      alert('密碼修改成功，請重新登入');
      navigator('/login');
    } else {
      setMessage(res.message || '密碼修改失敗');
    }
    setNewPasswordform({
      oldPwd: '',
      newPwd: '',
      confirmNewPwd: '',
    });
    setIsWaiting(false);
  };
  const vaildNewPwdform = (pwdform) => {
    if (!pwdform.oldPwd || !pwdform.newPwd || !pwdform.confirmNewPwd) {
      setMessage('請填寫所有欄位');
      return false;
    }
    if (pwdform.newPwd !== pwdform.confirmNewPwd) {
      setMessage('新密碼與確認新密碼不一致');
      return false;
    }
    return true;
  };

  return (
    <div className="oc-user-pwd-change">
      <h2>修改密碼</h2>
      {message && <Alert message={message} type="error" showIcon />}
      <form className="oc-user-pwd-change-form" onSubmit={handleNewPwdSubmit}>
        <div className="form-item">
          <label htmlFor="oldPwd">舊密碼:</label>
          <input
            type="password"
            name="oldPwd"
            id="oldPwd"
            onChange={handleNewPwdChange}
            value={newPasswordform.oldPwd}
          />
        </div>
        <div className="form-item">
          <label htmlFor="newPwd">新密碼:</label>
          <input
            type="password"
            name="newPwd"
            id="newPwd"
            onChange={handleNewPwdChange}
            value={newPasswordform.newPwd}
          />
        </div>
        <div className="form-item">
          <label htmlFor="confirmNewPwd">確認新密碼:</label>
          <input
            type="password"
            name="confirmNewPwd"
            id="confirmNewPwd"
            onChange={handleNewPwdChange}
            value={newPasswordform.confirmNewPwd}
          />
        </div>
        <Button
          type="primary"
          htmlType="submit"
          disabled={isWaiting}
          danger
          loading={isWaiting}
        >
          修改密碼
        </Button>
      </form>
    </div>
  );
}

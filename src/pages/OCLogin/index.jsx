import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button, Input, Alert } from 'antd';
import { MailOutlined, LockOutlined } from '@ant-design/icons';
import { login } from '../../Util/WebApi';
import { useAuth } from '../../Util/AuthContext';
import logoIcon from '@/assets/images/logo_icon.png';
import './index.css';

export default function OCLogin() {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');
  const [isWaiting, setIsWaiting] = useState(false);
  const { user, loginAuth } = useAuth();
  const navigator = useNavigate();

  useEffect(() => {
    // if (user?.id !== -1) {
    //   alert('您已登入過，即將回到首頁!');
    //   navigator('/');
    //   return () => {};
    // }
  }, [username, password]);

  const handleChange = (e) => {
    switch (e.target.name) {
      case 'username':
        setUsername(e.target.value);
        break;
      case 'password':
        setPassword(e.target.value);
        break;
      case 'email':
        setEmail(e.target.value);
        break;
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isWaiting) return;
    setMsg('');
    setIsWaiting(true);

    const res = await login({
      name: username,
      email: email,
      password: password,
    });
    setIsWaiting(false);

    if (res?.code === 200) {
      console.log('登入成功', res);
      loginAuth({
        user: {
          id: res.data.id,
          name: res.data.name,
          role: res.data.role,
          sex: res.data.sex,
          avatar: res.data.avatar,
        },
        token: res.data.token,
      });
      // alert('登入成功，將導向至首頁');
      navigator('/');
    } else {
      console.log('登入失敗', res);
      if (res?.code === 'ERR_NETWORK') {
        setMsg('伺服器無回應，請稍後再試');
      } else {
        setMsg(res.msg || '登入失敗，請檢查帳號或密碼是否正確');
      }
    }
  };

  return (
    <div className="oc-login-page">
      <div className="oc-welcome-panel">
        <div className="oc-welcome-circles">
          <div className="oc-circle oc-circle-1"></div>
          <div className="oc-circle oc-circle-2"></div>
          <div className="oc-circle oc-circle-3"></div>
        </div>
        <div className="oc-welcome-content">
          <div className="oc-welcome-logo">
            <img src={logoIcon} alt="Occam Logo" />
          </div>
          <h1>奧坎課程點名管理系統</h1>
          <p>智慧教學與課程管理平台，為您提供無縫流暢的教學與出勤管理體驗。</p>
        </div>
      </div>
      <div className="oc-login-panel">
        <div className="oc-login-card">
          <div className="oc-login-header">
            <h2>歡迎回來</h2>
            <p>請輸入您的帳號密碼以登入系統</p>
          </div>
          <form className="oc-login-form" onSubmit={handleSubmit}>
            <div className="oc-login-form-item">
              <label htmlFor="email">Email</label>
              <Input
                type="email"
                id="email"
                name="email"
                placeholder="請輸入 Email"
                prefix={<MailOutlined className="site-form-item-icon" />}
                onChange={handleChange}
                required
              />
            </div>

            <div className="oc-login-form-item">
              <label htmlFor="password">密碼</label>
              <Input.Password
                id="password"
                name="password"
                placeholder="請輸入密碼"
                prefix={<LockOutlined className="site-form-item-icon" />}
                onChange={handleChange}
                required
              />
            </div>

            {msg && (
              <Alert
                message={msg}
                type="error"
                showIcon
                className="oc-system-msg"
              />
            )}

            <Button
              type="primary"
              htmlType="submit"
              className="oc-login-submit-btn"
              disabled={isWaiting}
              loading={isWaiting}
            >
              登入
            </Button>
          </form>

          <div className="oc-login-info-box">
            <div className="oc-login-info-title">
              <span className="emoji">💡</span>
              <span>預設登入提醒</span>
            </div>
            <p className="oc-login-info-desc">
              系統預設密碼為您的「學號」。為了您的帳號安全，請在首次登入成功後，儘速前往「個人中心」修改您的密碼。
            </p>
          </div>

          <div className="oc-login-footer">
            <Link to="/reset-password">忘記密碼？</Link>
            {/* <span className="oc-register-prompt">
              尚未註冊？ <Link to="/register">建立帳號</Link>
            </span> */}
          </div>
        </div>
      </div>
    </div>
  );
}

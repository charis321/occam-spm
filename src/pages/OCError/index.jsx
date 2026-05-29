import { Button, Space, Image } from 'antd';
import { RedoOutlined, HomeFilled } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

import ERROR_404 from '@/assets/images/error_404_600.jpg';
import ERROR_500 from '@/assets/images/error_500_600.jpg';
import './index.css';

export default function OCError(props) {
  const { code, message, bg } = props;
  const navigator = useNavigate();
  return (
    <article className="oc-error-page">
      <main className="oc-error-content">
        <h1>{code}</h1>
        <p>{message}</p>
        <Image src={bg} preview={false} />

        <nav className="oc-error-actions" aria-label="錯誤頁面導航">
          <Space size="middle">
            <Button
              type="primary"
              icon={<RedoOutlined />}
              onClick={() => {
                navigator(-1);
              }}
            >
              重新整理
            </Button>
            <Button
              type="primary"
              icon={<HomeFilled />}
              onClick={() => {
                navigator('/');
              }}
            >
              回到首頁
            </Button>
          </Space>
        </nav>
      </main>
    </article>
  );
}
export function OC403() {
  return <OCError code="403 Forbidden" message="您沒有權限訪問此頁面" />;
}

export function OC404() {
  return (
    <OCError code="404 Not Found" message="您訪問的頁面不存在" bg={ERROR_404} />
  );
}
export function OC500() {
  return (
    <OCError
      code="500 Internal Server Error"
      message="伺服器發生錯誤，請稍後再試"
      bg={ERROR_500}
    />
  );
}

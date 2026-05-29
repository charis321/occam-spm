import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import '@ant-design/v5-patch-for-react-19';
import { ConfigProvider, App, Breadcrumb } from 'antd';
import zhTW from 'antd/locale/zh_TW';
import AuthContextProvider from './Util/AuthContext.jsx';

import OCApp from './App.jsx';
import './index.css';

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('./service_worker.js')
      .then((reg) => console.log('PWA Service Worker 註冊成功！', reg.scope))
      .catch((err) => console.log('Service Worker 註冊失敗：', err));
  });
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ConfigProvider
      theme={{
        components: {
          Calendar: {
            // fullBg: 'rgba(189,227,195, 0.3)',
            fullPanelBg: 'rgba(189,227,195, 0.3)',
          },
        },
      }}
      locale={zhTW}
    >
      <App>
        <HashRouter>
          {/* <PathContextProvider> */}
          <AuthContextProvider>
            <OCApp />
          </AuthContextProvider>
          {/* </PathContextProvider> */}
        </HashRouter>
      </App>
    </ConfigProvider>
  </StrictMode>,
);

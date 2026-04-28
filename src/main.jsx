import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import '@ant-design/v5-patch-for-react-19';
import { ConfigProvider, App } from 'antd';
import zhTW from 'antd/locale/zh_TW';
import AuthContextProvider from './Util/AuthContext.jsx';

import OCApp from './App.jsx';
import './index.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ConfigProvider locale={zhTW}>
      <App>
        <HashRouter>
          <AuthContextProvider>
            <OCApp />
          </AuthContextProvider>
        </HashRouter>
      </App>
    </ConfigProvider>
  </StrictMode>,
);

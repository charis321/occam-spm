import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import '@ant-design/v5-patch-for-react-19';
import './index.css'
import App from './App.jsx'
import AuthContextProvider from './Util/AuthContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HashRouter>
      <AuthContextProvider> 
        <App />
      </AuthContextProvider>
    </HashRouter>
  </StrictMode>,
)

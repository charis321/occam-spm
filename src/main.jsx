import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import '@ant-design/v5-patch-for-react-19';
import './index.css'
import App from './App.jsx'
import AuthContextProvider from './Util/AuthContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthContextProvider> 
        <App />
      </AuthContextProvider>
    </BrowserRouter>
  </StrictMode>,
)

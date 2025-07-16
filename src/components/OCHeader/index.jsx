import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Tag, Button } from 'antd'
import { ArrowLeftOutlined, SettingOutlined } from '@ant-design/icons'
import { useAuth } from '../../Util/AuthContext'
import './index.css'
import OCBreadcrumb from '../OCCommon/OCBreadcrumb'

export default function OCHeader(props) {
  const [ isOpen, setOpen ] = useState(false)
  const { user, logoutAuth } = useAuth()
  const navigate = useNavigate()

  useEffect(()=>{
    if(!user){
      navigate("/login")
    }
    console.log('user:', user)
  },[user])
  
  const roleMap = {
    0: {
        title:'學生',
        color: 'blue',
    },
    1: {
        title:'教師',
        color: 'green',
    },
    2: {
        title: '管理員',
        color: 'red',
    }
  }
  const handleToggleMenu = () => {
    setOpen(isOpen=>!isOpen)
  }
  const handleLogout = ()=>{
    logoutAuth()
    alert('登出成功，將導向登入頁面')
    navigate("/login")
  }
  const handleReturnPreviousPage = () => {
    navigate(-1)
  }


  return (
    <div className='oc-header'>
      <Button className='oc-previous-page-btn' 
              variant='dashed' 
              color='cyan'
              onClick={handleReturnPreviousPage}><ArrowLeftOutlined />回上頁</Button>

      <OCBreadcrumb/>
      {
        !user?
        <h2>未登入</h2>
        :
        <div className='oc-user-menu'>
          <p>
            歡迎，{user.name}&nbsp;
            <Tag color={roleMap[user.role].color}>{roleMap[user.role].title}</Tag>
          </p>
          <button className='oc-user-menu-btn' onClick={handleToggleMenu}>
            <SettingOutlined />
          </button>
          <ul className='oc-user-menu-list' style={{display: isOpen ? 'block' : 'none'}}>
            <Link to="/user/edit"><li>個人資料</li></Link>
            <li onClick={handleLogout}>登出</li>
          </ul>
        </div>
      }
    </div>
  )
}
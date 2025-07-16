import { useState, useEffect } from 'react'
import OCLoading from '../../OCCommon/OCLoading'
import { useAuth } from '../../../Util/AuthContext'
import { apiUtil } from '../../../Util/WebApi'
import './index.css'

export default function OCUserCenterDashboard(props){
    const { user } = useAuth()
    const [ userInfo, setUserInfo ] = useState({})
    const [ isLoading, setIsLoading ] = useState(false)
    useEffect(()=>{
      if(user){
        setIsLoading(true)
        getUserInfo()
      }
    },[])
    useEffect(()=>{
      console.log(userInfo)
    },[userInfo])

    const getUserInfo = async () => {
      const path = `/user/${user.id}`
      const res = await apiUtil(path, "GET")
      if(res.code === 200){
        setUserInfo(res.data)
      }
      setIsLoading(false)
    }

    return (
      <> 
        
        {
          isLoading ?
          <OCLoading/>
          :
          <div className="oc-user-center-dashboard"> 
            <div className='oc-user-info-card'>
              <h2>個人中心</h2>  
              <div className='oc-user-info-header'>
                <div className='oc-user-avatar'></div>
                <h3>{userInfo.name}</h3>
              </div>
              <ul className='oc-user-info-list'>
                <h2>基本資料: </h2>
                <li>系統編號: {userInfo.id}</li>
                
                <li>所屬學校: {userInfo.school}</li>
                <li>所屬學系: {userInfo.department}</li>
                <li>職位: {userInfo.jobTitle}</li>
                <li>電子信箱: {userInfo.email}</li>
                <li>身分: {userInfo.role}</li>
                <li>用戶狀態: {userInfo.status}</li>
                <li>性別: {userInfo.sex}</li>
                
              </ul>
            </div>
          </div>
        }
      </>
    )
}
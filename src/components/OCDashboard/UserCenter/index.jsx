import { useState, useEffect } from 'react'
import { Button, Form } from 'antd'

import { useAuth } from '@utils/AuthContext'
import { apiUtil } from '@utils/WebApi'


import OCUserInfoCard from '../User/UserInfoCard'
import OCLoading from '../../OCCommon/OCLoading'
import './index.css'
import OCUserPwdChange from './UserPwdChange'
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
            <h2>個人中心</h2>  
            <section className='oc-user-info-card'>
              <div className='oc-user-info-header'>
                <div className='oc-user-avatar'></div>
                <div>
                  <h3>{userInfo.name}</h3>
                  <p>系統編號: {userInfo.id}</p>
                </div>
              </div>
              <OCUserInfoCard userInfo={userInfo}/>
            </section>
            <section>
              <OCUserPwdChange user={user}/>
            </section>
          </div>
        }
      </>
    )
}
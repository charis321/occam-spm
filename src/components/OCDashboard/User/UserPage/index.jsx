import { useParams } from "react-router-dom";
import { useState, useEffect } from 'react'
import { apiUtil } from '../../../../Util/WebApi'
import './index.css'
import { Select } from "antd";


export default function OCUserPage(props){
    const { userId } = useParams();
    const [ userInfo, setUserInfo ] = useState({})
    const [ isLoading, setIsLoading ] = useState(false)

    useEffect(()=>{
        getUserInfo()
    },[])

    useEffect(()=>{
      console.log(userInfo)
    },[userInfo])

    const getUserInfo = async () => {
      setIsLoading(true)
      const path = `/user/${userId}`
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
          <h1>Loading . . . </h1>
          :
          <div className="oc-user-page">
            <div className='oc-user-info-card'>
              <h2>用戶資訊</h2>  
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
              <div className='oc-user-info-list'>
                <h2>聯絡資訊: </h2>
                <li>電話: userInfo.phone</li>
                <li>地址: userInfo.address</li>
              </div>
              <ul className='oc-user-info-list'>
                <h2>聯絡資訊: </h2>
                <li>電話: userInfo.phone</li>
                <li>地址: userInfo.address</li>
              </ul>
            </div>
            <div className="oc-user-action">
              <h2>用戶操作</h2>
              <div className='oc-user-action-list'>
                <h3>改變用戶權限</h3>
                <Select id="user-role"  name="user-role" style={{ width: 120 }} 
                                        options={[
                                          { value: 0, label: '學生' },
                                          { value: 1, label: '教師' },
                                          { value: 2, label: '管理員' },
                                        ]}
                                        defaultValue={userInfo.role}/>
              </div>
              <div className='oc-user-action-list'>
                <h3>改變用戶基本資料</h3>
              </div>
            </div>
          </div>
         
        }
      </>
    )
}
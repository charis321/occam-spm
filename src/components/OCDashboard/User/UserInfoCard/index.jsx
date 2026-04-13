import { USER_STATUS_INDEX, USER_ROLE_INDEX, USER_SEX_INDEX } from '@config/config'
import './index.css'

export default function OCUserInfoCard(props) {
  const { userInfo } = props

  return (
    <div className='oc-user-info-card'>
        <ul className='oc-user-info-list'>
            <h2>基本資料: </h2>
            <li>性別: <span>{USER_SEX_INDEX[userInfo.sex]}</span></li>
            <li>身分: <span>{USER_ROLE_INDEX[userInfo.role]}</span></li>
            <li>所屬學校:<input type="text" value={userInfo.school || ""} readOnly /> </li>
            <li>所屬學系:<input type="text" value={userInfo.department || ""} readOnly /> </li>
            <li>職位:<input type="text" value={userInfo.jobTitle || ""} readOnly /> </li>
            <li>電子信箱:<input type="text" value={userInfo.email || ""} readOnly /> </li>
            
        </ul>
        <ul className='oc-user-info-list'>
            <h2>用戶資料: </h2>
            <li>系統編號:{userInfo.id} </li>
            <li>身分: {USER_ROLE_INDEX[userInfo.role]}</li>
            <li>用戶狀態: {USER_STATUS_INDEX[userInfo.status]}</li>
            <li>創建時間: {  new Date(userInfo.createTime).toLocaleString()}</li>
            <li>更新時間: {  new Date(userInfo.updateTime).toLocaleString()}</li>
        </ul>
    </div>
  )
}
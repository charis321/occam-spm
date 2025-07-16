import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import { Table, Tag, Button, Tooltip, Input, Select} from 'antd'
import { PlusCircleOutlined, SearchOutlined, 
         EditOutlined, DeleteOutlined, StopOutlined, CheckCircleOutlined } from '@ant-design/icons'
import { nanoid } from 'nanoid'

import { apiUtil } from '../../../Util/WebApi'
import { useAuth } from '../../../Util/AuthContext'
import { useConfirm } from '../../../Util/hooks/useConfirm'

import { USER_STATUS } from '../../../config/user'
import './index.css'



export default function OCUserDashboard(props){
  const { user } = useAuth()
  const navigator = useNavigate()
  const [ showConfirm, confirmElement ] = useConfirm()
  const [ userData, setUserData ] = useState([])
  const [ userFilter, setUserFilter] =useState({})
  const [ isUserAdding, setIsUserAdding ] = useState(false)
  const [ isLoading, setIsLoading ] = useState(false)
  
  useEffect(()=>{
    if(user.role !== 2){
      alert("您沒有權限訪問此頁面，即將返回首頁")
      navigator('/dashboard')
    }
    getUserData()
  },[])

  const columns = [
    { 
      key: "id",
      title: 'ID',
      dataIndex : 'id',
      width: '10%',
    },
    { 
      key: "name",
      title: '用戶名',
      dataIndex : 'name',
      
    },
    {
      key: "role",
      title: '身分',
      dataIndex : 'role',
      render: (role)=>{
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
        const {title , color} = roleMap[role]
        return <Tag color={color}>{title}</Tag>
      }
    },
    {
      key: "email",
      title: '電子郵件',
      dataIndex: 'email',
    },
    { 
      key: "vaild",
      title: '已認證身分?',
      dataIndex : 'isVaild',
      render: (vaild)=>{
        if(vaild==null){
          return <Tag color="black">NAN</Tag>
        }
        if(vaild){
          return <Tag color="green">已認證</Tag> 
        }else{
          return <Tag color="red">未認證</Tag> 
        }
      }
    },
    { 
      key: "createTime",
      title: '創建時間',
      dataIndex : 'createTime',
    },
      { 
      key: "status",
      title: '用戶狀態',
      dataIndex : 'status',
      render: (status)=>{
        const {title, color} = USER_STATUS[status]
        return <Tag color={color}>{title}</Tag>
      }
    },

    {
      key: "action",
      title: '操作',
      render: (text, record)=>{
        return  <div className='oc-flex' style={{minWidth: '150px'}}>
                  <Tooltip title="查看用戶">
                    <Button type="primary" shape="circle" icon={<SearchOutlined/>} 
                            onClick={handleUserAction("check", record)}/>
                  </Tooltip>
                  <Tooltip title="編輯用戶">
                    <Button type='primary' shape="circle" icon={<EditOutlined/>} 
                            onClick={handleUserAction("edit", record)}/>
                  </Tooltip>
                  <Tooltip title={record.status == 1?"啟用用戶":"停用用戶"}>
                    {
                      record.status === 1 ?
                      <Button variant="solid" shape="circle" color="cyan" icon={<CheckCircleOutlined />} 
                              onClick={handleUserAction("activate", record)}/>
                      :
                      <Button type='primary' shape="circle" danger icon={<StopOutlined />} 
                              onClick={handleUserAction("activate", record)}/>
                    }
                  </Tooltip>
                  <Tooltip title="刪除用戶">
                    <Button type='primary' shape="circle" danger icon={<DeleteOutlined/>} 
                            onClick={handleUserAction("delete", record)}/>
                  </Tooltip>
                </div>
      }
    }
  ]
  const getUserData = async()=>{
    const path = "/user/list"
    const res = await apiUtil(path, "GET")
    if(res.code===200){
      const userList = res.data
      console.log(res.data,"getUserData")
      const curr_user_idx = userList.findIndex( u => u.id == user.id)
      if(curr_user_idx!=-1){
        const curr_user = userList.splice(curr_user_idx, 1)[0]
        userList.unshift(curr_user)       
      }
      setUserData(userList)
    }
  }
  const changeUser = async(userId, patch)=>{
    const path = `/user/${userId}`
    const res = await apiUtil(path, "PATCH", patch)
    if(res.code===200){
      console.log(res.data,"changeUser")
      alert("用戶更新成功")
      getUserData()
    }
  }
  const handleAddUser = ()=>{ setIsUserAdding(true)}
  const handleUserAction = (action, user) => {
    let content;
    return (e)=>{
      switch(action){
        case "check":
          navigator('/dashboard/user/' + user.id)
          break;
        case "edit":
          navigator('/dashboard/user/' + user.id + '/edit')
          break;
        case "activate":
          if(user.status === 1){
            const user_patch = {
                status: 0 // 啟用用戶
              }
            changeUser(user.id, user_patch)
            break;
          }else{
            content = 
                      <>
                        <span style={{color:"red"}}>警告! 停用用戶後，該用戶將無法登入系統。</span>
                        請問確定要停用用戶嗎?
                      </>

            showConfirm( 
              content, 
              ()=>{
                const user_patch = {
                  status: 1 // 停用用戶
                }
                console.log("停用用戶", user_patch)
                changeUser(user.id, user_patch)
              },
              ()=>{}
            )
            break;
          }
         
        case "delete":
          content = 
          <>
            <span style={{color:"red"}}>警告! 用戶一旦刪除即無法回撤<br/>如果只是暫時停止用戶活動，請使用停用功能。</span>
            請問確定要刪除用戶嗎?
          </>
          showConfirm( content , ()=>{}, ()=>{})
          break;
      }
    }
  }
  return (
    <>
      <div className='oc-page-title'>
        <h3>用戶管理</h3>
      </div>
      <div className="oc-user-controller">
        <Button type='primary' onClick={handleAddUser}><PlusCircleOutlined/>新增用戶</Button>
        <Button type='primary' variant='solid' color='purple' onClick={handleAddUser}><PlusCircleOutlined/>批量新增用戶</Button>
      </div>
      <div className='oc-user-search'>
        <label>用戶id:</label>
        <Input type="text" placeholder='輸入id' style={{ width: 120 }}/>
        <label>E mail:</label>
        <Input type="email" placeholder='輸入email' style={{ width: 120 }}/>
        <label>用戶身分:</label>
        <Select defaultValue="用戶身分"
                style={{ width: 120 }}
                options={[
                  { value: '-1', label: '無指定' },
                  { value: '0' , label: '學生' },
                  { value: '1' , label: '教師' },
                  { value: '2' , label: '管理員' },
                ]}
        />
        <label>用戶狀態:</label>
        <Select defaultValue="已停用?"
                style={{ width: 120 }}
                options={[
                  { value: 0, label: '是' },
                  { value: 1,  label: '否' },
                  { value: 2,  label: '全部' },
                ]}
        />
        <Button type="primary" icon={<SearchOutlined/>}>查詢</Button>
      </div>
      
      <Table  className='oc-user-table'
              dataSource={userData} 
              columns={columns} 
              scroll={{ x: "80%"}}
              pagination={{pageSize: 5}}
              rowKey={record => record.id}
              rowHoverable={false}
              rowClassName={(record, index) => index === 0 ? 'curr-user-row':null}></Table>
      
      {
        isUserAdding ?
        <OCUserNewBlock closeBlock={()=>setIsUserAdding(false)}/> : null
      }
      {confirmElement}
    </>
  )
}

export function OCUserNewBlock(props){
  const { closeBlock } = props 
  return (
    <div className='oc-user-new-block'>
      <form className='oc-user-new-form'>
        <h2>新增用戶</h2>
        <div className='oc-user-new-form-item'>
          <label htmlFor='name'>用戶名</label>
          <input type='text' id='name' name='name' placeholder='請輸入用戶名'/>
        </div>
        <div className="oc-user-new-form-item">
          <label htmlFor='default-password'>默認密碼形式</label>
          <Select id="default-password" name="default-password" style={{ width: 120 }} 
                  options={[
                    { value: '0', label: '自動' },
                    { value: '1', label: '手動' },
                  ]}/>
        </div>
        <div className='oc-user-new-form-item'>
          <label htmlFor='email'>電子郵件</label>
          <input type='email' id='email' name='email' placeholder='請輸入電子郵件'/>
        </div>
        <div className='oc-user-new-form-item'>
          <label htmlFor='role'>身分</label>
          <Select id="role" name="role" style={{ width: 120 }} 
                  options={[
                    { value: '0', label: '學生' },
                    { value: '1', label: '教師' },
                    { value: '2', label: '管理員' },
                  ]}/>
        </div>
        <Button type="primary">確認新增</Button>
        <button className="close-btn" onClick={closeBlock}>X</button>
      </form>
    </div>
  )
}
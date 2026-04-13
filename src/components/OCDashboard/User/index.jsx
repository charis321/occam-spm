import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import { Table, Tag, Button, Tooltip, Input, Select} from 'antd'
import { PlusCircleOutlined, SearchOutlined, 
         EditOutlined, DeleteOutlined, StopOutlined, CheckCircleOutlined } from '@ant-design/icons'



import { apiUtil } from '../../../Util/WebApi'
import { useAuth } from '../../../Util/AuthContext'
import { useConfirm } from '../../../Util/hooks/useConfirm'

import OCLoading from '@components/OCCommon/OCLoading'
import { USER_STATUS } from '../../../config/user'
import { ROLE_INDEX } from '../../../config/role'
import * as XLSX from "xlsx";
import './index.css'
import OCUserSearch from './UserSearch'



export default function OCUserDashboard(props){
  const { user } = useAuth()
  const navigator = useNavigate()
  const [ showConfirm, confirmElement ] = useConfirm()
  const [ userData, setUserData ] = useState([])
  const [ isUserAdding, setIsUserAdding ] = useState(false)
  const [ isUserBatchAdding, setIsUserBatchAdding ] = useState(false)
  const [ isLoading, setIsLoading ] = useState(false)
  
  useEffect(()=>{
    if(user.role !== 2){
      alert("您沒有權限訪問此頁面，即將返回首頁")
      navigator('/dashboard')
    }
    getUserData()
  },[])

  const columns_user_action = [
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
    // {
    //   key: "email",
    //   title: '電子郵件',
    //   dataIndex: 'email',
    // },
    {
      key: "school",
      title: '學校',
      dataIndex: 'school',
    },
    {
      key: "department",
      title: '學系',
      dataIndex: 'department',
    },
    { 
      key: "createTime",
      title: '創建時間',
      dataIndex : 'createTime',
      render: (createTime)=>{
        const date = new Date(createTime)
        return date.toLocaleString()
      },
      sorter: (a, b) => new Date(a.createTime) - new Date(b.createTime),
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

  const getUserData = async(filter)=>{
    setIsLoading(true)
    const path = "/user"
    const res = await apiUtil(path, "GET", filter)

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
    setIsLoading(false)
  }
  const changeUserData = async(userId, patch)=>{
    const path = `/user/${userId}`
    const res = await apiUtil(path, "PATCH", patch)
    if(res.code===200){
      console.log(res.data,"changeUser")
      alert("用戶更新成功")
      getUserData()
    }
  }
  const deleteUserData = async(userId)=>{
    const path = `/user/${userId}`
    const res = await apiUtil(path, "DELETE")
    if(res.code===200){
      console.log(res.data,"User")
      alert("用戶刪除成功")
      getUserData()
    }
  }

  const handleAddUser = ()=>{ setIsUserAdding(true)}
  const handleAddUserBatch = ()=>{ setIsUserBatchAdding(true)}
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
            const content = 
              <>
                <span style={{color:"red"}}>警告! 停用用戶後，該用戶將無法登入系統。</span>
                請問確定要停用用戶嗎?
              </>

            showConfirm( 
              content, 
              ()=>{
                const user_patch = {
                  status: 1 
                }
                console.log("停用用戶", user_patch)
                changeUserData(user.id, user_patch)
              },
              ()=>{}
            )
            break;
          }
         
        case "delete":
          const content = 
            <>
              <span style={{color:"red"}}>警告! 用戶一旦刪除即無法回撤<br/>如果只是暫時停止用戶活動，請使用停用功能。</span>
              請問確定要刪除用戶嗎?
            </>
          showConfirm( 
            content,
             ()=>{

             },
             ()=>{})
          break;
      }
    }
  }

  const changeUserFilter = (filter) => {
    getUserData(filter)
  }
  return (
    <div className='oc-user-dashboard'>
      <div className='oc-page-title'>
        <h3>用戶管理</h3>
      </div>
      <div className="oc-user-controller">
        <Button type='primary' onClick={handleAddUser}><PlusCircleOutlined/>新增用戶</Button>
        <Button type='primary' variant='solid' color='purple' onClick={handleAddUserBatch}><PlusCircleOutlined/>批量新增用戶</Button>
      </div>
      <OCUserSearch changeUserFilter={changeUserFilter} />
      {
        isLoading?
        <OCLoading/>
        :
        <Table  className='oc-user-table'
                dataSource={userData} 
                columns={columns_user_action} 
                scroll={{ x: "80%"}}
                expandable={{
                  expandedRowRender: (record) =>
                  <> 
                    <p style={{ margin: 0 }}>用戶id: {record.id}</p>
                    <p style={{ margin: 0 }}>E mail: {record.email}</p>
                  </>
                }}
                rowKey={record => record.id}
                rowHoverable={false}
                rowClassName={(record, index) => record.id === user.id ? 'curr-user-row':null}></Table>
      }
      
      {
        isUserAdding ?
        <OCUserNewBlock closeBlock={()=>setIsUserAdding(false)}/> : null
      }
      {
        isUserBatchAdding ?
        <OCUserNewBatchBlock closeBlock={()=>setIsUserBatchAdding(false)} resetUserData={getUserData}/> : null
        
      }
      {confirmElement}
    </div>
  )
}

export function OCUserNewBlock(props){
  const { closeBlock, resetUserData } = props 
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

export function OCUserNewBatchBlock(props){
  const { closeBlock, resetUserData } = props
  const [ newUserData, setNewUserData ] = useState([])
  const [ newUserFile, setNewUserFile ] = useState(null)

  const columns_user = [
    {
        key: "name",
        title: "姓名",
        dataIndex: "name",
    },
    {
        key: "email",
        title: "電子信箱", 
        dataIndex: "email",
    },
    {
        key: "role",
        title: "身分",
        dataIndex: "role",
        render: (role)=>{
          const {title, color} = ROLE_INDEX[role]
          return <Tag color={color}>{title}</Tag>
        }
    },
    {
        key: "school", 
        title: "學校",
        dataIndex: "school",
    },
    {
        key: "department",
        title: "學系",
        dataIndex: "department",      
    },
    {
        key: "no",
        title: "學號",
        dataIndex: "no",
    },
    {
        key: "sex",
        title: "性別",
        dataIndex: "sex",
        render: (sex)=>{
          const SEX_INDEX = [
            {title: "其他", color: "gray"},
            {title: "男", color: "blue"},
            {title: "女", color: "pink"},
          ]
          const {title, color} = SEX_INDEX[sex] 
          return <Tag color={color}>{title}</Tag>
        }
    } 
 ]
  const handleFileChange = (e) => {
      const file = e.target.files[0]
      const reader = new FileReader()
      let jsonData = []
      reader.onload = (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });
    
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        jsonData = XLSX.utils.sheet_to_json(worksheet);
        
        console.log("Excel 內容：", jsonData);
        jsonData = jsonData.map((item) => {
          return {
            key: item["__EMPTY"],
            school: item["school"].trim(),
            department: item["department"].trim(),
            no:  String(item["no"]).trim(),
            sex: item["sex"],
            name: item["name"].trim(),
            email: item["email"].trim(),
            role: item["role"],
          };
        })
        setNewUserData(jsonData)
      };
      if(file){
        reader.readAsArrayBuffer(file);
        setNewUserFile(file)
      }
    }
  const handleSubmit = async(e) => {    
    e.preventDefault()
    console.log("提交批量新增用戶", newUserData);
    if(newUserData.length === 0){
      return alert("請先上傳檔案")
    }
    const path = `/auth/registerBatch`
    const res =  await apiUtil(path, "POST", newUserData)
    if(res.code === 200){
      alert("批量新增用戶成功")
      closeBlock()
      resetUserData()
    }
  }
  return(
    <div className="oc-user-new-batch-block">     
      <div className='oc-user-new-batch-form'>
        <form>
          <input type="file" name="excelFile" accept=".xlsx,.xls" onChange={handleFileChange}></input>
          <Button onClick={handleSubmit}>上傳</Button>
        </form>
        <Table  className='oc-user-new-table'
                dataSource={newUserData} 
                columns={columns_user} 
                scroll={{ x: "100%"}}
                pagination={{pageSize: 5}}
                rowKey={record => record.id}></Table> 
        </div>       
      <button className="close-btn" onClick={closeBlock}>X</button> 
    </div>
  )
}

{/* <div className="oc-user-new-batch-block" style={{"display": isUserBatchAdding?"flex":"none"}}>            
        <form>
          <input type="file" name="excelFile" accept=".xlsx,.xls" onChange={handleFileChange}></input>
          <Button onClick={handleAddUserBatchSubmit}>上傳</Button>
        </form>   
        <Table  className='oc-user-new-table'
                dataSource={userNewData} 
                columns={columns_user} 
                scroll={{ x: "80%"}}
                pagination={{pageSize: 5}}
                rowKey={record => record.id}></Table>    
        <button className="close-btn" onClick={closeBlock}>X</button>
      </div> */}
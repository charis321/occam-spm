import { Table, Tag, Button, Tooltip} from 'antd'
// import { USER_STATUS } from '../../../config/user'

export default function OCUserTable(props){
  const { data , isActionable, pageSize=5 } = props     

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
  return(
    <Table  className='oc-user-table'
            dataSource={userData} 
            columns={columns_user_action} 
            scroll={{ x: "80%"}}
            pagination={{pageSize: 50}}
            expandable={{
              expandedRowRender: (record) => <p style={{ margin: 0 }}>{record.id}</p>
            }}
            rowKey={record => record.id}
            rowHoverable={false}
            rowClassName={(record, index) => record.id === user.id ? 'curr-user-row':null}></Table>
    // <Table  className='oc-user-table'
    //             dataSource={userData} 
    //             columns={columns} 
    //             scroll={{ x: "80%"}}
    //             pagination={{pageSize: 5}}
    //             rowKey={record => record.id}
    //             rowHoverable={false}
    //             rowClassName={(record, index) => index === 0 ? 'curr-user-row':null}></Table>
  )
}
export const columns_user = [
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
    } 
]
export const columns_user_action = [
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
      render: (createTime)=>{
        const date = new Date(createTime)
        return date.toLocaleString()
      }
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
import { Table ,Tag ,Button } from 'antd'
import { testStudent } from '../../../test/testData'
import { nanoid } from 'nanoid'

export default function OCStudentDashboard(props){
    const data = testStudent
    const columns = [
      { 
        key: "id",
        title: 'ID',
        dataIndex : 'id',
        width: '10%',
      },
      { 
        key: "name",
        title: '姓名',
        dataIndex : 'name',
       
      },
      {
        key: "role",
        title: '角色',
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
        key: "info",
        title: '用戶資訊',
        dataIndex: 'info',
        render: ()=>{
          return <Button type='primary'>查看用戶資訊</Button>
        }
      },
      {
        key: "action",
        title: '操作',
        dataIndex: 'action',
        render: ()=>{
          return  <div className='oc-flex'>
                    <Button type='primary'>編輯用戶身分</Button>
                    <Button danger>刪除用戶</Button>
                  </div>
        }
      }
    ]
    return (
      <>
        <h3>學生管理</h3>
        <Table  className='oc-user-table'
                  dataSource={data} 
                  columns={columns} 
                  scroll={{ x: "80%"}}
                  pagination={{pageSize: 5}}
                  rowKey={record => record.id}></Table>
      </>
    )
}
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Table, Tag, Select, Input } from 'antd'
import { PlusCircleOutlined, SearchOutlined } from '@ant-design/icons'

import OCLoading from '../../OCCommon/OCLoading'

import { apiUtil } from '../../../Util/WebApi'
import { useAuth } from '../../../Util/AuthContext'
import { WEEKDAY } from '../../../config/time'
import { testCourseList } from '../../../test/testData'
import { nanoid } from 'nanoid'
import './index.css'


export default function OCCourseDashboard(props){

    const [ courseData , setCourseData] = useState([]) 
    const [ isLoading , setIsLoading ] = useState(false)
    const { user } = useAuth()
    const navigate = useNavigate()
    const ROLE_NAME = ["student", "teacher", "admin"]

    useEffect(()=>{
      getCourseList()
    },[])

    const columns = [
      { 
        key: "name",
        title: '課程標題',
        dataIndex : 'name',
      },
      { 
        key: "school",
        title: '開課學校',
        dataIndex : 'school',
       
      },
      { 
        key: "department",
        title: '開課系所',
        dataIndex : 'department',
       
      },
      { 
        key: "teacherName",
        title: '負責教師',
        dataIndex : 'teacherName',
      },
      { 
        key: "classroom",
        title: '教室',
        dataIndex : 'classroom',
      },
      { 
        key: "scheduleWeek",
        title: '上課日',
        dataIndex : 'scheduleWeek',
        render: (weekIdx)=>{
          return(
            <>{WEEKDAY[weekIdx].label}</>
          )
        }
      },
      { 
        key: "scheduleTime",
        title: '上課時間',
        dataIndex : 'scheduleTime',
        render: (timeObj)=>{
          let time = "";
          if(Array.isArray(timeObj)){
            time = `${timeObj[0].slice(0,-3)} ~ ${timeObj[1].slice(0,-3)}`
          }
          return( 
            <>{time}</>
          )
        }
      },
      { 
        key: "student_court",
        title: '應到人數',
        dataIndex : 'studentCount',
      },
      {
        key: "course_info",
        title: '詳細資訊',

        render: (item)=>{
          return( 
            <>
              <Button type='primary' onClick={handleEditCourse(item.id)}>查看課程</Button>
            </>
          )
        }
      },
    ]
    const getCourseList = async()=>{
      setIsLoading(true)
      const res = await apiUtil(`/course/list/${user.id}`,"get")
      setIsLoading(false)
      
      if(res.code===200){
        const courseData = res.data.map(item=>{
          return{
            ...item,
            scheduleTime: [item.scheduleStartTime, item.scheduleEndTime],
          }
        })
        setCourseData(courseData)
      }
    }
    const handleEditCourse = (course_id)=>{
      return ()=>{
        console.log(course_id)
        navigate(`/dashboard/course/${course_id}`)
      }
      
    }
    const handleAddCourse = ()=>{
      navigate(`/dashboard/course/new`)
    }

    return (
      <>
        {
          isLoading ?
          <OCLoading/>
          :
          <div className='oc-course-dashboard'>
            <h2>課程管理</h2>
            <div className="oc-course-controller">
              <Button type='primary' onClick={handleAddCourse}><PlusCircleOutlined />新增課程</Button>
            </div>
            <div className='oc-course-seacrh'>
              <label>課程名:</label>
              <Input type="text" placeholder='輸入課程名' style={{ width: 120 }}/>
              <label>開課學校:</label>
              <Input type="text" placeholder='輸入開課學校' style={{ width: 120 }}/>
              <label>開課單位:</label>
              <Input type="text" placeholder='輸入開課單位' style={{ width: 120 }}/>
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
              dataSource={courseData} 
              columns={columns} 
              scroll={{ x: "80%"}}
              pagination={{pageSize: 5}}
              rowKey={record => record.id}></Table>
          </div>
        }
      </>
    )
}
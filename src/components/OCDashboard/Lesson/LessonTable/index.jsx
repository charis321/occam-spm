import { useNavigate } from 'react-router-dom'
import {Table, Tag, Button} from 'antd'
import { ATTENDANCE_MAP } from '../../../../config/attendance'
import { apiUtil } from '../../../../Util/WebApi'


export default function OCLessonTable(props){
  const navigator = useNavigate()
  const { lessonData, pageSize=5 , resetLesson} = props
  const columns_lesson = [
      {
        key: "key",
        title: "序",
        dataIndex: "key",
      },
      {
        key: "date",
        title: "日期",
        dataIndex: "date",
      },
      {
        key: "startTime",
        title: "起始時間",
        dataIndex: "startTime",
      },
      {
        key: "endTime",
        title: "結束時間",
        dataIndex: "endTime",
      },
      {
        key: "attendanceStatus",
        title: "已點名?",
        dataIndex: "attendanceStatus",
        render: (item)=>{
          return <Tag color={ATTENDANCE_MAP[item].color}>{ATTENDANCE_MAP[item].title}</Tag>
        }
      },
      {
        key: "action",
        title: "操作",
        dataIndex: "key",
        render: (key)=>{
          return (
            <>
              <Button type="primary"
                      onClick={handleCheckAttendance(key)}>開始點名</Button>
              <Button type="primary" 
                      variant="solid" danger 
                      onClick={handleDeleteLesson(key)}>刪除</Button>
            </>        
          )
        }
      },
  ]
  const deleteLessonData = async(lesson)=>{
    const path = `/course/${lesson.courseId}/lesson`
    const res = await apiUtil(path, "DELETE", lesson.id)
    if(res.code===200){
      alert("刪除成功")
      resetLesson()
    }else{
      alert("刪除失敗")
    }
    console.log(res)
  }
  const handleDeleteLesson = (key)=>{ 
    const lesson = lessonData[key-1]
    return (e)=>{
      e.preventDefault()
      deleteLessonData(lesson)
    }
  }
  const handleCheckAttendance = (key)=>{
    const lesson = lessonData[key-1]
    return (e)=>{
      e.preventDefault()
      console.log(lesson,"check attendance")
      navigator(`/dashboard/course/${lesson.courseId}/attendance`)
    }
  }
  return(
    <Table  dataSource={lessonData} 
            columns={columns_lesson} 
            // scroll={{ x: "80%"}}
            pagination={{pageSize}}
            rowKey={record => record.key}></Table> 
  )
}

import { useState, useEffect } from 'react'
import { Table } from 'antd'

export default function OCLessonAttendance(props) {
  const {lessonData} = props
  const [lessonAttendanceData, setLessonAttendanceData] = useState([])
  const [loading, setLoading] = useState(false)


  const getLessonAttendanceData = async() => {
    const path = `/attendance/${lessonData.id}` 
  }
  return (
      <div className='oc-lesson-attendance'>
        <div className='oc-lesson-info'>
          <h2>{lessonData.name}</h2>
          <p>上課時間：{lessonData.startTime} ~ {lessonData.endTime}</p>
          <p>上課地點：{lessonData.classroom}</p>
        </div>
      </div>
    )
}

function OCLessonAttendanceTable(props) {
    const {lessonAttendanceData} = props
    const columns = [
      {
        key: 'studentName',
        title: '學生',
        key: 'studentName'
      },
      {
        key: 'studentNo',
        title: '學號',
        key: 'studentNo'
      },
      {
        key: 'studentDepartment',
        title: '學系',
        key: 'studentDepartment'
      },
      {
        key: 'attendanceStatus',
        title: '簽到狀態',
        key: 'attendanceStatus'
      },
    ]
    
    
    return (
      <></>
    )
}
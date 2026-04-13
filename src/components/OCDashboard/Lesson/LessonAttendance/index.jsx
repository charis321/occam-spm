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
        {/* <div className='oc-lesson-info'>
          <h2>{lessonData.name}</h2>
          <p>上課時間：{lessonData.startTime} ~ {lessonData.endTime}</p>
          <p>上課地點：{lessonData.classroom}</p>
        </div> */}
      </div>
    )
}

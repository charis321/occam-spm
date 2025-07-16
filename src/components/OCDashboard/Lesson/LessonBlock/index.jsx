import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Button, Table } from 'antd'
import { apiUtil } from '../../../../Util/WebApi'
export default function OCLessonBlock(props) {
  const { lessonData } = props
  const [lessonAttendanceData, setLessonAttendanceData] = useState([])
  const [loading, setLoading] = useState(false)
  
  const getLessonAttendanceData = async () => {
      const path = `/attendance/${lessonData.id}`
      // Fetch attendance data from the API
      // setLessonAttendanceData(res.data)
  }
    
  return (
      <div className='oc-lesson-blcok'>
        <div className='oc-lesson-info'>
            <h2>{lessonData.name}</h2>
            <p>上課時間：{lessonData.startTime} ~ {lessonData.endTime}</p>
            <p>上課地點：{lessonData.classroom}</p>
        </div>
        <div className='oc-lesson-attendance-control'>
          <Button>開始點名</Button>
        </div>
      </div>
  )
}
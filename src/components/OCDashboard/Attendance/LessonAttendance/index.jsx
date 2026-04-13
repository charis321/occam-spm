import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { LessonAttendanceTable } from '../AttendanceTable'
import { apiUtil } from '@utils/WebApi'
import './index.css'

export default function OCLessonAttendance(props) {
  const { lessonId } = useParams()
  const [attendanceData, setAttendanceData] = useState([])  
  const [loading, setLoading] = useState(true)
  
  useEffect(()=>{
    getAttendanceLessonData()
  }, [])

  const getAttendanceLessonData = async() => {
    const path = `/lesson/${lessonId}/attendance`
    const res = await apiUtil(path, "GET")
    if(res.code===200){ 
        setAttendanceData(res.data)
    } 
  }
  return(
    <div className='oc-lesson-attendance'>
      <h2>{lessonId}</h2>
      <LessonAttendanceTable data={attendanceData}/>
    </div>
  )
}
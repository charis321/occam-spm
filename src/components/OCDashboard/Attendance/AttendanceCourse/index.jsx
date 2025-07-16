import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import './index.css'

export default function OCAttendanceCourse(props) {
  const { courseId } = useParams()
  const [attendanceData, setAttendanceData] = useState([])  
  const [loading, setLoading] = useState(true)

  // const getAttendanceCourseData = async() => {
  //   const path = `/course/${props.courseId}/attendance`
  //   const res = await apiUtil(path, "GET")
  //   if(res.code === 200){
  //     setAttendanceData(res.data)
  //     setLoading(false)
  //   }else{
  //     alert("無法取得課程點名資料")
  //   }
  // }
  return(
    <div className='oc-attendance-course'>
      <h2>課程點名</h2>
      <h2>{ courseId }</h2>
    </div>
  )
}
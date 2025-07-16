import { useState, useEffect } from 'react'
import { apiUtil } from '../../../Util/ApiUtil'

export default function OCStudentAttendance(props) {
  const { coureseData } = props
  const [studentAttendanceData, setStudentAttendanceData] = useState([])
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {

  })

  const getStudentAttendanceData = async () => {
    const path = `/attendance`
    setLoading(true)
    const res = await apiUtil()
  }
  return (
    <div className='oc-student-attendance'>

    </div>
  )
}
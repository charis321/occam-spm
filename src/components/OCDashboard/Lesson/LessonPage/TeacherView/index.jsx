import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { QRCodeSVG } from 'qrcode.react'
import { Button } from 'antd'
import { ATTENDANCE_STATUS_MAP } from '@config/attendance'
import { apiUtil } from '@utils/WebApi'


export default function OCLessonPageTeacherView(props){
    const { lessonId , courseId } = useParams()
    const [ lessonData , setLessonData] = useState() 
    const [ isLoading , setIsLoading ] = useState(false) 
    const navigator = useNavigate()
    useEffect(()=>{
        setIsLoading(true)
        getLessonDetail()
    }, [])  

    
    const getLessonDetail= async()=>{
        const path = `/lesson/${lessonId}`
        const res = await apiUtil(path, "GET")     
        if(res.code===200){
            console.log("getLessonDetail",res.data)
            setLessonData(res.data)
        } else {
            alert("獲取課堂紀錄失敗")
        }
    }
    const checkAttendanceTime = ()=>{
        if(lessonData){
            const now = new Date()
            return lessonData.startTime > now && lessonData.endTime < now
        }
        return false
    }
    const handleRollcall = ()=>{
        if(lessonData?.attendanceStatus === 0){
            updateRollcall(1)
        }else if(lessonData?.attendanceStatus === 1){
            updateRollcall(2)
        }else if(lessonData?.attendanceStatus === 2){
            updateRollcall(1)
        }
    }
    const updateRollcall = async(attendance_status)=>{
        const path = `/lesson/${lessonId}/rollcall`
        const attendanceRequest = {
            "attendance_status": attendance_status,
            "attendance_code": Math.random().toString(36).substring(2, 8).toUpperCase(),
        }
        const res = await apiUtil(path, "patch", attendanceRequest)
        if(res.code===200){
            console.log("updateRollcall", res.data)
            setLessonData(res.data)
        } else {
            alert("開啟點名失敗")
        }
    }
    const getAttendanceQRCode = (attendanceCode)=>{
        return `${window.location.origin}/course/${courseId}/lesson/${lessonId}/${attendanceCode}`
    }
    return (
        <div className='oc-lesson-dashboard'>
            <section className='oc-lesson-attendance'>
                <h3>課堂資訊</h3>
                <p>課堂ID: {lessonData?.id}</p>
                <p>課堂日期: {lessonData?.date}</p>
                <p>起始時間: {new Date(lessonData?.startTime).toLocaleString()}</p>
                <p>結束時間: {new Date(lessonData?.endTime).toLocaleString()}</p>
            </section>
            
            <section className='oc-lesson-attendance'>
                <h3>點名狀況</h3>
                <Button onClick={()=>{navigator(`attendance`)}}>點名紀錄</Button> 
                <div className='oc-lesson-check-attendance-time'>
                    <p>目前時間: {new Date().toLocaleString()} {checkAttendanceTime() ? "在點名時間內" : "不在點名時間內"}</p>
                </div>
                <h1>{ATTENDANCE_STATUS_MAP[lessonData?.attendanceStatus]?.title || "未知狀態"}</h1>
                
                <button className='oc-start-attendance-btn' onClick={handleRollcall}>
                    {lessonData?.attendanceStatus === 0 || 
                     lessonData?.attendanceStatus === 2 
                     ? "開始點名" : "結束點名"  }
                </button>    
            </section>
            <section className='oc-lesson-attendance'>
                <h3>點名碼</h3>
               
                    {
                    lessonData?.attendanceStatus === 1 && 
                    <>
                        <div className='oc-lesson-attendance-code'>
                            <div className='oc-lesson-attendance-code-text'>{lessonData.attendanceCode}</div>
                        </div>
                        <QRCodeSVG value={getAttendanceQRCode(lessonData.attendanceCode)} size={256}/>
                    </>
                    }
               
                
            </section>
        </div>      
    )
}

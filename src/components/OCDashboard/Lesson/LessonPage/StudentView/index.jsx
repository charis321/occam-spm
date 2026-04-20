import { useState, useEffect } from 'react'
import { useNavigate, useParams, useSearchParams} from 'react-router-dom'
import { Button, Input } from 'antd'
import { QRCodeSVG } from 'qrcode.react'
import { useAuth } from '@utils/AuthContext'
import { apiUtil } from '@utils/WebApi'
import dayjs from 'dayjs'
import 'dayjs/locale/zh-tw';
import './index.css'



export default function OCLessonStudentPage(props){
    const { user } = useAuth()
    const { lessonId , courseId } = useParams()
    const [ searchParams ] = useSearchParams()
    const attendingFromUrl = searchParams.get('attending') === 'true';
    const codeFromUrl = searchParams.get('code');

    const [ lessonData , setLessonData] = useState() 
    const [ attendanceData , setAttendanceData] = useState()
    const [ attendanceCode , setAttendanceCode] = useState()
    const [ isAttending , setIsAttending ] = useState(false)
    const [ isLoading , setIsLoading ] = useState(false) 
    const navigator = useNavigate()

    useEffect(()=>{
        setIsLoading(true)
        getLessonWithAttendance()
        if(isAttending){
            setAttendanceCode(code)
            handleRollcall()
        }
    }, [])  
    const initPage= async()=>{
        setIsLoading(true)
        const res = await getLessonWithAttendance()
        
        if(isAttending){
            await setAttendanceCode(code)
            handleRollcall()
        }
        setIsLoading(false)
    }

    const getLessonWithAttendance= async()=>{
        const path = `/lesson/${lessonId}/attendance/${user.id}`
        const res = await apiUtil(path, "GET")   
        console.log("getLessonWithAttendance")  
        if(res.code===200){
            console.log("getLessonWithAttendance", res.data)
            setLessonData(res.data.lesson)
            setAttendanceData(res.data.attendance)
        } else {
            alert("獲取課堂點名失敗")
        }
    }
    const checkAttendanceTime = ()=>{
        if(lessonData){
            const now = new Date()
            return lessonData.startTime <= now && lessonData.endTime >= now
        }
        return false
    }
    const handleRollcall = ()=>{
        if(!attendanceCode){
            alert("請輸入點名碼")
            return
        }
        if(attendanceCode !== lessonData.attendanceCode){
            alert("點名碼錯誤")
            return
        }
        addNewAttendance()
    }
    const addNewAttendance = async()=>{
        const path = `/attendance`
        const attendanceRequest = {
            "studentId": user.id,
            "lessonId": lessonId
        }
        const res = await apiUtil(path, "POST", attendanceRequest)  
        if(res.code===200){
            getLessonWithAttendance()
        } else {
            alert("新增點名紀錄失敗")
        }
    }
    // const vaildRollcall = async()=>{
    //     const path = `/lesson/${lessonId}/rollcall`
    //     const attendanceRequest = {
    //         "attendance_status": 1,
    //         "attendance_code": Math.random().toString(36).substring(2, 8).toUpperCase(),
    //     }
    //     const res = await apiUtil(path, "patch", attendanceRequest)
    //     if(res.code===200){
    //         console.log("openRollcall", res.data)
    //         setLessonData(res.data)
    //     } else {
    //         alert("開啟點名失敗")
    //     }
    // }
    return (
        <div className='oc-lesson-dashboard'>
            <section>
                <div className='oc-lesson-info'>
                    <h3>課堂資訊</h3>
                    <p>課堂ID: {lessonData?.id}</p>
                    <p>課堂日期: {dayjs(lessonData?.startTime).format('YYYY-MM-DD')}</p>
                    <p>課堂時間: 
                        {dayjs(lessonData?.startTime).format('A HH:mm')}
                         ~ 
                        {dayjs(lessonData?.endTime).format('A HH:mm')}
                    </p>
        
                </div>
                <div className='oc-lesson-attandance'>
                    {/* <h3>點名狀況</h3> */}
                    {/* <div className='oc-lesson-check-attendance-time'>
                        <p>目前時間: {new Date().toLocaleString()} {checkAttendanceTime() ? "在點名時間內" : "不在點名時間內"}</p>
                    </div> */}
                    <div id='rollcall-status'>
                        <h2>{lessonData?.attendanceStatus === 0 ? "尚未開啟點名" : "點名進行中"}</h2>
                    </div>
                    {
                    attendanceData?
                    
                    <div>
                        <h3>已完成點名</h3>
                        <p>點名時間: {new Date(attendanceData?.timestamp).toLocaleString()}</p>
                    </div>   
                    :
                    <div>
                        <button className='oc-start-attendance-btn' onClick={() => setIsAttending(true)}>開始點名</button>
                    </div>  
                    }
                </div>
                {
                    isAttending && 
                    <div className='oc-lesson-attendance-block'>
                        <div className='oc-lesson-attendance-block-body'>

                            <Input placeholder="請輸入點名碼" onChange={(e) => setAttendanceCode(e.target.value)}></Input>
                            <Button type="primary" onClick={handleRollcall} disabled={!checkAttendanceTime()}>送出點名碼</Button>      
                        </div>
                        <Button className='close-btn' onClick={() => setIsAttending(false)}>X</Button>
                     </div>
                }
                
            </section>
        </div>      
    )
}

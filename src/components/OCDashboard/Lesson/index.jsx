import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { apiUtil } from '../../../Util/WebApi'



export default function OCLessonDashboard(props){
    const { lessonId , courseId } = useParams()
    const [ lessonData , setLessonData] = useState() 
    const [ isLoading , setIsLoading ] = useState(false) 
    const navigator = useNavigate()
    useEffect(()=>{
        setIsLoading(true)
        getLessonData()
    }, [])  
    const getLessonData = async()=>{
        const path = `/lesson/${lessonId}`
        const res = await apiUtil(path, "GET")     
        if(res.code===200){
            console.log("getLessonData",res.data)
            setLessonData(res.data)
        } else {
            alert("獲取課堂資料失敗")
        }
    }
    const checkAttendanceTime = ()=>{
        if(lessonData){
            const now = new Date()
            return lessonData.startTime > now && lessonData.endTime < now
        }
        return false
    }
    const handleAttending = ()=>{
        
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
                <h3>出席狀況</h3>
                <div className='oc-lesson-check-attendance-time'>
                    <p>目前時間: {new Date().toLocaleString()} {checkAttendanceTime() ? "在點名時間內" : "不在點名時間內"}</p>
                </div>
                <button className='oc-start-attendance-btn' onClick={handleAttending()}>開始點名</button>    
            </section>
        </div>      
    )
}

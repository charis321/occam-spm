import { useState, useEffect } from "react"
import { useAuth } from "@utils/AuthContext"
import { apiUtil } from "@utils/WebApi"
import OCLessonCalendar from "@components/OCDashboard/Lesson/LessonCalendar"
import OCLoading from "@components/OCCommon/OCLoading"
import './index.css'


export default function OCCalendar(props){
    const { user } = useAuth()
    const [ isLoading , setIsLoading ] = useState(false)
    const [ lessonData , setLessonData ] = useState([])

    useEffect(()=>{
        getLessonData()
    }, [])

    const getLessonData = async()=>{
        setIsLoading(true)  
        const path = `/lesson/${user.role==1?'teacher':'student'}/${user.id}`
        const res = await apiUtil(path, "get")
        if(res.code===200){
            console.log("getLessonData", res.data)
            res.data&&setLessonData(res.data)
        }
        setIsLoading(false)
    }
    return(
        <>
            {
                isLoading?
                <OCLoading />
                :
                <div className='oc-lesson-calendar'>
                    <h2>課程行事曆</h2>
                    <section className="oc-lesson-calendar-main">
                        <OCLessonCalendar lessonData={lessonData} lessonClick={()=>{}}/>
                    </section>

                </div>
            }
        </>
    )
}
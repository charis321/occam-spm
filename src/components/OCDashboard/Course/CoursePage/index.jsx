import { useState, useEffect } from "react";
import { redirect, useNavigate, useParams } from "react-router-dom";
import { Button, Table, Calendar, Switch, Popover,Tag } from "antd";
import { AppstoreAddOutlined, QuestionCircleOutlined, PlusCircleOutlined, CloseOutlined , AuditOutlined} from '@ant-design/icons'
import dayjs from 'dayjs';


import OCCourseCard from "../CourseCard";
import OCLessonCalendar from "../../Lesson/LessonCalendar";
import OCLessonTable from "../../Lesson/LessonTable";
// import OCLessonBlock from "../../Lesson/LessonBlock";

import { apiUtil } from "../../../../Util/WebApi";
import { WEEKDAY, WEEKTIME } from "../../../../config/time";

import './index.css'



export default function OCCoursePage(props){
  const { courseId } = useParams();
  const navigate = useNavigate()
  const [courseData, setCourseData] = useState()
  const [lessonData, setLessonData] = useState([])
  const [lessonDisplayMode, setLessonDisplayMode] = useState("calendar")
  const [lessonAddDisplay, setLessonAddDisplay] = useState("none")
  const [lessonFocus, setLessonFocus] = useState(null)

  useEffect(()=>{
    getCourseData()
    getLessonData()
  },[])

  useEffect(()=>{
    console.log("lesson data: ")
    console.log(lessonData)
  },[lessonData])


  const getCourseData = async ()=>{
    const path = `/course/${courseId}`
    const res = await apiUtil(path, "GET")
    if(res.code===200){
       setCourseData(res.data)
    }else{
      alert("無法取得課程資料")
    }
  }
  const deleteCourseData = async () =>{
    const path = `/course/${courseId}/erase`
    const res = await apiUtil(path, "DELETE")
    if(res.code === 200){
      alert("刪除課堂成功")
      navigate('/dashboard/course')
    }else{
      alert('刪除失敗')
      console.log(res)
    }
  }
  const getLessonData = async ()=>{
    const path = `/course/${courseId}/lesson`
    const res = await apiUtil(path, "GET")
    if(res.code===200){
      
      setLessonData(addSerialKey(res.data))
    }else{
      alert("無法取得課堂資料")
    }
    console.log(res)
  }
  const addSerialKey = (list)=>{
    list = list.map((item, index)=>{return {...item, "key": index + 1}})
    return list   
  }

  const handleLessonDisplayToggle = (checked) => setLessonDisplayMode(checked ? "calendar" : "table" ) 
  const handleLessonAddDisplayToggle = (mode) => { return (e) => setLessonAddDisplay(mode)}
 
  const handleLessonClick = (lesson) => {
     console.log(lesson);
     setLessonFocus(lesson)
  }
 

return  <div className="oc-course-page">
            <OCCourseCard courseData={courseData} readOnly={false}></OCCourseCard>
            <div className="oc-lesson-content">
              <div className="oc-lesson-content-header">
                <h3>課程安排</h3>
                <div className="oc-lesson-control-btns">
                  <Button type="primary" onClick={handleLessonAddDisplayToggle("single")}>
                    <PlusCircleOutlined />新增課堂
                  </Button>
                  <Button color="purple" variant="solid" onClick={handleLessonAddDisplayToggle("auto")}>
                    <AppstoreAddOutlined />自動新增課堂
                    <Popover content={<p>自動將課程期間內所有符合的時間段加上課堂</p>} title="提示">
                        <QuestionCircleOutlined />
                    </Popover>
                  </Button>
                </div>
                <div className="oc-lesson-mode-switch">
                  <p>模式: 日曆</p>
                  <Switch defaultChecked={true} onChange={handleLessonDisplayToggle}></Switch> 
                  <p>表單</p>
                </div>
              </div>
              {
                lessonDisplayMode === "table" ? 
                <OCLessonTable className='oc-lesson-table'
                               lessonData={lessonData}
                               resetLesson= {()=>{getLessonData()}}/>
                : 
                <OCLessonCalendar className="oc-lesson-calendar"
                                  lessonData={lessonData}
                                  lessonClick={(lesson)=> handleLessonClick(lesson)}
                                  resetLesson= {()=>{getLessonData()}}/>
              }
              {
                lessonAddDisplay==="none" ||
                (<OCNewLessonBlock mode = {lessonAddDisplay}
                                  courseData = {courseData}
                                  closeBlock = {()=>{setLessonAddDisplay("none")}}
                                  resetLesson= {()=>{getLessonData()}}/>)
              }
              {
                !lessonFocus|| <OCLessonBlock lessonData={lessonFocus}
                                              closeBlock = {()=>{setLessonFocus(null)}}
                                              resetLesson= {()=>{getLessonData()}}/>
              }
            </div>
        </div>
}


function  OCNewLessonBlock(props){
  const { mode, courseData , closeBlock, resetLesson} = props
  const [ newLessonData, setNewLessonData ] = useState({})

  useEffect(()=>{
    setNewLessonData({
      date: getNewLessonDefaultDate(),
      startTime: courseData.scheduleStartTime,
      endTime: courseData.scheduleEndTime
    })
  },[])


  const addNewLesson = async (lessonData)=>{
    const path = `/course/${courseData.id}/lesson` + (lessonData.length===1? "" : "/batch")
    
    lessonData = lessonData.length===1? lessonData[0] : lessonData
    console.log(lessonData)
    const res = await apiUtil(path, "POST", lessonData)
    if(res.code === 200){
      alert("新增課堂成功")
      resetLesson()
    }else{
      alert("無法新增課堂資料")
    }
    console.log(res)
    closeBlock()  
  }

  const getNewLessonDefaultDate = () => { return dayjs().format("YYYY-MM-DD") }

  const handleClose = () => closeBlock()
  const handleNewLessonChange = (e) => {
    const { name, value } = e.target
    setNewLessonData({
      ...newLessonData,
      [name]: value
    })
  }
  const handleSubmitNewLesson = (mode) => {
    return (e)=>{
      e.preventDefault()
      const newLessonList = []

      if(mode==="single"){
        const newLesson = {
          courseId: courseData.id,
          teacherId: courseData.teacherId,
          date: newLessonData.date,
          classroom: newLessonData.classroom,
          startTime: newLessonData.startTime,
          endTime: newLessonData.endTime,
        }
        newLessonList.push(newLesson)
      }

      if(mode==="auto"){
        const {startPeriod, endPeriod} = newLessonData

        if(!(startPeriod&&endPeriod)) return alert("必填")

        let originDate = dayjs(startPeriod)
        let originWeekday = originDate.weekday()
        let courseWeekday = courseData.scheduleWeek
        let offset = originWeekday <= courseWeekday ?
                     courseWeekday - originWeekday:
                     7 + courseWeekday - originWeekday
        originDate = originDate.add(offset, "day")

        while(originDate.isBefore(newLessonData.endPeriod)){
          newLessonList.push(
            {
              courseId: courseData.id,
              teacherId: courseData.teacherId,
              date: originDate.format("YYYY-MM-DD"),
              classroom: courseData.classroom,
              startTime: courseData.scheduleStartTime,
              endTime: courseData.scheduleEndTime,
            }
          )
          originDate = originDate.add(7, "day")
        }
      }
      addNewLesson(newLessonList)
    }
  }

  const SingleModeForm =
    <form className="oc-new-lesson-block-form">
      <h3>新增課堂</h3>
      <div className="oc-new-lesson-block-form-item">
        <label>選擇日期: </label>
        <input type="date" name="date" defaultValue={getNewLessonDefaultDate("date")} onChange={handleNewLessonChange}></input>
      </div>
      <div className="oc-new-lesson-block-form-item">
        <label>選擇時間: </label>
        <input type="time" name="startTime" 
              defaultValue={courseData.scheduleStartTime} 
              onChange={handleNewLessonChange}></input>
        <span> 到 </span>
        <input type="time" name="endTime" 
              defaultValue={courseData.scheduleEndTime}
              onChange={handleNewLessonChange}></input>
      </div>
      <Button type="primary" onClick={handleSubmitNewLesson("single")}>確定</Button>
    </form>
  
  const AutoModeForm = 
    <form className="oc-new-lesson-block-form"> 
      <h2>自動新增</h2>
      <div className="oc-new-lesson-block-form-item">
          <label>選擇時段: </label>
          <input type="date" name="startPeriod" 
                defaultValue={courseData.scheduleStartTime} 
                onChange={handleNewLessonChange}></input>
          <span> 到 </span>
          <input type="date" name="endPeriod" 
                defaultValue={courseData.scheduleEndTime}
                onChange={handleNewLessonChange}></input>
        </div>
        <Button type="primary" onClick={handleSubmitNewLesson("auto")}>確定</Button>
    </form>
  
  return(
    <div className="oc-new-lesson-block">
      {
        mode==="single"&& SingleModeForm
      }
      {
        mode==="auto"&& AutoModeForm
      }
      <Button className="close-btn" variant="text" onClick={handleClose}><CloseOutlined /></Button>
    </div>
  )
}
function  OCEditCourseBlock(props){
    
}
function OCLessonBlock(props) {
  const { lessonData, closeBlock, resetLesson } = props
  const [ isLoading, setIsLoading ] = useState(false)
  const [ message, setMessage ] = useState("")
  
  useEffect(()=>{
    const attendanceStatus = lessonData.status
    if(attendanceStatus === 0){
      setMessage("尚未開始點名")
    }else if(attendanceStatus === 1){
      setMessage("點名進行中")
    }else if(attendanceStatus === 2){
      setMessage("點名已停止")
    }

  },lessonData)
  const getLessonData = async () => {
      const path = `/attendance/${lessonData.id}`
      // Fetch attendance data from the API
      // setLessonAttendanceData(res.data)
  }
  const handleStartAttendance = () => {
    controlLessonAttendanceStatus("start")
  }
  const handleClose = () => closeBlock()
  // const getControlBtn = () =>{
  //   if(lessonData.status === 0){
  //     return (<Button type="primary" onClick={handlestartAttendance}>開始點名</Button>)
  //   }else if(lessonData.status === 1){
  //     return (<Button type="primary" onClick={handlestartAttendance}>開始點名</Button>)
  //   }
  // }
  const handleCheckAttendance = (status) => {
  }
  const controlLessonAttendanceStatus = async (action) => {
    setIsLoading(true)
    if(action === "start"){
      const path = `/course/${lessonData.id}/lesson/attendance/start`
      const res = await apiUtil(path, "POST")
      if(res.code === 200){
        alert("開始點名成功")
      }else{
        alert("無法開始點名")
      }
      setIsLoading(false)
    }
    if(action === "stop"){
      const path = `/course/${lessonData.id}/lesson/attendance/stop`
      const res = await apiUtil(path, "POST")
      if(res.code === 200){
        alert("停止點名成功")
      }else{
        alert("無法停止點名")
      }
      setIsLoading(false)
    }
    resetLesson()
  }
    
  return (
      <div className='oc-lesson-block'>
        <div className="oc-lesson-block-body">
          <h2>{message}</h2>
          <div className='oc-lesson-info'>
              <h2>{lessonData.name}</h2>
              <p>上課日期: {lessonData.date}</p>
              <p>上課時間: {lessonData.startTime} ~ {lessonData.endTime}</p>
              <p>上課地點: {lessonData.classroom}</p>
          </div>
          <div className='oc-lesson-attendance-control'>
            <Button type="primary" loading={isLoading} onClick={handleStartAttendance}>開始點名</Button>
          </div>
        </div>
        <Button className="close-btn" variant="text" onClick={handleClose}><CloseOutlined /></Button>
      </div>
  )
}
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "antd";
import { WEEKTIME } from "../../../../config/time";

import './index.css';

export default function OCCourseCard(props) {
  const { courseData, readOnly} = props;
  const navigate = useNavigate();
  
  const deleteCourseData = async () =>{
    const path = `/course/${courseData.id}/erase`
    const res = await apiUtil(path, "DELETE")
    if(res.code === 200){
      alert("刪除課堂成功")
      navigate('/dashboard/course')
    }else{
      alert('刪除失敗')
      console.log(res)
    }
  }

  const handleStudentManager = () => navigate(`/dashboard/course/${courseData.id}/student`)
  const handleDeleteCourse = async() => { 
    var result = confirm("警告!!即將刪除這門課程!\n提示您: 如果刪除課程，此課程的全部資料，包含學生選課，學生出席紀錄也會一併銷毀，是否確定?");
    if(result) deleteCourseData()
  }
  return (
    <div className="oc-course-card">
      {
        !!courseData&&<OCCourseCardView courseData={courseData} />
      }
      {
        !readOnly
        &&
        <div className="oc-course-action"> 
          <Button  onClick={handleStudentManager}>管理學生</Button>
          <Button >編輯基本資料</Button>
          <Button type="primary" danger onClick={handleDeleteCourse}>刪除課程</Button>
        </div>
      }
    </div>
  );
}

export function OCCourseCardView(props) {
  const { courseData } = props;
  return (
    <div className="oc-course-card-content">
      <h2>課程名: {courseData.name}</h2>
      <ul>  
        <li>課程編號:&emsp;{courseData.id}</li>
        <li>負責教師:&emsp;{courseData.teacherName}</li>
        <li>開課學校:&emsp;{courseData.school}</li>
        <li>開課系所:&emsp;{courseData.department}</li>
        <li>課程時間:&emsp;{ WEEKTIME( courseData.scheduleWeek,
                                      courseData.scheduleStartTime,
                                      courseData.scheduleEndTime)                                        
                          }
        </li>
        <li>授課教室:&emsp;{courseData.classroom}</li>
        <li>應到人數:&emsp;{courseData.studentCount}人</li>
        <li>課程簡介:&emsp;{courseData.info}</li>
      </ul>
    </div>
  )
}
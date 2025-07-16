import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from 'antd'
import { useAuth } from '../../../../Util/AuthContext'
import { apiUtil } from '../../../../Util/WebApi'
import { validateCourse } from '../../../../Util/validation/validateForm'
import './index.css'

export default function CourseNew(){
  const [courseData, setCourseData] = useState({})
  const { user } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value } = e.target
    console.log(name, value)
    setCourseData((prevData) => ({
      ...prevData,
      [name]: value,
    }))
  }  
  // const checkCourseVaild = (courseData) =>{
  //   const keys = Object.keys(courseData)
  //   for(let i = 0 ; i < keys.length ; i++){
  //     if(courseData[keys[i]] === ""){
  //       alert("請填寫完整資料")
  //       return false
  //     }
  //   }
  // }
  const handleSubmit = async(e) => {
    e.preventDefault()
    const valid = validateCourse(courseData)
    if(!valid.isValid){
      let msg = ''
      for (let [key, value] of Object.entries(valid.errors)) {
        msg += value+"\n"
      }
      return alert(msg)
    }

    const newCourse = {...courseData, 
        teacherId : user.id,
    }
    console.log(newCourse)
    const res  = await apiUtil("/course/save","POST", newCourse)
    console.log(res)
    if(res.code === 200){
      alert("新增課程成功")
      navigate("/dashboard/course")
    }
  }
return  <div className="oc-course-new">

            <h2>新增課程</h2>
            <form className="oc-course-new-form">
                <div className="oc-course-new-form-item">
                    <label htmlFor="name">課程名稱</label>
                    <input type="text" id="name" name="name" placeholder="請輸入課程名稱" onChange={handleChange}/>
                </div>
                <div className="oc-course-new-form-item">
                    <label htmlFor="school">開課學校</label>
                    <input type="text" id="school" name="school" placeholder="請輸入開課學校" onChange={handleChange}/>
                </div>
                <div className="oc-course-new-form-item">
                    <label htmlFor="department">開課系所</label>
                    <input type="text" id="department" name="department" placeholder="請輸入開課系所" onChange={handleChange}/>
                </div>
                {/* <div className="oc-course-new-form-item">
                    <label htmlFor="teacher">負責教師</label>
                    <input type="text" id="teacher" name="teacher" placeholder="請輸入負責教師"/>
                </div> */}
                <div className="oc-course-new-form-item">
                    <label htmlFor="classroom">上課教室</label>
                    <input type="text" id="classroom" name="classroom" placeholder="請輸入教室" onChange={handleChange}/>
                </div>
                <div className="oc-course-new-form-item">
                    <label>上課時間</label>
                    <select id="scheduleWeek" name="scheduleWeek" onChange={handleChange}>
                      <option value="">請選擇星期</option>
                      <option value="1">星期一</option>
                      <option value="2">星期二</option>
                      <option value="3">星期三</option>
                      <option value="4">星期四</option>
                      <option value="5">星期五</option>
                      <option value="6">星期六</option>
                      <option value="0">星期日</option>
                    </select>
                    <input type="time" id="scheduleStartTime" name="scheduleStartTime"  onChange={handleChange}/>
                    <span> 到 </span>
                    <input type="time" id="scheduleEndTime" name="scheduleEndTime" onChange={handleChange}/>
                </div>
                <div className="oc-course-new-form-item">
                    <label htmlFor="info">課程介紹</label>
                    <input type="textarea" id="info" name="info" placeholder="請輸入課程介紹" onChange={handleChange}/>
                </div>
                <Button className="oc-course-new-submit-btn" type='primary' onClick={handleSubmit}>確認</Button>
            </form>
        </div>
}
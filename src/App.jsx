import { useState } from 'react'
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import dayjs from 'dayjs'
import 'dayjs/locale/zh-tw';

import OCDashboard from './pages/OCDashboard'
import OCLogin from './pages/OCLogin'
import OCRegister from './pages/OCRegister'

import OCHomeDashboard from './components/OCDashboard/Home'
import OCUserDashboard from './components/OCDashboard/User'
import OCUserNew from './components/OCDashboard/User/UserNew'
import OCUserPage from './components/OCDashboard/User/UserPage'
import OCUserCenterDashboard from './components/OCDashboard/UserCenter'

import OCStudentDashboard from './components/OCDashboard/Student'
// import OCStudentHome from './components/OCDashboard/Student/StudentHome'
import OCStudentCourseManager from './pages/OCDashboard/Student/OCStudentCourseManager'
import OCStudentAttendanceManager from './pages/OCDashboard/Student/OCStudentAttendanceManager'

import OCAdminUserManager from './pages/OCDashboard/Admin/OCAdminUserManager'

import OCTeacherCourseManager from './pages/OCDashboard/Teacher/OCTeacherCourseManager'

import OCCalendar from './pages/OCDashboard/OCCalendar'

import OCCourseDashboard from './components/OCDashboard/Course/CourseDashboard'

import OCCoursePage from './components/OCDashboard/Course/CoursePage'
import OCCourseNew from './components/OCDashboard/Course/CourseNew'
import OCCourseStudent from './components/OCDashboard/Course/CourseStudent'

import OCLessonPage from './components/OCDashboard/Lesson/LessonPage'
import OCLessonStudentPage from './components/OCDashboard/Lesson/LessonPage/StudentView'
import OCLessonAttendance from './components/OCDashboard/Attendance/LessonAttendance'

import OCDevTool from './components/OCDevTool'
import { useAuth } from './Util/AuthContext'


import OCStudentPage from './components/OCDashboard/Student/StudentPage'
import OCStudentEdit from './components/OCDashboard/Student/StudentEdit'

import OCAttendanceDashboard from './components/OCDashboard/Attendance'
import OCAttendanceCourse from './components/OCDashboard/Attendance/CourseAttendance'
import OCAttendanceLesson from './components/OCDashboard/Attendance/LessonAttendance'


import './App.css'
import OCLoading from './components/OCCommon/OCLoading'

function App() {
  const { user } = useAuth()
  dayjs.locale('zh-tw');

  return (
    <div className='App'>      
      <Routes>
        <Route path='/' element={ <Navigate to="/dashboard" />}/>
        <Route path='test' element={<OCLoading/>}></Route>
        <Route path="/dashboard" element={<OCDashboard/>}>
          <Route path='' element={<OCHomeDashboard/>}></Route>
          <Route path='user'>
            <Route path='' element={<OCUserDashboard/>}></Route>
            <Route path=':userId' element={<OCUserPage/>}></Route>
            <Route path='new' element={<OCUserNew/>}></Route>
          </Route>
          <Route path='calendar' element={<OCCalendar/>}></Route>
          <Route path='user-center' element={<OCUserCenterDashboard/>}></Route>
          <Route path='course'>
            <Route path='' element={<OCCourseDashboard/>}></Route>
            <Route path=':courseId'>
              <Route path='' element={<OCCoursePage/>}></Route>
              <Route path='student' element={<OCCourseStudent/>}></Route>
              <Route path='lesson'>
                <Route path=':lessonId'>
                  <Route path='' element={<OCLessonPage/>}></Route>
                  <Route path='attendance' element={<OCLessonAttendance/>}></Route>
                </Route>
              </Route>
              <Route path='attendance' element={<OCAttendanceCourse/>}></Route>
            </Route>
            <Route path='new' element={<OCCourseNew/>}></Route>
          </Route>
          <Route path='attendance' >
            <Route path='' element={<OCAttendanceDashboard/>}></Route>
            <Route path=':lessonId' element={<OCAttendanceLesson/>}></Route>
          </Route>
          <Route path='student'>
            <Route path='' element={<OCStudentDashboard/>}></Route>
            <Route path=':studentId' element={<OCStudentPage/>}></Route>
            <Route path='edit' element={<OCStudentEdit/>}></Route>
          </Route>
        </Route>
        <Route path="/login" element={<OCLogin/>} />
        <Route path="/register" element={<OCRegister/>} />
        <Route path="*" element={<p>404 Not Found</p>} />
      </Routes>
      {/* <OCDevTool/> */}
    </div>  
  )
}

export default App

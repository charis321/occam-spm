import { useState } from 'react'
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom'

import OCDashboard from './pages/OCDashboard'
import OCLogin from './pages/OCLogin'
import OCRegister from './pages/OCRegister'

import OCHomeDashboard from './components/OCDashboard/Home'
import OCUserDashboard from './components/OCDashboard/User'
import OCUserPage from './components/OCDashboard/User/UserPage'
import OCUserCenterDashboard from './components/OCDashboard/UserCenter'
import OCStudentDashboard from './components/OCDashboard/Student'
import OCCourseDashboard from './components/OCDashboard/Course'

import OCCoursePage from './components/OCDashboard/Course/CoursePage'
import OCCourseNew from './components/OCDashboard/Course/CourseNew'
import OCCourseStudent from './components/OCDashboard/Course/CourseStudent'


import OCDevTool from './components/OCDevTool'
import { useAuth } from './Util/AuthContext'
import { useUser } from './Util/hooks/useUser'

import OCStudentPage from './components/OCDashboard/Student/StudentPage'
import OCStudentEdit from './components/OCDashboard/Student/StudentEdit'

import OCLessonPage from './components/OCDashboard/Lesson/LessonBlock'
import OCAttendanceDashboard from './components/OCDashboard/Attendance'
import OCAttendanceCourse from './components/OCDashboard/Attendance/AttendanceCourse'



import './App.css'
import OCLoading from './components/OCCommon/OCLoading'

function App() {


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
          </Route>
          <Route path='user-center' element={<OCUserCenterDashboard/>}></Route>
          <Route path='course'>
            <Route path='' element={<OCCourseDashboard/>}></Route>
            <Route path=':courseId'>
              <Route path='' element={<OCCoursePage/>}></Route>
              <Route path='student' element={<OCCourseStudent/>}></Route>
              <Route path='lesson' element={<OCLessonPage/>}></Route>
              <Route path='attendance' element={<OCAttendanceCourse/>}></Route>
            </Route>
            <Route path='new' element={<OCCourseNew/>}></Route>
          </Route>
          <Route path='attendance' element={<OCAttendanceDashboard/>}></Route>
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

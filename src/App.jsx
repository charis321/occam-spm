import { useState } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-tw';
import relativeTime from 'dayjs/plugin/relativeTime';

import OCDevTool from './components/OCDevTool';
import { useAuth } from './Util/AuthContext';

import OCDashboard from './pages/OCDashboard';
import OCLogin from './pages/OCLogin';
import OCRegister from './pages/OCRegister';
import OCResetPassword from './pages/OCResetPassword';

import OCHomeDashboard from './components/OCDashboard/Home';
import OCUserDashboard from './components/OCDashboard/User';
import OCUserNew from './components/OCDashboard/User/UserNew';
import OCUserPage from './components/OCDashboard/User/UserPage';
import OCUserCenterDashboard from './components/OCDashboard/UserCenter';

import OCStudentDashboard from './components/OCDashboard/Student';
import OCStudentCourseManager from './pages/OCDashboard/Student/OCStudentCourseManager';
import OCStudentAttendanceManager from './pages/OCDashboard/Student/OCStudentAttendanceManager';

import OCAdminUserManager from './pages/OCDashboard/Admin/OCAdminUserManager';

import OCTeacherCourseManager from './pages/OCDashboard/Teacher/OCTeacherCourseManager';

import OCCalendar from './pages/OCDashboard/OCCalendar';

import OCCourseDashboard from './components/OCDashboard/Course/CourseDashboard';

import OCCoursePage from './components/OCDashboard/Course/CoursePage';
import OCCourseNew from './components/OCDashboard/Course/CourseNew';
import OCCourseDescription from './components/OCDashboard/Course/CourseDescription';
import OCCourseStudent from './components/OCDashboard/Course/CourseStudent';
import OCCourseAttendance from './components/OCDashboard/Attendance/CourseAttendance';

import OCLessonDashboard from './components/OCDashboard/Lesson';
import OCLessonPage from './components/OCDashboard/Lesson/LessonPage';
import OCLessonStudentPage from './components/OCDashboard/Lesson/LessonPage/StudentView';
import OCLessonAttendance from './components/OCDashboard/Attendance/LessonAttendance';

import OCStudentPage from './components/OCDashboard/Student/StudentPage';
import OCStudentEdit from './components/OCDashboard/Student/StudentEdit';

import OCAttendanceDashboard from './components/OCDashboard/Attendance';
import OCAttendanceCourse from './components/OCDashboard/Attendance/CourseAttendance';
import OCAttendanceLesson from './components/OCDashboard/Attendance/LessonAttendance';

import OCMessageDashboard from './components/OCDashboard/Message/MessageDashboard';
import OCMessageNew from './components/OCDashboard/Message/MessageNew';

import OCLoading from './components/OCCommon/OCLoading';
import { OC403, OC404, OC500 } from './pages/OCError';
import './App.css';

function App() {
  const { user } = useAuth();
  dayjs.locale('zh-tw');
  dayjs.extend(relativeTime);

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" />} />
        <Route path="test" element={<OCLoading />} />
        <Route path="/dashboard" element={<OCDashboard />}>
          <Route path="" element={<OCHomeDashboard />} />
          <Route path="user">
            <Route path="" element={<OCUserDashboard />}></Route>
            <Route path=":userId" element={<OCUserPage />}></Route>
            <Route path="new" element={<OCUserNew />}></Route>
          </Route>
          <Route path="calendar" element={<OCCalendar />} />
          <Route path="user-center" element={<OCUserCenterDashboard />} />
          <Route path="message">
            <Route path="" element={<OCMessageDashboard />} />
            <Route path="new" element={<OCMessageNew />} />
          </Route>
          <Route path="course">
            <Route path="" element={<OCCourseDashboard />}></Route>
            <Route path=":courseId">
              <Route path="" element={<OCCoursePage />}></Route>
              <Route
                path="description"
                element={<OCCourseDescription />}
              ></Route>
              <Route path="student" element={<OCCourseStudent />}></Route>
              <Route path="attendance" element={<OCCourseAttendance />}></Route>
              <Route path="lesson">
                <Route path="" element={<OCLessonDashboard />}></Route>
                <Route path=":lessonId">
                  <Route path="" element={<OCLessonPage />}></Route>
                  <Route path="attendance" element={<OCLessonAttendance />} />
                </Route>
              </Route>
              <Route path="attendance" element={<OCAttendanceCourse />}></Route>
            </Route>
            <Route path="new" element={<OCCourseNew />}></Route>
          </Route>
          <Route path="attendance">
            <Route path="" element={<OCAttendanceDashboard />}></Route>
            <Route path=":lessonId" element={<OCAttendanceLesson />}></Route>
          </Route>
          <Route path="student">
            <Route path="" element={<OCStudentDashboard />}></Route>
            <Route path=":studentId" element={<OCStudentPage />}></Route>
            <Route path="edit" element={<OCStudentEdit />}></Route>
          </Route>
        </Route>
        <Route path="/login" element={<OCLogin />} />
        <Route path="/register" element={<OCRegister />} />
        <Route path="/reset-password" element={<OCResetPassword />}></Route>
        <Route path="/error">
          <Route path="403" element={<OC403 />} />
          <Route path="500" element={<OC500 />} />
        </Route>
        <Route path="*" element={<OC404 />} />
      </Routes>
      {/* <OCDevTool/> */}
    </div>
  );
}

export default App;

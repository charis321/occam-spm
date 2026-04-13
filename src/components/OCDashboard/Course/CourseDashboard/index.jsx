import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import StudentView from './StudentView'
import TeacherView from './TeacherView'


import { useAuth } from '../../../../Util/AuthContext'
import './index.css'


export default function OCCourseDashboard(props){
    const { user } = useAuth()
    const navigate = useNavigate()


    return (
        <div className="oc-course-dashboard">
          {
            user.role==1? <TeacherView />:<StudentView />
          }
        </div>
    )
}
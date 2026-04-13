import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '@utils/AuthContext'

import TeacherView from './TeacherView'
import StudentView from './StudentView'
import './index.css'

export default function OCLessonPage(props){
    const { user } = useAuth()
    return (
        <div className='oc-lesson-dashboard'>
            {
                user.role === 1 ? <TeacherView /> : <StudentView />
            }
        </div>      
    )
}

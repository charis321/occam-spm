import { useEffect} from 'react'
import { useNavigate } from 'react-router-dom'
import OCMain from "../../components/OCMain"
import OCAside from "../../components/OCAside"
import OCHeader from "../../components/OCHeader"
import { useAuth } from '../../Util/AuthContext'
// import './index.css'

export default function OCDashboard() {
    const { auth } = useAuth()
    const navigate = useNavigate()
    useEffect(()=>{
        if( !auth||
            !auth.user||
            !auth.token){
            navigate("/login")
        }
    },[auth])

    return(
        <div className="oc-home-page">
            <OCAside/>
            <div className='row'>
                <OCHeader/>
                <OCMain/>
            </div>
        </div>
    )
}
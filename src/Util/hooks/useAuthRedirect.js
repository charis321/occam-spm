import { useNavigate } from 'react-router-dom'
import {useAuth} from '../../'

function useAuthRedirect(permission){
    const navigate = useNavigate()
    const {auth, user} = useAuth()

    if(user.id===-1){
        alert("您尚未登入，即將跳轉至登入頁!")
        navigate("/login")
    }
    if(permission>user.role){
        alert(`您的權限不足(此頁面需要${permission}身分以上)，即將跳轉至上一頁!`)
        navigate(-1)
    }
}
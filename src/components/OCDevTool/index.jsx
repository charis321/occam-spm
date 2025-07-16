import { useState } from 'react';
// import { useUser } from '../../useHooks/useUser';
import { useAuth }from '../../Util/AuthContext';
import './index.css';
export default function OCDevTool() {

    const { user, auth , loginAuth} = useAuth()
    const [isCollapse, setCollapse] = useState(true)
    
    const handleRoleChange = (e) => {
        const newAuth = {
            ...auth,
            user: {
                ...auth.user,
                role: parseInt(e.target.value)
            }
        }
        loginAuth(newAuth)
    }
    const handleCollapse = () => setCollapse(!isCollapse)

    return (
        <div className="oc-dev-tool" >
            <div className='oc-flex'>
                <p>OCDevTool</p>
                <button className='oc-dev-close-btn' onClick={handleCollapse}>X</button>
            </div>
            <div className='oc-flex'>
                <form onChange={handleRoleChange} >
                    <input type="radio" id='role0' name='role' defaultChecked={user.role===0} value="0"/>
                    <label htmlFor="role0">學生</label> 
                    <input type="radio" id='role1' name='role' defaultChecked={user.role===1} value="1"/>
                    <label htmlFor="role1">教師</label>
                    <input type="radio" id='role2' name='role' defaultChecked={user.role===2} value="2"/>
                    <label htmlFor="role2">管理員</label>
                </form>      
            </div>
        </div>
    );
}
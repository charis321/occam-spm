import { useState } from 'react'
import { Button, Form } from 'antd'
import { apiUtil } from '@utils/WebApi'
export default function OCUserPwdChange(props){

    const { user } = props
    const [ newPasswordform, setNewPasswordform ] = useState({
        oldPwd: "",
        newPwd: "",
        confirmNewPwd: ""
    })
    const [message, setMessage] = useState("")

    const handleNewPwdChange = (e) => {
        const { name, value } = e.target
        setNewPasswordform(prev => ({ ...prev, [name]: value }))
    }
    const handleNewPwdSubmit = async (e) => {
        e.preventDefault()
        setMessage("")
        console.log(newPasswordform)
        if(!vaildNewPwdform(newPasswordform)) return

        const path = "/auth/password"
        const body = {
            userId:  user.id,
            oldPwd: newPasswordform.oldPwd,
            newPwd: newPasswordform.newPwd
        }
        const res = await apiUtil(path, "put", body)
        console.log("res",res,body)
        if(res.code === 200){
            alert("密碼修改成功")
        } else {
            setMessage(res.message || "密碼修改失敗")
        }
        
    }
    const vaildNewPwdform = (pwdform) => {
        if(!pwdform.oldPwd || !pwdform.newPwd || !pwdform.confirmNewPwd){   
            setMessage("請填寫所有欄位")
            return false    
        }
        if(pwdform.newPwd !== pwdform.confirmNewPwd){
            setMessage("新密碼與確認新密碼不一致")
            return false
        }
        return true
    }

    return (
         <div className='oc-user-pwd-change'>
            <h2>修改密碼</h2>  
            {message && <p style={{color: "red"}}>{message}</p>}
            <form   className='oc-user-pwd-change-form' 
                    onChange={handleNewPwdChange}  
                    onSubmit={handleNewPwdSubmit}>
                <div className='form-item'>
                    <label htmlFor='oldPwd'>舊密碼:</label>
                    <input type="password" name='oldPwd' id='oldPwd'/>
                </div>
                <div className='form-item'>
                    <label htmlFor='newPwd'>新密碼:</label>
                    <input type="password" name='newPwd' id='newPwd'/>
                </div>
                <div className='form-item'>
                    <label htmlFor='confirmNewPwd'>確認新密碼:</label>
                    <input type="password" name='confirmNewPwd' id='confirmNewPwd'/>
                </div>
                <Button type='primary' htmlType="submit">修改密碼</Button>
            </form>
        </div>
    )
}
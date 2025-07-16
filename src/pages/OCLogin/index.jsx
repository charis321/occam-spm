import { useState, useEffect} from 'react'
import { useNavigate, Link} from 'react-router-dom'
import { login } from '../../Util/WebApi'
import { useAuth } from '../../Util/AuthContext'
import './index.css'

export default function OCLogin() {
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [msg, setMsg] = useState('')
  const {loginAuth} = useAuth()
  const navigator = useNavigate()
  
  useEffect(() => {

  },[username, password])

  const handleChange = (e) => {
    switch(e.target.name){
      case 'username':
        setUsername(e.target.value)
        break
      case 'password':
        setPassword(e.target.value)
        break
      case 'email':
        setEmail(e.target.value)
        break
    }
  }
  const handleSubmit = async(e) => {
    e.preventDefault()
    const res = await login({"name": username, "email": email, "password": password})
    if(res.code === 200){
      console.log('登入成功', res)
      loginAuth({
        "user": {
          "id": res.data.id,
          "name": res.data.name,
          "role" : res.data.role
        },
        "token": res.data.token
      })
      alert('登入成功，將導向至首頁')
      navigator('/dashboard')  
    }else{
      console.log('登入失敗' , res)
      if(res.code==="ERR_NETWORK"){
        setMsg("伺服器無回應，請稍後再試")
      }else{
        setMsg(res.msg || "登入失敗，請檢查帳號或密碼是否正確")
      }
    }
  }
  // const login = async (userObj) => {
   
  //   console.log(res)
  // }

  return (
    <div className='oc-login-page'>
      <form className='oc-login'>
        <div className='oc-login-title'>
          <h2>登入</h2>
        </div>
        <div className='oc-login-form'>
          <div className='oc-login-form-item'>
            <label htmlFor='username'>帳號：</label>
            <input type='text' id='username' name='username' onChange={handleChange} />
          </div>
          <div className='oc-login-form-item'>
            <label htmlFor='email'>Email：</label>
            <input type='email' id='email' name='email' onChange={handleChange} />
          </div>
          <div className='oc-login-form-item'>
            <label htmlFor='password'>密碼：</label>
            <input type='password' id='password' name='password' onChange={handleChange} />
          </div>
          <div className='oc-login-form-item'>
            <button type='submit' onClick={handleSubmit}>登入</button>
          </div>
          <span className='system-msg' style={{"color": "red"}}>{msg}</span>
        </div>
      </form>
      <p style={{"color": "#fff"}}>還沒註冊? <Link to="/register">點此前去註冊頁!</Link></p>
    </div>
  )
}
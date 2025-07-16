import { useState ,useEffect} from 'react'
import { useNavigate, Link} from 'react-router-dom'
import { register } from '../../Util/WebApi'
import './index.css'

export default function OCRegister() {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')
  const [msg, setMsg] = useState('')
  const navigator = useNavigate()
  
  useEffect(() => {
    console.log('username:', username)
    console.log('password:', password)
    console.log('password:', passwordConfirm)
  },[username, password, passwordConfirm])

  const handleChange = (e) => {
    switch(e.target.name){
      case 'username':
        setUsername(e.target.value)
        break
      case 'email':
        setEmail(e.target.value)
        break
      case 'password':
        setPassword(e.target.value)
        break
      case 'passwordConfirm':
        setPasswordConfirm(e.target.value)
        break
    }
  }

  const handleSubmit = async(e) => {
    e.preventDefault()
    const res = await register({"name": username, "email": email, "password": password})
        if(res.code === 200){
          console.log('登入成功', res)
          
          alert('註冊成功!')
          navigator('/login')  
        }else{
          console.log('註冊失敗' , res)
          if(res.code==="ERR_NETWORK"){
            setMsg("伺服器無回應，請稍後再試")
          }else{
            setMsg(res.msg || "註冊失敗，請稍後再試")
          }
        }
  }
  // const register = async () => {
  //   const res = await register({username, password})
  // }

  return (
    <div className='oc-register-page'>
      <form className='oc-register'>
        <div className='oc-register-title'>
          <h2>註冊</h2>
        </div>
        <div className='oc-register-form'>
          <div className='oc-register-form-item'>
            <label htmlFor='username'>帳號：</label>
            <input type='text' id='username' name='username' onChange={handleChange} />
          </div>
          <div className='oc-register-form-item'>
            <label htmlFor='email'>Email：</label>
            <input type='email' id='email' name='email' onChange={handleChange} />
          </div>
          <div className='oc-register-form-item'>
            <label htmlFor='password'>密碼：</label>
            <input type='password' id='password' name='password' onChange={handleChange} />
          </div>
          <div className='oc-register-form-item'>
            <label htmlFor='password'>確認密碼：</label>
            <input type='password' id='passwordConfirm' name='passwordConfirm' onChange={handleChange} />
          </div>
          <div className='oc-register-form-item'>
            <button type='submit' onClick={handleSubmit}>登入</button>
          </div>
        </div>
        <span className='system-msg' style={{"color": "red"}}>{msg}</span>
      </form>
      <p style={{"color": "#fff"}}>已經註冊了? <Link to="/login">點此前去登入頁!</Link></p>
    </div>
  )
}
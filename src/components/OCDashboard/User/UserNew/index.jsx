import { useState } from 'react'
export default function OCUserNew(props) {
  const [userData, setUserData] = useState({})

  const handleChange = (e) => {
    const { name, value } = e.target
    console.log(name, value)
    setUserData((prevData) => ({
      ...prevData,
      [name]: value,
    }))
  }  
  const handleSubmit = async(e) => {
    e.preventDefault()
    const valid = validateUser(userData)
    if(!valid.isValid){
      let msg = ''
      for (let [key, value] of Object.entries(valid.errors)) {
        msg += value+"\n"
      }
      return alert(msg)
    }

    const newCourse = {...courseData, 
        teacherId : user.id,
    }
    console.log(newCourse)
    const res  = await apiUtil("/course/save","POST", newCourse)
    console.log(res)
    if(res.code === 200){
      alert("新增課程成功")
      navigate("/dashboard/course")
    }
  }
  return(
    <form className='oc-user-new-form'>
      <h2>新增用戶</h2>
      <div className='oc-user-new-form-item'>
        <label htmlFor='name'>用戶名</label>
        <input type='text' id='name' name='name' placeholder='請輸入用戶名'/>
      </div>
      <div className="oc-user-new-form-item">
        <label htmlFor='default-password'>默認密碼形式</label>
        <Select id="default-password" name="default-password" style={{ width: 120 }} 
                options={[
                  { value: '0', label: '自動' },
                  { value: '1', label: '手動' },
                ]}/>
      </div>
      <div className='oc-user-new-form-item'>
        <label htmlFor='email'>電子郵件</label>
        <input type='email' id='email' name='email' placeholder='請輸入電子郵件'/>
      </div>
      <div className='oc-user-new-form-item'>
        <label htmlFor='role'>身分</label>
        <Select id="role" name="role" style={{ width: 120 }} 
                options={[
                  { value: '0', label: '學生' },
                  { value: '1', label: '教師' },
                  { value: '2', label: '管理員' },
                ]}/>
      </div>
      <Button type="primary">確認新增</Button>
      <button className="close-btn" onClick={closeBlock}>X</button>
    </form>
  )
}
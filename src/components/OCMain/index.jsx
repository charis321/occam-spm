
import { Outlet } from 'react-router-dom'
import './index.css'

export default function OCMain() {
  return (
    <div className='oc-main'>
      <Outlet></Outlet>
    </div>
  )
}
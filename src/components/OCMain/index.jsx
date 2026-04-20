
import { Outlet } from 'react-router-dom'
import OCFooter from '../OCFooter'
import './index.css'

export default function OCMain() {
  return (
    <div className='oc-main'>
      <Outlet className='oc-outlet'></Outlet>
      <OCFooter/>
    </div>
  )
}
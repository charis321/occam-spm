import { Link } from 'react-router-dom'
import { useAuth } from '../../Util/AuthContext'
import { user_menu } from './dashboard_menu.js'
import './index.css'

export default function OCAside() {
  const { user } = useAuth()

  return (
    <div className='oc-aside'>
      <div className="logo">logo</div>
      {/* <h1 style={{padding: "1rem 2rem"}}>OCCAM</h1> */}
      <OCNav role={user.role}/>
    </div>
  )
}

function OCNav(props) {
  const {role} = props
  
  return (
    <nav>
      <ul>
      {
        user_menu[role]["menu"].map(item=>{
          return <Link to={item.path} key={item.id}>
                    <li>{item.title}</li>
                  </Link>
        })
      }
      </ul>
    </nav>
  )
}
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../../Util/AuthContext';
import { user_menu } from './dashboard_menu';
import './index.css';

export default function OCAside() {
  const { user } = useAuth();

  return (
    <div className="oc-aside">
      <div className="oc-logo">logo</div>
      {/* <img src=""></img> */}
      {/* <span className="oc-logo-text">occam</span> */}
      <OCNav role={user.role} />
    </div>
  );
}

// function OCNav(props) {
//   const {role} = props

//   return (
//     <nav>
//       <ul>
//       {
//         user_menu[role]["menu"].map(item=>{
//           return <Link to={item.path} key={item.id}>
//                     <li>{item.icon} <p>{item.title}</p></li>
//                   </Link>
//         })
//       }
//       </ul>
//     </nav>
//   )
// }
function OCNav(props) {
  const { role } = props;

  return (
    <nav>
      <ul>
        {user_menu[role]['menu'].map((item) => {
          return (
            <li key={item.id}>
              <NavLink className="nav-link" to={item.path} end>
                <span>{item.icon}</span>
                <p>{item.title}</p>
              </NavLink>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

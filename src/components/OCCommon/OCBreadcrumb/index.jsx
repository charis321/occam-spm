import { Link, useLocation } from "react-router-dom";
import { PATH_MAP } from "@config/config";
import './index.css';

export default function OCBreadcrumb(props) {
  const location = useLocation()
  const paths = location.pathname.split("/").filter(path => path)
  
  return (
    <ul className="oc-breadcrumb">
      <li className="oc-breadcrumb-item">目前路徑:</li>
      {
        paths.map((path, index) => {
          const targetPath = "/" + paths.slice(0, index+1).join("/")
          const linkPath = PATH_MAP[path] ? PATH_MAP[path].title : path
          return  <li className="oc-breadcrumb-item" key={path}>
                      <Link className="oc-breadcrumb-link" to={targetPath}>{linkPath}</Link>
                      {index < paths.length - 1 && <span>/</span>}
                      
                  </li>
        })
      }
    </ul>
  )
}
import { useAuth } from "../../../Util/AuthContext";
export default function OCHomeDashboard(props){
  const { user } = useAuth()
    return (
      <div className="oc-home-dashboard">
        <h1>首頁</h1>
        <h2>歡迎回來，{user.name}</h2>
      </div>
    )
}
import {useState,  useEffect } from "react"
import { testCurrentUser } from "../../test/testData"

const useUser = ()=>{
    const [user, setUser] = useState(testCurrentUser)
    useEffect(()=>{
      // console.log('userInfo:', user)  
    },[user])
    const changeUser = (newUser)=>{
        setUser(newUser)
    }
    return [user, changeUser]
}
export {useUser}
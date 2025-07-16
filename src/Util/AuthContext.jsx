import {createContext, useContext, useState } from 'react';
import { setAuthLocal, getAuthLocal, clearAuthLocal } from '../Util/AuthUtils';
import { useEffect } from 'react';


// auth(用戶認證)
// param : {
//   user : {
//     id,
//     name,
//     email,
//     role,
//     ...info
//   },
//   token  #jwt token 
// }

export const DEFAULT_AUTH = {
  "user": {
    "id": -1,
    "username": 'Guest',
    "role": 0,
  },
  "token": ''
}

export const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
}

export default function AuthProvider({children}) {
  const [auth, setAuth] = useState(getAuthLocal()||DEFAULT_AUTH);
  useEffect(()=>{
    setAuthLocal(auth)
  },[auth])


  const loginAuth = (authObj) => {
    setAuthLocal(authObj)
    setAuth(authObj)
  }
  const logoutAuth = () =>{
    clearAuthLocal();
    setAuth(DEFAULT_AUTH)
  } 
    
  const user = auth.user;

  return (
    <AuthContext.Provider value={{user, auth, loginAuth, logoutAuth}}>
      {children}
    </AuthContext.Provider>
  );
}
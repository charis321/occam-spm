
export const setAuthLocal = (authObj) =>{
    // console.log('authObj:', authObj)
    for (let key in authObj){
       localStorage.setItem( key, JSON.stringify(authObj[key])) 
    }
}
export const getAuthLocal = () => {
    const user = JSON.parse(localStorage.getItem('user'))
    const token = JSON.parse(localStorage.getItem('token'))
    // console.log({user, token})
    if(!user||!token){
        return null
    }
    return {user, token}
}

export const getAuthLocalToken = () =>{
    return JSON.parse(localStorage.getItem('token'))
}
export const clearAuthLocal = () =>{
    localStorage.removeItem('user')
    localStorage.removeItem('token')
}

export const setAuthLocal = (authObj) =>{
    // console.log('authObj:', authObj)
    for (let key in authObj){
       localStorage.setItem( key, JSON.stringify(authObj[key])) 
    }
}
export const getAuthLocal = () => {
    const userRaw = localStorage.getItem('user')
    const tokenRaw = localStorage.getItem('token')
    let user, token;
    // console.log({user, token})
    if(!userRaw||!tokenRaw) return null

    try{
        user = JSON.parse(userRaw)
        token = JSON.parse(tokenRaw)     
        return {user, token}

    }catch (error) {
        console.error('Error parsing JSON from localStorage:', error);
        return null;
    }
}

export const getAuthLocalToken = () =>{
    const token = localStorage.getItem('token')

    if(token === null)return null
    
    return JSON.parse(localStorage.getItem('token'))
}
export const clearAuthLocal = () =>{
    localStorage.removeItem('user')
    localStorage.removeItem('token')
}
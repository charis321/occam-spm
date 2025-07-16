import axios from "axios"

import { getAuthLocalToken } from "./AuthUtils"


const BASE_URL = import.meta.env.VITE_SERVER_HOST + "/api"

export const login =  async(userObj) => {
   
    return axios.post(BASE_URL+"/auth/login", userObj)
    .then((response) => {
        return response.data
    })
    .catch((error) => {
        return error
    })
}

export const register =  async(userObj) => {

    return axios.post(BASE_URL+"/auth/register", userObj)
    .then((response) => {
        return response.data
    })
    .catch((error) => {
        return error
    })

}

export const getUser = async() =>{
    return axios.get(BASE_URL + "/user/list")
    .then((response) => {
        return response.data
    })
    .catch((error) => {
        return error
    })
}

export const apiUtil = async( path, method ,data)=>{
    return axios({
        method,
        url: BASE_URL + path,
        headers: {
            "Authorization": `Bearer ${getAuthLocalToken()}`,
            "Content-Type": 'application/json',
        },
        data
    })
    .then((response)=>{
        console.log("response", response.data)
        return response.data
    })
    .catch((error)=>{
        const { data } = error.response
        if(data.msg === "JWT_EXPIRED"){
            alert(TEXT_JWT_EXPIRED_ORINVALID)
            window.location.href = '/login'
        }
        return error
    })

}

export const handleException = (response) =>{
    if (response.status === 401) {
        // Token expired or invalid, redirect to login page
        alert(TEXT_JWT_EXPIRED_ORINVALID)
        window.location.href = '/login'
        return 
    } else if (response.status === 403) {
        // Forbidden, show error message
        return alert(TEXT_NO_PERMISSION)
    } else if (response.status === 404) {
        // Not found, show error message
        return alert(TEXT_RESOURCE_NOT_FOUND)
    } else if (response.status !== 200) {
        // Other errors, show generic error message
        return alert(TEXT_OTHER_ERROR)
    }
    return false
} 

export const handleErrer = (error) =>{
    if (error.code === "ERR_NETWORK") {       
        return alert(TEXT_NETWORK_ERROR)
    } else if (response.status === 403) {
        return alert(TEXT_NO_PERMISSION)
    } else if (response.status === 404) {
        return alert(TEXT_RESOURCE_NOT_FOUND)
    } else if (response.status !== 200) {
        return alert(TEXT_OTHER_ERROR)
    }
    return false
}

export const TEXT_JWT_EXPIRED_ORINVALID = "Token expired or invalid, please login again"
export const TEXT_NO_PERMISSION = "You do not have permission to access this resource."
export const TEXT_RESOURCE_NOT_FOUND = "Resource not found."
export const TEXT_OTHER_ERROR = "An error occurred. Please try again later."
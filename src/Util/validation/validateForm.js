export const COURESE_VALID_IDX = {
    "name": {
        title: "課程名稱",
        required: true,
        message: "課程名稱必填",
    },
    "school": {
        title: "開課學校",
        required: true,
        message: "開課學校必填",
    },
    "department": {
        title: "開課學系",
        required: true,
        message: "開課學系必填",
    },
    "scheduleWeek": {
        title: "上課時間(星期)",
        required: true,
        message: "上課時間(星期)必填",
    },
    "scheduleStartTime": {
        title: "上課時間(起始時間)",
        required: true,
        message: "上課時間(起始時間)必填",
    },
    "scheduleEndTime": {
        title: "上課時間(結束時間)",
        required: true,
        message: "上課時間(結束時間)必填",
    },
    "info": {
        title: "課程介紹",
        required: false,
        message: "",
    },
    "classroom": {
        title: "上課教室",
        required: false,
        message: "",
    },
   
}
export const USER_VALID_IDX = {
    "name": {
        title: "姓名",
        required: true,
        message: "姓名必填",
    },
    "email": {
        title: "電子信箱",
        required: true,
        message: "電子信箱必填",
    },
    "department": {
        title: "所在學系",
        required: false,
        message: "",
    },
   
}
export const vaild = (errors)=>{
    return {
        isValid: Object.keys(errors).length === 0,
        errors
    }
}

export const validateCourse = (course) => {
   
    const errors = {}
    for(const [key, body] of Object.entries(COURESE_VALID_IDX)) {
        if (!course[key] && body.required) {
            errors[key] = body.message
        }
    }

    return vaild(errors)
}
export const validateUser = (user) => {
    const errors = {}
    for(const [key, body] of Object.entries(COURESE_VALID_IDX)) {
        if (!course[key] && body.required) {
            errors[key] = body.message
        }
    }

    return vaild(errors)
}
export const validateLogin = (login) => { 
    const errors = {}
    const { email, password} = login
   
    if (!email) {
        errors.email = "信箱必填"
    }
    if (password.length < 6 || password.length > 20) {
        errors.password = "密碼格式不符合"
    }
    return vaild(errors)
}
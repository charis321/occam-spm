
// attendance
export const ATTENDANCE_MAP = {
    0: {
        title:'未點名',
        color: 'grey',
    },
    1: {
        title:'點名中',
        color: 'green',
    },
    2: {
        title: '已點名',
        color: 'red',
    }
}


// role
export const ROLE_INDEX = {
    0: {
        title:'學生',
        color: 'blue',
    },
    1: {
        title:'教師',
        color: 'green',
    },
    2: {
        title: '管理員',
        color: 'red',
    }
}

//time
export const WEEKDAY = [
    { value: 0, label: "星期日" },
    { value: 1, label: "星期一" },
    { value: 2, label: "星期二" },
    { value: 3, label: "星期三" },
    { value: 4, label: "星期四" },
    { value: 5, label: "星期五" },
    { value: 6, label: "星期六" },
]

export const WEEKTIME = (weekIdx, scheduleStartTime, scheduleEndTime)=>{
    const weektime = WEEKDAY[weekIdx].label +
                     " " +
                     scheduleStartTime.slice(0,-3) +
                     " ~ " +
                     scheduleEndTime.slice(0,-3)

    return weektime
} 

//user
export const USER_STATUS = {
    0: {
        title: '正常',
        color: 'green',
    },
    1: {
        title: '停用',
        color: 'red',
    },
}

//path
export const PATH_MAP = {
    '': {
        title: '首頁',
    },
    'login': {
        title: '登入',
    },
    'register': {
        title: '註冊',
    },
    'dashboard': {
        title: '儀表板',
    },
    'attendance': {
        title: '點名系統',
    },
    'user': {
        title: '用戶管理',
    },
    'user-center': {
        title: '用戶中心',
    },
    'roles': {
        title: '角色管理',
    },
    'course': {
        title: '課程管理',
    },
    'student': {
        title: '學生管理',
    },
    'new' : {
        title: '新增',
    }
}
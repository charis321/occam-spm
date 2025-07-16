export const user_menu = {
    0: {
        "role": {
          "name": "student",
          "title": "學生",
          "permission": 0,  
        },

        "menu": [
            {
                "id": 0,
                "name": "Home",
                "title": "首頁",
                "component": "OCHome",
                "path": "/dashboard"
            },
            {   
                "id": 1,
                "name": "UserCneter",
                "title": "個人中心",
                "component": "OCUserCenter",
                "path": "/dashboard/user-center"
            },
            {
                "id": 2,
                "name": "CourseManager",
                "title": "課程管理",
                "component": "OCCourse",
                "path": "/dashboard/course"
            },
            {
                "id": 3,
                "name": "AttendanceManager",
                "title": "點名管理",
                "component": "OCAttendance",
                "path": "/dashboard/attendance"
            },

        ]
    },
    1: {
        "role": {
          "name": "teacher",
          "title": "教師",
          "permission": 1,  
        },

        "menu": [
            {
                "id": 0,
                "name": "Home",
                "title": "首頁",
                "component": "OCHome",
                "path": "/dashboard"
            },
            {   
                "id": 1,
                "name": "UserCneter",
                "title": "個人中心",
                "component": "OCUserCenter",
                "path": "/dashboard/user-center"
            },
            {
                "id": 2,
                "name": "CourseManager",
                "title": "課程管理",
                "component": "OCCourse",
                "path": "/dashboard/course"
            },
            {
                "id": 3,
                "name": "StudentManager",
                "title": "學生管理",
                "component": "OCStudent",
                "path": "/dashboard/student"
            },
            {
                "id": 4,
                "name": "AttendanceManager",
                "title": "點名管理",
                "component": "OCAttendance",
                "path": "/dashboard/attendance"
            },

        ]
    },
    2: {
        "role": {
          "name": "admin",
          "title": "管理員",
          "permission": 2,  
        },

        "menu": [
            {
                "id": 0,
                "name": "Home",
                "title": "首頁",
                "component": "OCHome",
                "path": "/dashboard"
            },
            {   
                "id": 1,
                "name": "UserCneter",
                "title": "個人中心",
                "component": "OCUserCenter",
                "path": "/dashboard/user-center"
            },
            {
                "id": 2,
                "name": "CourseManager",
                "title": "課程管理",
                "component": "OCCourse",
                "path": "/dashboard/course"
            },
            {
                "id": 3,
                "name": "UserManager",
                "title": "用戶管理",
                "component": "OCUser",
                "path": "/dashboard/user"
            },

        ]
    },
    
}
import {
    HomeOutlined,
    UserOutlined,
    CalendarOutlined,
    BookOutlined,
    CheckCircleOutlined,
    TeamOutlined,
    AuditOutlined,
} from '@ant-design/icons';

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
                "path": "/dashboard",
                "icon": <HomeOutlined />
            },
            {   
                "id": 2,
                "name": "UserCneter",
                "title": "個人中心",
                "component": "OCUserCenter",
                "path": "/dashboard/user-center",
                "icon": <UserOutlined />
            },
            {
                "id": 3,
                "name": "Calendar",
                "title": "行事曆",
                "component": "OCCalendar",
                "path": "/dashboard/calendar",
                "icon": <CalendarOutlined />
            },
            {
                "id": 4,
                "name": "CourseManager",
                "title": "我的課程",
                "component": "OCCourse",
                "path": "/dashboard/course",
                "icon": <BookOutlined />
            },
            {
                "id": 5,
                "name": "AttendanceManager",
                "title": "點名管理",
                "component": "OCAttendance",
                "path": "/dashboard/attendance",
                "icon": <CheckCircleOutlined />
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
                "path": "/dashboard",
                "icon": <HomeOutlined />
            },
            {   
                "id": 1,
                "name": "UserCneter",
                "title": "個人中心",
                "component": "OCUserCenter",
                "path": "/dashboard/user-center",
                "icon": <UserOutlined />
            },
             {
                "id": 2,
                "name": "Calendar",
                "title": "行事曆",
                "component": "OCCalendar",
                "path": "/dashboard/calendar",
                "icon": <CalendarOutlined />
            },
            {
                "id": 3,
                "name": "CourseManager",
                "title": "課程管理",
                "component": "OCCourse",
                "path": "/dashboard/course",
                "icon": <BookOutlined />
            },
            {
                "id": 4,
                "name": "AttendanceManager",
                "title": "點名管理",
                "component": "OCAttendance",
                "path": "/dashboard/attendance",
                "icon": <CheckCircleOutlined />
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
                "path": "/dashboard",
                "icon": <HomeOutlined />
            },
            {   
                "id": 1,
                "name": "UserCneter",
                "title": "個人中心",
                "component": "OCUserCenter",
                "path": "/dashboard/user-center",
                "icon": <UserOutlined />
            },
            {
                "id": 2,
                "name": "UserManager",
                "title": "用戶管理",
                "component": "OCUser",
                "path": "/dashboard/user",
                "icon": <TeamOutlined />
            },

        ]
    },
    
}
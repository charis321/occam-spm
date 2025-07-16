export const testUserData = [
    {
        id : 0,
        name: "danny",
        role: 1,
    },
    {
        id : 1,
        name: "danny1",
        role: 2,
    },
    {
        id : 2,
        name: "danny2",
        role: 0,
    },
    {
        id : 3,
        name: "danny2",
        role: 0,
    },
    {
        id : 4,
        name: "danny2",
        role: 1,
    },
    {
        id : 5,
        name: "danny2",
        role: 2,
    },
]
export const testCourseList = [
    {
        id : 0,
        name: "資料庫概論",
        teacher: "danny",
        classroom: "A101",
        time: "星期一 10:00", 
        person_count: 40,
    },
    {
        id : 1,
        name: "線性代數",
        teacher: "danny",
        classroom: "A101",
        time: "星期一 10:00", 
        person_count: 121,
    },
    {
        id : 2,
        name: "物理學上",
        teacher: "danny",
        classroom: "A101",
        time: "星期一 10:00", 
        person_count: 10,
    }
]
export const testCourse = {
    id : 0,
    name: "資料庫概論",
    teacher: "danny",
    classroom: "A101",
    time: "星期一 10:00", 
    scheduleWeek: 1,
    scheduleStartTime: "10:00", 
    scheduleEndTime: "12:00",
    person_count: 40,
}

export const testCurrentUser = {
    id: -1,
    no: "000000",
    name: "mr.testdummy",
    role: 2,
    email: "test@gmail.com",
}

export const testStudent = [
    {
        id: 0,
        name: "李小明",
        role: 1 ,
        organization: {
            University: "台灣大學",
            department: "資訊工程學系",
        },
        grade: 1,
        course: [
            {
                id: 0,
                name: "資料庫概論",
                teacher: "danny",
                classroom: "A101",
                time: "星期一 10:00", 
            }
        ]
    }
]


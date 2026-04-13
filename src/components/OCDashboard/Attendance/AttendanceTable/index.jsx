
import { useState, useEffect } from 'react'
import { Table,Tag} from 'antd'
import { CheckSquareOutlined, CloseSquareOutlined, MinusSquareOutlined} from '@ant-design/icons';
import { apiUtil } from '@utils/WebApi'

// export default function OCAttendanceTable(props){ 
//     const { lessonId } = props
//     const [lessonAttendanceData, setLessonAttendanceData] = useState([])
    
//     useEffect(()=>{
//         getLessonAttendanceData()
//     },[])
    
//     const coloumns = [
//         {
//             title: '學生姓名',
//             dataIndex: 'studentName', 
//             key: 'studentName',
//         },

//         {
//             title: '點名狀態',
//             dataIndex: 'attendanceStatus',
//             key: 'attendanceStatus',
//         }
//     ]
//     const getLessonAttendanceData = async()=>{
//         const path = `/lesson/${lessonId}/attendance`
//         const res = await apiUtil(path, "GET")
//         if(res.code===200){
//             setLessonAttendanceData(res.data)
//         } else {
//             alert("獲取課堂點名紀錄失敗")
//         }
//     }

//     return (
//         <h1></h1>
//         // <Table dataSource={lessonAttendanceData} pagination={false} columns={coloumns}>
//         //     <Table.Column title="學生姓名" dataIndex="studentName" key="studentName" />
//         //     <Table.Column title="點名時間" dataIndex="attendanceTime" key="attendanceTime" />
//         //     <Table.Column title="點名狀態" dataIndex="attendanceStatus" key="attendanceStatus" />
//         // </Table>
//     )
// }




export function LessonAttendanceTable(props){ 
    const [ lessonAttendanceData, setLessonAttendanceData ] = useState([])   
    useEffect(()=>{
        setLessonAttendanceData(props.data)
        console.log("attendance table data", props.data)
    }, [props.data])
    

    const coloumns = [
        {
            title: '學校',
            dataIndex: 'studentSchool', 
            key: 'studentSchool',
        },
        {
            title: '學系',
            dataIndex: 'studentDepartment', 
            key: 'studentDepartment',
        },
        {
            title: '學號',
            dataIndex: 'studentNo', 
            key: 'studentNo',
        },
        {
            title: '學生姓名',
            dataIndex: 'studentName', 
            key: 'studentName',
        },

        {
            title: '點名狀態',
            dataIndex: 'status',
            key: 'status',
            render: (status) => (
                getStatusTag(status)
            ),
        }
    ]
    const getStatusTag = (status) => {
        if(status===0){
            return <Tag color="red"><CloseSquareOutlined /></Tag>
        }else if(status === 1){
            return <Tag color="green"><CheckSquareOutlined /></Tag>
        }else{
            return <Tag color="gray"><MinusSquareOutlined /></Tag>
        }
    }
    return (
        <Table dataSource={lessonAttendanceData} 
                columns={coloumns}
                rowKey={record => record.key}>
        </Table>
    )
}
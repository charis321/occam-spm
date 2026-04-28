import { useState, useEffect } from 'react';
import { Table, Tag, App } from 'antd';
import {
  CheckSquareOutlined,
  CloseSquareOutlined,
  MinusSquareOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';
import { apiUtil } from '@utils/WebApi';
import { Select } from 'antd';

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

export function OCLessonAttendanceTable(props) {
  const { attendanceData, resetData } = props;
  const { message } = App.useApp();

  const coloumns = [
    {
      title: '學生',
      key: 'studentNameNo',
      render: (record) => {
        return (
          <div>
            <h3 style={{ margin: 0 }}>{record.studentName}</h3>
            <p style={{ margin: 0 }}>{record.studentNo}</p>
          </div>
        );
      },
    },
    {
      title: '學生單位',
      key: 'placement',
      render: (record) => {
        return (
          <div>
            <p style={{ margin: 0 }}>{record.studentSchool}</p>
            <p style={{ margin: 0 }}>{record.studentDepartment}</p>
          </div>
        );
      },
    },
    {
      title: '點名狀態',
      key: 'status',
      //   minWidth: 100,
      className: 'nowrap-column',
      render: (_, record, index) => {
        const { status } = record;
        let tmp_status = status ? status : 0;
        let isWaiting = false;

        return (
          <>
            <span>{getStatusTag(tmp_status)}</span>
            <Select
              onChange={(value) => {
                let row = { ...record };
                const data = {
                  lessonId: row.lessonId,
                  studentId: row.studentId,
                  status: value,
                };
                updateAttendance(data);
              }}
              value={tmp_status}
              options={[
                { value: 0, label: '缺課' },
                { value: 1, label: '出席' },
                { value: 2, label: '請假' },
              ]}
              disabled={isWaiting}
            />
          </>
        );
      },
    },
  ];
  const getStatusTag = (status) => {
    if (status === 0 || status === null) {
      return (
        <Tag color="red">
          <CloseSquareOutlined />
        </Tag>
      );
    } else if (status === 1) {
      return (
        <Tag color="green">
          <CheckSquareOutlined />
        </Tag>
      );
    } else if (status === 2) {
      return (
        <Tag color="orange">
          <ExclamationCircleOutlined />
        </Tag>
      );
    } else {
      return (
        <Tag color="gray">
          <MinusSquareOutlined />
        </Tag>
      );
    }
  };
  const updateAttendance = async (data) => {
    const path = `/attendance`;
    const res = await apiUtil(path, 'PUT', data);
    if (res.code === 200) {
      //   alert('更新成功');
      message.success('更新成功');
      resetData();
    } else {
      message.warning('更新失敗');
    }
  };
  return (
    <Table
      className="oc-lesson-attendance-table"
      dataSource={attendanceData}
      columns={coloumns}
      rowKey={(record) => record.key}
      size="middle"
      //   showHeader={false}
    />
  );
}
export function OCCourseAttendanceTable(props) {
  const { attendanceData } = props;
  useEffect(() => {
    // console.log('coloums', generateColoums(attendanceData));
    console.log('data', generateData(attendanceData));
  }, [attendanceData]);

  //   const generateColoums = (data) => {
  //     const coloums = [...student];
  //     const indexSet = new Set(data.map((item) => item.lessonIndex));
  //     console.log('indexSet', data);
  //     for (let i of indexSet) {
  //       let new_coloumns = {
  //         title: `第${i}堂`,
  //         key: `lesson_${i}`,
  //         dataIndex: `lesson_${i}`,
  //         render: (status) => getStatusTag(status),
  //       };
  //       coloums.push(new_coloumns);
  //     }
  //     return coloums;
  //   };

  const generateData = (data) => {
    const form_data = [];
    let lesson_index = 1;
    let tmp_row;
    for (let row of data) {
      if (lesson_index === 1) tmp_row = { ...row, attendanceStatus: [] };
      const col_name = `lesson_${lesson_index}`;
      tmp_row[col_name] = row.attendanceStatus;

      if (lesson_index === lesson_n) {
        form_data.push({ ...tmp_row });
        lesson_index = 1;
        tmp_row = undefined;
      } else {
        lesson_index++;
      }
    }

    return form_data;
  };

  const getStatusTag = (status) => {
    if (status === 0) {
      return (
        <Tag color="red">
          <CloseSquareOutlined />
        </Tag>
      );
    } else if (status === 1) {
      return (
        <Tag color="green">
          <CheckSquareOutlined />
        </Tag>
      );
    } else {
      return (
        <Tag color="gray">
          <MinusSquareOutlined />
        </Tag>
      );
    }
  };
  return (
    <Table
      dataSource={generateData(attendanceData)}
      columns={generateColoums(attendanceData)}
      rowKey={(record) => record.key}
      showHeader={false}
    ></Table>
  );
}

export const student = [
  //   {
  //     title: '學校',
  //     dataIndex: 'studentSchool',
  //     key: 'studentSchool',
  //     minWidth: '200px',
  //   },
  //   {
  //     title: '學系',
  //     dataIndex: 'studentDepartment',
  //     key: 'studentDepartment',
  //   },
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
];

import { Table } from "antd"

export default function OCCouresTable(props){

  const {studentData , isNew } = props
  const columns_student = [
    {
      key: "school",
      title: "學校",
      dataIndex: "school",
    },
    {
      key: "department",
      title: "學系",
      dataIndex: "department",
    },
    {
      key: "no",
      title: "學號",
      dataIndex: "no",
    },
    {
      key: "name",
      title: "姓名",
      dataIndex: "name",
    },
    {
      key: "attendance_status",
      title: "出席狀況",
      dataIndex: "attendance_status",
    },
    {
      key: "attendance_rate",
      title: "出席率",
      dataIndex: "attendance_rate",
    },
  ]
  const columns_new_student = [
    {
      key: "school",
      title: "學校",
      dataIndex: "school",
    },
    {
      key: "department",
      title: "學系",
      dataIndex: "department",
    },
    {
      key: "no",
      title: "學號",
      dataIndex: "no",
    },
    {
      key: "name",
      title: "姓名",
      dataIndex: "name",
    }
  ]

  retrun(
      <Table  className='oc-new-student-table'
              dataSource={studentData} 
              columns={isNew ? columns_new_student : columns_student} 
              scroll={{ x: "80%"}}
              pagination={{pageSize: 5}}
              rowKey={record => record.key}></Table>
  )
}
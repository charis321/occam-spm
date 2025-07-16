import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import * as XLSX from "xlsx";
import { Button, Table } from "antd";
import { PlusCircleOutlined, FileAddOutlined } from "@ant-design/icons";
import OCStudentTable from "../../Student/StudentTable";
import OCCourseCard from "../CourseCard";
import OCLoading from "../../../OCCommon/OCLoading";
import { apiUtil } from "../../../../Util/WebApi";
import "./index.css";


export default function OCCourseStudent(props){
  const { courseId } = useParams();
  const [ newStudentsFile, setNewStudentFile ] = useState()
  const [ courseData, setCourseData ] = useState()
  const [ studentData, setStudentData ] = useState()
  const [ newStudentData, setNewStudentData ] = useState([])
  const [ isAdding, setIsAdding ] = useState(false)


  useEffect(()=>{
    getCourseData()
    getStudentData()   
  },[])

  const columns = [
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
  const getStudentData = async() => {
    const path = `/course/${courseId}/student/list`
    const res = await apiUtil(path, "GET")
    if(res.code === 200){
      setStudentData(res.data)
    }
  }
  const getCourseData = async ()=>{
    const path = `/course/${courseId}`
    const res = await apiUtil(path, "GET")
    if(res.code===200){
        setCourseData(res.data)
    }else{
      alert("無法取得課程資料")
    }
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    const reader = new FileReader()
    let jsonData = []
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });
  
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      jsonData = XLSX.utils.sheet_to_json(worksheet);
      console.log("Excel 內容：", jsonData);
      jsonData = jsonData.map((item) => {
        return {
          key: item["__EMPTY"],
          school: item["學校"],
          department: item["學系"],
          no: item["學號"],
          name: item["姓名"],
        };
      })
      setNewStudentData(jsonData)
      
    };

    if (file) {
      reader.readAsArrayBuffer(file);
      setNewStudentFile(file)
    }
  }
  const handleSubmit = async(e) => {
    e.preventDefault()
    if(newStudentData.length === 0){
      return alert("請先上傳檔案")
    }
    const path = `/course/${courseId}/student/saveList`
    const res =  await apiUtil(path, "POST", newStudentData)
    if(res.code === 200){
      alert("新增學生成功")
    }
  }
  const handleAddStudent = () => {
    setIsAdding(!isAdding)
  }
 

  return <div className="oc-course-student">
            <h2>學生管理</h2>
            {/* <section className="oc-course-student-section oc-flex"> */}
              {/* {
                courseData?<OCCourseCard courseData={courseData} readOnly={true}></OCCourseCard>:null
              } */}
     
              <div className="oc-flex">
                <Button><PlusCircleOutlined />新增學生</Button>
                <Button color="cyan" 
                        variant="solid" 
                        onClick={handleAddStudent}><FileAddOutlined />批量新增學生</Button>
              </div> 
              
              <div className="oc-new-student-block" style={{"display": isAdding?"flex":"none"}}>
                
                <form>
                  <input type="file" name="excelFile" accept=".xlsx,.xls" onChange={handleFileChange}></input>
                  <label htmlFor="school">開課學校</label>
                  <input type="text" name="school"></input>
                  <Button onClick={handleSubmit}>上傳</Button>
                </form>
                
                <OCStudentTable  className='oc-new-student-table'
                                data={newStudentData} 
                                isNew={true}></OCStudentTable>
              </div>
              { 
                !!studentData?
                (
                    
                  <OCStudentTable className='oc-student-table'
                                data={studentData}
                                pageSize="10"></OCStudentTable>
                )
                :
                <OCLoading/>
              }  
              
            {/* </section> */}
         </div>
}
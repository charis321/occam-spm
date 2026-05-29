import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import * as XLSX from 'xlsx';
import { Button, Table, Form, Input, Space } from 'antd';
import { PlusCircleOutlined, FileAddOutlined } from '@ant-design/icons';
import OCStudentTable from '../../Student/StudentTable';
import OCCourseCard from '../CourseInfo';
import OCLoading from '../../../OCCommon/OCLoading';
import { apiUtil } from '../../../../Util/WebApi';
import './index.css';
import OCOverlay from '../../../OCCommon/OCOverlay';
import { useAuth } from '../../../../Util/AuthContext';

export default function OCCourseStudent(props) {
  const { courseId } = useParams();
  const { user } = useAuth();
  const [newStudentsFile, setNewStudentFile] = useState();
  const [courseData, setCourseData] = useState();
  const [studentData, setStudentData] = useState();
  const [newStudentData, setNewStudentData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    // getCourseData();
    const controller = new AbortController();
    getStudentData(controller.signal);
    return () => {
      controller.abort();
    };
  }, []);

  const columns = [
    {
      key: 'school',
      title: '學校',
      dataIndex: 'school',
    },
    {
      key: 'department',
      title: '學系',
      dataIndex: 'department',
    },
    {
      key: 'no',
      title: '學號',
      dataIndex: 'no',
    },
    {
      key: 'name',
      title: '姓名',
      dataIndex: 'name',
    },
    // {
    //   key: 'attendance_status',
    //   title: '出席狀況',
    //   dataIndex: 'attendance_status',
    // },
    // {
    //   key: 'attendance_rate',
    //   title: '出席率',
    //   dataIndex: 'attendance_rate',
    // },
  ];
  const getStudentData = async (signal) => {
    setIsLoading(true);
    const path = `/course/${courseId}/enrollment`;
    const res = await apiUtil(path, 'GET', signal);
    if (res?.isSystemError) return;
    if (res?.code === 200) {
      setStudentData(res.data);
    } else {
      alert('無法取得學生資料');
    }
    setIsLoading(false);
  };
  const getCourseData = async (signal) => {
    const path = `/course/${courseId}`;
    const res = await apiUtil(path, 'GET');
    if (res?.isSystemError) return;
    if (res?.code === 200) {
      setCourseData(res.data);
    } else {
      alert('無法取得課程資料');
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    let jsonData = [];
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });

      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      jsonData = XLSX.utils.sheet_to_json(worksheet);
      console.log('Excel 內容：', jsonData);
      jsonData = jsonData.map((item) => {
        return {
          key: item['__EMPTY'],
          school: item['school'],
          department: item['department'],
          no: item['no'],
          name: item['name'],
          email: item['email'],
        };
      });
      setNewStudentData(jsonData);
    };

    if (file) {
      reader.readAsArrayBuffer(file);
      setNewStudentFile(file);
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newStudentData.length === 0) {
      return alert('請先上傳檔案');
    }
    const path = `/course/${courseId}/enrollment`;
    const res = await apiUtil(path, 'POST', null, newStudentData);
    if (res?.isSystemError) return;
    if (res?.code === 200) {
      alert('新增學生成功');
      getStudentData();
      setIsAdding(false);
    } else {
      alert('新增學生失敗', res?.msg);
    }
  };
  const handleAddStudent = () => {
    setIsAdding(!isAdding);
  };

  return (
    <>
      {isLoading ? (
        <OCLoading />
      ) : (
        <div className="oc-course-student">
          <h2>學生管理</h2>
          {user.role == 1 && (
            <div className="oc-flex">
              <Button>
                <PlusCircleOutlined />
                新增學生
              </Button>
              <Button color="cyan" variant="solid" onClick={handleAddStudent}>
                <FileAddOutlined />
                批量新增學生
              </Button>
            </div>
          )}

          {isAdding && (
            <OCOverlay
              toggle={() => {
                setIsAdding(!isAdding);
              }}
            >
              <div className="oc-student-new-block">
                <h2>批量註冊學生</h2>
                <Form
                  layout="inline"
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    borderRadius: '0.5rem',
                  }}
                >
                  <Form.Item>
                    <Input
                      type="file"
                      name="excelFile"
                      accept=".xlsx,.xls"
                      onChange={handleFileChange}
                    />
                  </Form.Item>
                  <Form.Item>
                    <Button onClick={handleSubmit}>上傳</Button>
                  </Form.Item>
                </Form>
                <OCStudentTable
                  className="oc-new-student-table"
                  data={newStudentData}
                  isNew={true}
                />
              </div>
            </OCOverlay>
          )}
          <OCStudentTable
            className="oc-student-table"
            data={studentData}
            pageSize="10"
          />
        </div>
      )}
    </>
  );
}

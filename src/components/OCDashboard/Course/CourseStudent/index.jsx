import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import * as XLSX from 'xlsx';
import { Button, Form, Input, Space, message } from 'antd';
import { FileAddOutlined, FileExcelOutlined } from '@ant-design/icons';
import OCStudentTable from '../../Student/StudentTable';
import OCLoading from '../../../OCCommon/OCLoading';
import OCTitle from '../../../OCCommon/OCTitle';
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
      message.error('無法取得學生資料');
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
      message.error('無法取得課程資料');
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
      return message.warning('請先上傳檔案！');
    }
    const path = `/course/${courseId}/enrollment`;
    const res = await apiUtil(path, 'POST', null, newStudentData);
    if (res?.isSystemError) return;
    if (res?.code === 200) {
      message.success('新增學生成功');
      getStudentData();
      setIsAdding(false);
    } else {
      message.error('新增學生失敗：' + (res?.msg || ''));
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
          <OCTitle
            title={user.role === 1 ? '學生管理' : '同學列表'}
            description={user.role === 1 ? '檢視選課學生名單、匯入學生 Excel 清單' : '檢視目前選修本課程的同學清單'}
          />
          {user.role == 1 && (
            <div className="oc-course-student-actions">
              <Button
                type="primary"
                icon={<FileAddOutlined />}
                onClick={handleAddStudent}
                className="oc-btn-amber-solid"
                style={{ height: '40px', borderRadius: '8px', fontWeight: 500 }}
              >
                批量導入學生 (Excel)
              </Button>
            </div>
          )}

          {isAdding && (
            <OCOverlay toggle={handleAddStudent}>
              <div className="oc-student-new-block">
                <OCTitle
                  title="批量註冊學生"
                  description="請上傳包含學生學號、姓名、電子郵件、學校與系所的 Excel 檔案 (.xlsx, .xls)"
                />
                <Form layout="vertical" className="oc-student-upload-form" style={{ marginTop: '1rem' }}>
                  <Form.Item label="選擇 Excel 檔案" required>
                    <div className="oc-excel-upload-zone">
                      <input
                        type="file"
                        name="excelFile"
                        id="excel-file-input"
                        accept=".xlsx,.xls"
                        onChange={handleFileChange}
                        style={{ display: 'none' }}
                      />
                      <label htmlFor="excel-file-input" className="oc-excel-upload-label">
                        <FileExcelOutlined className="oc-excel-icon" />
                        <span>{newStudentsFile ? newStudentsFile.name : '點擊選擇或拖入 Excel 檔案'}</span>
                      </label>
                    </div>
                  </Form.Item>
                  <Form.Item style={{ textAlign: 'right', marginTop: '1.5rem', marginBottom: 0 }}>
                    <Space size="middle">
                      <Button onClick={handleAddStudent}>取消</Button>
                      <Button
                        type="primary"
                        onClick={handleSubmit}
                        disabled={!newStudentsFile}
                        className="oc-btn-amber-solid"
                      >
                        確認上傳
                      </Button>
                    </Space>
                  </Form.Item>
                </Form>
                {newStudentData.length > 0 && (
                  <div className="oc-upload-preview-section">
                    <h3>資料預覽 ({newStudentData.length} 筆資料)</h3>
                    <OCStudentTable
                      className="oc-new-student-table"
                      data={newStudentData}
                      isNew={true}
                      pageSize={5}
                    />
                  </div>
                )}
              </div>
            </OCOverlay>
          )}
          <OCStudentTable
            className="oc-student-table"
            data={studentData}
            pageSize={10}
          />
        </div>
      )}
    </>
  );
}

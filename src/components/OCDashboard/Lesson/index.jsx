import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Switch, Radio } from 'antd';
import { apiUtil } from '../../../Util/WebApi';
import OCLessonCalendar from './LessonCalendar';
import OCLessonTable from './LessonTable';
import OCLoading from '../../OCCommon/OCLoading';
import { useAuth } from '../../../Util/AuthContext';
import './index.css';

export default function OCLessonDashboard(props) {
  const { courseId } = useParams();
  const { user } = useAuth();
  const [lessonData, setLessonData] = useState([]);
  const [displayMode, setDisplayMode] = useState('calendar');
  const [isLoading, setIsLoading] = useState(false);

  const navigator = useNavigate();

  useEffect(() => {
    const controller = new AbortController();
    getLessonData(controller.signal);
    return () => {
      controller.abort();
    };
  }, [courseId]);
  const getLessonData = async (signal) => {
    setIsLoading(true);
    const path = `/course/${courseId}/lesson`;
    const res = await apiUtil(path, 'GET', signal);
    if (res?.isSystemError) return;
    if (res?.code === 200) {
      setLessonData(res.data);
    } else {
      alert('獲取課堂列表失敗');
    }
    setIsLoading(false);
  };
  const handleDisplayToggle = (e) => {
    setDisplayMode(e.target.value);
  };
  return (
    <>
      {isLoading ? (
        <OCLoading />
      ) : (
        <div className="oc-lesson-dashboard">
          <h2>課堂管理</h2>
          <section>
            <div className="oc-lesson-mode-switch">
              <p>展示方式:</p>
              &nbsp;
              <Radio.Group
                block
                options={[
                  { label: '日曆', value: 'calendar' },
                  { label: '表單', value: 'table' },
                ]}
                defaultValue={displayMode}
                onChange={handleDisplayToggle}
                optionType="button"
                buttonStyle="solid"
              />
            </div>
          </section>
          <section>
            {displayMode === 'calendar' ? (
              <OCLessonCalendar lessonData={lessonData} />
            ) : (
              <OCLessonTable
                className="oc-lesson-table"
                lessonData={lessonData}
                pageSize={10}
                resetLesson={() => {
                  getLessonData();
                }}
                readOnly={user.role === 0}
              />
            )}
          </section>
        </div>
      )}
    </>
  );
}
function OCNewLessonBlock(props) {
  const { mode, courseData, closeBlock, resetLesson } = props;
  const [newLessonData, setNewLessonData] = useState({});

  useEffect(() => {
    setNewLessonData({
      date: getNewLessonDefaultDate(),
      startTime: courseData.scheduleStartTime,
      endTime: courseData.scheduleEndTime,
    });
  }, []);

  const addNewLesson = async (lessonData) => {
    const path =
      `/course/${courseData.id}/lesson` +
      (lessonData.length === 1 ? '' : '/batch');

    lessonData = lessonData.length === 1 ? lessonData[0] : lessonData;
    console.log(lessonData);
    const res = await apiUtil(path, 'POST', lessonData);
    if (res.code === 200) {
      alert('新增課堂成功');
      resetLesson();
    } else {
      alert('無法新增課堂資料');
    }
    console.log(res);
    closeBlock();
  };

  const getNewLessonDefaultDate = () => {
    return dayjs().format('YYYY-MM-DD');
  };

  const handleClose = () => closeBlock();
  const handleNewLessonChange = (e) => {
    const { name, value } = e.target;
    setNewLessonData({
      ...newLessonData,
      [name]: value,
    });
  };
  const handleSubmitNewLesson = (mode) => {
    return (e) => {
      e.preventDefault();
      const newLessonList = [];

      if (mode === 'single') {
        const newLesson = {
          courseId: courseData.id,
          teacherId: courseData.teacherId,
          date: newLessonData.date,
          classroom: newLessonData.classroom,
          startTime: newLessonData.startTime,
          endTime: newLessonData.endTime,
        };
        newLessonList.push(newLesson);
      }

      if (mode === 'auto') {
        const { startPeriod, endPeriod } = newLessonData;

        if (!(startPeriod && endPeriod)) return alert('必填');

        let originDate = dayjs(startPeriod);
        let originWeekday = originDate.weekday();
        let courseWeekday = courseData.scheduleWeek;
        let offset =
          originWeekday <= courseWeekday
            ? courseWeekday - originWeekday
            : 7 + courseWeekday - originWeekday;
        originDate = originDate.add(offset, 'day');

        while (originDate.isBefore(newLessonData.endPeriod)) {
          let startTime = dayjs(
            `${originDate.format('YYYY-MM-DD')} ${courseData.scheduleStartTime}`,
          ).toISOString();
          let endTime = dayjs(
            `${originDate.format('YYYY-MM-DD')} ${courseData.scheduleEndTime}`,
          ).toISOString();
          console.log('new lesson: ', courseData);
          newLessonList.push({
            courseId: courseData.id,
            teacherId: courseData.teacherId,
            classroom: courseData.classroom,
            startTime,
            endTime,
          });
          originDate = originDate.add(7, 'day');
        }
      }
      addNewLesson(newLessonList);
    };
  };

  const SingleModeForm = (
    <form className="oc-new-lesson-block-form">
      <h3>新增課堂</h3>
      <div className="oc-new-lesson-block-form-item">
        <label>選擇日期: </label>
        <input
          type="date"
          name="date"
          defaultValue={getNewLessonDefaultDate('date')}
          onChange={handleNewLessonChange}
        ></input>
      </div>
      <div className="oc-new-lesson-block-form-item">
        <label>選擇時間: </label>
        <input
          type="time"
          name="startTime"
          defaultValue={courseData.scheduleStartTime}
          onChange={handleNewLessonChange}
        ></input>
        <span> 到 </span>
        <input
          type="time"
          name="endTime"
          defaultValue={courseData.scheduleEndTime}
          onChange={handleNewLessonChange}
        ></input>
      </div>
      <Button type="primary" onClick={handleSubmitNewLesson('single')}>
        確定
      </Button>
    </form>
  );

  const AutoModeForm = (
    <form className="oc-new-lesson-block-form">
      <h2>自動新增</h2>
      <div className="oc-new-lesson-block-form-item">
        <label>選擇時段: </label>
        <input
          type="date"
          name="startPeriod"
          onChange={handleNewLessonChange}
        ></input>
        <span> 到 </span>
        <input
          type="date"
          name="endPeriod"
          onChange={handleNewLessonChange}
        ></input>
      </div>
      <Button type="primary" onClick={handleSubmitNewLesson('auto')}>
        確定
      </Button>
    </form>
  );

  return (
    <div className="oc-new-lesson-block">
      {mode === 'single' && SingleModeForm}
      {mode === 'auto' && AutoModeForm}
      <Button className="close-btn" variant="text" onClick={handleClose}>
        <CloseOutlined />
      </Button>
    </div>
  );
}
function OCLessonBlock(props) {
  const { lessonData, closeBlock, resetLesson } = props;
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const attendanceStatus = lessonData.status;
    if (attendanceStatus === 0) {
      setMessage('尚未開始點名');
    } else if (attendanceStatus === 1) {
      setMessage('點名進行中');
    } else if (attendanceStatus === 2) {
      setMessage('點名已停止');
    }
  }, lessonData);
  const getLessonData = async () => {
    const path = `/attendance/${lessonData.id}`;
    // Fetch attendance data from the API
    // setLessonAttendanceData(res.data)
  };
  const handleStartAttendance = () => {
    controlLessonAttendanceStatus('start');
  };
  const handleClose = () => closeBlock();
  // const getControlBtn = () =>{
  //   if(lessonData.status === 0){
  //     return (<Button type="primary" onClick={handlestartAttendance}>開始點名</Button>)
  //   }else if(lessonData.status === 1){
  //     return (<Button type="primary" onClick={handlestartAttendance}>開始點名</Button>)
  //   }
  // }
  const handleCheckAttendance = (status) => {};
  const controlLessonAttendanceStatus = async (action) => {
    setIsLoading(true);
    if (action === 'start') {
      const path = `/course/${lessonData.id}/lesson/attendance/start`;
      const res = await apiUtil(path, 'POST');
      if (res.code === 200) {
        alert('開始點名成功');
      } else {
        alert('無法開始點名');
      }
      setIsLoading(false);
    }
    if (action === 'stop') {
      const path = `/course/${lessonData.id}/lesson/attendance/stop`;
      const res = await apiUtil(path, 'POST');
      if (res.code === 200) {
        alert('停止點名成功');
      } else {
        alert('無法停止點名');
      }
      setIsLoading(false);
    }
    resetLesson();
  };

  return (
    <div className="oc-lesson-block">
      <div className="oc-lesson-block-body">
        <h2>{message}</h2>
        <div className="oc-lesson-info">
          <h2>{lessonData.name}</h2>
          <p>上課日期: {lessonData.date}</p>
          <p>
            上課時間: {lessonData.startTime} ~ {lessonData.endTime}
          </p>
          <p>上課地點: {lessonData.classroom}</p>
        </div>
        <div className="oc-lesson-attendance-control">
          <Button
            type="primary"
            loading={isLoading}
            onClick={handleStartAttendance}
          >
            開始點名
          </Button>
        </div>
      </div>
      <Button className="close-btn" variant="text" onClick={handleClose}>
        <CloseOutlined />
      </Button>
    </div>
  );
}

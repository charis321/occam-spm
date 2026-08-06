import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Popover, Radio, message } from 'antd';
import {
  PlusCircleOutlined,
  AppstoreAddOutlined,
  QuestionCircleOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';

import { apiUtil } from '../../../Util/WebApi';
import { useAuth } from '../../../Util/AuthContext';
import OCLessonCalendar from './LessonCalendar';
import OCLessonTable from './LessonTable';
import OCLoading from '../../OCCommon/OCLoading';
import OCOverlay from '../../OCCommon/OCOverlay';

import './index.css';

export default function OCLessonDashboard(props) {
  const { courseId } = useParams();
  const { user } = useAuth();
  const [courseData, setCourseData] = useState(null);
  const [lessonData, setLessonData] = useState([]);
  const [displayMode, setDisplayMode] = useState('calendar');
  const [lessonAddDisplay, setLessonAddDisplay] = useState('none');
  const [isLoading, setIsLoading] = useState(false);

  const navigator = useNavigate();

  useEffect(() => {
    const controller = new AbortController();
    init(controller.signal);
    return () => {
      controller.abort();
    };
  }, [courseId]);

  const init = async (signal) => {
    try {
      setIsLoading(true);
      await Promise.all([
        getCourseData(signal),
        getLessonData(signal),
      ]);
    } catch (error) {
      console.error('Init error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getCourseData = async (signal) => {
    const path = `/course/${courseId}`;
    const res = await apiUtil(path, 'GET', signal);
    if (res?.isSystemError) return;
    if (res?.code === 200) {
      setCourseData(res.data);
    } else {
      message.error('獲取課程詳情失敗');
    }
  };

  const getLessonData = async (signal) => {
    const path = `/course/${courseId}/lesson`;
    const res = await apiUtil(path, 'GET', signal);
    if (res?.isSystemError) return;
    if (res?.code === 200) {
      setLessonData(res.data);
    } else {
      message.error('獲取課堂列表失敗');
    }
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
          <div className="oc-lesson-dashboard-header">
            <h2>課堂管理</h2>
            {user.role !== 0 && courseData && (
              <div className="oc-lesson-control-btns">
                <Button
                  type="primary"
                  onClick={() => setLessonAddDisplay('single')}
                  icon={<PlusCircleOutlined />}
                >
                  新增課堂
                </Button>
                <Button
                  ghost
                  onClick={() => setLessonAddDisplay('auto')}
                  icon={<AppstoreAddOutlined />}
                  style={{ borderColor: '#8b5cf6', color: '#8b5cf6' }}
                >
                  自動新增課堂
                  <Popover
                    content={<p>自動將課程期間內所有符合的時間段加上課堂</p>}
                    title="提示"
                  >
                    <QuestionCircleOutlined style={{ marginLeft: 6 }} />
                  </Popover>
                </Button>
              </div>
            )}
          </div>
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
          <div className="oc-lesson-table-container">
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
          </div>

          {lessonAddDisplay !== 'none' && courseData && (
            <OCNewLessonBlock
              mode={lessonAddDisplay}
              courseData={courseData}
              closeBlock={() => setLessonAddDisplay('none')}
              resetLesson={() => getLessonData()}
            />
          )}
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

    const bodyData = lessonData.length === 1 ? lessonData[0] : lessonData;
    const res = await apiUtil(path, 'POST', null, bodyData);
    if (res?.isSystemError) return;
    if (res?.code === 200) {
      message.success('新增課堂成功');
      resetLesson();
    } else {
      message.error('無法新增課堂資料');
    }
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

        if (!(startPeriod && endPeriod)) return message.warning('請填寫完整時段！');

        let originDate = dayjs(startPeriod);
        let originWeekday = originDate.weekday();
        let courseWeekday = courseData.scheduleWeek;
        let offset =
          originWeekday <= courseWeekday
            ? courseWeekday - originWeekday
            : 7 + courseWeekday - originWeekday;
        originDate = originDate.add(offset, 'day');

        while (
          originDate.isBefore(newLessonData.endPeriod) ||
          originDate.isSame(newLessonData.endPeriod)
        ) {
          let startTime = dayjs(
            `${originDate.format('YYYY-MM-DD')} ${courseData.scheduleStartTime}`,
          ).toISOString();
          let endTime = dayjs(
            `${originDate.format('YYYY-MM-DD')} ${courseData.scheduleEndTime}`,
          ).toISOString();
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
    <OCOverlay toggle={handleClose}>
      {mode === 'single' && SingleModeForm}
      {mode === 'auto' && AutoModeForm}
    </OCOverlay>
  );
}

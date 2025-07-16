import { Calendar, Button } from 'antd';
import { AuditOutlined } from '@ant-design/icons'

export default function OCLessonCalendar(props) {
  const { lessonData, lessonClick } = props

  const dateCellRender = (value) => {
    const date = value.format("YYYY-MM-DD")
    const cells = []

    for(const lesson of lessonData){
      if(lesson.date === date){
        cells.push(
          <Button type="primary" shape="circle" key={lesson.key} onClick={handleLessonClick(lesson)}>
            <AuditOutlined/>
          </Button>
        )
      }
    }
    return  <>
              { cells.map(cell=>cell) }
            </>
  }

  const cellRender= (current, info) => {
    if (info.type === 'date') return dateCellRender(current);
    // if (info.type === 'month') return monthCellRender(current);
    return info.originNode;
  };
  const handleLessonClick = (lesson) => {
    return () => {
      lessonClick(lesson)
    }
  }
  return (
    <Calendar fullscreen={true} cellRender={cellRender}></Calendar>
  );
}
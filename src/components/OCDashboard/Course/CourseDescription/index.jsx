import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Card,
  Typography,
  Tag,
  Space,
  Descriptions,
  Divider,
  Badge,
} from 'antd';
import {
  BookOutlined,
  UserOutlined,
  SolutionOutlined,
  ReadOutlined,
  CalendarOutlined,
} from '@ant-design/icons';
const { Title, Paragraph, Text } = Typography;
import { apiUtil } from '@utils/WebApi';
import './index.css';

export default function OCCourseDescription() {
  const { courseId } = useParams();
  const [courseData, setCourseData] = useState();
  const data = courseData || {
    title: '實用商務英文',
    englishTitle: 'Practical Business English',
    credits: 3,
    level: '進階核心',
    studentCount: 45,
    lessonTotal: 35,
    description:
      "本課程秉持奧卡姆剃刀原則（Occam's Razor），聚焦於高效溝通與實戰表達。課程包含四大核心維度：商務書信、國際會議發言、職場社交以及跨文化溝通。旨在幫助學員在最短時間內，掌握商務環境中的語言物理防線，建立即戰力。",
    category: '語言中心',
  };
  useEffect(() => {
    const controller = new AbortController();
    getCourseData(controller.signal);
    return () => {
      controller.abort();
    };
  }, []);
  const getCourseData = async (signal) => {
    const path = `/course/${courseId}`;
    const res = await apiUtil(path, 'GET', signal);
    if (res?.isSystemError) return;
    if (res?.code === 200) {
      setCourseData(res.data);
    } else if (res?.code === 400) {
      alert('找不到課程，即將返回課程管理頁面!');
      navigator('/dashboard/course');
    }
  };

  return (
    <div className="oc-course-description">
      <Card className="oc-course-description-card">
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            flexWrap: 'wrap',
            gap: '12px',
          }}
        >
          <Space direction="vertical" size={0}>
            <Title level={3} style={{ margin: 0 }}>
              <BookOutlined style={{ color: '#1890ff', marginRight: '12px' }} />
              {courseData?.name}
            </Title>
          </Space>
          {/* <Tag
            color="blue"
            style={{
              borderRadius: '6px',
              padding: '2px 10px',
              fontSize: '14px',
            }}
          >
            {data.level}
          </Tag> */}
        </div>

        <Divider style={{ margin: '20px 0' }} />
        <Descriptions
          column={{ xs: 1, sm: 2, md: 3 }}
          size="small"
          items={[
            {
              key: '1',
              label: (
                <Space>
                  <SolutionOutlined /> 學分數
                </Space>
              ),
              children: (
                <Text strong>
                  {courseData?.credits
                    ? `${courseData?.credits}學分`
                    : '無學分'}
                </Text>
              ),
            },
            {
              key: '2',
              label: (
                <Space>
                  <UserOutlined /> 修課人數
                </Space>
              ),
              children: <Text strong>{courseData?.studentCount} 人</Text>,
            },
            {
              key: '3',
              label: (
                <Space>
                  <CalendarOutlined /> 總課堂數
                </Space>
              ),
              children: (
                <Badge
                  count={courseData?.lessonCount}
                  color="#52c41a"
                  showZero
                />
              ),
            },
            {
              key: '4',
              label: (
                <Space>
                  <ReadOutlined /> 所屬單位
                </Space>
              ),
              children: <Tag color="cyan">{courseData?.department}</Tag>,
            },
          ]}
        />

        <Divider style={{ margin: '20px 0' }} />
        <Space direction="vertical" style={{ width: '100%' }}>
          <Text
            strong
            style={{ fontSize: '16px', display: 'flex', alignItems: 'center' }}
          >
            <SolutionOutlined style={{ marginRight: '8px' }} /> 課程簡介
          </Text>

          {/* 💡 這裡實作了 RWD 文字防禦：
            1. 在手機版（PWA）預設只顯示 3 行，避免佔據過多垂直空間。
            2. 使用 expandable 屬性允許老師展開閱讀。
        */}
          <Paragraph
            ellipsis={{
              rows: 3,
              expandable: true,
              symbol: '顯示更多',
              tooltip: '點擊展開完整內容',
            }}
            style={{
              color: '#595959',
              fontSize: '15px',
              lineHeight: '1.8',
              backgroundColor: '#fafafa',
              padding: '16px',
              borderRadius: '12px',
            }}
          >
            {courseData?.info}
          </Paragraph>
        </Space>
      </Card>
    </div>
  );
}

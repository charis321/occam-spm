import { Outlet } from 'react-router-dom';
import { FloatButton } from 'antd';
import { UpCircleOutlined } from '@ant-design/icons';
import OCFooter from '../OCFooter';
import './index.css';

export default function OCMain() {
  return (
    <div className="oc-main">
      <Outlet className="oc-outlet"></Outlet>
      <FloatButton
        icon={<UpCircleOutlined />}
        onClick={() => console.log('onClick')}
      />
      <OCFooter />
    </div>
  );
}

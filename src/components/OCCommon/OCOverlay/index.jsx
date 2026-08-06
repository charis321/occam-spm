import { Outlet } from 'react-router-dom';
import './index.css';
import { Button } from 'antd';

export default function OCOverlay({ children, toggle }) {
  return (
    <div className="oc-overlay">
      <div className='oc-overlay-content'>{children}</div>
      <Button className="close-btn" onClick={toggle}>
        X
      </Button>
    </div>
  );
}

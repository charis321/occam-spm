import { Outlet } from 'react-router-dom';
import './index.css';
import { Button } from 'antd';

export default function OCOverlay({ children, toggle }) {
  return (
    <div className="oc-overlay">
      {children}
      <Button className="close-btn" onClick={toggle}>
        X
      </Button>
    </div>
  );
}

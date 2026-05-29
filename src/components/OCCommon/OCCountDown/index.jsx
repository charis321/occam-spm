import { useEffect, useState } from 'react';
import './index.css';
export default function OCCountDown({ time, onFinish }) {
  const [countdown, setCountdown] = useState(time);
  useEffect(() => {
    if (countdown <= 0) return;
    const counter = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(counter);
          onFinish && onFinish();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => {
      clearInterval(counter);
    };
  }, [time]);
  return (
    <span className="oc-countdown">
      {Math.floor(countdown / 60)}:
      {(countdown % 60).toString().padStart(2, '0')}
    </span>
  );
}

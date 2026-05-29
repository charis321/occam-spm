import { useEffect, useState } from 'react';

/*
    device:=>
      1. PC             :    > 768
      2. mobile & tablet:    768 <
*/
export const useDevice = () => {
  const [device, setDevice] = useState('mobile');
  const handleRWD = () => {
    const maxLength = Math.max(window.innerWidth, window.innerHeight);
    const minLength = Math.min(window.innerWidth, window.innerHeight);
    if (maxLength > 768) {
      setDevice('PC');
    } else {
      setDevice('mobile');
    }
  };
  useEffect(() => {
    window.addEventListener('resize', handleRWD);
    handleRWD();
    return () => {
      window.removeEventListener('resize', handleRWD);
    };
  }, []);

  return device;
};

const getOrientation = () => window.screen.orientation.type;

export const useScreenOrientation = () => {
  const [orientation, setOrientation] = useState(getOrientation());

  const updateOrientation = (e) => {
    setOrientation(getOrientation());
  };

  useEffect(() => {
    window.addEventListener('orientationchange', updateOrientation);
    return () => {
      window.removeEventListener('orientationchange', updateOrientation);
    };
  }, [orientation]);

  return orientation;
};

import { useEffect, useState } from 'react';

/*
    device:=>
      1. PC             :    > 768
      2. mobile & tablet:    768 <
*/

export const useDevice = () => {
  // 💡 預設值防線：初始化時直接盲測，確保出生那一幀就拿到正確狀態
  const [device, setDevice] = useState(() => {
    if (typeof window === 'undefined') return 'mobile';
    return window.matchMedia('(min-width: 1024px)').matches ? 'PC' : 'mobile';
  });

  useEffect(() => {
    // 🎯 核心防線：只盯著「螢幕寬度」，完全無視工具列和鍵盤造成的上下高度拉伸！
    const mediaQuery = window.matchMedia('(min-width: 1024px)');

    const handleDeviceChange = (e) => {
      if (e.matches) {
        setDevice('PC');
      } else {
        setDevice('mobile');
      }
    };

    // 💡 剛進入元件時初始化檢查一次
    handleDeviceChange(mediaQuery);

    // ⚡ 監聽狀態改變：比監聽 resize 高效，因為只有跨越 1024px 臨界點才會觸發一次
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleDeviceChange);
    } else {
      // 舊版瀏覽器相容
      mediaQuery.addListener(handleDeviceChange);
    }

    // 🧼 清洗機制：元件卸載時物理移除監聽，防止記憶體洩漏
    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handleDeviceChange);
      } else {
        mediaQuery.removeListener(handleDeviceChange);
      }
    };
  }, []);

  return device;
};

// export const useDevice = () => {
//   const [device, setDevice] = useState('mobile');
//   const handleRWD = () => {
//     const maxLength = Math.max(window.innerWidth, window.innerHeight);
//     const minLength = Math.min(window.innerWidth, window.innerHeight);
//     if (maxLength > 768) {
//       setDevice('PC');
//     } else {
//       setDevice('mobile');
//     }
//   };
//   useEffect(() => {
//     window.addEventListener('resize', handleRWD);
//     handleRWD();
//     return () => {
//       window.removeEventListener('resize', handleRWD);
//     };
//   }, []);

//   return device;
// };

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

import { useRef } from 'react';
import { useState, useEffect } from 'react';

const DEBOUNCE_TIME = 1500;

const useAlert = () => {
  const isDebounceRef = useRef();
  const intervalRef = useRef();

  useEffect(() => {
    isDebounceRef.current = false;
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const sendAlert = (msg) => {
    if (isDebounceRef.current) return;
    isDebounceRef.current = true;
    alert(msg);

    const interval = setInterval(() => {
      isDebounceRef.current = false;
    }, DEBOUNCE_TIME);
    intervalRef.current = interval;
  };
  return [sendAlert];
};

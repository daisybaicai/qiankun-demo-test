import React, { useState, useRef, useEffect } from 'react';
import { useUnmount } from 'ahooks';
import { formatTimeToDateSecond } from '@/utils/format';
import styles from './index.less';

export default function Clock() {
  const [timestamp, setTimestamp] = useState(new Date().getTime());
  const timeRef = useRef();

  const handleTimeCount = () => {
    return setInterval(() => {
      setTimestamp(timestamp + 1000);
    }, 1000);
  };

  useUnmount(() => {
    clearInterval(timeRef.current);
  });

  useEffect(() => {
    if (timeRef.current) {
      clearInterval(timeRef.current);
    }
    timeRef.current = handleTimeCount();
    return () => {
      clearInterval(timeRef.current);
    };
  }, [handleTimeCount, timestamp]);

  return (
    <div className={styles.clockWrap}>{formatTimeToDateSecond(timestamp)}</div>
  );
}

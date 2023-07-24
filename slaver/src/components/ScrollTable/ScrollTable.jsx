import React, { useEffect, useRef, useState } from 'react';
import { Table } from 'antd';
import Empty from '@/components/Empty';
import styles from './index.less';
import { isEmptyArray } from '../../utils/util';

const ScrollTable = React.memo(
  ({
    data = [],
    onScrollBottom = () => {},
    intervalTime = 1000,
    emptyDelayTime = 5000,
    columns = [],
    rowKey,
    defaultSize = 2,
    ...restProps
  }) => {
    const [dataSourse, setDataSource] = useState(data?.slice(0, defaultSize) || []);
    const [limitSize, setLimitSize] = useState(defaultSize);
    const timeRef = useRef();
    const delayTimeRef = useRef(0);

    useEffect(() => {
      if(isEmptyArray(data)) {
        if(!isEmptyArray(dataSourse)) {
          setDataSource([]);
        }
       
        timeRef.current = setInterval(() => {
          if(delayTimeRef.current >= emptyDelayTime / 1000) {
            onScrollBottom();
            clearInterval(timeRef.current);
          }
          delayTimeRef.current = delayTimeRef.current + 1;
        }, 1000);
        return;
      }
      if(timeRef.current) {
        clearInterval(timeRef.current)
      }
      delayTimeRef.current = 0;
      setDataSource(data?.slice(0, defaultSize) || []);
      setLimitSize(defaultSize);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data]);

    const handleTimeCount = () => {
      return setInterval(() => {
        if (limitSize >= data.length) {
          setDataSource(data.slice(0, defaultSize));
          setLimitSize(defaultSize);
          onScrollBottom();
          return;
        }
        setDataSource(arr => {
          arr.shift();
          arr.push(data[limitSize]);
          return [...arr];
        });
        setLimitSize(c => c + 1);
      }, intervalTime);
    };

    useEffect(() => {
      if (timeRef.current) {
        clearInterval(timeRef.current);
      }
      if (intervalTime && dataSourse instanceof Array && dataSourse.length > 0) {
        timeRef.current = handleTimeCount();
      }
      return () => {
        clearInterval(timeRef.current);
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dataSourse, intervalTime, limitSize]);
    return (
      <div className={`animated fadeIn slower ${styles.scrollTable}`}>
        {dataSourse instanceof Array && dataSourse.length > 0 ? (
          <Table
            dataSource={dataSourse}
            rowKey={rowKey}
            columns={columns}
            {...restProps}
            pagination={false}
          />
        ) : (
          <Empty style={{ height: '100%' }} />
        )}
      </div>
    );
  },
);

export default ScrollTable;

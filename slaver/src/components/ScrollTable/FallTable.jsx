import React, { useEffect, useRef } from 'react';
import { Table } from 'antd';
import Empty from '@/components/Empty';
import styles from './index.less';
import { isEmptyArray } from '../../utils/utils';

const FallTable = React.memo(
  ({
    data = [],
    onScrollBottom = () => {},
    intervalTime = 50,
    emptyDelayTime = 5000,
    columns = [],
    defaultSize = 2,
    rowKey,
    height = '4rem',
    scrollTable = true,
    rollTop = 1,
    scroll,
    tableName = '',
    tabClick = () => {},
    ...restProps
  }) => {
    const tableRef = useRef();
    const timeRef = useRef();

    // 开启定时器
    const handleScroll = (arr) => {
      let container = tableRef.current;
      if (isEmptyArray(arr)) {
        return;
      }
      container = container?.getElementsByClassName('ant-table-body')?.[0];
      if (arr.length > Number(defaultSize) && scrollTable && container) {
        timeRef.current = setInterval(() => {
          container.scrollTop += rollTop;
          if (
            Math.ceil(container.scrollTop) >=
            Number(container.scrollHeight - container.clientHeight) - 1
          ) {
            container.scrollTop = 0;
            onScrollBottom();
          }
        }, Number(intervalTime));
      }
    };
    useEffect(() => {
      if (isEmptyArray(data)) {
        return;
      }
      if (timeRef.current) {
        clearInterval(timeRef.current);
      }
      if (intervalTime && data instanceof Array && data.length > 0) {
        let container = tableRef.current;
        container = container?.getElementsByClassName('ant-table-body')?.[0];
        container.scrollTop = 0;
        handleScroll(data);
      }
      return () => {
        clearInterval(timeRef.current);
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data, intervalTime]);
    return (
      <div
        className={`animated fadeIn slower ${styles.fallTable} ${styles[tableName]}`}
        onMouseOver={() => {
          if (timeRef.current) {
            clearInterval(timeRef.current);
          }
        }}
        onMouseOut={() => {
          handleScroll(data);
        }}
      >
        {data instanceof Array && data.length > 0 ? (
          <Table
            ref={tableRef}
            dataSource={data}
            rowKey={rowKey}
            columns={columns}
            {...restProps}
            pagination={false}
            scroll={{
              y: height,
              x: '100%',
              scrollToFirstRowOnChange: true,
            }}
            onRow={(record, index) => {
              return {
                onClick: event => {
                  tabClick(index,record);
                },
              };
            }}
          />
        ) : (
          <Empty />
        )}
      </div>
    );
  },
);

export default FallTable;

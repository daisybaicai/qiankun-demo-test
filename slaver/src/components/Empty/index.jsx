import React from 'react';
import emptyBg from '@/assets/empty.png';
import styles from './index.less';

const Empty = React.memo(({
  style = {},
  placeHolder = '暂无数据'
}) => {
  return (
    <div className={styles.empty} style={style || {}}>
      <img src={emptyBg} alt="暂无数据" />
      <span>{placeHolder}</span> 
    </div>
  )
})

export default Empty;
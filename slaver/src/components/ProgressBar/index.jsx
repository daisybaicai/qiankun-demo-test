import React from 'react';
import cn from 'classnames';
import { getProgressValue } from '@/utils/utils';
import styles from './index.less';
export default function ProgressBar({
  data = {},
  direction = "row",
  unit = '个',
  keyList = ['actual','target'],
  nameList = ['实际','目标'],
  noText = false,
  textPos = 'top',
  colorMap = [],
  showProgress = false,
  style,
  bodyStyle
}) {
  
  return (
    <div className={cn(styles.progressBarView, styles[direction])} style={{...style}}>
      {
        !noText && textPos === 'top' && (
          <div className={styles.legendWrap}>
            <div className={styles.legendBox}>{nameList[0]}<span>{data?.[keyList[0]]}</span>{unit}</div>
            <div className={styles.legendBox}>{nameList[1]}<span>{data?.[keyList[1]]}</span>{unit}</div>
          </div>
        )
      }
      <div 
        className={
          cn(
            styles.progressBarWrap, 
            styles[data?.completed === true ? 'pass' : 'noPass']
          )
        } 
        style={{...bodyStyle, borderColor: colorMap?.[0], background: colorMap?.[1]}}
      >
        <div 
          className={styles.progressBar} 
          style={{
            width: `${direction === 'row' ? getProgressValue(data?.[keyList[0]],data?.[keyList[1]], false) : 100}%`, 
            height: `${direction === 'column' ? getProgressValue(data?.[keyList[0]],data?.[keyList[1]], false) : 100}%`, 
            background: colorMap?.[0]
          }} 
        >
          <div className={styles.line} />
          {
            showProgress && <div className={cn(styles.progressNum, styles[getProgressValue(data?.[keyList[0]],data?.[keyList[1]], false) >= 80 ? 'inside' : 'outside'])}>{`${getProgressValue(data?.[keyList[0]],data?.[keyList[1]], false)}%`}</div>
          }
        </div>
      </div>
      {
        !noText && textPos === 'bottom' && (
          <div className={styles.legendWrap}>
            <div className={styles.legendBox}>{nameList[0]}<span>{data?.[keyList[0]]}</span>{unit}</div>
            <div className={styles.legendBox}>{nameList[1]}<span>{data?.[keyList[1]]}</span>{unit}</div>
          </div>
        )
      }
    </div>
  )
}

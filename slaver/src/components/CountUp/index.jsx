import React, { useState, useEffect } from 'react';
import InitCountUp from 'react-countup';
import { formatAmount } from '@/utils/format';

const CountUp = React.memo(({ 
  start = 0, // 初始值
  end, // 目标值
  decimals = 0, // 要显示的小数位数
  duration = 2, // 以秒为单位的动画时间
  enableScrollSpy = false, // 当目标在视图中时启用启动动画，默认false
  onEnd, // 动画结束时回调
  className,
  style = {},
}) => {
  return (
    <InitCountUp
      formattingFn={formatAmount}
      duration={duration}
      preserveValue={false}
      decimals={decimals}
      start={start}
      end={Number(end || 0)}
      className={className}
      onEnd={onEnd}
      enableScrollSpy={enableScrollSpy}
      style={{ ...style }}
    />
  );
});

export default CountUp;

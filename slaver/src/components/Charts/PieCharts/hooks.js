import React, { useState, useRef } from 'react';
import { getNumVal } from './utils/common';
import { INITNUM } from './enum';

export function useAutoParams() {
  const [current, setCurrent] = useState({});
  const idxRef = useRef({});
  const timerRef = useRef(null);

  const init = (params) => {
    if (typeof params !== 'object') return;
    const data = params || {};
    idxRef.current = data;
    setCurrent(data);
  };

  const getWip = (key) => {
    if (key) {
      return idxRef.current[key];
    }

    return idxRef.current;
  };

  const setWip = (params) => {
    if (typeof params !== 'object') return;

    idxRef.current = params || {};
  };

  const alernate = () => {
    setCurrent({
      ...idxRef.current,
    });
  };

  const createInterval = (params) => {
    removeInterval();
    const { enable = false, time, dataSource = [] } = params || {};

    if (!enable) return;
    timerRef.current = setInterval(() => {
      const wip = getWip();
      let _wip = wip;
      Object.keys(wip).forEach((key) => {
        const data = (dataSource[key] || []).filter((item) => item.show);
        // data中的dataIndex不一定是加1递增
        const nowIndex = data.findIndex(item => item.dataIndex === wip[key]);
        const max = data.length - 1;
        // 判断是否超过数组长。取数组中的后一项的dataIndex
        const newIndex = nowIndex === -1 || nowIndex >= max ? 0 : nowIndex + 1;
        _wip[key] = getNumVal(data[newIndex]?.dataIndex, INITNUM)
      });
      setWip({
        ..._wip,
      });

      alernate();
    }, time);
  };

  const removeInterval = (callback) => {
    if (timerRef.current) {
      clearInterval(timerRef.current);

      timerRef.current = null
      callback && callback();
    }
  };

  return {
    init,
    autoCurrent: current,
    setAutoCurrent: setCurrent,
    getWip,
    setWip,
    alernate,
    createInterval,
    removeInterval,
    autoIdx: timerRef.current,
  };
}

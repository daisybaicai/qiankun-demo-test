import { useRef, useState, useCallback } from "react";
import { useMount } from "ahooks";

const CountDown = (props) => {
  const {
    time = new Date(), // 目标时间
    formatter = ({ day, hour, minutes, second }) => { return `${day}天${hour}小时${minutes}分${second}秒` }, // 展示格式
    onEnd = () => { }, // 结束时回调
    contentStyle = {} // 容器样式
  } = props;
  const [count, setCount] = useState({});
  let timer = useRef();

  const getServerTime = () => {
    return new Promise((resolve) => {
      const request = new XMLHttpRequest()
      request.open('GET', '/', true)
      request.send()
      request.onreadystatechange = () => {
        const serverTime = request.getResponseHeader('Date');
        if (serverTime) {
          resolve(Date.parse(serverTime))
        } else {
          resolve(new Date().valueOf())  // 没网情况获取本地时间
        }
      }
    })
  }

  const getTime = (nowTime) => {
    let diff = Math.floor((new Date(time).valueOf() - nowTime) / 1000);
    const diffTotal = diff;
    if (diff <= 0) {
      setCount({
        day: 0,
        hour: 0,
        minutes: 0,
        second: 0
      });

      if (timer.current) {
        clearInterval(timer.current);
      }

      onEnd();
      return diff;
    }
    const second = diff % 60;
    diff = (diff - second) / 60;
    const minutes = diff % 60;
    diff = (diff - minutes) / 60
    const hour = diff % 24;
    diff = (diff - hour) / 24;
    const day = diff;

    setCount({
      day,
      hour,
      minutes,
      second
    })
  }

  useMount(() => {
    let asyncuseTime = 0;
    let beforeTime = new Date().valueOf();
    // 获取服务器时间
    getServerTime().then(res => {
      asyncuseTime = new Date().valueOf() - beforeTime;
      // 当前时间 = 服务器时间 + 接口通信损耗时间
      let nowTime = res + asyncuseTime;

      const diff = getTime(nowTime);
      // 如果时间差为0，不触发定时器
      if (diff <= 0) return;
      nowTime += 1000;
      timer.current = setInterval(() => {
        getTime(nowTime);
        nowTime += 1000;
      }, 1000)
    })
  })

  const formatValue = useCallback((value) => {
    const val = Number(value);
    return value < 10 ? `0${value}` : value;
  }, [])

  return (
    <div style={contentStyle}>
      {
        formatter({
          day: formatValue(count.day),
          hour: formatValue(count.hour),
          minutes: formatValue(count.minutes),
          second: formatValue(count.second)
        })
      }
    </div>
  )
}

export default CountDown;
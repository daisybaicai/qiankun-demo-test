import moment from 'moment';

/**
 * 自定义时间转换
 * @param {*} val
 * @param {*} layout
 * @param {*} defaultPlaceHolder
 * @param {Boolean} formatUnix 是否为秒
 */
export function formatTime(val, layout, defaultPlaceHolder = '-', formatUnix = false) {
  if (!val || val === defaultPlaceHolder) return defaultPlaceHolder;
  let m = moment(Number(val)); // 时间戳为毫秒
  if (formatUnix) {
    m = moment.unix(Number(val)); // 时间戳为秒
  }
  return m.isValid() ? m.format(layout) : defaultPlaceHolder;
}

/**
 * 格式化年月日 时分 中文
 * @param {*} val
 */
export function formatTimeToDateMinuteCH(val, defaultPlaceHolder = '-', formatUnix = false) {
  return formatTime(val, 'YYYY年MM月DD日 HH:mm', defaultPlaceHolder, formatUnix);
}

/**
 * 格式化年月日 
 * @param {*} val
 * @param {*} defaultPlaceHolder 
 * @param {*} formatUnix 
 */
export function formatTimeToDate(val, defaultPlaceHolder = '-', formatUnix = false) {
  return formatTime(val, `YYYY-MM-DD`, defaultPlaceHolder, formatUnix);
}

/**
 * 格式化时分秒
 * @param {*} val 
 * @param {*} defaultPlaceHolder 
 * @param {*} formatUnix 
 * @returns 
 */
export function formatTimeToSecond(val, defaultPlaceHolder = '-', formatUnix = false) {
  return formatTime(val, 'HH:mm:ss', defaultPlaceHolder, formatUnix);
}

/**
 * 格式化年月日 时分秒
 * @param {*} val
 * @param {*} defaultPlaceHolder 
 * @param {*} formatUnix 
 */
export function formatTimeToDateSecond(val, defaultPlaceHolder = '-', formatUnix = false) {
  return formatTime(val, 'YYYY-MM-DD HH:mm:ss', defaultPlaceHolder, formatUnix);
}

/**
 * 格式化年月日 时分
 * @param {*} val
 * @param {*} defaultPlaceHolder 
 * @param {*} formatUnix 
 */
export function formatTimeToDateMinute(val, defaultPlaceHolder = '-', formatUnix = false) {
  return formatTime(val, 'YYYY-MM-DD HH:mm', defaultPlaceHolder, formatUnix);
}

/**
 * 格式化时分
 * @param {*} val
 * @param {*} defaultPlaceHolder 
 * @param {*} formatUnix 
 */
export function formatTimeToMinute(val, defaultPlaceHolder = '-', formatUnix = false) {
  return formatTime(val, 'HH:mm', defaultPlaceHolder, formatUnix);
}

/**
 * 格式化金额(千分位)
 * @param {*} val
 * @param {*} defaultPlaceHolder
 */
export function formatAmount(val, defaultPlaceHolder = '-') {
  const num = Number(Number(val).toFixed(2));
  if ((!val && val !== 0) || val === defaultPlaceHolder || isNaN(num)) {
    return defaultPlaceHolder;
  }
  if (num === 0) {
    return '0';
  }

  let str = num.toLocaleString();
  const numI = str?.indexOf('.');
  if (numI > -1) {
    const tmp = str.substring(numI);
    for (let i = tmp.length; i < 3; i += 1) {
      str += '0';
    }
  } else {
    str += '.00';
  }

  return str;
}

/**
 * 只允许输入数值且最多输入两位小数
 * @param {*} e
 */
export function formatFixToNum(e, pos = true) {
  let { value } = e.target;
  const t = value.charAt(0);
  // 如果输入非数字，则替换为''
  value = value?.replace(/[^\d.]/g, '');
  // 必须保证第一个为数字而不是.
  value = value?.replace(/^\./g, '');
  // 前两位不能是0加数字
  value = value?.replace(/^0\d[0-9]*/g, '');
  // 保证只有出现一个.而没有多个.
  value = value?.replace(/\.{2,}/g, '.');
  // 保证.只出现一次，而不能出现两次以上
  value = value?.replace('.', '$#$').replace(/\./g, '').replace('$#$', '.');
  // 只能输入两位小数
  value = value?.replace(/^(-)*(\d+)\.(\d\d).*$/, '$1$2.$3');
  if (t === '-' && !pos) {
    value = `-${value}`;
  }
  return value;
}

/**
 * 格式化时长
 * @param {*} val
 * @param {*} defaultPlaceHolder
 */
export function formatTimeRange(val, defaultPlaceHolder = '-') {
  if (val === null || val === defaultPlaceHolder || val === undefined) {
    return defaultPlaceHolder;
  }
  const ms = Number(val);
  if (isNaN(ms)) {
    return defaultPlaceHolder;
  }
  // eslint-disable-next-line no-bitwise
  const min = Math.floor((ms / 1000 / 60) << 0);
  const sec = Math.floor((ms / 1000) % 60);
  if (!sec && !min) {
    return `${ms}毫秒`;
  }
  if (!min) {
    return `${sec}秒`;
  }
  if (!sec && min) {
    return `${min}分钟`;
  }
  return `${min}分钟${sec}秒`;
}

/**
 * 字符转为时间格式化
 * @param {*} val 
 * @param {*} layout 
 * @param {*} defaultPlaceHolder 
 * @returns ‘2020-01-02’ to '2020年1月2日'
 */
export function formatStrToTime(val, layout = 'YYYY年MM月DD日', defaultPlaceHolder = '-') {
  if (!val || val === defaultPlaceHolder) return defaultPlaceHolder;
  const m = moment(val);
  return m.isValid() ? m.format(layout) : defaultPlaceHolder;
}

/**
 * 小数转为百分数
 * @param {*} val 
 * @param {*} decimal 
 * @param {*} defaultPlaceHolder 
 * @returns 0.12 -> 12%
 */
export function formatPercentNum(val, decimal = 0, defaultPlaceHolder = '-') {
  const num = Number(val);
  if ((!val && val !== 0) || val === defaultPlaceHolder) return defaultPlaceHolder;
  return `${Math.abs((num * 100).toFixed(decimal))}%`;
}

/**
 * 数值保留N位小数(四舍五入)
 * @param {*} val 
 * @param {*} decimal 
 * @param {*} defaultPlaceHolder 
 * @returns 
 */
export function formatNumWithLimitLen(val, decimal = 0, defaultPlaceHolder = '-') {
  const num = Number(val);
  if ((!val && val !== 0) || val === defaultPlaceHolder || isNaN(num)) {
    return defaultPlaceHolder;
  }
  return num.toFixed(decimal);
}

/**
 * 格式化数组
 * @param {Array} data
 */
export function formatArray(data, defaultPlaceHolder = '-') {
  const result = data;
  if (data && data instanceof Array) {
    data.forEach((value, id) => {
      for (const key in value) {
        if (!key || value[key] === '' || typeof value[key] === 'undefined' || value[key] === null) {
          result[id][key] = defaultPlaceHolder;
        }
      }
    });
  }
  return result;
}

import moment from 'moment';
import { range } from 'lodash';
import { message } from 'antd';

/**
 * px转rem
 */
export function getDprSize(fontSize) {
  let deviceWidth = document.documentElement.clientWidth;
  const tmpWidth = (document.documentElement.clientHeight * 1920) / 1080;
  const designRes = window.screen.width * 9 === window.screen.height * 16; // 实际分辨率
  if (!designRes && window.screen.width * 10 === window.screen.height * 16) {
    // 屏幕分辨率为16：10
    deviceWidth = (document.documentElement.clientWidth * 9) / 10;
  }
  deviceWidth = deviceWidth < tmpWidth ? deviceWidth : tmpWidth;
  return Math.floor((deviceWidth * fontSize) / 1920);
}

/**
 * 判断是否是合法URL
 */
export const isUrl = (path) => {
  const reg = /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/;
  return reg.test(path);
}

/**
 * 获取地址的参数
 */
export const getPageQuery = () => {
  return parse(window?.location?.search?.split('?')[1]);
};

/**
 * 错误处理
 *  */
export const errorHandle = (err) => {
  message.error(err?.msg || err?.message);
};

/**
 * 判断是否为JSON
 * @param {*} str
 */
export function isJSON(str) {
  if (typeof str === 'string') {
    try {
      const obj = JSON.parse(str);
      if (typeof obj === 'object' && obj) {
        return true;
      }
      return false;
    } catch (e) {
      return false;
    }
  }
  return false;
}

/**
 * 空数组
 * @param {*} arr
 */
export function isEmptyArray(arr) {
  if (arr instanceof Array && arr.length > 0) {
    return false;
  }
  return true;
}

/**
 * 空对象
 * @param {*} Object
 */
export function isEmptyObject(obj) {
  if (!obj) {
    return true;
  }
  if (Object.prototype.toString.call(obj) === '[object Object]') {
    if (Object.keys(obj).length === 0) {
      return true;
    }
    return false;
  }
  return false;
}

/**
 * 得到token
 */
export function getProjectToken() {
  return localStorage.getItem(`${PROJECT_KEY}-token`) || '';
}

/**
 * 清空token
 */
export function rmProjectToken() {
  localStorage.removeItem(`${PROJECT_KEY}-token`);
}

/**
 * 计算百分比
 */
export const getProgressValue = (data, total, isMin = true) => {
  let value = Number(Number(data) / Number(total) * 100).toFixed(2);
  if (Number(value) && value < 10 && isMin) {
    value = 10
  }
  if (value > 100) {
    value = 100
  }
  if (value === 'NaN') {
    value = 0
  }
  return value
}

/**
 * 路径获取
 * @param {*} path
 * @returns
 */
export function formatPath(path) {
  const pathReg = new RegExp(window.routerBase === '/' ? '' : window.routerBase, 'g');
  const normalPath = path?.replace(pathReg, '');
  return window.routerBase === '/' ? normalPath : `/${normalPath}`;
}

/**
 * 路径拼接
 * @param {*} path
 * @param {*} query
 * @returns
 */
export function getQueryPath(path = '', query = {}) {
  const normalPath = formatPath(path);
  const search = stringify(query);
  if (search.length) {
    return `${normalPath}?${search}`;
  }
  return normalPath;
}

/**
 * 替换当前路由
 * @param {*} query
 */
export function replaceRoute(query) {
  const { pathname } = window.location;
  history.replace(getQueryPath(pathname, query));
}

/**
 * 获取从start开始到end为止的连续数组
 * end获取不到
 * @param {*} query
 */
export function getContinuousYearArr(start = moment().year(), end = moment().year() + 1) {
  return range(start, end);
}
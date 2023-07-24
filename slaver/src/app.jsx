import { stringify } from 'qs';
import { errorConfig } from './requestErrorConfig';
/**
 * @name request 配置，可以配置错误处理
 * 它基于 axios 和 ahooks 的 useRequest 提供了一套统一的网络请求和错误处理方案。
 * @doc https://umijs.org/docs/max/request#配置
 */
export const request = {
  ...errorConfig,
  paramsSerializer: (params) => stringify(params, { indices: false }),
  // timeout: 3000,
};

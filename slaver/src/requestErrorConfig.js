import { message } from 'antd';
import { history } from '@umijs/max';
import queryString from 'qs';
import { getProjectToken, rmProjectToken } from '@/utils/utils';

const codeMessage = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。',
};

/**
 * @name 错误处理
 * pro 自带的错误处理， 可以在这里做自己的改动
 * @doc https://umijs.org/docs/max/request#配置
 */
export const errorConfig = {
  // 错误处理： umi@3 的错误处理方案。
  errorConfig: {
    // 错误抛出
    // errorThrower: (res) => {},
    // 错误接收及处理
    errorHandler: (error, opts) => {
      if (opts?.skipErrorHandler) throw error;
      // 我们的 errorThrower 抛出的错误。
      if (error.response) {
        // Axios 的错误
        // 请求成功发出且服务器也响应了状态码，但状态代码超出了 2xx 的范围
        const { response } = error;
        if (response.status) {
          const errorText = codeMessage[response.status] || response.statusText;
          const { status, url } = response;

          if (status === 401) {
            message.config({
              maxCount: 1,
            });
            message.error('登录过期，请重新登录');
            rmProjectToken();
            // history.push('/user/login');
            return;
          }
          message.config({
            maxCount: 1,
          });
          message.error(errorText || '请求失败，请重试！');
          return;
        }
        message.config({
          maxCount: 1,
        });
        message.error('您的网络发生异常，无法连接服务器');
        return;
      }
      message.config({
        maxCount: 1,
      });
      message.error('请求失败，请重试！');
    },
  },

  // 请求拦截器
  requestInterceptors: [
    (config) => {
      // 拦截请求配置，进行个性化处理。
      const tokenOptions = getProjectToken() ? { 'admin-auth': `${getProjectToken()}` } : {};
      config.headers = {
        ...tokenOptions,
        ...config.headers,
      };
      return config;
    },
  ],

  // 响应拦截器
  responseInterceptors: [
    (response) => {
      // 拦截响应数据，进行个性化处理
      const { data: res } = response;
      if (res?.code && res?.code !== 200) {
        throw res;
      }
      return response;
    },
  ],
};

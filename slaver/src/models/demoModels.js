import { message } from 'antd';
import { useRequest } from '@umijs/max';
import { demoAxios } from '@/services/demo';

export default () => {
  const {
    run: fetchDemoList,
    data,
    loading: demoLoading,
  } = useRequest((v) => demoAxios(v), {
    manual: true,
    onSuccess: (res) => res,
    onError: (res) => {
      message.error(res?.message || '请求失败');
    },
    // 数据处理
    formatResult: ({ data: res }) => {
      
      return {
        ...res
      };
    },
  });

  return { fetchDemoList, demoLoading, demoList: data };
};

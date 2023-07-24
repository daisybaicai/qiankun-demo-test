import { message } from 'antd';
import { useRequest } from '@umijs/max';
import { fetchRuleList } from '@/services/api';

export default () => {
  const {
    run: fetchTableList,
    data: tableList,
    loading: tableLoading,
    mutate: setTableList,
  } = useRequest((v) => fetchRuleList(v), {
    manual: true,
    onSuccess: (res) => res,
    onError: (res) => {
      message.error(res?.message || '请求失败');
    },
    // 数据处理
    formatResult: ({ data: res }) => {
      const arr = res?.items.map((item, index) => ({
        ...item,
        enabled: index % 2 === 0,
      }));
      return {
        ...res,
        items: arr,
      };
    },
  });

  return { fetchTableList, tableLoading, tableList, setTableList };
};

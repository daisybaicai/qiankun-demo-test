import { useCallback, useState, useRef, useEffect } from 'react';
import { useAntdTable } from 'ahooks';
import { formatArray } from './format';
import { useLocation, useParams, useRouteData, history } from '@umijs/max';
import { getPageQuery } from './utils';

/**
 * 获得页面参数
 * @returns {Object} { location, access, params, route, queryParams,history}
 */
 export function usePageProps() {
  const location = useLocation();
  const params = useParams();
  const { route } = useRouteData();
  const queryParams = getPageQuery();
  return {
    location,
    params,
    route,
    queryParams,
    history,
  };
}

/**
 * 自定义modal hook
 */
 export function useModalParams() {
  const [visible, setVisible] = useState(false);
  const paramsRef = useRef({});
  const hideModal = useCallback(() => {
    setVisible(false);
    paramsRef.current = {};
  }, []);
  const showModal = useCallback(({ ...p }) => {
    paramsRef.current = p;
    setVisible(true);
  }, []);
  return {
    hideModal,
    showModal,
    visible,
    params: paramsRef.current,
    modalProps: {
      open: visible,
      onCancel: hideModal,
      maskClosable: false,
      okText: '确认',
      cancelText: '取消',
      destroyOnClose: true,
    },
  };
}

/**
 * reset form fields when modal is form, closed
 * @param {*} param0
 */
 export function useResetFormOnCloseModal({ form, visible }) {
  const prevVisibleRef = useRef();

  useEffect(() => {
    prevVisibleRef.current = visible;
  }, [visible]);

  const prevVisible = prevVisibleRef.current;

  useEffect(() => {
    if (!visible && prevVisible) {
      form?.resetFields();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);
}

/**
 * @description 表单hooks
 * @param {*} request 表单请求
 * @param {*} options 其他参数
 */
 export function useSearchFormTable(request, options) {
  const {
    form,
    total = 0,
    dataSource = [],
    format = true,
    defaultPageSize = 10,
    showTotal = true,
    paginationProps = {},
    ...rest
  } = options;

  const { tableProps, search, loading, ...returnOptions } = useAntdTable(request, {
    defaultPageSize,
    form,
    ...rest,
  });

  let { pagination } = tableProps;
  const { current, pageSize } = pagination;
  pagination = {
    ...pagination,
    current,
    pageSize,
    showQuickJumper: true,
    showSizeChanger: true,
    total,
    ...paginationProps,
    showTotal: () =>
      showTotal ? `共${total}条记录 第${current}/${Math.ceil(total / pageSize)}页` : '',
  };
  tableProps.pagination = pagination;
  tableProps.dataSource = format ? formatArray(dataSource) : dataSource;

  return {
    tableProps,
    search,
    loading,
    ...returnOptions,
  };
}
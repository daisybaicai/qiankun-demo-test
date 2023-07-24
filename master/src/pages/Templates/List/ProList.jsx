import { message, Button, Modal, Form, Space, Input } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import { useRequest, Link } from '@umijs/max';
import BaseDatePicker from '@/components/BaseDatePicker';
import BasePopconfirm from '@/components/BasePopconfirm';
import { formatTimeToDateSecond } from '@/utils/format';
import { useModalParams, useProTable } from '@/utils/hooks';
import { formatQuery, UrlQueryParamTypes, replaceRoute } from '@/utils/query';
import { getPageQuery, getToolTip } from '@/utils/utils';
import { FORM_ITEM_TYPE, OPERATE_TYPE } from '@/common/enum';
import { fetchRuleList } from '@/services/api';

const urlPropsQueryConfig = {
  name: { type: UrlQueryParamTypes.string },
  updatedAt: { type: UrlQueryParamTypes.string },
  pageNo: { type: UrlQueryParamTypes.number },
  pageSize: { type: UrlQueryParamTypes.number },
};

const ProList = ({
  saveRoutingCache = true, // 查询项是否保留路由，若开启，表单筛查项会显示在页面路由
}) => {
  const {
    run: fetchTableList,
    data: listData,
    loading,
  } = useRequest((v) => fetchRuleList(v), {
    manual: true,
    onError: (res) => {
      message.error(res?.message || '请求失败');
    },
    // 数据处理
    formatResult: ({ data: res }) => {
      const arr = res?.items.map((item, index) => ({
        ...item,
        orderNum: index + 1,
        rowKey: `rowKey-${item?.id}-${index + 1}`,
      }));
      return {
        ...res,
        items: arr,
      };
    },
  });
  const queryParams = formatQuery(getPageQuery(window.location.href), urlPropsQueryConfig);
  const [modalForm] = Form.useForm();
  const modalParams = useModalParams();

  const getTableData = ({ current = 1, pageSize = 10, ...values }) => {
    const payload = {
      pageNo: current,
      pageSize,
      ...values,
    };
    if (saveRoutingCache) {
      replaceRoute(payload);
    }
    return fetchTableList(payload);
  };

  const {
    tableProps,
    refresh,
    search: { submit },
  } = useProTable(getTableData, {
    total: listData?.total,
    dataSource: listData?.items,
    defaultParams: saveRoutingCache
      ? [
          {
            current: queryParams?.pageNo || 1,
            pageSize: queryParams?.pageSize || 10,
          },
          queryParams,
        ]
      : [
          {
            current: 1,
            pageSize: 10,
          },
        ],
  });

  /**
   * 表单提交
   */
  const handleSubmit = () => {
    const operateDesc =
      modalParams.params?.operateType === OPERATE_TYPE.EDIT.code ? '修改' : '新增';
    modalForm.validateFields().then((values) => {
      const payload = {
        ...values,
        id: modalParams.params?.id,
      };
      console.log('payload', payload);
      //TODO: 新增/修改请求
      message.success(`${operateDesc}成功`);
      modalParams.hideModal();
      refresh();
    });
  };

  // 删除规则
  const handleDelete = (id) => {
    console.log('id', id);
    //TODO: 删除请求
    message.success('删除成功');
    refresh();
  };

  const columns = [
    {
      title: '规则名称',
      dataIndex: 'name',
      render: (v) => getToolTip(v, { len: 20 }),
    },
    {
      title: '描述',
      dataIndex: 'desc',
      hideInSearch: true,
    },
    {
      title: '创建时间',
      dataIndex: 'updatedAt',
      render: (v) => formatTimeToDateSecond(v),
      renderFormItem: () => (
        <BaseDatePicker
          type={FORM_ITEM_TYPE.DATE.code}
          placeholder="请选择日期"
          formatTimeStamp={false}
        />
      ),
    },
    {
      title: '操作',
      width: 200,
      fixed: 'right',
      hideInSearch: true,
      render: (_, record) => (
        <Space>
          <Link to={`/templates/detail/${record?.id}`}>详情</Link>
          <Link to={`/templates/form/${record?.id}`}>跳页修改</Link>
          <a
            onClick={() => {
              modalParams.showModal({
                ...record,
                operateType: OPERATE_TYPE.EDIT.code,
                modalProps: {
                  title: '编辑规则',
                },
              });
              if (modalForm && typeof modalForm.setFieldsValue === 'function') {
                modalForm.setFieldsValue(record);
              }
            }}
          >
            编辑
          </a>
          <BasePopconfirm
            title="你确定要删除该条记录吗？"
            handleConfirm={() => handleDelete(record.id)}
          >
            <a>删除</a>
          </BasePopconfirm>
        </Space>
      ),
    },
  ];

  return (
    <PageContainer breadcrumb={null} title="列表应用">
      <ProTable
        {...tableProps}
        columns={columns}
        toolBarRender={() => [
          <Button
            key="add"
            type="primary"
            onClick={() => {
              modalParams.showModal({
                operateType: OPERATE_TYPE.CREATE.code,
                modalProps: {
                  title: '新增规则',
                },
              });
              if (modalForm && typeof modalForm.resetFields === 'function') {
                modalForm.resetFields();
              }
            }}
          >
            <PlusOutlined /> 新增规则
          </Button>,
        ]}
        loading={loading}
      />

      <Modal
        {...modalParams.modalProps}
        title={modalParams.params?.modalProps?.title}
        onOk={handleSubmit}
      >
        <Form form={modalForm} name="drawer-form" labelCol={{ span: 6 }} wrapperCol={{ span: 14 }}>
          <Form.Item
            name="name"
            label="规则名称"
            rules={[
              {
                required: true,
                message: '请输入规则名称',
              },
            ]}
            validateFirst
          >
            <Input placeholder="请输入规则名称" />
          </Form.Item>
          <Form.Item
            name="desc"
            label="描述"
            rules={[
              {
                required: true,
                message: '请输入描述',
              },
            ]}
            validateFirst
          >
            <Input.TextArea placeholder="请输入描述" maxLength={50} />
          </Form.Item>
        </Form>
      </Modal>
    </PageContainer>
  );
};
export default ProList;

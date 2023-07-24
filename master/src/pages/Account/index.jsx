import React from 'react';
import {
  Card,
  Table,
  message,
  Button,
  Modal,
  Form,
  Space,
  Row,
  Col,
  Input,
  Select,
  Badge,
  Drawer,
} from 'antd';
import { PlusOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-components';
import { useModel, Access } from '@umijs/max';
import BasePopconfirm from '@/components/BasePopconfirm';
import MenuTree from '@/components/MenuTree';
import { formatTimeToDateSecond } from '@/utils/format';
import { useSearchFormTable, useModalParams, usePageProps } from '@/utils/hooks';
import { defaultKeys } from '@/utils/menu';
import { formatQuery, UrlQueryParamTypes, replaceRoute } from '@/utils/query';
import { getPageQuery } from '@/utils/utils';
import { LIST_FORM_LAYOUT, ACCOUNT_STATUS_MAP, OPERATE_TYPE, ACTION_TYPE } from '@/common/enum';

const urlPropsQueryConfig = {
  name: { type: UrlQueryParamTypes.string },
  enabled: { type: UrlQueryParamTypes.boolean },
  pageNo: { type: UrlQueryParamTypes.number },
  pageSize: { type: UrlQueryParamTypes.number },
};

export default function Account({
  saveRoutingCache = true, // 查询项是否保留路由，若开启，表单筛查项会显示在页面路由
}) {
  const { route = {}, access = {} } = usePageProps();

  const { fetchTableList, tableList } = useModel('tableList');
  const queryParams = formatQuery(getPageQuery(window.location.href), urlPropsQueryConfig);

  const [form] = Form.useForm();
  const [modalForm] = Form.useForm();
  const modalParams = useModalParams();

  const getTableData = ({ current = 1, pageSize = 10 }, formData) => {
    const payload = {
      pageNo: current,
      pageSize,
      ...formData,
    };
    if (saveRoutingCache) {
      replaceRoute(payload);
    }
    return fetchTableList(payload);
  };

  const {
    tableProps,
    refresh,
    search: { reset, submit },
  } = useSearchFormTable(getTableData, {
    form,
    paginated: true,
    total: tableList?.total,
    dataSource: tableList?.items,
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

  // 启用/禁用用户
  const handleOperateStatus = (item) => {
    const operate = item.enabled ? '禁用' : '启用';
    Modal.confirm({
      title: `您确定${operate}该用户吗`,
      okText: '确定',
      cancelText: '取消',
      icon: <QuestionCircleOutlined />,
      onOk: () => {
        // TODO: 启用/禁用用户请求
        message.success(`${operate}成功`);
        submit();
      },
    });
  };

  // 表单提交
  const handleSubmit = () => {
    const operateDesc =
      modalParams.params?.operateType === OPERATE_TYPE.EDIT.code ? '修改' : '新增';

    modalForm.validateFields().then((values) => {
      const payload = {
        ...values,
        id: modalParams.params?.id,
      };
      console.log('payload', payload);
      // TODO: 新增/修改请求
      message.success(`${operateDesc}成功`);
      modalParams.hideModal();
      refresh();
    });
  };

  // 删除用户
  const handleDelete = (id) => {
    console.log('id', id);
    // TODO: 删除请求
    message.success('删除成功');
    refresh();
  };

  const columns = [
    {
      title: '用户名称',
      dataIndex: 'name',
    },
    {
      title: '创建时间',
      dataIndex: 'updatedAt',
      render: (v) => formatTimeToDateSecond(v),
    },
    {
      title: '用户状态',
      dataIndex: 'enabled',
      render: (v) => (
        <Badge color={ACCOUNT_STATUS_MAP[v]?.color} text={ACCOUNT_STATUS_MAP[v]?.desc} />
      ),
    },
    {
      title: '操作',
      width: 200,
      render: (_, record) => (
        <Space>
          <a
            onClick={() => handleOperateStatus(record)}
            style={{ color: record.enabled ? '#DE3535' : '#6BC251' }}
          >
            {record.enabled ? '禁用' : '启用'}
          </a>
          <Access accessible={access.canOperate(route.key, ACTION_TYPE.UPDATE.code)}>
            <a
              onClick={() => {
                modalParams.showModal({
                  ...record,
                  operateType: OPERATE_TYPE.EDIT.code,
                  modalProps: {
                    title: '编辑用户',
                  },
                });
                if (modalForm && typeof modalForm.setFieldsValue === 'function') {
                  modalForm.setFieldsValue(record);
                }
              }}
            >
              编辑
            </a>
          </Access>
          <Access accessible={access.canOperate(route.key, ACTION_TYPE.DELETE.code)}>
            <BasePopconfirm handleConfirm={() => handleDelete(record.id)}>
              <a>删除</a>
            </BasePopconfirm>
          </Access>
        </Space>
      ),
    },
  ];

  const searchForm = (
    <Form form={form} name="search">
      <Row gutter={24}>
        <Col {...LIST_FORM_LAYOUT} xl={8}>
          <Form.Item label="用户名称" name="name">
            <Input placeholder="请输入" />
          </Form.Item>
        </Col>
        <Col {...LIST_FORM_LAYOUT} xl={8}>
          <Form.Item label="用户状态" name="enable">
            <Select placeholder="请选择" allowClear>
              {[ACCOUNT_STATUS_MAP.true, ACCOUNT_STATUS_MAP.false].map((item) => (
                <Select.Option value={item.code} key={item.code}>
                  {item.desc}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col {...LIST_FORM_LAYOUT} sm={24} xl={8} style={{ textAlign: 'right' }}>
          <Space style={{ marginBottom: 24 }}>
            <Button style={{ marginLeft: 8 }} onClick={reset}>
              重置
            </Button>
            <Button type="primary" htmlType="submit" onClick={submit}>
              搜索
            </Button>
          </Space>
        </Col>
      </Row>
    </Form>
  );

  return (
    <PageContainer breadcrumb={null} title="用户管理">
      <Card bordered={false} className="search">
        {searchForm}
      </Card>
      <Card bordered={false} style={{ marginTop: 24 }}>
        <Access accessible={access.canOperate(route.key, ACTION_TYPE.ADD.code)}>
          <Button
            type="primary"
            onClick={() => {
              modalParams.showModal({
                operateType: OPERATE_TYPE.CREATE.code,
                modalProps: {
                  title: '新增用户',
                },
                // 默认勾选全部
                menuData: defaultKeys,
              });
              if (modalForm && typeof modalForm.resetFields === 'function') {
                modalForm.resetFields();
              }
            }}
            style={{ marginBottom: 20, float: 'right' }}
          >
            <PlusOutlined /> 新增用户
          </Button>
        </Access>
        <Table columns={columns} rowKey={(r) => r.id} {...tableProps} className="myTable" />
        <Drawer
          {...modalParams.modalProps}
          title={modalParams.params?.modalProps?.title}
          onClose={modalParams.modalProps.onCancel}
          maskClosable={true}
          width={500}
          footer={
            <div
              style={{
                textAlign: 'right',
              }}
            >
              <Button type="primary" onClick={handleSubmit}>
                {modalParams.params?.modalProps?.title}
              </Button>
              <Button onClick={modalParams.hideModal} style={{ marginLeft: 8 }}>
                取消
              </Button>
            </div>
          }
        >
          <Form
            form={modalForm}
            name="drawer-form"
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 14 }}
          >
            <Form.Item
              name="name"
              label="用户名称"
              rules={[
                {
                  required: true,
                  message: '请输入用户名称',
                },
              ]}
              validateTrigger="onChange"
              validateFirst
            >
              <Input placeholder="请输入用户名称" maxLength={50} />
            </Form.Item>
            <Form.Item
              label="菜单权限"
              name="menuData"
              rules={[
                {
                  required: true,
                  message: '请至少选择一项菜单',
                },
              ]}
            >
              <MenuTree initialMenuData={modalParams?.params?.menuData} />
            </Form.Item>
          </Form>
        </Drawer>
      </Card>
    </PageContainer>
  );
}

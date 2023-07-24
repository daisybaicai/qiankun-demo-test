import React from 'react';
import { Card, message, Button, Modal, Form, Space, Row, Col, Input } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-components';
import { useRequest, Link } from '@umijs/max';
import BasePopconfirm from '@/components/BasePopconfirm';
import TreeTable from '@/components/TreeMap/TreeTable';
import { useSearchFormTable, useModalParams } from '@/utils/hooks';
import { formatQuery, UrlQueryParamTypes, replaceRoute } from '@/utils/query';
import { getPageQuery } from '@/utils/utils';
import { LIST_FORM_LAYOUT, OPERATE_TYPE } from '@/common/enum';
import { fetchRuleList } from '@/services/api';

const urlPropsQueryConfig = {
  name: { type: UrlQueryParamTypes.string },
  pageNo: { type: UrlQueryParamTypes.number },
  pageSize: { type: UrlQueryParamTypes.number },
};

const TreeList = ({
  saveRoutingCache = true, // 查询项是否保留路由，若开启，表单筛查项会显示在页面路由
}) => {
  // mock数据
  const treeData = [
    {
      id: 1,
      name: '河南投资集团有限公司',
      age: 60,
      address: 'New York No. 1 Lake Park',
      children: [
        {
          id: 11,
          // name: '河南省天然气管网有限公司河南省天然气管网有限公司河南省天然气管网有限公司河南省天然气管网有限公司',
          name: '河南省天然气管网有限公司',
          age: 42,
          address: 'New York No. 2 Lake Park',
        },
        {
          id: 12,
          name: '郑州豫能热电有限公司',
          age: 42,
          address: 'New York No. 2 Lake Park',
        },
        {
          id: 13,
          name: '河南豫能控股股份有限公司',
          age: 30,
          address: 'New York No. 3 Lake Park',
          children: [
            {
              id: 131,
              name: '濮阳豫能发电有限责任公司',
              age: 16,
              address: 'New York No. 3 Lake Park',
            },
            {
              id: 132,
              name: '鹤壁鹤淇发电有限责任公司',
              age: 16,
              address: 'New York No. 3 Lake Park',
            },
          ],
        },
        {
          id: 14,
          name: '焦作天力电力投资有限公司',
          age: 42,
          address: 'New York No. 2 Lake Park',
        },
        {
          id: 15,
          name: '河南省电力集团有限公司',
          age: 30,
          address: 'New York No. 3 Lake Park',
          children: [
            {
              id: 151,
              name: '222',
              age: 16,
              address: 'New York No. 3 Lake Park',
            },
            {
              id: 152,
              name: '333',
              age: 16,
              address: 'New York No. 3 Lake Park',
            },
          ],
        },
      ],
    },
    {
      id: 2,
      name: '国网河南省电力公司',
      age: 32,
      address: 'Sydney No. 1 Lake Park',
    },
    {
      id: 3,
      name: '111',
      age: 32,
      address: 'Sydney No. 1 Lake Park',
      children: [
        {
          id: 31,
          name: '222',
          age: 16,
          address: 'New York No. 3 Lake Park',
        },
        {
          id: 32,
          name: '333',
          age: 16,
          address: 'New York No. 3 Lake Park',
        },
      ],
    },
  ];

  const { run: fetchTableList, data: listData } = useRequest((v) => fetchRuleList(v), {
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
        // items: arr,
        // mock数据
        items: treeData,
      };
    },
  });
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
    },
    {
      title: '描述',
      dataIndex: 'address',
    },
    {
      title: '操作',
      width: 200,
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

  const renderSearchForm = () => (
    <Form form={form} name="search">
      <Row gutter={24}>
        <Col {...LIST_FORM_LAYOUT} xl={8}>
          <Form.Item label="规则名称" name="name">
            <Input placeholder="请输入" />
          </Form.Item>
        </Col>
        <Col {...LIST_FORM_LAYOUT} xl={16} style={{ textAlign: 'right' }}>
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
    <PageContainer breadcrumb={null} title="列表应用">
      <Card bordered={false} className="search">
        {renderSearchForm()}
      </Card>
      <Card bordered={false} style={{ marginTop: 24 }}>
        <Button
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
          style={{ marginBottom: 20, float: 'right' }}
        >
          <PlusOutlined /> 新增规则
        </Button>
        <TreeTable
          tableKey={new Date().getTime()}
          treeKey="name"
          columns={columns}
          rowKey="rowKey"
          className="myTable"
          tableProps={{ ...tableProps }}
          padding={8}
        />
        <Modal
          {...modalParams.modalProps}
          title={modalParams.params?.modalProps?.title}
          onOk={handleSubmit}
        >
          <Form
            form={modalForm}
            name="drawer-form"
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 14 }}
          >
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
      </Card>
    </PageContainer>
  );
};
export default TreeList;

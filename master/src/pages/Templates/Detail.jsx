import React, { useRef } from 'react';
import { Button, Card, message, Popconfirm } from 'antd';
import { PageContainer } from '@ant-design/pro-components';
import { useMount, useRequest } from 'ahooks';
import BaseBreadcrumb from '@/components/BaseBreadcrumb';
import { formatObject } from '@/utils/format';
import { usePageProps } from '@/utils/hooks';
import { fetchRuleDetail } from '@/services/api';
import TemplatesForm from './components/ProForm';

export default function Detail() {
  const { route = {}, params = {} } = usePageProps();
  const { operateForm = false } = route;
  useMount(() => {
    window.scrollTo(0, 0);
  });
  const formRef = useRef();
  const {
    loading,
    data: detail,
    run: getDetail,
  } = useRequest(
    (v) =>
      fetchRuleDetail({
        id: params?.id,
        ...v,
      }),
    {
      onError: (res) => {
        message.error(res?.message || '请求失败');
      },
      // 数据处理
      formatResult: ({ data: res }) => {
        return formatObject(res);
      },
    },
  );

  const handleSave = () => {
    const values = formRef.current?.getFieldsValue();
    console.log('🚀 ~ file: Detail.jsx:36 ~ handleSave ~ values', values);
    // TODO: 保存请求
    getDetail();
    message.success('保存成功');
  };

  const handleSubmit = () => {
    formRef.current?.submit((values) => {
      console.log('🚀 ~ file: Detail.jsx:44 ~ handleSubmit ~ values', values);
      // TODO: 提交请求
      getDetail();
      message.success('提交成功');
    });
  };

  return (
    <PageContainer
      title="列表详情"
      breadcrumbRender={({ breadcrumb: { routes } }) => {
        return <BaseBreadcrumb breadcrumb={routes} />;
      }}
      loading={loading}
      footer={
        operateForm && [
          <Button key="save" onClick={handleSave}>
            保存
          </Button>,
          <Popconfirm title="确认提交吗？" key="submit" onConfirm={handleSubmit}>
            <Button key="submit" type="primary">
              提交
            </Button>
          </Popconfirm>,
        ]
      }
    >
      <Card bordered={false}>
        <TemplatesForm ref={formRef} readonly={!operateForm} value={detail} />
      </Card>
    </PageContainer>
  );
}

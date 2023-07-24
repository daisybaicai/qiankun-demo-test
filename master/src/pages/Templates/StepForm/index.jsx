import { Tabs } from 'antd';
import { PageContainer } from '@ant-design/pro-components';
import RegisterStep from './RigisterStep';

export default function () {
  const menus = [
    // {
    //   label: '示例一',
    //   key: 'normal-list',
    //   children: <List />,
    // },
    {
      label: '注册示例',
      key: 'register-step',
      children: <RegisterStep />,
    },
  ];

  return (
    <PageContainer breadcrumb={null} title="分布表单">
      <Tabs
        tabPosition="right"
        items={menus}
        centered
        tabBarStyle={{ background: '#f6f6f6', paddingTop: 20 }}
      />
    </PageContainer>
  );
}

import { Tabs } from 'antd';
import List from './List';
import ProEditList from './ProEditList';
import ProList from './ProList';
import TreeList from './TreeList';

export default function () {
  const menus = [
    {
      label: '普通列表',
      key: 'normal-list',
      children: <List />,
    },
    {
      label: 'pro列表',
      key: 'pro-list',
      children: <ProList />,
    },
    {
      label: 'pro编辑列表',
      key: 'pro-edit-list',
      children: <ProEditList />,
    },
    {
      label: '树级列表',
      key: 'tree-list',
      children: <TreeList />,
    },
  ];

  return (
    <Tabs
      tabPosition="right"
      items={menus}
      centered
      tabBarStyle={{ background: '#f6f6f6', paddingTop: 20 }}
    />
  );
}

## NoticeIcon 消息通知组件

### NoticeIcon API

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| useTabs | 是否使用标签页展示 | `boolean` | `true` |
| useCustom | 是否使用自定义列表展示 | `boolean` | `false` |
| count | 未读通知数量 | `number` | - |
| bell | 消息通知图标 | `ReactNode` | - |
| onTabChange | 通知 Tab 的切换 | `(tabTile: string) => void;` | - |
| onItemClick | 未读消息列被点击 | `(item, tabProps) => void` | - |
| emptyImage | 缺省图片（所有 tab 通用） | `ReactNode` | - |
| emptyText | 缺省文本（所有 tab 通用） | `string` | `暂无未读消息` |
| closeText | 标记已读按钮文本（所有 tab 通用） | `string` | `我知道了` |
| showClose | 是否展示标记已读按钮（所有 tab 通用） | `boolean` | `true` |
| dataMap | 数据映射（所有 tab 通用） | `object` | - |
| footer | 底部按钮（所有 tab 通用） | `ReactNode` | `[]` |
| loading | 是否加载 | `boolean` | `false` |
| className | 消息通知按钮样式 | `string` | `-` |

### NoticeIcon.Tab API

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| list | 通知信息的列表 | `array` | - |
| onClick | 子项的单击事件：当`` showClose`为`true`，事件绑定在标记已读按钮上；当 ``showClose`为`true`，事件绑定在标记子项上 | `(item) => void` | - |
| onClickDetail | 子项标题的点击(查看详情) | `(item) => void` | - |
| emptyImage | 缺省图片 | `ReactNode` | - |
| emptyText | 缺省文本 | `string` | - |
| closeText | 标记已读按钮文本 | `string` | `我知道了` |
| showClose | 是否展示标记已读按钮 | `boolean` | `true` |
| titleClassName | 标题样式 | `string` | - |
| descClassName | 详情样式 | `string` | - |
| timeClassName | 时间样式 | `string` | - |
| dataMap | 数据映射 | `object` | - |
| footer | 底部按钮 | `ReactNode` | `[]` |

### 使用方式

#### 1、使用标签页展示

`useCustom`为`false`（默认），`useTabs`为`true`（默认），使用多个`NoticeIcon.Tab`组件展示不同的 tab 页数据

```jsx
import { message } from 'antd';
import NoticeIcon from '@/components/NoticeIcon/NoticeIcon';

export default () => {
  const list = [
    {
      id: '000000001',
      avatar: 'https://gw.alipayobjects.com/zos/rmsportal/ThXAXghbEsBCCSDihZxY.png',
      title: '你收到了 14 份新周报',
      datetime: '2017-08-09',
      type: 'notification',
    },
    {
      id: '000000002',
      avatar: 'https://gw.alipayobjects.com/zos/rmsportal/OKJXDXrmkNshAMvwtvhu.png',
      title: '你推荐的 曲妮妮 已通过第三轮面试',
      datetime: '2017-08-08',
      type: 'notification',
    },
  ];

  const notices = {
    notification: list,
    message: list,
    event: list,
  };
  return (
    <NoticeIcon
      useCustom={false}
      useTabs={true}
      count={6}
      onItemClick={(item) => message.info(`${item.title} 被点击了`)}
      footer={[
        <div onClick={() => message.info('清空所有消息')} key="clear">
          清空所有消息
        </div>,
        <div onClick={() => message.info('查看更多')} key="viewMore">
          查看更多
        </div>,
      ]}
    >
      <NoticeIcon.Tab
        tabKey="notification"
        count={2}
        list={notices.notification}
        title="通知"
        emptyText="你已查看所有通知"
        onClickDetail={() => message.info('查看通知详情')}
      />
      <NoticeIcon.Tab
        tabKey="message"
        count={2}
        list={notices.message}
        title="消息"
        emptyText="您已读完所有消息"
        onClickDetail={() => message.info('查看消息详情')}
      />
      <NoticeIcon.Tab
        tabKey="event"
        count={2}
        list={notices.event}
        title="待办"
        emptyText="你已完成所有待办"
        onClickDetail={() => message.info('查看待办详情')}
      />
    </NoticeIcon>
  );
};
```

#### 2、不使用标签页展示

`useCustom`为`false`（默认），`useTabs`为`false`，使用一个`NoticeIcon.Tab`组件展示所有数据

```jsx
import { message } from 'antd';
import NoticeIcon from '@/components/NoticeIcon/NoticeIcon';

export default () => {
  const list = [
    {
      id: '000000001',
      avatar: 'https://gw.alipayobjects.com/zos/rmsportal/ThXAXghbEsBCCSDihZxY.png',
      title: '你收到了 14 份新周报',
      datetime: '2017-08-09',
      type: 'notification',
    },
    {
      id: '000000002',
      avatar: 'https://gw.alipayobjects.com/zos/rmsportal/OKJXDXrmkNshAMvwtvhu.png',
      title: '你推荐的 曲妮妮 已通过第三轮面试',
      datetime: '2017-08-08',
      type: 'notification',
    },
  ];

  return (
    <NoticeIcon
      useCustom={false}
      useTabs={false}
      count={2}
      onItemClick={(item) => message.info(`${item.title} 被点击了`)}
      footer={[
        <div onClick={() => message.info('清空所有消息')} key="clear">
          清空所有消息
        </div>,
        <div onClick={() => message.info('查看更多')} key="viewMore">
          查看更多
        </div>,
      ]}
    >
      <NoticeIcon.Tab count={2} list={list} emptyText="你已查看所有通知" />
    </NoticeIcon>
  );
};
```

#### 3、自定义列表

`useCustom`为`true`，`NoticeIcon`元素内部自定义需要展示的列表样式

```jsx
import { message } from 'antd';
import NoticeIcon from '@/components/NoticeIcon/NoticeIcon';

export default () => {
  const list = [
    {
      id: '000000001',
      avatar: 'https://gw.alipayobjects.com/zos/rmsportal/ThXAXghbEsBCCSDihZxY.png',
      title: '你收到了 14 份新周报',
      datetime: '2017-08-09',
      type: 'notification',
    },
    {
      id: '000000002',
      avatar: 'https://gw.alipayobjects.com/zos/rmsportal/OKJXDXrmkNshAMvwtvhu.png',
      title: '你推荐的 曲妮妮 已通过第三轮面试',
      datetime: '2017-08-08',
      type: 'notification',
    },
  ];

  return (
    <NoticeIcon useCustom={true} count={2}>
      <div>自定义样式</div>
    </NoticeIcon>
  );
};
```

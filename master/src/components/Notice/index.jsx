import React, { useEffect, useState } from 'react';
import { message, Tag } from 'antd';
import { useRequest } from '@umijs/max';
import { groupBy } from 'lodash';
import { getNotices } from '@/services/api';
import NoticeIcon from './NoticeIcon';
import styles from './index.less';

const NoticeIconView = React.memo(() => {
  const [unreadNum, setUnreadNum] = useState(0);
  const [notices, setNotices] = useState([]);
  // 获取消息列表
  const { data } = useRequest(getNotices);

  useEffect(() => {
    setNotices(data ? data.filter((item) => !item.read) : []);
    setUnreadNum(data ? data.filter((item) => !item.read)?.length : 0);
  }, [data]);

  // 处理消息列表数据
  const getNoticeData = (noticesList) => {
    if (!noticesList || noticesList.length === 0 || !Array.isArray(noticesList)) {
      return {};
    }

    const newNotices = noticesList.map((notice) => {
      const newNotice = { ...notice };

      if (newNotice.id) {
        newNotice.key = newNotice.id;
      }

      if (newNotice.extra && newNotice.status) {
        const color = {
          todo: '',
          processing: 'blue',
          urgent: 'red',
          doing: 'gold',
        }[newNotice.status];
        newNotice.extra = (
          <Tag
            color={color}
            style={{
              marginRight: 0,
            }}
          >
            {newNotice.extra}
          </Tag>
        );
      }

      return newNotice;
    });
    return groupBy(newNotices, 'type');
  };

  // 获取各tab未读数量
  const getUnreadData = (noticeData) => {
    const unreadMsg = {};
    Object.keys(noticeData).forEach((key) => {
      const value = noticeData[key];

      if (!unreadMsg[key]) {
        unreadMsg[key] = 0;
      }

      if (Array.isArray(value)) {
        unreadMsg[key] = value.filter((item) => !item.read).length;
      }
    });
    return unreadMsg;
  };

  // 单条消息标记为已读
  const changeReadState = (id) => {
    const newNotice = notices.map((item) => {
      const notice = { ...item };
      if (notice.id === id) {
        notice.read = true;
      }
      return notice;
    });
    setNotices(newNotice.filter((item) => !item.read));
    setUnreadNum(newNotice.filter((item) => !item.read)?.length);
  };

  // 清空消息列表
  const clearReadState = () => {
    const newNotice = notices.map((item) => {
      const notice = { ...item };
      notice.read = true;
      return notice;
    });
    setNotices(newNotice.filter((item) => !item.read));
    setUnreadNum(newNotice.filter((item) => !item.read)?.length);
    message.success('消息已清空');
  };

  const noticeData = getNoticeData(notices);
  const unreadMsg = getUnreadData(noticeData || {});

  return (
    <NoticeIcon
      useCustom={false}
      useTabs
      count={unreadNum}
      className={styles.action}
      onItemClick={(item) => changeReadState(item.id)}
      footer={[
        <div onClick={() => clearReadState()} key="clear">
          清空所有消息
        </div>,
        <div onClick={() => message.info('查看更多')} key="viewMore">
          查看更多
        </div>,
      ]}
    >
      <NoticeIcon.Tab
        tabKey="notification"
        count={unreadMsg.notification}
        list={noticeData.notification}
        title="通知"
        emptyText="你已查看所有通知"
      />
      <NoticeIcon.Tab
        tabKey="message"
        count={unreadMsg.message}
        list={noticeData.message}
        title="消息"
        emptyText="你已读完所有消息"
        onClickDetail={() => message.info('查看详情')}
      />
      <NoticeIcon.Tab
        tabKey="event"
        title="待办"
        emptyText="你已完成所有待办"
        count={unreadMsg.event}
        list={noticeData.event}
      />
    </NoticeIcon>
  );
});

export default NoticeIconView;

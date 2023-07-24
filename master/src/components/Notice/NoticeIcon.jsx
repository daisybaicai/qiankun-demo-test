import React, { useState } from 'react';
import { Badge, Spin, Tabs } from 'antd';
import { BellOutlined } from '@ant-design/icons';
import classNames from 'classnames';
import HeaderDropdown from '../HeaderDropdown';
import NoticeList from './NoticeList';
import styles from './index.less';

const NoticeIcon = ({
  useCustom = false, // 是否使用自定义列表展示
  useTabs = true, // 是否使用标签页展示
  count: allCount, // 未读通知数量
  bell, // 消息通知图标
  onTabChange, // tab切换
  onItemClick, // 子项的单击事件
  emptyImage: allEmptyImage, // 缺省图片（所有 tab 通用）
  emptyText: allEmptyText, // 缺省文本（所有 tab 通用）
  closeText: allCloseText, // 标记已读按钮文本（所有 tab 通用）
  showClose: allShowClose, // 是否展示标记已读按钮（所有 tab 通用）
  dataMap: allDataMap, // 数据映射（所有 tab 通用）
  footer: allFooter, // 底部按钮（所有 tab 通用）
  className, // 消息通知按钮样式
  loading = false, // 是否加载
  children,
}) => {
  const getNotificationBox = () => {
    if (!children) {
      return null;
    }
    const panes = [];
    let listDom;
    React.Children.forEach(children, (child) => {
      if (!child) {
        return;
      }
      const {
        tabKey,
        list,
        title,
        count,
        onClickDetail,
        emptyImage,
        emptyText,
        closeText,
        showClose,
        titleClassName,
        descClassName,
        timeClassName,
        dataMap,
        footer,
      } = child.props;
      const len = list && list.length ? list.length : 0;
      const msgCount = count || count === 0 ? count : len;
      const tabTitle = msgCount > 0 ? `${title} (${msgCount})` : title;
      listDom = (
        <NoticeList
          tabKey={tabKey}
          list={list}
          onClick={onItemClick ? (item) => onItemClick(item, child.props) : null}
          onClickDetail={onClickDetail ? (item) => onClickDetail(item, child.props) : null}
          emptyImage={emptyImage || allEmptyImage}
          emptyText={emptyText || allEmptyText}
          closeText={closeText || allCloseText}
          showClose={showClose || allShowClose}
          titleClassName={titleClassName}
          descClassName={descClassName}
          timeClassName={timeClassName}
          dataMap={dataMap || allDataMap}
          footer={footer || allFooter}
        />
      );
      panes.push({
        label: tabTitle,
        key: tabKey,
        children: listDom,
      });
    });
    return (
      <>
        <Spin spinning={loading} delay={300}>
          {/* eslint-disable-next-line no-nested-ternary */}
          {useCustom ? (
            <div>{children}</div>
          ) : useTabs ? (
            <Tabs className={styles.tabs} onChange={onTabChange} items={panes} />
          ) : (
            <div>{listDom}</div>
          )}
        </Spin>
      </>
    );
  };

  const [visible, setVisible] = useState(false);
  const noticeButtonClass = classNames(className, styles.noticeButton);
  const notificationBox = getNotificationBox();
  const NoticeBellIcon = bell || <BellOutlined className={styles.icon} />;
  const trigger = (
    <span className={classNames(noticeButtonClass, { opened: visible })}>
      <Badge count={allCount} style={{ boxShadow: 'none' }} className={styles.badge}>
        {NoticeBellIcon}
      </Badge>
    </span>
  );
  if (!notificationBox) {
    return trigger;
  }

  return (
    <HeaderDropdown
      placement="bottomRight"
      dropdownRender={() => notificationBox}
      overlayClassName={styles.popover}
      trigger={['click']}
      open={visible}
      onOpenChange={setVisible}
    >
      {trigger}
    </HeaderDropdown>
  );
};

NoticeIcon.Tab = NoticeList;

export default NoticeIcon;

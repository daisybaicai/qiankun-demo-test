import React from 'react';
import { Avatar, List } from 'antd';
import classNames from 'classnames';
import { isEmptyArray } from '@/utils/utils';
import styles from './NoticeList.less';

const NoticeList = ({
  list = [], // 通知信息的列表
  onClick, // 子项的单击事件
  onClickDetail, // 子项标题的点击(查看详情)
  emptyImage, // 缺省图片
  emptyText = '暂无未读消息', // 缺省文本
  closeText = '我知道了', // 标记已读按钮文本
  showClose = true, // 是否展示标记已读按钮
  titleClassName, // 标题样式
  descClassName, // 详情样式
  timeClassName, // 时间样式
  dataMap = {
    // 数据映射
    key: 'key',
    avatar: 'avatar',
    title: 'title',
    description: 'description',
    datetime: 'datetime',
    type: 'type',
    read: 'read',
  },
  footer = [], // 底部按钮
}) => {
  if (!list || list.length === 0) {
    return (
      <div className={styles.notFound}>
        <img
          src={emptyImage || 'https://gw.alipayobjects.com/zos/rmsportal/sAuJeJzSKbUmHfBQRzmZ.svg'}
          alt="not found"
        />
        <div>{emptyText}</div>
      </div>
    );
  }
  return (
    <div>
      <List
        className={styles.list}
        dataSource={list}
        renderItem={(item, i) => {
          const itemCls = classNames(styles.item, {
            [styles.read]: item[dataMap.read],
          });
          const titleCls = classNames(styles.title, titleClassName);
          const descCls = classNames(styles.description, descClassName);
          const timeCls = classNames(styles.datetime, timeClassName);

          // eslint-disable-next-line no-nested-ternary
          const leftIcon = item[dataMap.avatar] ? (
            typeof item[dataMap.avatar] === 'string' ? (
              <Avatar className={styles.avatar} src={item[dataMap.avatar]} />
            ) : (
              <span className={styles.iconElement}>{item[dataMap.avatar]}</span>
            )
          ) : null;

          return (
            <List.Item
              className={itemCls}
              key={item[dataMap.key] || i}
              onClick={() => {
                if (!showClose) {
                  onClick?.(item);
                }
              }}
            >
              <List.Item.Meta
                className={styles.meta}
                avatar={leftIcon}
                title={
                  <div className={titleCls}>
                    <div className={styles.titleBox}>
                      <div>
                        {onClickDetail ? (
                          <a
                            onClick={(e) => {
                              e.stopPropagation();
                              onClickDetail?.(item);
                            }}
                          >
                            {item[dataMap.title]}
                          </a>
                        ) : (
                          item[dataMap.title]
                        )}
                      </div>
                      <div className={styles.extra}>{item[dataMap.extra]}</div>
                    </div>
                  </div>
                }
                description={
                  <div>
                    <div className={descCls}>{item[dataMap.description]}</div>
                    <div className={styles.dateTimeBox}>
                      <div className={timeCls}>{item[dataMap.datetime]}</div>
                      {showClose ? (
                        <a
                          onClick={(e) => {
                            e.stopPropagation();
                            onClick?.(item);
                          }}
                        >
                          {closeText}
                        </a>
                      ) : (
                        ''
                      )}
                    </div>
                  </div>
                }
              />
            </List.Item>
          );
        }}
      />
      {!isEmptyArray(footer) && <div className={styles.bottomBar}>{footer}</div>}
    </div>
  );
};

export default NoticeList;

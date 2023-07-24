import React, { useEffect, useRef } from 'react';
import { ScrollToHOC, ScrollArea } from 'react-scroll-to';
import styles from './index.less';
import Empty from '@/components/Empty';
import { isEmptyArray } from '../../utils/utils';

const ScrollList = React.memo(
  ({
    scroll,
    data = [],
    style = {},
    intervalTime = 1000,
    renderList = () => {},
    onScrollBottom = () => {},
    showScrollBar = false,
    listKey = 'scroll-list',
    height = '4rem',
  }) => {
    const timeRef = useRef();

    const handleScrollBottom = dom => {
      if (showScrollBar) {
        scroll({
          y: 0,
          smooth: true,
        });
        onScrollBottom();
        return;
      }
      dom.scrollTop = 0;
      onScrollBottom();
    };
    const handleScroll = () => {
      const cardScorll = document.getElementById(`scroll-list-${listKey}`);
      if (cardScorll) {
        const { scrollHeight, scrollTop, clientHeight } = cardScorll;
        const cardsection = document.getElementsByName(`scroll-list-item-${listKey}`);
        const scrollH = showScrollBar ? cardsection[0].clientHeight : 1;
        if (scrollHeight - (scrollTop + clientHeight) <= 1) {
          // 滑到底部
          handleScrollBottom(cardScorll);
        } else {
          scroll({
            y: scrollTop + scrollH,
            smooth: true,
          });
        }
      }
    };

    useEffect(() => {
      if (timeRef.current) {
        clearInterval(timeRef.current);
      }
      if (intervalTime) {
        timeRef.current = setInterval(handleScroll, showScrollBar ? intervalTime : 50);
      }
      return () => {
        clearInterval(timeRef.current);
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [intervalTime, showScrollBar]);

    return (
      <div className={styles.scrollList} style={{ height: '100%', ...style }}>
        {isEmptyArray(data) ? (
          <div className="animated fadeIn slower" key={listKey} style={{ height: '100%' }}>
            <Empty style={{ height: '100%' }} />
          </div>
        ) : (
          <div className="animated fadeIn slower" key={listKey}>
            <ScrollArea
              className={styles.container}
              style={{ height }}
              id={`scroll-list-${listKey}`}
            >
              {data.map((item, index) => (
                <section name={`scroll-list-item-${listKey}`} key={item.name}>
                  {renderList(item, index)}
                </section>
              ))}
            </ScrollArea>
          </div>
        )}
      </div>
    );
  },
);

export default ScrollToHOC(ScrollList);

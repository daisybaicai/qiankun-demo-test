import React from 'react';
import { history } from '@umijs/max';
import styles from './index.less';

const BaseBreadcrumb = React.memo(({ breadcrumb = [], splitIcon = '/' }) => {
  const handleLink = (path, index) => {
    const routePathArr =
      localStorage.getItem(`${window.projectKey}-route-history`) &&
      JSON.parse(localStorage.getItem(`${window.projectKey}-route-history`)) instanceof Array
        ? JSON.parse(localStorage.getItem(`${window.projectKey}-route-history`))
        : [];
    let item = routePathArr.reverse().find((v) => {
      const [p] = v?.split('?');
      return p === path;
    });
    if (!item) {
      let popLen = breadcrumb?.length;
      let total = 0;
      const data = routePathArr.reverse();
      while (popLen > 0) {
        popLen -= 1;
        const val = data.pop();
        const [p] = val?.split('?');
        if (p === path || p.indexOf(path) > -1) {
          item = val;
          break;
        }
        if (p.indexOf(path) > -1) {
          total += 1;
          if (total + index === breadcrumb?.length) {
            item = val;
            break;
          }
        }
      }
    }
    history.replace(item || path);
  };
  return breadcrumb instanceof Array ? (
    <div className={styles.breadcrumb}>
      {breadcrumb.map((item, index) => (
        <div key={item.title || item.breadcrumbName || index}>
          {item.path ? (
            <a
              onClick={() => handleLink(item.path, index)}
              className={`${styles.path} ${item.path && styles.link}`}
            >
              {item.title || item.breadcrumbName}
            </a>
          ) : (
            <span>{item.title || item.breadcrumbName}</span>
          )}
          {index < breadcrumb.length - 1 && <span className={styles.splitIcon}>{splitIcon}</span>}
        </div>
      ))}
    </div>
  ) : (
    <span>{breadcrumb}</span>
  );
});

export default BaseBreadcrumb;

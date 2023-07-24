import { createRoot } from 'react-dom/client';

const getTooltipPosition = (position, ...args) => {
  if (!position) return null;
  if (typeof position === 'string') {
    return position;
  } else if (typeof position === 'function') {
    return position(...args);
  } else if (Array.isArray(position)) {
    return position;
  } else if (typeof position === 'object') {
    const { mode, x, y } = position;
    if (mode !== 'fixed') return null;
    return [x || 0, y || 0];
  }
};

export const getTooltipOps = (option = {}, autoInfo = {}) => {
  const { content = '', position } = option;
  const { seriesIndex = [] } = autoInfo;

  const dom = document.createElement('div');
  const root = createRoot(dom);

  const ops = {
    ...option,
  };
  if (seriesIndex.length > 1) {
    ops.show = false;
  }
  if (!content) {
    return {
      ...ops,
      position: (point, params, dom, rect, size) => {
        return getTooltipPosition(position, [point, params, dom, rect, size]);
      },
    };
  }

  return {
    ...option,
    formatter: (params, ticket, callback) => {
      if (typeof content === 'function') {
        const res = content(params);
        if (typeof res === 'string') {
          return content(params);
        }
        root.render(res);
        return dom;
      }

      return content;
    },
    position: (point, params, dom, rect, size) => {
      return getTooltipPosition(position, [point, params, dom, rect, size]);
    },
  };
};
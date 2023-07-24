import React, { useEffect, useMemo } from 'react';
import { getParams2, isNum } from '../utils';
import LegendItem from './item';

const LegendBlock = (props) => {
  const {
    option = {},
    data,
    handleLegendHover,
    handleLegendLeave,
    handleLegendClick,
    color
  } = props;
  const { wrapStyle = {} } = option;
  if (option.show !== false) return;
  const dataSource = useMemo(() => {
    const obj = {};
    data.forEach(item => {
      const { name, seriesIndex, dataIndex } = item;

      if (!obj[name]) {
        obj[name] = [];
      }

      obj[name].push(item);
    })

    return obj
  }, [data])

  return (
    <div
      style={{
        position: 'absolute',
        left: isNum(option?.left) ? option?.left : 'auto',
        right: isNum(option?.right) ? option?.right : 'auto',
        top: isNum(option?.top) ? option?.top : 'auto',
        bottom: isNum(option?.bottom) ? option?.bottom : 'auto',
        display: 'flex',
        flexDirection: option?.orient === 'vertical' ? 'column' : 'row',
        ...wrapStyle
      }}
    >
      {
        Object.keys(dataSource).map(key => {
          const valArr = dataSource[key];
          const params = valArr.map(val => {
            return getParams2({ data, item: val, color });
          });

          const { seriesIndex } = params?.[0] || {}

          return (
            <LegendItem
              key={`legend_${seriesIndex}_${key}`}
              handleLegendHover={handleLegendHover}
              handleLegendLeave={handleLegendLeave}
              handleLegendClick={handleLegendClick}
              name={key}
              show={valArr?.[0]?.show}
            >
              {option.content && option.content(params)}
            </LegendItem>
          )
        })
      }
    </div>
  );
};

export default LegendBlock;

import React from 'react';
import { getParams2 } from '../utils';

const TooltipBlock = (props) => {
  const { autoCurrent = {}, dataSource, seriesOps = {}, color } = props;

  return (
    <div>
      {Object.keys(autoCurrent).map((key) => {
        const value = autoCurrent[key];
        const data = dataSource[key];
        const ops = {
          ...(seriesOps[key]?.tooltip || {}),
          ...data[value]?.tooltip,
        };
        let params = {};

        if (value > -1) {
          params = getParams2({ data: dataSource, item: data[value], color });

          if (!Object.keys(params).length) return null;
        }

        const { content, formatter } = ops;
        if (content && Object.keys(params).length) {
          if (typeof content === 'function') {
            const res = content(params);

            if (typeof res === 'string') {
              return (
                <div
                  dangerouslySetInnerHTML={{
                    __html: res,
                  }}
                ></div>
              );
            }

            return res;
          }
        }

        if (formatter && Object.keys(params).length) {
          if (typeof formatter === 'function') {
            const res = formatter(params);

            if (typeof res === 'string') {
              return (
                <div
                  dangerouslySetInnerHTML={{
                    __html: res,
                  }}
                ></div>
              );
            }

            return res;
          }

          return (
            <div
              dangerouslySetInnerHTML={{
                __html: formatter,
              }}
            ></div>
          );
        }

        return (
          <div>
            <div
              style={{
                width: 10,
                height: 10,
                background: params.color,
                borderRadius: '50%',
              }}
            ></div>
            <span style={{ marginRight: 8 }}>{params.name}</span>
            <span>{params.value}</span>
          </div>
        );
      })}
    </div>
  );
};

export default TooltipBlock;

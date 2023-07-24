import { flatAndUnique } from '.';

export const getLegendOps = ({
  option = {},
  data = [],
  color,
  seriesIndexArr = [],
} = {}) => {
  const legend = {
    ...option,
  };
  const { content = '' } = option;
  if (!content) return legend;

  if (typeof content === 'function') {
    const res = content([]);

    if (typeof res === 'string') {
      if (seriesIndexArr.length) {
        let flatData = flatAndUnique(data);
        return {
          ...legend,
          formatter: (name) => {
            // if (!content) return name;
            // let params = {
            //   name,
            // };
            let params = [];
            seriesIndexArr.forEach((seriesIndex) => {
              const dataItem = data[seriesIndex] || [];
              const dataItemTotal = dataItem.reduce(
                (total, currentValue) => total + currentValue.value,
                0
              );

              dataItem.forEach((item, index) => {
                if (item.name === name) {
                  const colorIndex =
                    flatData.findIndex(
                      (flatDataItem) => flatDataItem.name === name
                    ) % color.length;

                  const { value } = item;
                  params.push({
                    name,
                    value,
                    dataIndex: index,
                    color: color[colorIndex],
                    percent: (value / dataItemTotal) * 100 || 0,
                  });
                }
              });
            });
            if (typeof content === 'function') {
              const res = content(params);

              if (typeof res === 'string') {
                return res;
              }

              return '';
            }

            return content;
          },
        };
      } else {
      }
    } else {
      // ReactDOM格式 将echarts原生legend隐藏
      return {
        ...legend,
        show: false,
      };
    }
  }
};
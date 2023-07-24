import { isNum, flatAndUnique } from '.';

export const getParams = ({
  data = [],
  index = 0,
  color,
  colorIndex,
} = {}) => {
  const item = data[index] || {};

  let totalBySeriersIndex = {};
  let dataBySeriersIndex = {};
  let dataIndex = index;

  data.forEach((dataItem) => {
    const { seriesIndex } = dataItem;
    if (!totalBySeriersIndex[seriesIndex]) {
      totalBySeriersIndex[seriesIndex] = 0;
    }
    if (!dataBySeriersIndex[seriesIndex]) {
      dataBySeriersIndex[seriesIndex] = [];
    }
    if (dataItem.name === item.name) {
      dataIndex = dataBySeriersIndex[seriesIndex].length;
    }
    dataBySeriersIndex[seriesIndex].push(dataItem);
    totalBySeriersIndex[seriesIndex] += dataItem.value;
  });

  let _colorIndex = isNum(colorIndex) ? colorIndex : index;
  if (_colorIndex > color.length) {
    _colorIndex = _colorIndex % color.length;
  }
  const { value } = item;
  return {
    name: item.name,
    value,
    dataIndex,
    color: color[_colorIndex],
    percent: (value / totalBySeriersIndex[item.seriesIndex]) * 100 || 0,
  };
};

export const getParams2 = ({ data = [], item = {}, color }) => {
  let totalBySeriersIndex = {};

  data.forEach((dataItem, index) => {
    const seriesIndex = dataItem.seriesIndex;
    const value = Number(dataItem.value);
    if (!totalBySeriersIndex[seriesIndex]) {
      totalBySeriersIndex[seriesIndex] = 0;
    }
    totalBySeriersIndex[seriesIndex] += value;
  });

  const flatData = flatAndUnique(data);
  // const _colorIndex = flatData.findIndex(flatItem => flatItem.seriesIndex === item.seriesIndex && flatItem.dataIndex === item.dataIndex);
  // const colorIndexByName = flatData.findIndex(flatItem => flatItem.name === item.name);
  let colorIndex = flatData.findIndex(
    (flatItem) => flatItem.name === item.name
  );
  if (colorIndex > color.length) {
    colorIndex = colorIndex % color.length;
  }

  return {
    name: item.name,
    value: item.value,
    dataIndex: item.dataIndex,
    seriesIndex: item.seriesIndex,
    color: color[colorIndex],
    percent:
      (Number(item.value) / totalBySeriersIndex[item.seriesIndex]) * 100 || 0,
  };
};

export const getWholeParams = ({ data = [], dataIndex = 0 }) => {
  const flatData = flatAndUnique(data);
  let parentItem = flatData.find(item => item.dataIndex === dataIndex) || {};
  while (parentItem.parentId !== -1) {
    parentItem = flatData[parentItem.parentId];
  }

  return parentItem;
};
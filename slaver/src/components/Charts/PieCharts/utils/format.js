export const flatAndUnique = (data = []) => {
  if (!Array.isArray(data)) return data;
  const map = new Map();
  const loop = (array) => {
    array.forEach((item) => {
      if (Array.isArray(item)) {
        loop(item);
      } else if (!map.get(item)) {
        map.set(item);
        if (item.children) {
          loop(item.children);
        }
      }
    });
  };

  loop(data);
  return [...map.keys()];
};

export const formatterData = (data = [], seriesIndex = 0) => {
  return data.map((item, index) => {
    if (Array.isArray(item)) {
      return formatterData(item, index);
    }
    return {
      ...item,
      show: true,
      dataIndex: index,
      seriesIndex,
    };
  });
};

export const formatterSunData = (data = [], option = {}) => {
  const flatData = flatAndUnique(data);
  const loop = ({ arr = [], id = -1, ops }) => {
    if (!arr.length) return;
    return arr.map((item, index) => {
      const childrenArr = item.children || [];

      const itemId = flatData.findIndex(
        (flatItem) => item.name === flatItem.name
      );
      return {
        ...item,
        parentId: id,
        id: itemId,
        children: loop({ arr: childrenArr, id: itemId, ops: option }),
        show: true,
        ...ops,
        seriesIndex: 0,
        dataIndex: itemId
      };
    });
  };

  return loop({ arr: data });
};

export const formatAutoOpsData = (data) => {
  let arr = [];

  if (typeof data === 'number') {
    arr = [data];
  } else if (Array.isArray(data)) {
    arr = data;
  } else {
    arr = [];
  }

  return arr;
};
import React, { useMemo } from 'react';
import { INITNUM } from '../enum';
import { flatAndUnique, getParams2, getWholeParams, isNum } from '../utils';

const CenterBlock = (props) => {
  const { option = {}, highData, dataSource, color, isPie, chartSize } = props;

  const ratio = 1;
  if (!Object.keys(option).length) return;
  const { radius = 0, margin = 0, border = 'none', padding = 0, width } = option;
  console.log(chartSize, 'width')

  const centerBlockInfo = useMemo(() => {
    // const unit = isNum(margin) ? 'px' : '';
    let unit = 'px';
    if (!isNum && Number.isNaN(margin)) {
      const num = parseFloat(margin);
      unit = margin.replace(num, '');
    }

    // 可视区域尺寸为容器高宽中较小一项
    const visibleAreaSize = Math.min(chartSize.width, chartSize.height);
    // todo radius 不传取最小值
    // const width = radius ? `calc(${radius} - ${margin * 2}${unit})` : 0;
    // (visibleAreaSize * parseFloat(radius) / 100) - (margin * 2)
    let width = radius ? `calc(${visibleAreaSize * parseFloat(radius) / 100}px - ${parseFloat(margin) * 2}${unit})` : 0;
    // console.log(width, 'width')
    const left = `calc(50% - ${width} / 2)`;

    return {
      width,
      left,
    };
  }, [radius, margin, chartSize]);

  const getCenterContent = () => {
    const highingKeys = Object.keys(highData).map(key => {
      if (highData[key] !== INITNUM) return key;
    }).filter(Boolean);

    // if (highingKeys.length === 0) return;

    let params;
    if (highingKeys.length === 1) {
      const highingKey = highingKeys[0];
      const highingVal = highData[highingKey];
      const dataArr = dataSource[highingKey];

      const flatData = flatAndUnique(dataArr);

      let param = getParams2({
        data: dataArr,
        // 适配旭日图模式
        item: flatData.find(item => item.dataIndex === highingVal) || {},
        color
      })

      params = [param];

    } else {
      // 双饼图内外都自动轮播的情况
      let paramsArr = [];
      Object.keys(highingKeys).forEach(highingKey => {
        const highingVal = highData[highingKey];
        const dataArr = dataSource[highingKey];

        const param = getParams2({
          data: dataArr,
          item: dataArr.find(item => item.dataIndex === highingVal) || {},
          color
        });

        paramsArr.push(param);
      })

      params = [...paramsArr];
    }

    let wholeParams;

    if (!isPie) {
      const highingKey = highingKeys[0];
      const highingVal = highData[highingKey];
      const dataArr = dataSource[highingKey];
      const flatData = flatAndUnique(dataArr);
      wholeParams = getWholeParams({
        data: flatData,
        dataIndex: highingVal
      })
    }

    const { content } = option;
    if (!content) return;
    if (typeof content === 'function') {
      // return content(params, wholeTree);
      return content(params, wholeParams);
    }
    return content;
  }

  return centerBlockInfo.width ? (
    <div
      style={{
        width: centerBlockInfo.width,
        height: centerBlockInfo.width,
        borderRadius: '50%',
        position: 'absolute',
        // left: centerBlockInfo.left,
        // top: centerBlockInfo.left,
        left: chartSize.width * 0.5,
        top: chartSize.height * 0.5,
        // zIndex: -1,
        border,
        padding,
        boxSizing: 'border-box',
        transform: 'translate(-50%, -50%)'
      }}
      className="center-block"
    >
      <div
        style={{
          width: '100%',
          height: '100%',
          borderRadius: '50%',
          backgroundColor: option.backgroundColor || 'transparent',
          backgroundImage: option.backgroundImage
            ? `url(${option.backgroundImage})`
            : '',
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {getCenterContent()}
      </div>
    </div>
  ) : null;
};

export default React.memo(CenterBlock);

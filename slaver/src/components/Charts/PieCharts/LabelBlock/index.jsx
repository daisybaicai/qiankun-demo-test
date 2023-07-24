import React, { Fragment } from 'react';
import { getParams2, isNum } from '../utils';
import styles from './index.less';

const LabelBlock = (props) => {
  const {
    data,
    labelPos,
    option,
    hightlightIndex,
    chartSize,
    distanceToLabelLine,
    color
  } = props;

  return (
    <>
      {data.map((item, index) => {
        if (!item.show) return <></>;
        const params = getParams2({ data, item, color });

        const posItem = labelPos[index];
        // 获取远离图的那个点（即终点）
        const startPos = posItem?.[0] || [];

        // 获取靠近图的那个点（即起点）
        const endIndex = posItem.length > 1 ? posItem.length - 1 : 0;
        const endPos = posItem?.[endIndex] || [];

        // 获取终点横坐标
        const startPosX = startPos?.[0];

        // 获取起点坐标
        const endPosX = endPos?.[0];
        const endPosY = endPos?.[1];
        let isLeft = true;
        // 根据起点和终点横坐标判断是否位于图像左侧
        if (isNum(startPosX) && isNum(endPosX)) {
          isLeft = startPosX - endPosX > 0;
        }

        const isActive = hightlightIndex === index;

        const activeLabel = {
          ...option?.active,
          ...item.emphasis?.label,
        };
        const normalLabel = {
          ...option?.normal,
          ...item.label,
        };

        let isShowLabel = true;
        let isShowActive = false;
        if (isActive) {
          if (activeLabel?.show && activeLabel?.content) {
            isShowActive = true;
          } else {
            isShowActive = false;

            if (normalLabel?.show) {
              isShowLabel = true;
            } else {
              isShowLabel = false;
            }
          }
        } else {
          isShowActive = false;

          if (normalLabel?.show) {
            isShowLabel = true;
          } else {
            isShowLabel = false;
          }
        }

        let mode =
          (isShowActive ? activeLabel.mode : normalLabel.mode) || 'outsideLine';

        let textAlign = 'left';
        let transformX = 0;
        let transformY = '-50%';
        let maxWidth = 'auto';
        let left = endPosX;

        let distance = 0;
        if (mode === 'insideLine') {
          distance = isNum(distanceToLabelLine) ? distanceToLabelLine : 0;

          const lineLength2 =
            posItem.length >= 2
              ? endPos[0] - posItem[posItem.length - 2]?.[0]
              : 0;

          // 先取正，再进行计算
          maxWidth = Math.abs(lineLength2) - distance;

          if (isLeft) {
            textAlign = 'left';
            transformX = `calc(${distance}px)`;

            left = endPosX > 0 ? endPosX : 0;
          } else {
            textAlign = 'right';
            // 关于distance偏移，在右边往左偏时是减去
            if (endPosX > chartSize) {
              // 超出右边边界，此时left取最大值时width会存在问题。使用left先取charts宽度 - line长度，在transform时再进行回正
              left = chartSize - lineLength2;
              transformX = `calc(-100% + ${lineLength2}px - ${distance}px)`;
            } else {
              // 没超出右边边界时，此时left取最大值时width会可能存在问题
              left = endPosX - lineLength2;
              transformX = `calc(-100% + ${lineLength2}px - ${distance}px)`;
            }
          }
        } else if (mode === 'outsideLine') {
          distance = isNum(distanceToLabelLine) ? distanceToLabelLine : 5;
          if (isLeft) {
            // transformX = '-100%';
            transformX = `calc(-100% - ${distance}px)`;
            maxWidth = endPosX;
          } else {
            transformX = `calc(${distance}px)`;
            maxWidth = chartSize - endPosX;
          }

          maxWidth = maxWidth - distance;
        }

        const commonCapStyle = {
          position: 'absolute',
          left: endPosX < 0 ? 0 : endPosX > chartSize ? chartSize : endPosX,
          top: endPosY,

          transform: 'translateY(-50%)',
          background: params.color,
        };

        return (
          <Fragment key={`label_${item.name}`}>
            {isShowActive ? (
              <div
                style={{
                  ...commonCapStyle,
                  ...(activeLabel.capStyle || {}),
                }}
                className='cap'
              />
            ) : (
              isShowLabel && (
                <div
                  style={{
                    ...commonCapStyle,
                    ...(normalLabel.capStyle || {}),
                  }}
                  className='cap'
                />
              )
            )}

            <div
              style={{
                left,
                top: endPosY,
                transform: `translate(${transformX}, ${transformY})`,
                maxWidth,
                textAlign,
              }}
              className={styles['label-item']}
            >
              {isShowActive
                ? activeLabel?.content(params)
                : isShowLabel &&
                normalLabel?.content &&
                normalLabel?.content(params)}
            </div>
          </Fragment>
        );
      })}
    </>
  );
};
export default LabelBlock;

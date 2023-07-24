import { isEmptyObject } from "../../../utils/utils";

const emptyAxisLabelConfig = {
  axisLabel: {
    show: false,
  },
};

const emptyAxisTickConfig = {
  axisTick: {
    show: false,
  },
};

const emptySplitLineConfig = {
  splitLine: {
    show: false,
  },
};
const emptyAxisLineConfig = {
  axisLine: {
    show: false,
  },
};

const emptyPointerConfig = {
  pointer: {
    show: false,
  },
};

//轴线是否有背景色
export const getIfAxisLineBackground = (axisLineConfig) => {
  return axisLineConfig?.show && axisLineConfig?.backgroundConfig?.show;
};

//获取轴线背景色的配置
export const getAxisLineBackground = (axisLineConfig) => {
  const {
    roundCap,
    distance,
    backgroundConfig: { color, width },
  } = axisLineConfig;
  return {
    ...emptyAxisLabelConfig,
    ...emptyAxisTickConfig,
    ...emptySplitLineConfig,
    ...emptyPointerConfig,
    name: "background",
    type: "gauge",
    axisLine: {
      show: true,
      roundCap,
      distance,
      lineStyle: {
        width,
        color: [[1, color]],
      },
    },
  };
};

//轴线是否有着色区域
export const getIfAxisLineColorArea = (axisLineConfig) => {
  return axisLineConfig?.show && !isEmptyObject(axisLineConfig?.lineStyle);
};

//获取轴线着色区域的配置
export const getAxisLineColorArea = (axisLineConfig) => {
  const { roundCap, distance, lineStyle } = axisLineConfig;
  return {
    ...emptyAxisLabelConfig,
    ...emptyAxisTickConfig,
    ...emptySplitLineConfig,
    ...emptyPointerConfig,
    name: "colorArea",
    type: "gauge",
    axisLine: {
      show: true,
      roundCap,
      distance,
      lineStyle,
    },
  };
};

//进度条是否居中
export const getIfProgressInline = (progressConfig) => {
  return progressConfig?.show && progressConfig?.isInlineCenter;
};

//获取进度条配置
export const getProgressInlineConfig = (progressConfig, size) => {
  const { roundCap, width, itemStyle } = progressConfig;
  return {
    ...emptyAxisLabelConfig,
    ...emptyAxisTickConfig,
    ...emptyAxisLineConfig,
    ...emptyPointerConfig,

    name: "progress",
    type: "gauge",
    axisLine: {
      show: true,
      lineStyle: {
        opacity: 0,
      },
    },
    progress: {
      show: true,
      roundCap,
      width,
      itemStyle,
    },
  };
};

const percentToPoint = (percent) => {
  let str = percent.replace("%", "");
  str = str / 100;
  return str;
};

//获取进度条的半径长度
export const getProgressRadius = (
  progressConfig,
  baseConfig,
  axisLineConfig,
  containerSize
) => {
  const { radius } = baseConfig;
  const { width: progressWidth } = progressConfig;
  const { backgroundConfig, lineStyle } = axisLineConfig;

  if((lineStyle.width || backgroundConfig.width) - progressWidth === 0){
    return radius
  }
  const baseLength = Math.min(containerSize?.width, containerSize?.height);
  return (
    baseLength * percentToPoint(radius)* 0.5 -
    ((lineStyle.width || backgroundConfig.width) - progressWidth) / 2
  );
};


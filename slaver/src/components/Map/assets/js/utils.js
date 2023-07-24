import BASE_CONFIG from "./config";
import { AREA_NAME_MAP } from "../../../../common/enum";
import ringMiddle from '../image/ring-yellow.png';
import ringTop from '../image/ring-blue.png';
import ringBot from '../image/ring-red.png';

export function getDprSize(fontSize) {
  let deviceWidth = document.documentElement.clientWidth;
  const tmpWidth = (document.documentElement.clientHeight * 1920) / 1080;
  const designRes = window.screen.width * 9 === window.screen.height * 16; // 实际分辨率
  if (!designRes && window.screen.width * 10 === window.screen.height * 16) {
    // 屏幕分辨率为16：10
    deviceWidth = (document.documentElement.clientWidth * 9) / 10;
  }
  deviceWidth = deviceWidth < tmpWidth ? deviceWidth : tmpWidth;
  return Math.floor((deviceWidth * fontSize) / 1920);
}

/**
 * 空数组
 * @param {*} arr
 */
 export function isEmptyArray(arr) {
  if (arr instanceof Array && arr.length > 0) {
    return false;
  }
  return true;
}

/**
 * 空对象
 * @param {*} Object
 */
 export function isEmptyObject(obj) {
  if (!obj) {
    return true;
  }
  if (Object.prototype.toString.call(obj) === '[object Object]') {
    if (Object.keys(obj).length === 0) {
      return true;
    }
    return false;
  }
  return false;
}

/**
 * 获取对应类型visualMap配置
 * @param {*} params 区域编码
 * @param {*} index seriesIndex值
 */
export function getVisualMapConfig(data,params,index,style) {
  const {
    type = '',
    config = {},
  } = params;
  let ret;
  switch (type) {
    case 'piecewise':
      ret = {
        type: 'piecewise',
        seriesIndex: index,
        ...BASE_CONFIG.visual.piecewise,
        ...config,
        ...style
      }
      break;
    case 'continuous':
      ret = {
        type: 'continuous',
        seriesIndex: index,
        max: data?.length || 0,
        ...BASE_CONFIG.visual.continuous,
        ...config,
        ...style
      }
      break;
    default:
      break;
  }
  return ret;
}

/**
 * 获取scatter 散点配置
 */

export function getScatterConfig(data = [], style,scatterTooltip) {
  const COLOR_MAP = ['#27B87B','rgba(255, 150, 100, 1)','rgba(92, 152, 255, 1)'];
  return {
    name: '企业情况',
    type: 'scatter',
    coordinateSystem: 'geo',
    data: data.map(item => {
      return {
        ...item,
        itemStyle: {
          color: item?.itemValue?.color || COLOR_MAP[Math.floor(Math.random()*3)],
        },
        symbol: item?.itemValue?.symbol || 'circle',
        symbolSize: item?.itemValue?.symbol ? 15: 8
      }
    }),
    ...BASE_CONFIG.scatter,
    ...scatterTooltip,
    ...style
  };
}

/**
 * 设置区域对应颜色
 */
export function getVisualMapColor(params) {
  const {
    val = '',
    visualMap = null,
    mapDataLength = 0,
    countySplicing = false,
    areaName = ''
  } = params;

  let colorObj = {};

  if (!visualMap || !visualMap?.show || isEmptyArray(visualMap?.config?.pieces) || isEmptyArray(visualMap?.config?.areaColorMap)) {
    return colorObj
  }
  const cityArr = ['丽水市', '湖州市', '绍兴市', '温州市', '台州市', '舟山市', '嘉兴市', '金华市', '杭州市', '衢州市', '宁波市'];
  if(countySplicing && cityArr.includes(areaName)) {
    return {
      borderColor: 'rgba(255, 255, 255, 0)',
      emphasisBorderColor: 'rgba(255, 255, 255, 0)',
      emphasisColor: 'rgba(255, 255, 255, 0)',
    };
  }

  const arr = visualMap?.config?.pieces;
  const areaColorMap = visualMap?.config?.areaColorMap;

  const contrastNum = visualMap?.type === 'piecewise' ? Number(val) : Number(val/mapDataLength*100);

  for (let i = 0; i < arr.length; i += 1) {
    if (arr[i].gt && !arr[i].lte && contrastNum > arr[i].gt) {
      colorObj = areaColorMap[i];
      break;
    }

    if (arr[i].gt && arr[i].lte && contrastNum > arr[i].gt && contrastNum <= arr[i].lte) {
      colorObj = areaColorMap[i];
      break;
    }

    if (!arr[i].gt && arr[i].lte && contrastNum <= arr[i].lte) {
      colorObj = areaColorMap[i];
      break;
    }
  }

  return colorObj;
}

export const getPosition = (position, dom) => {
  let pixel = getPixelByConvert(dom, position);
  const convert = getConvertByPixel(dom, pixel);
  return convert;
}

export const getLabelValue = (position, value, dom) => {
  let pixel = getPixelByConvert(dom, position);
  pixel = [pixel?.[0] + 16, pixel?.[1] + 16];
  const convert = getConvertByPixel(dom, pixel);
  convert.push(value);
  return convert;
}

export const getPixelByConvert = (dom, arry) => {
  return dom?.convertToPixel('geo', arry)
}

export const getConvertByPixel = (dom, arry) => {
  return dom?.convertFromPixel('geo', arry)
}

// 3D柱状图柱体配置
const COLOR_MAP = {
  top: {
    maskColor: {
      type: 'linear',
      x: 0,
      y: 0,
      x2: 0,
      y2: 1,
      colorStops: [{
        offset: 0, color: 'rgba(242, 198, 39, 0)' // 0% 处的颜色
      }, {
        offset: 0.4, color: 'rgba(171, 235, 255, 0.378)' // 100% 处的颜色
      }, {
        offset: 0.65, color: 'rgba(120, 214, 244, 0.39)' // 100% 处的颜色
      }, {
        offset: 0.9, color: 'rgba(171, 235, 255, 0.378)' // 100% 处的颜色
      }, {
          offset: 1, color: 'rgba(250, 213, 82, 0)' // 100% 处的颜色
      }],
      global: false // 缺省为 false
    },
    ringImage: ringTop,
    polygon1: {
      type: 'linear',
      x: 0,
      y: 0,
      x2: 0,
      y2: 1,
      colorStops: [{
          offset: 0, color: '#7DFBFB' // 0% 处的颜色
      }, {
          offset: 1, color: 'rgba(125, 251, 251, 0.1)' // 100% 处的颜色
      }],
      global: false // 缺省为 false
    },
    polygon2: {
      type: 'linear',
      x: 0,
      y: 0,
      x2: 0,
      y2: 1,
      colorStops: [{
          offset: 0, color: 'rgba(125, 251, 251, .8)' // 0% 处的颜色
      }, {
          offset: 1, color: 'rgba(125, 251, 251, 0.1)' // 100% 处的颜色
      }],
      global: false // 缺省为 false
    },
    polygon3: {
      type: 'linear',
      x: 0,
      y: 0,
      x2: 0,
      y2: 1,
      colorStops: [{
          offset: 0, color: 'rgba(125, 251, 251, 1)' // 0% 处的颜色
      }, {
          offset: 1, color: 'rgba(125, 251, 251, .6)' // 100% 处的颜色
      }],
      global: false // 缺省为 false
    },
    valueColor: '#77E4E4'
  },
  middle: {
    maskColor: {
      type: 'linear',
      x: 0,
      y: 0,
      x2: 0,
      y2: 1,
      colorStops: [{
        offset: 0, color: 'rgba(242, 198, 39, 0)' // 0% 处的颜色
      }, {
        offset: 0.4, color: 'rgba(247, 207, 65, 0.24)' // 100% 处的颜色
      }, {
        offset: 0.65, color: 'rgba(250, 213, 82, 0.372)' // 100% 处的颜色
      }, {
        offset: 0.9, color: 'rgba(250, 213, 82, 0.272)' // 100% 处的颜色
      }, {
          offset: 1, color: 'rgba(250, 213, 82, 0)' // 100% 处的颜色
      }],
      global: false // 缺省为 false
    },
    ringImage: ringMiddle,
    polygon1: {
      type: 'linear',
      x: 0,
      y: 0,
      x2: 0,
      y2: 1,
      colorStops: [{
          offset: 0, color: '#FFD338' // 0% 处的颜色
      }, {
          offset: 1, color: 'rgba(243, 189, 51, 0)' // 100% 处的颜色
      }],
      global: false // 缺省为 false
    },
    polygon2: {
      type: 'linear',
      x: 0,
      y: 0,
      x2: 0,
      y2: 1,
      colorStops: [{
          offset: 0, color: 'rgba(255, 211, 56, 0.8)' // 0% 处的颜色
      }, {
          offset: 1, color: 'rgba(243, 189, 51, 0)' // 100% 处的颜色
      }],
      global: false // 缺省为 false
    },
    polygon3: {
      type: 'linear',
      x: 0,
      y: 0,
      x2: 0,
      y2: 1,
      colorStops: [{
          offset: 0, color: '#FFEB38' // 0% 处的颜色
      }, {
          offset: 1, color: '#F7F3E3' // 100% 处的颜色
      }],
      global: false // 缺省为 false
    },
    valueColor: '#FDD441'
  },
  bot: {
    maskColor: {
      type: 'linear',
      x: 0,
      y: 0,
      x2: 0,
      y2: 1,
      colorStops: [{
        offset: 0, color: 'rgba(242, 198, 39, 0)' // 0% 处的颜色
      }, {
        offset: 0.4, color: 'rgba(255, 191, 171, 0.378)' // 100% 处的颜色
      }, {
        offset: 0.65, color: 'rgba(244, 180, 120, 0.39)' // 100% 处的颜色
      }, {
        offset: 0.9, color: 'rgba(255, 191, 171, 0.378)' // 100% 处的颜色
      }, {
          offset: 1, color: 'rgba(250, 213, 82, 0)' // 100% 处的颜色
      }],
      global: false // 缺省为 false
    },
    ringImage: ringBot,
    polygon1: {
      type: 'linear',
      x: 0,
      y: 0,
      x2: 0,
      y2: 1,
      colorStops: [{
          offset: 0, color: '#E65333' // 0% 处的颜色
      }, {
          offset: 1, color: 'rgba(236, 111, 103, 0.1)' // 100% 处的颜色
      }],
      global: false // 缺省为 false
    },
    polygon2: {
      type: 'linear',
      x: 0,
      y: 0,
      x2: 0,
      y2: 1,
      colorStops: [{
          offset: 0, color: 'rgba(230, 83, 51, .8)' // 0% 处的颜色
      }, {
          offset: 1, color: 'rgba(236, 111, 103, 0.1)' // 100% 处的颜色
      }],
      global: false // 缺省为 false
    },
    polygon3: {
      type: 'linear',
      x: 0,
      y: 0,
      x2: 0,
      y2: 1,
      colorStops: [{
          offset: 0, color: '#E65333' // 0% 处的颜色
      }, {
          offset: 1, color: 'rgba(230, 83, 51, .6)' // 100% 处的颜色
      }],
      global: false // 缺省为 false
    },
    valueColor: '#E35E40'
  },
}

// 3D柱状图配置
export const getBarChartConfig = (option,data,maxValue,barChartUnit,barsVisual) => {
  const cubeWidth = getDprSize(17 / 2);
  const maxHeight = 100;
  const bar3DConfig = {
    type: 'custom',
    coordinateSystem: 'geo',
    zlevel: 6,
    tooltip: {
      show: false,
      triggerOn: 'none',
    },
    renderItem: function (params, api) {
      const coord = api.coord(data[params.dataIndex].position);
      let cubeHeight = 0;
      if (Boolean(data[params.dataIndex].value)) {
        cubeHeight = ((data[params.dataIndex].value || 0) / Number(maxValue)) * maxHeight;
      }
      
      if (cubeHeight < 30) {
        cubeHeight = 30;
      }
      cubeHeight = getDprSize(cubeHeight);
      const valueLen = String(data[params.dataIndex].value || 1).length;
      const nameLen = String(data[params.dataIndex].name).length;
      let colorMap = COLOR_MAP.middle;
      if (params.dataIndex < 3) {
        colorMap = COLOR_MAP.top
      }
      if (params.dataIndex >= (data.length - 3)) {
        colorMap = COLOR_MAP.bot
      }
      return {
        type: 'group',
        children: [
          {
            type: 'rect',
            x: coord[0] - getDprSize(26),
            y: coord[1] - cubeHeight*0.8,
            silent: true,
            shape: {
              width: getDprSize(62),
              height: cubeHeight*0.8,
            },
            style: {
              fill: colorMap.maskColor
            }
          },
          {
            type: 'image',
            silent: true,
            x: coord[0] - getDprSize(33),
            y: coord[1] - getDprSize(16),
            style: {
              image: colorMap.ringImage,
              width: getDprSize(76),
              height: getDprSize(32),
            }
          },
          {
            type: 'polygon',
            silent: true,
            shape: {
              points: [
                [coord[0] - cubeWidth, coord[1]],
                [coord[0] - cubeWidth, coord[1] - cubeHeight],
                [coord[0] + cubeWidth, coord[1] - cubeHeight],
                [coord[0] + cubeWidth, coord[1]],
              ]
            },
            style: {
              fill: colorMap.polygon1,
            }
          },
          {
            type: 'polygon',
            silent: true,
            shape: {
              points: [
                [coord[0] + cubeWidth, coord[1]],
                [coord[0] + 2*cubeWidth, coord[1] - cubeWidth],
                [coord[0] + 2*cubeWidth, coord[1] - (cubeWidth + cubeHeight)],
                [coord[0] + cubeWidth, coord[1] - cubeHeight],
              ]
            },
            style: {
              fill: colorMap.polygon2,
            }
          },
          {
            type: 'polygon',
            silent: true,
            shape: {
              points: [
                [coord[0] - cubeWidth, coord[1] - cubeHeight],
                [coord[0] + cubeWidth, coord[1] - cubeHeight],
                [coord[0] + 2*cubeWidth, coord[1] - (cubeWidth + cubeHeight)],
                [coord[0], coord[1] - (cubeWidth + cubeHeight)],
              ]
            },
            style: {
              fill: colorMap.polygon3,
            }
          },
          {
            type: 'text',
            silent: true,
            x: coord[0] - getDprSize(nameLen*12/2),
            y: coord[1] + getDprSize(15),
            style: {
              text: data[params.dataIndex].name,
              font: `600 ${getDprSize(16)}px "PingFang SC"`,
              fill: '#fff',
              textShadowColor : 'rgba(0, 0, 0, 1)',
              textShadowBlur: 15
            }
          },
          {
            type: 'text',
            silent: true,
            x: coord[0] - getDprSize((valueLen*10)/2),
            y: coord[1] - cubeHeight - getDprSize(20),
            style: {
              text: data[params.dataIndex].value || '0',
              textVerticalAlign: 'middle',
              font: `600 ${getDprSize(20)}px "Oxanium"`,
              fill: colorMap.valueColor,
            }
          },
          {
            type: 'text',
            silent: true,
            x: coord[0] + getDprSize(valueLen*10/2 + 10),
            y: coord[1] - cubeHeight - getDprSize(20),
            style: {
              text: barChartUnit,
              textVerticalAlign: 'middle',
              font: `400 ${getDprSize(14)}px "PingFang SC"`,
              fill: '#fff',
            }
          },
        ]
      }
    },
    data: data
  }
  option.series.push(bar3DConfig);
}

// 飞线图配置
export const getLinesChartConfig = (option, data, config) => {
  option.series.push({
    type: 'lines',
    zlevel: 2,
    effect: {
      show: true,
      period: 4, //箭头指向速度，值越小速度越快
      trailLength: 0.4, //特效尾迹长度[0,1]值越大，尾迹越长重
      symbol: 'arrow', //箭头图标
      symbolSize: 7, //图标大小
    },
    lineStyle: {
      color:'#1DE9B6',
      width: 1, //线条宽度
      opacity: 0.1, //尾迹线条透明度
      curveness: .3 //尾迹线条曲直度
    },
    ...config,
    data: [
      {coords: [[120.258889, 30.115833],[119.938333, 28.478333]],lineStyle:{color:'#4ab2e5'}},
      {coords: [[120.220000, 29.910833],[119.938333, 28.478333]],lineStyle:{color:'#4fb6d2'}}
    ]
  })
}

// 圆环进度配置
export const getRingChartConfig = (option, data) => {
  const arry = [];
  data.map(item => {
    let leftPos = 70;
    if (item?.unreported || item?.overdueUncompleted) {
      leftPos = 80;
    }
    arry.push({
      type: 'gauge',
      coordinateSystem: 'geo',
      startAngle: 90,
      endAngle: -270,
      radius: getDprSize(32),
      center: [item?.gaugePosition?.[0] - getDprSize(leftPos),item?.gaugePosition?.[1] + getDprSize(0)],
      pointer: {show: false},
      progress: {
        show: true,
        overlap: false,
        roundCap: true,
        clip: false,
        itemStyle: { color: '#fff' }
      },
      axisLine: {
        lineStyle: {
          width: 10,
          color: [[1, 'rgba(255, 255, 255, 0.4)']]
        }
      },
      splitLine: { show: false },
      axisTick: { show: false },
      axisLabel: { show: false },
      detail: { show: false },
      title: {show: false},
      data: [{name: item?.areaName, value: item?.progress}]
    })
  })
  option.series.push(...arry);
}

// 判断是否是区县
export const isCounty = code => {
  const num = String(code).slice(4);
  if (Number(num) !== 0) {
    return true
  }
  return false
}
// 判断是否是地市
export const isCity = code => {
  if (isCounty(code)) {
    return false
  }
  const num = String(code).slice(2,4);
  if (Number(num) !== 0) {
    return true
  }
  return false
}
// 补齐下钻历史记录
export const fixHistory = (arry) => {
  const newArry = [...arry]
  if (isCounty(newArry?.[0]?.areaCode)) {
    // 区县，插入市数据
    const code = String(newArry?.[0]?.areaCode)?.slice(0,4) + '00';
    const fatherArea = {
      areaCode: code,
      areaName: AREA_NAME_MAP?.[code]
    }
    newArry.splice(0,0,fatherArea);
    fixHistory(newArry)
  }else if(isCity(newArry?.[0]?.areaCode)){
    const fatherArea = {
      areaCode: String(newArry?.[0]?.areaCode)?.slice(0,2) + '0000',
      areaName: '浙江省'
    }
    newArry.splice(0,0,fatherArea);
    fixHistory(newArry)
  }
  return newArry;
}


import React, { useEffect, useState, useRef } from 'react';
import { useUnmount, useUpdateEffect } from 'ahooks';
import ReactEcharts from 'echarts-for-react';
import Empty from '../../Empty';
import BASE_CONFIG from '../assets/js/barsConfig';
import { isEmptyArray } from '@/utils/utils';
import { getEchartsLegendProps, getFlexDirection } from "./helper";
import ChartContainer from "./ChartContainer";
import ChartHeader from "./ChartHeader";
import ChartBody from "./ChartBody";

function defaultDiffColor(diffColor,data, key = 'value', value, defaultColor = '#84EBD2',sortOrder) {
  if (!diffColor) {
    return value.color
  }
  if (data instanceof Array) {
    const arr = [...data];
    arr.sort((a, b) => {
      if (sortOrder === 'DESC') {
        if (a && typeof a === 'object') {
          return Number(b[key]) - Number(a[key]);
        }
        return Number(b) - Number(a);
      }else{
        if (sortOrder === 'ASC') {
          if (a && typeof a === 'object') {
            return Number(a[key]) - Number(b[key]);
          }
          return Number(a) - Number(b);
        }
      }
    });
    const sortArr = arr.slice(data.length / 2);
    let flag = false;
    for (let i = 0; i < sortArr.length; i += 1) {
      const item = sortArr[i];
      if (Number(item[key]) === Number(value.value)) {
        flag = true;
        break;
      }
    }
    return flag
      ? {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            {
              offset: 0,
              color: '#FFE266', // 0% 处的颜色
            },
            {
              offset: 1,
              color: 'rgba(255, 226, 102, 0)', // 100% 处的颜色
            },
          ],
          global: false, // 缺省为 false
        }
      :  defaultColor;
  }
  return defaultColor;
}

function diffFunction(value, config, defaultColor) {
  let color = defaultColor;
  const arr = config?.pieces || [];
  for (let i = 0; i < arr.length; i += 1) {
    if (arr[i].gt && !arr[i].lte && value > arr[i].gt) {
      color = arr[i]?.color || defaultColor;
      break;
    }

    if (arr[i].gt && arr[i].lte && value > arr[i].gt && value <= arr[i].lte) {
      color = arr[i]?.color || defaultColor;
      break;
    }

    if (!arr[i].gt && arr[i].lte && value <= arr[i].lte) {
      color = arr[i]?.color || defaultColor;
      break;
    }
  }
  return color;
}

function controlLabel(value, data, key, config, showLabel, showMaxLabel) {
  if (showLabel) {
    return config || {
      show: true
      }
  }
  const arr = [...data];
  arr.sort((a, b) => {
    if (a && typeof a === 'object') {
      return Number(b[key]) - Number(a[key]);
    }
    return b - a;
  });
  if (showMaxLabel && value === arr[0][key]) {
    return config || {
      show: true
      }
  }
  return {
    show: false
  }
}

export default function BarsChart({
  name = '', // y坐标轴名称
  data = [], // 图表数据
  categoryStack = 'x', // 类目轴
  coordinateSystem = 'cartesian2d', // 坐标系
  xField = 'name', // x轴字段
  seriesMap = [], // 图表配置
  xAxisProps, // x轴样式自定义配置
  yAxisProps, // y轴样式自定义配置
  gridProps, // 直角坐标系内绘图网格自定义配置
  dataZoomProps, // 区域缩放自定义配置
  tooltipProps, // tooltip自定义配置
  seriesProps, // series自定义配置
  diffColor = false,
  diffColorConfig, // 范围映射自定义配置
  showLegend = false, // 是否显示legend
  showLabel = false, // 是否显示label
  showMaxLabel = false, // 显示最大值label
  carouselLabel = false, // label轮播
  intervalTime = 3*1000, // 轮播定时时间
  sortOrder = 'DESC', // 排序 默认升序
  showZero = false, // 是否显示0
  carouselXAxis = false, // x轴轮播
  carouselXAxisConfig = {
    limit: 6, // 初始展示个数
    intervalTime: 3*1000, // 轮播定时时间
  }, // x轴轮播配置项
  style,
  legendProps = {},
}) {
  const [chartData, setChartData] = useState([]);

  const chartRef = useRef();
  const timeRef = useRef();
  const xAxisTimeRef = useRef();
  const currentIndexRef = useRef(-1);
  const currentXAxisIndexRef = useRef(-1);

  // 设置option
  const getOption = () => {
    let chartOption = {};
    if (isEmptyArray(chartData) ||isEmptyArray(seriesMap) || (chartData || []).every((item) => JSON.stringify(item) === '{}')){
      return chartOption;
    }
    let xAxis = null;
    let yAxis = null;
    let radiusAxis = null;
    let angleAxis = null;
    if (coordinateSystem === 'cartesian2d') {
      xAxis = categoryStack === 'x' ? [
              {
          type: 'category',
                data: chartData.map((item) => item[xField]),
                ...BASE_CONFIG.xAxis,
          ...xAxisProps
              },
      ] : [
              {
          name: '',
          type: 'value',
          nameLocation: 'end',
                splitNumber: 3,
                ...BASE_CONFIG.yAxis,
                ...yAxisProps,
              },
              {
          name: '',
          nameLocation: 'end',
                ...BASE_CONFIG.yAxis,
          ...yAxisProps
              },
            ];
      yAxis = categoryStack === 'x' ? [
              {
          name: '',
          type: 'value',
          nameLocation: 'end',
                splitNumber: 3,
                ...BASE_CONFIG.yAxis,
                ...yAxisProps,
              },
              {
          name: '',
          nameLocation: 'end',
                ...BASE_CONFIG.yAxis,
          ...yAxisProps
              },
      ] : [
              {
          type: 'category',
                data: chartData.map((item) => item[xField]),
                ...BASE_CONFIG.xAxis,
          ...xAxisProps
              },
      ]
    }
    if (coordinateSystem === 'polar') {
      radiusAxis = categoryStack === 'x' ? {
        type: 'category',
              data: chartData.map((item) => item[xField]),
      } : {}
      angleAxis = categoryStack === 'y' ? {
        type: 'category',
              data: chartData.map((item) => item[xField]),
      } : {}
    }
    chartOption = {
      legend: (showLegend && seriesMap.length !== 1) ? {
        data: seriesMap.map((item) => item.desc),
        ...BASE_CONFIG.legend,
        ...getEchartsLegendProps(legendProps),
      } : null,
      tooltip: {
        show: tooltipProps?.show || false,
        trigger: 'item',
        renderMode: 'html',
        trigger: 'axis',
        // enterable: true,
        extraCssText:
          'background: linear-gradient(330.74deg, rgba(6, 55, 58, 0.6) 12.47%, rgba(63, 152, 155, 0.198) 93.54%);border:1.5px solid rgba(137, 189, 177, 0.35);box-shadow: inset 0px 0px 20px rgba(29, 220, 197, 0.42);',
        textStyle: {
          color: '#FFFFFF'
        },
        formatter: params => {
          let str = `${params[0].axisValue}<br/>`;
          params.map(item=>{
            str += `${item.marker} ${item.name}: ${item?.value || 0}<br/>`
            return item;
          })
          return str
        },
        ...tooltipProps
      },
      xAxis,
      yAxis,
      radiusAxis,
      angleAxis, // 极坐标系的角度轴
      polar: coordinateSystem === 'cartesian2d' ? null : {}, // 极坐标系
      grid: {
        ...BASE_CONFIG.grid,
        ...gridProps
      },
      ...dataZoomProps,
      series: seriesMap.map((item) => {
        return {
          name: item.desc,
          type: item?.type || 'bar',
          coordinateSystem,
          yAxisIndex: item?.yAxisIndex ? item?.yAxisIndex : 0,
          data: chartData.map((i) => {
            let colorItem = item?.color;
            let rule = item?.averageRule || 'down'
            if (
              item?.averageKey && (
              (rule === 'down' && Number(i[item.code]) < i[item?.averageKey]) ||
              (rule === 'up' && Number(i[item.code]) >= i[item?.averageKey])
              )
            ) {
              colorItem = item?.averageColor || item?.color
            }
            const dealData = {
              name: item.desc,
              value: Number(i[item.code]),
              color: colorItem
            };
            return {
              name: dealData.name,
              value: dealData?.value || (showZero ? 0 : undefined),
              itemValue: i,
              itemStyle: {
                color: diffColorConfig?.show ? diffFunction(dealData.value, diffColorConfig, dealData.color) : defaultDiffColor(diffColor,data,item.code,dealData,dealData.color,sortOrder),
              },
              ...seriesProps,
              symbol: String(item?.symbol) === 'none' ? item.symbol : seriesProps?.symbol,
              label: controlLabel(i[item.code],data,item.code, item?.label || seriesProps?.label, showLabel, showMaxLabel),
            };
          }),
          ...BASE_CONFIG.barsSeries,
          ...seriesProps,
          symbol: String(item?.symbol) === 'none' ? item.symbol : seriesProps?.symbol,
          lineStyle: {
            color: item?.color,
            ...item.lineStyle
          },
          stack: item?.stack,
          barGap: item?.barGap || BASE_CONFIG.barsSeries.barGap,
          markLine: seriesProps?.markLine,
          // animation: false
        };
      }),
    };
    return chartOption;
  };

  const [option, setOption] = useState(getOption(chartData));

  // 自动轮播控制显示label
  const handleEmphasisLabel = () => {
    if (
      !chartRef?.current ||
      chartRef?.current < 0 ||
      isEmptyArray(chartData)
    ) {
      return;
    };
    const dataLen = chartData?.length;
    const oldCurrent = currentIndexRef.current;
    currentIndexRef.current = (currentIndexRef.current + 1) % (dataLen || 1);
    const chartDom = chartRef?.current?.getEchartsInstance();
    chartDom.dispatchAction({
      type: 'downplay',
      seriesIndex: 0,
      dataIndex: oldCurrent,
    });
    chartDom.dispatchAction({
      type: 'highlight',
      seriesIndex: 0,
      dataIndex: currentIndexRef.current,
    });
  };

  const handleCarouselXAxis = () => {
    let newArry = [...chartData];
    let nowIndex = currentXAxisIndexRef.current;
    let newNum = nowIndex + 1 >= data.length ? carouselXAxisConfig?.limit : nowIndex + 1;
    if (newNum === data.length) {
      newNum = 0;
    }
    newArry.shift();
    newArry.push(data[newNum]);
    currentXAxisIndexRef.current = newNum;
    setChartData(newArry);
  }

  // 轮播label处理逻辑
  const carouselLabelFn = () => {
    if (timeRef.current) {
      clearInterval(timeRef.current);
    }
    if (carouselLabel && intervalTime) {
      handleEmphasisLabel();
      timeRef.current = setInterval(() => handleEmphasisLabel(), intervalTime);
    }
    return () => {
      clearInterval(timeRef.current);
    };
  }

  // 轮播x轴处理逻辑
  const carouselXAxisFn = () => {
    if (xAxisTimeRef.current) {
      clearInterval(xAxisTimeRef.current);
    }
    if (carouselXAxis && carouselXAxisConfig?.intervalTime) {
      timeRef.current = setInterval(() => handleCarouselXAxis(), carouselXAxisConfig?.intervalTime);
    }
    return () => {
      clearInterval(xAxisTimeRef.current);
    };
  }

  useUpdateEffect(()=>{
    if (carouselXAxis && carouselXAxisConfig?.limit) {
      const sliceData = data.slice(0,carouselXAxisConfig?.limit);
      currentXAxisIndexRef.current = carouselXAxisConfig?.limit - 1;
      setChartData(sliceData);
    }else{
      setChartData(data);
    }
  },[data])

  useUpdateEffect(()=>{
    if (chartRef.current) {
      chartRef.current.getEchartsInstance().resize();
    }
    setOption(getOption(chartData));
  },[chartData]);

  useUpdateEffect(()=>{
    carouselLabelFn();
    carouselXAxisFn();
  },[option])

  useUnmount(()=>{
    chartRef.current?.getEchartsInstance()?.dispose();
  })

  if (isEmptyArray(data)) {
    return <Empty />;
  }
  return (
    <ChartContainer legendProps={legendProps} seriesMap={seriesMap}>
      <ChartHeader legendProps={legendProps} seriesMap={seriesMap}>
        {name}
      </ChartHeader>
      <ChartBody legendProps={legendProps} seriesMap={seriesMap}>
        <ReactEcharts
          ref={chartRef}
          option={option}
          style={{ width: '100%', height: '100%', ...style }} 
        />
      </ChartBody>
    </ChartContainer>
  );
}

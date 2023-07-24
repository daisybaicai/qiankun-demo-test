import React, { useEffect, useState, useRef } from 'react';
import { useUnmount, useUpdateEffect } from 'ahooks';
import ReactEcharts from 'echarts-for-react';
import Empty from '../../Empty';
import BASE_CONFIG from '../assets/js/barsConfig';
import { isEmptyArray } from '@/utils/utils';


export default function ScatterChart({
  name = '',
  data = [], // 图表数据
  xAxisProps, // x轴样式自定义配置
  yAxisProps, // y轴样式自定义配置
  tooltipProps, // tooltip自定义配置
  gridProps, // 直角坐标系内绘图网格自定义配置
  seriesProps, // series自定义配置
  style
}) {

  const [chartData, setChartData] = useState([]);

  const chartRef = useRef();

  // 设置option
  const getOption = () => {
    let chartOption = {};
    if (isEmptyArray(chartData) || (chartData || []).every((item) => JSON.stringify(item) === '{}')){
      return chartOption;
    } 
    chartOption = {
      xAxis: {
        type: 'value',
        ...BASE_CONFIG.xAxis,
        ...xAxisProps
      },
      yAxis: {
        name: '',
        nameLocation: 'end',
        ...BASE_CONFIG.yAxis,
        ...yAxisProps,
      },
      tooltip: {
        show: true,
        trigger: 'item',
        renderMode: 'html',
        trigger: 'axis',
        extraCssText:
          'background: linear-gradient(330.74deg, rgba(6, 55, 58, 0.6) 12.47%, rgba(63, 152, 155, 0.198) 93.54%);border:1.5px solid rgba(137, 189, 177, 0.35);box-shadow: inset 0px 0px 20px rgba(29, 220, 197, 0.42);',
        textStyle: {
          color: '#FFFFFF'
        },
        formatter: '{a}: ({c})',
        ...tooltipProps
      },
      grid: {
        ...BASE_CONFIG.grid,
        ...gridProps
      },
      series: [
        {
          name,
          type: 'scatter',
          data: chartData,
          ...BASE_CONFIG.scatterSeries,
          ...seriesProps
        }
      ],
    };
    return chartOption;
  };

  const [option, setOption] = useState(getOption(chartData));

  useUpdateEffect(()=>{
    setChartData(data);
  },[data])

  useUpdateEffect(()=>{
    if (chartRef.current) {
      chartRef.current.getEchartsInstance().resize();
    }
    setOption(getOption(chartData));
  },[chartData]);

  useUnmount(()=>{
    chartRef.current?.getEchartsInstance()?.dispose();
  })

  if (isEmptyArray(data)) {
    return <Empty />;
  }
  return (
    <div className="chartWrap">
      <div className="chartView">
        <ReactEcharts 
          ref={chartRef} 
          option={option} 
          style={{ width: '100%', height: '100%', ...style }} 
        />
      </div>
    </div>
    
  );
}

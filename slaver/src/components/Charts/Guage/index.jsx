import React, {
  useEffect,
  useRef,
  forwardRef,
  useState,
} from "react";
import { useSize, useDebounceEffect } from "ahooks";
import * as echarts from "echarts";
import {
  getIfAxisLineBackground,
  getAxisLineBackground,
  getIfAxisLineColorArea,
  getAxisLineColorArea,
  getIfProgressInline,
  getProgressInlineConfig,
  getProgressRadius,
} from "./helper";
const CommonChart = forwardRef((props, chartRef) => {
  const { chartId, options } = props;
  const size = useSize(chartRef);


  useEffect(() => {
    let chartDom;
    let myChart;

    setTimeout(() => {
      if (chartRef) {
        chartDom = chartRef.current;
        myChart = echarts.init(chartDom);
        options && myChart.setOption(options);
      }
    });
    window.onresize = () => {
      myChart.resize();
    };
    return () => {
      window.onresize = null;
    };
  }, [chartId, options]);

  useDebounceEffect(
    () => {
      let myChart;
      let chartDom;
      if (chartRef) {
        chartDom = chartRef.current;
        myChart = echarts.init(chartDom);
        options && myChart.setOption(options);
        myChart.resize();
      }
      window.onresize = () => {
        myChart.resize();
      };
    },
    [size],
    {
      wait: 100,
    }
  );

  return <div ref={chartRef} style={{ width: "100%", height: "100%" }}></div>;
});

const Guage = (props) => {
  const commonChartRef = useRef();

  const { options, ...othersProps } = props;

  if (options) {
    return <CommonChart options={options} ref={commonChartRef} />;
  }

  const [option, setOption] = useState({});
  const {
    backgroundColor,
    color, 
    seriesConfig: {
      baseConfig,
      axisLineConfig,
      progressConfig,
      axisTick,
      ...otherSeriesConfig
    },
    ...otherConfig
  } = othersProps;

  const getSeries = (size) => {
    const series = [];
    let lastSeries = {
      type: "gauge",
    };

    //轴线背景色
    if (getIfAxisLineBackground(axisLineConfig)) {
      lastSeries = {
        ...lastSeries,
        ...baseConfig,
        ...getAxisLineBackground(axisLineConfig),
      };
      series.push(lastSeries);
    }

    //轴线着色区域
    if (getIfAxisLineColorArea(axisLineConfig)) {
      lastSeries = {
        ...lastSeries,
        ...baseConfig,
        ...getAxisLineColorArea(axisLineConfig),
        axisTick,
      };
      series.push(lastSeries);
    }

    // 进度条
    if (progressConfig?.show) {
      //内部居中进度条
      if (getIfProgressInline(progressConfig)) {
        const r = getProgressRadius(
          progressConfig,
          baseConfig,
          axisLineConfig,
          size
        );
        lastSeries = {
          ...baseConfig,
          ...lastSeries,
          ...getProgressInlineConfig(progressConfig),
          radius: r,
        };
        series.push(lastSeries);
      } else {
        //不居中进度条
        lastSeries = {
          ...lastSeries,
          progress: progressConfig,
        };
      }
    }

    lastSeries = {
      ...lastSeries,
      ...otherSeriesConfig,
    };

    series.pop();

    return {
      series: [...series, lastSeries],
    };
  };
  const getOptions = (size) => {
    return {
      backgroundColor,
      color,
      ...otherConfig,
      ...getSeries(size),
    };
  };

  useEffect(() => {
    const size = {
      width: parseInt(commonChartRef.current.getBoundingClientRect().width),
      height: parseInt(commonChartRef.current.getBoundingClientRect().height),
    };
    setOption(getOptions(size));
  }, []);

  return <CommonChart options={option} ref={commonChartRef} />;
};
export default Guage;

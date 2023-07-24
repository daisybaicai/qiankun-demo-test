import React, {
  useState,
  useRef,
  useMemo,
  useCallback,
} from 'react';
import * as echarts from 'echarts';
import { useMount, useUpdateLayoutEffect, useUnmount } from 'ahooks';
import { INITNUM } from './enum';
import * as defaultOption from './defaultOption';
import {
  getLegendOps,
  formatterData,
  formatterSunData,
  flatAndUnique,
  getParams2,
  getWholeParams,
  formatAutoOpsData,
  isNum,
  isEmptyArray,
  getNumVal,
  getAutoSeriesIndex,
  getHighDataInfo,
  getTooltipOps
} from './utils';

import { useAutoParams } from './hooks';
import LabelBlock from './LabelBlock';
import LegendBlock from './LegendBlock';
import CenterBlock from './CenterBlock';
import TooltipBlock from './TooltipBlock';

const Pie = (props) => {
  const {
    type = 'pie',
    radius = '50%',
    color = [],
    data = {},
    legendOption = {},
    tooltipOption = {},
    seriesOption = {},
    autoPlay = false,
    autoPlayOption = {},
    highLightOption = {},
    centerBlockOption = {},
    wrapStyle = {},
    highLightCallback = () => { },
    nodeClick = false,
  } = props;
  const domRef = useRef();
  const chartRef = useRef();
  const chartOption = useRef({});
  const autoParams = useAutoParams();
  const [dataSource, setDataSource] = useState([]);
  const [labelPos, setLabelPos] = useState({});

  // const [highInfo, setHighInfo] = useState({});
  const [highInfo, setHighInfo] = useState({
    data: {},
    showTip: false
  });

  const [chartsSize, setChartsSize] = useState({
    width: 0,
    height: 0
  })

  const isPie = useMemo(() => {
    return type !== 'sunburst';
  }, [type]);

  const colorOps = useMemo(() => {
    const arr = [
      ...defaultOption.color,
      ...color
    ]

    if (arr.length) return arr;
    return ['#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de', '#3ba272', '#fc8452', '#9a60b4', '#ea7ccc'];
  }, [color]);

  const radiusSource = useMemo(() => {
    if (
      typeof radius === 'string' ||
      typeof radius === 'number' ||
      (Array.isArray(radius) && radius.length)
    ) {
      return [radius];
    }

    if (typeof radius === 'object') {
      return Object.keys(radius).map(key => {
        return radius[key]
      });
    }
  }, [radius]);

  const echartsSeriesIndexArr = Object.keys(radiusSource);

  const _autoPlayOption = useMemo(() => {
    const ops = {
      ...defaultOption.autoPlayOption,
      ...autoPlayOption,
      enable: defaultOption.autoPlay || autoPlay || false,
    }
    let autoSeriesArr = getAutoSeriesIndex({
      seriesIndex: ops.seriesIndex,
      keyArr: echartsSeriesIndexArr
    });
    return {
      ...ops,
      seriesIndexArr: autoSeriesArr
    };
  }, [autoPlay, autoPlayOption]);

  const _highOption = useMemo(() => {
    const ops = {
      ...defaultOption.highLightOption,
      ...highLightOption,
    };

    ops.highCallback = ops.callback || highLightCallback

    // 兼容原有startOps
    const defaultSeriesIndex = ops.default?.seriesIndex ?? formatAutoOpsData(_autoPlayOption.startOps?.seriesIndex || {}) ?? [];
    const defaultDataIndex = ops.default?.dataIndex ?? formatAutoOpsData(_autoPlayOption.startOps?.dataIndex || {}) ?? [];

    if (isEmptyArray(defaultSeriesIndex) && !isEmptyArray(defaultDataIndex)) {
      ops.defaultSeriesIndex = [0];
      ops.defaultDataIndex = defaultDataIndex;
    } else if (!isEmptyArray(defaultSeriesIndex) && !isEmptyArray(defaultDataIndex)) {
      const sArr = [], dArr = [];
      const radiusKeyArr = echartsSeriesIndexArr.map(key => Number(key));
      defaultSeriesIndex.forEach(sIdx => {
        const idx = radiusKeyArr.findIndex(key => key === sIdx);
        if (idx > -1) {
          sArr.push(sIdx);
          const data = getNumVal(defaultDataIndex[idx], defaultDataIndex[defaultDataIndex.length - 1]);
          dArr.push(data);
        }
      })
      ops.defaultSeriesIndex = sArr;
      ops.defaultDataIndex = dArr;
    }

    return ops;
  }, [highLightOption, highLightCallback]);

  const isLegendCustom = useMemo(() => {
    const legendOps = {
      ...defaultOption.legendOption,
      ...legendOption
    };
    if (legendOps.content) {
      const res = legendOps.content([]);
      if (typeof res !== 'string') return true;
    }
    return false;
  }, [legendOption]);

  const flatData = useMemo(() => {
    // 用于双饼图下图例，需打平数据
    return flatAndUnique(dataSource);
  }, [dataSource]);

  const getCustomLegendData = useCallback((data = []) => {
    const dataArr = data.map((item) => {
      if (Array.isArray(item)) {
        return getCustomLegendData(item);
      }
      return item.show ? item : -1;
    });
    return dataArr;
  }, []);

  const getFormatInfo = () => {
    const dataArr = [];
    const labelObj = {};
    if (echartsSeriesIndexArr.length > 1) {
      echartsSeriesIndexArr.forEach((key) => {
        dataArr[key] = data[key] || data[data.length - 1];
        labelObj[key] = [];
      });
    } else {
      dataArr[0] = data;
      labelObj[0] = [];
    }

    let newData = [];
    if (isPie) {
      newData = formatterData(dataArr);
    } else {
      newData = [
        formatterSunData(data, {
          emphasis: {
            focus: 'ancestor',
          },
        }),
      ];
    }

    return {
      newData,
      labelObj
    }
  }

  const getOps = (data = []) => {
    const autoInfo = {
      seriesIndex: Object.keys(autoParams.autoCurrent),
    };
    const tooltipOps = {
      ...defaultOption.tooltipOption,
      ...tooltipOption
    };

    const legendOps = {
      ...defaultOption.legendOption,
      ...legendOption
    };
    return {
      color: colorOps,
      legend: getLegendOps({
        option: legendOps,
        data,
        seriesIndexArr: echartsSeriesIndexArr,
        color: colorOps
      }),
      // todo 打平直接放到data里去
      tooltip: getTooltipOps(tooltipOps, autoInfo),
      // series: Object.keys(radius || {}).map((key, index) => {
      series: echartsSeriesIndexArr.map((key) => {
        const commonSeries = defaultOption.seriesOption || [];
        let newSeriesOps = [];
        if (!Array.isArray(seriesOption)) {
          newSeriesOps[key] = seriesOption;
        } else {
          newSeriesOps = seriesOption;
        }
        const seriesItem = newSeriesOps[key] || newSeriesOps[newSeriesOps.length - 1] || {};
        const dataItem = data[key] || [];
        const radiusItem = (radiusSource || {})[key];

        const series = {
          ...(commonSeries[key] || commonSeries[commonSeries.length - 1] || {}),
          ...seriesItem,
          type,
          data: isLegendCustom ? getCustomLegendData(dataItem) : dataItem,
          labelLayout: (params) => {
            if (!params.labelLinePoints) return;
            let dataIndex = params.dataIndex;
            if (!isLegendCustom) {
              const showData = dataItem.filter((item) => item.show);
              dataIndex = showData[params.dataIndex]?.dataIndex;
            }

            setTimeout(() => {
              setLabelPos((labelPosObj) => {
                let newArr = [...(labelPosObj[key] || [])];
                newArr[dataIndex] = params.labelLinePoints;
                const newObj = {
                  ...labelPosObj,
                  [key]: newArr,
                };

                return newObj;
              });
            }, 0);
          },
        };

        // 对tooltip进行格式化，打平后放到这里
        series.tooltip = getTooltipOps(
          {
            ...tooltipOps,
            ...series.tooltip,
          },
          autoInfo
        );

        // 对label进行格式化
        const { label = {} } = series;
        if (label.content) {
          label.formatter = () => {
            return '';
          };
        }

        const labelLineExtendLength = label.lineExtendLength;
        if (label.isLineExtend && isNum(labelLineExtendLength)) {
          series.labelLine = {
            ...series.labelLine,
            length2: labelLineExtendLength,
          };
        }

        if (radiusItem) {
          series.radius = radiusItem;
        }

        return series;
      }),
    };
  };

  const handleInit = () => {
    const { labelObj, newData } = getFormatInfo();
    setLabelPos(labelObj);
    setDataSource(newData);

    const autoInfo = {};

    const defaultSeriesIndex = _highOption.defaultSeriesIndex || [];
    const defaultDataIndex = _highOption.defaultDataIndex
    // 自动轮播的初始项
    _autoPlayOption.seriesIndexArr.forEach(key => {
      if (isEmptyArray(defaultSeriesIndex)) {
        autoInfo[key] = INITNUM;
      } else {
        const keyIndex = defaultSeriesIndex.findIndex(sIdx => key === sIdx);
        autoInfo[key] = defaultDataIndex[keyIndex];
      }
    })
    autoParams.init(autoInfo);


    // 默认高亮
    const high = {};
    defaultSeriesIndex.forEach((sIdx, index) => {
      high[sIdx] = defaultDataIndex[index];
    })
    setHighInfo({
      ...highInfo,
      data: high
    });
  };

  const createInterval = useCallback(() => {
    autoParams.createInterval({
      ..._autoPlayOption,
      dataSource,
    });
  }, [dataSource]);

  useMount(() => {
    const myChart = echarts.init(domRef.current);
    chartRef.current = myChart;
    // const size = Math.min(myChart.getHeight(), myChart.getWidth())
    // setchartsSize(size);
    setChartsSize({
      width: myChart.getWidth(),
      height: myChart.getHeight()
    });
    handleInit();

    chartRef.current.on('mouseover', (value) => {
      const { seriesIndex, dataIndex, data = {} } = value;

      const _seriesIndex = isPie ? seriesIndex : (data.seriesIndex ?? seriesIndex);
      const _dataIndex = isPie ? dataIndex : (data.dataIndex ?? dataIndex);
      const newVal = {
        [_seriesIndex]: _dataIndex
      }
      // 若有自动，移除自动
      // 记录当前位置，下次轮播从这个点开始
      if (_autoPlayOption.enable) {
        autoParams.removeInterval();
        // 若该层存在自动轮播，则记录当前高亮位置，作为下次轮播起始点
        if (_autoPlayOption.seriesIndexArr.includes(Number(seriesIndex))) {
          const current = autoParams.getWip();
          autoParams.setWip({
            ...current,
            ...newVal,
          });
        }
      }

      setHighInfo((info) => {
        return {
          ...info,
          data: {
            ...info?.data,
            ...newVal
          }
        }
      })
    });
    chartRef.current.on('mouseout', (value) => {
      const { seriesIndex } = value;
      // console.log('event: mouseout', seriesIndex)
      if (isPie && !highLightOption?.stillHigh)
        setHighInfo((info) => {
          return {
            ...info,
            data: {
              ...info?.data,
              [seriesIndex]: INITNUM
            }
          }
        })

      if (_autoPlayOption.enable) {
        // 直接createInterval 会拿不到最新的dataSource
        // createInterval();
        setDataSource((nowData) => [...nowData])
      }
    });

    chartRef.current.on('legendselectchanged', (value) => {
      onLegendChange(value);
    });

    window.addEventListener('resize', () => {
      myChart.resize();
      setChartsSize({
        width: myChart.getWidth(),
        height: myChart.getHeight()
      });
    })
  });

  useUnmount(() => {
    autoParams.removeInterval();
    chartRef.current.dispose(domRef.current);
  })

  useUpdateLayoutEffect(() => {
    const { newData } = getFormatInfo();
    setDataSource(newData);
  }, [data])

  useUpdateLayoutEffect(() => {
    const ops = getOps(dataSource);
    chartOption.current = ops;
    chartRef.current.setOption(ops);
    createInterval();
  }, [dataSource]);

  useUpdateLayoutEffect(() => {
    if (!_autoPlayOption.enable || !autoParams.autoIdx) return;
    let dataIndex = autoParams.autoCurrent;

    let isShowTip = false;

    if (isPie) {
      isShowTip =
        typeof _autoPlayOption.showTip === 'boolean'
          ? _autoPlayOption.showTip
          : true;
    }

    setHighInfo({
      // ...dataIndex
      data: {
        ...dataIndex
      },
      showTip: isShowTip
    })
  }, [autoParams.autoCurrent]);

  useUpdateLayoutEffect(() => {
    const highData = highInfo.data;
    const seriesArr = Object.keys(highData);
    if (!seriesArr.length) return;

    const _params = {
      seriesIndex: seriesArr,
      dataIndex: highData,
      isShowTip: highInfo.showTip,
      // needHighlight: false
    };

    handleHightlight(_params);
  }, [highInfo]);

  const handleHightlight = ({ seriesIndex, dataIndex, isShowTip = false, needHighlight = true }) => {
    // 鼠标移开
    // todo
    if (dataIndex === INITNUM) {
      if (_autoPlayOption.enable) {
        chartRef.current.dispatchAction({
          type: 'downplay',
        });
        chartRef.current.dispatchAction({
          type: 'hideTip',
        });
      }

      return;
    }

    const dataInfo = getHighDataInfo({
      seriesIndex,
      dataIndex,
      isPie
    })

    // if (_autoPlayOption.enable) {
    chartRef.current.dispatchAction({
      type: 'downplay',
    });

    setTimeout(() => {
      chartRef.current.dispatchAction({
        // type: 'select',
        type: 'highlight',
        ...dataInfo,
      });
    }, 0);
    // }

    if (isShowTip) {
      chartRef.current.dispatchAction({
        type: 'hideTip',
      });

      chartRef.current.dispatchAction({
        type: 'showTip',
        ...dataInfo,
      });
    }

    let paramsArr = [];

    seriesIndex.map(highingKey => {
      const highingVal = dataIndex[highingKey];
      const dataArr = dataSource[highingKey];
      const flatData = flatAndUnique(dataArr);

      const param = getParams2({
        data: dataArr,
        item: flatData.find(item => item.dataIndex === highingVal) || {},
        color: colorOps
      });

      paramsArr.push(param);
    })

    let wholeParams;

    if (!isPie) {
      const dataArr = dataSource[0];
      const highingVal = dataIndex[0];
      wholeParams = getWholeParams({
        data: dataArr,
        dataIndex: highingVal
      })
    }
    _highOption.highCallback && _highOption.highCallback(paramsArr, wholeParams);
  };

  const handleLegendHover = (name) => {
    autoParams.removeInterval();

    const legendObj = {};
    flatData.forEach((item) => {
      const { name, seriesIndex, dataIndex } = item;
      if (!legendObj[name]) {
        legendObj[name] = {};
      }

      legendObj[name][seriesIndex] = dataIndex;
    });
    const legendItem = legendObj[name];
    handleHightlight({
      seriesIndex: Object.keys(legendItem),
      dataIndex: legendItem,
    });
  };

  const handleLegendLeave = () => {
    chartRef.current.dispatchAction({
      type: 'downplay',
    });
    createInterval();
  };

  const handleLegendClick = (name) => {
    const selected = {};
    flatData.forEach(item => {
      if (item.name === name) {
        selected[item.name] = !item.show;
      } else {
        selected[item.name] = item.show;
      }
    })
    const value = {
      name,
      selected,
      type: 'customlegendselectchanged'
    }
    onLegendChange(value);
  };

  const onLegendChange = (value) => {
    const { selected = {}, name } = value;

    setDataSource((nowData) => {
      const newData = [...nowData];
      flatAndUnique(nowData).forEach((item) => {
        if (item.name === name) {
          const { seriesIndex, dataIndex } = item;
          newData[seriesIndex][dataIndex].show = selected[name] || false;
        }
      });

      return newData;
    })
  }


  const commonProps = {
    color: colorOps
  }

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        position: 'relative',
        ...wrapStyle,
      }}
    >
      <div ref={domRef} style={{ width: '100%', height: '100%' }}></div>
      <CenterBlock
        option={{
          ...defaultOption.centerBlockOption,
          ...centerBlockOption
        }}
        isPie={isPie}
        dataSource={dataSource}
        highData={highInfo.data}
        {...commonProps}
        chartSize={chartsSize}
      />
      <LegendBlock
        option={getOps(dataSource).legend}
        data={flatData}
        handleLegendHover={handleLegendHover}
        handleLegendLeave={handleLegendLeave}
        handleLegendClick={handleLegendClick}
        {...commonProps}
      />
      {
        Object.keys(labelPos).map((key) => {
          if (!labelPos[key].length) return;
          const { series } = chartOption.current;
          const seriesItem = series[key];
          const labelOption = {
            normal: {
              ...seriesItem.label,
              capStyle: seriesItem.labelLine?.capStyle || {},
            },
            active: {
              ...seriesItem.emphasis?.label,
              capStyle: seriesItem.emphasis?.labelLine?.capStyle || {},
            },
          };
          return (
            <LabelBlock
              option={labelOption}
              hightlightIndex={autoParams.autoCurrent[key]}
              data={dataSource[key]}
              labelPos={labelPos[key]}
              key={key}
              chartSize={chartsSize.width}
              {...commonProps}
            />
          );
        })
      }
      {
        Object.keys(highInfo.data).length > 1 && (
          <div
            style={{
              position: 'absolute',
              top: 0,
              right: 0,
              // border: '1px solid',
              // width: 100,
              // height: 100,
            }}
          >
            <TooltipBlock
              autoCurrent={highInfo.data}
              dataSource={dataSource}
              seriesOps={chartOption.current.series}
              {...commonProps}
            />
          </div>
        )
      }
    </div >
  );
};

export default Pie;

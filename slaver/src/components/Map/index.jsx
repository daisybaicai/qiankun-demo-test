import React, { useRef, useState } from 'react';
import { useMount, useUpdateEffect, useUnmount, useDebounceFn } from 'ahooks';
import request from '@/utils/request';
import BASE_CONFIG from './assets/js/config';
import { SORT_ORDER_TYPE } from './assets/js/enum';
import { 
  isEmptyArray, 
  getVisualMapConfig, 
  getVisualMapColor, 
  getScatterConfig,
  isEmptyObject,
  getPosition,
  getPixelByConvert,
  getBarChartConfig,
  getLinesChartConfig,
  getRingChartConfig,
  fixHistory,
  isCounty
} from './assets/js/utils';
import styles from './index.less';


const echarts = require('echarts');

// 浙江省 区县或区县拼接省级地图前往：http://thoughts.hyperchain.cn:8099/workspaces/5d4b89ddbe825b1e266e05b8/docs/637ed905be825b0001652b85

const MapBox = React.memo(({
  viewMode = 'plane',
  // 默认展示浙江省地图
  areaCode = 330000,
  areaName = '浙江省',
  countySplicing = false, // 浙江省地图 true: 区县拼接 false: 市拼接
  // 数据来源
  dataSource = [], // 基础地图渲染数据
  scatterSource, // 地图散点数据
  sortName = 'name',
  sortValue = 'value',
  scatterName = 'name',
  sortOrder = SORT_ORDER_TYPE.ASC.code, // 排序 默认升序
  // 开关
  isRotateMap = false, // 是否3D旋转地图
  isEmphasisArea = true, // 是否高亮区域及tooltip控制
  showAreaName = false, // 显示区域名称
  drillDownMap = false, // 是否支持地图下钻
  canDrillDownCount = true, // 是否支持下钻至区县
  texture = false, // 是否显示地图纹理
  textureImage = 'https://tmh-images.oss-cn-hangzhou.aliyuncs.com/defaultTexture.jpg', // 自定义纹理
  carouselTooltip = false, // 气泡窗轮播
  intervalTime = 3*1000, // 轮播定时时间
  isFixHistory = false, // 是否补全地图下钻历史记录
  // 区域展示自定义dom
  showCustomDom = false,
  renderCustomValue = () => {},
  // 插件
  barChart = false,
  barChartUnit = '',
  linesChart = false,
  linesChartConfig,
  ringChart = false,
  // 映射处理
  mapVisual = null, // 区域映射
  scatterVisual = null, // 散点映射
  barsVisual = null, // 柱状图映射
  // 基本配置项
  mapStyle = {},
  tooltip = {},
  // 通知父级组件区域编码
  setAreaCode = ()=> {},
  canClickArea = true,
  clickAreaCode = () => {}
}) => {

  const {
    geo = {},
    map = {},
    scatter = {},
    visual = {},
  } = mapStyle;

  // tooltip配置项
  const {
    areaTooltip = {}, // 区域tooltip
    scatterTooltip = {} // 散点tooltip
  } = tooltip;

  const myChart = useRef(null);
  const chartRef = useRef();
  const timeRef = useRef();
  const currentIndexRef = useRef(-1);

  // 纹理图片
  const textureImg = new Image();

  // 注册地图名称（默认浙江省 330000）
  const [mapName, setMapName] = useState(330000);

  // 基础地图渲染数据
  const [mapData, setMapData] = useState({});

  // 图表渲染数据
  const [rawData, setRawData] = useState([]);

  // 地图下钻历史记录
  const [mapHistory, setMapHistory] = useState([]);

  const { run } = useDebounceFn(
    () => {
      if (canClickArea) {
        clickAreaCode({
          areaCode: 330000,
          areaName: '浙江省'
        });
      }
      if (mapHistory.length >= 2) {
        // 获取区域编码
        const code = mapHistory[mapHistory.length - 2].areaCode;
        // 获取区域名称
        const name = mapHistory[mapHistory.length - 2].areaName;
        clickAreaCode({
          areaName: name,
          areaCode: code
        })
        let newHistory = [...mapHistory];
        newHistory.pop();
        setMapHistory(newHistory);
        registerMap(code, name, '', registerMapCallback)
      }
    },
    {
      wait: 500,
    },
  );

  document?.getElementById('mapWrap')?.addEventListener('click',()=>{
    run();
  })

  const mapProject = point => {
    return [0.5*point[0]+0.5*point[1],-0.4*point[1]+0.2*point[0]];
  }

  const mapUnproject = point => {
    return [point[0],point[1]];
  }

  // 设置option
  const getOption = () => {
    let mapOption = {};
    mapOption = {
      visualMap: [],
      tooltip: {
        show: false,
        className: 'mapTooltip',
        appendToBody: true,
        triggerOn: 'none', // 组件采用绑定事件控制tooltip，禁止默认的tooltip触发条件
      },
      geo: {
        show: true,
        id: 'gmap',
        map: String(mapName),
        ...BASE_CONFIG.geo,
        ...geo,
        emphasis: {
          disabled : true
        },
        projection: isRotateMap ? {
          project: (point) => mapProject(point),
          unproject: (point) => mapUnproject(point)
        } : null,
        itemStyle: {
          borderColor: BASE_CONFIG.defaultMapBorderColor,
          borderWidth: 1,
          areaColor: texture ? {
            image: textureImg,
            repeat: 'repeat',
          } : BASE_CONFIG.defaultMapAreaColor,
        },
      },
      series: [
        // 基础地图
        {
          name: '地区',
          type: 'map',
          map: String(mapName),
          ...BASE_CONFIG.geo,
          ...geo,
          itemStyle: {
            // 地图纹理样式
            areaColor: texture ? {
              image: textureImg,
              repeat: 'repeat',
            } : BASE_CONFIG.defaultMapAreaColor,
          },
          projection: isRotateMap ? {
            project: (point) => mapProject(point),
            unproject: (point) => mapUnproject(point)
          } : null,
          data: (mapData?.baseData || []).map((item) => {
            return {
              name: item.name,
              value: item?.value || 0,
              itemValue: item,
              label: { 
                show: showAreaName,
                silent: true
              },
              select: { disabled: true },
              tooltip: {
                show: areaTooltip?.show || true,
                trigger: 'item',
                renderMode: 'html',
                appendToBody: true,
                ...areaTooltip
              },
              emphasis: {
                disabled: !isEmphasisArea,
                label: { show: !barChart, color: '#fff' },
                zlevel: 5,
              },
              ...map,
              itemStyle: {
                color: item?.visualMapColor?.emphasisColor || 'rgba(29, 98, 69, 0.56)',
                borderColor: BASE_CONFIG.defaultMapBorderColor,
                borderWidth: 1,
                borderJoin: 'round',
              },
            };
          }),
        },
      ],
    };
    // 判断基础地图区域映射
    if (mapVisual && mapVisual?.show) {
      // 配置映射
      mapOption.visualMap.push(getVisualMapConfig(mapData?.baseData,mapVisual,0,visual))
    }
    // 判断散点映射
    if (!isEmptyArray(mapData?.scatterData)) {
      if (scatterVisual && scatterVisual?.show) {
        // 配置映射
        mapOption.visualMap.push(getVisualMapConfig(mapData?.scatterData,scatterVisual,2,visual));
      }
      // 配置散点
      mapOption.series.push(getScatterConfig(mapData?.scatterData,scatter,scatterTooltip))
    }
    // 插件判断（柱状图，飞线图）
    if (barChart && !isEmptyArray(mapData?.baseData)) {
      const maxValue = [...mapData?.baseData].sort((a, b) => {
        return (b?.[sortValue]||0) - (a?.[sortValue]||0); // 降序
      })[0]?.[sortValue];
      getBarChartConfig(mapOption,(mapData?.baseData || []),maxValue, barChartUnit,barsVisual)
    }
    if (linesChart) {
      getLinesChartConfig(mapOption,(mapData?.baseData || []),linesChartConfig)
    }
    if (ringChart) {
      getRingChartConfig(mapOption,(mapData?.baseData || []))
    }
    return mapOption;
  };

  // 存储地图下钻历史记录
  const saveMapHistory = (code, name) => {
    const history = JSON.parse(JSON.stringify(mapHistory));
    if (isEmptyArray(history) || history?.[history.length - 1]?.code !== code) {
      history.push({
        areaCode: code,
        areaName: name
      });
    }
    setMapHistory(history);
  }

  // 获取对应区域json文件
  const getMapJson = async(name) => {
    // 读取本地json文件
    // let jsonData;
    // const url = `./assets/json/${name}.json`;
    // try {
    //   jsonData = await import(url);
    // } catch (error) {
    //   alert(`${name}.json文件不存在`);
    //   return {};
    // }
    // return jsonData?.default;

    // 读取外部json文件
    return new Promise((resolve) => {
      request(`https://tmh-images.oss-cn-hangzhou.aliyuncs.com/json/${name}.json`, {
        method: 'GET',
      })
      .then(res=>{
        resolve(res);
      })
      .catch(()=>{
        console.log(`${name}地图文件不存在`);
        resolve({});
      })
    });
  }

  // 注册echarts区域地图
  const registerMap = async (code,name,type,callback, isFirst) => {
    if (!code) {
      return;
    }
    let regName = code;
    if (Number(regName) === 330000) {
      regName = countySplicing ? '330000-county' : '330000'
    }
    
    if (!echarts.getMap(regName)) {
      const newMapJson = await getMapJson(regName);
      if (isEmptyObject(newMapJson)) {
        return;
      }
      echarts.registerMap(String(regName), newMapJson)
    }
    callback(regName,name,type,isFirst);
  }

  // 初始化地图 geo配置项
  const updateMapGeo = code => {
    let option = {};
    if (viewMode === '3D') {
      // 3d预制
    }else{
      option = {
        geo: {
          show: true,
          id: 'gmap',
          map: String(code),
          ...BASE_CONFIG.geo,
          ...geo,
          projection: isRotateMap ? {
            project: (point) => mapProject(point),
            unproject: (point) => mapUnproject(point)
          } : null,
          itemStyle: {
            borderColor: BASE_CONFIG.defaultMapBorderColor,
            borderWidth: 1,
            areaColor: texture ? {
              image: textureImg,
              repeat: 'repeat',
            } : BASE_CONFIG.defaultMapAreaColor,
          },
        },
      }
    }
    myChart.current.setOption(option,{
      notMerge: true
    });
  }

  // 注册地图回调
  const registerMapCallback = (code, name, type, isFirst = false) => {
    updateMapGeo(code);
    setMapName(code);
    if (!isFirst) {
      setAreaCode(code,name);
    }
    if (type === 'down') {
      saveMapHistory(code, name);
    }
  }

  // 点击事件 处理地图下钻
  const handleMapClick = (params) => {
    params?.event?.stop();
    if (params?.componentType !== "geo") {
      // 获取区域编码
      const code = params?.data?.itemValue?.adcode || params?.data?.adcode;
      // 获取区域名称
      const name = params?.data?.name;
      if (canClickArea) {
        clickAreaCode({
          areaName: name,
          areaCode: code
        })
      }
      if (!drillDownMap || (!canDrillDownCount && isCounty(code))) {
        return;
      }
      if (params?.componentSubType === "map") {
        registerMap(code, name, 'down', registerMapCallback)
      }else if(params?.componentSubType === "scatter" && params?.data?.adcode){
        registerMap(code, name, 'down', registerMapCallback)
      }
    }
  };

  // 移出事件
  const handleMapMouseOut = (params) => {
    if (params?.componentType !== "geo") {
      if (params?.componentSubType === "scatter") {
        // 控制移入区域tooltip显示
        const chartDom = myChart?.current;
        chartDom.dispatchAction({
          type: 'downplay',
          seriesIndex: params.seriesIndex,
          dataIndex: params.dataIndex,
        });
        chartDom.dispatchAction({
          type: 'hideTip',
          seriesIndex: params.seriesIndex,
          dataIndex: params.dataIndex,
        });
      }
    }
  };

  // 鼠标移入事件
  const handleMapMouseOver = (params) => {
    if (params?.componentType !== "geo") {
      if (params?.componentSubType === "map") {
        if (!isEmphasisArea) {
          return;
        }
        // 控制移入区域tooltip显示
        const chartDom = myChart?.current;
        chartDom.dispatchAction({
          type: 'highlight',
          seriesIndex: 0,
          dataIndex: currentIndexRef.current,
        });
        chartDom.dispatchAction({
          type: 'showTip',
          seriesIndex: 0,
          dataIndex: currentIndexRef.current,
          position: function (pos, params, dom, rect, size) {
            // 鼠标在左侧时 tooltip 显示到右侧，鼠标在右侧时 tooltip 显示到左侧。
            let obj;
            if (barChart) {
              obj = {top: rect.y + (rect.height - size.contentSize[1])/2 - size.contentSize[1], left: rect.x + (rect.width - size.contentSize[0])/2};
            }else{
              obj = {top: rect.y + (rect.height - size.contentSize[1])/2, left: rect.x + (rect.width - size.contentSize[0])/2};
            }
            return obj;
          }
        });
        // 轮播tooltip处理逻辑 清除定时器
        if (!carouselTooltip) {
          return;
        }
        clearInterval(timeRef.current);
        currentIndexRef.current = params.dataIndex;
      }
      if (params?.componentSubType === "scatter") {
        // 控制移入区域tooltip显示
        const chartDom = myChart?.current;
        chartDom.dispatchAction({
          type: 'showTip',
          seriesIndex: params.seriesIndex,
          dataIndex: params.dataIndex,
          position: function (pos, params, dom, rect, size) {
            // 鼠标在左侧时 tooltip 显示到右侧，鼠标在右侧时 tooltip 显示到左侧。
            let obj;
            if (barChart) {
              obj = {top: rect.y + (rect.height - size.contentSize[1])/2 - size.contentSize[1], left: rect.x + (rect.width - size.contentSize[0])/2};
            }else{
              obj = {top: rect.y + (rect.height - size.contentSize[1])/2, left: rect.x + (rect.width - size.contentSize[0])/2};
            }
            return obj;
          }
        });
      }
    }
  };

  // 鼠标移动事件
  const handleMapMouseMove = (params) => {
    if (!isEmphasisArea) {
      return;
    }
    // 根据存储currentIndexRef与移动区域dataIndex判断是否相同，不同则隐藏上一个tooltip，显示当前tooltip
    if (params.dataIndex !== currentIndexRef.current && params?.componentType !== "geo") {
      const chartDom = myChart?.current;
      chartDom.dispatchAction({
        type: 'downplay',
        seriesIndex: 0,
        dataIndex: currentIndexRef.current,
      });
      chartDom.dispatchAction({
        type: 'hideTip',
        seriesIndex: 0,
        dataIndex: currentIndexRef.current,
      });

      currentIndexRef.current = params.dataIndex;
      chartDom.dispatchAction({
        type: 'highlight',
        seriesIndex: 0,
        dataIndex: currentIndexRef.current,
      });
      chartDom.dispatchAction({
        type: 'showTip',
        seriesIndex: 0,
        dataIndex: currentIndexRef.current,
        position: function (pos, params, dom, rect, size) {
          // 鼠标在左侧时 tooltip 显示到右侧，鼠标在右侧时 tooltip 显示到左侧。
          let obj;
          if (barChart) {
            obj = {top: rect.y + (rect.height - size.contentSize[1])/2 - size.contentSize[1], left: rect.x + (rect.width - size.contentSize[0])/2};
          }else{
            obj = {top: rect.y + (rect.height - size.contentSize[1])/2, left: rect.x + (rect.width - size.contentSize[0])/2};
          }
          return obj;
        }
      });
    }
    if (params?.componentType === "geo") {
      if (timeRef.current) {
        clearInterval(timeRef.current);
      }
      timeRef.current = setInterval(() => handleSelectMap(), intervalTime);
    }
  }

  // 自动轮播控制显示tooltip
  const handleSelectMap = () => {
    const list = myChart?.current?.getOption()?.series?.[0]?.data;
    if (
      !myChart?.current || 
      myChart?.current < 0 || 
      isEmptyArray(list)
    ) {
      return;
    };
    const dataLen = list?.length;
    const chartDom = myChart?.current;
    chartDom.dispatchAction({
      type: 'downplay',
      seriesIndex: 0,
      dataIndex: currentIndexRef.current,
    });
    currentIndexRef.current = (currentIndexRef.current + 1) % (dataLen || 1);
    chartDom.dispatchAction({
      type: 'highlight',
      seriesIndex: 0,
      dataIndex: currentIndexRef.current,
    });
    chartDom.dispatchAction({
      type: 'showTip',
      seriesIndex: 0,
      dataIndex: currentIndexRef.current,
      position: function (pos, params, dom, rect, size) {
        // 鼠标在左侧时 tooltip 显示到右侧，鼠标在右侧时 tooltip 显示到左侧。
        let obj;
        if (barChart) {
          obj = {top: rect.y + (rect.height - size.contentSize[1])/2 - size.contentSize[1], left: rect.x + (rect.width - size.contentSize[0])/2};
        }else{
          obj = {top: rect.y + (rect.height - size.contentSize[1])/2, left: rect.x + (rect.width - size.contentSize[0])/2};
        }
        return obj;
      }
    });
  };

  // 轮播tooltip处理逻辑
  const carouselFn = () => {
    if (timeRef.current) {
      const chartDom = myChart?.current;
      chartDom.dispatchAction({
        type: 'downplay',
        seriesIndex: 0,
        dataIndex: currentIndexRef.current,
      });
      chartDom.dispatchAction({
        type: 'hideTip',
        seriesIndex: 0,
        dataIndex: currentIndexRef.current,
      });
      currentIndexRef.current = -1;
      clearInterval(timeRef.current);
    }
    if (carouselTooltip && intervalTime) {
      handleSelectMap();
      timeRef.current = setInterval(() => handleSelectMap(), intervalTime);
    }
    return () => {
      currentIndexRef.current = -1;
      clearInterval(timeRef.current);
    };
  }

  const renderCustomDom = (arr) => {
    const maxValue = [...arr].sort((a, b) => {
      return b?.[sortValue] - a?.[sortValue]; // 降序
    })[0]?.[sortValue]
    return arr.map((raw) => {
      return renderCustomValue(raw,maxValue);
    });
  };

  // mapName/dataSource/scatterSource 三类数据更新后重组mapData数据
  useUpdateEffect(() => {
    (async () => {
      if (isEmptyArray(dataSource) && isEmptyArray(scatterSource)) {
        return;
      }
      setMapData({});
      const arry = dataSource
        .filter((item) => Number(item.areaCode) !== 330000)
        .map((item) => ({
          ...item,
          name: item?.[sortName],
          amount: item?.[sortValue] || 0,
        }));
      // 获取对应区域json
      const MAP_JSON = await getMapJson(mapName);
      if (isEmptyObject(MAP_JSON)) {
        return;
      }
      // 补充地图相关属性
      const mapRawData = myChart.current ? MAP_JSON?.features?.map((v) => {
        const dom = myChart.current;
        const item = arry.find((l) => String(l.name) === String(v.properties.name));
        const position = v?.properties?.centroid || v?.properties?.center || getPosition(v?.properties?.name, dom);
        let gaugePosition;
        try {
          gaugePosition = ringChart ? getPixelByConvert(dom, position) : []
        } catch (error) {
          gaugePosition = []
        }
        return {
          name: v.properties.name, // 区域名称
          adcode: v.properties.adcode, // 区域编码
          level: v.properties.level, // 区域级别
          position,
          gaugePosition,
          // pixel: dom?.convertToPixel('geo', v?.properties?.centroid || v?.properties?.center || v?.properties?.name) || [],
          parentAdcode:  v.properties?.parent?.adcode, // 上一级区域编码
          parentAdName:  v.properties?.parent?.adName, // 上一级区域名
          ...item,
        };
      }) : arry;
      // 数据排序 默认升序
      const newList = mapRawData
        .sort((a, b) => {
          if (sortOrder === SORT_ORDER_TYPE.ASC.code) {
            return a?.[sortValue] - b?.[sortValue]; // 升序
          }
          return b?.[sortValue] - a?.[sortValue]; // 降序
        })
        .map((item,index)=>({
          ...item,
          value: mapVisual?.type === 'continuous' ? index + 1 : Number(item?.[sortValue]),
          visualMapColor: getVisualMapColor({
            val: mapVisual?.type === 'continuous' ? index + 1 : Number(item?.[sortValue]),
            visualMap: mapVisual,
            mapDataLength: mapRawData.length,
            countySplicing,
            areaName: item.name
          }),
        }))
      // 区县拼接省级地图，区域名称标点过滤
      const areaNameScatter = (countySplicing && mapName === '330000-county') ? newList.filter(item => item?.level === "city") : newList;
      const scatterList = scatterSource?.map((item,index) => ({
        name: item?.[scatterName],
        value: [item.x, item.y, scatterVisual?.type === 'continuous' ? index + 1 : Number(item?.[sortValue])],
        amount: item?.[sortValue],
        itemValue: item
      })) || [];
      myChart.current.off('click');
      myChart.current.off('mouseOver');
      myChart.current.off('mousemove');
      myChart.current.off('mousemout');
      document?.getElementById('mapWrap')?.removeEventListener('click',()=>{
        run();
      })
      setMapData({
        baseData: newList,
        areaNameScatter,
        scatterData: scatterList,
      });
    })();
  }, [dataSource, scatterSource]);

  // mapData更新后加载纹理地图，加载完成设置地图option，绑定事件需在setOption后
  useUpdateEffect(() => {
    myChart.current.showLoading('default',{
      text: '',
      color: '#77E4E4',
      maskColor: 'rgba(255, 255, 255, 0)',
      zlevel: 0,
    });
    if (!isEmptyObject(mapData)) {
      textureImg.src = textureImage;
      // textureImg.setAttribute('crossOrigin', 'Anonymous');
      textureImg.onload = () => {
        if (textureImg.complete) {
          const config = getOption();
          myChart.current.setOption(config,{
            notMerge: true
          });
          myChart.current.on('click', handleMapClick);
          myChart.current.on('mouseOver', handleMapMouseOver);
          myChart.current.on('mousemove', handleMapMouseMove);
          myChart.current.on('mouseout', handleMapMouseOut);
          carouselFn();
          myChart.current.hideLoading();
        }
      };
    }
  }, [mapData]);

  useUpdateEffect(()=>{
    if (isFixHistory && Number(mapHistory?.[0]?.areaCode) !== 330000) {
      const newHistory = fixHistory(mapHistory);
      setMapHistory(newHistory);
    }
  },[mapHistory])

  useMount(()=>{
    if (chartRef.current) {
      // 初始化地图
      myChart.current = echarts.init(chartRef.current, null, {width: 'auto',height: 'auto'});
      // 注册地图
      registerMap(areaCode, areaName, 'down', registerMapCallback, true);
    }
    window.onresize = function () {
      if (chartRef.current) {
        myChart?.current?.resize();
      }
    }
  })

  useUnmount(()=>{
    myChart?.current?.dispose();
    currentIndexRef.current = -1
    clearInterval(timeRef.current);
  })

  return (
    <div className={styles.mapWrap} id="mapWrap">
      <div className={styles.mapContent} ref={chartRef}></div>
      { showCustomDom && renderCustomDom((mapData?.baseData || []))}
    </div>
  );
});
export default MapBox;

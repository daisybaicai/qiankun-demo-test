# echarts地图组件封装 1.0.0

## 技术栈

- react 17
- [umi4](https://umijs.org/docs/tutorials/getting-started)
- echarts 5.4.0

## 功能支持
1. 纹理配置开关
2. 展示区域名称label开关
3. 地图下钻开关 点击空白区域返回上一级
4. 气泡窗轮播开关
5. 3D旋转地图开关
6. 自定义Tooltip
7. 区域热力
8. 散点热力
9. 3D柱状图

## 组件入参
```javascript
{
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
  sortOrder = SORT_ORDER_TYPE.ASC.code, // 排序 默认升序code, // 排序
  // 开关
  showLabel = false, // 显示地图label
  drillDownMap = false, // 是否支持地图下钻
  texture = false, // 是否显示地图纹理
  textureImage = 'https://tmh-images.oss-cn-hangzhou.aliyuncs.com/defaultTexture.jpg', // 自定义纹理，默认纹理可替换成自己的
  carouselTooltip = false, // 气泡窗轮播
  intervalTime = 3*1000, // 轮播定时时间
  // 映射处理
  mapVisual = null, // 区域映射
  scatterVisual = null, // 散点映射
  // 基本配置项
  chart = {},
  mapStyle = {},
  tooltip = {},
  // 通知父级组件区域编码
  setAreaCode = ()=> {}
}
```

入参格式说明：
1. dataSource 基础地图渲染数据
```javascript
  [
    { name: '杭州市', value: 1000 },
    { name: '宁波市', value: 1000 },
    { name: '温州市', value: 1000 },
    { name: '嘉兴市', value: 1000 },
    { name: '湖州市', value: 1000 },
    { name: '绍兴市', value: 1000 },
    { name: '金华市', value: 1000 },
    { name: '衢州市', value: 1000 },
    { name: '舟山市', value: 1000 },
    { name: '台州市', value: 1000 },
    { name: '丽水市', value: 1000 },
  ]
```
若数据格式如下，需要额外传入sortName="areaCode" sortValue="amount"
```javascript
  [
    { areaName: '杭州市', amount: 1000 },
    { areaName: '宁波市', amount: 1000 },
    { areaName: '温州市', amount: 1000 },
    { areaName: '嘉兴市', amount: 1000 },
    { areaName: '湖州市', amount: 1000 },
    { areaName: '绍兴市', amount: 1000 },
    { areaName: '金华市', amount: 1000 },
    { areaName: '衢州市', amount: 1000 },
    { areaName: '舟山市', amount: 1000 },
    { areaName: '台州市', amount: 1000 },
    { areaName: '丽水市', amount: 1000 },
  ]
```

2. mapVisual scatterVisual 入参格式说明
参数同echarts 更多参数请前往：[echarts visualMap](https://echarts.apache.org/zh/option.html#visualMap)
```javascript
  {
    show: true, // 是否加载映射配置
    type: 'piecewise', // 映射类型 piecewise: 分段型 continuous: 连续型
    config: {
      show: true, // 是否显示 visualMap-piecewise 组件。如果设置为 false，不会显示，但是数据映射的功能还存在。
      selectedMode: false,
      pieces: [
        { gt: 100, color: 'rgba(70, 144, 40, .5)'},
        { gt: 95, lte: 100, color: 'rgba(188, 189, 69, 0.5)'},
        { lte: 95, color: 'rgba(176, 112, 58, .7)'},
      ],
      // 地图区块颜色映射表，对应上面 pieces
      areaColorMap: [
        { emphasisColor: 'rgba(70, 144, 40, .5)' },
        { emphasisColor: 'rgba(188, 189, 69, 0.5)' },
        { emphasisColor: 'rgba(176, 112, 58, .6)' },
      ],
    }
  }
```

3. mapStyle 格式说明 （设置样式类相关）
```javascript
  {
    geo: {},
    map: {},
    areaNamePoint: {},
    scatter: {},
    visual: {}
  }
```

|       参数       |                                   说明                                    |
| :--------------: | :-----------------------------------------------------------------------: |
|  geo  |                                  [链接](https://echarts.apache.org/zh/option.html#geo)                                   |
|  map  |                              [链接](https://echarts.apache.org/zh/option.html#series-map)                               |
|     areaNamePoint      |                                  [链接](https://echarts.apache.org/zh/option.html#series-scatter)                                   |
| scatter |                     [链接](https://echarts.apache.org/zh/option.html#series-scatter)                      |
|   visual    |                              [链接](https://echarts.apache.org/zh/option.html#visualMap)                               |

4. tooltip 自定义tooltip控制
```javascript
  import { createRoot } from 'react-dom/client';
  const EChartToolTips = ({data}) => {
    return <div>自定义tooltip / {data?.name} : {data?.value}</div>
  }

  const getRoot = container => {
    if (tooltipRef.current) {
      tooltipRef.current.unmount();
    }
    tooltipRef.current = createRoot(container);
    return tooltipRef.current;
  }

  {
    areaTooltip: {
      formatter: params => {
        setTimeout(()=>{
          const container = document.getElementById('tool-tip');
          getRoot(container).render(<EChartToolTips data={params} />); 
        },0)
        return `<div id="tool-tip"></div>`;
      }
    }
  }
```

import { getDprSize } from "./utils";

const BASE_CONFIG = {
  // 默认地图底色
  defaultMapAreaColor: 'rgba(29, 98, 69, 1)', 
  // 默认地图区域边框颜色
  defaultMapBorderColor: 'rgba(255, 255, 255, 1)',
  
  visual: {
    piecewise: {
      hoverLink: false,
      align: 'left',
      textStyle: {
        color: '#000',
        fontSize: getDprSize(12),
      },
      itemWidth: getDprSize(20),
      itemHeight: getDprSize(12),
      itemSymbol: 'rect',
    },
    continuous: {
      min: 1,
      calculable: false,
      hoverLink: false,
      align: 'top',
    }
  },
  geo: {
    layoutCenter: ['50%', '50%'],
    layoutSize: '150%',
    aspectScale: 1,
    zoom: 0.65,
  },
  // 地图区域名称基础样式
  areaNameScatter: {
    label: {
      show: true,
      position: [getDprSize(-14), 0],
      formatter: '{b}',
      color: '#FFFFFF',
      fontSize: getDprSize(16),
      fontWeight: 600,
      distance: 0,
    },
    symbolSize: 0,
  },
  scatter: {
    symbolSize: 8,
    label: {
      show: false,
    },
    itemStyle: {
      color: 'rgba(255,150,100,1)',
    },
    emphasis: {
      scale: 2,
      label: {
        show: false,
      },
    },
    tooltip: {
      trigger: 'item',
      formatter(params) {
        return `${params.name} : ${params.value[2]}`;
      },
    }
  }
}
export default BASE_CONFIG;
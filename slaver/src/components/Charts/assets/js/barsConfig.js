import { getDprSize } from "@/utils/utils";
import { formatAmount } from "@/utils/format";

const BASE_CONFIG = {
  legend: {
    top: getDprSize(9),
    itemWidth: getDprSize(10),
    itemHeight: getDprSize(10),
    textStyle: {
      fontSize: getDprSize(10),
      color: '#000',
    }
  },
  xAxis: {
    axisTick: { 
      show: true,
      alignWithLabel: true
    },
    axisLabel: {
      color: '#000',
      fontSize: getDprSize(14),
      interval: 0,
    },
    axisLine: {
      show: true,
      lineStyle: {
        color: '#000',
      },
    }
  },
  yAxis: {
    nameTextStyle: {
      color: '#000',
      align: 'left',
      fontSize: getDprSize(14),
    },
    axisLabel: {
      color: '#000',
      fontSize: getDprSize(14),
      interval: 0,
      // formatter: v => formatAmount(Math.ceil(v)),
      formatter: v => formatAmount(v),
    },
    axisLine: {
      show: true,
      lineStyle: {
        color: '#000',
      },
    },
    splitLine: {
      show: false,
    },
  },
  grid: {
    show: false,
    left: 0,
    right: 0,
    bottom: 0,
    top: getDprSize(20),
    containLabel: true,
  },
  barsSeries: {
    barWidth: getDprSize(15),
    barGap: '30%'
  },
  scatterSeries: {
    symbolSize: getDprSize(10),
    itemStyle: {
      color: '#77E4E4'
    }
  }
}
export default BASE_CONFIG;
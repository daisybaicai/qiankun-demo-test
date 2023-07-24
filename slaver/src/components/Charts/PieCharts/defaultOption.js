/**
 * 颜色数组，数据超出数组长度后会重新从头开始取颜色
 */
const color = [];

/**
 * legend相关配置
 */
const legendOption = {};

/**
 * tooltip相关配置
 */
const tooltipOption = {};

/**
 * series相关配置
 */
const seriesOption = {};

/**
 * 是否开启自动轮播
 */
const autoPlay = false;

/**
 * 自动轮播相关配置
 * 需设置autoPlay为true生效
 * time用于设置轮播速度，单位ms;
 * seriesIndex用于标识哪一层需要自动轮播。可传数组。
 */
const autoPlayOption = {
  time: 3000,
  seriesIndex: 0,
};

/**
 * 	高亮相关配置
 */
const highLightOption = {
  /**
   * default用于标识默认高亮。若有值，自动轮播也会取该值作为初始项。
   *  1. 若未设置dataIndex，则默认不高亮；
      2. 若未设置seriesIndex，则seriesIndex默认为0；
      3. 若都未设置，则默认不高亮。
      4. 若seriesIndex与dataIndex长度不对等;
       4.1 若seriesIndex比较长, 则dataIndex取最后一位补齐;
       4.2 若dataIndex比较长， 则只截取seriesIndex长度;
   */
  default: {
    seriesIndex: [],
    dataIndex: []
  },
  /**
   * stillHight用于设置鼠标上移再移开后是否保持高亮。
   */
  stillHight: false,
  /**
   * callback设置高亮回调函数。旭日图下存在wholeParams。
   */
  // callback: (params, wholeParams) => {}
}

/**
 * 	圆环内置内容相关配置
 */
const centerBlockOption = {};

export {
  color,
  legendOption,
  tooltipOption,
  seriesOption,
  autoPlay,
  autoPlayOption,
  highLightOption,
  centerBlockOption
};
// export default defaultOption;

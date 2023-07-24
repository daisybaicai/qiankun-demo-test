import React, { useEffect, useMemo } from "react";
import { getCustomLegendProps, getLegendOrient } from "../helper";
import "./index.less";
import LegendIcon from "./LegendIcon";

const CustomLegend = ({ seriesMap, legendProps, style }) => {
  const {
    custom: {
      iconConfig = { type: "rect" },
      gap = 12,
      itemStyle,
      containerStyle,
      position,
    },
  } = legendProps;

  const { legendStyle } = getCustomLegendProps(legendProps);
  const orient = getLegendOrient(position);

  return (
    <div
      className={`customLegend ${orient}`}
      style={{
        ...legendStyle,
        ...style,
        ...containerStyle,
        "--gap": `${gap}px`,
      }}
    >
      {seriesMap?.map((item, index) => {
        const type = Array.isArray(iconConfig.type)
          ? iconConfig.type[index]
          : iconConfig.type;
        return (
          <div className="customLegendItem" style={itemStyle}>
            <LegendIcon color={item.color} {...iconConfig} type={type} />
            {typeof legendProps.custom?.content === "function"
              ? legendProps.custom?.content(item)
              : item.desc}
          </div>
        );
      })}
    </div>
  );
};

export default CustomLegend;

import React, { useEffect, useMemo } from "react";
import CustomLegend from "./CustomLegend";
import { getFlexDirection, getIsTopLegend,getIsLegendCustom } from "./helper";

const ChartBody = ({ children, legendProps, ...otherProps }) => {
  const containerStyle = {
    display:"flex",
    flexDirection: getFlexDirection(legendProps?.custom?.position),
  };
  const isLegendCustomNotTop = getIsLegendCustom(legendProps) &&  !getIsTopLegend(legendProps)

  return (
    <div className="chartView"  style={containerStyle}>
      {children}
      {
      isLegendCustomNotTop && <CustomLegend legendProps={legendProps} {...otherProps} />
     }
    </div>
  );
};

export default ChartBody;

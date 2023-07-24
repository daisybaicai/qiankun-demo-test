import React, { useEffect, useMemo } from "react";
import CustomLegend from "./CustomLegend";
import { getFlexDirection, getIsTopLegend,getIsLegendCustom } from "./helper";

const ChartContainer = ({ children, legendProps, ...otherProps }) => {
  const containerStyle = {
    flexDirection: getFlexDirection(legendProps?.custom?.position),
  };

  return (
    <div className="chartWrap">
      {children}
     {/* {
      isLegendCustomNotTop && <CustomLegend legendProps={legendProps} {...otherProps} />
     } */}
    </div>
  );
};

export default ChartContainer;

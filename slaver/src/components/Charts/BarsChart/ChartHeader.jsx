import React, { useEffect, useMemo } from "react";
import CustomLegend from "./CustomLegend";
import { getIsLegendCustom, getIsTopLegend } from "./helper";

const ChartHeader = ({ children, legendProps, ...otherProps }) => {

  const isLegendCustomTop =
    getIsLegendCustom(legendProps) && getIsTopLegend(legendProps);

  const titleContainerStyle = {
    display: "flex",
  };


  return (
    <div className="chartTitle" style={titleContainerStyle}>
      {children}
      {isLegendCustomTop ? (
        <CustomLegend
          legendProps={legendProps}
          {...otherProps}
          style={{ flex: 1 }}
        />
      ) : null}
    </div>
  );
};

export default ChartHeader;

import React, { useEffect, useMemo } from "react";
import { getCustomLegendProps } from "../helper";
import "./index.less";

const Circle = ({ style, iconWidth = 12, iconHeight = 12 }) => (
  <span
    className="customLegendIcon customLegendIcon--circle"
    style={{ width: iconWidth, height: iconHeight, ...style }}
  ></span>
);

const Rect = ({ style, iconWidth = 20, iconHeight = 12 }) => (
  <span
    className="customLegendIcon customLegendIcon--rect"
    style={{ width: iconWidth, height: iconHeight, ...style }}
  ></span>
);

const RoundRect = ({ style, iconWidth = 20, iconHeight = 12 }) => (
  <span
    className="customLegendIcon customLegendIcon--roundrect"
    style={{ width: iconWidth, height: iconHeight, ...style }}
  ></span>
);

const Diamond = ({ style, iconWidth = 12, iconHeight = 12 }) => (
  <span
    className="customLegendIcon customLegendIcon--diamond"
    style={{ width: iconWidth, height: iconHeight, ...style }}
  ></span>
);
const Arrow = ({ style, iconWidth = 12, iconHeight = 12 }) => (
  <span
    className="customLegendIcon customLegendIcon--arrow"
    style={{ width: iconWidth, height: iconHeight, ...style }}
  ></span>
);
const Triangle = ({ style, iconWidth = 12, iconHeight = 12 }) => (
  <span
    className="customLegendIcon customLegendIcon--triangle"
    style={{ width: iconWidth, height: iconHeight, ...style }}
  ></span>
);

const CustomIcon = ({ style, iconWidth = 12, iconHeight = 12, type }) => {
  const customStyle = {
    ...style,
    width: iconWidth,
    height: iconHeight,
    backgroundImage: `url(${type})`,
    backgroundColor: "transparent",
    backgroundSize: "100% 100%",
  };
  return (
    <span
      className="customLegendIcon customLegendIcon--img"
      style={customStyle}
    ></span>
  );
};

const LegendIcon = ({ type = "rect", iconWidth, iconHeight, color, style }) => {
  const iconColor =
    typeof color === "object" ? color?.colorStops?.[0]?.color : color;
  const iconProps = {
    width: iconWidth,
    height: iconHeight,
    style: {
      background: iconColor,
      marginRight: 8,
      ...style,
    },
  };

  switch (type) {
    case "circle":
      return <Circle {...iconProps} />;
    case "rect":
      return <Rect {...iconProps} />;
    case "roundrect":
      return <RoundRect {...iconProps} />;
    case "diamond":
      return <Diamond {...iconProps} />;
    case "triangle":
      return <Triangle {...iconProps} />;
    case "arrow":
      return <Arrow {...iconProps} />;
    default:
      return <CustomIcon {...iconProps} type={type} />;
  }
};

export default LegendIcon;

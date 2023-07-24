const defaultPosition = "topCenter";

export const getIsLegendCustom = (legendProps) => {
  return legendProps.custom?.show ;
};

export const getIsTopLegend = (legendProps) => {
  const {
    custom: { position = defaultPosition },
  } = legendProps;
  return ["topLeft", "topCenter", "topRight"].includes(position);
};

export const getIsBottomLegend = (legendProps) => {
  const {
    custom: { position = defaultPosition },
  } = legendProps;
  return ["bottomLeft", "bottomCenter", "bottomRight"].includes(position);
};

export const getEchartsLegendProps = (legendProps) => {
  //配置了展示custom，就展示自定义
  if (getIsLegendCustom(legendProps)) {
    return { show: false };
  } else {
    return legendProps;
  }
};

export const getFlexDirection = (position = defaultPosition) => {
  if (
    [
      "topLeft",
      "topRight",
      "topCenter",
      "bottomLeft",
      "bottomCenter",
      "bottomRight",
    ].includes(position)
  ) {
    return "column";
  } else {
    return "row";
  }
};

export const getLegendOrient = (position = defaultPosition) => {
  if (
    [
      "topLeft",
      "topRight",
      "topCenter",
      "bottomLeft",
      "bottomCenter",
      "bottomRight",
    ].includes(position)
  ) {
    return "horizontal";
  } else {
    return "vertical";
  }
};

export const getLegendFlexDirection = (position = defaultPosition) => {
  const orient = getLegendOrient(position);
  return orient === "horizontal" ? "row" : "column";
};

export const getJustifyContent = (position = defaultPosition) => {
  if (["topLeft", "rightTop", "leftTop", "bottomLeft"].includes(position)) {
    return "flex-start";
  } else if (
    ["topRight", "rightBottom", "leftBottom", "bottomRight"].includes(position)
  ) {
    return "flex-end";
  } else {
    return "center";
  }
};
export const getCustomLegendProps = (legendProps) => {
  //配置了展示custom，就展示自定义

  if (getIsLegendCustom(legendProps)) {
    const {
      custom: { position },
    } = legendProps;
    return {
      legendStyle: {
        display: "flex",
        justifyContent: getJustifyContent(position),
        flexDirection: getLegendFlexDirection(position),
      },
    };
  }
  return {};
};

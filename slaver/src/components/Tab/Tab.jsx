import cn from "classnames";
import styles from "./index.less";
import React, { useState } from "react";

export const Tab = React.memo(
  ({
    onChange, //点击tab触发事件
    value, //当前tab的对应值
    options, //tab的选项
    isLabelImage, //tab是否是一个图片
  }) => {
    const [activeTab, setActiveTab] = useState(value);
    const handleTabChange = (v) => {
      setActiveTab(v);
      onChange(v);
    };
    if (isLabelImage) {
      return (
        <div className={styles.imageTab}>
          {options.map((item, index) => (
            <span key={index} onClick={() => handleTabChange(item.value)}>
              <img
                src={
                  activeTab === item.value
                    ? item.activeLabel
                    : item.inActiveLabel
                }
                alt=""
              />
            </span>
          ))}
        </div>
      );
    }

    return (
      <div className={styles.tab}>
        {options.map((item, index) => (
          <span
            key={index}
            onClick={() => handleTabChange(item.value)}
            className={cn(activeTab === item.value && styles.active)}
          >
            {item.label}
          </span>
        ))}
      </div>
    );
  }
);

const TabExample = () => {
  const [activeTab, setActiveTab] = useState(1);

  const handleTabChange = (value) => {
    setActiveTab(value);
  };

  return (
    <Tab
      options={[
        { value: 0, activeLabel: activeTab1, inActiveLabel: inActiveTab1 },
        { value: 1, activeLabel: activeTab2, inActiveLabel: inActiveTab2 },
      ]}
      value={activeTab}
      onChange={handleTabChange}
      isLabelImage
    />
  );
};

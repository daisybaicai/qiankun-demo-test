import cn from "classnames";
import React, { useState, useEffect } from "react";
import { useUpdateEffect } from "ahooks";
import { Spin } from 'antd';
import { RightOutlined } from '@ant-design/icons';
import { Tab } from "../Tab/Tab";
import MySelect from "@/components/MySelect/index";
import { isEmptyArray } from "@/utils/utils";
import styles from "./index.less";
import { history } from "umi";

const Card = React.memo(
  ({
    title = "",
    onTitleClick,
    redirectUrl,
    children,
    tabProps = { tabOptions: [], onTabChange: () => {} },
    selectProps = {
      defaultKey: '',
      selectOptions: [],
      onSelectChange: () => {},
    },
    buttonProps = { text: "", onClick: () => {} },
    operatorPosition = "inside",
    selectStyle = {},
    bodyStyle = {},
    cardStyle = {},
    icon = <div className={styles.titleIcon} />,
    iconPosition = "left",
    loading = true,
    containerClassName,
  }) => {
    const { tabOptions, onTabChange } = tabProps;
    const { selectOptions, onSelectChange, defaultKey, ...selectPropsOthers } = selectProps;
    const { text: buttonText, onClick, style = {} } = buttonProps;
    const [activeTab, setActiveTab] = useState(tabOptions[0]?.value);
    const handleTabChange = (v) => {
      setActiveTab(v);
      onTabChange && onTabChange(v);
    };

    const [selected, setSelected] = useState('');
    const handleSelectChange = (v) => {
      setSelected(v);
      onSelectChange && onSelectChange(v);
    };

    const handleTitleClick = () => {
      if (redirectUrl) {
        history.push(redirectUrl);
      } else {
        onTitleClick && onTitleClick();
      }
    };

    useEffect(()=>{
      setSelected(defaultKey);
    },[defaultKey])

    return (
      <div className={cn(styles.cardContainer,containerClassName)} style={cardStyle}>
        <div className={styles.cardHeader} >
          {iconPosition === "left" && icon}
          <div
            onClick={handleTitleClick} 
            className={cn(styles.title, {
              [styles.link]: redirectUrl || onTitleClick
            })}
          >
            {title}
            {iconPosition === "right" && icon}
          </div>

          <div
            className={cn(styles.operator, {
              [styles.outside]: operatorPosition === "outside",
            })}
          >
            {!isEmptyArray(selectOptions) && (
              <MySelect
                className="card"
                popupClassName="card"
                options={selectOptions}
                defaultValue={selected}
                handleChange={handleSelectChange}
                {...selectPropsOthers}
                {...selectStyle}
              />
            )}

            {!isEmptyArray(tabOptions) && (
              <Tab
                options={tabOptions}
                value={activeTab}
                onChange={handleTabChange}
              />
            )}

            {buttonText && (
              <div className={styles.buttonContainer} onClick={onClick} style={style}>
                {buttonText}
                <RightOutlined />
              </div>
            )}
          </div>
        </div>

        <div className={styles.cardContent} style={bodyStyle}>
          {/* {children} */}
          {
            loading ? (<Spin color="#77E4E4" size="large" />) : (children)
          }
        </div>
      </div>
    );
  }
);

export default Card;

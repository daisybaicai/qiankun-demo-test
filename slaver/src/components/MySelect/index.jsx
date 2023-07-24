import React from "react";
import cn from "classnames";
import { Select } from "antd";
import { CaretDownOutlined } from '@ant-design/icons';
import styles from "./index.less";

const MySelect = React.memo(
  ({
    defaultValue,
    handleChange = () => {},
    options = [],
    bordered = true, //是否有边框
    suffixIcon = <CaretDownOutlined />, //自定义的选择框后缀图标
    style = {}, //选择框的样式
    className, //选择框的class，通过该class可以自定义某一个select的选择框样式
    popupClassName, //下拉菜单的class，通过该class可以自定义某一个select的下拉菜单样式
    dropdownStyle, //下拉菜单的style
    ...others //其他属性可查看ant design文档：https://4x.ant.design/components/select-cn/#API
  }) => {
    return (
      <div className={cn(styles.selectContainer, className)} style={{...style}}>
        <Select
          value={defaultValue}
          popupClassName={popupClassName}
          onChange={handleChange}
          options={options}
          suffixIcon={suffixIcon}
        />
      </div>
    );
  }
);
export default MySelect;

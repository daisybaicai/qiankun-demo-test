import React, { useState, useEffect } from 'react';
import {
  CaretDownOutlined,
  CaretUpOutlined,
  CheckOutlined
} from '@ant-design/icons';
import cn from 'classnames';
import styles from './index.less';

const MyTabs = React.memo(({
  options,
  size="big",
  defaultKey = '',
  upTabKey = () => {},
  style,
  boxStyle
}) => {

  const [tabKey, setTabKey] = useState(defaultKey);
  const [subTabShow, setSubTabShow] = useState(null);

  const handleChangeTab = key => {
    if (tabKey !== key) {
      setTabKey(key);
      upTabKey(key);
      setSubTabShow(null);
    }
  }

  useEffect(()=>{
    if (defaultKey) {
      setTabKey(defaultKey);
    }
  },[defaultKey])

  return (
    <div className={cn(styles.baseTabsWrap, styles[size])} style={{...style}}>
      {
        Object.getOwnPropertyNames(options).map((i) => (
          <div 
            className={cn(styles.baseTabBox, {
              [styles.active]: options[i].children ? 
              Object.getOwnPropertyNames(options[i].children).map(val => options[i].children[val].code).includes(tabKey) :
              tabKey === options[i].code
            })} 
            // className={cn(styles.baseTabBox, {
            //   [styles.active]: tabKey === options[i].code
            // })} 
            key={options[i].code}
            onClick={() => {
              options[i].children ? setSubTabShow(subTabShow ? null : options[i].code) : handleChangeTab(options[i].code)
            }}
            style={{...boxStyle}}
          >
            { options[i].desc }
            {
              options[i].children && (subTabShow === options[i].code ? <CaretUpOutlined className={styles.allowIcon}/> : <CaretDownOutlined className={styles.allowIcon} />)
            }
            {
              options[i].children && subTabShow === options[i].code && (
                <div className={styles.subTabWrap}>
                  {
                    Object.getOwnPropertyNames(options[i].children).map((key) => (
                      <div className={cn(styles.subTabBox, {[styles.active]: tabKey === options[i].children[key].code})} onClick={() => handleChangeTab(options[i].children[key].code)}>
                        {options[i].children[key].desc}
                        {
                          tabKey === options[i].children[key].code && <CheckOutlined className={styles.checkIcon}/>
                        }
                      </div>
                    ))
                  }
                </div>
              )
            }
          </div>
        ))
      }
    </div>
  );
});
export default MyTabs;

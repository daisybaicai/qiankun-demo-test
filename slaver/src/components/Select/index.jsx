import React, { useState } from 'react';
import cn from 'classnames';
import { CaretDownOutlined, CaretUpOutlined } from '@ant-design/icons';
import styles from './index.less';

const Select = React.memo(({ data = [],defaultValue, getSelectValue = () => {} }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectValue, setSelectValue] = useState(defaultValue || data[0].name);

  const changeSelectValue = (item) => {
    if (selectValue !== item.name) {
      setSelectValue(item.name);
      getSelectValue(item.value);
    }
    setIsOpen(false);
  };

  return (
    <div className={styles.selectWrap}>
      <div className={styles.selected} onClick={() => setIsOpen(!isOpen)}>
        {selectValue}
        {isOpen ? (
          <CaretUpOutlined style={{ fontSize: '.11rem', marginLeft: '.02rem' }} />
        ) : (
          <CaretDownOutlined style={{ fontSize: '.11rem', marginLeft: '.02rem' }} />
        )}
      </div>
      {isOpen && (
        <div className={styles.list}>
          {data.map((item) => (
            <div className={styles.box} onClick={() => changeSelectValue(item)}>
              {item.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
});
export default Select;

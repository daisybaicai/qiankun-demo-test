import React, { useCallback, useRef } from 'react';
import styles from './index.less';

const LegendItem = props => {
  const { name, show } = props;
  const domRef = useRef();
  const operateRef = useRef();

  const handleMouseEnter = useCallback(() => {
    props.handleLegendHover(name)
  }, [name])

  const handleMouseLeave = () => {
    if (operateRef.current === 'click') return;
    props.handleLegendLeave()
  }

  const handleMouseClick = useCallback(() => {
    operateRef.current = 'click';
    props.handleLegendClick(name)
  }, [name])
  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleMouseClick}
    >
      <div
        ref={domRef}
        className={`${styles['legend-item']} 
            ${show ? '' : ` ${styles['noselect-item']}`}`}
      >
        {props.children}
      </div>
    </div>

  )
}

export default LegendItem;
import React, { useRef } from 'react';
import { identity } from 'lodash';

import styles from './index.scss';

export const Checkbox = ({
  id = '',
  onClick = identity,
}) => {
  const checkboxRef = useRef(null);
  const clickHandler = () => onClick(checkboxRef.current.checked);

  return (
    <label id={id} className={styles.container}>
      <input type="checkbox" ref={checkboxRef} onClick={clickHandler}/>
      <span className={styles.checkmark}></span>
    </label>
  );
};

export default Checkbox;

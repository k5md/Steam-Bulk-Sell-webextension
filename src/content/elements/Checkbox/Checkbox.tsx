import React, { useRef } from 'react';
import { identity } from 'lodash';

import styles from './index.scss';

export const Checkbox = ({
  id = '',
  onChange = identity,
  checked = null,
}) => {
  return (
    <label id={id} className={styles.container}>
      <input type="checkbox" onChange={onChange} checked={checked}/>
      <span className={styles.checkmark}></span>
    </label>
  );
};

export default Checkbox;

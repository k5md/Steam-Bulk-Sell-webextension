import React, { ChangeEventHandler } from 'react';
import { identity } from 'lodash';

import styles from './index.scss';

export interface Props {
  id?: string;
  onChange?: ChangeEventHandler;
  checked?: boolean;
}

export const Checkbox: React.FC<Props> = ({
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

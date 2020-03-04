import React, { MouseEventHandler } from 'react';
import cn from 'classnames';
import { BUTTON_PRIMARY } from '../../constants';
import styles from './index.scss';

export interface Props {
  sellHandler: MouseEventHandler;
  toggleVisible: MouseEventHandler;
}

export const Controls: React.FC<Props> = ({ sellHandler, toggleVisible }) => (
  <div className={styles.controls__container}>
    <input
      type="button"
      onClick={sellHandler}
      value={browser.i18n.getMessage("controls_button_sell")}
      className={cn(BUTTON_PRIMARY, styles.controls__button)}
    />
    <input
      type="button"
      onClick={toggleVisible}
      value={browser.i18n.getMessage("controls_button_toggle_visible")}
      className={cn(BUTTON_PRIMARY, styles.controls__button)}
    />
  </div>
);

export default Controls;

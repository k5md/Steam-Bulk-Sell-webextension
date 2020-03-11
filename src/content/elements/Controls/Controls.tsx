import React, { MouseEventHandler } from 'react';
import cn from 'classnames';
import { BUTTON_PRIMARY } from '../../constants';
import Button from 'react-bootstrap/Button';
import { LoadingIndicator } from '../';
import styles from './index.scss';

export interface Props {
  sellHandler: MouseEventHandler;
  toggleVisible: MouseEventHandler;
  selling: boolean;
}

export const Controls: React.FC<Props> = ({ sellHandler, toggleVisible, selling }) => {
  const availableControls = selling
    ? (<LoadingIndicator
      indicator="https://steamcommunity-a.akamaihd.net/public/images/login/throbber.gif"
      text={browser.i18n.getMessage('controls_selling')}
    />)
    : (<React.Fragment>
      <Button className={cn(BUTTON_PRIMARY, styles.controls__button)} onClick={sellHandler}>
        <span>{browser.i18n.getMessage("controls_button_sell")}</span>
      </Button>
      <Button onClick={toggleVisible} className={cn(BUTTON_PRIMARY, styles.controls__button)}>
        <span>{browser.i18n.getMessage("controls_button_toggle_visible")}</span>
      </Button>
    </React.Fragment>);
  
  return (
    <div className={styles.controls__container}>
      {availableControls}
    </div>
  );
};

export default Controls;

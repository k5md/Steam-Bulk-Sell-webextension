import React, { MouseEventHandler } from 'react';
import { BUTTON_PRIMARY } from '../../constants';

export interface Props {
  sellHandler: MouseEventHandler;
}

export const Controls: React.FC<Props> = ({ sellHandler }) => (
  <div>
    <input
      type="button"
      onClick={sellHandler}
      value={browser.i18n.getMessage("controls_button_sell")}
      className={BUTTON_PRIMARY}
      style={{ marginTop: '10px', }}
    />
  </div>
);

export default Controls;

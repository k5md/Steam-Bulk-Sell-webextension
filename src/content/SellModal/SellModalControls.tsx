import React from 'react';
import { Modal } from '../Modal';
import * as styles from './index.css';
import { BUTTON_SECONDARY } from 'content/constants';

export const SellModalControls = ({
onSell,
onClose,
onClear,
items,
percentageModifier = '+0',
total = '0',
}) => (
  <div className={styles.modal_sell__controls}>
    <div className={styles.modal_sell__price_modifier}>
      <div>
        <label>{browser.i18n.getMessage('modal_price_modifier_median')}</label>
        <input type="radio" name="priceModifier" onChange={setPriceModifier} checked />
      </div>
      <div>
        <label>{browser.i18n.getMessage('modal_price_modifier_percentage')}</label>
        <input type="radio" name="priceModifier" onChange={setPriceModifier} />
        <input
          type="text"
          pattern="[-|+][0-9]{1,3}"
          size={4}
          maxLength={4}
          value={percentageModifierValue}
          onInput={(e) => {
            this.percentageModifier = (e.target as HTMLInputElement).value;
            this.handlePriceModifier('percentage');
          }}
          className={styles.modal_sell__percentage_number}
        />
      </div>
      <div>
        <label>{browser.i18n.getMessage('modal_price_modifier_custom')}</label>
        <input type="radio" name="priceModifier" onChange={setPriceModifier} />
      </div>
    </div>
    <input
      type="button" 
      value={browser.i18n.getMessage('modal_button_clear')}
      className={BUTTON_SECONDARY}
      onClick={clearHandler}
    />
    <input
      type="button"
      value={browser.i18n.getMessage('modal_button_close')}
      className={BUTTON_SECONDARY}
      onClick={closeHandler}
    />
    <input
      type="button"
      value={browser.i18n.getMessage('modal_button_sell')}
      className={BUTTON_PRIMARY}
      onClick={sellHandler}
    />
  </div>
);

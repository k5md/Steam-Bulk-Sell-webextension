import React from 'react';
import { observer } from 'mobx-react-lite';
import cn from 'classnames';
import { BUTTON_SECONDARY, BUTTON_PRIMARY } from 'content/constants';
import styles from './index.scss';

export type SellModalControlsProps  = {
  sellHandler: (...args: any[]) => void;
  closeHandler: (...args: any[]) => void;
  clearHandler: (...args: any[]) => void;
  multiplyModifier: number;
  priceModifier: string;
  setPriceModifier: (...args: any[]) => void;
  setMultiplyModifier: (...args: any[]) => void;
  fetchedItems: boolean;
};

export const SellModalControls: React.FC<SellModalControlsProps> = observer(({
  sellHandler,
  closeHandler,
  clearHandler,
  multiplyModifier,
  setMultiplyModifier,
  priceModifier,
  setPriceModifier,
  fetchedItems,
}) => (
  <div className={styles.modal_sell__controls}>   
    <div className={styles.modal_sell__price_modifier}>
      <div>
        <label>{browser.i18n.getMessage('modal_price_modifier_median')}</label>
        <input
          type="radio"
          name="priceModifier"
          value="median"
          onChange={setPriceModifier}
          checked={priceModifier === 'median'}
        />
      </div>
      <div>
        <label>{browser.i18n.getMessage('modal_price_modifier_multiply')}</label>
        <input
          type="radio"
          name="priceModifier"
          value="multiply"
          onChange={setPriceModifier}
          checked={priceModifier === 'multiply'}
        />
        <input
          type="text"
          pattern="[0-9]{1,3}"
          value={multiplyModifier}
          onInput={setMultiplyModifier}
          className={styles.modal_sell__multiply_number}
        />
      </div>
      <div>
        <label>{browser.i18n.getMessage('modal_price_modifier_custom')}</label>
        <input
          type="radio"
          name="priceModifier"
          value="custom"
          onChange={setPriceModifier}
          checked={priceModifier === 'custom'}
        />
      </div>
    </div>
    <div className={styles.modal_sell__buttons}>
      <input
        type="button" 
        value={browser.i18n.getMessage('modal_button_clear')}
        className={cn(BUTTON_SECONDARY, styles.modal_sell__button)}
        onClick={clearHandler}
      />
      <input
        type="button"
        value={browser.i18n.getMessage('modal_button_close')}
        className={cn(BUTTON_SECONDARY, styles.modal_sell__button)}
        onClick={closeHandler}
      />
      <input
        type="button"
        value={browser.i18n.getMessage(fetchedItems ? 'modal_button_sell' : 'modal_wait')}
        className={cn(BUTTON_PRIMARY, styles.modal_sell__button)}
        onClick={sellHandler}
        disabled={!fetchedItems}
      />
    </div>
  </div>
));

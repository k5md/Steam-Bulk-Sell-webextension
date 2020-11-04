import React from 'react';
import { observer } from 'mobx-react-lite';
import cn from 'classnames';
import { BUTTON_SECONDARY, BUTTON_PRIMARY } from 'content/constants';
import Button from 'react-bootstrap/Button';
import styles from './index.scss';

export type SellModalControlsProps  = {
  sellHandler: (...args: any[]) => void;
  closeHandler: (...args: any[]) => void;
  clearHandler: (...args: any[]) => void;
  multiplyModifier: number;
  priceModifier: string;
  offsetModifier: number;
  setPriceModifier: (...args: any[]) => void;
  setMultiplyModifier: (...args: any[]) => void;
  setOffsetModifier: (...args: any[]) => void;
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
  offsetModifier,
  setOffsetModifier,
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
          pattern="[0-9]+([\.][0-9]{1,})?"
          value={multiplyModifier}
          onInput={setMultiplyModifier}
          className={styles.modal_sell__multiply_number}
          title={browser.i18n.getMessage('modal_price_modifier_multiply_tooltip')}
        />
      </div>
      <div>
        <label>{browser.i18n.getMessage('modal_price_modifier_offset')}</label>
        <input
          type="radio"
          name="priceModifier"
          value="offset"
          onChange={setPriceModifier}
          checked={priceModifier === 'offset'}
        />
        <input
          type="text"
          pattern="-?[0-9]+([\.][0-9]{1,})?"
          value={offsetModifier}
          onInput={setOffsetModifier}
          className={styles.modal_sell__offset_number}
          title={browser.i18n.getMessage('modal_price_modifier_offset_tooltip')}
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
      <Button onClick={clearHandler} className={cn(BUTTON_SECONDARY, styles.modal_sell__button)}>
        <span>{browser.i18n.getMessage('modal_button_clear')}</span>
      </Button>
      <Button onClick={closeHandler} className={cn(BUTTON_SECONDARY, styles.modal_sell__button)}>
        <span>{browser.i18n.getMessage('modal_button_close')}</span>
      </Button>
      <Button onClick={sellHandler} className={cn(BUTTON_PRIMARY, styles.modal_sell__button)} disabled={!fetchedItems}>
        <span>{browser.i18n.getMessage(fetchedItems ? 'modal_button_sell' : 'modal_wait')}</span>
      </Button>
    </div>
  </div>
));

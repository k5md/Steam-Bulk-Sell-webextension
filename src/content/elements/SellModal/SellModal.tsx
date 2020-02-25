import React from 'react';
import { observer } from 'mobx-react-lite';
import { Modal } from '../Modal';
import styles from './index.scss';
import { BUTTON_SECONDARY, BUTTON_PRIMARY } from 'content/constants';
import { Item } from 'content/stores/Item';

export interface SellModalProps {
  id: string;
  sellHandler: (...args: any[]) => void;
  closeHandler: (...args: any[]) => void;
  clearHandler: (...args: any[]) => void;
  items: Item[];
  open: boolean;
  total: number;
  multiplyModifier: number;
  priceModifier: string;
  setPriceModifier: (...args: any[]) => void;
  setMultiplyModifier: (...args: any[]) => void;
}

export const SellModal = observer(({
  id,
  sellHandler,
  closeHandler,
  clearHandler,
  items,
  open,
  total,
  multiplyModifier,
  priceModifier,
  setPriceModifier,
  setMultiplyModifier,
}: SellModalProps) => {
  const renderedItems = items.map(({ marketName, price, currency, iconUrl, itemId, setPrice }, index) => (
    <div className={styles.modal_items__entry} key={itemId}>
      <div className={styles.modal_items__entry_flex}>
        <img src={iconUrl} />
      </div>
      <div className={styles.modal_items__entry_ellipsized}>{marketName}</div>
      <div className={styles.modal_items__entry_inline_flex}>
        <input
          type="text"
          pattern="[0-9]+([\.][0-9]{1,})?"
          value={price}
          readOnly={priceModifier !== 'custom'}
          onInput={(e) => setPrice((e.target as HTMLInputElement).value)}
        />
        <div>{currency}</div>
      </div>
    </div>
  ));

  const emptyItems = (
    <div className={styles.modal_items__empty}>
      <p>{browser.i18n.getMessage('modal_items_empty')}</p>
    </div>
  );

  console.log(items.map(({ marketName, price, currency, iconUrl, itemId, setPrice }) => console.log(
    marketName, price, itemId)
  ));

  return (
    <Modal open={open} id={id} onClose={closeHandler}>
      <div className={styles.modal_sell__items}>
        {renderedItems.length ? renderedItems : emptyItems}
      </div>
      <div className={styles.modal_sell__divider}></div>
      <div className={styles.modal_sell__total}>
        <p>{browser.i18n.getMessage('modal_price_total', total)}</p>
      </div>
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
      </div>
    </Modal>
  );
});

export default SellModal;

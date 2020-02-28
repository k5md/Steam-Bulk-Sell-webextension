import React from 'react';
import { observer } from 'mobx-react-lite';
import { Modal } from '../Modal';
import styles from './index.scss';
import { BUTTON_SECONDARY, BUTTON_PRIMARY } from 'content/constants';
import { Item } from 'content/stores/Item';

export type SellModalControlsProps  = {
  sellHandler: (...args: any[]) => void;
  closeHandler: (...args: any[]) => void;
  clearHandler: (...args: any[]) => void;
  multiplyModifier: number;
  priceModifier: string;
  setPriceModifier: (...args: any[]) => void;
  setMultiplyModifier: (...args: any[]) => void;
};

export const SellModalControls: React.FC<SellModalControlsProps> = observer(({
  sellHandler,
  closeHandler,
  clearHandler,
  multiplyModifier,
  setMultiplyModifier,
  priceModifier,
  setPriceModifier,
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
        className={[BUTTON_SECONDARY, styles.modal_sell__button].join(' ')}
        onClick={clearHandler}
      />
      <input
        type="button"
        value={browser.i18n.getMessage('modal_button_close')}
        className={[BUTTON_SECONDARY, styles.modal_sell__button].join(' ')}
        onClick={closeHandler}
      />
      <input
        type="button"
        value={browser.i18n.getMessage('modal_button_sell')}
        className={[BUTTON_PRIMARY, styles.modal_sell__button].join(' ')}
        onClick={sellHandler}
      />
    </div>
  </div>
));


export type SellModalItemProps = {
  item: Partial<Item>;
  priceModifier: string;
};

export const SellModalItem: React.FC<SellModalItemProps> = observer(({
  item: {
    marketName,
    price,
    currency,
    iconUrl,
    itemId,
    setPrice,
  },
  priceModifier,
}) => (
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
        onInput={(e: React.ChangeEvent<HTMLInputElement>): void => setPrice(e.target.value)}
      />
      <div>{currency}</div>
    </div>
  </div>
));


export type SellModalItemsListProps = {
  items: Item[];
  total: number;
  priceModifier: string;
};

export const SellModalItemsList: React.FC<SellModalItemsListProps> = observer(({
  items,
  total,
  priceModifier,
}) => {
  const renderedItems = items.map(item => <SellModalItem item={item} priceModifier={priceModifier}/>);

  const emptyItems = (
    <div className={styles.modal_items__empty}>
      <p>{browser.i18n.getMessage('modal_items_empty')}</p>
    </div>
  );

  return (
    <React.Fragment>
      <div className={styles.modal_sell__items}>
        {renderedItems.length ? renderedItems : emptyItems}
      </div>
      <div className={styles.modal_sell__divider}></div>
      <div className={styles.modal_sell__total}>
        <p>{browser.i18n.getMessage('modal_price_total', total)}</p>
      </div>
    </React.Fragment>
  );
});


export type SellModalProps = SellModalControlsProps & SellModalItemsListProps & {
  id: string;
  open: boolean;
}

export const SellModal: React.FC<SellModalProps> = observer(({
  id,
  sellHandler,
  closeHandler,
  clearHandler,
  open,
  multiplyModifier,
  setMultiplyModifier,
  priceModifier,
  setPriceModifier,
  items,
  total,
}) => (
    <Modal open={open} id={id} onClose={closeHandler}>
      <div className={styles.modal_inner}>
        <SellModalItemsList items={items} total={total} priceModifier={priceModifier} />
        <SellModalControls
          sellHandler={sellHandler}
          closeHandler={closeHandler}
          clearHandler={clearHandler}
          multiplyModifier={multiplyModifier}
          setMultiplyModifier={setMultiplyModifier}
          priceModifier={priceModifier}
          setPriceModifier={setPriceModifier}
        />
      </div>
    </Modal>
));

export default SellModal;

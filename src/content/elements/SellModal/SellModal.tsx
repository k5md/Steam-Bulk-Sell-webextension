import React from 'react';
import { Modal } from '../Modal';
import styles from './index.scss';
import { BUTTON_SECONDARY, BUTTON_PRIMARY } from 'content/constants';

export const SellModal = ({
  id,
  sellHandler,
  closeHandler,
  clearHandler,
  items,
  open,
  handlePriceModifierChange,
  percentageModifier,
  priceModifier,
  handlePercentageModifierChange,
  makeHandlePriceChange,
}) => {
  const renderedItems = items.map(({ marketName, priceValue, priceCurrency, src, cacheKey }, index) => (
    <div className={styles.modal_items__entry} key={cacheKey}>
      <div className={styles.modal_items__entry_flex}>
        <img src={src} />
      </div>
      <div className={styles.modal_items__entry_ellipsized}>{marketName}</div>
      <div className={styles.modal_items__entry_inline_flex}>
        <input
          type="text"
          pattern="[0-9]+([\.][0-9]{1,})?"
          value={priceValue}
          readOnly={priceModifier !== 'custom'}
          onInput={makeHandlePriceChange(index)}
        />
        <div>{priceCurrency}</div>
      </div>
    </div>
  ));

  const emptyItems = (
    <div className={styles.modal_items__empty}>
      <p>{browser.i18n.getMessage('modal_items_empty')}</p>
    </div>
  );

  const total = items.reduce((acc, cur) => acc + parseFloat(cur.priceValue), 0)

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
              onChange={handlePriceModifierChange}
              checked={priceModifier === 'median'}
            />
          </div>
          <div>
            <label>{browser.i18n.getMessage('modal_price_modifier_percentage')}</label>
            <input
              type="radio"
              name="priceModifier"
              value="percentage"
              onChange={handlePriceModifierChange}
              checked={priceModifier === 'percentage'}
            />
            <input
              type="text"
              pattern="[-|+][0-9]{1,3}"
              size={4}
              maxLength={4}
              value={percentageModifier}
              onInput={handlePercentageModifierChange}
              className={styles.modal_sell__percentage_number}
            />
          </div>
          <div>
            <label>{browser.i18n.getMessage('modal_price_modifier_custom')}</label>
            <input
              type="radio"
              name="priceModifier"
              value="custom"
              onChange={handlePriceModifierChange}
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
            onClick={() => sellHandler(items)}
          />
        </div>
      </div>
    </Modal>
  );
};
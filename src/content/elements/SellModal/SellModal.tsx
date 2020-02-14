import React, { useState, useEffect } from 'react';
import { Modal } from '../Modal';
import styles from './index.scss';
import { BUTTON_SECONDARY, BUTTON_PRIMARY } from 'content/constants';
import { ICON_URL } from 'content/API';

export const SellModal = ({
  id,
  sellHandler,
  closeHandler,
  clearHandler,
  items,
  open,
}) => {
  const [ derivativeItems, setDerivativeItems ] = useState(items);

  useEffect(() => {
    setDerivativeItems(items);
  }, [ items ]);
  // const replaced = e.target.value.replace('.', ',');
  // if (Number.isNaN(parseFloat(replaced))) e.target.value = 0;

  const [ total, setTotal ] = useState(0);

  useEffect(() => {
    setTotal(derivativeItems.reduce((acc, cur) => acc + parseFloat(cur.priceValue), 0));
  }, [ derivativeItems ]);
  

  const makeHandlePriceChange = targetIndex => e => setDerivativeItems(
    derivativeItems.map((item, itemIndex) => itemIndex !== targetIndex ? item : { ...item, price: e.target.value })
  );

  const [ priceModifier, setPriceModifier ] = useState('median');
  const handlePriceModifierChange = e => setPriceModifier(e.target.value);

  const [ percentageModifier, setPercentageModifier ] = useState('+0');
  const percentageModifierNumber = Number.isNaN(parseFloat(percentageModifier)) ? 0 : parseFloat(percentageModifier);
  const handlePercentageModifierChange = e => setPercentageModifier(e.target.value);

  const renderedItems = derivativeItems.map(({ iconUrl, marketName, priceValue, priceCurrency }, index) => {
    const width = '96f';
    const height = '96f';
    const src = `${ICON_URL}/${iconUrl}/${width}x${height}`;

    const price = parseFloat(priceValue);
    const verifiedPrice = Number.isNaN(price) ? 0 : price;
    const modifiedPrice = priceModifier === 'percentage'
      ? verifiedPrice + verifiedPrice * percentageModifierNumber / 100
      : verifiedPrice
    const renderedPrice = modifiedPrice > 0 ? modifiedPrice : 0;
    
    return (
      <div className={styles.modal_items__entry}>
        <div className={styles.modal_items__entry_flex}>
          <img src={src} />
        </div>
        <div className={styles.modal_items__entry_ellipsized}>{marketName}</div>
        <div className={styles.modal_items__entry_inline_flex}>
          <input
            type="text"
            pattern="[0-9]+([\.][0-9]{1,})?"
            value={renderedPrice}
            readOnly={priceModifier !== 'custom'}
            onInput={makeHandlePriceChange(index)}
          />
          <div>{priceCurrency}</div>
        </div>
      </div>
    );
  });

  const emptyItems = (
    <div className={styles.modal_items__empty}>
      {browser.i18n.getMessage('modal_items_empty')}
    </div>
  );

  return (
    <Modal open={open} id={id} onClose={closeHandler}>
      <div className={styles.modal_sell__items}>
        {renderedItems.length ? renderedItems : emptyItems}  
      </div>
      <div className={styles.modal_sell__divider}></div>
      <div className={styles.modal_sell__total}>
        <p>{total}</p>
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
            onClick={() => sellHandler(derivativeItems)}
          />
        </div>
      </div>
    </Modal>
  );
};

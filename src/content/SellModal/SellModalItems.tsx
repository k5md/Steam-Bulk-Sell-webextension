import React from 'react';
import * as styles from './index.css';
import { ICON_URL } from '../API';

export const SellModalItems = ({
  onSell,
  onClose,
  onClear,
  items,
  total = '0',
}) => {
  const renderedItems = items.map(({ iconUrl, marketName, price }) => {
    const [ priceNumber, priceCurrency ] = price.split(' ');
    const width = '96f';
    const height = '96f';
    const src = `${ICON_URL}/${iconUrl}/${width}x${height}`;
    
    return (
      <div className={styles.modal_items__entry}>
        <div style={{ display: 'flex', }}>
          <img src={src} />
        </div>
        <div style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
          {marketName}
        </div>
        <div style={{ display: 'inline-flex', }}>
          <input
            type="text"
            pattern="[0-9]+([\.,][0-9]{1,})?"
            value={priceNumber}
            readOnly
            onInput={() => { this.sellablesContainer.innerHTML = ''; this.mountSellables(this.sellablesContainer); }}
          />
          <div>
            {priceCurrency}
          </div>
        </div>
      </div>
    );
  });

  const emptyItems = (
    <div className={styles.modal_items__empty}>
      {browser.i18n.getMessage('modal_items_empty')}
    </div>
  );

  /*const hasCommas = sellables.map(s => s.querySelector('input[type="text"]')).some(price => (price as HTMLInputElement).value.includes(','));
  total.textContent = hasCommas ? String(totalPrice).replace('.', ',') : String(totalPrice);*/
  const totalPrice = (
    <div className={styles.modal_items__total}>
      {items.reduce((acc, cur) => {
        const input = cur.querySelector('input[type="text"]');
        const price = parseFloat((input as HTMLInputElement).value.replace(',', '.'));
        return acc + price;
      }, 0)}
  </div>   
  );

  return (
    <div className={styles.modal_sell__items}>
      {renderedItems.length ? renderedItems : emptyItems}
      <div className={styles.modal_sell__divider}></div>
      {totalPrice}  
    </div>
  );
};

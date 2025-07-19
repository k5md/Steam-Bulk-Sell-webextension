import React from 'react';
import { observer } from 'mobx-react-lite';
import { Item } from 'content/stores/Item';
import { SellModalItem } from './SellModalItem';
import styles from './index.scss';

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
  const renderedItems = (
    <table className={styles.modal_items}>
      <thead>
        <tr>
          <th>{browser.i18n.getMessage('modal_items_card')}</th>
          <th className={styles.modal_items__entry_ellipsized}>{browser.i18n.getMessage('modal_items_market_name')}</th>
          <th>{browser.i18n.getMessage('modal_items_low_bp_price')}</th>
          <th>{browser.i18n.getMessage('modal_items_median_bp_price')}</th>
          <th>{browser.i18n.getMessage('modal_items_buyer_pays')}</th>
          <th>{browser.i18n.getMessage('modal_items_you_receive')}</th>
        </tr>
      </thead>
      {items.map(item => <SellModalItem item={item} priceModifier={priceModifier}/>)}
    </table>
  );

  const emptyItems = (
    <div className={styles.modal_items__empty}>
      <p>{browser.i18n.getMessage('modal_items_empty')}</p>
    </div>
  );

  return (
    <React.Fragment>
      <div className={styles.modal_sell__items}>
        {items.length ? renderedItems : emptyItems}
      </div>
      <div className={styles.modal_sell__divider}></div>
      <div className={styles.modal_sell__total}>
        <p>{browser.i18n.getMessage('modal_price_total', total)}</p>
      </div>
    </React.Fragment>
  );
});

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

import React from 'react';
import { observer } from 'mobx-react-lite';
import { Item } from 'content/stores/Item';
import { LoadingIndicator } from '../';
import styles from './index.scss';

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
    priceFetched,
    error,
    steamMarketLowPrice,
    steamMarketMidPrice,
  },
  priceModifier,
}) => {
  const renderedPrices = error ? error : (priceFetched
    ? <React.Fragment>
        <div className={styles.modal_items__entry_price}>{steamMarketLowPrice}</div>
        <div className={styles.modal_items__entry_price}>{steamMarketMidPrice}</div>

        <input
          type="text"
          pattern="[0-9]+([\.][0-9]{1,})?"
          size={8}
          value={price}
          disabled={priceModifier !== 'custom'}
          onInput={(e: React.ChangeEvent<HTMLInputElement>): void => setPrice(e.target.value)}
          title={browser.i18n.getMessage('modal_price_tooltip')}
        />
        &nbsp;
        <div>{currency}</div>
      </React.Fragment>
    : <LoadingIndicator
        indicator="https://steamcommunity-a.akamaihd.net/public/images/login/throbber.gif"
        text={browser.i18n.getMessage('modal_price_loading')}
      />
  );

  return (
    <div className={styles.modal_items__entry} key={itemId}>
      <div className={styles.modal_items__entry_flex}>
        <img src={iconUrl} />
      </div>
      <div className={styles.modal_items__entry_ellipsized}>{marketName}</div>
      <div className={styles.modal_items__entry_inline_flex}>
        {renderedPrices}
      </div>
    </div>
  );
});

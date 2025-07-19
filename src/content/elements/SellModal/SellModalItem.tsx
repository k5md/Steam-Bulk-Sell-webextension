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
    youReceivePrice,
  },
  priceModifier,
}) => {
  const renderedPrices = error
    ? <td>{error}</td>
    : (priceFetched
      ? <React.Fragment>
          <td className={styles.modal_items__entry_price}>{steamMarketLowPrice}</td>
          <td className={styles.modal_items__entry_price}>{steamMarketMidPrice}</td>
          <td>
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
            {currency}
          </td>
          <td>
            {youReceivePrice}
            &nbsp;
            {currency}
          </td>
        </React.Fragment>
      : <td>
          <LoadingIndicator
            indicator="https://steamcommunity-a.akamaihd.net/public/images/login/throbber.gif"
            text={browser.i18n.getMessage('modal_price_loading')}
          />
        </td>
    );

  return (
    <tr key={itemId}>
      <td>
        <img className={styles.modal_items__entry__image} src={iconUrl} />
      </td>
      <td className={styles.modal_items__entry_ellipsized}>{marketName}</td>
      {renderedPrices}
    </tr>
  );
});

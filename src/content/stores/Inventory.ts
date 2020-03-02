import { observable, action } from 'mobx';
import { isUndefined } from 'lodash';
import { getPrice, getIconUrl, sellItem } from 'content/API';
import { getOriginalWindow, reflectAll } from 'utils';
import { Items, ItemConstructorParameter, RootStore } from './';

export class Inventory {
  @observable items: Items;
  @observable showSellModal = false;

  constructor(public rootStore: RootStore) {
    this.items = new Items(rootStore);
  }

  @action.bound async fetch(itemId: string): Promise<ItemConstructorParameter> {
    const [ appId, contextId, assetId ] = itemId.split('_');

    const pageWindow = getOriginalWindow(window);
    const {
      g_strCountryCode: countryCode,
      g_ActiveInventory: { m_rgAssets: assets},
      g_rgWalletInfo: { wallet_currency: currencyId },
    } = pageWindow;
    
    const {
      description: {
        market_hash_name: marketHashName,
        market_name: marketName,
        icon_url: iconUrl,
      },
    } = assets[assetId];

    const {
      median_price: midPrice,
      lowest_price: lowPrice,
    } = await getPrice({ countryCode, currencyId, appId, marketHashName: encodeURIComponent(marketHashName) });

    if ([ midPrice, lowPrice ].every(isUndefined)) {
      this.rootStore.logger.log({ tag: 'Error', message: '[X] Inventory price lookup failed' });
      return Promise.reject();
    }

    const price = isUndefined(midPrice) ? lowPrice : midPrice;
  
    const itemData = {
      itemId,
      appId,
      contextId,
      assetId,
      marketHashName,
      marketHashNameEncoded: encodeURIComponent(marketHashName),
      currencyId,
      marketPrice: price.split(' ')[0].replace(',', '.'),
      currency: price.split(' ')[1],
      marketName,
      iconUrl: getIconUrl(iconUrl),
    };
  
    return itemData;
  }

  @action.bound async sell(): Promise<void> {
    const pageWindow = getOriginalWindow(window);
    const { g_sessionID: sessionId, ReloadCommunityInventory } = pageWindow;
    
    
    const selling = this.items.selected.map(({ appId, contextId, assetId, price, marketHashName }) => {
      return sellItem({ appId, contextId, assetId, price: String(price * 100), sessionId })
        .then(() => this.rootStore.logger.log({ tag: 'Selling', message: `${marketHashName} with price ${price} set` }))
        .catch(() => this.rootStore.logger.log({ tag: 'Error', message: `[X] Failed to sell ${marketHashName}` }));
    });

    await reflectAll(selling);
    ReloadCommunityInventory();
  }

  @action toggleSellModal = (): void => {
    this.showSellModal = !this.showSellModal;
  }
}

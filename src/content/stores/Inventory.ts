import { observable, action } from 'mobx';
import { getPrice, getIconUrl } from 'content/API';
import { getOriginalWindow } from 'utils'; // TODO: move it from mobx store to components?
import { Items, ItemConstructorParameter, RootStore } from './';

export class Inventory {
  @observable items: Items; // contains items from inventory with which user has interacted
  @observable selling = false // show selling modal

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
      success: priceSuccess,
    } = await getPrice(countryCode, currencyId, appId, encodeURIComponent(marketHashName));

    if (!priceSuccess) {
      this.rootStore.logger.log({ tag: 'Error', message: '[X] Inventory price lookup failed' });
      return Promise.reject();
    }

    const price = midPrice ? midPrice : lowPrice ? lowPrice : '0 руб.'

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

  @action toggleSelling = (): void => {
    this.selling = !this.selling;
  }
}

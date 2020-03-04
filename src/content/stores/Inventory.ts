import { observable, action } from 'mobx';
import { isUndefined, random } from 'lodash';
import { getPrice, getIconUrl, sellItem } from 'content/API';
import { getOriginalWindow, reflectAll, timeout, DeferredRequests } from 'utils';
import { Items, ItemConstructorParameter, RootStore } from './';

export class Inventory {
  @observable items: Items;
  @observable showSellModal = false;
  requests = new DeferredRequests();

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

    /*const {
      median_price: midPrice,
      lowest_price: lowPrice,
    } = await this.requests.defer({
      request: (): Promise<any> => getPrice({ countryCode, currencyId, appId, marketHashName: encodeURIComponent(marketHashName) }),
      delay: 1000,
    })

    if ([ midPrice, lowPrice ].every(isUndefined)) {
      this.rootStore.logger.log({ tag: 'Error', message: '[X] Inventory price lookup failed' });
      return Promise.reject();
    }*/
    const lowPrice = '0', midPrice = '0';

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
    
    // NOTE: steam will almost always send some sort of response, it's either empty array or an object with
    // success field with boolean value, and some other random fields, for the sake of consistency
    // NOTE: set some timeout on requests, otherwise all of them will 'fail' except for the first one
    const delayStep = 2000; // ms
    const sellRequests = this.items.selected.map(({ appId, contextId, assetId, price, marketHashName }, index) => timeout(
      () => sellItem({ appId, contextId, assetId, price: String(price * 100), sessionId })
        .then((value) => {
          if (!value.success) throw value;
          this.rootStore.logger.log({ tag: 'Selling', message: `${marketHashName} with price ${price} set` });
          return value;
        })
        .catch((reason) => {
          this.rootStore.logger.log({ tag: 'Failed', message: `[X] Sell ${marketHashName}, reason: ${JSON.stringify(reason)}` });
          return reason;
        }),
      index * delayStep + random(0, 1000),
    ));

    await reflectAll(sellRequests);
    ReloadCommunityInventory()
  }

  @action toggleSellModal = (): void => {
    this.showSellModal = !this.showSellModal;
  }
}

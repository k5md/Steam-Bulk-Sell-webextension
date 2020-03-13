import { observable, action } from 'mobx';
import { isUndefined, random } from 'lodash';
import { getPrice, getIconUrl, sellItem, getInventory, SteamInventory, Description, Asset } from 'content/API';
import { getOriginalWindow, reflectAll, timeout, DeferredRequests } from 'utils';
import { Items, ItemConstructorParameter, RootStore } from './';



export class Inventory {
  @observable items: Items;
  @observable showSellModal = false;
  @observable selling = false;
  requests = new DeferredRequests();
  inventory: Record<string, SteamInventory> = {};
  fetchingInventory: Promise<SteamInventory> | null;

  constructor(public rootStore: RootStore) {
    this.items = new Items(rootStore);
  }

  @action.bound async getItemDescription(itemId: string): Promise<Description> {
    const [ appId, contextId, assetId ] = itemId.split('_');
    const pageWindow = getOriginalWindow(window);
    const {
      g_strCountryCode: countryCode,
      g_ActiveInventory: { m_steamid: steamId, m_cItems: itemsCount, m_rgAssets: localAssets },
    } = pageWindow;

    // NOTE: usually we just take description from global object that is populated by steam
    if (localAssets[assetId] && localAssets[assetId].description) {
      return localAssets[assetId].description;
    }
    
    // NOTE: but there are cases, when page is ready but assets are not loaded
    const cacheKey = [steamId, appId, contextId, countryCode].join('_');
    if (!Object.prototype.hasOwnProperty.call(this.inventory, cacheKey)) {
      if (!this.fetchingInventory) {
        this.fetchingInventory = this.requests.defer(
          (): Promise<any> => getInventory({ steamId, appId, contextId, countryCode, itemsCount })
        );
      }
      this.inventory[cacheKey] = await this.fetchingInventory;
      this.fetchingInventory = null;
    }
    const { assets, descriptions } = this.inventory[cacheKey];
    
    const isAsset = (item: Asset): boolean => String(item.appid) === appId && item.contextid === contextId && item.assetid === assetId;
    const { classid: classId } = assets.find(isAsset); // first we get classId from assets array
    const isDescription = (item: Description): boolean => String(item.appid) === appId  && item.classid === classId;
    const description = descriptions.find(isDescription);
    return description;
  }

  @action.bound async fetch(itemId: string): Promise<ItemConstructorParameter> {
    const [ appId, contextId, assetId ] = itemId.split('_');
    const pageWindow = getOriginalWindow(window);
    const {
      g_strCountryCode: countryCode,
      g_rgWalletInfo: { wallet_currency: currencyId },
    } = pageWindow;
    
    const {
      market_hash_name: marketHashName,
      market_name: marketName,
      icon_url: iconUrl,
    } = await this.getItemDescription(itemId);

    /*const {
      median_price: midPrice,
      lowest_price: lowPrice,
    } = await this.requests.defer((): Promise<any> => getPrice({ countryCode, currencyId, appId, marketHashName: encodeURIComponent(marketHashName) }),
      2000
    );

    console.log(this.requests, midPrice, lowPrice);

    if ([ midPrice, lowPrice ].every(isUndefined)) {
      this.rootStore.logger.log('[X] Inventory price lookup failed');
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
          this.rootStore.logger.log(`[✓] ${marketHashName}, ${price}`);
          return value;
        })
        .catch((reason) => {
          this.rootStore.logger.log(`[X] ${marketHashName}, ${JSON.stringify(reason)}`);
          return reason;
        }),
      index * delayStep + random(0, 1000),
    ));

    this.selling = true;
    await reflectAll(sellRequests);
    this.selling = false;
    ReloadCommunityInventory()
  }

  @action toggleSellModal = (): void => {
    this.showSellModal = !this.showSellModal;
  }
}

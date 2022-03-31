import { observable, action } from 'mobx';
import { isUndefined, max, ceil } from 'lodash';
import { getPrice, getIconUrl, sellItem, getInventory, SteamInventory, Description, Asset } from 'content/API';
import { getOriginalWindow, reflectAll, DeferredRequests } from 'utils';
import { Items, ItemConstructorParameter, RootStore, Item } from './';


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
      g_ActiveInventory: {
        m_steamid: steamId,
        m_cItems: itemsCount,
        m_rgAssets: localAssets,
        m_rgChildInventories: childInventories,
      },
    } = pageWindow;

    // NOTE: usually we just take description from global object that is populated by steam
    if (localAssets[assetId] && localAssets[assetId].description) {
      return localAssets[assetId].description;
    }

    // NOTE: if there are multiple context for appId, steam does not populate 
    // activeInventory.m_rgAssets, instead it populates m_rgChildInventories[contextId].m_rgAssets
    if (childInventories[contextId] && childInventories[contextId].m_rgAssets[assetId]) {
      return childInventories[contextId].m_rgAssets[assetId].description;
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
    const { g_rgWalletInfo: { wallet_currency: currencyId }} = pageWindow;
    
    const {
      market_hash_name: marketHashName,
      market_name: marketName,
      icon_url: iconUrl,
      classid: classId,
      instanceid: instanceId,
    } = await this.getItemDescription(itemId);

    const itemData = {
      itemId,
      appId,
      contextId,
      classId,
      instanceId,
      assetId,
      marketHashName,
      marketHashNameEncoded: encodeURIComponent(marketHashName),
      currencyId,
      steamMarketPrice: 0,
      steamMarketLowPrice: 0,
      steamMarketMidPrice: 0,
      currency: '',
      marketName,
      iconUrl: getIconUrl(iconUrl),
    };
  
    return itemData;
  }

  @action.bound async getItemPrice(itemId: string): Promise<Partial<Item>> {
    const [ appId ] = itemId.split('_');
    const pageWindow = getOriginalWindow(window);
    const {
      g_strCountryCode: countryCode,
      g_rgWalletInfo: { wallet_currency: currencyId },
      g_rgCurrencyData: rgCurrencyData,
      GetCurrencyCode,
      GetPriceValueAsInt,
    } = pageWindow;
    const { market_hash_name: marketHashName } = await this.getItemDescription(itemId);
    const itemParams = { countryCode, currencyId, appId, marketHashName: encodeURIComponent(marketHashName) };
    const { 
      median_price: medianPrice,
      lowest_price: lowestPrice,
    } = await this.requests.defer((): Promise<any> => getPrice(itemParams), 2000);

    if ([ medianPrice, lowestPrice ].every(isUndefined)) {
      const errorMessage = browser.i18n.getMessage('logger_inventory_price_failed');
      this.rootStore.logger.log(`[X] ${errorMessage}`);
      return Promise.reject(errorMessage);
    }

    const steamMarketLowPrice = GetPriceValueAsInt(lowestPrice) / 100;
    const steamMarketMidPrice = GetPriceValueAsInt(medianPrice) / 100;
    const steamMarketPrice = max([ steamMarketLowPrice, steamMarketMidPrice ]);

    const currencyCode = GetCurrencyCode(currencyId);

    return {
      steamMarketLowPrice,
      steamMarketMidPrice,
      steamMarketPrice,
      currency: rgCurrencyData[currencyCode].strSymbol || currencyCode,
    };
  }

  @action.bound async sell(): Promise<void> {
    const pageWindow = getOriginalWindow(window);
    const { g_sessionID: sessionId, ReloadCommunityInventory } = pageWindow;
    
    // NOTE: steam will almost always send some sort of response, it's either empty array or an object with
    // success field with boolean value, and some other random fields, for the sake of consistency
    // NOTE: set some timeout on requests, otherwise all of them will 'fail' except for the first one
    const sellRequests = this.items.selected
      .filter(item => !item.error)
      .map(({ appId, contextId, assetId, price, marketHashName }) => 
        this.requests.defer((): Promise<any> => sellItem({ appId, contextId, assetId, price: String(ceil(price * 100)), sessionId })
          .then((value) => {
            if (!value.success) throw value;
            this.rootStore.logger.log(`[✓] ${marketHashName}, ${price}`);
            return value;
          })
          .catch((reason) => {
            this.rootStore.logger.log(`[X] ${marketHashName}, ${JSON.stringify(reason)}`);
            throw reason;
          })
        , 3000)
      );

    this.selling = true;
    await reflectAll(sellRequests);
    this.selling = false;
    ReloadCommunityInventory()
  }

  @action toggleSellModal = (): void => {
    this.showSellModal = !this.showSellModal;
  }
}

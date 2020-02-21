import { observable, action, computed } from 'mobx';
import { getInventory, getPrice } from '../API';
import { getOriginalWindow } from '../../utils'; // TODO: move it from mobx store to components?

export class Inventory {
  @observable inventory = {} // holds all items in two arrays: assets and descriptions
  @observable items = {} // contains items from inventory with which user has interacted
  @observable selling = false // show selling modal
  onClearHandlers = {}

  constructor(public rootStore) {}

  @action.bound async fetchInventory(
    steamId: string,
    appId: string,
    contextId: string,
    countryCode: string,
    itemsCount: string,
  ): Promise<void> {
    const {
      assets,
      descriptions,
      success: inventorySuccess,
    } = await getInventory(steamId, appId, contextId, countryCode, itemsCount);
  
    if (!inventorySuccess) {
      this.rootStore.logger.log({ tag: 'Error', message: '[X] Inventory request failed' });
      return;
    }
  
    const cacheKey = [steamId, appId, contextId, countryCode].join('_');
    this.inventory[cacheKey] = { assets, descriptions };
  }

  @action.bound async find(itemId: string): Promise<object> {
    const [ appId, contextId, assetId ] = itemId.split('_');

    const pageWindow = getOriginalWindow(window);
    const {
      g_strCountryCode: countryCode,
      g_ActiveInventory: { m_steamid: steamId, m_cItems: itemsCount },
      g_rgWalletInfo: { wallet_currency: currencyId }
    } = pageWindow;
    
    const cacheKey = [steamId, appId, contextId, countryCode].join('_');
    if (!Object.prototype.hasOwnProperty.call(this.inventory, cacheKey)) {
      await this.fetchInventory(steamId, appId, contextId, countryCode, itemsCount);
    }
    const { assets, descriptions } = this.inventory[cacheKey];
    
    // NOTE: item.appid is not a string
    const isAsset = (item): boolean => String(item.appid) === appId
      && item.contextid === contextId
      && item.assetid === assetId;
    const { classid: classId } = assets.find(isAsset); // first we get classId from assets array

    const isDescription = (item): boolean => String(item.appid) === appId
      && item.classid === classId;
    const {
      market_hash_name: marketHashName,
      market_name: marketName,
      icon_url: iconUrl,
    } = descriptions.find(isDescription); // second we get raw marketHashName by classId
  
    const {
      median_price: price,
      success: priceSuccess,
    } = await getPrice(countryCode, currencyId, appId, encodeURIComponent(marketHashName));
    if (!priceSuccess) {
      this.rootStore.logger.log({ tag: 'Error', message: '[X] Inventory description lookup failed' });
      return Promise.reject();
    }
  
    const itemData = {
      cacheKey,
      appId,
      contextId,
      assetId,
      marketHashName: encodeURIComponent(marketHashName),
      currencyId,
      priceValue: price.split(' ')[0].replace(',', '.'),
      priceCurrency: price.split(' ')[1],
      marketName,
      iconUrl,
    };
  
    return itemData;
  }

  @action.bound async select(itemId: string, selected: boolean): Promise<void> {
    if (!Object.keys(this.items).includes(itemId)) {
      const itemData = await this.find(itemId);
      this.items[itemId] = { ...itemData };
    }
 
    this.items[itemId].selected = selected;
    this.rootStore.logger.log({ tag: 'Selected', message: JSON.stringify(this.items[itemId], null, '  ') });
  }

  @action clear = () => {
    this.items = {};
    Object.values(this.onClearHandlers).forEach((handler: Function) => handler());
  }

  @action toggleSelling = () => {
    this.selling = !this.selling;
  }

  @computed get selected() {
    return Object.values(this.items).filter((item: any) => item.selected);
  }

  @action sell = () => {}
}

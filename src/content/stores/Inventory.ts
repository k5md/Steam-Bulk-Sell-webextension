import { observable, action } from 'mobx';
import { getInventory, getPrice } from '../API';
import { getOriginalWindow } from '../../utils'; // TODO: move it from mobx store to components?
import { Items } from './Items';
import { Item, ItemConstructorParameter } from './Item';

export class Inventory {
  @observable inventory = {} // holds all items in two arrays: assets and descriptions
  @observable items: Items // contains items from inventory with which user has interacted
  @observable selling = false // show selling modal

  constructor(public rootStore) {
    this.items = new Items(rootStore);
  }

  @action.bound async fetch(itemId: string): Promise<ItemConstructorParameter> {
    const [ appId, contextId, assetId ] = itemId.split('_');

    const pageWindow = getOriginalWindow(window);
    const {
      g_strCountryCode: countryCode,
      g_ActiveInventory: { m_steamid: steamId, m_cItems: itemsCount },
      g_rgWalletInfo: { wallet_currency: currencyId }
    } = pageWindow;
    
    const cacheKey = [steamId, appId, contextId, countryCode].join('_');
    if (!Object.prototype.hasOwnProperty.call(this.inventory, cacheKey)) {
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
      itemId,
      appId,
      contextId,
      assetId,
      marketHashName: encodeURIComponent(marketHashName),
      currencyId,
      price,
      priceValue: price.split(' ')[0].replace(',', '.'),
      priceCurrency: price.split(' ')[1],
      marketName,
      iconUrl,
    };
  
    return itemData;
  }

  @action toggleSelling = () => {
    this.selling = !this.selling;
  }
}

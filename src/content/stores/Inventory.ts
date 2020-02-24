import { observable, action, toJS } from 'mobx';
import { getInventory, getPrice, getIconUrl } from '../API';
import { getOriginalWindow } from '../../utils'; // TODO: move it from mobx store to components?
import { Items } from './Items';
import { ItemConstructorParameter } from './Item';

export class Inventory {
  @observable inventory = {} // holds all items in two arrays: assets and descriptions
  @observable items; // contains items from inventory with which user has interacted
  @observable selling = false // show selling modal
  fetchingInventory = false;

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
      this.fetchingInventory = true;
      const {
        assets,
        descriptions,
        success: inventorySuccess,
      } = await getInventory(steamId, appId, contextId, countryCode, itemsCount);
      this.fetchingInventory = false;
      if (!inventorySuccess) {
        this.rootStore.logger.log({ tag: 'Error', message: '[X] Inventory request failed' });
        return Promise.reject();
      }
    
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
  
    // NOTE: backend can send malformed successful response with median_price absent
      const {
        median_price: midPrice,
        lowest_price: lowPrice,
        success: priceSuccess,
      } = await getPrice(countryCode, currencyId, appId, encodeURIComponent(marketHashName));
    if (!priceSuccess) {
      this.rootStore.logger.log({ tag: 'Error', message: '[X] Inventory description lookup failed' });
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

  @action toggleSelling = () => {
    this.selling = !this.selling;
  }
}

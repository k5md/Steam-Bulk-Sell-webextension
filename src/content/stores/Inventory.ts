import { observable, action, computed } from 'mobx';
import { getInventory, getPrice } from '../API';
import { getOriginalWindow } from '../../utils'; // TODO: move it from mobx store to components
import { store } from './';

const log = (entry) => store.logger.log(entry);

export class Inventory {
  @observable inventory = {}
  @observable items = {}
  @observable selling = false

  @action.bound async selectItem(itemId: string, selected: boolean): Promise<void> {
    const [ appId, contextId, assetId ] = itemId.split('_');

    if (!Object.keys(this.items).includes(itemId)) {
      const itemData = await this.findItem(appId, contextId, assetId);
      this.items[itemId] = { ...itemData };
    }
 
    this.items[itemId].selected = selected;
    log({ tag: 'Selected', message: JSON.stringify(this.items[itemId], null, '  ') });
  }

  @action.bound async fetchInventory(
    steamId: string | number,
    appId: string | number,
    contextId: string | number,
    countryCode: string,
    itemsCount: string | number,
  ): Promise<void> {
    const {
      assets,
      descriptions,
      success: inventorySuccess,
    } = await getInventory(steamId, appId, contextId, countryCode, itemsCount).then(response => response.json());
  
    if (!inventorySuccess) {
      log({ tag: 'Error', message: '[X] Inventory request failed' });
      return;
    }
  
    const cacheKey = [steamId, appId, contextId, countryCode].join('_');
    this.inventory[cacheKey] = { assets, descriptions };
  }

  @action.bound async findItem(appId: string, contextId: string, assetId: string): Promise<object> {
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
    const isItem = (item): boolean => String(item.appid) === appId
      && item.contextid === contextId
      && item.assetid === assetId;
    const { classid: classId } = assets.find(isItem); // first we get classId from assets array
  
    const isItemDescription = (item): boolean => String(item.appid) === appId && item.classid === classId;
    const {
      market_hash_name: marketHashName,
      market_name: marketName,
      icon_url: iconUrl,
    } = descriptions.find(isItemDescription); // second we get raw marketHashName by classId
  
    const {
      median_price: price,
      success: priceSuccess,
    } = await getPrice(countryCode, currencyId, appId, encodeURIComponent(marketHashName)).then(response => response.json());
    if (!priceSuccess) {
      log({ tag: 'Error', message: '[X] Inventory description lookup failed' });
      return;
    }
  
    const itemData = {
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

  @action clearItems = () => {
    this.items = {};
  }

  @computed get selectedItems() {
    return Object.values(this.items).filter((item: any) => item.selected);
  }

  @action sellItems = () => {}

  @action toggleSelling = () => {
    this.selling = !this.selling;
  }
}

import Controls from './Controls';
import Logger from './Logger';
import Overlay from './Overlay';
import Modal from './Modal';
import { getOriginalWindow, checkElements } from '../utils';
import { getInventory, getPrice } from './API';
import { INVENTORY_PAGE_TABS } from './constants';

class SteamBulkSell {
  constructor(
    private logger: { log: Function } = console,
    private items: object = {},
    private inventory: object = {},
  ) {}

  async fetchInventory(
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
      this.logger.log(`Inventory request failed`, 'Error');
      return;
    }

    const cacheKey = [steamId, appId, contextId, countryCode].join('_');
    this.inventory[cacheKey] = { assets, descriptions };
  }

  async findItem(appId: string, contextId: string, assetId: string): Promise<object> {
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
      this.logger.log(`Inventory description lookup failed`, 'Error');
      return;
    }

    const itemData = {
      appId,
      contextId,
      assetId,
      marketHashName: encodeURIComponent(marketHashName),
      currencyId,
      price,
      marketName,
      iconUrl,
    };

    return itemData;
  }

  sellHandler = async (): Promise<void> => {
    const sellables = Object.values(this.items).filter(item => item.selected);
    this.logger.log(JSON.stringify(sellables.map(({ marketHashName, price }) => ({ marketHashName, price })), null, 2), 'Sell');
    return Promise.resolve();
  }

  modalHandler = async (): Promise<void> => {
    const clearHandler = () => {
      this.items = {};
    };

    const closeHandler = () => {

    };

    const modal = new Modal(this.logger, Object.values(this.items), this.sellHandler, closeHandler, clearHandler);
    await modal.init();
  }

  toggleHandler = async (itemId: string, selected: boolean): Promise<void> => {
    const [ appId, contextId, assetId ] = itemId.split('_');

    if (!Object.keys(this.items).includes(itemId)) {
      const itemData = await this.findItem(appId, contextId, assetId);
      this.items[itemId] = { ...itemData };
    }
 
    this.items[itemId].selected = selected;
    this.logger.log(JSON.stringify(this.items[itemId], null, '  '));
  }

  async init(): Promise<void> {
    const logger = new Logger();
    await logger.init();
    this.logger = logger;

    const controls = new Controls(logger, this.modalHandler);
    await controls.init();

    const overlay = new Overlay(logger, this.toggleHandler);
    await overlay.init();

    checkElements(INVENTORY_PAGE_TABS).then(() => {
      const inventoryPageTabs = document.querySelectorAll(INVENTORY_PAGE_TABS);
      Array.from(inventoryPageTabs).forEach(tab => tab.addEventListener('click', () => {
        this.items = {};
      }));
    });
  }
}

const instance = new SteamBulkSell();
instance.init();

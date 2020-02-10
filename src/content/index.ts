import { ControlsLoggerWrapper } from './ControlsLoggerWrapper';
import { OverlayWrapper } from './OverlayWrapper';
import { SellModalWrapper } from './SellModalWrapper';
import { getOriginalWindow, checkElements, checkElement } from '../utils';
import { getInventory, getPrice } from './API';
import { INVENTORY_PAGE_TABS, CONTROLS_WRAPPER, MODAL_WRAPPER } from './constants';
import { observable } from "mobx";

class SteamBulkSell {
  @observable logs = []

  constructor(
    public items: object = {},
    public inventory: object = {},
    public overlay: OverlayWrapper = null,
  ) {}

  fetchInventory = async (
    steamId: string | number,
    appId: string | number,
    contextId: string | number,
    countryCode: string,
    itemsCount: string | number,
  ): Promise<void> => {
    const {
      assets,
      descriptions,
      success: inventorySuccess,
    } = await getInventory(steamId, appId, contextId, countryCode, itemsCount).then(response => response.json());
  
    if (!inventorySuccess) {
      this.logs.push({ tag: 'Error', message: '[X] Inventory request failed' });
      return;
    }
  
    const cacheKey = [steamId, appId, contextId, countryCode].join('_');
    this.inventory[cacheKey] = { assets, descriptions };
  }
  
  findItem = async (appId: string, contextId: string, assetId: string): Promise<object> => {
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
      this.logs.push({ tag: 'Error', message: '[X] Inventory description lookup failed' });
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

  modalHandler = async (): Promise<void> => {
    let container = null;

    const clearHandler = () => {
      this.items = {};
      this.overlay.reset(document.body as HTMLElement);
      this.overlay.mount(this.overlay.overlayContainer);
    };

    const closeHandler = () => {};

    const sellHandler = async () => {
      const sellables = Object
        .values(this.items)
        .filter(item => item.selected)
        .map(item => item.price.replace(',', '.'));
      this.logs.push({
        tag: 'Sell',
        message: JSON.stringify(sellables.map(({ marketHashName, price }) => ({ marketHashName, price })), null, 2),
      });
      this.overlay.reset(document.body as HTMLElement);
      this.overlay.mount(this.overlay.overlayContainer);
      return Promise.resolve();
    };

    checkElement(MODAL_WRAPPER).then((container) => {
      const modal = new SellModalWrapper(
        this.logs,
        Object.values(this.items).map(item => ({
          ...item,
          priceValue: item.price.split(' ')[0],
          priceCurrency: item.price.split(' ')[1],
        })),
        sellHandler,
        closeHandler,
        clearHandler,
        container,
      );
      modal.init();
    });    
  }

  toggleHandler = async (itemId: string, selected: boolean): Promise<void> => {
    const [ appId, contextId, assetId ] = itemId.split('_');

    if (!Object.keys(this.items).includes(itemId)) {
      const itemData = await this.findItem(appId, contextId, assetId);
      this.items[itemId] = { ...itemData };
    }
 
    this.items[itemId].selected = selected;
    this.logs.push({ tag: 'Selected', message: JSON.stringify(this.items[itemId], null, '  ') });
  }

  async init(): Promise<void> {
    const pageWindow = getOriginalWindow(window);
    const { g_bMarketAllowed: marketAllowed } = pageWindow;

    if (!marketAllowed) {
      return;
    }

    await checkElement(CONTROLS_WRAPPER).then((container) => {
      const controls = new ControlsLoggerWrapper(this.modalHandler, this.logs, container);
      controls.init();
    });

    const overlay = new OverlayWrapper(this.logs, this.toggleHandler);
    await overlay.init();
    this.overlay = overlay;

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

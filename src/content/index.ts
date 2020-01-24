import { checkElement, applyStyles, applyProperties, getOriginalWindow } from '../utils';
import { getInventory, getPrice, sellItem } from './API';
const LOG_WRAPPER = '#inventory_logos';
const ITEM_HOLDER = ':scope #inventories .inventory_page .itemHolder';


const EXTENSION_NAME = 'steambulksell';
const pageWindow = getOriginalWindow(window);


const hideAppLogo = () => {
  const appLogo: HTMLElement = document.querySelector('#inventory_applogo');
  appLogo.style.display = 'none';
  const inventoryLogos: HTMLElement = document.querySelector(LOG_WRAPPER);
  inventoryLogos.style.height = 'unset';
};

const parseItemData = (id: string) => {
  const [ app, context, asset ] = id.split('_');
  return { app, context, asset };
}



const sellItems = () => {

};

const hasSellableItems = (item: HTMLElement): boolean => item.hasChildNodes()
  && item.style.display !== 'none'
  && !item.classList.contains('disabled')
  && !item.getElementsByTagName('input').length;

const getItems = (): any => {
  const items = document.querySelectorAll(ITEM_HOLDER);
  const inventory = items.item(0).parentElement.parentElement;

  return { inventory, items };
};

class SteamBulkSell {
  logger: any;
  selectedItems: any;
  static instance;

  constructor() {
    this.logger = console;
    this.selectedItems = {};
    SteamBulkSell.instance = this;
  }

  async toggleItem(itemId: string, selected: boolean): Promise<any> {
    const itemData = parseItemData(itemId);
    const {
      g_strCountryCode: countryCode,
      g_ActiveInventory: {
        appid: appId,
        contextid: contextId,
        m_steamid: steamId,
        m_cItems: itemsCount,
      },
    } = pageWindow;

    const response = await getInventory(steamId, appId, contextId, countryCode, itemsCount).then(response => response.json());
    console.log(response);
    console.log(itemData);
    const { assets, descriptions, success } = response;

    // first we get instanceid by aseetid, contextid and appid from assets array
    const { app, context, asset } = itemData;
    // note, that appid is not a string
    const item = assets.find(item => String(item.appid) === app && item.contextid === context && item.assetid === asset);
    const { instanceid } = item;

    // second we get raw marketHashName by instanceid from descriptions
    const description = descriptions.find(item => item.instanceid === instanceid);
    const { market_hash_name: marketHashName } = description;
    const marketHashNameEscaped = encodeURIComponent(marketHashName);
    const g_strCountryCode = XPCNativeWrapper(window.wrappedJSObject.g_strCountryCode);
    const g_rgWalletInfo = XPCNativeWrapper(window.wrappedJSObject.g_rgWalletInfo);
    const { wallet_currency: currencyId } = g_rgWalletInfo;
    debugger;
    const price = await getPrice(g_strCountryCode, currencyId, app, marketHashNameEscaped).then(response => response.json());
    
    const fullItemData = { ...itemData, marketHashNameEscaped, currencyId, price };

    this.selectedItems[itemId] = selected ? fullItemData : null;
    this.logger.log(JSON.stringify(this.selectedItems, null, '  '), 'Checked items');
  }

  mount(): void {
    const createLogger = (): object => {
      const getLogWrapper = (): HTMLElement => {
        return document.querySelector(LOG_WRAPPER);
      };

      const mountLogger = (container: HTMLElement): HTMLElement => {
        const log = document.createElement('div');
        const logStyles = {
          'height': '70px',
          'overflow-y': 'scroll',
          'word-wrap': 'anywhere',
        };
        applyStyles(log, logStyles);
  
        container.appendChild(log);
        return log;
      };

      const wrapper = getLogWrapper();
      const element = mountLogger(wrapper);
      const log = (message: string, tag = 'Main'): void => {
        const entry = document.createElement('div');
        entry.innerHTML = `[${tag}]: ${message}`
        element.appendChild(entry);
        element.scrollTop = element.scrollHeight;
      };

      return { wrapper, element, log };
    };

    const mountCheckbox = (container: HTMLElement): HTMLElement => {
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.checked = false;
      checkbox.onchange = (e) => {
        const target = e.target as HTMLInputElement;
        const itemElement = target.previousSibling as HTMLElement;
        const itemId = itemElement.id;
        
        this.toggleItem(itemId, target.checked)
      };
      const checkboxStyles = {
        'position': 'absolute',
        'top': '0px',
        'zIndex': '2',
      };
      applyStyles(checkbox, checkboxStyles);

      container.appendChild(checkbox);
      return checkbox;
    };



    const mountCheckboxes = (items: Array<HTMLElement>): void => {
      Array.from(items).filter(hasSellableItems).forEach(item => mountCheckbox(item));
      this.logger.log('Checkboxes', 'Mount');
    };

    const createControls = (): any => {
      const getControlsWrapper = (): HTMLElement => {
        return document.querySelector(LOG_WRAPPER);
      };

      const mountControls = (container: HTMLElement): HTMLElement => {
        const sellButton = document.createElement('input');
        const sellButtonStyles = {
          'margin-top': '10px',
        };
        sellButton.type = 'button';
        sellButton.value = 'Sell selected items';
        sellButton.className = 'btn_darkblue_white_innerfade btn_medium new_trade_offer_btn';
        sellButton.onclick = sellItems;
        applyStyles(sellButton, sellButtonStyles);
  
        container.appendChild(sellButton);      
        return sellButton;
      };

      const wrapper = getControlsWrapper();
      const element = mountControls(wrapper);
      const sell = (): void => {};

      return { wrapper, element, sell };
    };

    checkElement(LOG_WRAPPER).then(() => {
      hideAppLogo();

      const logger = createLogger();
      this.logger = logger;
      this.logger.log('Logger', 'Mount');

      const controls = createControls();
      this.logger.log('Controls', 'Mount');
    });
    
    checkElement(ITEM_HOLDER).then(() => {
      // when at least one item holder is loaded start mounting checkboxes
      const { items } = getItems();
      mountCheckboxes(items);

      // additional itemholders are loaded asynchronously, so watch inventory container
      // and mount checkboxes on change
      // TODO: optimize this bullshit
      // TODO: refactor
      const observer = new MutationObserver(() => {
        const { items } = getItems();
        mountCheckboxes(items);
      });
      const { inventory } = getItems();

      observer.observe(inventory, { childList: true, subtree: true });
    });


  }
}

const instance = new SteamBulkSell();
instance.mount();

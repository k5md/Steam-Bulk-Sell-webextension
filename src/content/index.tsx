const applyStyles = (element: HTMLElement, styles: object): void => 
  Object.entries(styles).forEach(([property, value]) => element.style[property] = value);

function rafAsync(): Promise<any>{
  return new Promise(resolve => {

    window.requestAnimationFrame(resolve); //faster than set time out
  });
}

async function checkElement(selector: string): Promise<Element> {
  const querySelector = document.querySelector(selector);
  console.log(selector, querySelector);
  while (querySelector === null) {
      await rafAsync()
  }
  return querySelector;
}  

const LOG_WRAPPER = '#inventory_logos';
const ITEM_HOLDER = ':scope #inventories .inventory_page .itemHolder';
const INVENTORY_URL = 'https://steamcommunity.com/inventory';
const SELL_URL = 'https://steamcommunity.com/market/sellitem';
const PRICE_URL = 'https://steamcommunity.com/market/priceoverview';

interface SteamBulkSell {
  logger: any;
  selectedItems: any;
}

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

declare let XPCNativeWrapper: any;

const getInventory = (): any => {
  const g_strCountryCode = XPCNativeWrapper(window.wrappedJSObject.g_strCountryCode);
  const g_ActiveInventory =  XPCNativeWrapper(window.wrappedJSObject.g_ActiveInventory);
  const { appid, contextid, m_steamid, m_cItems } = g_ActiveInventory;
  
  const url = `${INVENTORY_URL}/${m_steamid}/${appid}/${contextid}?l=${g_strCountryCode}&count=${m_cItems}`;
  
  const requestConfig: RequestInit = {
    method: 'GET',
    // cache: 'no-cache',
    mode: 'same-origin',
    credentials: 'same-origin',
  };

  return fetch(url, requestConfig).then(response => response.json());
};

const getPrice = (country, currencyId, appId, marketHashName) => {
  const url = `${PRICE_URL}/?country=${country}&currency=${currencyId}&appid=${appId}&market_hash_name=${marketHashName}`;
  const requestConfig: RequestInit = {
    "credentials": "include",
    "mode": "cors"
  };
  return fetch(url, requestConfig).then(response => response.json());
};

class SteamBulkSell {
  constructor() {
    this.logger = console;
    this.selectedItems = {};
  }

  async toggleItem(itemId: string, selected: boolean): Promise<any> {
    const itemData = parseItemData(itemId);
    const response = await getInventory();
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
    const price = await getPrice(g_strCountryCode, currencyId, app, marketHashNameEscaped);
    
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
        'zIndex': '9000',
      };
      applyStyles(checkbox, checkboxStyles);

      container.appendChild(checkbox);
      return checkbox;
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

    const mountCheckboxes = (items: any): void => {
      Array.from(items).filter(hasSellableItems).forEach((item: any) => {
        this.logger.log('Checkboxes', 'Mount');
        mountCheckbox(item);
      });
    };

    const createControls = (): any => {
      const getControlsWrapper = (): HTMLElement => {
        return document.querySelector(LOG_WRAPPER);
      };





      const sellItem = (item: any) => {
        const { appid, contextid, assetid, price } = item;
        const g_sessionID = XPCNativeWrapper(window.wrappedJSObject.g_sessionID);

        const requestData = {
          sessionid: g_sessionID,
          appid,
          contextid,
          assetid,
          amount: 1,
          price,
        };
        const requestConfig: RequestInit = {
          method: 'POST',
          cache: 'no-cache',
          mode: 'cors',
          body: JSON.stringify(requestData),
        };
        fetch(SELL_URL, requestConfig)
          .then((response) => response.json())
          .then((data) => {
            console.log('Success:', data);
          })
          .catch((error) => {
            console.error('Error:', error);
          });
      };

      const sellItems = () => {

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

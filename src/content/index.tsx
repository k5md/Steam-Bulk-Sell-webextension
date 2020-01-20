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

interface SteamBulkSell {
  logger: any;
}

class SteamBulkSell {
  constructor() {
    this.logger = console;
  }

  mount(): void {
    const createLogger = (): object => {
      const getLogWrapper = (): HTMLElement => {
        return document.querySelector(LOG_WRAPPER);
      };

      const mountLogger = (container: HTMLElement): HTMLElement => {
        const log = document.createElement('div');
        const logStyles = {
          'margin-left': '241px',
          'height': '69px',
          'top': '-73px',
          'position': 'relative',
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

    checkElement(LOG_WRAPPER).then(() => {
      const logger = createLogger();
      this.logger = logger;
      this.logger.log('Logger', 'Mount');
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

import { ControlsWrapper } from './ControlsWrapper';
import { OverlayWrapper } from './OverlayWrapper';
import { ModalWrapper } from './ModalWrapper';
import { getOriginalWindow, checkElements, checkElement } from '../utils';
import { getInventory, getPrice } from './API';
import { INVENTORY_PAGE_TABS, CONTROLS_WRAPPER } from './constants';

class SteamBulkSell {
  constructor(
    private logs = [],
    private items: object = {},
    private inventory: object = {},
    private overlay: Overlay = null,
  ) {}

  modalHandler = async (): Promise<void> => {
    const clearHandler = () => {
      this.items = {};
      this.overlay.reset(document.body as HTMLElement);
      this.overlay.mount(this.overlay.overlayContainer);
    };

    const closeHandler = () => {

    };

    const sellHandler = async (): Promise<void> => {
      const sellables = Object.values(this.items).filter(item => item.selected);
      this.logger.log(JSON.stringify(sellables.map(({ marketHashName, price }) => ({ marketHashName, price })), null, 2), 'Sell');
      this.overlay.reset(document.body as HTMLElement);
      this.overlay.mount(this.overlay.overlayContainer);
      return Promise.resolve();
    };

    const modal = new Modal(this.logger, Object.values(this.items), sellHandler, closeHandler, clearHandler);
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
    const pageWindow = getOriginalWindow(window);
    const { g_bMarketAllowed: marketAllowed } = pageWindow;

    if (!marketAllowed) {
      return;
    }

    await checkElement(CONTROLS_WRAPPER).then(() => {
      const container = document.querySelector(CONTROLS_WRAPPER) as HTMLElement;
      const logger = new ControlsWrapper(this.sellHandler, this.logs, container);
    });


    const overlay = new Overlay(logger, this.toggleHandler);
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

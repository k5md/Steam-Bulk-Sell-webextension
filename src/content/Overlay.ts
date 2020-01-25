import { uniqueId } from 'lodash';
import { applyStyles, checkElement } from '../utils';

const EXTENSION_NAME = 'steambulksell';
const INVENTORIES_WRAPPER = ':scope #active_inventory_page #inventories';
const INVENTORY = '.inventory_ctn';
const INVENTORY_PAGE = '.inventory_page';
const ITEM_HOLDER = '.itemHolder';

export class Overlay{
  constructor(
    private logger: { log: Function } = console,
    private toggleHandler: (itemId: string, checked: boolean) => Promise<void> = (): Promise<void> => Promise.resolve(),
  ) {}

  mount(container: HTMLElement): Array<HTMLElement> { 
    const hasSellableItems = (item: HTMLElement): boolean => item.hasChildNodes()
      && item.style.display !== 'none'
      && !item.classList.contains('disabled')
      && !item.getElementsByTagName('input').length; // NOTE: <- this particular check is for already mounted checkboxes

    const mountCheckbox = (container: HTMLElement): HTMLElement => {
      const checkbox = document.createElement('input');
      checkbox.id = `${EXTENSION_NAME}-Overlay-${uniqueId()}`;
      checkbox.type = 'checkbox';
      checkbox.checked = false;
      // TODO: consider making onchange handler lighter
      checkbox.onchange = async (e): Promise<void> => {
        const target = e.target as HTMLInputElement;
        if (!target.previousSibling) {
          this.logger.log(`Previous sibling is null`, 'Error');
          return;
        }
        const itemElement = target.previousSibling as HTMLElement;
        const itemId = itemElement.id;
        await this.toggleHandler(itemId, target.checked);
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
    
    // inventory wrapper contains #inventory_steamid_appid_contextid for every app,
    // inactive of them have style.display set to none
    // each #inventory... contains .inventory_page elements, that contain item holders
    const activeInventory = container.querySelector(`${INVENTORY}:not([style*="display: none;"])`);
    const activePage = activeInventory.querySelector(`${INVENTORY_PAGE}:not([style*="display: none;"])`);
    const activeItemHolders = activePage.querySelectorAll(ITEM_HOLDER);

    const wrapped = Array.from(activeItemHolders) as Array<HTMLElement>;
    const elements = wrapped.filter(hasSellableItems).map(mountCheckbox);
    return elements;
  }

  /**
   * Removes only not visible DOM nodes created by an Overlay instance
   */
  clear(container: HTMLElement): void {
    // NOTE: there are two cases for disabled elements:
    // 1. #inventory_steamid_appid_contextid with style.display set to none
    // 2. .inventory_page with style.display set to none
    // IMPORTANT: INACTIVE (display: none) inventories CAN have ACTIVE pages!
    const inactiveInventories = Array.from(container.querySelectorAll(`${INVENTORY}[style*="display: none;"]`));
    const activeInventory = container.querySelector(`${INVENTORY}:not([style*="display: none;"])`);
    const inactivePages = Array.from(activeInventory.querySelectorAll(`${INVENTORY_PAGE}[style*="display: none;"]`));
    const checkboxes = [ ...inactiveInventories, ...inactivePages ]
      .map(inventory => inventory.querySelectorAll(`[id^=${EXTENSION_NAME}-Overlay]`))
      .filter(item => item.length)
      .reduce((acc, cur) => [ ...acc, ...Array.from(cur) ], []);

    checkboxes.forEach(checkbox => {
      if (!container || !container.contains(checkbox)) {
        this.logger.log('Can not clear checkbox', 'Error');
        throw new Error();
      }
      checkbox.parentNode.removeChild(checkbox);
    });
  }

  /**
   * Removes all DOM nodes created by an Overlay instance
   */
  reset(container: HTMLElement): void {
    const elements = container.querySelectorAll(`[id^=${EXTENSION_NAME}-Overlay]`);
    elements.forEach(element => container.removeChild(element));
  }

  async init(): Promise<void> {
    await checkElement(INVENTORIES_WRAPPER).then(() => {
      // when at least one item holder is loaded start mounting checkboxes
      const container = document.querySelector(INVENTORIES_WRAPPER) as HTMLElement;
      this.logger.log('Mounting overlay...');
      this.reset(container);
      this.mount(container);
      this.logger.log('Mounted overlay');
    });

    await checkElement(INVENTORIES_WRAPPER).then(() => {
      // additional itemholders are loaded asynchronously, watch inventory container,
      // mount checkboxes on change, unmount not visible ones
      // BUG: mutationobserver doesnt observe style changes, so when pages are loaded, but their visibility
      // changes, inactive checkboxes do not unmounted AND new checkboxes are not mounted
      const container = document.querySelector(INVENTORIES_WRAPPER) as HTMLElement;
      const observer = new MutationObserver(() => {
        this.clear(container)
        this.mount(container);
      });     
      observer.observe(container, { childList: true, subtree: true });
    });
  }
}

export default Overlay;

import { uniqueId, debounce } from 'lodash';
import { applyStyles, checkElement, checkElements } from '../../utils';
import {
  EXTENSION_NAME,
  INVENTORIES_WRAPPER,
  INVENTORY,
  INVENTORY_PAGE,
  ITEM_HOLDER,
  PREVIOUS_INVENTORY_PAGE,
  NEXT_INVENTORY_PAGE,
  INVENTORY_PAGE_TABS,
  FILTER_OPTIONS,
} from '../constants';
import { store } from '../stores';

const { inventory: { selectItem }, logger: { log } } = store;

export class OverlayWrapper {
  constructor(
    public container: HTMLElement = null,
    public fragment = null,
    public wrapper = null,
  ) {}

  hasSellableItems = (item: HTMLElement): boolean => {
    return item.hasChildNodes()
      && item.style.display !== 'none'
      && !item.classList.contains('disabled')
      && !item.getElementsByTagName('input').length; // NOTE: <- this particular check is for already mounted checkboxes
  }

  mountCheckbox = (container: HTMLElement): HTMLElement => {
    const checkbox = document.createElement('input');
    checkbox.id = `${EXTENSION_NAME}-Overlay-${uniqueId()}`;
    checkbox.type = 'checkbox';
    checkbox.checked = false;
    // TODO: consider making onchange handler lighter

    checkbox.onchange = async (e): Promise<void> => {
      const target = e.target as HTMLInputElement;
      if (!target.previousSibling) {
        log({ tag: 'Error', message: '[X] Previous sibling is null' });
        return;
      }
      const itemElement = target.previousSibling as HTMLElement;
      const itemId = itemElement.id;
      await selectItem(itemId, target.checked);
    };
    const checkboxStyles = {
      'position': 'absolute',
      'top': '0px',
      'zIndex': '2',
    };
    applyStyles(checkbox, checkboxStyles);

    container.appendChild(checkbox);
    return checkbox;
  }

  mount = (): Array<HTMLElement> => { 
    //TODO: make use of pages in g_ActiveInventory, since it would allow for filtering sellable/not sellable items
    // inventory wrapper contains #inventory_steamid_appid_contextid for every app,
    // inactive of them have style.display set to none
    // each #inventory... contains .inventory_page elements, that contain item holders
    const activeInventory = this.container.querySelector(`${INVENTORY}:not([style*="display: none;"])`);
    const activePage = activeInventory.querySelector(`${INVENTORY_PAGE}:not([style*="display: none;"])`);
    const activeItemHolders = activePage.querySelectorAll(ITEM_HOLDER);

    const wrapped = Array.from(activeItemHolders) as Array<HTMLElement>;
    const elements = wrapped.filter(this.hasSellableItems).map(this.mountCheckbox);

    return elements;
  }

  /**
   * Removes only not visible DOM nodes created by an Overlay instance
   */
  clear = (): void => { 
    // NOTE: there are two cases for disabled elements:
    // 1. #inventory_steamid_appid_contextid with style.display set to none
    // 2. .inventory_page with style.display set to none
    // IMPORTANT: INACTIVE (display: none) inventories CAN have ACTIVE pages!
    const inactiveInventories = Array.from(this.container.querySelectorAll(`${INVENTORY}[style*="display: none;"]`));
    const activeInventory = this.container.querySelector(`${INVENTORY}:not([style*="display: none;"])`);
    const inactivePages = Array.from(activeInventory.querySelectorAll(`${INVENTORY_PAGE}[style*="display: none;"]`));
    const checkboxes = [ ...inactiveInventories, ...inactivePages ]
      .map(inventory => inventory.querySelectorAll(`[id^=${EXTENSION_NAME}-Overlay]`))
      .filter(item => item.length)
      .reduce((acc, cur) => [ ...acc, ...Array.from(cur) ], []);

    checkboxes.forEach(checkbox => {
      if (!this.container || !this.container.contains(checkbox)) {
        log({ tag: 'Error', message: '[X] Can not clear checkbox' });
        throw new Error();
      }
      checkbox.parentNode.removeChild(checkbox);
    });
  }

  /**
   * Removes all DOM nodes created by an Overlay instance
   */
  reset = (): void => { 
    const elements = this.container.querySelectorAll(`[id^=${EXTENSION_NAME}-Overlay]`);
    Array.from(elements).forEach(element => element.parentElement.removeChild(element));
  }

  render = (): void => {
    this.clear();
    this.mount();
    log({ tag: 'Render', message: '[✓]Overlay' });
  }

  init = async (): Promise<void> => {
    const container = await checkElement(INVENTORIES_WRAPPER) as HTMLElement;
    this.container = container;
    this.render();

    const pageControls = await Promise.all([
      checkElement(PREVIOUS_INVENTORY_PAGE),
      checkElement(NEXT_INVENTORY_PAGE),
    ]);

    const inventoryPageTabs = await checkElements(INVENTORY_PAGE_TABS);

    // a click on prev/next button calls inventory(Next|Previous)Page, which is actually a call to
    // global g_ActiveInventory.nextPage function, which loads data (if not loaded) and animates the transition
    // so, either wrap this nextPage function, or observe g_ActiveInventory.m_iCurrentPage property, or just wait
    // at least 250ms for transition to complete
    const rerenderDelay = 300; // ms
    Array.from(pageControls).forEach(
      listenable => listenable.addEventListener('click', debounce(this.mount, rerenderDelay))
    );

    Array.from(inventoryPageTabs).forEach(
      tab => tab.addEventListener('click', debounce(this.render, rerenderDelay))
    );
    
    // why? because filters could make visible items from not yet loaded pages
    // why mutationobserver? because checkElements won't work because of weird way filters are created
    const filtersContainer = document.querySelector(FILTER_OPTIONS);
    const observer = new MutationObserver(() => {
      const checkboxes = filtersContainer.querySelectorAll('input[type="checkbox"');
      Array.from(checkboxes).forEach((checkbox: Element) => {
        checkbox.removeEventListener('change', this.render);
        checkbox.addEventListener('change', this.render);
      });
    });
    observer.observe(filtersContainer, {
      subtree: true,
      childList: true,
    });
  }
}

export default OverlayWrapper;

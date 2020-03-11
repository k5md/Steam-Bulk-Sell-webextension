import React from 'react';
import {
  CONTROLS_WRAPPER,
  APP_LOGO,
  INVENTORY_PAGE_TABS,
  EXTENSION_NAME,
  INVENTORIES_WRAPPER,
  ACTIVE_INVENTORY,
} from 'content/constants';
import { checkElement, checkElements, applyStyles } from 'utils';
import { BaseWrapper } from '../';
import { ControlsContainer } from 'content/elements';
import { store } from 'content/stores';

const { inventory: { items }, logger: { log } } = store;

export class ControlsWrapper extends BaseWrapper {
  constructor() {
    super();
  }

  toggleVisible = (): void => {
    // NOTE: there seems to be no actual way to allow all items selection nicely in state manager
    // without messing with the DOM. Why - check ApplyFilter method in steam's economy_v2.js
    // TODO: somehow calculate inventory tab layout (pages, number of items can be taken from steam activeinventory)
    // and actually integrate this with state manager Items. Filters are the problem.
    const container = document.querySelector(INVENTORIES_WRAPPER);
    const activeInventory = container.querySelector(ACTIVE_INVENTORY);
    const activePage = activeInventory.querySelector('.inventory_page:not([style="display: none;"])');
    const itemHolders = activePage.querySelectorAll('.itemHolder:not([style="display: none;"]):not(.disabled)');
    const checkboxes: HTMLInputElement[] = Array.from(itemHolders).map(itemHolder => itemHolder.querySelector('input[type="checkbox"'));
    const allChecked = checkboxes.every(checkbox => checkbox.checked);
    

    checkboxes.forEach((checkbox) => {
      checkbox.checked = allChecked ? false : true; 
      const event = new Event('change', { bubbles: true });
      checkbox.dispatchEvent(event);
    });
  }

  resetContainerStyles = (): void => {
    const appLogo: HTMLElement = this.container.querySelector(APP_LOGO);
    applyStyles(appLogo, { display: 'none' }); // hide application logo
    applyStyles(this.container, {
      height: 'unset', // remove fixed 69px height for wrapper a
      maxHeight: 'unset', // on mobile screens maxHeight gets limited as well
      paddingTop: '0',
    });
  }

  watchContainerStyles = (): Function => {
    const appLogo: HTMLElement = this.container.querySelector(APP_LOGO);
    const observer = new MutationObserver(this.resetContainerStyles);
    observer.observe(appLogo, { attributeFilter: ['src'] });
    return (): void => observer.disconnect();
  }

  onReset = (): void => {
    this.resetContainerStyles();
  }

  onMount = (): void => {
    this.disposers.push(this.watchContainerStyles());
  }

  init = (): void => {
    checkElement(CONTROLS_WRAPPER).then((container) => {
      this.container = container;
      this.elements = [{ element: <ControlsContainer id={`${EXTENSION_NAME}-Controls`} toggleVisible={this.toggleVisible} /> }];
      this.render();   
      log({
        tag: '✓',
        message: browser.i18n.getMessage("logger_controls_wrapper"),
      });
    });

    checkElements(INVENTORY_PAGE_TABS).then((inventoryPageTabs) => {
      Array.from(inventoryPageTabs).forEach(tab => tab.addEventListener('click', items.clear));
    });
  }
}

export default ControlsWrapper;

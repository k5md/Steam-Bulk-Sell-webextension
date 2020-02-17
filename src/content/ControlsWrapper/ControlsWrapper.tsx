import React from 'react';
import { CONTROLS_WRAPPER, APP_LOGO, INVENTORY_PAGE_TABS, } from '../constants';
import { checkElement, checkElements } from '../../utils';
import { BaseWrapper } from '../BaseWrapper';
import { ControlsContainer } from '../elements';
import { store } from '../stores';

const { inventory: { clear }, logger: { log } } = store;

export class ControlsWrapper extends BaseWrapper {
  constructor() {
    super();
  }

  resetContainerStyles = (): void => {
    const appLogo: HTMLElement = this.container.querySelector(APP_LOGO);
    appLogo.style.display = 'none'; // hide application logo

    this.container.style.height = 'unset'; // remove fixed 69px height for wrapper
    this.container.style.paddingTop = '0px';
  }

  watchContainerStyles = (): MutationObserver => {
    const appLogo: HTMLElement = this.container.querySelector(APP_LOGO);
    const observer = new MutationObserver(this.resetContainerStyles);
    observer.observe(appLogo, { attributeFilter: ['src'] });
    return observer;
  }

  init = (): void => {
    checkElement(CONTROLS_WRAPPER).then((container) => {
      this.container = container;
      this.elements.push(<ControlsContainer />);
      this.reset();
      this.resetContainerStyles();
      this.mount();
      this.disposers.push(this.watchContainerStyles());
      log({ tag: 'Init', message: '[✓] Controls' });
    });

    checkElements(INVENTORY_PAGE_TABS).then((inventoryPageTabs) => {
      Array.from(inventoryPageTabs).forEach(tab => tab.addEventListener('click', clear));
    });
  }
}

export default ControlsWrapper;

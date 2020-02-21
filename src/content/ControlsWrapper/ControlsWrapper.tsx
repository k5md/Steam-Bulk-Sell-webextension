import React from 'react';
import { CONTROLS_WRAPPER, APP_LOGO, INVENTORY_PAGE_TABS, } from '../constants';
import { checkElement, checkElements, applyStyles } from '../../utils';
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
    return () => observer.disconnect();
  }

  onReset = (): void => {
    this.resetContainerStyles();
  }

  onMount = (): void => {
    this.disposers.push(this.watchContainerStyles());
  }

  init = (): void => {
    checkElement(CONTROLS_WRAPPER).then((container: HTMLElement) => {
      this.container = container;
      this.elements = [{ element: <ControlsContainer /> }];
      this.render();   
      log({ tag: 'Init', message: '[✓] Controls' });
    });

    checkElements(INVENTORY_PAGE_TABS).then((inventoryPageTabs) => {
      Array.from(inventoryPageTabs).forEach(tab => tab.addEventListener('click', clear));
    });
  }
}

export default ControlsWrapper;

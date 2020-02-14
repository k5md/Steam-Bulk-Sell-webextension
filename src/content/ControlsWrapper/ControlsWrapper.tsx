import ReactDOM from 'react-dom';
import React from 'react';
import { CONTROLS_WRAPPER, EXTENSION_NAME, APP_LOGO, INVENTORY_PAGE_TABS, } from '../constants';
import { ControlsContainer } from '../elements';
import { store } from '../stores';
import { checkElement, checkElements } from '../../utils';
const { inventory, logger } = store;

export class ControlsWrapper {
  constructor(
    public container = null,
    public fragment = null,
    public wrapper = null,
  ) {}

  mount = () => {
    this.wrapper = (<ControlsContainer />);
    this.fragment = document.createElement('div');
    ReactDOM.render(this.wrapper, this.fragment);
    this.container.appendChild(this.fragment);
  }

  resetContainerStyles = (): void => {
    const appLogo: HTMLElement = this.container.querySelector(APP_LOGO);
    appLogo.style.display = 'none'; // hide application logo

    this.container.style.height = 'unset'; // remove fixed 69px height for wrapper
    this.container.style.paddingTop = '0px';
  }

  watchContainerStyles = (): void => {
    const appLogo: HTMLElement = this.container.querySelector(APP_LOGO);
    const observer = new MutationObserver(this.resetContainerStyles);
    observer.observe(appLogo, { attributeFilter: ['src'] });
  }

  reset = (): void => {
    const controls = this.container.querySelectorAll(`#${EXTENSION_NAME}-Controls`);
    controls.forEach(element => element.parent.removeChild(element)); // remove existing controls

    const loggers = this.container.querySelectorAll(`#${EXTENSION_NAME}-Logger`);
    loggers.forEach(element => element.parent.removeChild(element)); // remove the existing loggers

    this.resetContainerStyles();
  }

  init = (): void => {
    checkElement(CONTROLS_WRAPPER).then((container) => {
      this.container = container;
      this.reset();
      this.mount();
      this.watchContainerStyles();
    });

    checkElements(INVENTORY_PAGE_TABS).then((inventoryPageTabs) => {
      const { clearItems } = inventory;
      Array.from(inventoryPageTabs).forEach(tab => tab.addEventListener('click', clearItems));
    });
  }
}

export default ControlsWrapper;

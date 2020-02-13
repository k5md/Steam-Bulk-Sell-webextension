import ReactDOM from 'react-dom';
import React from 'react';
import { EXTENSION_NAME, MODAL_WRAPPER } from '../constants';
import { checkElement } from '../../utils';
import { SellModalContainer } from '../elements/SellModalContainer';
import { store } from '../stores';
const { inventory, logger } = store;

export class SellModalWrapper {
  constructor(
    public container = null,
    public fragment = null,
    public wrapper = null,
  ) {}

  mount = () => {
    this.wrapper = (<SellModalContainer id={`${EXTENSION_NAME}-Modal`} />);
    this.fragment = document.createDocumentFragment();
    ReactDOM.render(this.wrapper, this.fragment);
    this.container.appendChild(this.fragment);

    // remove active scroll on body
    document.body.style.overflowY = 'hidden';
  }

  resetContainerStyles = (): void => {
    document.body.style.overflowY = 'unset';
  }

  reset = (): void => {
    if (this.wrapper) ReactDOM.unmountComponentAtNode(this.wrapper);
    const modals = this.container.querySelectorAll(`[id^=${EXTENSION_NAME}-Modal]`);
    modals.forEach(element => this.container.removeChild(element)); // remove the existing loggers

    this.resetContainerStyles();
  }

  init = () => {
    checkElement(MODAL_WRAPPER).then((container) => {
      this.container = container;
      this.reset();
      this.mount();
    }); 
  }
}

export default SellModalWrapper;

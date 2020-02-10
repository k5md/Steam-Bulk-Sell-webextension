import ReactDOM from 'react-dom';
import React from 'react';
import { EXTENSION_NAME } from '../constants';
import { SellModal } from '../SellModal';

export class SellModalWrapper {
  constructor(
    public logs = [],
    public items: Array<{
      iconUrl: string;
      marketName: string;
      priceValue: string;
      priceCurrency: string;
      selected: boolean;
    }>,
    public onSell: (...args) => void = (): void => {},
    public onClose: (...args) => void = (): void => {},
    public onClear: (...args) => void = (): void => {},
    public container = null,
    public node = null,
  ) {}

  mount = (): void => {
    const items = this.items.filter(item => item.selected);
    const wrapper = (
      <SellModal
        id={`${EXTENSION_NAME}-Modal`}
        items={items}
        sellHandler={() => { this.onSell();  ReactDOM.unmountComponentAtNode(this.node); }}
        closeHandler={() => { this.onClose(); ReactDOM.unmountComponentAtNode(this.node); }}
        clearHandler={() => { this.onClear(); ReactDOM.unmountComponentAtNode(this.node); }}
      />
    );
    const fragment = document.createElement('div');

    ReactDOM.render(wrapper, fragment);
    this.node = this.container.appendChild(fragment);

    // remove active scroll on body
    document.body.style.overflowY = 'hidden';
  }

  resetContainerStyles = (): void => {
    document.body.style.overflowY = 'unset';
  }

  reset = (): void => {
    if (this.node) ReactDOM.unmountComponentAtNode(this.node);
    const modals = this.container.querySelectorAll(`[id^=${EXTENSION_NAME}-Modal]`);
    modals.forEach(element => this.container.removeChild(element)); // remove the existing loggers

    this.resetContainerStyles();
  }

  init = (): void => {
    this.reset();
    this.mount();
    this.logs.push({ tag: 'Mount', message: '[✓]Modal' });
  }
}

export default SellModalWrapper;

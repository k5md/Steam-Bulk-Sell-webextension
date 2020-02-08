import ReactDOM from 'react-dom';
import React from 'react';
import { checkElement, applyStyles } from '../../utils';
import {
  EXTENSION_NAME,
  MODAL_WRAPPER,
} from '../constants';
import { ICON_URL } from '../API';
import * as styles from './index.css';
export const Modal = ({}) => {

};

export class Modal {
  constructor(
    private logger: { log: Function } = console,
    private items: Array<{
      iconUrl: string;
      marketName: string;
      price: string;
      selected: boolean;
    }>,
    private sellHandler: (...args) => void = (): void => {},
    private closeHandler: (...args) => void = (): void => {},
    private clearHandler: (...args) => void = (): void => {},
    private clickOutsideListener = null,
    private container = null,
    private modal = null,
    private sellablesContainer = null,
    private percentageModifier = '+0',
    private total = '0',
  ) {}



  mount(container: HTMLElement): HTMLElement {
    const modal = (
      <div id={`${EXTENSION_NAME}-Modal`} className={styles.modal__container}>
  items
    .filter(item => item.selected)
      </div>
    );

    const backdrop = (
      <div
        id={`${EXTENSION_NAME}-Modal-backdrop`}
        className={styles.modal__backdrop}
        onClick={(e) => {
          const target  = e.target as Element;
          if (target === this.modal && target.closest(MODAL_WRAPPER)) {
            return;
          }
          this.reset(this.container);
          this.closeHandler();
        }}
      >
      </div>
    );

    const bodyStyles = { 'overflow-y': 'hidden' };
    applyStyles(document.body, bodyStyles);

 
    return modal;
  }

  reset(container: HTMLElement): void {
    // remove modal
    const elements = container.querySelectorAll(`[id^=${EXTENSION_NAME}-Modal]`);
    Array.from(elements).forEach(element => container.removeChild(element));
    this.modal = null;
    const bodyStyles = { 'overflow-y': 'unset' };
    applyStyles(document.body, bodyStyles);
  }

  async init(): Promise<void> {
    return checkElement(MODAL_WRAPPER).then(() => {
      const container = document.querySelector(MODAL_WRAPPER) as HTMLElement;
      this.container = container;
      this.logger.log('[?]Modal', 'Mount');
      this.reset(container);
      this.mount(container);
      this.logger.log('[✓]Modal', 'Mount');
    });
  }
}

export default Modal;



handlePriceModifier(modifier: 'median' | 'percentage' | 'custom'): void {
  switch (modifier) {
    case 'median': {
      this.sellablesContainer.innerHTML = '';
      this.mountSellables(this.sellablesContainer);
      break;
    }
    case 'percentage': {
      this.sellablesContainer.innerHTML = '';
      this.mountSellables(this.sellablesContainer);
      const prices = this.sellablesContainer.querySelectorAll('input[type="text"]');
      const modifier = parseFloat(this.percentageModifier.replace(',', '.'));
      prices.forEach((price) => {
        const value = parseFloat(price.value.replace(',', '.'));
        const hasCommas = price.value.includes(',');
        const modifiedValue = value + value * modifier / 100;
        const renderedValue = modifiedValue > 0 ? modifiedValue : 0;
        price.value = hasCommas ? String(renderedValue).replace('.', ',') : String(renderedValue);
      });
      break;
    }
    case 'custom': {
      this.sellablesContainer.innerHTML = '';
      this.mountSellables(this.sellablesContainer);
      const prices = this.sellablesContainer.querySelectorAll('input[type="text"]');
      prices.forEach((price) => {
        price.readOnly = false;
        price.oninput = (e) => {
          const replaced = e.target.value.replace('.', ',');
          if (Number.isNaN(parseFloat(replaced))) e.target.value = 0;
        };
      });
      break;
    }
  }
}


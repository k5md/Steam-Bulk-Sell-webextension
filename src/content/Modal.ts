import { checkElement, applyStyles } from '../utils';
import {
  EXTENSION_NAME,
  MODAL_WRAPPER,
} from './constants';
import { ICON_URL } from './API';

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
  ) {}

  mount(container: HTMLElement): HTMLElement {
    const modal = document.createElement('div');
    const modalStyles = {
      'position': 'fixed',
      'z-index': '9000',
      'top': '10%',
      'bottom': '10%',
      'left': '0',
      'right': '0',
      'margin': '0 25%',
      'border': '1px solid #535353',
      'background-color': '#3A3A3A',
      'display': 'flex',
      'flex-direction': 'column',
      'justify-content': 'space-between',
    };
    modal.id = `${EXTENSION_NAME}-Modal`;
    applyStyles(modal, modalStyles);

    const sellablesContainer = document.createElement('div');
    const sellablesContainerStyles = {
      'overflow-y': 'auto',
    };
    applyStyles(sellablesContainer, sellablesContainerStyles);
    
    const sellables = this.items
      .filter(item => item.selected)
      .map(item => {
        const { iconUrl, marketName, price } = item;

        const entry = document.createElement('div');
        const entryElementStyles = {
          'display': 'flex',
          'align-items': 'center',
          'justify-content': 'space-between',
          'margin': '10px',
        };
        applyStyles(entry, entryElementStyles);

        const iconElement = document.createElement('div');
        const iconImage = document.createElement('img');
        const width = '96f';
        const height = '96f';
        iconImage.src = `${ICON_URL}/${iconUrl}/${width}x${height}`;
        iconElement.appendChild(iconImage);
        const iconElementStyles = { 'display': 'flex' };
        applyStyles(iconElement, iconElementStyles);

        const nameElement = document.createElement('div');
        nameElement.textContent = marketName;
        const nameElementStyles = {};
        applyStyles(nameElement, nameElementStyles);

        const priceElement = document.createElement('div');
        priceElement.textContent = price;
        const priceElementStyles = {};
        applyStyles(priceElement, priceElementStyles);

        [ iconElement, nameElement, priceElement ].forEach(element => entry.appendChild(element));

        return entry;
      });

    if (!sellables.length) {
      const entry = document.createElement('div');
      const entryElementStyles = {
        'display': 'flex',
        'align-items': 'center',
        'justify-content': 'space-around',
      };
      applyStyles(entry, entryElementStyles);
      const emptyMessage = document.createElement('div');
      emptyMessage.textContent = browser.i18n.getMessage('modal_items_empty');
      const emptyMessageStyles = {};
      applyStyles(emptyMessage, emptyMessageStyles);
      entry.appendChild(emptyMessage);
      sellables.push(entry);
    }

    sellables.forEach(entry => sellablesContainer.appendChild(entry));


    const buttonsContainer = document.createElement('div');
    const buttonsContainerStyles = {
      'display': 'flex',
      'justify-content': 'space-evenly',
      'background-color': '#181818',
      'padding': '10px',
    };
    applyStyles(buttonsContainer, buttonsContainerStyles);

    const clearButton = document.createElement('input');
    clearButton.type = 'button';
    clearButton.value = browser.i18n.getMessage('modal_button_clear');
    clearButton.className = 'btn_grey_white_innerfade btn_medium';
    clearButton.onclick = (...args) => {
      const container = document.querySelector(MODAL_WRAPPER) as HTMLElement;
      this.reset(container);
      return this.clearHandler(...args);
    };

    const closeButton = document.createElement('input');
    closeButton.type = 'button';
    closeButton.value = browser.i18n.getMessage('modal_button_close');
    closeButton.className = 'btn_grey_white_innerfade btn_medium';
    closeButton.onclick = (...args) => {
      const container = document.querySelector(MODAL_WRAPPER) as HTMLElement;
      this.reset(container);
      return this.closeHandler(...args);
    };

    const sellButton = document.createElement('input');
    sellButton.type = 'button';
    sellButton.value = browser.i18n.getMessage('modal_button_sell');
    sellButton.className = 'btn_darkblue_white_innerfade btn_medium';
    sellButton.onclick = this.sellHandler;

    [ clearButton, closeButton, sellButton ].forEach(button => buttonsContainer.appendChild(button));

    modal.appendChild(sellablesContainer);
    modal.appendChild(buttonsContainer);
    container.appendChild(modal);

    const backdrop = document.createElement('div');
    backdrop.id = `${EXTENSION_NAME}-Modal-backdrop`;
    const backdropStyles = {
      'position': 'absolute',
      'top': '0px',
      'left': '0px',
      'right': '0px',
      'bottom': '0px',
      'background-color': '#000',
      'opacity': '50%',
      'z-index': 500,
    };
    applyStyles(backdrop, backdropStyles);
    container.appendChild(backdrop);
    this.modal = modal;

    const bodyStyles = { 'overflow-y': 'hidden' };
    applyStyles(document.body, bodyStyles);

    this.clickOutsideListener = backdrop.addEventListener('click', (e: Event) => {
      const target  = e.target as Element;
      if (target === this.modal && target.closest(MODAL_WRAPPER)) {
        console.log('inside');
        return;
      }
      console.log('outside');
      this.reset(this.container);
      this.closeHandler();
    });

    
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
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
    }>,
    private sellHandler: (...args) => void = (): void => {},
    private closeHandler: (...args) => void = (): void => {},
    private clearHandler: (...args) => void = (): void => {},
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
      'display': 'flex',
      'justify-content': 'space-around',
    };
    applyStyles(sellablesContainer, sellablesContainerStyles);
    
    this.items.forEach((item) => {
      const { iconUrl, marketName, price } = item;

      const entry = document.createElement('div');
      const entryElementStyles = { 'display': 'flex' };
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
      const nameElementStyles = { 'display': 'flex' };
      applyStyles(nameElement, nameElementStyles);

      const priceElement = document.createElement('div');
      priceElement.textContent = price;
      const priceElementStyles = { 'display': 'flex' };
      applyStyles(priceElement, priceElementStyles);

      [ iconElement, nameElement, priceElement ].forEach(element => entry.appendChild(element));
      
      sellablesContainer.appendChild(entry);
    });

    const buttonsContainer = document.createElement('div');
    const buttonsContainerStyles = {
      'display': 'flex',
      'justify-content': 'space-evenly',
      'background-color': '#181818',
    };
    applyStyles(buttonsContainer, buttonsContainerStyles);

    const clearButton = document.createElement('input');
    const clearButtonStyles = { 'margin-top': '10px' };
    clearButton.type = 'button';
    clearButton.value = browser.i18n.getMessage('modal_button_clear');
    clearButton.className = 'btn_grey_white_innerfade btn_medium';
    clearButton.onclick = (...args) => {
      const container = document.querySelector(MODAL_WRAPPER) as HTMLElement;
      this.reset(container);
      return this.clearHandler(...args);
    };
    applyStyles(clearButton, clearButtonStyles);

    const closeButton = document.createElement('input');
    const closeButtonStyles = { 'margin-top': '10px' };
    closeButton.type = 'button';
    closeButton.value = browser.i18n.getMessage('modal_button_close');
    closeButton.className = 'btn_grey_white_innerfade btn_medium';
    closeButton.onclick = (...args) => {
      const container = document.querySelector(MODAL_WRAPPER) as HTMLElement;
      this.reset(container);
      return this.closeHandler(...args);
    };
    applyStyles(closeButton, closeButtonStyles);

    const sellButton = document.createElement('input');
    const sellButtonStyles = { 'margin-top': '10px' };
    sellButton.type = 'button';
    sellButton.value = browser.i18n.getMessage('modal_button_sell');
    sellButton.className = 'btn_darkblue_white_innerfade btn_medium';
    sellButton.onclick = this.sellHandler;
    applyStyles(sellButton, sellButtonStyles);

    [ clearButton, closeButton, sellButton ].forEach(button => buttonsContainer.appendChild(button));

    modal.appendChild(sellablesContainer);
    modal.appendChild(buttonsContainer);
    container.appendChild(modal);  

    return modal;
  }

  reset(container: HTMLElement): void {
    // remove modal
    const elements = container.querySelectorAll(`#${EXTENSION_NAME}-Modal`);
    Array.from(elements).forEach(element => container.removeChild(element));
  }

  async init(): Promise<void> {
    return checkElement(MODAL_WRAPPER).then(() => {
      const container = document.querySelector(MODAL_WRAPPER) as HTMLElement;
      this.logger.log('[?]Modal', 'Mount');
      this.reset(container);
      this.mount(container);
      this.logger.log('[✓]Modal', 'Mount');
    });
  }
}

export default Modal;
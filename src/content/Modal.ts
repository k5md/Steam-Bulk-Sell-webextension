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
    private sellablesContainer = null,
    private percentageModifier = '+0',
  ) {}

  mountSellables(container: HTMLElement): Array<HTMLElement> {
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

        const priceContainer = document.createElement('div');
        const priceContainerStyles = { 'display': 'inline-flex' };
        applyStyles(priceContainer, priceContainerStyles);
        const [ priceNumber, priceCurrency ] = price.split(' ');
        const priceElement = document.createElement('input');
        priceElement.type = 'text';
        priceElement.pattern = '[0-9]+([\.,][0-9]{1,})?';
        priceElement.value = priceNumber;
        priceElement.disabled = true;
        const currencyElement = document.createElement('div');
        currencyElement.textContent = priceCurrency;
        [ priceElement, currencyElement ].forEach(element => priceContainer.appendChild(element));

        [ iconElement, nameElement, priceContainer ].forEach(element => entry.appendChild(element));

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

    sellables.forEach(entry => container.appendChild(entry));
    return sellables;
  }

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
          price.disabled = false;
          price.oninput = (e) => {
            const replaced = e.target.value.replace('.', ',');
            if (Number.isNaN(parseFloat(replaced))) e.target.value = 0;
          };
        });
        break;
      }
    }
  }

  mountControls(container: HTMLElement): Array<HTMLElement> {
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


    const priceModifiersContainer = document.createElement('div');
    const priceModfiersContainerStyles = {
      'padding': '10px',
    };
    applyStyles(priceModifiersContainer, priceModfiersContainerStyles);

    const priceModifierName = 'priceModifier';
    
    const median = document.createElement('div');
    const medianLabel = document.createElement('label');
    medianLabel.textContent = browser.i18n.getMessage('modal_price_modifier_median');
    const medianRadiobutton = document.createElement('input');
    medianRadiobutton.type = 'radio';
    medianRadiobutton.name = priceModifierName;
    medianRadiobutton.onchange = () => this.handlePriceModifier('median');
    medianRadiobutton.checked = true;
    [ medianRadiobutton, medianLabel ].forEach(element => median.appendChild(element));

    const percentage = document.createElement('div');
    const percentageLabel = document.createElement('label');
    percentageLabel.textContent = browser.i18n.getMessage('modal_price_modifier_percentage');
    const percentageRadiobutton = document.createElement('input');
    percentageRadiobutton.type = 'radio';
    percentageRadiobutton.name = priceModifierName;
    percentageRadiobutton.onchange = () => this.handlePriceModifier('percentage');
    const percentageNumber = document.createElement('input');
    percentageNumber.type = 'text';
    percentageNumber.pattern = '[-|+][0-9]{1,3}';
    percentageNumber.size = 4;
    percentageNumber.maxLength = 4;
    percentageNumber.value = this.percentageModifier;
    percentageNumber.oninput = (e) => {
      this.percentageModifier = (e.target as HTMLInputElement).value;
      this.handlePriceModifier('percentage');
    };
    const percentageNumberStyles = { 'padding-left': '10px', 'margin-left': '10px' };
    applyStyles(percentageNumber, percentageNumberStyles);
    [ percentageRadiobutton, percentageLabel, percentageNumber ].forEach(element => percentage.appendChild(element));

    const custom = document.createElement('div');
    const customLabel = document.createElement('label');
    customLabel.textContent = browser.i18n.getMessage('modal_price_modifier_custom');
    const customRadiobutton = document.createElement('input');
    customRadiobutton.type = 'radio';
    customRadiobutton.name = priceModifierName;
    customRadiobutton.onchange = () => this.handlePriceModifier('custom');
    [ customRadiobutton, customLabel ].forEach(element => custom.appendChild(element));

    [ median, percentage, custom ].forEach(element => priceModifiersContainer.appendChild(element));

    [ priceModifiersContainer, clearButton, closeButton, sellButton ].forEach(button => container.appendChild(button));
    return [ priceModifiersContainer, clearButton, closeButton, sellButton];
  }

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
    
    this.mountSellables(sellablesContainer);
    this.sellablesContainer = sellablesContainer;

    const buttonsContainer = document.createElement('div');
    const buttonsContainerStyles = {
      'display': 'flex',
      'justify-content': 'space-evenly',
      'background-color': '#181818',
      'padding': '10px',
      'align-items': 'center',
    };
    applyStyles(buttonsContainer, buttonsContainerStyles);
    this.mountControls(buttonsContainer);

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
        return;
      }
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
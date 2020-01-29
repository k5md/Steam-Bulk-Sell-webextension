import { checkElement, applyStyles } from '../utils';
import {
  EXTENSION_NAME,
  CONTROLS_WRAPPER,
} from './constants';

export class Controls {
  constructor(
    private logger: { log: Function } = console,
    private sellHandler: () => void = (): void => {},
  ) {}

  mount(container: HTMLElement): HTMLElement {
    const controls = document.createElement('div');
    controls.id = `${EXTENSION_NAME}-Controls`;

    const sellButton = document.createElement('input');
    const sellButtonStyles = {
      'margin-top': '10px',
    };
    sellButton.type = 'button';
    sellButton.value = 'Sell selected items';
    sellButton.className = 'btn_darkblue_white_innerfade btn_medium new_trade_offer_btn';
    sellButton.onclick = (): void => {
      this.sellHandler();
    };
    applyStyles(sellButton, sellButtonStyles);
  
    controls.appendChild(sellButton);
    container.appendChild(controls);      
    return sellButton;
  }

  reset(container: HTMLElement): void {
    // remove existing controls
    const elements = container.querySelectorAll(`#${EXTENSION_NAME}-Controls`);
    elements.forEach(element => container.removeChild(element));
  }

  async init(): Promise<void> {
    return checkElement(CONTROLS_WRAPPER).then(() => {
      const container = document.querySelector(CONTROLS_WRAPPER) as HTMLElement;
      this.logger.log('Mounting controls...');
      this.reset(container);
      this.mount(container);
      this.logger.log('Mounted controls');
    });
  }
}

export default Controls;

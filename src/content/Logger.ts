import { applyStyles, checkElement } from '../utils';
import {
  EXTENSION_NAME,
  LOG_WRAPPER,
  APP_LOGO,
} from './constants';

export class Logger {
  constructor(
    private element: HTMLElement = null,
  ) {}

  mount(container: HTMLElement): HTMLElement {
    const logger = document.createElement('div');
    logger.id = `${EXTENSION_NAME}-Logger`;
    const logStyles = {
      'height': '70px',
      'overflow-y': 'scroll',
      'word-wrap': 'anywhere',
    };
    applyStyles(logger, logStyles);

    container.appendChild(logger);
    this.element = logger;
    return logger;
  }

  reset(container: HTMLElement): void {
    // Hide application logo
    const appLogo: HTMLElement = container.querySelector(APP_LOGO);
    appLogo.style.display = 'none';

    // remove fixed 69px height for wrapper
    container.style.height = 'unset';

    // remove the existing logger
    const elements = container.querySelectorAll(`#${EXTENSION_NAME}-Logger`);
    elements.forEach(element => container.removeChild(element));
  }

  log(message: string, tag = 'Main'): void {
    const entry = document.createElement('div');
    entry.innerHTML = `[${tag}]: ${message}`
    this.element.appendChild(entry);
    this.element.scrollTop = this.element.scrollHeight; // automatically scroll to the bottom
  }

  async init(): Promise<void> {
    checkElement(LOG_WRAPPER).then(() => {
      const container = document.querySelector(LOG_WRAPPER) as HTMLElement;
      this.reset(container);
      this.mount(container);

      const appLogo: HTMLElement = container.querySelector(APP_LOGO);
      const observer = new MutationObserver(() => {
        this.reset(container);
        this.mount(container);
      });
      observer.observe(appLogo, { attributeFilter: ['src'] });
    });
  }
}

export default Logger;

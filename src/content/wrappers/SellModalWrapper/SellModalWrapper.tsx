import React from 'react';
import { EXTENSION_NAME, MODAL_WRAPPER } from 'content/constants';
import { checkElement } from 'utils';
import { BaseWrapper } from '../';
import { SellModalContainer } from 'content/elements';
import { store } from 'content/stores';

const { logger: { log } } = store;

export class SellModalWrapper extends BaseWrapper {
  constructor() {
    super();
  }

  init = (): void => {
    checkElement(MODAL_WRAPPER).then((container) => {
      this.container = container;
      this.elements = [{ element: <SellModalContainer id={`${EXTENSION_NAME}-Modal`} /> }];
      this.render();
      log({
        tag: '✓',
        message: browser.i18n.getMessage("logger_modal_wrapper"),
      });
    });
  }
}

export default SellModalWrapper;

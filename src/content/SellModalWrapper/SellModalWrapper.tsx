import React from 'react';
import { EXTENSION_NAME, MODAL_WRAPPER } from '../constants';
import { checkElement } from '../../utils';
import { BaseWrapper } from '../BaseWrapper';
import { SellModalContainer } from '../elements/SellModalContainer';
import { store } from '../stores';

const { logger: { log } } = store;

export class SellModalWrapper extends BaseWrapper {
  constructor() {
    super();
  }

  init = (): void => {
    checkElement(MODAL_WRAPPER).then((container: HTMLElement) => {
      this.container = container;
      this.elements = [{ element: <SellModalContainer id={`${EXTENSION_NAME}-Modal`} /> }];
      this.render();
      log({ tag: 'Init', message: '[✓] Modal wrapper' });
    });
  }
}

export default SellModalWrapper;

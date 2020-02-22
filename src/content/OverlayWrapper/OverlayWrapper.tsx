import React from 'react';
import { uniqueId } from 'lodash';
import { EXTENSION_NAME, INVENTORIES_WRAPPER } from '../constants';
import { checkElement } from '../../utils';
import { BaseWrapper } from '../BaseWrapper';
import { ItemContainer } from '../elements';
import { store } from '../stores';

const { inventory: { items }, logger: { log } } = store;

export class OverlayWrapper extends BaseWrapper {
  constructor() {
    super();
  }

  createElement = async (itemHolder): Promise<void> => {
    const { id: itemId } = itemHolder.firstChild as HTMLElement;

    if (this.elements.some((element: any) => element.id === itemId)) {
      return;
    }

    await items.create(itemId);

    const element = {
      element: <ItemContainer id={`${EXTENSION_NAME}-Overlay-${uniqueId()}`} />,
      selector: () => itemHolder,
      id: itemId,
    };

    const wrapper = this.mountElement(element);
    this.elements.push(element);
    this.wrappers.push(wrapper);
  }

  init = async (): Promise<void> => {
    checkElement(INVENTORIES_WRAPPER).then((container: HTMLElement) => {
      this.container = container;

      const addedItems = new MutationObserver(mutationsList => mutationsList
        .filter(({ addedNodes }) => addedNodes.length && (addedNodes[0] as Element).classList.contains('itemHolder'))
        .forEach(({ addedNodes }) => this.createElement(addedNodes[0]))
      );
      const addedPage = new MutationObserver(mutationsList => mutationsList
        .filter(({ addedNodes }) => addedNodes.length && (addedNodes[0] as Element).classList.contains('inventory_page'))
        .forEach(({ addedNodes }) => addedNodes[0].childNodes.forEach(this.createElement))
      );
      const changedItems = new MutationObserver(mutationsList => mutationsList
        .filter(({ target }) => (target as Element).classList.contains('item'))
        .forEach(({ target }) => this.createElement(target.parentNode))
      );
      
      [addedItems, addedPage, changedItems ].forEach((observer) => {
        observer.observe(this.container, { childList: true, subtree: true });
        this.disposers.push(() => observer.disconnect());
      });

      log({ tag: 'Init', message: '[✓] Overlay' });
    });
  }
}

export default OverlayWrapper;

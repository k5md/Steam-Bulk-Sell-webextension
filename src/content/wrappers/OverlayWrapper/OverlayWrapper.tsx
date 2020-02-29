import React from 'react';
import { uniqueId } from 'lodash';
import { EXTENSION_NAME, INVENTORIES_WRAPPER, ACTIVE_INVENTORY, ITEM_HOLDER } from 'content/constants';
import { checkElement } from 'utils';
import { BaseWrapper } from '../';
import { CheckboxContainer } from 'content/elements';
import { store } from 'content/stores';

const { inventory: { items }, logger: { log } } = store;

export class OverlayWrapper extends BaseWrapper {
  constructor() {
    super();
  }

  createElement = (itemHolder: Node): void => {
    if (!itemHolder.firstChild) return; 

    const { id: itemId } = itemHolder.firstChild as HTMLElement;
    if (this.elements.some((element) => element.id === itemId)) return;

    items.create(itemId);
    const element = {
      element: <CheckboxContainer id={`${EXTENSION_NAME}-Overlay-${uniqueId()}`} itemId={itemId} />,
      selector: (): HTMLElement => itemHolder as HTMLElement,
      id: itemId,
    };
    const wrapper = this.mountElement(element);
    this.elements.push(element);
    this.wrappers.push(wrapper);
  }

  init = async (): Promise<void> => {
    checkElement(INVENTORIES_WRAPPER).then((container) => {
      this.container = container;

      // initial rendering in case all itemHolder elements already exist (mostly for developing)
      const activeInventory = this.container.querySelector(ACTIVE_INVENTORY);
      const itemHolders = activeInventory.querySelectorAll(ITEM_HOLDER);
      itemHolders.forEach(this.createElement);
      
      // observers for added itemHolders
      const addedItems = new MutationObserver(mutationsList => mutationsList.forEach(({ addedNodes }) => {
          if (!addedNodes.length || !(addedNodes[0] as Element).classList.contains('itemHolder')) return;
          this.createElement(addedNodes[0]);
      }));
      const addedPage = new MutationObserver(mutationsList => mutationsList.forEach(({ addedNodes }) => {
        if (!addedNodes.length || !(addedNodes[0] as Element).classList.contains('inventory_page')) return;
        addedNodes[0].childNodes.forEach(this.createElement)
      }));
      const changedItems = new MutationObserver(mutationsList => mutationsList.forEach(({ target }) => {
        if (!(target as Element).classList.contains('item')) return;
        this.createElement(target.parentNode)
      }));
      
      [addedItems, addedPage, changedItems ].forEach((observer) => {
        observer.observe(this.container, { childList: true, subtree: true });
        this.disposers.push(() => observer.disconnect());
      });

      log({ tag: 'Init', message: '[✓] Overlay' });
    });
  }
}

export default OverlayWrapper;

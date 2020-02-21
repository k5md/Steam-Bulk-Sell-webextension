import React from 'react';
import ReactDOM from 'react-dom';
import { uniqueId, debounce, flatMap } from 'lodash';
import {
  EXTENSION_NAME,
  INVENTORIES_WRAPPER,
  INVENTORY,
  ACTIVE_INVENTORY,
  INVENTORY_PAGE,
  ITEM_HOLDER,
  PREVIOUS_INVENTORY_PAGE,
  NEXT_INVENTORY_PAGE,
  INVENTORY_PAGE_TABS,
  FILTER_OPTIONS,
  INVENTORY_PAGECONTROLS,
} from '../constants';
import { checkElement, checkElements } from '../../utils';
import { BaseWrapper } from '../BaseWrapper';
import { Checkbox } from '../elements';
import { store } from '../stores';

const { inventory: { select, clear }, logger: { log } } = store;

export class OverlayWrapper extends BaseWrapper {
  constructor() {
    super();
  }

  createElement = (itemHolder): void => {
    const item = itemHolder.firstChild as HTMLElement;
    const itemId = item.id;
    const clickHandler = checked => select(itemId, checked);

    if (this.elements.some((element: any) => element.id === itemId)) {
      return;
    }

    const element = {
      element: <Checkbox id={`${EXTENSION_NAME}-Overlay-${uniqueId()}`} onClick={clickHandler} />,
      selector: () => itemHolder,
      id: itemId,
    };

    const wrapper = this.mountElement(element);

    this.elements.push(element);
    this.wrappers.push(wrapper);
  }

  init = async (): Promise<void> => {
    this.container = await checkElement(INVENTORIES_WRAPPER) as HTMLElement;

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

    [ addedItems, addedPage, changedItems ].forEach(
      observer => observer.observe(this.container, { childList: true, subtree: true })
    );

    log({ tag: 'Init', message: '[✓] Overlay' });
  }
}

export default OverlayWrapper;

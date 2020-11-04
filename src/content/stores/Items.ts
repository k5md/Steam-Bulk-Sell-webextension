import { observable, computed, action } from 'mobx';
import { computedFn } from "mobx-utils";
import { identity, forOwn, floor } from 'lodash';
import { Item, RootStore } from './';

export class Items {
  constructor(public rootStore: RootStore) {}

  @observable items: { [key: string]: Item } = {}
  @observable _multiplyModifier = 0
  @observable _priceModifier = 'median'
  @observable _offsetModifier = -0.01

  @computed get selected(): Item[] {
    return Object.values(this.items).filter((item: Item) => item.selected && item.initialized);
  }

  @action clear = (): void => {
    this.items = forOwn(this.items, (value) => {
      value.selected = false;
    });
  }

  @action create(itemId: string): Item {
    const item = new Item(this.rootStore, itemId);
    this.items[itemId] = item;
    return this.items[itemId];
  }

  @computed get multiplyModifier(): number {
    return this._multiplyModifier;
  }

  @action setMultiplyModifier = (value: string): void => {
    const parsed = parseFloat(value);
    if (Number.isNaN(parsed) || parsed < -1) {
      return;
    }
    this._multiplyModifier = parsed;
    this.applyPriceModifications();
  }

  @computed get priceModifier(): string {
    return this._priceModifier;
  }

  @action.bound setPriceModifier(value: string): void {
    this._priceModifier = value;
    this.applyPriceModifications();
  }

  @computed get offsetModifier(): number {
    return this._offsetModifier;
  }

  @action.bound setOffsetModifier(value: string): void {
    const parsed = parseFloat(value);
    if (Number.isNaN(parsed) || parsed < -1) {
      return;
    }
    this._offsetModifier = parsed;
    this.applyPriceModifications();
  }

  @action.bound applyPriceModifications(): void {
    const getModifiedPrice = ({ 
      median: (item) => item.initialPrice,
      multiply: (item) => item.initialPrice * this.multiplyModifier,
      custom: (item) => item.price,
      offset: (item) => item.initialPrice + this.offsetModifier,
    })[this.priceModifier];

    this.selected.forEach((item: Item) => {
      const modifiedPrice = getModifiedPrice(item);
      const rounded = floor(modifiedPrice, 2);
      item.setPrice(rounded);
    });
  }

  @computed get total(): number {
    return floor(this.selected.reduce((acc, cur) => acc + cur.price, 0), 2);
  }
}

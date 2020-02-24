import { observable, computed, action } from 'mobx';
import { computedFn } from "mobx-utils";
import { identity } from 'lodash';
import { Item } from './Item';

export class Items {
  constructor(public rootStore) {}

  @observable items: { [key: string]: Item } = {}
  @observable _multiplyModifier = 0
  @observable _priceModifier = 'median'

  @computed get selected(): Item[] {
    return Object.values(this.items).filter((item: Item) => item.selected);
  }

  @action clear = (): void => {
    this.items = {};
  }

  @action sell = (): void => {}

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
  }

  @computed get priceModifier(): string {
    return this._priceModifier;
  }

  @action.bound setPriceModifier(value: string): void {
    this._priceModifier = value;
  }

  applyPriceModifications = computedFn((value: number): number => {
    console.log(value);
      return ({ 
      median: identity,
      multiply: value => value * this._multiplyModifier,
      custom: identity,
    })[this.priceModifier](value)
  })

  @computed get total(): number {
    return this.selected.reduce((acc, cur) => acc + cur.price, 0);
  }
}

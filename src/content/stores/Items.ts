import { observable, computed, action } from 'mobx';
import { pickBy } from 'lodash';
import { Item } from './Item';

export class Items {
  constructor(public rootStore) {}

  @observable items: { [key: string]: Item } = {}

  @computed get selected(): { [key: string]: Item } {
    return pickBy(this.items, (item: Item) => item.selected);
  }

  @action clear = () => {
    this.items = {};
  }

  @action sell = () => {}

  @action create = async (itemId: string): Promise<Item> => {
    const itemData = await this.rootStore.inventory.fetch(itemId);
    const item = new Item(itemData);
    this.items[item.itemId] = item;
    return this.items[item.itemId];
  }
}

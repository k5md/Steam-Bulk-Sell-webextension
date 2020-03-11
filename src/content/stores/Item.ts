import { observable, action, computed } from 'mobx';
import { RootStore } from './';

export type ItemConstructorParameter = {
   itemId: string;
   appId: string;
   contextId: string;
   assetId: string;
   marketHashName: string;
   marketHashNameEncoded: string;
   currencyId: string;
   marketPrice: string;
   currency: string;
   marketName: string;
   iconUrl: string;
}

export class Item implements ItemConstructorParameter{
  rootStore;

  @observable selected = false
  @observable initialized = false
  @observable priceFetched = false
  @observable _price;

  itemId: string;
  appId: string;
  contextId: string;
  assetId: string;
  marketHashName = '';
  marketHashNameEncoded: string;
  currencyId: string;
  marketPrice: string;
  currency: string;
  marketName: string;
  iconUrl: string;

  constructor(rootStore: RootStore, itemId: string) {
    const [ appId, contextId, assetId ] = itemId.split('_');
    this.itemId = itemId;
    this.appId = appId;
    this.contextId = contextId;
    this.assetId = assetId;
    this.rootStore = rootStore;
  }

  @action.bound async initialize(): Promise<void> {
    const itemData: ItemConstructorParameter = await this.rootStore.inventory.fetch(this.itemId);
    Object.assign(this, itemData);
    this.initialized = true;
  }

  @action.bound async setSelected(selected: boolean): Promise<void> {
    this.selected = selected;
    this.rootStore.logger.log({
      tag: browser.i18n.getMessage(selected ? 'logger_overlay_checked' : 'logger_overlay_unchecked'),
      message: this.marketHashName,
    });
  }

  @action.bound async toggleSelected(): Promise<void> {
    return this.setSelected(!this.selected);
  }

  @computed get price(): number {
    if (!this._price) {
      this._price = parseFloat(this.marketPrice);
    }
    const { applyPriceModifications } = this.rootStore.inventory.items;
    return applyPriceModifications(this._price);
  }

  @action setPrice = (value: string): void => {
    const parsed = parseFloat(value);

    if (Number.isNaN(parsed) || parsed < 0) {
      return;
    }
    this._price = parsed;
  }
}

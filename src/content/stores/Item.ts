import { observable, action, computed } from 'mobx';

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
  @observable selected = false
  initialized = false
  rootStore;
  @observable _price;

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

  constructor(rootStore, itemId: string) {
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
  }

  @action.bound async setSelected(selected): Promise<void> {
    if (!this.initialized) {
      await this.initialize();
      this.initialized = true;
    }
 
    this.selected = selected;
    this.rootStore.logger.log({ tag: 'Selected', message: JSON.stringify(this, null, '  ') });
  }

  @computed get price(): number {
    if (!this._price) {
      this._price = parseFloat(this.marketPrice);
    }
    const { applyPriceModifications } = this.rootStore.inventory.items;
    console.log(applyPriceModifications(this._price));
    return applyPriceModifications(this._price);
  }

  @action setPrice = (value: string) => {
    const parsed = parseFloat(value);

    if (Number.isNaN(parsed) || parsed < 0) {
      return;
    }
    this._price = parsed;
  }
}

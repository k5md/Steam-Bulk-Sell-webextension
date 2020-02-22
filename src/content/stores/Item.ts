import { observable, action } from 'mobx';

export type ItemConstructorParameter = {
   itemId: string;
   appId: string;
   contextId: string;
   assetId: string;
   marketHashName: string;
   currencyId: string;
   price: string;
   marketName: string;
   iconUrl: string;
}

export class Item implements ItemConstructorParameter{
  @observable selected = false
  @observable priceValue: string;
  @observable priceCurrency: string;

  itemId: string;
  appId: string;
  contextId: string;
  assetId: string;
  marketHashName: string;
  currencyId: string;
  price: string;
  marketName: string;
  iconUrl: string;

  constructor(initializer: ItemConstructorParameter) {
    Object.assign(this, initializer);
  }

  @action setSelected = (selected): void => {
    this.selected = selected;
  }
}


import { observable, action, computed } from 'mobx';
import { RootStore } from './';

export type ItemConstructorParameter = {
   itemId: string;
   appId: string;
   contextId: string;
   classId: string;
   instanceId: string;
   assetId: string;
   marketHashName: string;
   marketHashNameEncoded: string;
   currencyId: string;
   steamMarketLowPrice: number;
   steamMarketMidPrice: number;
   steamMarketPrice: number;
   currency: string;
   marketName: string;
   iconUrl: string;
}

export class Item implements ItemConstructorParameter{
  rootStore;

  @observable selected = false
  @observable initialized = false
  @observable priceFetched = false
  @observable _price: number;
  @observable steamMarketLowPrice = 0;
  @observable steamMarketMidPrice = 0;
  @observable steamMarketPrice = 0;
  @observable currency = '';
  @observable error = '';
  @observable youReceivePrice = 0;

  itemId: string;
  appId: string;
  contextId: string;
  classId: string;
  instanceId: string;
  assetId: string;
  marketHashName = '';
  marketHashNameEncoded: string;
  currencyId: string;

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
    const statusMessage = browser.i18n.getMessage(selected ? 'logger_overlay_checked' : 'logger_overlay_unchecked');
    this.rootStore.logger.log(`[${statusMessage}] ${this.marketHashName}`);
    if (this.priceFetched) {
      return;
    }
    this.rootStore.inventory.getItemPrice(this.itemId).then(({
      steamMarketLowPrice,
      steamMarketMidPrice,
      steamMarketPrice,
      currency,
    }) => {
      this.steamMarketLowPrice = steamMarketLowPrice;
      this.steamMarketMidPrice = steamMarketMidPrice;
      this.steamMarketPrice = steamMarketPrice;
      this.currency = currency;
      this.priceFetched = true;
      this.setPrice(this.initialPrice);
    }).catch((error) => {
      this.error = error;
    })
  }

  @action.bound async toggleSelected(): Promise<void> {
    return this.setSelected(!this.selected);
  }

  @computed get initialPrice(): number {
    return this.steamMarketPrice;
  }

  @computed get price(): number {
    return this._price;
  }

  @action setPrice = (value: string | number): void => {
    const parsed = typeof value === 'string' ? this.rootStore.inventory.fromCents(this.rootStore.inventory.parsePrice(value)) : value;
    if (Number.isNaN(parsed) || parsed < 0) {
      return;
    }
    const receive = this.rootStore.inventory.fromCents(this.rootStore.inventory.calcYouReceivePrice(Math.ceil(parsed * 100)));
    if (Number.isNaN(receive) || receive <= 0) {
      return;
    }
    this._price = parsed;
    this.youReceivePrice = receive;
  }
}

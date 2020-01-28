import Controls from './Controls';
import Logger from './Logger';
import Overlay from './Overlay';
import { getOriginalWindow } from '../utils';
import { getInventory, getPrice } from './API';

class SteamBulkSell {
  constructor(
    private logger: { log: Function } = console,
    private items: object = {},
  ) {}

  async findItem(appId: string, contextId: string, assetId: string): Promise<object> {
    const pageWindow = getOriginalWindow(window);
    const {
      g_strCountryCode: countryCode,
      g_ActiveInventory: { m_steamid: steamId, m_cItems: itemsCount },
      g_rgWalletInfo: { wallet_currency: currencyId }
    } = pageWindow;

    const {
      assets,
      descriptions,
      success: inventorySuccess,
    } = await getInventory(steamId, appId, contextId, countryCode, itemsCount).then(response => response.json());
    if (!inventorySuccess) {
      this.logger.log(`Inventory request failed`, 'Error');
      return;
    }
    // first we get instanceid by aseetid, contextid and appid from assets array
    // NOTE: item.appid is not a string
    const isItem = (item): boolean => String(item.appid) === appId
      && item.contextid === contextId
      && item.assetid === assetId;
    const item = assets.find(isItem);
    if (!item) { 
      this.logger.log(`Inventory asset lookup failed`, 'Error');
      return;
    }
    const { classid: classId } = item;

    // second we get raw marketHashName by classId from descriptions
    const description = descriptions.find(item => String(item.appid) === appId && item.classid === classId);
    if (!description) { 
      this.logger.log(`Inventory description lookup failed`, 'Error');
      return;
    }
    const { market_hash_name: marketHashName } = description;
    const {
      median_price: price,
      success: priceSuccess,
    } = await getPrice(countryCode, currencyId, appId, encodeURIComponent(marketHashName)).then(response => response.json());

    if (!priceSuccess) { 
      this.logger.log(`Inventory description lookup failed`, 'Error');
      return;
    }

    const itemData = {
      appId,
      contextId,
      assetId,
      marketHashName: encodeURIComponent(marketHashName),
      currencyId,
      price,
    };

    return itemData;
  }

  sellHandler = async (): Promise<void> => {
    this.logger.log(JSON.stringify(this.items));
    return Promise.resolve();
  }

  toggleHandler = async (itemId: string, selected: boolean): Promise<void> => {
    const [ appId, contextId, assetId ] = itemId.split('_');

    if (Object.keys(this.items).includes(itemId)) {
      this.items[itemId].selected = selected;
      this.logger.log(JSON.stringify(this.items[itemId], null, '  '), 'Deselected');
    }
 
    const itemData = await this.findItem(appId, contextId, assetId);
    this.items[itemId] = { ...itemData, selected: true };
    this.logger.log(JSON.stringify(itemData, null, '  '), 'Selected');
  }

  async init(): Promise<void> {
    const logger = new Logger();
    await logger.init();
    this.logger = logger;

    const controls = new Controls(logger, this.sellHandler);
    await controls.init();

    const overlay = new Overlay(logger, this.toggleHandler);
    await overlay.init();
  }
}

const instance = new SteamBulkSell();
instance.init();

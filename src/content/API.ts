export const INVENTORY_URL = 'https://steamcommunity.com/inventory';
export const PRICE_URL = 'https://steamcommunity.com/market/priceoverview';
export const SELL_URL = 'https://steamcommunity.com/market/sellitem';
export const ICON_URL = 'https://steamcommunity-a.akamaihd.net/economy/image';

export const getInventory = (
  steamId: string | number,
  appId: string | number,
  contextId: string | number,
  countryCode: string,
  itemsCount: string | number,
): Promise<Response> => {
  const url = `${INVENTORY_URL}/${steamId}/${appId}/${contextId}?l=${countryCode}&count=${itemsCount}`;
  const requestConfig: RequestInit = {
    method: 'GET',
    cache: 'default',
    mode: 'same-origin',
    credentials: 'same-origin',
  };
  return fetch(url, requestConfig);
};

export const getPrice = (
  countryCode: string,
  currencyId: string | number,
  appId: string | number,
  marketHashName: string,
): Promise<Response> => {
  const url = `${PRICE_URL}/?country=${countryCode}&currency=${currencyId}&appid=${appId}&market_hash_name=${marketHashName}`;
  const requestConfig: RequestInit = {
    credentials: "include",
    cache: 'no-cache',
    mode: "cors",
  };
  return fetch(url, requestConfig);
};

export const sellItem = (
  sessionId: string | number,
  appId: string | number,
  contextId: string | number,
  assetId: string | number,
  amount: string | number = 1,
  price: string | number,
): Promise<Response> => {
  const requestData = {
    sessionid: sessionId,
    appid: appId,
    contextid: contextId,
    assetid: assetId,
    amount,
    price,
  };
  const requestConfig: RequestInit = {
    method: 'POST',
    cache: 'no-cache',
    mode: 'cors',
    body: JSON.stringify(requestData),
  };
  return fetch(SELL_URL, requestConfig);
};

export const fetchInventory = async (
  steamId: string | number,
  appId: string | number,
  contextId: string | number,
  countryCode: string,
  itemsCount: string | number,
): Promise<void> => {
  const {
    assets,
    descriptions,
    success: inventorySuccess,
  } = await getInventory(steamId, appId, contextId, countryCode, itemsCount).then(response => response.json());

  if (!inventorySuccess) {
    this.logger.log(`Inventory request failed`, 'Error');
    return;
  }

  const cacheKey = [steamId, appId, contextId, countryCode].join('_');
  this.inventory[cacheKey] = { assets, descriptions };
}

export const findItem = async (appId: string, contextId: string, assetId: string): Promise<object> => {
  const pageWindow = getOriginalWindow(window);
  const {
    g_strCountryCode: countryCode,
    g_ActiveInventory: { m_steamid: steamId, m_cItems: itemsCount },
    g_rgWalletInfo: { wallet_currency: currencyId }
  } = pageWindow;
  
  const cacheKey = [steamId, appId, contextId, countryCode].join('_');
  if (!Object.prototype.hasOwnProperty.call(this.inventory, cacheKey)) {
    await this.fetchInventory(steamId, appId, contextId, countryCode, itemsCount);
  }
  const { assets, descriptions } = this.inventory[cacheKey];
  
  // NOTE: item.appid is not a string
  const isItem = (item): boolean => String(item.appid) === appId
    && item.contextid === contextId
    && item.assetid === assetId;
  const { classid: classId } = assets.find(isItem); // first we get classId from assets array

  const isItemDescription = (item): boolean => String(item.appid) === appId && item.classid === classId;
  const {
    market_hash_name: marketHashName,
    market_name: marketName,
    icon_url: iconUrl,
  } = descriptions.find(isItemDescription); // second we get raw marketHashName by classId

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
    marketName,
    iconUrl,
  };

  return itemData;
}
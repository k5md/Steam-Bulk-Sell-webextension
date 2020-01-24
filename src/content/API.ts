const INVENTORY_URL = 'https://steamcommunity.com/inventory';
const PRICE_URL = 'https://steamcommunity.com/market/priceoverview';
const SELL_URL = 'https://steamcommunity.com/market/sellitem';

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
    "credentials": "include",
    "mode": "cors",
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
  return fetch(SELL_URL, requestConfig)
};
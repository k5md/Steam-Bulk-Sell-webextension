/* eslint-disable @typescript-eslint/camelcase */
export const INVENTORY_URL = 'https://steamcommunity.com/inventory';
export const PRICE_URL = 'https://steamcommunity.com/market/priceoverview';
export const SELL_URL = 'https://steamcommunity.com/market/sellitem';
export const ICON_URL = 'https://steamcommunity-a.akamaihd.net/economy/image';

export const getInventory = (
  steamId: string,
  appId: string,
  contextId: string,
  countryCode: string,
  itemsCount: string,
): Promise<Response> => {
  const path = [ INVENTORY_URL, steamId, appId, contextId ].join('/');
  const search = new URLSearchParams({
    l: countryCode,
    count: itemsCount,
  });
  const url = `${path}/?${search}`;
  console.log(url)
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
  currencyId: string,
  appId: string,
  marketHashName: string,
): Promise<Response> => {
  // NOTE: do not use urlsearchparams here since it escapes markethashname yielding incorrect string
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

export const getIconUrl = (relativeIconUrl, width = '96f', height = '96f') =>
  `${ICON_URL}/${relativeIconUrl}/${width}x${height}`;

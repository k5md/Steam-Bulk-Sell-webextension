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
): Promise<Record<string, any>> => {
  const path = [ INVENTORY_URL, steamId, appId, contextId ].join('/');
  const search = new URLSearchParams({
    l: countryCode,
    count: itemsCount,
  });
  const url = `${path}/?${search}`;
  const requestConfig: RequestInit = {
    method: 'GET',
    cache: 'default',
    mode: 'same-origin',
    credentials: 'same-origin',
  };
  return fetch(url, requestConfig).then(response => response.json());
};

export const getPrice = (
  countryCode: string,
  currencyId: string,
  appId: string,
  marketHashName: string,
): Promise<Record<string, any>> => {
  // NOTE: do not use urlsearchparams here since it escapes markethashname yielding incorrect string
  const url = `${PRICE_URL}/?country=${countryCode}&currency=${currencyId}&appid=${appId}&market_hash_name=${marketHashName}`;
  const requestConfig: RequestInit = {
    credentials: "include",
    cache: 'no-cache',
    mode: "cors",
  };
  return fetch(url, requestConfig).then(response => response.json());
};

export const sellItem = (
  sessionId: string,
  appId: string,
  contextId: string,
  assetId: string,
  price: string,
  amount = '1',
): Promise<Record<string, any>> => {
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
  return fetch(SELL_URL, requestConfig).then(response => response.json());
};

export const getIconUrl = (
  relativeIconUrl: string,
  width = '96f',
  height = '96f',
): string => `${ICON_URL}/${relativeIconUrl}/${width}x${height}`;

export const INVENTORY_URL = 'https://steamcommunity.com/inventory';
export const PRICE_URL = 'https://steamcommunity.com/market/priceoverview';
export const SELL_URL = 'https://steamcommunity.com/market/sellitem';
export const ICON_URL = 'https://steamcommunity-a.akamaihd.net/economy/image';

export type APIRequestParams = {
  steamId: string;
  appId: string;
  contextId: string;
  countryCode: string;
  itemsCount: string;
  currencyId: string;
  marketHashName: string;
  sessionId: string;
  assetId: string;
  price: string;
  amount: string;
}

export const getInventory = ({
  steamId,
  appId,
  contextId,
  countryCode,
  itemsCount,
}: Partial<APIRequestParams>): Promise<Record<string, any>> => {
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

export const getPrice = ({
  countryCode,
  currencyId,
  appId,
  marketHashName,
}: Partial<APIRequestParams>): Promise<Record<string, any>> => {
  // NOTE: do not use urlsearchparams here since it escapes markethashname yielding incorrect string
  const url = `${PRICE_URL}/?country=${countryCode}&currency=${currencyId}&appid=${appId}&market_hash_name=${marketHashName}`;
  const requestConfig: RequestInit = {
    credentials: "include",
    cache: 'no-cache',
    mode: "cors",
  };
  return fetch(url, requestConfig).then(response => response.json());
};

// NOTE: nice following naming conventions, use all lowercase in request
export const sellItem = ({
  sessionId: sessionid,
  appId: appid, contextId:
  contextid,
  assetId: assetid,
  amount = '1',
  price,
}: Partial<APIRequestParams>): Promise<Record<string, any>> => {
  const requestData = new FormData();
  Object.entries({
    sessionid,
    appid,
    contextid,
    assetid,
    amount,
    price,
  }).forEach(([key, value]) =>  requestData.append(key, value));
  const requestConfig: RequestInit = {
    method: 'POST',
    cache: 'no-cache',
    mode: 'cors',
    credentials: 'include',
    body: requestData,
    referrer: window.location.href,
  };
  
  return fetch(SELL_URL, requestConfig).then(response => response.json());
};

export const getIconUrl = (
  relativeIconUrl: string,
  width = '96f',
  height = '96f',
): string => `${ICON_URL}/${relativeIconUrl}/${width}x${height}`;

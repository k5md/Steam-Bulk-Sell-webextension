import { SELL_ITEM } from '../background/constants';

export const INVENTORY_URL = 'https://steamcommunity.com/inventory';
export const PRICE_URL = 'https://steamcommunity.com/market/priceoverview';
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

export type Description = {
  market_hash_name: string;
  market_name: string;
  icon_url: string;
  appid: string;
  classid: string;
  instanceid: string;
}

export type Asset = {
  appid: number;
  assetid: string;
  contextid: string;
  classid: string;
}

export interface SteamInventory {
  descriptions: Array<Description>;
  assets: Array<Asset>;
}

export const getInventory = ({
  steamId,
  appId,
  contextId,
  countryCode,
  itemsCount,
}: Partial<APIRequestParams>): Promise<SteamInventory> => {
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

export const sellItem = (params: Partial<APIRequestParams>): Promise<Record<string, any>> => browser.runtime.sendMessage({
  ...params,
  referrer: window.location.href,
  contentScriptQuery: SELL_ITEM,
});

export const getIconUrl = (
  relativeIconUrl: string,
  width = '96f',
  height = '96f',
): string => `${ICON_URL}/${relativeIconUrl}/${width}x${height}`;

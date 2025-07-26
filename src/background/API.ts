import { withContextualIdentityCookies } from "utils";

export const SELL_URL = 'https://steamcommunity.com/market/sellitem';

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
  referrer: string;
}

// NOTE: nice following naming conventions steam, we have to use all lowercase in request
export const sellItem = async ({
  sessionId,
  appId,
  contextId,
  assetId,
  amount = '1',
  price,
  referrer,
}: Partial<APIRequestParams>, sender): Promise<Record<string, any>> => {
  const requestData = new FormData();
  Object.entries({
    sessionid: sessionId,
    appid: appId,
    contextid: contextId,
    assetid: assetId,
    amount,
    price,
  }).forEach(([key, value]) =>  requestData.append(key, value));
  const requestConfig: RequestInit = {
    method: 'POST',
    cache: 'no-cache',
    mode: 'cors',
    credentials: 'include',
    body: requestData,
    referrer,
    referrerPolicy: "no-referrer-when-downgrade",
  };
  return withContextualIdentityCookies(SELL_URL, requestConfig, { sender }, fetch).then(response => response.json());
};

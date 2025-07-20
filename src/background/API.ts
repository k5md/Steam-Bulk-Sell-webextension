import { SELL_ITEM } from "./constants";

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

const setCorrectContextualIdentityCookies = (details) => {
  const targetHeader = details.requestHeaders.find(({ name }) => name === 'setCorrectContextualIdentityCookies');
  if (targetHeader) {
    const requestHeaders = details.requestHeaders
      .filter((header) => header.name !== 'setCorrectContextualIdentityCookies')
      .filter((header) => header.name.toLowerCase() !== 'cookie')
      .concat({
          name: 'Cookie',
          value: targetHeader.value,
      });
    return { requestHeaders };
  }
  return {};
};

// NOTE: nice following naming conventions, use all lowercase in request
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
  if (browser.contextualIdentities !== undefined) {
    const cookies = await browser.cookies.getAll({ storeId: sender.tab.cookieStoreId, url: sender.origin });
    const cookiesHeader = cookies.map(({ name, value }) => `${name}=${value}`).join('; ');
    const requestConfig: RequestInit = {
      headers: {
        setCorrectContextualIdentityCookies: cookiesHeader,
      },
      method: 'POST',
      cache: 'no-cache',
      mode: 'cors',
      credentials: 'omit',
      body: requestData,
      referrer,
      referrerPolicy: "no-referrer-when-downgrade",
    };
    if (!browser.webRequest.onBeforeSendHeaders.hasListener(setCorrectContextualIdentityCookies)) {
      browser.webRequest.onBeforeSendHeaders.addListener(
        setCorrectContextualIdentityCookies,
        { urls: [ SELL_URL ] },
        ['blocking', 'requestHeaders'],
      );
    }
    return fetch(SELL_URL, requestConfig).then(response => response.json());
  }
  const requestConfig: RequestInit = {
    method: 'POST',
    cache: 'no-cache',
    mode: 'cors',
    credentials: 'include',
    body: requestData,
    referrer,
    referrerPolicy: "no-referrer-when-downgrade",
  };
  return fetch(SELL_URL, requestConfig).then(response => response.json());
};
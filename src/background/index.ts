import { sellItem } from './API';
import { SELL_ITEM } from './constants';

const routes = {
  [SELL_ITEM]: sellItem,
};

const router = (request): Promise<Record<string, any>> | boolean => {
  const { contentScriptQuery } = request;
  const route = routes[contentScriptQuery];
  if (!route) {
    return false;
  }
  return route(request);
};

if (!browser.runtime.onMessage.hasListener(router)) browser.runtime.onMessage.addListener(router);

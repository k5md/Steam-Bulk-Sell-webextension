import React from 'react';
import {
  RootStore,
  Logger,
  Inventory,
  Items,
  Item,
  storesContext,
} from 'content/stores';

export const useStores = (): RootStore => React.useContext(storesContext);
export const useLogger = (): Logger => useStores().logger;
export const useInventory = (): Inventory => useStores().inventory;
export const useItems = (): Items => useStores().inventory.items as Items;
export const useItem = (itemId: string): Item => (useStores().inventory.items as Items).items[itemId];

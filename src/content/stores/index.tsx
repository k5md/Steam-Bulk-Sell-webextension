import React from 'react';
import { RootStore } from './RootStore';

export const store = new RootStore();
export const storesContext = React.createContext(store);

export const useStores = () => React.useContext(storesContext);
export const useLogger = () => useStores().logger;
export const useInventory = () => useStores().inventory;
export const useItems = () => useInventory().items;
export const useItem = (itemId: string) => useItems().items[itemId];

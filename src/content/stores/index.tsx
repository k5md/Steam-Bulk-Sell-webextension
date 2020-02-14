import React from 'react';
import { Logger } from './Logger';
import { Inventory } from './Inventory';

export const store = {
	logger: new Logger(),
	inventory: new Inventory(),
};

export const storesContext = React.createContext(store);
export const useStores = () => React.useContext(storesContext)

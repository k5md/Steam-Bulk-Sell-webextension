import React from 'react';
import { useLocalStore, useObserver } from 'mobx-react-lite';
import { Logger } from './Logger';
import { Inventory } from './Inventory';

export const createStore = () => {
  const logger = new Logger();
  const inventory = new Inventory();

	return { logger, inventory };
};

export const storeContext = React.createContext(null);
export const store = createStore();

export const StoreProvider = ({ children }) => {
	return (
		<storeContext.Provider value={store}>
			{children}
		</storeContext.Provider>
	);
};

export const useStoreData = <Selection, ContextData, Store>(
	context: React.Context<ContextData>,
	storeSelector: (contextData: ContextData) => Store,
	dataSelector: (store: Store) => Selection) => {
	const value = React.useContext(context);
	if (!value) {
		throw new Error();
	}
	const store = storeSelector(value);
	return useObserver(() => {
		return dataSelector(store);
	});
};

export const useLogger = (context) => useStoreData(
	context,
	(store: any) => store.logger,
	logger => logger,
);

export const useInventory = (context) => useStoreData(
	context,
	(store: any) => store.inventory,
	inventory => inventory,
);

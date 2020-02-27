import React from 'react';
import { RootStore } from './';

export const store = new RootStore();
export const storesContext = React.createContext(store);


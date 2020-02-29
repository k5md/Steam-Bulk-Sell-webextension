import { Logger } from './Logger';
import { Inventory } from './Inventory';

export interface RootStore {
	logger: Logger;
	inventory: Inventory;
}

export class RootStore {
	constructor() {
			this.logger = new Logger(this);
			this.inventory = new Inventory(this);
	}
}

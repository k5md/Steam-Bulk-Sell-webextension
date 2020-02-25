import { observable, action } from 'mobx';
import { uniqueId } from 'lodash';
import { EXTENSION_NAME } from '../constants';
import { RootStore } from './';

export interface LoggerEntry {
  message: string;
  tag?: string;
  id?: string;
}

export class Logger {
  @observable logs: LoggerEntry[] = []

  constructor(public rootStore: RootStore) {}

  @action log = (entry: LoggerEntry): void => {
    this.logs.push({ ...entry, id: uniqueId(`${EXTENSION_NAME}-Logger-`)});
  }
}

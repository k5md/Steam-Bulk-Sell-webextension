import { observable, action } from 'mobx';
import { uniqueId } from 'lodash';
import { EXTENSION_NAME } from '../constants';

export class Logger {
  @observable logs = []

  constructor(public rootStore) {}

  @action log = (entry) => {
    this.logs.push({ ...entry, id: uniqueId(`${EXTENSION_NAME}-Logger-`)});
  }
}

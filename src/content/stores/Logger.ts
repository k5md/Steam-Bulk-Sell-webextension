import { observable, action } from 'mobx';
import { uniqueId } from 'lodash';

export class Logger {
  @observable logs = []

  constructor(public rootStore) {}

  @action log = (entry) => {
    this.logs.push({ ...entry, id: uniqueId()});
  }
}

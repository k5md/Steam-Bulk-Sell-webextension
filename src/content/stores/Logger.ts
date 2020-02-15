import { observable, action } from 'mobx';
import { uniqueId } from 'lodash';

export class Logger {
  @observable logs = []

  @action log = (entry) => {
    this.logs.push({ ...entry, id: uniqueId()});
  }
}

import { observable, action } from 'mobx'

export class Logger {
  @observable logs = []

  @action log(entry) {
    this.logs.push(entry);
  }
}

import ReactDOM from 'react-dom';
import React from 'react';
import { EXTENSION_NAME, APP_LOGO } from '../constants';
import { Controls } from '../Controls';
import { Logger } from '../Logger';

export class ControlsLoggerWrapper {
  constructor(
    public sellHandler: () => void = (): void => {},
    public logs = [],
    public container = null,
  ) {}

  mount = (): void => {
    const wrapper = (
      <React.Fragment>
        <Logger id={`${EXTENSION_NAME}-Logger`} logs={this.logs} />
        <Controls id={`${EXTENSION_NAME}-Controls`} sellHandler={this.sellHandler} />
      </React.Fragment>
    );
    const fragment = document.createElement('div');

    ReactDOM.render(wrapper, fragment);
    this.container.appendChild(fragment);
  }

  resetContainerStyles = (): void => {
    const appLogo: HTMLElement = this.container.querySelector(APP_LOGO);
    appLogo.style.display = 'none'; // hide application logo

    this.container.style.height = 'unset'; // remove fixed 69px height for wrapper
  }

  watchContainerStyles = (): void => {
    const appLogo: HTMLElement = this.container.querySelector(APP_LOGO);
    const observer = new MutationObserver(this.resetContainerStyles);
    observer.observe(appLogo, { attributeFilter: ['src'] });
  }

  reset = (): void => {
    const controls = this.container.querySelectorAll(`#${EXTENSION_NAME}-Controls`);
    controls.forEach(element => this.container.removeChild(element)); // remove existing controls

    const loggers = this.container.querySelectorAll(`#${EXTENSION_NAME}-Logger`);
    loggers.forEach(element => this.container.removeChild(element)); // remove the existing loggers

    this.resetContainerStyles();
  }

  init = (): void => {
    this.reset();
    this.mount();
    this.watchContainerStyles();
    this.logs.push({ tag: 'Mount', message: '[✓]Controls'});
  }
}

export default ControlsLoggerWrapper;

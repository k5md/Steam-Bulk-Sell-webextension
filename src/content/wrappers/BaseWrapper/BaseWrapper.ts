import ReactDOM from 'react-dom';
import { identity } from 'lodash';

export interface WrapperElement {
  element: JSX.Element;
  selector?(...args): HTMLElement;
  id?: string;
}

export class BaseWrapper {
  constructor(
    public container: HTMLElement = null,
    public elements: WrapperElement[] = [],
    public wrappers: HTMLElement[] = [],
    public disposers: Function[] = [],
  ) {}

  public mountElement({ element, selector = identity }: WrapperElement): HTMLElement {
    const wrapper = document.createElement('div');
    const target = selector(this.container);
    if (!target) {
      return null;
    } 
    ReactDOM.render(element, wrapper);
    return target.appendChild(wrapper);
  }

  public mount(): void {
    this.wrappers = this.elements.map(element => this.mountElement(element)).filter(wrapper => wrapper);
  }

  public onMount(): void {}
 
  public reset(): void {
    this.wrappers.forEach((wrapper) => {
      ReactDOM.unmountComponentAtNode(wrapper);
      wrapper.parentNode.removeChild(wrapper);
    });
    this.disposers.forEach(disposer => disposer());
    this.wrappers = [];
    this.disposers = [];
  }

  public onReset(): void {}

  public render(): void {
    this.reset();
    this.onReset();
    this.mount();
    this.onMount();
  }
}

export default BaseWrapper;

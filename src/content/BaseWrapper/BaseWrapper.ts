import ReactDOM from 'react-dom';

export class BaseWrapper {
  constructor(
    public container = null,
    public elements = [],
    public wrappers = [],
    public disposers = [],
  ) {}

  public mount(): void {
    this.wrappers = this.elements.map((element) => {
      const wrapper = document.createElement('div');
      ReactDOM.render(element, wrapper);
      this.container.appendChild(wrapper);
    });
  }
 
  public reset(): void {
    this.wrappers.forEach((wrapper) => {
      ReactDOM.unmountComponentAtNode(wrapper);
      this.container.removeChild(wrapper);
    });
    this.disposers.forEach(disposer => disposer());
  }
}

export default BaseWrapper;
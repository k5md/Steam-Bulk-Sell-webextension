import { cloneDeep } from 'lodash';

export const applyProperties = (element: object, properties: object): void =>
  Object.entries(properties).forEach(([property, value]) => element[property] = cloneDeep(value));

export const applyStyles = (element: HTMLElement, styles: object): void => applyProperties(element.style, styles);

export const requestAnimationFrameAsync = (): Promise<number> => new Promise(resolve => window.requestAnimationFrame(resolve));

export const checkElement = async (selector: string): Promise<Element> => {
  const querySelector = document.querySelector(selector);
  while (querySelector === null) await requestAnimationFrameAsync();
  return querySelector;
};

export const checkElements = async (selector: string): Promise<Array<Element>> => {
  const querySelectorAll = document.querySelectorAll(selector);
  while (!querySelectorAll.length) await requestAnimationFrameAsync();
  return Array.from(querySelectorAll);
};

// To access page global variables from content script we need to get not xrayed window and
// Wrap requested properties in native wrapper for safety's sake
export const getOriginalWindow = (window: Window): any => new Proxy(window.wrappedJSObject, {
  get: function(target, property: string | number | symbol): any {
    const defined = property in target;
    if (!defined) throw new Error(`${String(property)} is not defined on ${target}`);
    return XPCNativeWrapper(target[property]);
  }
});
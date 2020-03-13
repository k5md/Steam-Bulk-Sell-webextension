import { cloneDeep, uniqueId } from 'lodash';

export const applyProperties = (element: object, properties: object): void =>
  Object.entries(properties).forEach(([property, value]) => element[property] = cloneDeep(value));

export const applyStyles = (element: HTMLElement, styles: object): void => applyProperties(element.style, styles);

export const requestAnimationFrameAsync = (): Promise<number> => new Promise(resolve => window.requestAnimationFrame(resolve));

export const checkElement = async (selector: string): Promise<HTMLElement> => {
  const querySelector = document.querySelector(selector);
  while (querySelector === null) await requestAnimationFrameAsync();
  return querySelector as HTMLElement;
};

export const checkElements = async (selector: string): Promise<HTMLElement[]> => {
  const querySelectorAll = document.querySelectorAll(selector);
  while (!querySelectorAll.length) await requestAnimationFrameAsync();
  return Array.from(querySelectorAll) as HTMLElement[];
};

// To access page global variables from content script we need to get not x-rayed window and
// Wrap requested properties in native wrapper for safety's sake
export const getOriginalWindow = (window: Window): any => new Proxy(window.wrappedJSObject, {
  get: function(target, property: string | number | symbol): any {
    const defined = property in target;
    if (!defined) throw new Error(`${String(property)} is not defined on ${target}`);
    return XPCNativeWrapper(target[property]);
  }
});

export type reflectStatus = 'resolved' | 'rejected';

// Always-resolving promise wrapper
export const reflect = <T>(promise: Promise<T>): Promise<{res: T; status: reflectStatus}> => promise
  .then((res) => ({ res, status: 'resolved' as reflectStatus }))
  .catch((res) => ({ res, status: 'rejected' as reflectStatus }));

// Always-resolving wrapper that converts array of promises to promise that resolves to array
export const reflectAll = <T>(promises: Promise<T>[]): Promise<{res: T; status: reflectStatus}[]>=> {
  const reflected = promises.map(reflect);
  const settled = Promise.all(reflected);
  return settled;
}

// Promise timeout
export const timeout = <T>(f: () => Promise<T>, delay: number): Promise<T> => {
  return new Promise((resolve) => setTimeout(() => resolve(f()), delay));
};

// Promise reject only after n retries
export const retry = <T>(f: () => Promise<T>, retries: number): Promise<T> => {
  return f().catch(err => retries <= 0 ? Promise.reject(err) : retry(f, retries - 1));
}

// Allows to send requests with a timeout after the latest request has been sent,
// Supports retry on reject
export class DeferredRequests {
  constructor(
    private requests = {},
  ) {}

  defer<T>(request: <T>() => Promise<T>, delay = 1000, retries = 3): Promise<T> {
    console.log(this.requests);
    const id = uniqueId();
    const queueLength = Object.keys(this.requests).length
    const timedOut = () => timeout<T>(request, delay * queueLength);
    const execution = retry<T>(timedOut, retries)
      .finally(() => {
        delete this.requests[id];
      });
    
    this.requests[id] = execution;
    return execution;
  }
}
